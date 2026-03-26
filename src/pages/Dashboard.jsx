import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Star, MessageSquare, TrendingUp, TrendingDown, Clock, RefreshCw,
  Loader2, Sparkles, AlertCircle, ThumbsUp, ThumbsDown, Minus, Shield,
  CheckCircle2, Circle, Settings, Link2, RotateCcw, Zap, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { companiesApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import StatsCard from '../components/StatsCard';
import Onboarding from '../components/Onboarding';
import { getErrorMessage } from '../lib/utils';

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

function GettingStarted({ company, stats, onNavigate }) {
  const steps = [
    {
      id: 'company',
      label: 'Configurez votre entreprise',
      desc: 'Nom, secteur, signature et ton de réponse',
      done: !!(company?.name && company?.sector),
      icon: Settings,
      path: '/settings',
    },
    {
      id: 'apify',
      label: 'Connectez votre source Apify',
      desc: 'URL du dataset Google Maps dans Paramètres → Intégrations',
      done: !!company?.apify_dataset_url,
      icon: Link2,
      path: '/settings',
    },
    {
      id: 'sync',
      label: 'Lancez votre première synchronisation',
      desc: 'Importez vos avis Google Maps',
      done: (stats?.total_reviews || 0) > 0,
      icon: RotateCcw,
      path: null,
    },
    {
      id: 'generate',
      label: 'Générez vos premières réponses',
      desc: 'Laissez notre système rédiger pour vous',
      done: (stats?.total_reviews || 0) > 0 && (stats?.pending_reviews || 0) < (stats?.total_reviews || 0),
      icon: Zap,
      path: '/reviews',
    },
  ];

  const doneCount = steps.filter(s => s.done).length;
  if (doneCount === steps.length) return null;

  return (
    <div className="card p-6 border border-blue-500/20 bg-blue-500/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Premiers pas</h3>
          <p className="text-sm text-slate-400 mt-0.5">{doneCount}/{steps.length} étapes complétées</p>
        </div>
        <div className="text-right">
          <div className="w-32 bg-slate-800 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {steps.map(({ id, label, desc, done, icon: Icon, path }) => (
          <div
            key={id}
            onClick={() => path && onNavigate(path)}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              done ? 'opacity-50' : path ? 'cursor-pointer hover:bg-slate-800/50' : ''
            }`}
          >
            <div className={`mt-0.5 flex-shrink-0 ${done ? 'text-emerald-400' : 'text-slate-500'}`}>
              {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${done ? 'line-through text-slate-500' : 'text-white'}`}>{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            {!done && path && (
              <div className="flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReputationScore({ score, ratingTrend, averageRating, responseRate }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Excellente' : score >= 40 ? 'Correcte' : 'À améliorer';
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const trendUp = ratingTrend !== null && ratingTrend > 0;
  const trendDown = ratingTrend !== null && ratingTrend < 0;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold text-white">Score de réputation</h3>
        {ratingTrend !== null && ratingTrend !== 0 && (
          <span className={`ml-auto flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
            trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendUp ? '+' : ''}{ratingTrend} ce mois
          </span>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={color} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-hidden">
          <div>
            <p className="text-sm font-semibold" style={{ color }}>{label}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">Basé sur la note et le taux de réponse</p>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex gap-0.5 flex-shrink-0">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-700'}`} fill={s <= Math.round(averageRating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-slate-300 font-medium flex-shrink-0">{averageRating}/5</span>
            </div>
          )}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Taux de réponse</span>
              <span className="text-slate-300 font-medium">{responseRate}%</span>
            </div>
            <div className="bg-slate-800 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-700" style={{ width: `${responseRate}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { company } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  // Onboarding : affiché si l'URL Apify n'est pas configurée ET pas déjà vu
  const onboardingDone = localStorage.getItem('onboarding_done') === '1';
  const [showOnboarding, setShowOnboarding] = useState(
    !onboardingDone && !!company && !company.apify_dataset_url
  );

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', company?.id],
    queryFn: () => companiesApi.getStats(company.id).then((r) => r.data),
    enabled: !!company?.id,
  });

  const generateAllMutation = useMutation({
    mutationFn: () => companiesApi.generateAll(company.id, { limit: 20 }),
    onSuccess: (res) => {
      toast.success(`${res.data.generated} réponses générées !`);
      queryClient.invalidateQueries(['stats', company.id]);
      queryClient.invalidateQueries(['reviews', company.id]);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSync = async () => {
    if (!company?.apify_dataset_url) {
      toast.error('Configurez d\'abord une URL Apify dans les paramètres');
      navigate('/settings');
      return;
    }
    setSyncing(true);
    try {
      const res = await companiesApi.sync(company.id, {});
      toast.success(`${res.data.imported} avis importés`);
      queryClient.invalidateQueries(['stats', company.id]);
      queryClient.invalidateQueries(['reviews', company.id]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSyncing(false);
    }
  };

  if (!company) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Configurez votre entreprise</h2>
          <p className="text-slate-400 mb-6">Ajoutez les informations de votre entreprise pour commencer.</p>
          <button onClick={() => navigate('/settings')} className="btn-primary mx-auto">
            Aller aux paramètres
          </button>
        </div>
      </div>
    );
  }

  const sentimentData = stats ? [
    { name: 'Positifs', value: stats.positive_count },
    { name: 'Neutres', value: stats.neutral_count },
    { name: 'Négatifs', value: stats.negative_count },
  ] : [];

  const ratingDist = stats?.rating_distribution?.map((r) => ({
    rating: `${r.rating}★`,
    count: parseInt(r.count),
  })) || [];

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Onboarding wizard */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Checklist Premiers pas */}
      {!isLoading && !showOnboarding && (
        <GettingStarted company={company} stats={stats} onNavigate={navigate} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">{company.name} · Vue d'ensemble</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handleSync} disabled={syncing} className="btn-secondary">
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {syncing ? 'Sync...' : 'Synchroniser'}
          </button>
          <button
            onClick={() => generateAllMutation.mutate()}
            disabled={generateAllMutation.isPending}
            className="btn-primary"
          >
            {generateAllMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generateAllMutation.isPending ? 'Génération...' : 'Générer toutes'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Note moyenne"
              value={stats?.average_rating ? `${stats.average_rating}/5` : '—'}
              subtitle={`${stats?.total_reviews || 0} avis au total`}
              icon={Star}
              color="amber"
            />
            <StatsCard
              title="En attente"
              value={stats?.pending_reviews || 0}
              subtitle="Sans réponse"
              icon={Clock}
              color="blue"
            />
            <StatsCard
              title="Taux de réponse"
              value={`${stats?.response_rate || 0}%`}
              subtitle="Réponses publiées"
              icon={TrendingUp}
              color="emerald"
            />
            <StatsCard
              title="Total avis"
              value={stats?.total_reviews || 0}
              subtitle="Tous importés"
              icon={MessageSquare}
              color="purple"
            />
          </div>

          {/* Sentiment + Reputation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Positifs', count: stats?.positive_count || 0, icon: ThumbsUp, color: 'emerald' },
              { label: 'Neutres', count: stats?.neutral_count || 0, icon: Minus, color: 'amber' },
              { label: 'Négatifs', count: stats?.negative_count || 0, icon: ThumbsDown, color: 'red' },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className="card p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${color === 'emerald' ? 'bg-emerald-500/10' : color === 'amber' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                  <Icon className={`w-5 h-5
                    ${color === 'emerald' ? 'text-emerald-400' : color === 'amber' ? 'text-amber-400' : 'text-red-400'}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{count}</p>
                  <p className="text-sm text-slate-400">{label}</p>
                </div>
              </div>
            ))}
            <ReputationScore
              score={stats?.reputation_score || 0}
              ratingTrend={stats?.rating_trend ?? null}
              averageRating={stats?.average_rating || 0}
              responseRate={stats?.response_rate || 0}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 7 derniers jours */}
            <div className="card p-6">
              <h3 className="text-base font-semibold text-white mb-6">Avis reçus — 7 derniers jours</h3>
              {stats?.weekly_data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats.weekly_data} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                      formatter={(v) => [v, 'Avis']}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avis" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-44 flex items-center justify-center text-slate-500 text-sm">Pas encore de données</div>
              )}
            </div>

            {/* Évolution mensuelle */}
            <div className="lg:col-span-2 card p-6">
              <h3 className="text-base font-semibold text-white mb-6">Évolution mensuelle</h3>
              {stats?.monthly_data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.monthly_data} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avis" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                  Pas encore de données
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="text-base font-semibold text-white mb-6">Sentiment global</h3>
              {stats?.total_reviews > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {sentimentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2">
                    {[{ label: 'Pos.', color: '#22c55e' }, { label: 'Neu.', color: '#f59e0b' }, { label: 'Nég.', color: '#ef4444' }].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-xs text-slate-400">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-sm">Pas encore de données</div>
              )}
            </div>
          </div>

          {/* Plan usage */}
          {stats?.usage && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold text-white">Utilisation du plan</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 capitalize">{stats.plan}</span>
                </div>
                {(stats.plan === 'free' || stats.plan === 'starter') && (
                  <Link to="/subscription" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Upgrader <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: 'Avis importés',
                    current: stats.usage.reviews.current,
                    limit: stats.usage.reviews.limit,
                    color: 'blue',
                  },
                  {
                    label: 'Réponses IA ce mois',
                    current: stats.usage.ai_responses.current,
                    limit: stats.usage.ai_responses.limit,
                    color: 'violet',
                  },
                ].map(({ label, current, limit, color }) => {
                  const unlimited = limit === -1;
                  const pct = unlimited ? 0 : Math.min((current / limit) * 100, 100);
                  const nearLimit = !unlimited && pct >= 80;
                  const atLimit = !unlimited && pct >= 100;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">{label}</span>
                        <span className={`font-medium ${atLimit ? 'text-red-400' : nearLimit ? 'text-amber-400' : 'text-slate-300'}`}>
                          {unlimited ? `${current} / ∞` : `${current} / ${limit}`}
                        </span>
                      </div>
                      <div className="bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            atLimit ? 'bg-red-500' : nearLimit ? 'bg-amber-500' :
                            color === 'blue' ? 'bg-blue-500' : 'bg-violet-500'
                          }`}
                          style={{ width: unlimited ? '100%' : `${pct}%`, opacity: unlimited ? 0.2 : 1 }}
                        />
                      </div>
                      {atLimit && (
                        <p className="text-xs text-red-400 mt-1">Limite atteinte — upgradez pour continuer</p>
                      )}
                      {nearLimit && !atLimit && (
                        <p className="text-xs text-amber-400 mt-1">Bientôt à la limite</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Derniers avis */}
          {stats?.recent_reviews?.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold text-white">Derniers avis reçus</h3>
                </div>
                <button onClick={() => navigate('/reviews')} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Voir tous <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {stats.recent_reviews.map((review) => {
                  const stars = review.rating || 0;
                  const statusColor = review.response_status === 'published' ? 'text-emerald-400 bg-emerald-500/10' :
                    review.final_text ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10';
                  const statusLabel = review.response_status === 'published' ? 'Publié' :
                    review.final_text ? 'Répondu' : 'En attente';
                  return (
                    <div key={review.id} onClick={() => navigate('/reviews')} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        stars >= 4 ? 'bg-emerald-500/20 text-emerald-400' :
                        stars === 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {stars}★
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">{review.author_name || 'Anonyme'}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusColor}`}>{statusLabel}</span>
                        </div>
                        {review.text && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{review.text}</p>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rating distribution */}
          {ratingDist.length > 0 && (
            <div className="card p-6">
              <h3 className="text-base font-semibold text-white mb-4">Distribution des notes</h3>
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const item = ratingDist.find((r) => r.rating === `${star}★`);
                  const count = item?.count || 0;
                  const pct = stats?.total_reviews ? Math.round((count / stats.total_reviews) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 w-8">{star}★</span>
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: star >= 4 ? '#22c55e' : star === 3 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-16 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
