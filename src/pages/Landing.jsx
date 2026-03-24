import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, Zap, MessageSquare, Settings2, SlidersHorizontal,
  RefreshCw, Download, ArrowRight, CheckCircle, Shield, Clock,
  BarChart3, Sparkles, ChevronRight, ChevronDown, TrendingUp, Bell, Quote
} from 'lucide-react';

const features = [
  {
    icon: Download,
    title: 'Import automatique depuis Google Maps',
    description: 'Synchronisez tous vos avis Google automatiquement via Apify. Aucune copie manuelle.',
  },
  {
    icon: Sparkles,
    title: 'Réponses automatisées personnalisées',
    description: 'Notre système génère des réponses naturelles, adaptées au ton et au contenu de chaque avis.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Ton et style configurables',
    description: 'Professionnel, chaleureux, enthousiaste — choisissez le ton qui correspond à votre marque.',
  },
  {
    icon: MessageSquare,
    title: 'Instruction personnalisée par avis',
    description: 'Pour les avis complexes, donnez une instruction spécifique et obtenez une réponse entièrement sur mesure.',
  },
  {
    icon: RefreshCw,
    title: 'Synchronisation hebdomadaire automatique',
    description: 'Chaque dimanche à 2h du matin, vos nouveaux avis sont importés automatiquement.',
  },
  {
    icon: BarChart3,
    title: 'Export CSV pour vos rapports',
    description: 'Exportez tous vos avis et réponses en CSV pour vos analyses et reporting.',
  },
];

