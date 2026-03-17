import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetReviews, useGenerateResponse, useReformulateResponse, useSaveResponse, usePublishResponse, useMarkReplied, ReviewStatus, GenerateRequestTone, GenerateRequestLength, GenerateRequestStyle, GetReviewsStatus, GetReviewsSentiment } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Star, Filter, Search, Sparkles, Edit3, Send, CheckCircle2, RefreshCw } from "lucide-react";

export default function Reviews() {
  const { company } = useAuth();
  const companyId = company?.id as number;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<GetReviewsStatus | "all">("all");
  const [sentimentFilter, setSentimentFilter] = useState<GetReviewsSentiment | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetReviews(companyId, {
    status: statusFilter !== "all" ? statusFilter : undefined,
    sentiment: sentimentFilter !== "all" ? sentimentFilter : undefined,
    page,
    limit: 20
  }, { query: { enabled: !!companyId } });

  // Modal states
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  
  const [tone, setTone] = useState<GenerateRequestTone>(company?.defaultTone || GenerateRequestTone.professionnel);
  const [length, setLength] = useState<GenerateRequestLength>(GenerateRequestLength.moyen);
  const [style, setStyle] = useState<GenerateRequestStyle>(GenerateRequestStyle.neutre);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [finalText, setFinalText] = useState("");
  const [variants, setVariants] = useState<string[]>([]);

  // Mutations
  const generateMutation = useGenerateResponse({
    mutation: {
      onSuccess: () => {
        toast({ title: "Réponse générée avec succès" });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/reviews`] });
        setGenerateModalOpen(false);
      }
    }
  });

  const reformulateMutation = useReformulateResponse({
    mutation: {
      onSuccess: (res) => {
        setVariants(res.variants);
        toast({ title: "Variantes générées" });
      }
    }
  });

  const saveMutation = useSaveResponse({
    mutation: {
      onSuccess: () => {
        toast({ title: "Réponse sauvegardée", description: "Elle est prête à être publiée." });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/reviews`] });
        setEditModalOpen(false);
      }
    }
  });

  const publishMutation = usePublishResponse({
    mutation: {
      onSuccess: () => {
        toast({ title: "Réponse publiée sur Google !" });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/reviews`] });
      }
    }
  });

  const openGenerateModal = (review: any) => {
    setSelectedReview(review);
    setStyle(review.sentiment === 'positif' ? 'remerciement' : review.sentiment === 'negatif' ? 'excuse' : 'neutre');
    setGenerateModalOpen(true);
  };

  const openEditModal = (review: any) => {
    setSelectedReview(review);
    setFinalText(review.aiResponse?.finalText || review.aiResponse?.generatedText || "");
    setVariants([]);
    setInstructions("");
    setEditModalOpen(true);
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch(status) {
      case 'nouveau': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Nouveau</span>;
      case 'proposé': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Proposé</span>;
      case 'modifié': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Modifié</span>;
      case 'publié': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Publié</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Avis Google</h1>
          <p className="text-muted-foreground mt-1">Gérez et répondez à tous vos avis clients.</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[180px] rounded-xl bg-background">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveaux</SelectItem>
                <SelectItem value="proposé">Réponses proposées</SelectItem>
                <SelectItem value="publié">Publiés</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sentimentFilter} onValueChange={(v: any) => setSentimentFilter(v)}>
              <SelectTrigger className="w-[180px] rounded-xl bg-background">
                <SelectValue placeholder="Tous les sentiments" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Tous les sentiments</SelectItem>
                <SelectItem value="positif">Positifs</SelectItem>
                <SelectItem value="neutre">Neutres</SelectItem>
                <SelectItem value="négatif">Négatifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-9 h-10 rounded-xl bg-background" />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="py-20 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.reviews.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm">
              <img src={`${import.meta.env.BASE_URL}images/empty-reviews.png`} className="w-32 h-32 mx-auto opacity-70 mb-4" alt="No reviews" />
              <h3 className="text-xl font-semibold">Aucun avis trouvé</h3>
              <p className="text-muted-foreground mt-2">Modifiez vos filtres ou synchronisez depuis Google.</p>
            </div>
          ) : (
            data?.reviews.map((review) => (
              <Card key={review.id} className="rounded-2xl border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{review.authorName}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex text-yellow-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400' : 'fill-muted text-muted'}`} />
                              ))}
                            </span>
                            {review.publishDate && <span>{new Date(review.publishDate).toLocaleDateString('fr-FR')}</span>}
                            {getStatusBadge(review.status)}
                          </div>
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-foreground/90 bg-muted/30 p-4 rounded-xl text-sm leading-relaxed border border-border/50">
                          "{review.text}"
                        </p>
                      )}
                      
                      {review.aiResponse && (
                        <div className="pl-6 border-l-2 border-primary/20 mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" /> Réponse IA proposée
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            {review.aiResponse.finalText || review.aiResponse.generatedText}
                          </p>
                        </div>
                      )}
                      
                      {review.ownerReply && !review.aiResponse && (
                        <div className="pl-6 border-l-2 border-border mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" /> Réponse publiée
                          </div>
                          <p className="text-sm text-muted-foreground">{review.ownerReply}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 justify-start md:justify-end shrink-0 md:w-48">
                      {review.status === 'nouveau' && (
                        <Button 
                          onClick={() => openGenerateModal(review)}
                          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Sparkles className="w-4 h-4 mr-2" /> Générer IA
                        </Button>
                      )}
                      
                      {(review.status === 'proposé' || review.status === 'modifié') && (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => openEditModal(review)}
                            className="w-full rounded-xl"
                          >
                            <Edit3 className="w-4 h-4 mr-2" /> Modifier
                          </Button>
                          <Button 
                            onClick={() => publishMutation.mutate({ companyId, reviewId: review.id })}
                            disabled={publishMutation.isPending}
                            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" /> Publier
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* GENERATE MODAL */}
      <Dialog open={generateModalOpen} onOpenChange={setGenerateModalOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-border/50">
          <DialogHeader className="p-6 bg-muted/30 border-b border-border/50">
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Proposer une réponse
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
              <p className="text-sm italic text-muted-foreground">"{selectedReview?.text}"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ton</label>
                <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="chaleureux">Chaleureux</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Longueur</label>
                <Select value={length} onValueChange={(v: any) => setLength(v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="court">Courte</SelectItem>
                    <SelectItem value="moyen">Moyenne</SelectItem>
                    <SelectItem value="long">Longue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold">Style</label>
                <Select value={style} onValueChange={(v: any) => setStyle(v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="remerciement">Remerciement</SelectItem>
                    <SelectItem value="excuse">Excuse</SelectItem>
                    <SelectItem value="résolution">Résolution</SelectItem>
                    <SelectItem value="neutre">Neutre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/20 border-t border-border/50">
            <Button variant="outline" onClick={() => setGenerateModalOpen(false)} className="rounded-xl">Annuler</Button>
            <Button 
              onClick={() => generateMutation.mutate({ companyId, reviewId: selectedReview?.id, data: { tone, length, style } })}
              disabled={generateMutation.isPending}
              className="rounded-xl bg-primary text-primary-foreground"
            >
              {generateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Générer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-border/50 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 bg-muted/30 border-b border-border/50 shrink-0">
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-primary" />
              Ajuster la réponse
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Avis du client</label>
              <div className="bg-muted p-4 rounded-xl border border-border/50">
                <p className="text-sm">"{selectedReview?.text}"</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center justify-between">
                <span>Réponse finale</span>
              </label>
              <Textarea 
                value={finalText}
                onChange={(e) => setFinalText(e.target.value)}
                className="min-h-[120px] rounded-xl border-primary/30 focus-visible:ring-primary/20 bg-primary/5"
              />
            </div>

            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Demander à l'IA d'améliorer
              </label>
              <div className="flex gap-2">
                <Input 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Sois plus chaleureux, ajoute que nous sommes désolés..." 
                  className="rounded-xl flex-1 bg-background"
                />
                <Button 
                  variant="secondary"
                  onClick={() => reformulateMutation.mutate({ 
                    companyId, 
                    reviewId: selectedReview?.id, 
                    data: { instructions, currentText: finalText } 
                  })}
                  disabled={!instructions || reformulateMutation.isPending}
                  className="rounded-xl whitespace-nowrap"
                >
                  {reformulateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Reformuler"}
                </Button>
              </div>
              
              {variants.length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-xs text-muted-foreground font-semibold">Choisissez une variante :</p>
                  {variants.map((v, i) => (
                    <div 
                      key={i} 
                      onClick={() => setFinalText(v)}
                      className="p-3 text-sm rounded-xl border border-border bg-background hover:border-primary cursor-pointer hover:bg-primary/5 transition-colors"
                    >
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/20 border-t border-border/50 shrink-0">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="rounded-xl">Annuler</Button>
            <Button 
              onClick={() => saveMutation.mutate({ companyId, reviewId: selectedReview?.id, data: { finalText, status: "en_attente_publication" } })}
              disabled={saveMutation.isPending || !finalText}
              className="rounded-xl bg-primary text-primary-foreground"
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
