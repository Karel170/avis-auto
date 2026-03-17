import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetAiResponses, usePublishAllResponses } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AiResponses() {
  const { company } = useAuth();
  const companyId = company?.id as number;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAiResponses(companyId, {}, {
    query: { enabled: !!companyId }
  });

  const publishAllMutation = usePublishAllResponses({
    mutation: {
      onSuccess: (res) => {
        toast({ title: "Succès", description: res.message });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/ai-responses`] });
      }
    }
  });

  const pendingCount = data?.responses.filter(r => r.status !== 'publié').length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Réponses IA
          </h1>
          <p className="text-muted-foreground mt-1">Gérez toutes les réponses générées par l'intelligence artificielle.</p>
        </div>
        <Button 
          size="lg"
          onClick={() => publishAllMutation.mutate({ companyId })}
          disabled={pendingCount === 0 || publishAllMutation.isPending}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
        >
          <Send className="w-4 h-4 mr-2" />
          Publier tout ({pendingCount})
        </Button>
      </div>

      <div className="grid gap-4">
        {data?.responses.map(response => (
          <Card key={response.id} className="p-6 rounded-2xl border-border/50 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  response.status === 'publié' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {response.status === 'publié' ? 'Publié' : 'En attente'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {response.tone} • {response.length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Généré le {new Date(response.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 relative">
                <div className="absolute top-4 left-4">
                  <Sparkles className="w-5 h-5 text-primary/40" />
                </div>
                <p className="pl-8 text-foreground/90 font-medium">
                  {response.finalText || response.generatedText}
                </p>
              </div>
            </div>
          </Card>
        ))}
        {data?.responses.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">Aucune réponse IA générée pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
