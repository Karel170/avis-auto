import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem('cookie_consent');
    if (!choice) {
      // Petit délai pour ne pas apparaître instantanément
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[100] animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Cookie className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white mb-0.5">Cookies & confidentialité</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nous utilisons des cookies essentiels au fonctionnement du service.{' '}
              <Link to="/legal" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                En savoir plus
              </Link>
            </p>
          </div>
          <button
            onClick={decline}
            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 flex-shrink-0 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={decline}
            className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-3 h-3" />
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
