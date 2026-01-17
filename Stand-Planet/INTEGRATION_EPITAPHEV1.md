# 🔗 Intégration Stand-Planet dans epitaphev1

**Objectif**: Intégrer Stand-Planet comme module du projet epitaphev1, en partageant la même base de données Supabase.

**Avantages**:
- ✅ **Un seul projet Supabase** (pas de duplication)
- ✅ **Authentification partagée** (SSO entre modules)
- ✅ **Base de données unifiée** (cohérence des données)
- ✅ **Coûts réduits** (un seul plan Supabase)
- ✅ **Gestion simplifiée** (un seul dashboard)

---

## 📋 Prérequis

- ✅ Projet Supabase `epitaphev1` existant
- ✅ Accès admin au projet (clés API)
- ✅ Base de données PostgreSQL configurée

---

## 🏗️ Architecture Intégrée

### Vue d'ensemble:

```
epitaphev1 (Projet Supabase)
├── Auth (Partagé)
│   └── Users (epitaphev1 + Stand-Planet)
├── Database
│   ├── Tables epitaphev1 (existantes)
│   └── Tables Stand-Planet (nouvelles) ✅
│       ├── stand_events
│       ├── stand_booths
│       ├── stand_orders
│       ├── stand_configurations
│       └── stand_assets
├── Storage
│   ├── Buckets epitaphev1 (existants)
│   └── 3d-models (nouveau) ✅
└── API (partagé)
```

**Principe**: Stand-Planet utilise les **mêmes clés API** et la **même auth** qu'epitaphev1, mais avec des **tables préfixées** `stand_*` pour éviter les conflits.

---

## 🔑 Étape 1: Récupérer les Clés epitaphev1

### 1.1 Dashboard Supabase epitaphev1

```
1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet "epitaphev1"
3. Project Settings (⚙️) → API
4. Copier:
   - Project URL: https://xxxxx.supabase.co
   - anon public key: eyJhbGc...
   - service_role key: eyJhbGc...
```

### 1.2 Créer `.env` pour Stand-Planet

```bash
# .env (à la racine de Stand-Planet)

# === Supabase epitaphev1 (Partagé) ===
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...votre_anon_key_ici...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre_service_role_key_ici...

# === Stand-Planet Configuration ===
# Bucket pour modèles 3D Stand-Planet
VITE_SUPABASE_3D_MODELS_BUCKET=3d-models

# Base de données (Connection Pooler recommandé pour production)
DATABASE_URL=postgresql://postgres.xxxxx:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

# Mode d'intégration
VITE_INTEGRATED_MODE=true
VITE_PARENT_PROJECT=epitaphev1
```

---

## 🗄️ Étape 2: Ajouter les Tables Stand-Planet

### 2.1 Créer le Schéma Stand-Planet

**Fichier**: `supabase/migrations/001_stand_planet_schema.sql`

