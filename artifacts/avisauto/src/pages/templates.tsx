import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate, CreateTemplateRequestType } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LayoutTemplate, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Templates() {
  const { company } = useAuth();
  const companyId = company?.id as number;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetTemplates(companyId, { query: { enabled: !!companyId } });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<CreateTemplateRequestType>("standard");

  const createMutation = useCreateTemplate({
    mutation: {
      onSuccess: () => {
        toast({ title: "Modèle créé" });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/templates`] });
        setModalOpen(false);
      }
    }
  });

  const updateMutation = useUpdateTemplate({
    mutation: {
      onSuccess: () => {
        toast({ title: "Modèle mis à jour" });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/templates`] });
        setModalOpen(false);
      }
    }
  });

  const deleteMutation = useDeleteTemplate({
    mutation: {
      onSuccess: () => {
        toast({ title: "Modèle supprimé" });
        queryClient.invalidateQueries({ queryKey: [`/api/companies/${companyId}/templates`] });
      }
    }
  });

  const openNew = () => {
    setEditingId(null);
    setName("");
    setContent("");
    setType("standard");
    setModalOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setName(t.name);
    setContent(t.content);
    setType(t.type);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ companyId, templateId: editingId, data: { name, content, type } });
    } else {
      createMutation.mutate({ companyId, data: { name, content, type } });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <LayoutTemplate className="w-8 h-8 text-primary" />
            Modèles
          </h1>
          <p className="text-muted-foreground mt-1">Créez des bases de réponses personnalisées pour l'IA.</p>
        </div>
        <Button onClick={openNew} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau modèle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.templates.map(template => (
          <Card key={template.id} className="rounded-2xl border-border/50 shadow-sm flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary">
                  {template.type}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground italic flex-1 line-clamp-4">
                "{template.content}"
              </p>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => openEdit(template)} className="rounded-lg flex-1">
                  <Edit className="w-3 h-3 mr-2" /> Modifier
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate({ companyId, templateId: template.id })} className="rounded-lg text-destructive hover:bg-destructive hover:text-white">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le modèle" : "Nouveau modèle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nom du modèle</label>
              <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Type de cas</label>
              <div className="flex gap-2">
                {['remerciement', 'critique', 'standard'].map(t => (
                  <Button 
                    key={t}
                    type="button"
                    variant={type === t ? 'default' : 'outline'}
                    onClick={() => setType(t as any)}
                    className="rounded-xl flex-1 capitalize text-xs"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Contenu de base</label>
              <Textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                className="rounded-xl min-h-[150px] bg-background"
                placeholder="Ex: Merci pour votre confiance ! Nous sommes ravis que notre produit réponde à vos attentes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl">Annuler</Button>
            <Button onClick={handleSave} disabled={!name || !content} className="rounded-xl">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
