import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGetStats, useGetReviews, useGenerateAllResponses, useSyncReviews, usePublishAllResponses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star, Clock, AlertCircle, RefreshCw, Send, Sparkles, TrendingUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const companyId = company?.id as number;

  const { data: stats, isLoading: statsLoading } = useGetStats(companyId, {
    query: { enabled: !!companyId }
  });

  const { data: recentReviews, isLoading: reviewsLoading } = useGetReviews(companyId, { limit: 5 }, {
    query: { enabled: !!companyId }
  });

  const generateAllMutation = useGenerateAllResponses({
    mutation: {
      onSuccess: (res) => {
        toast({ title: "Génération terminée", description: res.message });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}`] });
      },
      onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" })
    }
  });

  const syncMutation = useSyncReviews({
    mutation: {
      onSuccess: (res) => {
        toast({ title: "Synchronisation réussie", description: res.message });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}`] });
      },
      onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" })
    }
  });

  const publishAllMutation = usePublishAllResponses({
    mutation: {
      onSuccess: (res) => {
        toast({ title: "Publication réussie", description: res.message });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}`] });
      },
      onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" })
    }
  });

  const handleGenerateAll = () => generateAllMutation.mutate({ companyId, data: {} });
  const handleSync = () => syncMutation.mutate({ companyId });
  const handlePublishAll = () => publishAllMutation.mutate({ companyId });

  if (statsLoading || reviewsLoading) {
    return <div className="h-full flex items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const unrepliedCount = stats?.unrepliedReviews || 0;
  const pendingPublishCount = recentReviews?.reviews.filter(r => r.status === 'en_attente_publication' || r.status === 'proposé' || r.status === 'modifié').length || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1 text-lg">Bienvenue sur votre espace de gestion d'avis pour {company?.name}.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSync} 
            disabled={syncMutation.isPending}
            className="rounded-xl border-border/50 hover:bg-muted bg-card shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            Synchroniser
          </Button>
          <Button 
            onClick={handleGenerateAll}
            disabled={unrepliedCount === 0 || generateAllMutation.isPending}
            className="rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Traiter {unrepliedCount} avis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MessageSquare className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold uppercase tracking-wider text-xs">Total des avis</CardDescription>
            <CardTitle className="text-4xl font-display text-foreground">{stats?.totalReviews || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              <span>Depuis l'inscription</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden relative bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle className="w-16 h-16 text-amber-500" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold uppercase tracking-wider text-xs text-amber-600 dark:text-amber-500">À traiter</CardDescription>
            <CardTitle className="text-4xl font-display text-foreground">{stats?.unrepliedReviews || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className="font-medium text-amber-600 dark:text-amber-500 mr-1">{pendingPublishCount}</span> réponses prêtes
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold uppercase tracking-wider text-xs">Taux de réponse</CardDescription>
            <CardTitle className="text-4xl font-display text-foreground">{stats?.responseRate || 0}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${stats?.responseRate || 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-16 h-16 text-yellow-500" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="font-semibold uppercase tracking-wider text-xs">Note moyenne</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-4xl font-display text-foreground">{stats?.averageRating?.toFixed(1) || "0.0"}</CardTitle>
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              Sur Google Maps
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Activité récente</h2>
            <Link href="/avis" className="text-sm font-medium text-primary hover:underline">Voir tous les avis</Link>
          </div>
          
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            {recentReviews?.reviews.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <img src={`${import.meta.env.BASE_URL}images/empty-reviews.png`} className="w-32 h-32 opacity-80 mb-4" alt="No reviews" />
                <h3 className="text-lg font-semibold text-foreground">Aucun avis trouvé</h3>
                <p className="text-muted-foreground">Synchronisez pour récupérer vos avis Google.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentReviews?.reviews.map(review => (
                  <div key={review.id} className="p-5 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{review.authorName}</p>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <span className="flex text-yellow-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400' : 'fill-muted text-muted'}`} />
                              ))}
                            </span>
                            {review.publishDate && <span>{new Date(review.publishDate).toLocaleDateString('fr-FR')}</span>}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        review.status === 'nouveau' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        review.status === 'publié' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                    {review.text && <p className="text-sm text-muted-foreground line-clamp-2 mt-3">{review.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Publication Rapide
              </CardTitle>
              <CardDescription>Publiez vos réponses validées sur Google en 1 clic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-xl p-4 border border-border/50 text-center mb-4">
                <div className="text-3xl font-display font-bold text-foreground mb-1">{pendingPublishCount}</div>
                <div className="text-sm text-muted-foreground">réponses en attente</div>
              </div>
              <Button 
                className="w-full rounded-xl" 
                size="lg"
                disabled={pendingPublishCount === 0 || publishAllMutation.isPending}
                onClick={handlePublishAll}
              >
                {publishAllMutation.isPending ? "Publication..." : `Publier ${pendingPublishCount} réponses`}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Temps économisé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">{stats?.timeSaved || "0h"}</p>
                  <p className="text-sm text-muted-foreground">grâce à l'IA ce mois-ci</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
