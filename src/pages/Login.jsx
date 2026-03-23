import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import { getErrorMessage } from '../lib/utils';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Star className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AvisAuto</h1>
          <p className="text-slate-400 mt-1">Gérez vos avis Google automatiquement</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-6" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <Link
              to="/forgot-password"
              className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
            <p className="text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
