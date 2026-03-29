import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Loader2, AlertTriangle, Zap, Lock,
  ChevronRight, BarChart2, Lightbulb, Target, Users,
  Wrench, MessageCircle, Building2, RefreshCw, Trophy, Star, ThumbsUp, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { companiesApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import { cn } from '../lib/utils';
import { printInsights } from '../lib/printUtils';

const SEVERITY_CONFIG = {
  high: { label: 'Critique', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
  medium: { label: 'Modéré', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  low: { label: 'Mineur', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
};

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  important: { label: 'Important', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  'suggéré': { label: 'Suggéré', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

const CATEGORY_ICONS = {
  Formation: Users,
  Process: Wrench,
  Communication: MessageCircle,
  Service: Target,
  Infrastructure: Building2,
};

function StrengthCard({ strength, index }) {
  return (
    <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-emerald-800/60">#{index + 1}</span>
          <h3 className="text-sm font-semibold text-white">{strength.name}</h3>
        </div>
        <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full flex-shrink-0">
          {strength.count} mentions
        </span>
      </div>
      {strength.highlight && (
        <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
          <ThumbsUp className="w-3 h-3 flex-shrink-0" />
          {strength.highlight}
        </p>
      )}
      {strength.examples && strength.examples.length > 0 && (
        <div className="space-y-1.5">
          {strength.examples.slice(0, 2).map((ex, i) => (
            <p key={i} className="text-xs text-slate-400 italic border-l-2 border-emerald-600/40 pl-2">
              "{ex}"
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeCard({ theme, index }) {
  const config = SEVERITY_CONFIG[theme.severity] || SEVERITY_CONFIG.medium;
  return (
    <div className={cn('p-4 rounded-xl border', config.bg, config.border)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-500">#{index + 1}</span>
          <h3 className="text-sm font-semibold text-white">{theme.name}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', config.bg, config.border, config.color)}>
            {config.label}
          </span>
          <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
            {theme.count} avis
          </span>
        </div>
      </div>
      {theme.examples && theme.examples.length > 0 && (
        <div className="space-y-1.5">
          {theme.examples.slice(0, 2).map((ex, i) => (
            <p key={i} className="text-xs text-slate-400 italic border-l-2 border-slate-600 pl-2">
              "{ex}"
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ rec }) {
  const priorityConfig = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG['suggéré'];
  const Icon = CATEGORY_ICONS[rec.category] || Lightbulb;
  return (
    <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', priorityConfig.bg, priorityConfig.color)}>
              {priorityConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
          <span className="inline-block mt-2 text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-md">
            {rec.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Insights() {
  const { company } = useAuthStore();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  const isBusinessPlan = company?.plan === 'business';

  const { mutate: runAnalysis, isPending } = useMutation({
    mutationFn: () => companiesApi.analyse(company.id),
    onSuccess: (res) => {
      setAnalysis(res.data);
      if (res.data.review_count === 0 && (res.data.positive_count ?? 0) === 0) {
        toast('Aucun avis avec commentaire trouvé.', { icon: 'ℹ️' });
      } else {
        toast.success(`Analyse terminée — ${(res.data.positive_count ?? 0) + (res.data.review_count ?? 0)} avis analysés`);
      }
    },
    onError: () => toast.error('Erreur lors de l\'analyse'),
  });

  if (!isBusinessPlan) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Analyse & Recommandations</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Identifiez les points forts de votre établissement, les thèmes récurrents dans vos avis négatifs, et obtenez un plan d'action personnalisé.
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Passer au plan Business
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            Analyse & Recommandations
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Points forts, problèmes récurrents et plan d'action personnalisé.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <button
              onClick={() => printInsights(analysis, company?.name)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-colors"
              title="Imprimer le rapport"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          )}
          <button
            onClick={() => runAnalysis()}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyse en cours…</>
            ) : (
              <><RefreshCw className="w-4 h-4" /> {analysis ? 'Relancer l\'analyse' : 'Lancer l\'analyse'}</>
            )}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!analysis && !isPending && (
        <div className="text-center py-16 border border-dashed border-slate-700 rounded-2xl">
          <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">
            Lancez l'analyse pour découvrir vos points forts,<br />
            les thèmes récurrents et recevoir des recommandations.
          </p>
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <div className="text-center py-16">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Analyse de vos avis en cours…</p>
          <p className="text-slate-600 text-xs mt-1">Cela peut prendre quelques secondes</p>
        </div>
      )}

      {/* Results */}
      {analysis && !isPending && (
        <>
          {/* Summary */}
          {analysis.summary && (
            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Résumé</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {(analysis.positive_count ?? 0) > 0 && (
                      <p className="text-xs text-emerald-500/80">
                        {analysis.positive_count} avis positifs analysés
                      </p>
                    )}
                    {(analysis.review_count ?? 0) > 0 && (
                      <p className="text-xs text-slate-500">
                        {analysis.review_count} avis négatifs analysés
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Points forts */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                Points forts de votre établissement
                <span className="ml-auto text-xs text-emerald-500/70 font-normal flex items-center gap-1">
                  <Star className="w-3 h-3" /> Ce que vos clients adorent
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.strengths.map((strength, i) => (
                  <StrengthCard key={i} strength={strength} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* ⚠️ Thèmes négatifs */}
          {analysis.themes && analysis.themes.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Thèmes récurrents à améliorer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.themes.map((theme, i) => (
                  <ThemeCard key={i} theme={theme} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* 💡 Recommandations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Plan d'action personnalisé
              </h2>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <RecommendationCard key={i} rec={rec} />
                ))}
              </div>
            </div>
          )}

          {analysis.review_count === 0 && (analysis.positive_count ?? 0) === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-700 rounded-2xl">
              <p className="text-slate-400 text-sm">Aucun avis avec commentaire trouvé.<br />Synchronisez vos avis d'abord.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
