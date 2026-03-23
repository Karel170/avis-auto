import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star, Sparkles, Globe, RefreshCw, CheckCircle,
  ArrowRight, X, Zap, Phone, ChevronRight, Loader2,
  Building2, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { companiesApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import { TONES, SECTORS, getErrorMessage } from '../lib/utils';
import { cn } from '../lib/utils';

const SETUP_PRICE = '39€';
const SETUP_CONTACT = 'contact@avisauto.fr'; // à adapter

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
            i < current
              ? 'bg-emerald-500 text-white'
              : i === current
              ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
              : 'bg-slate-800 text-slate-500'
          )}>
            {i < current ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={cn(
              'h-0.5 w-8 rounded-full transition-all duration-500',
              i < current ? 'bg-emerald-500' : 'bg-slate-700'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Onboarding({ onComplete }) {
  const { company, setCompany } = useAuthStore();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0); // 0=choix, 1=config, 2=apify, 3=done
  const [path, setPath] = useState(null); // 'self' | 'assisted'
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const [form, setForm] = useState({
    sector: company?.sector || '',
    default_tone: company?.default_tone || 'professional',
    signature: company?.signature || '',
    apify_dataset_url: company?.apify_dataset_url || '',
  });

  const updateMutation = useMutation({
    mutationFn: (data) => companiesApi.update(company.id, data),
    onSuccess: (res) => {
      setCompany(res.data);
      queryClient.invalidateQueries(['company', company?.id]);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleChooseSelf = () => {
    setPath('self');
    setStep(1);
  };

  const handleChooseAssisted = () => {
    setPath('assisted');
    setStep(1);
  };

  const handleSaveConfig = async () => {
    await updateMutation.mutateAsync({
      sector: form.sector,
      default_tone: form.default_tone,
      signature: form.signature,
    });
    setStep(2);
  };

  const handleSync = async () => {
    if (!form.apify_dataset_url) {
      toast.error('Entrez d\'abord votre URL Apify');
      return;
    }
    setSyncing(true);
    try {
      await updateMutation.mutateAsync({ apify_dataset_url: form.apify_dataset_url });
      const res = await companiesApi.sync(company.id, { apify_dataset_url: form.apify_dataset_url });
      const { imported } = res.data;
      setSyncDone(true);
      toast.success(`✅ ${imported} avis importés avec succès !`);
      queryClient.invalidateQueries(['reviews', company.id]);
      queryClient.invalidateQueries(['stats', company.id]);
      setTimeout(() => {
        setStep(3);
      }, 1200);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSyncing(false);
    }
  };

  const handleSkipApify = async () => {
    setStep(3);
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding_done', '1');
    onComplete();
  };

  // ─── STEP 0 : Choix du chemin ─────────────────────────────────────────────
  const StepChoice = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Star className="w-8 h-8 text-blue-400" fill="rgba(96,165,250,0.3)" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Bienvenue sur AvisAuto 🎉</h2>
      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
        Configurons votre espace en 3 étapes pour commencer à gérer vos avis Google automatiquement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Option DIY */}
        <button
          onClick={handleChooseSelf}
          className="group p-5 bg-slate-800/60 hover:bg-blue-600/10 border border-slate-700 hover:border-blue-500/50 rounded-xl text-left transition-all duration-200"
        >
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600/30 transition-colors">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Je configure moi-même</h3>
          <p className="text-xs text-slate-400">Suivez le guide en 3 étapes — rapide et autonome</p>
          <div className="flex items-center gap-1 mt-3 text-blue-400 text-xs font-medium">
            C'est parti <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        {/* Option accompagnée */}
        <button
          onClick={handleChooseAssisted}
          className="group p-5 bg-slate-800/60 hover:bg-emerald-600/10 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-left transition-all duration-200"
        >
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-500/30 transition-colors">
            <Phone className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Je préfère être accompagné</h3>
          <p className="text-xs text-slate-400">Setup clé en main réalisé par notre équipe</p>
          <div className="flex items-center gap-1 mt-3 text-emerald-400 text-xs font-medium">
            Voir l'offre <ChevronRight className="w-3 h-3" />
          </div>
        </button>
      </div>

      <button
        onClick={handleFinish}
        className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
      >
        Passer pour l'instant
      </button>
    </div>
  );

  // ─── STEP "ASSISTED" : Offre setup accompagné ─────────────────────────────
  const StepAssisted = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Phone className="w-8 h-8 text-emerald-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Setup accompagné</h2>
      <p className="text-slate-400 mb-6 text-sm max-w-sm mx-auto">
        Nous nous occupons de tout : configuration Apify, première synchronisation, réponses prêtes à publier.
      </p>

      <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-5 mb-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">Ce qui est inclus :</span>
          <span className="text-xl font-bold text-emerald-400">{SETUP_PRICE} <span className="text-sm text-slate-400 font-normal">unique</span></span>
        </div>
        <ul className="space-y-2.5">
          {[
            'Création et configuration de votre compte Apify',
            'Paramétrage de la synchronisation automatique',
            'Import complet de tous vos avis Google',
            'Génération de toutes vos réponses',
            'Appel de prise en main (30 min)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`mailto:${SETUP_CONTACT}?subject=Demande de setup accompagné — AvisAuto&body=Bonjour, je souhaite bénéficier du setup accompagné pour mon compte AvisAuto. Merci de me contacter pour convenir d'un rendez-vous.`}
        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors mb-3"
      >
        <Phone className="w-4 h-4" />
        Demander un setup accompagné
      </a>

      <button
        onClick={handleChooseSelf}
        className="w-full py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-colors"
      >
        Finalement, je configure moi-même →
      </button>

      <button
        onClick={handleFinish}
        className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors"
      >
        Passer pour l'instant
      </button>
    </div>
  );

  // ─── STEP 1 : Infos de base ────────────────────────────────────────────────
  const StepConfig = () => (
    <div>
      <StepIndicator current={0} total={3} />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Votre entreprise</h2>
          <p className="text-xs text-slate-400">Personnalisez le ton de vos réponses</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label">Secteur d'activité</label>
          <select
            className="input"
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
          >
            <option value="">Sélectionner votre secteur...</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Ton des réponses</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, default_tone: t.value })}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200',
                  form.default_tone === t.value
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                )}
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
          <p className="text-xs text-slate-500 mt-1">Ajoutée automatiquement à la fin de chaque réponse</p>
        </div>
      </div>

      <button
        onClick={handleSaveConfig}
        disabled={updateMutation.isPending}
        className="btn-primary w-full mt-6"
      >
        {updateMutation.isPending
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <ArrowRight className="w-4 h-4" />
        }
        Continuer
      </button>

      <button onClick={handleFinish} className="w-full mt-2 text-xs text-slate-600 hover:text-slate-400 transition-colors py-1">
        Passer pour l'instant
      </button>
    </div>
  );

  // ─── STEP 2 : Apify ────────────────────────────────────────────────────────
  const StepApify = () => (
    <div>
      <StepIndicator current={1} total={3} />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
          <Globe className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Connexion Apify</h2>
          <p className="text-xs text-slate-400">Pour importer vos avis Google automatiquement</p>
        </div>
      </div>

      {/* Guide rapide */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4 space-y-2">
        {[
          { n: 1, text: 'Créez un compte sur apify.com (gratuit)' },
          { n: 2, text: 'Lancez l\'acteur "Google Maps Reviews Scraper"' },
          { n: 3, text: 'Copiez l\'URL du dataset généré' },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-start gap-2.5 text-xs text-slate-400">
            <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {n}
            </span>
            {text}
          </div>
        ))}
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
              value={form.apify_dataset_url}
              onChange={(e) => setForm({ ...form, apify_dataset_url: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing || !form.apify_dataset_url}
          className={cn(
            'btn-primary w-full',
            syncDone && 'bg-emerald-600 hover:bg-emerald-500'
          )}
        >
          {syncing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Synchronisation en cours...</>
          ) : syncDone ? (
            <><CheckCircle className="w-4 h-4" /> Avis importés !</>
          ) : (
            <><RefreshCw className="w-4 h-4" /> Importer mes avis maintenant</>
          )}
        </button>
      </div>

      <button
        onClick={handleSkipApify}
        className="w-full mt-3 py-2.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-colors"
      >
        Configurer plus tard
      </button>
    </div>
  );

  // ─── STEP 3 : Terminé ──────────────────────────────────────────────────────
  const StepDone = () => (
    <div className="text-center">
      <StepIndicator current={3} total={3} />
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-9 h-9 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Vous êtes prêt ! 🚀</h2>
      <p className="text-slate-400 mb-6 text-sm max-w-sm mx-auto">
        Votre espace AvisAuto est configuré. Rendez-vous dans la section <strong className="text-white">Avis</strong> pour générer vos premières réponses.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800/60 rounded-xl p-4 text-center">
          <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Générez vos réponses</p>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 text-center">
          <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Personnalisez le ton</p>
        </div>
      </div>

      <button onClick={handleFinish} className="btn-primary w-full">
        Accéder à mon tableau de bord
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  // ─── Rendu ─────────────────────────────────────────────────────────────────
  const renderStep = () => {
    if (step === 0) return <StepChoice />;
    if (step === 1 && path === 'assisted') return <StepAssisted />;
    if (step === 1 && path === 'self') return <StepConfig />;
    if (step === 2) return <StepApify />;
    if (step === 3) return <StepDone />;
    return <StepChoice />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-fade-in">
        {/* Bouton fermer discret */}
        {step !== 3 && (
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800 transition-all"
            title="Passer l'onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {renderStep()}
      </div>
    </div>
  );
}
