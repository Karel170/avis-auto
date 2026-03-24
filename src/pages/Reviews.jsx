import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Search, Sparkles, RefreshCw, Loader2, Copy,
  Check, ChevronDown, ChevronUp, Edit2, Send, Star,
  Download, CheckCheck, MessageSquarePlus, X, HelpCircle, ExternalLink,
  ArrowUpRight, Lock, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { companiesApi, googleApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import StarRating from '../components/StarRating';
import { formatDate, getErrorMessage, getSentimentConfig, getStatusConfig, TONES } from '../lib/utils';
import { cn } from '../lib/utils';

// Check if error is a plan limit 403
function isLimitError(err) {
  return err?.response?.status === 403 && err?.response?.data?.upgrade === true;
}
function getLimitDetail(err) {
  return err?.response?.data?.detail || err?.response?.data?.error || 'Limite de votre plan atteinte.';
}

function GooglePublishGuide({ onClose }) {
  const steps = [
    { num: 1, title: 'Copiez la réponse générée', desc: 'Cliquez sur le bouton "Copier" pour copier la réponse générée.' },
    { num: 2, title: 'Ouvrez Google Maps', desc: 'Rendez-vous sur Google Maps et recherchez votre établissement.' },
    { num: 3, title: 'Accédez à vos avis', desc: 'Cliquez sur votre fiche → section "Avis" → trouvez l\'avis concerné.' },
    { num: 4, title: 'Cliquez sur "Répondre"', desc: 'Sous l\'avis, cliquez sur le bouton bleu "Répondre".' },
    { num: 5, title: 'Collez et publiez', desc: 'Collez votre réponse (Ctrl+V) et cliquez sur "Publier la réponse".' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Comment publier sur Google Maps</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-400">
                {step.num}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{step.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://business.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir Google Business
        </a>

        <p className="text-center text-xs text-slate-600 mt-3">
          💡 Astuce : marquez l'avis "Publié" dans AvisAuto après avoir répondu sur Google
        </p>
      </div>
    </div>
  );
}

function UpgradeModal({ message, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Limite du plan atteinte</h3>
              <p className="text-xs text-slate-500 mt-0.5">Passez à un plan supérieur pour continuer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors ml-2 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-5">
          <p className="text-sm text-amber-300">{message}</p>
        </div>

        <div className="space-y-2 mb-5 text-sm text-slate-400">
          <p className="font-medium text-slate-300 mb-2">Plans disponibles :</p>
          <div className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
            <span>Pro <span className="text-slate-500 text-xs ml-1">79€/mois</span></span>
            <span className="text-xs text-emerald-400">500 avis · Réponses illimitées · Export CSV</span>
          </div>
          <div className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
            <span>Business <span className="text-slate-500 text-xs ml-1">149€/mois</span></span>
            <span className="text-xs text-emerald-400">Tout illimité</span>
          </div>
        </div>

        <button
          onClick={() => { onClose(); navigate('/subscription'); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
          Voir les abonnements
        </button>
      </div>
    </div>
  );
}

function TemplateDropdown({ companyId, onSelect, onClose }) {
  const { data: templates = [] } = useQuery({
    queryKey: ['templates', companyId],
    queryFn: () => companiesApi.getTemplates(companyId).then(r => r.data),
    enabled: !!companyId,
  });

  return (
    <div className="absolute left-0 top-full mt-1 z-20 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50">
        <p className="text-xs font-medium text-slate-400">Modèles de réponses</p>
        <button onClick={onClose} className="text-slate-600 hover:text-slate-400">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {templates.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4 px-3">
          Aucun modèle — créez-en dans Paramètres
        </p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t.content)}
              className="w-full text-left px-3 py-2.5 hover:bg-slate-800 transition-colors border-b border-slate-700/30 last:border-0"
            >
              <p className="text-xs font-medium text-slate-200">{t.name}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{t.content}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, companyId, googleConnected, onLimitReached }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [editingResponse, setEditingResponse] = useState(false);
  const [responseText, setResponseText] = useState(review.final_text || review.generated_text || '');
  const [tone, setTone] = useState('professional');
  const [copied, setCopied] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const sentiment = getSentimentConfig(review.sentiment);
  const status = getStatusConfig(review.status);
  const hasResponse = review.generated_text || review.final_text;
  const isNegative = review.sentiment === 'negative';

  const generateMutation = useMutation({
    mutationFn: (params) => companiesApi.generateResponse(companyId, review.id, params),
    onSuccess: (res) => {
      setResponseText(res.data.final_text || res.data.generated_text);
      setExpanded(true);
      setEditingResponse(true);
      setShowCustomPrompt(false);
      toast.success('Réponse générée !');
      queryClient.invalidateQueries(['reviews', companyId]);
    },
    onError: (err) => {
      if (isLimitError(err)) {
        onLimitReached(getLimitDetail(err));
      } else {
        toast.error(getErrorMessage(err));
      }
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ tone });
  };

  const handleGenerateCustom = () => {
    if (!customPrompt.trim()) {
      toast.error('Entrez une instruction personnalisée');
      return;
    }
    generateMutation.mutate({ tone, custom_prompt: customPrompt });
  };

  const publishMutation = useMutation({
    mutationFn: () => companiesApi.updateResponse(companyId, review.id, {
      final_text: responseText, status: 'published',
    }),
    onSuccess: () => {
      toast.success('Réponse publiée !');
      setEditingResponse(false);
      queryClient.invalidateQueries(['reviews', companyId]);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const [googlePublishing, setGooglePublishing] = useState(false);
  const handlePublishToGoogle = async () => {
    // Save final text first if editing
    if (editingResponse) {
      await companiesApi.updateResponse(companyId, review.id, { final_text: responseText, status: 'draft' });
    }
    setGooglePublishing(true);
    try {
      await googleApi.publishReply({ company_id: companyId, review_id: review.id });
      toast.success('Réponse publiée sur Google Maps !');
      setEditingResponse(false);
      queryClient.invalidateQueries(['reviews', companyId]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGooglePublishing(false);
    }
  };

  const saveDraftMutation = useMutation({
    mutationFn: () => companiesApi.updateResponse(companyId, review.id, {
      final_text: responseText, status: 'draft',
    }),
    onSuccess: () => {
      toast.success('Brouillon sauvegardé');
      setEditingResponse(false);
      queryClient.invalidateQueries(['reviews', companyId]);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      'card overflow-hidden transition-all duration-200 hover:border-slate-600/50',
      isNegative && 'border-l-2 border-l-red-500/60'
    )}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
            isNegative ? 'bg-red-500/20' : 'bg-slate-700'
          )}>
            <span className={cn('text-sm font-bold', isNegative ? 'text-red-400' : 'text-slate-300')}>
              {review.author_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          {/* Infos */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-slate-200 text-sm truncate">{review.author_name || 'Anonyme'}</p>
              {/* Badges à droite du nom */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={cn('badge border text-xs', sentiment.bg)}>{sentiment.label}</span>
                <span className={cn('badge border text-xs', status.bg)}>{status.label}</span>
              </div>
            </div>
            {/* Étoiles + date */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StarRating rating={review.rating} size="xs" />
              <span className="text-xs text-slate-500">{formatDate(review.publish_date)}</span>
            </div>
          </div>
        </div>

        {/* Review text */}
        {review.text && (
          <p className="text-sm text-slate-300 mt-3 leading-relaxed line-clamp-3">{review.text}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/50 flex-wrap">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700 text-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>

          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="btn-primary text-xs py-1.5 px-3"
          >
            {generateMutation.isPending && !showCustomPrompt
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <Sparkles className="w-3 h-3" />}
            {hasResponse ? 'Regénérer' : 'Générer'}
          </button>

          <button
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            className={cn('btn-ghost text-xs py-1.5 px-3', showCustomPrompt && 'bg-purple-500/10 text-purple-400')}
            title="Générer avec une instruction personnalisée"
          >
            <MessageSquarePlus className="w-3 h-3" />
            Personnaliser
          </button>

          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={cn('btn-ghost text-xs py-1.5 px-3', showTemplates && 'bg-blue-500/10 text-blue-400')}
              title="Insérer un template"
            >
              <FileText className="w-3 h-3" />
              Modèles
            </button>
            {showTemplates && (
              <TemplateDropdown
                companyId={companyId}
                onSelect={(content) => {
                  setResponseText(content);
                  setExpanded(true);
                  setEditingResponse(true);
                  setShowTemplates(false);
                  toast.success('Template inséré');
                }}
                onClose={() => setShowTemplates(false)}
              />
            )}
          </div>

          {hasResponse && (
            <button onClick={() => setExpanded(!expanded)} className="btn-ghost text-xs py-1.5 px-3 ml-auto">
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Masquer' : 'Voir réponse'}
            </button>
          )}
        </div>

        {/* Custom prompt panel */}
        {showCustomPrompt && (
          <div className="mt-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-purple-400">Instruction personnalisée</p>
              <button onClick={() => setShowCustomPrompt(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-3 h-3" />
              </button>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="input w-full text-sm resize-none"
              rows={3}
              placeholder={`Ex: "Réponds de manière naturelle et empathique en reconnaissant le problème de prix. Propose de comparer nos tarifs et invite le client à revenir."`}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleGenerateCustom}
                disabled={generateMutation.isPending}
                className="btn-primary text-xs py-1.5 px-3"
              >
                {generateMutation.isPending
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Sparkles className="w-3 h-3" />}
                Générer avec cette instruction
              </button>
              <p className="text-xs text-slate-500">Notre système suivra précisément votre demande</p>
            </div>
          </div>
        )}
      </div>

      {/* Response panel */}
      {expanded && hasResponse && (
        <div className="border-t border-slate-700/50 bg-slate-900/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Réponse générée</p>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="btn-ghost text-xs py-1 px-2">
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
              <button onClick={() => setEditingResponse(!editingResponse)} className="btn-ghost text-xs py-1 px-2">
                <Edit2 className="w-3 h-3" />
                Modifier
              </button>
            </div>
          </div>

          {editingResponse ? (
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="input w-full min-h-[120px] text-sm resize-y"
            />
          ) : (
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {review.final_text || review.generated_text}
            </p>
          )}

          {editingResponse && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={() => saveDraftMutation.mutate()} disabled={saveDraftMutation.isPending} className="btn-secondary text-xs py-1.5">
                {saveDraftMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                Sauver brouillon
              </button>
              <button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending} className="btn-primary text-xs py-1.5">
                {publishMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Marquer publié
              </button>
              {googleConnected && (
                <button
                  onClick={handlePublishToGoogle}
                  disabled={googlePublishing}
                  className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                >
                  {googlePublishing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Publier sur Google
                </button>
              )}
              {!googleConnected && (
                <button onClick={() => setShowGuide(true)} className="btn-ghost text-xs py-1.5 ml-auto text-blue-400 hover:text-blue-300">
                  <HelpCircle className="w-3 h-3" />
                  Comment publier sur Google ?
                </button>
              )}
            </div>
          )}
          {showGuide && <GooglePublishGuide onClose={() => setShowGuide(false)} />}
        </div>
      )}
    </div>
  );
}

export default function Reviews() {
  const { company } = useAuthStore();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '', status: '', rating: '', sentiment: '', page: 1 });
  const [syncing, setSyncing] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(null);

  const { data: googleStatus } = useQuery({
    queryKey: ['google-status', company?.id],
    queryFn: () => googleApi.getStatus(company.id).then((r) => r.data),
    enabled: !!company?.id,
  });
  const googleConnected = !!(googleStatus?.connected && googleStatus?.location_configured);

  const handleLimitReached = (message) => setUpgradeModal(message);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', company?.id, filters],
    queryFn: () => companiesApi.getReviews(company.id, { ...filters, limit: 15 }).then((r) => r.data),
    enabled: !!company?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', company?.id],
    queryFn: () => companiesApi.getStats(company.id).then(r => r.data),
    enabled: !!company?.id,
    refetchInterval: 60000,
  });
  const usage = stats?.usage;

  const generateAllMutation = useMutation({
    mutationFn: () => companiesApi.generateAll(company.id, { limit: 50 }),
    onSuccess: (res) => {
      toast.success(`${res.data.generated} réponses générées !`);
      queryClient.invalidateQueries(['reviews', company.id]);
    },
    onError: (err) => {
      if (isLimitError(err)) {
        handleLimitReached(getLimitDetail(err));
      } else {
        toast.error(getErrorMessage(err));
      }
    },
  });

  const publishAllMutation = useMutation({
    mutationFn: () => companiesApi.publishAll(company.id),
    onSuccess: (res) => {
      toast.success(`${res.data.published} réponses publiées !`);
      queryClient.invalidateQueries(['reviews', company.id]);
      queryClient.invalidateQueries(['stats', company.id]);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await companiesApi.sync(company.id, {});
      const { imported, skipped, total } = res.data;
      if (total === 0) {
        toast('Aucun avis trouvé dans le dataset Apify', { icon: '⚠️' });
      } else {
        toast.success(`✅ Synchronisation terminée : ${imported} avis traités`);
      }
      queryClient.invalidateQueries(['reviews', company.id]);
      queryClient.invalidateQueries(['stats', company.id]);
    } catch (err) {
      if (isLimitError(err)) {
        handleLimitReached(getLimitDetail(err));
      } else {
        const msg = getErrorMessage(err);
        if (msg?.includes('Apify') || msg?.includes('dataset') || msg?.includes('URL')) {
          toast.error('URL Apify invalide ou dataset inaccessible. Vérifiez vos paramètres.');
        } else if (msg?.includes('non configurée') || msg?.includes('configurée')) {
          toast.error('Configurez d\'abord une URL Apify dans Paramètres → Synchronisation Apify');
        } else {
          toast.error(`Erreur sync : ${msg}`);
        }
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await companiesApi.exportCSV(company.id);
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avis-${company.name}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export téléchargé !');
    } catch (err) {
      if (isLimitError(err)) {
        handleLimitReached(getLimitDetail(err));
      } else {
        toast.error(getErrorMessage(err));
      }
    }
  };

  const totalPages = data ? Math.ceil(data.total / 15) : 0;
  const hasDrafts = data?.reviews?.some(r => r.response_status === 'draft');

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {upgradeModal && <UpgradeModal message={upgradeModal} onClose={() => setUpgradeModal(null)} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Avis Google</h1>
          <p className="text-slate-400 mt-1">{data?.total || 0} avis · Négatifs en priorité</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExport} className="btn-ghost">
            <Download className="w-4 h-4" />Export CSV
          </button>
          <button onClick={handleSync} disabled={syncing} className="btn-secondary">
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {syncing ? 'Sync...' : 'Sync'}
          </button>
          <button onClick={() => generateAllMutation.mutate()} disabled={generateAllMutation.isPending} className="btn-secondary">
            {generateAllMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Générer
          </button>
          {hasDrafts && (
            <button onClick={() => publishAllMutation.mutate()} disabled={publishAllMutation.isPending} className="btn-primary">
              {publishAllMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
              Tout publier
            </button>
          )}
        </div>
      </div>

      {/* Plan usage bar */}
      {usage && (usage.reviews.limit !== -1 || usage.ai_responses.limit !== -1) && (
        <div className="card p-4 flex flex-wrap gap-6">
          {usage.reviews.limit !== -1 && (
            <div className="flex-1 min-w-[160px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Avis importés</span>
                <span className={cn('text-xs font-medium', usage.reviews.current >= usage.reviews.limit ? 'text-red-400' : 'text-slate-300')}>
                  {usage.reviews.current} / {usage.reviews.limit}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', usage.reviews.current >= usage.reviews.limit ? 'bg-red-500' : usage.reviews.current / usage.reviews.limit > 0.8 ? 'bg-amber-500' : 'bg-blue-500')}
                  style={{ width: `${Math.min((usage.reviews.current / usage.reviews.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {usage.ai_responses.limit !== -1 && (
            <div className="flex-1 min-w-[160px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Réponses générées (mois)</span>
                <span className={cn('text-xs font-medium', usage.ai_responses.current >= usage.ai_responses.limit ? 'text-red-400' : 'text-slate-300')}>
                  {usage.ai_responses.current} / {usage.ai_responses.limit}
                </span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', usage.ai_responses.current >= usage.ai_responses.limit ? 'bg-red-500' : usage.ai_responses.current / usage.ai_responses.limit > 0.8 ? 'bg-amber-500' : 'bg-blue-500')}
                  style={{ width: `${Math.min((usage.ai_responses.current / usage.ai_responses.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {(usage.reviews.current >= usage.reviews.limit || (usage.ai_responses.limit !== -1 && usage.ai_responses.current >= usage.ai_responses.limit)) && (
            <button onClick={() => setUpgradeModal('Passez à un plan supérieur pour continuer à utiliser AvisAuto sans limites.')} className="flex-shrink-0 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Passer au plan supérieur
            </button>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              className="input pl-9 py-2 text-sm"
              placeholder="Rechercher un avis..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 flex-nowrap sm:flex-wrap">
            <select className="input py-2 text-sm flex-shrink-0 w-auto min-w-0" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
              <option value="">Tous statuts</option>
              <option value="pending">En attente</option>
              <option value="responded">Répondu</option>
              <option value="published">Publié</option>
            </select>
            <select className="input py-2 text-sm flex-shrink-0 w-auto min-w-0" value={filters.sentiment} onChange={(e) => setFilters({ ...filters, sentiment: e.target.value, page: 1 })}>
              <option value="">Sentiment</option>
              <option value="negative">⚠️ Négatif</option>
              <option value="neutral">Neutre</option>
              <option value="positive">Positif</option>
            </select>
            <select className="input py-2 text-sm flex-shrink-0 w-auto min-w-0" value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value, page: 1 })}>
              <option value="">Notes</option>
              {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}★</option>)}
            </select>
            {(filters.search || filters.status || filters.sentiment || filters.rating) && (
              <button onClick={() => setFilters({ search: '', status: '', rating: '', sentiment: '', page: 1 })} className="btn-ghost text-xs py-2 flex-shrink-0">
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : !data?.reviews?.length ? (
        <div className="card p-10 text-center">
          {filters.search || filters.status || filters.sentiment || filters.rating ? (
            // Pas de résultats avec des filtres actifs
            <>
              <Search className="w-10 h-10 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">Aucun avis ne correspond</h3>
              <p className="text-slate-500 mb-5 text-sm">Essayez de modifier ou d'effacer les filtres appliqués.</p>
              <button
                onClick={() => setFilters({ search: '', status: '', rating: '', sentiment: '', page: 1 })}
                className="btn-secondary mx-auto"
              >
                <X className="w-4 h-4" /> Effacer les filtres
              </button>
            </>
          ) : (
            // Aucun avis du tout → guide de démarrage
            <>
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Star className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucun avis importé</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                Vos avis Google apparaîtront ici après la première synchronisation. Suivez ces 3 étapes pour démarrer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-lg mx-auto">
                {[
                  { n: 1, title: 'Créez un compte Apify', desc: 'Gratuit sur apify.com — lancez le scraper Google Maps' },
                  { n: 2, title: 'Configurez l\'URL', desc: 'Copiez l\'URL du dataset dans Paramètres → Synchronisation' },
                  { n: 3, title: 'Synchronisez', desc: 'Cliquez sur "Sync" pour importer tous vos avis' },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="bg-slate-800/50 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold flex items-center justify-center mb-3">
                      {n}
                    </div>
                    <p className="text-sm font-medium text-slate-200 mb-1">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={handleSync} disabled={syncing} className="btn-primary">
                  {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Synchroniser maintenant
                </button>
                <a href="https://apify.com" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                  Ouvrir Apify →
                </a>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} companyId={company.id} googleConnected={googleConnected} onLimitReached={handleLimitReached} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={filters.page <= 1} className="btn-secondary disabled:opacity-30">Précédent</button>
          <span className="text-sm text-slate-400">Page {filters.page} / {totalPages}</span>
          <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page >= totalPages} className="btn-secondary disabled:opacity-30">Suivant</button>
        </div>
      )}
    </div>
  );
}
