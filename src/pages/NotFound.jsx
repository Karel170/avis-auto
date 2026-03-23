import { Link } from 'react-router-dom';
import { Star, ArrowLeft, Home } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function NotFound() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AvisAuto</span>
        </div>

        {/* 404 */}
        <div className="text-8xl font-black text-slate-800 mb-4 select-none leading-none">
          404
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Page introuvable
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée.<br />
          Retournez sur l'accueil pour continuer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            {isAuthenticated ? 'Tableau de bord' : 'Page d\'accueil'}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