const stats = [
  { value: '181', label: 'avis importés en moyenne', suffix: '' },
  { value: '< 30', label: 'secondes par réponse', suffix: 's' },
  { value: '5x', label: 'plus rapide qu\'à la main', suffix: '' },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '29',
    description: 'Pour les indépendants et petites entreprises',
    features: [
      '50 avis importés',
      '20 réponses automatisées / mois',
      'Import Apify automatique',
      'Support par email',
    ],
    cta: 'Commencer',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '79',
    description: 'Pour les PME et commerces',
    features: [
      '500 avis importés',
      'Réponses automatisées illimitées',
      'Génération groupée',
      'Export CSV',
      'Support prioritaire',
    ],
    cta: 'Essayer le plan Pro',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '149',
    description: 'Pour les multi-établissements et agences',
    features: [
      'Avis illimités',
      'Réponses automatisées illimitées',
      'Génération groupée',
      'Export CSV',
      'Publication Google Maps',
      'Support dédié',
    ],
    cta: 'Contacter les ventes',
    highlighted: false,
  },
];

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">AvisAuto</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/pricing"
            className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Tarifs
          </Link>
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm py-1.5 px-4"
          >
            S'inscrire gratuitement
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const scrollToDemo = () => {
    document.getElementById('dashboard-preview')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow + grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
          <Zap className="w-3.5 h-3.5" />
          Automatisation intelligente des réponses
        </div>

        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Gérez vos avis Google
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            automatiquement
          </span>
        </h1>

        <p className="animate-fade-up-2 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Importez automatiquement vos avis Google Maps, générez des réponses personnalisées en quelques secondes
          et améliorez votre réputation en ligne sans effort.
        </p>

        <div className="animate-fade-up-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            to="/register"
            className="w-full sm:w-auto btn-primary text-base py-3 px-8 justify-center animate-pulse-ring"
          >
            <Sparkles className="w-5 h-5" />
            S'inscrire gratuitement
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto btn-secondary text-base py-3 px-8 justify-center"
          >
            Voir les tarifs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Demo button */}
        <div className="animate-fade-up-4 flex flex-col items-center gap-2 mb-10">
          <button
            onClick={scrollToDemo}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-500/60 bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 hover:text-white transition-all duration-200 text-base font-semibold shadow-lg shadow-blue-900/20"
          >
            <ChevronDown className="w-5 h-5 animate-bounce" />
            Voir la démo
          </button>
        </div>

        {/* Dashboard mockup */}
        <div id="dashboard-preview" className="animate-fade-in relative mx-auto max-w-4xl">

          {/* Floating badge — top left */}
          <div className="animate-float hidden sm:flex absolute -left-6 top-12 z-10 items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl shadow-black/30">
            <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">+23 avis</p>
              <p className="text-xs text-slate-500 leading-tight">ce mois-ci</p>
            </div>
          </div>

          {/* Floating badge — top right */}
          <div className="animate-float hidden sm:flex absolute -right-6 top-20 z-10 items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl shadow-black/30" style={{ animationDelay: '0.8s' }}>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">4.7 / 5</p>
              <p className="text-xs text-slate-500 leading-tight">note moyenne</p>
            </div>
          </div>

          {/* Floating notification — bottom right */}
          <div className="animate-float hidden sm:flex absolute -right-4 -bottom-4 z-10 items-center gap-2.5 bg-slate-900 border border-blue-500/30 rounded-xl px-3 py-2.5 shadow-xl shadow-blue-900/30" style={{ animationDelay: '1.6s' }}>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">Nouvel avis reçu</p>
              <p className="text-xs text-slate-500 leading-tight">Réponse générée en 4s</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-blue-900/20">
            {/* Fake browser bar */}
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 mx-4 bg-slate-800 rounded-md px-3 py-1">
                <span className="text-xs text-slate-500">app.avisauto.fr/dashboard</span>
              </div>
            </div>
            {/* Dashboard content preview */}
            <div className="bg-slate-950 flex">
              {/* Mini sidebar */}
              <div className="hidden sm:flex flex-col w-14 bg-slate-900/80 border-r border-slate-800/60 py-4 items-center gap-3 flex-shrink-0">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-white" fill="white" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    { Icon: BarChart3, active: true },
                    { Icon: MessageSquare, active: false },
                    { Icon: Settings2, active: false },
                  ].map(({ Icon, active }, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-blue-600/30' : ''}`}>
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-400' : 'text-slate-600'}`} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Main content */}
              <div className="flex-1 p-4 sm:p-5 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-white text-left">Tableau de bord</p>
                    <p className="text-xs text-slate-500 text-left">Clinique Dentaire · Plan Pro</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-800 text-slate-400 text-xs px-2.5 py-1.5 rounded-lg">
                      <RefreshCw className="w-3 h-3" />
                      <span className="hidden sm:inline">Synchroniser</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-600/80 text-white text-xs px-2.5 py-1.5 rounded-lg">
                      <Sparkles className="w-3 h-3" />
                      <span className="hidden sm:inline">Générer tout</span>
                    </div>
                  </div>
                </div>
                {/* Stats cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Note moyenne', value: '4.7/5', sub: '+0.2 ce mois', color: 'amber' },
                    { label: 'Sans réponse', value: '12', sub: 'avis à traiter', color: 'blue' },
                    { label: 'Taux de réponse', value: '87%', sub: '157 / 181 avis', color: 'emerald' },
                    { label: 'Nouveaux avis', value: '+23', sub: 'ce mois-ci', color: 'purple' },
                  ].map((card) => (
                    <div key={card.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-left">
                      <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                      <p className={`text-lg font-bold leading-tight ${
                        card.color === 'amber' ? 'text-amber-400' :
                        card.color === 'blue' ? 'text-blue-400' :
                        card.color === 'emerald' ? 'text-emerald-400' : 'text-purple-400'
                      }`}>{card.value}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{card.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Bottom section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Bar chart */}
                  <div className="sm:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                    <p className="text-xs font-medium text-slate-400 mb-3 text-left">Avis reçus — 7 derniers jours</p>
                    <div className="flex items-end gap-1" style={{ height: '40px' }}>
                      {[
                        { h: 40, day: 'L' },
                        { h: 65, day: 'M' },
                        { h: 45, day: 'M' },
                        { h: 80, day: 'J' },
                        { h: 55, day: 'V' },
                        { h: 90, day: 'S' },
                        { h: 70, day: 'D' },
                      ].map((bar, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${i === 5 ? 'bg-blue-500' : 'bg-blue-600/50'}`}
                          style={{ height: `${bar.h}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {['L','M','M','J','V','S','D'].map((day, i) => (
                        <div key={i} className="flex-1 flex justify-center">
                          <span className="text-xs text-slate-600">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Ring + mini reviews */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                    <p className="text-xs font-medium text-slate-400 mb-2 text-left">Réponses générées</p>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-11 h-11 rounded-full border-4 border-slate-700 border-t-emerald-500 border-r-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">87%</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-300">157 / 181</p>
                        <p className="text-xs text-slate-500">avis traités</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { stars: 5, text: 'Excellent service, je re…', badge: 'Répondu', badgeColor: 'emerald' },
                        { stars: 2, text: 'Délai d\'attente trop long', badge: 'À traiter', badgeColor: 'blue' },
                        { stars: 4, text: 'Très bonne équipe, merci', badge: 'Répondu', badgeColor: 'emerald' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex gap-0.5 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className={`text-xs leading-none ${s <= r.stars ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 truncate flex-1">{r.text}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            r.badgeColor === 'emerald'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-blue-500/15 text-blue-400'
                          }`}>{r.badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-blue-600/20 blur-2xl rounded-full" />
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 border-y border-slate-800/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5 pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`animate-fade-up-${i + 1}`}>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {stat.value}
                <span className="text-blue-400">{stat.suffix}</span>
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Une plateforme complète pour automatiser et optimiser la gestion de vos avis Google.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-10 h-10 bg-blue-600/20 group-hover:bg-blue-600/35 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExampleSection() {
  const [active, setActive] = useState(0);

  const examples = [
    {
      rating: 5,
      review: "Très bonne expérience, personnel accueillant et service rapide. Je recommande vivement !",
      author: "Marie L.",
      response: "Merci infiniment pour ce retour si positif, Marie ! C'est une vraie joie de savoir que vous vous êtes sentie bien accueillie et que le service a été à la hauteur de vos attentes. Toute l'équipe sera ravie de vous retrouver très bientôt ! 😊",
      tag: "Avis 5 étoiles",
      tagColor: "emerald",
    },
    {
      rating: 2,
      review: "Attente trop longue en caisse et personnel peu disponible. Déçu par cette visite.",
      author: "Thomas R.",
      response: "Bonjour Thomas, nous sommes sincèrement désolés pour cette expérience décevante. L'attente en caisse et la disponibilité de notre équipe sont des points sur lesquels nous travaillons activement. Votre retour nous aide à progresser — n'hésitez pas à nous recontacter directement pour que nous puissions faire mieux lors de votre prochaine visite.",
      tag: "Avis négatif",
      tagColor: "red",
    },
    {
      rating: 4,
      review: "Bonne qualité dans l'ensemble, quelques petits détails à améliorer mais je reviendrai.",
      author: "Sophie M.",
      response: "Merci pour votre avis constructif, Sophie ! Nous sommes heureux que votre expérience ait été globalement positive. Vos remarques sur les petits détails sont précieuses et nous allons en tenir compte. À très bientôt pour une visite encore meilleure ! 🌟",
      tag: "Avis mitigé",
      tagColor: "amber",
    },
  ];

  const ex = examples[active];

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Exemple concret
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Voyez ce qu'AvisAuto génère
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Des réponses naturelles, adaptées à chaque avis. En moins de 30 secondes.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {examples.map((e, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === i
                  ? e.tagColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : e.tagColor === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {e.tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Avis client */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avis Google</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-sm ${s <= ex.rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                ))}
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{ex.review}"</p>
            <p className="text-xs text-slate-500">— {ex.author}</p>
          </div>

          {/* Réponse générée */}
          <div className="bg-blue-600/5 border border-blue-500/30 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Réponse générée par AvisAuto</p>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                4s
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{ex.response}</p>
            <Quote className="absolute bottom-4 right-4 w-6 h-6 text-blue-500/20" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Clément B.",
      role: "Gérant — Pharmacie",
      avatar: "C",
      color: "violet",
      rating: 5,
      text: "AvisAuto m'a fait gagner un temps fou. Avant je répondais manuellement à chaque avis, maintenant tout est géré automatiquement. Les réponses sont naturelles, mes clients ne voient pas la différence.",
    },
    {
      name: "Isabelle M.",
      role: "Directrice — Clinique dentaire",
      avatar: "I",
      color: "blue",
      rating: 5,
      text: "Résultat visible en 3 semaines : notre note Google est passée de 4,1 à 4,6. Le fait de répondre à tous les avis a clairement amélioré notre image. Je recommande à 100%.",
    },
    {
      name: "Karim T.",
      role: "Responsable — Restaurant",
      avatar: "K",
      color: "emerald",
      rating: 5,
      text: "Simple, rapide, efficace. En 10 minutes le compte est créé et les réponses sont déjà générées. Le setup accompagné était vraiment utile pour démarrer sans prise de tête.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            Ils nous font confiance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-slate-400 text-lg">
            Des établissements de toute taille qui ont transformé leur gestion des avis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300">
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  t.color === 'violet' ? 'bg-violet-600/30 text-violet-400' :
                  t.color === 'blue' ? 'bg-blue-600/30 text-blue-400' :
                  'bg-emerald-600/30 text-emerald-400'
                }`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Sans engagement</div>
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> Données sécurisées en Europe</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Opérationnel en 10 minutes</div>
          <div className="flex items-center gap-2"><Star className="w-4 h-4 text-violet-400" fill="currentColor" /> Support réactif</div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-slate-400 text-lg">
            Sans engagement, sans frais cachés.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-900/20'
                  : 'bg-slate-900/60 border-slate-700/50'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Recommandé
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}€</span>
                  <span className="text-slate-400">/mois</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
                }`}
              >
                {plan.cta}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 rounded-2xl p-10 sm:p-14">
          <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à automatiser vos réponses ?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez les établissements qui font confiance à AvisAuto pour gérer leur réputation en ligne.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto btn-primary text-base py-3 px-8 justify-center"
            >
              <Sparkles className="w-5 h-5" />
              Commencer gratuitement
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              Sans CB requise · Sans engagement
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <Star className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-sm font-semibold text-slate-400">AvisAuto</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <Link to="/legal" className="hover:text-slate-300 transition-colors">CGU</Link>
          <Link to="/legal" className="hover:text-slate-300 transition-colors">Confidentialité</Link>
          <a href="mailto:contact@avisauto.fr" className="hover:text-slate-300 transition-colors">Contact</a>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} AvisAuto. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ExampleSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
