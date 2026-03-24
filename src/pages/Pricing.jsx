import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star, CheckCircle, XCircle, ChevronRight, Shield, Zap,
  ArrowLeft, Loader2, AlertCircle, Crown, Wrench, Mail
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { stripeApi } from '../lib/api';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '29',
    description: 'Pour les indépendants et petites entreprises',
    features: [
      { text: '50 avis / mois', included: true },
      { text: '20 réponses automatisées / mois', included: true },
      { text: 'Import automatique des avis', included: true },
      { text: 'Synchronisation hebdomadaire', included: true },
      { text: 'Génération groupée de réponses', included: false },
      { text: 'Export CSV', included: false },
      { text: 'Publication Google Maps', included: false },
      { text: 'Support par email', included: true },
    ],
    highlighted: false,
    badge: null,
    icon: null,
    buttonClass: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    cardClass: 'bg-slate-900/60 border-slate-700/50',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '79',
    description: 'Pour les agences et PME en croissance',
    features: [
      { text: '500 avis / mois', included: true },
      { text: 'Réponses automatisées illimitées', included: true },
      { text: 'Import automatique des avis', included: true },
      { text: 'Synchronisation hebdomadaire', included: true },
      { text: 'Génération groupée de réponses', included: true },
      { text: 'Export CSV', included: true },
      { text: 'Publication Google Maps', included: false },
      { text: 'Support prioritaire', included: true },
    ],
    highlighted: true,
    badge: 'Plus populaire',
    icon: Zap,
    buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    cardClass: 'bg-blue-600/10 border-blue-500/50 shadow-xl shadow-blue-900/20',
  },
  {
    id: 'business',
    name: 'Business',
    price: '149',
    description: 'Pour les grandes enseignes et franchises',
    features: [
      { text: 'Avis illimités', included: true },
      { text: 'Réponses automatisées illimitées', included: true },
      { text: 'Import automatique des avis', included: true },
      { text: 'Synchronisation en temps réel', included: true },
      { text: 'Génération groupée de réponses', included: true },
      { text: 'Export CSV', included: true },
      { text: 'Publication Google Maps', included: true },
      { text: 'Support dédié', included: true },
    ],
    highlighted: false,
    badge: 'Tout inclus',
    icon: Crown,
    buttonClass: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white',
    cardClass: 'bg-violet-600/5 border-violet-500/30',
  },
];

const FAQ = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer:
      'Oui, vous pouvez passer d\'un plan à l\'autre à tout moment. Le changement est effectif immédiatement et votre facturation est ajustée au prorata.',
  },
  {
    question: 'Y a-t-il un engagement ?',
    answer:
      'Non, aucun engagement. Vous pouvez résilier votre abonnement à tout moment depuis vos paramètres. La résiliation prend effet à la fin de la période en cours.',
  },
  {
    question: 'Comment fonctionnent les réponses automatiques ?',
    answer:
      'Notre système analyse le contenu de chaque avis, sa note et son ton, puis génère une réponse personnalisée selon le style que vous avez configuré. Le résultat est naturel et prêt à être publié.',
  },
  {
    question: 'Mes avis sont-ils en sécurité ?',
    answer:
      'Oui. Vos données sont hébergées sur une infrastructure sécurisée en Europe et chiffrées en transit et au repos.',
  },
  {
    question: 'Puis-je essayer avant de payer ?',
    answer:
      'Vous pouvez créer un compte gratuitement et explorer l\'interface. L\'abonnement est nécessaire pour accéder à la génération automatique de réponses et à la synchronisation.',
  },
];

