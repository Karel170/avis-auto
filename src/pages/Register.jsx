import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Mail, Lock, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../lib/api';
import useAuthStore from '../store/authStore';
import { getErrorMessage, SECTORS } from '../lib/utils';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', companyName: '', sector: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      login(res.data);
      toast.success('Compte créé avec succès !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Star className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AvisAuto</h1>
          <p className="text-slate-400 mt-1">Créez votre compte gratuitement</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Inscription</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Votre nom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Jean Dupont"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

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
                  placeholder="8 caractères minimum"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-3">Informations entreprise (optionnel)</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Nom de l'entreprise</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      className="input pl-10"
                      placeholder="Mon Entreprise"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Secteur d'activité</label>
                  <select
                    className="input"
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  >
                    <option value="">Sélectionner un secteur</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
              ) : (
                <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
