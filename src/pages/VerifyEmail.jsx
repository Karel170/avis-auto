import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-3xl mb-4">⭐</div>
        <h1 className="text-xl font-bold text-white mb-6">AvisAuto</h1>

        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Vérification en cours…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Email confirmé !</h2>
            <p className="text-slate-400 mb-6">Votre adresse email est vérifiée. Vous pouvez utiliser AvisAuto sans restriction.</p>
            <Link to="/dashboard" className="btn-primary w-full block text-center">
              Accéder à mon espace →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Lien invalide</h2>
            <p className="text-slate-400 mb-6">Ce lien est invalide ou a déjà été utilisé.</p>
            <Link to="/dashboard" className="btn-primary w-full block text-center">
              Retour au dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
