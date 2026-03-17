import React from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sparkles, Mail, Lock, User as UserIcon, Building, ArrowRight } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir 8 caractères"),
  companyName: z.string().optional(),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { register, isRegistering, user, isLoading } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", companyName: "" },
  });

  React.useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  function onSubmit(values: z.infer<typeof registerSchema>) {
    register(values);
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="hidden lg:flex flex-1 relative bg-muted overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`}
          alt="AvisAuto background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
              Rejoignez <span className="text-secondary">AvisAuto</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Automatisez la gestion de vos avis en quelques minutes.
            </p>
          </div>

          <div className="bg-card border border-border/50 shadow-2xl shadow-black/5 rounded-3xl p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Jean Dupont" className="pl-10 h-12 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email professionnel</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="vous@entreprise.fr" className="pl-10 h-12 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise (Optionnel)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Ma Super Entreprise" className="pl-10 h-12 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isRegistering} 
                  className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 hover:to-secondary text-secondary-foreground font-semibold text-base shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all"
                >
                  {isRegistering ? "Création..." : "Créer mon compte"}
                  {!isRegistering && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </form>
            </Form>
          </div>

          <p className="text-center text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-secondary font-semibold hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
