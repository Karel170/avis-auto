import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return 'Date inconnue';
  return format(new Date(date), 'dd MMM yyyy', { locale: fr });
}

export function formatRelativeDate(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function getErrorMessage(error) {
  return error?.response?.data?.error || error?.message || 'Une erreur est survenue';
}

export const TONES = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'friendly', label: 'Chaleureux' },
  { value: 'formal', label: 'Formel' },
  { value: 'casual', label: 'Décontracté' },
  { value: 'empathetic', label: 'Empathique' },
];

export const SECTORS = [
  'Restaurant', 'Hôtel', 'Commerce de détail', 'Services', 'Santé',
  'Beauté & Bien-être', 'Automobile', 'Immobilier', 'Tourisme', 'Autre',
];

export function getRatingColor(rating) {
  if (rating >= 4) return 'text-emerald-400';
  if (rating === 3) return 'text-amber-400';
  return 'text-red-400';
}

export function getSentimentConfig(sentiment) {
  const configs = {
    positive: { label: 'Positif', color: 'text-emerald-400', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    neutral: { label: 'Neutre', color: 'text-amber-400', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    negative: { label: 'Négatif', color: 'text-red-400', bg: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };
  return configs[sentiment] || configs.neutral;
}

export function getStatusConfig(status) {
  const configs = {
    pending: { label: 'En attente', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    responded: { label: 'Répondu (brouillon)', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    published: { label: 'Publié', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };
  return configs[status] || configs.pending;
}