```sql
-- ============================================
-- STAND-PLANET MODULE SCHEMA
-- Module du projet epitaphev1
-- Préfixe: stand_*
-- ============================================

-- Enable UUID extension si pas déjà activé
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: stand_events (Salons d'exposition)
-- ============================================
CREATE TABLE IF NOT EXISTS stand_events (
  id SERIAL PRIMARY KEY,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  floor_plan_json JSONB, -- Plan du salon
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_stand_events_organizer ON stand_events(organizer_id);
CREATE INDEX idx_stand_events_dates ON stand_events(start_date, end_date);

-- ============================================
-- Table: stand_booths (Stands)
-- ============================================
CREATE TABLE IF NOT EXISTS stand_booths (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES stand_events(id) ON DELETE CASCADE,
  exhibitor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dimensions_json JSONB, -- {width: 6, depth: 3}
  position_json JSONB, -- {x: 10, y: 10}
  configuration_id INTEGER, -- Référence à stand_configurations
  price DECIMAL(10, 2),
  status TEXT DEFAULT 'draft', -- draft, confirmed, built, dismantled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stand_booths_event ON stand_booths(event_id);
CREATE INDEX idx_stand_booths_exhibitor ON stand_booths(exhibitor_id);

-- ============================================
-- Table: stand_configurations (Configs 3D)
-- ============================================
CREATE TABLE IF NOT EXISTS stand_configurations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  dimensions_json JSONB, -- {width: 6, depth: 3}
  modules_json JSONB, -- Array des modules placés
  background_color TEXT DEFAULT '#f5f5f5',
  floor_material_json JSONB,
  style TEXT, -- modern, luxury, industrial, minimal, creative
  industry TEXT,
  total_price DECIMAL(10, 2),
  tags TEXT[], -- Array de tags pour recherche
  is_template BOOLEAN DEFAULT FALSE, -- Template partagé ?
  is_public BOOLEAN DEFAULT FALSE, -- Visible par tous ?
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stand_configs_user ON stand_configurations(user_id);
CREATE INDEX idx_stand_configs_template ON stand_configurations(is_template);
CREATE INDEX idx_stand_configs_tags ON stand_configurations USING GIN(tags);

-- ============================================
-- Table: stand_orders (Commandes)
-- ============================================
CREATE TABLE IF NOT EXISTS stand_orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booth_id INTEGER REFERENCES stand_booths(id) ON DELETE SET NULL,
  configuration_id INTEGER REFERENCES stand_configurations(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, in_production, shipped, completed, cancelled
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  items_json JSONB, -- Détails des items commandés
  shipping_address_json JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stand_orders_user ON stand_orders(user_id);
CREATE INDEX idx_stand_orders_status ON stand_orders(status);

-- ============================================
-- Table: stand_assets (Assets 3D/Images)
-- ============================================
CREATE TABLE IF NOT EXISTS stand_assets (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- logo, image, texture, video, document, model_3d
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Chemin dans Supabase Storage
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER, -- Pour images
  height INTEGER, -- Pour images
  url TEXT NOT NULL, -- URL publique Supabase
  thumbnail_url TEXT,
  metadata_json JSONB, -- Métadonnées supplémentaires
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stand_assets_user ON stand_assets(user_id);
CREATE INDEX idx_stand_assets_type ON stand_assets(type);

-- ============================================
-- Table: stand_modules_library (Bibliothèque modules)
-- ============================================
CREATE TABLE IF NOT EXISTS stand_modules_library (
  id SERIAL PRIMARY KEY,
  module_id TEXT UNIQUE NOT NULL, -- struct-001, furn-002, etc.
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- structure, wall, furniture, lighting, etc.
  subcategory TEXT,
  description TEXT,
  gltf_path TEXT, -- Chemin Supabase Storage
  thumbnail_url TEXT,
  dimensions_json JSONB, -- {width, height, depth}
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  metadata_json JSONB, -- Specs techniques, matériaux, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_category ON stand_modules_library(category);
CREATE INDEX idx_modules_active ON stand_modules_library(is_active);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE stand_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stand_booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE stand_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stand_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stand_modules_library ENABLE ROW LEVEL SECURITY;

-- Policies stand_events (Les organisateurs voient leurs événements)
CREATE POLICY "Users can view their own events"
  ON stand_events FOR SELECT
  USING (auth.uid() = organizer_id OR true); -- Public en lecture

CREATE POLICY "Users can create events"
  ON stand_events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their events"
  ON stand_events FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their events"
  ON stand_events FOR DELETE
  USING (auth.uid() = organizer_id);

-- Policies stand_booths
CREATE POLICY "Users can view booths"
  ON stand_booths FOR SELECT
  USING (auth.uid() = exhibitor_id OR true); -- Public

CREATE POLICY "Users can create booths"
  ON stand_booths FOR INSERT
  WITH CHECK (auth.uid() = exhibitor_id);

CREATE POLICY "Users can update their booths"
  ON stand_booths FOR UPDATE
  USING (auth.uid() = exhibitor_id);

-- Policies stand_configurations
CREATE POLICY "Users can view public configs"
  ON stand_configurations FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create configs"
  ON stand_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their configs"
  ON stand_configurations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their configs"
  ON stand_configurations FOR DELETE
  USING (auth.uid() = user_id);

-- Policies stand_orders
CREATE POLICY "Users can view their orders"
  ON stand_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON stand_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their orders"
  ON stand_orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies stand_assets
CREATE POLICY "Users can view their assets"
  ON stand_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload assets"
  ON stand_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their assets"
  ON stand_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their assets"
  ON stand_assets FOR DELETE
  USING (auth.uid() = user_id);

-- Policies stand_modules_library (Lecture publique, Admin write)
CREATE POLICY "Anyone can view active modules"
  ON stand_modules_library FOR SELECT
  USING (is_active = true);

-- Admin insert/update (à ajuster selon votre logique admin epitaphev1)
CREATE POLICY "Admins can manage modules"
  ON stand_modules_library FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================
-- Triggers pour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stand_events_updated_at BEFORE UPDATE ON stand_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stand_booths_updated_at BEFORE UPDATE ON stand_booths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stand_configurations_updated_at BEFORE UPDATE ON stand_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stand_orders_updated_at BEFORE UPDATE ON stand_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stand_assets_updated_at BEFORE UPDATE ON stand_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed Data (Optionnel)
-- ============================================

-- Insérer quelques modules de base dans la bibliothèque
INSERT INTO stand_modules_library (module_id, name, category, price, dimensions_json) VALUES
  ('struct-001', 'Structure 3x3m', 'structure', 1200.00, '{"width": 3, "height": 3, "depth": 3}'),
  ('struct-002', 'Structure 6x3m', 'structure', 1800.00, '{"width": 6, "height": 3, "depth": 3}'),
  ('wall-001', 'Mur Plein 3m', 'wall', 300.00, '{"width": 3, "height": 2.5, "depth": 0.1}'),
  ('furn-001', 'Comptoir Accueil', 'furniture', 450.00, '{"width": 2, "height": 1.1, "depth": 0.6}'),
  ('light-001', 'Spot LED', 'lighting', 80.00, '{"width": 0.2, "height": 0.3, "depth": 0.2}')
ON CONFLICT (module_id) DO NOTHING;

-- ============================================
-- Fin de la migration
-- ============================================
```

