# AVISAUTO.fr - SaaS de Gestion d'Avis Google avec IA

## Overview

SaaS professionnel 100% en français pour aider les commerçants à gérer et répondre automatiquement à leurs avis Google grâce à l'IA. Premier client: HYGIENE BEAUTE CLEMENT HBC (Thionville).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 + Session auth (express-session)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **AI**: OpenAI via Replit AI Integrations (gpt-5-mini)
- **Review source**: Apify dataset API

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── avisauto/           # React + Vite frontend SaaS
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

Tables:
- `users` - Utilisateurs (admin, user roles)
- `companies` - Entreprises/commerçants
- `reviews` - Avis Google synchronisés depuis Apify
- `ai_responses` - Réponses générées par l'IA
- `templates` - Modèles de réponses personnalisables
- `subscriptions` - Abonnements Stripe

## Seed Data

- Admin user: `admin@hbc-thionville.fr` / `Admin2024!`
- Company: HYGIENE BEAUTE CLEMENT HBC (8 Rue Maréchal Joffre, 57100 Thionville)
- 3 modèles de réponses par défaut

## API Routes

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur courant
- `GET /api/companies/:id` - Détails entreprise
- `PUT /api/companies/:id` - Modifier entreprise
- `POST /api/companies/:id/sync` - Synchroniser avis depuis Apify
- `GET /api/companies/:id/reviews` - Liste des avis (filtres)
- `POST /api/companies/:id/reviews/generate-all` - Générer réponses IA pour tous les nouveaux
- `POST /api/companies/:id/reviews/publish-all` - Publier toutes les réponses en attente
- `POST /api/companies/:id/reviews/:reviewId/generate` - Générer réponse IA
- `POST /api/companies/:id/reviews/:reviewId/reformulate` - Reformuler (3 variantes)
- `POST /api/companies/:id/reviews/:reviewId/save-response` - Sauvegarder réponse finale
- `POST /api/companies/:id/reviews/:reviewId/publish` - Publier sur Google
- `GET /api/companies/:id/stats` - Statistiques
- `GET /api/companies/:id/ai-responses` - Réponses IA
- `GET /api/companies/:id/templates` - Modèles
- `GET /api/companies/:id/subscription` - Abonnement
- `GET /api/admin/companies` - Admin: toutes les entreprises
- `GET /api/admin/stats` - Admin: statistiques globales

## Frontend Pages

- `/` → Redirect vers /login ou /dashboard
- `/login` - Connexion
- `/register` - Inscription
- `/dashboard` - Tableau de bord avec métriques
- `/avis` - Tableau des avis Google avec filtres et modales IA
- `/reponses-ia` - Liste des réponses IA
- `/modeles` - Gestion des modèles de réponses
- `/stats` - Statistiques et graphiques
- `/parametres` - Paramètres entreprise + abonnement
- `/admin` - Dashboard admin multi-clients

## Features

- Auth par session cookie (express-session)
- Synchronisation avis depuis Apify (manuelle + planifiable)
- Génération IA en français (OpenAI gpt-5-mini via Replit AI Integrations)
- Détection automatique du sentiment (positif/neutre/négatif)
- 3 tons: chaleureux, professionnel, direct
- 3 longueurs: court, moyen, long
- 4 styles: remerciement, excuse, résolution, neutre
- Reformulation avec instructions utilisateur (3 variantes)
- Publication 1-clic (simulée, prête pour Google Business Profile API)
- Mode clair/sombre
- Design responsive
- Admin dashboard multi-clients
- Abonnements (Starter 29€, Pro 79€, Agency 199€)

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI proxy URL (Replit AI Integrations)
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key (Replit AI Integrations)
- `SESSION_SECRET` - Secret pour les sessions Express (défaut: dev secret)
- `PORT` - Port du serveur (auto-assigné par Replit)

## Commands

- `pnpm --filter @workspace/api-server run dev` — Démarrer le backend
- `pnpm --filter @workspace/avisauto run dev` — Démarrer le frontend
- `pnpm --filter @workspace/db run push` — Appliquer les migrations DB
- `pnpm --filter @workspace/api-spec run codegen` — Régénérer les types API
