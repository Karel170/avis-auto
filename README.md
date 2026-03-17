# AVISAUTO.fr — SaaS Réponses IA pour Avis Google

SaaS professionnel 100% en français pour gérer et répondre automatiquement aux avis Google grâce à l'IA.

## Fonctionnalités

- **Auth** : Inscription / connexion par session
- **Synchronisation** : Import des avis Google depuis Apify
- **Génération IA** : Réponses personnalisées en français (OpenAI)
- **Sentiment** : Détection automatique positif / neutre / négatif
- **Personnalisation** : Tons (chaleureux, professionnel, direct), longueurs, styles
- **Reformulation** : 3 variantes selon vos instructions
- **Publication** : Publier sur Google (1-clic, prêt pour l’API)
- **Statistiques** : Graphiques et métriques
- **Admin** : Dashboard multi-clients
- **Abonnements** : Plans Starter, Pro, Agency (Stripe)

## Prérequis

- **Node.js** 24+
- **pnpm** (gestionnaire de paquets)
- **PostgreSQL** (ou [Supabase](https://supabase.com) pour une base managée)
- **Compte OpenAI** (clé API)
- **Dataset Apify** pour les avis Google

## Installation

### 1. Cloner et installer

```bash
cd avis-auto
pnpm install
```

### 2. Configuration des variables d'environnement

Copier `.env.example` en `.env` et remplir :

```bash
cp .env.example .env
```

**Variables principales :**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL (Supabase : Paramètres > Base de données > URI) |
| `SESSION_SECRET` | Secret pour les sessions (à générer en production) |
| `OPENAI_API_KEY` | Clé API OpenAI (platform.openai.com) |
| `APIFY_DATASET_URL` | URL du dataset Apify des avis Google (optionnel, peut être défini par entreprise) |

**Exemple Supabase :**  
`DATABASE_URL=postgresql://postgres.xxx:xxx@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`

### 3. Initialiser la base de données

```bash
pnpm --filter @workspace/db run push
```

### 4. Lancer l’application

**Terminal 1 — Backend (API) :**
```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Frontend :**
```bash
pnpm --filter @workspace/avisauto run dev
```

L’interface est disponible sur **http://localhost:5173**  
L’API écoute sur **http://localhost:5000**

### 5. Premier utilisateur

- Créer un compte via `/register`
- Se connecter et configurer une entreprise (Paramètres > URL Apify)

Ou utiliser les données de seed (si présentes) :  
`admin@hbc-thionville.fr` / `Admin2024!`

## Structure du projet

```
avis-auto/
├── artifacts/
│   ├── api-server/     # API Express
│   └── avisauto/       # Frontend React + Vite
├── lib/
│   ├── db/             # Schéma Drizzle + migrations
│   ├── api-spec/       # Spec OpenAPI
│   ├── api-zod/        # Schémas Zod générés
│   └── api-client-react/ # Client React Query généré
└── scripts/
```

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `pnpm build` | Build complet |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm --filter @workspace/db run push` | Appliquer les migrations |
| `pnpm --filter @workspace/api-spec run codegen` | Régénérer le client API |

## Déploiement

- **Replit** : Config `.replit` fournie, variables à définir dans Secrets
- **VPS / Docker** : Builder le frontend, servir l’API + fichiers statiques

## Licence

MIT