---

### 2.2 Exécuter la Migration

**Option A: Via Dashboard Supabase**:
```
1. Dashboard → SQL Editor
2. Coller le contenu de 001_stand_planet_schema.sql
3. Run
4. Vérifier que toutes les tables sont créées (Table Editor)
```

**Option B: Via CLI Supabase** (si installé):
```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Lier le projet local au projet Supabase
supabase link --project-ref xxxxx

# Appliquer la migration
supabase db push

# Vérifier
supabase db diff
```

---

## 🗂️ Étape 3: Créer le Bucket Storage 3D

### 3.1 Créer le Bucket `3d-models`

**Dashboard Supabase epitaphev1**:
```
1. Storage → Create bucket
2. Name: 3d-models
3. Public bucket: ✅ ACTIVÉ
4. [Create bucket]
```

**Politique d'accès** (déjà configurée si public, sinon):
```sql
-- Lecture publique
CREATE POLICY "Public Access Read"
ON storage.objects FOR SELECT
USING (bucket_id = '3d-models');

-- Upload pour authentifiés
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = '3d-models'
  AND auth.role() = 'authenticated'
);
```

---

## 🔗 Étape 4: Adapter le Code Stand-Planet

### 4.1 Modifier `client/src/lib/supabase.ts`

**Avant** (Supabase dédié):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Après** (Partagé avec epitaphev1):
```typescript
import { createClient } from '@supabase/supabase-js';

// Configuration partagée epitaphev1
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase config manquante! Vérifier .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Utiliser le storage epitaphev1 pour les tokens
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'epitaphev1-auth-token', // ⚠️ Clé partagée!
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Metadata pour identifier le module
export const MODULE_INFO = {
  name: 'Stand-Planet',
  version: '1.0.0',
  parent: 'epitaphev1',
  integrated: import.meta.env.VITE_INTEGRATED_MODE === 'true'
};
```

**Important**: `storageKey: 'epitaphev1-auth-token'` doit être **identique** entre epitaphev1 et Stand-Planet pour partager la session!

---

### 4.2 Adapter les Schémas Drizzle

**Fichier**: `shared/schema-postgres.ts` (nouveau, pour Supabase PostgreSQL)

