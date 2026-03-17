import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateCompany, useGetSubscription, useCreateCheckout } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Building, Palette, Sparkles, CreditCard, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function Settings() {
  const { company, user } = useAuth();
  const companyId = company?.id as number;
  const { toast } = useToast();

  const { data: sub } = useGetSubscription(companyId, { query: { enabled: !!companyId }});

  const updateCompanyMutation = useUpdateCompany({
    mutation: {
      onSuccess: () => toast({ title: "Paramètres mis à jour" })
    }
  });

  const checkoutMutation = useCreateCheckout({
    mutation: {
      onSuccess: (res) => window.location.href = res.url
    }
  });

  const form = useForm({
    defaultValues: {
      name: company?.name || "",
      address: company?.address || "",
      sector: company?.sector || "",
      defaultTone: company?.defaultTone || "professionnel",
      primaryColor: company?.primaryColor || "#1E40AF",
      secondaryColor: company?.secondaryColor || "#059669", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "", apifyDatasetUrl: company?.apifyDatasetUrl || "",
    }
  });

  const onSubmit = (values: any) => {
    updateCompanyMutation.mutate({ companyId, data: values });
  };

  const handleSubscribe = (plan: 'starter' | 'pro' | 'agency') => {
    checkoutMutation.mutate({ companyId, data: { plan, billingPeriod: 'monthly' }});
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">Gérez les préférences de votre entreprise et votre abonnement.</p>
      </div>

      <div className="grid gap-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="w-5 h-5 text-muted-foreground" />
                Informations de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Nom de l'entreprise</label>
                  <Input {...form.register("name")} className="rounded-xl bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Secteur d'activité</label>
                  <Input {...form.register("sector")} className="rounded-xl bg-background" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold">URL Apify Dataset</label>
                  <Input {...form.register("apifyDatasetUrl")} className="rounded-xl bg-
                background" placeholder="https://api.apify.com/v2/datasets/..." />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                Personnalisation IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ton par défaut pour les réponses</label>
                <Select 
                  value={form.watch("defaultTone")} 
                  onValueChange={(v) => form.setValue("defaultTone", v as any)}
                >
                  <SelectTrigger className="rounded-xl bg-background w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="chaleureux">Chaleureux</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateCompanyMutation.isPending} className="rounded-xl shadow-lg">
            Enregistrer les modifications
          </Button>
        </form>

        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-primary" />
              Abonnement
            </CardTitle>
            <CardDescription>Gérez votre facturation et votre plan.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-8 p-4 bg-muted/30 rounded-xl border border-border/50">
              <div>
                <p className="font-semibold">Plan actuel: <span className="uppercase text-primary">{sub?.plan || 'Aucun'}</span></p>
                <p className="text-sm text-muted-foreground">Statut: {sub?.status}</p>
              </div>
              {sub?.status === 'active' && (
                <Button variant="outline" className="rounded-xl">Gérer sur Stripe</Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'starter', name: 'Starter', price: '29€', features: ['Jusqu\'à 50 avis/mois', 'Réponses IA standards'] },
                { id: 'pro', name: 'Pro', price: '79€', features: ['Avis illimités', 'Modèles personnalisés', 'Publication auto'] },
                { id: 'agency', name: 'Agency', price: '199€', features: ['Multi-comptes', 'Marque blanche', 'Support dédié'] },
              ].map(plan => (
                <div key={plan.id} className={`p-6 rounded-2xl border ${sub?.plan === plan.id ? 'border-primary shadow-md bg-primary/5' : 'border-border/50 bg-card'} relative`}>
                  {sub?.plan === plan.id && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">ACTUEL</div>}
                  <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                  <div className="my-4"><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted-foreground">/mois</span></div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, i) => <li key={i} className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> {f}</li>)}
                  </ul>
                  <Button 
                    variant={sub?.plan === plan.id ? "outline" : "default"} 
                    className="w-full rounded-xl"
                    disabled={sub?.plan === plan.id || checkoutMutation.isPending}
                    onClick={() => handleSubscribe(plan.id as any)}
                  >
                    {sub?.plan === plan.id ? 'Plan actuel' : 'S\'abonner'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
