import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Star, Crown, ArrowRight, ExternalLink } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { stripeApi } from '../lib/api';

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: '29',
    icon: Zap,
    color: 'blue',
    features: ['50 avis importés', '20 réponses automatisées / mois', 'Import Apify automatique', 'Support par email'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '79',
    icon: Star,
    color: 'blue',
    recommended: true,
    features: ['500 avis importés', 'Réponses automatisées illimitées', 'Génération groupée', 'Export CSV', 'Support prioritaire'],
  },
  {
    key: 'business',
    name: 'Business',
    price: '149',
    icon: Crown,
    color: 'violet',
    features: ['Avis illimités', 'Réponses automatisées illimitées', 'Génération groupée', 'Export CSV', 'Publication Google Maps', 'Support dédié'],
  },
];

export default function Subscription() {
  const { company } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (company?.id) {
      stripeApi.getSubscription(company.id)
        .then(res => setSubscription(res.data))
        .catch(() => setSubscription(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [company?.id]);

  const handleSubscribe = async (planKey) => {
    if (!company?.id) return;
    setCheckoutLoading(planKey);
    try {
      const res = await stripeApi.createCheckoutSession({ planId: planKey, company_id: company.id });
      window.location.href = res.data.url;
    } catch (err) {
      alert('Erreur lors de la création de la session de paiement.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    if (!company?.id) return;
    setPortalLoading(true);
    try {
      const res = await stripeApi.createPortalSession(company.id);
      window.location.href = res.data.url;
    } catch (err) {
      alert('Erreur lors de l\'ouverture du portail de facturation.');
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlan = subscription?.plan_key || null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Abonnement</h1>
        <p className="text-slate-400">Gérez votre plan et votre facturation.</p>
      </div>

      {/* Current plan banner */}
      {!loading && currentPlan && (
        <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-white">
                Plan actuel : <span className="text-blue-400 capitalize">{currentPlan}</span>
              </p>
              {subscription?.current_period_end && (
                <p className="text-xs text-slate-400">
                  Renouvellement le {new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {portalLoading ? 'Chargement...' : 'Gérer la facturation'}
          </button>
        </div>
      )}

      {!loading && !currentPlan && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-400 font-medium">⚠️ Aucun abonnement actif — choisissez un plan pour continuer à utiliser AvisAuto.</p>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-600/15 border-blue-500/50 shadow-lg shadow-blue-900/20'
                  : plan.recommended
                  ? 'bg-slate-800/60 border-slate-600/50'
                  : 'bg-slate-900/60 border-slate-700/50'
              }`}
            >
              {plan.recommended && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Recommandé</span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">Plan actuel</span>
                </div>
              )}

              <div className="mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  plan.color === 'violet' ? 'bg-violet-600/20' : 'bg-blue-600/20'
                }`}>
                  <Icon className={`w-5 h-5 ${plan.color === 'violet' ? 'text-violet-400' : 'text-blue-400'}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-white">{plan.price}€</span>
                  <span className="text-slate-400 text-sm">/mois HT</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Gérer
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={!!checkoutLoading}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.color === 'violet'
                      ? 'bg-violet-600 hover:bg-violet-500 text-white'
                      : plan.recommended
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {checkoutLoading === plan.key ? 'Chargement...' : (
                    <>
                      Choisir ce plan
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        Sans engagement · Annulable à tout moment · Paiement sécurisé par Stripe
      </p>
      <p className="text-center text-xs text-slate-600 mt-2">
        TVA non applicable, art. 293 B du CGI
      </p>
    </div>
  );
}
