import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Building2, Globe, MapPin, Sparkles, Save, Loader2,
  RefreshCw, Key, Info, CheckCircle, ShieldCheck, Eye, EyeOff,
  Link2, Link2Off, ChevronDown, Lock, FileText, Plus, Trash2, Pencil, X, Zap
} from 'lucide-react';

function NextSyncDate() {
  const now = new Date();
  const next = new Date(now);
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(2, 0, 0, 0);
  return (
    <span className="font-medium text-slate-400">
      dimanche {next.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à 02h00
    </span>
  );
}

import toast from 'react-hot-toast';
import { companiesApi, authApi, googleApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import { getErrorMessage, TONES, SECTORS } from '../lib/utils';

const syncSteps = [
  'Connexion à Apify...',
  'Récupération des avis...',
  'Analyse des données...',
  'Import en base de données...',
  'Mise à jour des statistiques...',
];

function TemplatesSection({ companyId }) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: templates = [] } = useQuery({
    queryKey: ['templates', companyId],
    queryFn: () => companiesApi.getTemplates(companyId).then(r => r.data),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => companiesApi.createTemplate(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates', companyId]);
      setNewName(''); setNewContent(''); setShowForm(false);
      toast.success('Template créé !');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => companiesApi.updateTemplate(companyId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates', companyId]);
      setEditingId(null);
      toast.success('Template mis à jour !');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => companiesApi.deleteTemplate(companyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates', companyId]);
      toast.success('Template supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newContent.trim()) return;
    createMutation.mutate({ name: newName, content: newContent });
  };

  const handleStartEdit = (t) => {
    setEditingId(t.id);
    setEditName(t.name);
    setEditContent(t.content);
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim() || !editContent.trim()) return;
    updateMutation.mutate({ id, data: { name: editName, content: editContent } });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-semibold text-white">Templates de réponses</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-ghost text-xs py-1.5 px-3"
        >
          <Plus className="w-3 h-3" />
          Nouveau
        </button>
      </div>
      <p className="text-sm text-slate-400 mb-5">
        Créez des modèles réutilisables à insérer en un clic dans vos réponses.
      </p>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-5 p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
          <div>
            <label className="label">Nom du template</label>
            <input
              className="input"
              placeholder="Ex: Réponse avis négatif"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Contenu</label>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Rédigez votre modèle de réponse..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
              <X className="w-3 h-3" /> Annuler
            </button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary text-sm">
              {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Créer
            </button>
          </div>
        </form>
      )}

      {/* Templates list */}
      {templates.length === 0 && !showForm ? (
        <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Aucun template pour l'instant</p>
          <button onClick={() => setShowForm(true)} className="text-blue-400 text-xs mt-1 hover:underline">
            Créer votre premier template
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map(t => (
            <div key={t.id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              {editingId === t.id ? (
                <div className="space-y-3">
                  <input
                    className="input text-sm"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                  <textarea
                    className="input text-sm min-h-[80px] resize-y"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="btn-ghost text-xs py-1">
                      <X className="w-3 h-3" /> Annuler
                    </button>
                    <button onClick={() => handleSaveEdit(t.id)} disabled={updateMutation.isPending} className="btn-primary text-xs py-1">
                      {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Sauvegarder
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-200">{t.name}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartEdit(t)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(t.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{t.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const { company, user, setCompany } = useAuthStore();
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [syncUrl, setSyncUrl] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [googleLocations, setGoogleLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Detect ?google=connected after OAuth redirect
  useEffect(() => {
    const googleParam = searchParams.get('google');
    if (googleParam === 'connected') {
      toast.success('Google Business connecté !');
      setSearchParams({});
      queryClient.invalidateQueries(['google-status', company?.id]);
      queryClient.invalidateQueries(['company', company?.id]);
      // Auto-load locations
      if (company?.id) handleLoadLocations();
    } else if (googleParam === 'error') {
      const msg = searchParams.get('msg') || 'Erreur de connexion Google';
      toast.error(`Erreur Google: ${msg}`);
      setSearchParams({});
    }
  }, [searchParams]); // eslint-disable-line

  // Change password state
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (pwForm.next.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setPwLoading(true);
    try {
      await authApi.changePassword(pwForm.current, pwForm.next);
      toast.success('Mot de passe mis à jour avec succès !');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg?.includes('incorrect')) {
        toast.error('Mot de passe actuel incorrect');
      } else {
        toast.error(msg);
      }
    } finally {
      setPwLoading(false);
    }
  };

  const [form, setForm] = useState({
    name: '', sector: '', address: '',
    apify_dataset_url: '', default_tone: 'professional', signature: '',
    auto_generate: false,
  });

  const { data: googleStatus } = useQuery({
    queryKey: ['google-status', company?.id],
    queryFn: () => googleApi.getStatus(company.id).then((r) => r.data),
    enabled: !!company?.id,
    refetchInterval: false,
  });

  const handleConnectGoogle = () => {
    const token = localStorage.getItem('avisauto_token');
    const url = googleApi.getAuthUrl(company.id, token);
    window.location.href = url;
  };

  const handleLoadLocations = async () => {
    setLoadingLocations(true);
    try {
      const res = await googleApi.getLocations(company.id);
      setGoogleLocations(res.data || []);
      if (res.data.length === 0) toast('Aucun établissement trouvé sur ce compte Google Business.', { icon: 'ℹ️' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSelectLocation = async (locationName) => {
    try {
      await googleApi.selectLocation({ company_id: company.id, location_name: locationName });
      toast.success('Établissement sélectionné !');
      queryClient.invalidateQueries(['google-status', company?.id]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDisconnectGoogle = async () => {
    setDisconnecting(true);
    try {
      await googleApi.disconnect(company.id);
      toast.success('Google Business déconnecté');
      setGoogleLocations([]);
      queryClient.invalidateQueries(['google-status', company?.id]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDisconnecting(false);
    }
  };

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['company', company?.id],
    queryFn: () => companiesApi.get(company.id).then((r) => r.data),
    enabled: !!company?.id,
  });

  useEffect(() => {
    if (companyData) {
      setForm({
        name: companyData.name || '',
        sector: companyData.sector || '',
        address: companyData.address || '',
        apify_dataset_url: companyData.apify_dataset_url || '',
        default_tone: companyData.default_tone || 'professional',
        signature: companyData.signature || '',
        auto_generate: companyData.auto_generate || false,
      });
      setSyncUrl(companyData.apify_dataset_url || '');
    }
  }, [companyData]);

  const updateMutation = useMutation({
    mutationFn: (data) => companiesApi.update(company.id, data),
    onSuccess: (res) => {
      setCompany(res.data);
      queryClient.invalidateQueries(['company', company.id]);
      toast.success('Paramètres sauvegardés !');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Le nom de l\'entreprise est requis');
      return;
    }
    updateMutation.mutate(form);
  };

  const handleSync = async () => {
    const url = syncUrl || form.apify_dataset_url;
    if (!url) {
      toast.error('Entrez une URL Apify');
      return;
    }
    setSyncing(true);
    setSyncStep(0);

    const stepInterval = setInterval(() => {
      setSyncStep((prev) => (prev < syncSteps.length - 2 ? prev + 1 : prev));
    }, 2500);

    try {
      const res = await companiesApi.sync(company.id, { apify_dataset_url: url });
      clearInterval(stepInterval);
      setSyncStep(syncSteps.length - 1);
      await new Promise((r) => setTimeout(r, 800));
      toast.success(`✅ ${res.data.imported} avis importés, ${res.data.skipped} ignorés`);
      queryClient.invalidateQueries(['reviews', company.id]);
      queryClient.invalidateQueries(['stats', company.id]);
    } catch (err) {
      clearInterval(stepInterval);
      toast.error(getErrorMessage(err));
    } finally {
      setSyncing(false);
      setSyncStep(0);
    }
  };

  if (!company) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Aucune entreprise configurée.</p>
      </div>
    );
  }

  return (
    <>
      {/* Full screen sync overlay */}
      {syncing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            {/* Animated rings */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400/50 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Synchronisation en cours</h3>
            <p className="text-blue-400 text-sm font-medium mb-4">{syncSteps[syncStep]}</p>

            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${((syncStep + 1) / syncSteps.length) * 100}%` }}
              />
            </div>

            <div className="text-left space-y-2 mb-5">
              {syncSteps.map((step, i) => (
                <div key={step} className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                  i < syncStep ? 'text-emerald-400' :
                  i === syncStep ? 'text-blue-400 font-medium' :
                  'text-slate-600'
                }`}>
                  {i < syncStep ? (
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                  ) : i === syncStep ? (
                    <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  {step}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              ⏳ Ne fermez pas cette page, la synchronisation est en cours...
            </p>
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="p-6 lg:p-8 max-w-3xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Paramètres</h1>
          <p className="text-slate-400 mt-1">Configurez votre entreprise et vos préférences de génération</p>
        </div>

        {/* Company Info */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Informations entreprise</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Nom de l'entreprise *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Mon Restaurant"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Secteur d'activité</label>
                <select
                  className="input"
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                >
                  <option value="">Sélectionner...</option>
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    className="input pl-9"
                    placeholder="123 rue de la Paix, Paris"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Configuration des réponses</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Ton des réponses par défaut</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, default_tone: t.value })}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                        form.default_tone === t.value
                          ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Signature des réponses</label>
                <input
                  type="text"
                  className="input"
                  placeholder="L'équipe Mon Restaurant"
                  value={form.signature}
                  onChange={(e) => setForm({ ...form, signature: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ajoutée à la fin de chaque réponse générée
                </p>
              </div>
            </div>
          </div>

          {/* Auto-génération — Pro/Business uniquement */}
          {(company?.plan === 'pro' || company?.plan === 'business') && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Génération automatique des réponses
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  À chaque synchronisation, les nouvelles réponses sont générées automatiquement par l'IA.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, auto_generate: !f.auto_generate }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  form.auto_generate ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  form.auto_generate ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending || isLoading}
              className="btn-primary"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Sauvegarder les paramètres
            </button>
          </div>
        </form>

        {/* Apify Sync */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Synchronisation Apify</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Importez vos avis Google Maps via un dataset Apify.
          </p>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 mb-5">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-400 space-y-1">
                <p>Utilisez l'acteur <strong className="text-slate-300">Google Maps Reviews Scraper</strong> sur Apify.</p>
                <p>Copiez l'URL du dataset généré (format: <code className="bg-slate-800 px-1 rounded">https://api.apify.com/v2/datasets/...</code>)</p>
                <p>La synchronisation automatique s'exécute chaque dimanche à 02h00.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label">URL du dataset Apify</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  className="input pl-9"
                  placeholder="https://api.apify.com/v2/datasets/xxx/items"
                  value={syncUrl}
                  onChange={(e) => {
                    setSyncUrl(e.target.value);
                    setForm({ ...form, apify_dataset_url: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateMutation.mutate({ apify_dataset_url: syncUrl })}
                disabled={updateMutation.isPending || syncing}
                className="btn-secondary"
              >
                <Save className="w-4 h-4" />
                Sauvegarder l'URL
              </button>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
                Synchroniser maintenant
              </button>
            </div>
          </div>

          {companyData?.apify_dataset_url && (
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                URL Apify configurée
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-3 h-3" />
                Prochaine sync automatique : <NextSyncDate />
              </div>
            </div>
          )}
        </div>

        {/* Google Business Integration */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h2 className="text-base font-semibold text-white">Google Business</h2>
            {(googleStatus?.plan_allowed) && googleStatus?.connected && (
              <span className="ml-auto badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">Connecté</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Publiez vos réponses directement sur Google Maps depuis AvisAuto.
          </p>

          {!googleStatus?.plan_allowed ? (
            <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-300">Réservé aux plans payants</p>
                <p className="text-xs text-slate-500 mt-0.5">Passez à un plan payant (Starter, Pro ou Business) pour publier vos réponses directement sur Google Maps.</p>
              </div>
            </div>
          ) : !googleStatus?.connected ? (
            <button onClick={handleConnectGoogle} className="btn-primary">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Connecter Google Business
            </button>
          ) : (
            <div className="space-y-4">
              {/* Location selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Établissement Google Maps</label>
                  <button
                    onClick={handleLoadLocations}
                    disabled={loadingLocations}
                    className="btn-ghost text-xs py-1 px-2"
                  >
                    {loadingLocations ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    {googleLocations.length === 0 ? 'Charger les établissements' : 'Actualiser'}
                  </button>
                </div>

                {googleLocations.length > 0 ? (
                  <div className="space-y-2">
                    {googleLocations.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => handleSelectLocation(loc.name)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          googleStatus?.location_name === loc.name
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <p className="text-sm font-medium">{loc.title}</p>
                        {loc.address && <p className="text-xs text-slate-500 mt-0.5">{loc.address}</p>}
                        {googleStatus?.location_name === loc.name && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-1">
                            <CheckCircle className="w-3 h-3" /> Sélectionné
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : googleStatus?.location_name ? (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-emerald-400 font-medium">Établissement configuré</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{googleStatus.location_name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-300">Cliquez sur "Charger les établissements" pour sélectionner votre fiche Google Maps.</p>
                  </div>
                )}
              </div>

              {/* Disconnect */}
              <div className="flex justify-end pt-2 border-t border-slate-700/50">
                <button
                  onClick={handleDisconnectGoogle}
                  disabled={disconnecting}
                  className="btn-ghost text-xs text-red-400 hover:text-red-300 py-1.5"
                >
                  {disconnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2Off className="w-3 h-3" />}
                  Déconnecter Google
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Templates */}
        <TemplatesSection companyId={company.id} />

        {/* Account Info */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Compte</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Nom</span>
              <span className="text-sm text-slate-200">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Email</span>
              <span className="text-sm text-slate-200">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-400">Rôle</span>
              <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {user?.role || 'owner'}
              </span>
            </div>
          </div>
        </div>

        {/* Security — Change Password */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Sécurité</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Modifiez votre mot de passe de connexion. Vous devrez saisir votre mot de passe actuel pour confirmer.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label">Mot de passe actuel</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nouveau mot de passe</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input pl-10"
                    placeholder="••••••••"
                    value={pwForm.next}
                    onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                {pwForm.next && pwForm.next.length < 8 && (
                  <p className="text-xs text-amber-400 mt-1">Minimum 8 caractères</p>
                )}
              </div>

              <div>
                <label className="label">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input pl-10"
                    placeholder="••••••••"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                  <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="btn-primary"
                disabled={pwLoading || (pwForm.confirm && pwForm.next !== pwForm.confirm)}
              >
                {pwLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