export default function Pricing() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSetup = async () => {
    setSetupLoading(true);
    try {
      const res = await stripeApi.createSetupSession();
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      setError('Erreur lors de la redirection vers le paiement. Réessayez.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleChoosePlan = async (plan) => {
    if (!isAuthenticated) {
      navigate(`/register?plan=${plan.id}`);
      return;
    }

    setLoading(plan.id);
    setError('');
    try {
      const res = await stripeApi.createCheckoutSession({ planId: plan.id });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="font-bold text-white">AvisAuto</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <Zap className="w-3.5 h-3.5" />
            Sans engagement &middot; Résiliation à tout moment
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Tarifs simples<br className="hidden sm:block" /> et transparents
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Choisissez le plan adapté à votre activité.
            Pas de frais cachés, pas d'engagement.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => {
            const PlanIcon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col ${plan.cardClass}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`text-white text-xs font-bold px-4 py-1 rounded-full ${
                        plan.id === 'pro'
                          ? 'bg-blue-600'
                          : 'bg-gradient-to-r from-violet-600 to-purple-600'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    {PlanIcon && (
                      <PlanIcon
                        className={`w-5 h-5 ${plan.id === 'pro' ? 'text-blue-400' : 'text-violet-400'}`}
                      />
                    )}
                    <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-5">{plan.description}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-bold text-white">{plan.price}€</span>
                    <span className="text-slate-400 text-sm">/mois</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">HT &middot; Facturation mensuelle &middot; TVA non applicable, art. 293 B du CGI</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2.5">
                      {feature.included ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleChoosePlan(plan)}
                  disabled={loading === plan.id}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonClass}`}
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Commencer
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Setup accompagné */}
        <div className="mb-16 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-14 h-14 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-7 h-7 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">Setup accompagné</h3>
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">Option</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Nous configurons AvisAuto pour vous : création du compte Apify, connexion Google Maps, première synchronisation et génération de toutes vos réponses. Vous n'avez rien à faire.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-400">
                {['Création compte Apify', 'Configuration dataset Google Maps', 'Première synchronisation', 'Génération de toutes les réponses', 'Formation rapide (30 min)'].map(item => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0">
              <div className="text-right">
                <div className="text-3xl font-bold text-white">39€ HT</div>
                <div className="text-xs text-slate-500">paiement unique</div>
              </div>
              <button
                onClick={handleSetup}
                disabled={setupLoading}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {setupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Payer en ligne
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-400 mb-16 py-8 border-y border-slate-800/60">
          {[
            { icon: Shield, text: 'Paiement sécurisé par Stripe' },
            { icon: CheckCircle, text: 'Sans engagement, résiliez quand vous voulez' },
            { icon: Zap, text: 'Accès immédiat après paiement' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-emerald-400" />
              {text}
            </div>
          ))}
        </div>

        {/* Comparison table (desktop) */}
        <div className="hidden sm:block mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Comparaison détaillée
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-400 font-normal w-1/2">
                  Fonctionnalité
                </th>
                {PLANS.map((p) => (
                  <th
                    key={p.id}
                    className={`text-center py-3 px-4 font-semibold ${
                      p.highlighted ? 'text-blue-400' : p.id === 'business' ? 'text-violet-400' : 'text-slate-300'
                    }`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Avis / mois', values: ['50', '500', 'Illimités'] },
                { label: 'Réponses automatisées / mois', values: ['20', 'Illimitées', 'Illimitées'] },
                { label: 'Génération groupée', values: [false, true, true] },
                { label: 'Export CSV', values: [false, true, true] },
                { label: 'Publication Google Maps', values: [false, false, true] },
                { label: 'Synchronisation', values: ['Hebdomadaire', 'Hebdomadaire', 'Temps réel'] },
                { label: 'Support', values: ['Email', 'Prioritaire', 'Dédié'] },
              ].map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-400">{row.label}</td>
                  {row.values.map((val, i) => (
                    <td key={i} className="py-3 px-4 text-center">
                      {typeof val === 'boolean' ? (
                        val ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-300">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-200">{item.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-400 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">
            Une question ?{' '}
            <a
              href="mailto:support@avisauto.app"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contactez-nous
            </a>
          </p>
          <p className="text-xs text-slate-600">
            <Link to="/legal" className="hover:text-slate-500 transition-colors">
              CGU
            </Link>
            {' · '}
            <Link to="/legal" className="hover:text-slate-500 transition-colors">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
