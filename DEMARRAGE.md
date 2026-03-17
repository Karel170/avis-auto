# Démarrer AVISAUTO demain (terminaux intacts)

Tout est sauvegardé dans le fichier **`.env`** à la racine. Plus besoin de retaper les variables dans le terminal.

## 1. Terminal 1 — API

```bash
cd c:\Users\paink\Desktop\avis-auto
pnpm --filter @workspace/api-server run dev
```

Attendre : `Server listening on port 5000`

## 2. Terminal 2 — Frontend

```bash
cd c:\Users\paink\Desktop\avis-auto
pnpm --filter @workspace/avisauto run dev
```

Puis ouvrir : **http://localhost:5173**

---

**Rappel :** Si vous changez le mot de passe Supabase ou la clé OpenAI, mettez à jour le fichier `.env` (à la racine du projet).
