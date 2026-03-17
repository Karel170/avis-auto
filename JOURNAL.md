# Journal — reprise demain

## Ce qui a été fait aujourd’hui

- Mise en place d’un fichier **`.env`** à la racine pour ne plus retaper les variables dans les terminaux.
- Ajout d’un guide de relance **`DEMARRAGE.md`**.
- L’API charge maintenant automatiquement le `.env` racine via `artifacts/api-server/src/index.ts`.
- Le frontend Vite est configuré pour tourner en local (ports par défaut + proxy `/api`).

## Fichiers importants (à conserver)

- `.env` : variables d’environnement (DB / OpenAI / Apify / ports)
- `DEMARRAGE.md` : commandes pour relancer les 2 terminaux
- `README.md` : doc projet

## Problème restant (si la DB ne marche pas)

Lors du `pnpm --filter @workspace/db run push`, l’erreur observée est :

- `Tenant or user not found`

👉 Cela indique presque toujours une **chaîne `DATABASE_URL` Supabase incorrecte** (mauvais user/host/port, mot de passe, ou chaîne pooler).

### À faire demain si besoin

Dans Supabase, récupérer la **chaîne de connexion** exacte :
- **Settings → Database → Connection string** (choisir **Transaction pooler** si vous utilisez le pooler)

Puis remplacer `DATABASE_URL` dans `.env` par celle fournie.

