import { useState } from 'react';
import {
  Star, CheckCircle, ArrowRight, X, Phone, Loader2, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { stripeApi } from '../lib/api';

const SETUP_PRICE = '39€';

export default function Onboarding({ onComplete }) {
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const res = await stripeApi.createSetupSession();
      window.location.href = res.data.url;
    } catch {
      toast.error('Erreur lors de la redirection. Réessayez.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_done', '1');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-fade-in">
        {/* Bouton fermer */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800 transition-all"
          title="Passer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-blue-400" fill="rgba(96,165,250,0.3)" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bienvenue sur AvisAuto 🎉</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Notre équipe configure votre espace pour vous — tout sera opérationnel sous 24h.
          </p>
        </div>

        {/* Offre setup */}
        <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Setup accompagné</span>
            </div>
            <span className="text-xl font-bold text-emerald-400">
              {SETUP_PRICE} <span className="text-sm text-slate-400 font-normal">unique</span>
            </span>
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

        {/* CTA Stripe */}
        <button
          onClick={handleSetup}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors mb-3"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Redirection en cours...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Démarrer mon setup — {SETUP_PRICE}<ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <button
          onClick={handleSkip}
          className="w-full text-xs text-slate-600 hover:text-slate-400 transition-colors py-1"
        >
          Passer pour l'instant
        </button>
      </div>
    </div>
  );
}
