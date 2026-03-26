import { useState } from 'react';
import { Mail, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function EmailVerificationBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await api.post('/auth/resend-verification');
      toast.success('Email de vérification renvoyé !');
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-200 flex-1">
          Confirmez votre adresse email pour sécuriser votre compte.{' '}
          <button
            onClick={handleResend}
            disabled={sending}
            className="underline font-medium hover:text-white transition-colors inline-flex items-center gap-1"
          >
            {sending && <Loader2 className="w-3 h-3 animate-spin" />}
            Renvoyer l'email
          </button>
        </p>
        <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