```typescript
import { pgTable, serial, text, timestamp, jsonb, integer, decimal, boolean, uuid } from 'drizzle-orm/pg-core';

// ============================================
// Tables Stand-Planet avec préfixe stand_
// ============================================

export const standEvents = pgTable('stand_events', {
  id: serial('id').primaryKey(),
  organizerId: uuid('organizer_id').notNull(), // Auth user ID
  name: text('name').notNull(),
  description: text('description'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  location: text('location').notNull(),
  floorPlanJson: jsonb('floor_plan_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const standBooths = pgTable('stand_booths', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => standEvents.id, { onDelete: 'cascade' }),
  exhibitorId: uuid('exhibitor_id').notNull(),
  name: text('name').notNull(),
  dimensionsJson: jsonb('dimensions_json'),
  positionJson: jsonb('position_json'),
  configurationId: integer('configuration_id'),
  price: decimal('price', { precision: 10, scale: 2 }),
  status: text('status').default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const standConfigurations = pgTable('stand_configurations', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  dimensionsJson: jsonb('dimensions_json'),
  modulesJson: jsonb('modules_json'),
  backgroundColor: text('background_color').default('#f5f5f5'),
  floorMaterialJson: jsonb('floor_material_json'),
  style: text('style'),
  industry: text('industry'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  tags: text('tags').array(),
  isTemplate: boolean('is_template').default(false),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ... (autres tables similaires)

// Types inférés
export type StandEvent = typeof standEvents.$inferSelect;
export type InsertStandEvent = typeof standEvents.$inferInsert;
export type StandBooth = typeof standBooths.$inferSelect;
export type InsertStandBooth = typeof standBooths.$inferInsert;
export type StandConfiguration = typeof standConfigurations.$inferSelect;
export type InsertStandConfiguration = typeof standConfigurations.$inferInsert;
```

---

### 4.3 Mettre à Jour `server/db.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as standSchema from '@shared/schema-postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('⚠️ DATABASE_URL non défini! Utilisation de SQLite local.');
  // Fallback SQLite pour dev
  throw new Error('DATABASE_URL required for production');
}

// Connection PostgreSQL (Supabase)
const client = postgres(connectionString);
export const db = drizzle(client, { schema: standSchema });

export { standSchema };
```

---

## 👤 Étape 5: Authentification Partagée

### 5.1 Vérifier la Compatibilité Auth

**epitaphev1 et Stand-Planet doivent utiliser**:
- ✅ Même `supabaseUrl`
- ✅ Même `supabaseAnonKey`
- ✅ Même `storageKey` (localStorage)

**Tester le SSO**:
```typescript
// Dans Stand-Planet
import { supabase } from '@/lib/supabase';

// Vérifier si déjà connecté (session epitaphev1)
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  console.log('✅ Utilisateur déjà connecté via epitaphev1:', session.user.email);
} else {
  console.log('⚠️ Pas de session - rediriger vers login epitaphev1');
}
```

### 5.2 Redirection Login Unifiée

**Option A**: Stand-Planet utilise le login d'epitaphev1
```typescript
// Stand-Planet: Rediriger vers login epitaphev1
if (!session) {
  window.location.href = 'https://epitaphev1.com/login?redirect=stand-planet';
}
```

**Option B**: Stand-Planet a son propre login mais partage la session
```typescript
// Login Stand-Planet → Session partagée automatiquement
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
// Session disponible dans epitaphev1 et Stand-Planet ✅
```

---

## 📤 Étape 6: Upload des Modèles 3D

### Utiliser le même script mais avec clés epitaphev1:

```bash
# .env déjà configuré avec clés epitaphev1

# Télécharger modèles dans temp-models/
# (voir GUIDE_MODELES_3D_GRATUITS.md)

# Upload vers bucket 3d-models d'epitaphev1
node scripts/upload-3d-models.js
```

**Le script uploadera vers**:
```
https://xxxxx.supabase.co/storage/v1/object/public/3d-models/structures/struct-001.glb
└── Projet epitaphev1 ✅
```

---

## 🧪 Étape 7: Tests d'Intégration

### 7.1 Test Auth Partagée

```bash
# Dans epitaphev1
1. Se connecter avec un compte
2. Vérifier: localStorage['epitaphev1-auth-token'] existe

# Dans Stand-Planet
3. Ouvrir Stand-Planet (même navigateur)
4. Vérifier: Utilisateur déjà connecté ✅
5. Console: supabase.auth.getSession() → session.user.email
```

### 7.2 Test Base de Données

```sql
-- Vérifier les tables dans Supabase Dashboard
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'stand_%';

-- Résultat attendu:
-- stand_events
-- stand_booths
-- stand_configurations
-- stand_orders
-- stand_assets
-- stand_modules_library
```

### 7.3 Test Storage

```bash
# Vérifier bucket 3d-models existe
# Dashboard → Storage → voir "3d-models"

# Uploader un fichier test
node scripts/upload-3d-models.js

