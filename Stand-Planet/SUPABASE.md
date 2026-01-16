# 🚀 GUIDE SUPABASE - Stand-Planet

Ce guide détaille l'intégration complète de Supabase pour Stand-Planet.

---

## 📋 TABLE DES MATIÈRES

1. [Création du projet Supabase](#1-création-du-projet-supabase)
2. [Configuration des variables d'environnement](#2-configuration-des-variables-denvironnement)
3. [Schéma de base de données](#3-schéma-de-base-de-données)
4. [Row Level Security (RLS)](#4-row-level-security-rls)
5. [Storage (Fichiers)](#5-storage-fichiers)
6. [Authentification](#6-authentification)
7. [Migrations](#7-migrations)
8. [Déploiement Railway](#8-déploiement-railway)
9. [Tests](#9-tests)

---

## 1. CRÉATION DU PROJET SUPABASE

### Étape 1.1: Créer un compte Supabase

1. Aller sur https://supabase.com
2. Cliquer sur "Start your project"
3. Se connecter avec GitHub (recommandé)

### Étape 1.2: Créer un nouveau projet

```bash
Project Name: stand-planet-prod  (ou -dev pour développement)
Database Password: [Générer un mot de passe fort - NOTER QUELQUE PART]
Region: Europe (eu-central-1) ou nearest to users
```

⏱️ **Temps d'attente**: ~2 minutes pour provisioning

### Étape 1.3: Noter les credentials

Une fois le projet créé, aller dans **Settings** > **API**:

```
Project URL: https://[your-project-ref].supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ⚠️ PRIVÉ
```

Aller dans **Settings** > **Database**:

```
Connection String (URI):
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

Connection Pooler (pour Railway, recommandé):
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## 2. CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

### Étape 2.1: Créer le fichier .env local

```bash
cd Stand-Planet
cp .env.example .env
```

### Étape 2.2: Remplir .env avec les vraies valeurs

```env
# Supabase
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # SECRET!

# Database (Pooler pour Railway)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

# Session (générer avec: openssl rand -hex 64)
SESSION_SECRET=[64-char-random-hex]

# Environment
NODE_ENV=development
```

### Étape 2.3: Générer SESSION_SECRET

```bash
# Sur Linux/Mac
openssl rand -hex 64

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou avec Node
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3. SCHÉMA DE BASE DE DONNÉES

### Étape 3.1: Ouvrir SQL Editor dans Supabase

Dashboard > **SQL Editor** > New Query

### Étape 3.2: Créer les tables

Copier-coller ce SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password TEXT, -- For backward compat (prefer Supabase Auth)
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'designer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: booths (stands)
CREATE TABLE IF NOT EXISTS booths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  configuration_json JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  booth_id UUID REFERENCES booths(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_booths_event ON booths(event_id);
CREATE INDEX idx_booths_user ON booths(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_booth ON orders(booth_id);

-- Trigger: Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booths_updated_at BEFORE UPDATE ON booths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Cliquer sur **Run** ✅

---

## 4. ROW LEVEL SECURITY (RLS)

### ⚠️ IMPORTANT: Activer RLS sur toutes les tables

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### Policies: users

```sql
-- Users: tout le monde peut lire les profils publics
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users: les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users: seuls les admins peuvent créer des users (ou via Supabase Auth)
CREATE POLICY "Only admins can create users"
  ON users FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.uid() = id  -- Allow self-registration
  );
```

### Policies: events

```sql
-- Events: tout le monde peut lire les events publiés
CREATE POLICY "Published events are viewable by everyone"
  ON events FOR SELECT
  USING (status = 'published' OR organizer_id = auth.uid());

-- Events: seuls les organisateurs peuvent créer des events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

-- Events: seuls les organisateurs peuvent modifier leurs events
CREATE POLICY "Organizers can update own events"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid());

-- Events: seuls les organisateurs peuvent supprimer leurs events
CREATE POLICY "Organizers can delete own events"
  ON events FOR DELETE
  USING (organizer_id = auth.uid());
```

### Policies: booths

```sql
-- Booths: les stands sont visibles par leur propriétaire et les admins
CREATE POLICY "Users can view own booths"
  ON booths FOR SELECT
  USING (
    user_id = auth.uid()
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Booths: les utilisateurs authentifiés peuvent créer des stands
CREATE POLICY "Authenticated users can create booths"
  ON booths FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Booths: les propriétaires peuvent modifier leurs stands
CREATE POLICY "Users can update own booths"
  ON booths FOR UPDATE
  USING (user_id = auth.uid());

-- Booths: les propriétaires peuvent supprimer leurs stands
CREATE POLICY "Users can delete own booths"
  ON booths FOR DELETE
  USING (user_id = auth.uid());
```

### Policies: orders

```sql
-- Orders: les commandes sont visibles par leur propriétaire
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

-- Orders: les utilisateurs authentifiés peuvent créer des commandes
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Orders: seuls les admins peuvent modifier les commandes (statut, etc.)
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 5. STORAGE (Fichiers)

### Étape 5.1: Créer les buckets

Dashboard > **Storage** > Create bucket:

1. **Bucket: `public`**
   - Public bucket: ✅ ON
   - Allowed MIME types: `image/*,video/*`
   - Max file size: 50 MB

2. **Bucket: `private`**
   - Public bucket: ❌ OFF
   - Allowed MIME types: `image/*,video/*,application/pdf`
   - Max file size: 100 MB

3. **Bucket: `avatars`** (optionnel)
   - Public bucket: ✅ ON
   - Allowed MIME types: `image/*`
   - Max file size: 5 MB

### Étape 5.2: Policies Storage

```sql
-- Public bucket: tout le monde peut lire, seuls auth peuvent upload
CREATE POLICY "Public files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public');

CREATE POLICY "Authenticated users can upload to public"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public');

CREATE POLICY "Users can update own public files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own public files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Private bucket: seul le propriétaire peut accéder
CREATE POLICY "Users can view own private files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'private' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload to own private folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'private' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 6. AUTHENTIFICATION

### Étape 6.1: Configuration Email Auth

Dashboard > **Authentication** > Providers:

1. **Email** (activé par défaut)
   - Email confirmation: ✅ ON (recommandé)
   - Secure email change: ✅ ON

2. **Configurer Email Templates** (optionnel):
   - Dashboard > **Authentication** > Email Templates
   - Personnaliser les emails de confirmation, reset password, etc.

### Étape 6.2: URL de redirection autorisées

Dashboard > **Authentication** > URL Configuration:

```
Site URL: https://yourdomain.com
Redirect URLs:
  - http://localhost:5000/auth/callback
  - https://yourdomain.com/auth/callback
  - https://stand-planet-prod.up.railway.app/auth/callback (Railway)
```

### Étape 6.3: Tester l'auth localement

```bash
npm run dev

# Dans le navigateur:
# 1. Aller sur /register
# 2. Créer un compte test@example.com
# 3. Vérifier email de confirmation
# 4. Se connecter
```

---

## 7. MIGRATIONS

### Étape 7.1: Installer Drizzle Kit

```bash
npm install -D drizzle-kit
```

### Étape 7.2: Configurer drizzle.config.ts

Le fichier `drizzle.config.ts` est déjà configuré pour PostgreSQL:

```typescript
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts", // PostgreSQL schema
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Étape 7.3: Générer une migration

```bash
npm run db:generate
```

Cela crée un fichier dans `/migrations/` avec les changements de schéma.

### Étape 7.4: Appliquer la migration

```bash
npm run db:push
```

⚠️ **Note**: Pour la première migration, utilisez plutôt le SQL direct (section 3) car Drizzle peut avoir des conflits avec les tables déjà créées.

---

## 8. DÉPLOIEMENT RAILWAY

Voir le fichier `RAILWAY.md` pour la configuration complète Railway + Supabase.

**Résumé rapide**:

1. Créer un nouveau projet Railway
2. Ajouter les variables d'environnement:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   DATABASE_URL=... (Connection Pooler)
   SESSION_SECRET=...
   NODE_ENV=production
   ```

3. Déployer:
   ```bash
   railway up
   ```

---

## 9. TESTS

### Tester la connexion à la BDD

```bash
# Test connection
npm run db:check
```

Ou créer un script de test:

```typescript
// test-supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testConnection() {
  const { data, error } = await supabase.from('users').select('count');

  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connected to Supabase!', data);
  }
}

testConnection();
```

```bash
tsx test-supabase.ts
```

### Tester l'authentification

```typescript
// test-auth.ts
import { supabase } from './client/src/lib/supabase';

async function testAuth() {
  // Sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'SecurePassword123!'
  });

  if (signUpError) {
    console.error('❌ Sign up failed:', signUpError);
  } else {
    console.log('✅ Sign up successful:', signUpData.user?.email);
  }

  // Sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'SecurePassword123!'
  });

  if (signInError) {
    console.error('❌ Sign in failed:', signInError);
  } else {
    console.log('✅ Sign in successful, token:', signInData.session?.access_token?.substring(0, 20) + '...');
  }
}

testAuth();
```

---

## 🎯 CHECKLIST COMPLÈTE

- [ ] Projet Supabase créé
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Tables créées (users, events, booths, orders)
- [ ] RLS activé sur toutes les tables
- [ ] Policies RLS créées
- [ ] Buckets Storage créés (public, private)
- [ ] Policies Storage créées
- [ ] Email Auth configuré
- [ ] URL de redirection configurées
- [ ] Test connexion BDD réussi
- [ ] Test authentification réussi
- [ ] Déployé sur Railway avec Supabase
- [ ] Variables Railway configurées

---

## 📚 RESSOURCES

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Railway Docs](https://docs.railway.app)

---

**Date**: 2026-01-16
**Version**: 1.0
**Statut**: Configuration Production-Ready
