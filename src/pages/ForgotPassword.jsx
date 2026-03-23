import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../lib/api';
import { getErrorMessage } from '../lib/utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Star className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AvisAuto</h1>
          <p className="text-slate-400 mt-1">Réinitialisation du mot de passe</p>
        </div>

        <div className="card p-8">
          {sent ? (
            /* ── Confirmation state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Email envoyé !</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-2">
                Si un compte existe pour <strong className="text-slate-200">{email}</strong>, vous allez recevoir un email avec un lien de réinitialisation.
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Le lien est valable 1 heure. Vérifiez aussi vos spams si vous ne le voyez pas.
              </p>
              <Link to="/login" className="btn-primary inline-flex justify-center">
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Mot de passe oublié ?</h2>
              <p className="text-slate-400 text-sm mb-6">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      className="input pl-10"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                  ) : (
                    <>Envoyer le lien <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