# Vérifier URL publique accessible:
curl https://xxxxx.supabase.co/storage/v1/object/public/3d-models/structures/struct-001.glb
# → Doit retourner le fichier GLB
```

---

## 📊 Comparaison Avant/Après

| Aspect | Avant (2 projets) | Après (Intégré) ✅ |
|--------|-------------------|---------------------|
| **Projets Supabase** | epitaphev1 + Stand-Planet | epitaphev1 uniquement |
| **Auth** | Séparée (2 logins) | Partagée (SSO) ✅ |
| **Base de données** | 2 DB PostgreSQL | 1 DB (tables préfixées) ✅ |
| **Storage** | 2 buckets séparés | Buckets dans même projet ✅ |
| **Coûts** | 2 plans | 1 plan ✅ |
| **Gestion** | 2 dashboards | 1 dashboard ✅ |
| **Utilisateurs** | Dupliqués | Partagés ✅ |

**Économie**: ~25€/mois (1 plan au lieu de 2)

---

## 🚨 Points d'Attention

### ⚠️ Conflits de Noms

**Problème**: Si epitaphev1 a déjà des tables `events`, `booths`, etc.

**Solution**: Stand-Planet utilise le préfixe `stand_*` → Pas de conflit ✅

---

### ⚠️ Migrations Existantes

**Problème**: epitaphev1 a peut-être déjà des migrations Drizzle/Prisma

**Solution**:
- Créer migration Stand-Planet séparée: `001_stand_planet_schema.sql`
- Ne pas toucher aux migrations epitaphev1
- Exécuter via SQL Editor (isolé)

---

### ⚠️ Permissions RLS

**Problème**: Policies RLS peuvent interférer

**Solution**:
- Tables Stand-Planet ont leurs propres policies
- Préfixe `stand_*` garantit isolation
- Tester les policies après création

---

## 📋 Checklist Intégration

### Configuration:
- [ ] Clés API epitaphev1 récupérées
- [ ] `.env` Stand-Planet créé avec clés epitaphev1
- [ ] `storageKey` identique dans les 2 projets

### Base de Données:
- [ ] Migration `001_stand_planet_schema.sql` exécutée
- [ ] Tables `stand_*` créées (vérifier Dashboard)
- [ ] RLS policies activées
- [ ] Seed data inséré (optionnel)

### Storage:
- [ ] Bucket `3d-models` créé dans epitaphev1
- [ ] Politique public read configurée
- [ ] Script upload testé

### Code:
- [ ] `client/src/lib/supabase.ts` modifié (storageKey partagée)
- [ ] `shared/schema-postgres.ts` créé
- [ ] `server/db.ts` pointé vers PostgreSQL
- [ ] Import schéma mis à jour

### Tests:
- [ ] Auth partagée fonctionne (SSO)
- [ ] Queries DB fonctionnent
- [ ] Upload Storage fonctionne
- [ ] URLs modèles 3D accessibles

### Déploiement:
- [ ] Variables d'environnement Railway configurées
- [ ] Build réussi avec schéma PostgreSQL
- [ ] Tests E2E sur production

---

## 🆘 Dépannage

### "Table stand_events does not exist"
```sql
-- Vérifier si migration exécutée
SELECT * FROM information_schema.tables WHERE table_name = 'stand_events';

-- Si vide, ré-exécuter migration
-- Dashboard → SQL Editor → Coller 001_stand_planet_schema.sql
```

### "Auth session not found"
```typescript
// Vérifier storageKey identique
console.log(localStorage.getItem('epitaphev1-auth-token'));

// Si null, se reconnecter dans epitaphev1
```

### "Bucket not found"
```bash
# Vérifier bucket existe
# Dashboard → Storage → Chercher "3d-models"

# Si absent, le créer manuellement
```

---

## 🎯 Résultat Final

**Architecture Unifiée**:
```
epitaphev1 (Projet Supabase Unique)
├── Auth: Utilisateurs partagés ✅
├── Database:
│   ├── Tables epitaphev1 (existantes)
│   └── Tables Stand-Planet (stand_*) ✅
├── Storage:
│   ├── Buckets epitaphev1
│   └── 3d-models (Stand-Planet) ✅
└── API: Clés partagées ✅

Applications:
├── epitaphev1.com → Supabase epitaphev1
└── stand-planet.epitaphev1.com → Supabase epitaphev1 ✅ (même projet!)
```

**Avantages**:
- ✅ SSO automatique entre modules
- ✅ Données centralisées (cohérence)
- ✅ Coûts réduits (1 seul plan)
- ✅ Gestion simplifiée (1 dashboard)
- ✅ Scalabilité (infrastructure partagée)

**Prêt pour l'intégration ?** 🚀

Dis-moi si tu as déjà les clés epitaphev1 et je t'aide pour la suite!
