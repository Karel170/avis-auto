import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../lib/api';
import { getErrorMessage } from '../lib/utils';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">Lien invalide ou expiré.</p>
          <Link to="/forgot-password" className="btn-primary inline-flex justify-center">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      setDone(true);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg?.includes('invalide') || msg?.includes('expiré')) {
        toast.error('Ce lien est invalide ou a expiré. Demandez-en un nouveau.');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              <Star className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AvisAuto</h1>
          </Link>
          <p className="text-slate-400 mt-1">Choisir un nouveau mot de passe</p>
        </div>

        <div className="card p-8">
          {done ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Mot de passe mis à jour !</h2>
              <p className="text-slate-400 text-sm mb-6">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary inline-flex justify-center w-full"
              >
                <ArrowRight className="w-4 h-4" />
                Se connecter
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Nouveau mot de passe</h2>
              <p className="text-slate-400 text-sm mb-6">
                Choisissez un mot de passe sécurisé d'au moins 8 caractères.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoFocus
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10"
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      required
                      minLength={8}
                    />
                  </div>
                  {form.confirm && form.password !== form.confirm && (
                    <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                {/* Password strength indicator */}
                {form.password && (
                  <div>
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          form.password.length >= i * 3
                            ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-blue-500' : 'bg-emerald-500'
                            : 'bg-slate-700'
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {form.password.length < 8 ? 'Trop court' : form.password.length < 10 ? 'Correct' : form.password.length < 12 ? 'Bon' : 'Excellent'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full justify-center mt-2"
                  disabled={loading || (form.confirm && form.password !== form.confirm)}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Mise à jour...</>
                  ) : (
                    <>Définir le nouveau mot de passe <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
