import { cn } from '../lib/utils';

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) {
  const colors = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="card p-5 hover:border-slate-600/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', c.bg, c.border)}>
          {Icon && <Icon className={cn('w-5 h-5', c.text)} />}
        </div>
        {trend !== undefined && (
          <span className={cn('text-xs font-medium px-2 py-1 rounded-full',
            trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-slate-300">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
