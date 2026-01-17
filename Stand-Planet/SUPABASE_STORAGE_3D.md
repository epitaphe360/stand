# 🗄️ Configuration Supabase Storage pour Modèles 3D

**Objectif**: Héberger les 50 modèles GLTF sur Supabase Storage au lieu de `client/public/`

**Avantages**:
- ✅ **Bundle size réduit** (pas de .glb dans le build client)
- ✅ **CDN global Supabase** (performances optimales partout dans le monde)
- ✅ **Gestion centralisée** (facile d'ajouter/modifier/supprimer des modèles)
- ✅ **Scalable** (pas de limite de stockage avec plan payant)
- ✅ **Versioning** (garder plusieurs versions des modèles)
- ✅ **Accès public** (pas de signature JWT requise pour lecture)

---

## 📋 Prérequis

- ✅ Compte Supabase existant (tu l'as déjà!)
- ✅ Projet Supabase créé
- ✅ Clés API (URL + anon key + service role key)

---

## 🔧 Étape 1: Configuration Supabase Storage

### 1.1 Créer le Bucket pour Modèles 3D

**Via Dashboard Supabase**:
```
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet Stand-Planet
3. Menu → Storage (icône dossier)
4. Cliquer "Create bucket"

Paramètres du bucket:
├── Name: "3d-models"
├── Public bucket: ✅ Activé (important!)
├── File size limit: 10 MB (ou plus si modèles complexes)
├── Allowed MIME types: model/gltf-binary, model/gltf+json, application/octet-stream
└── [Create bucket]
```

**Via SQL (Alternative)**:
```sql
-- Créer le bucket programmatically
INSERT INTO storage.buckets (id, name, public)
VALUES ('3d-models', '3d-models', true);

-- Politique d'accès public en lecture
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = '3d-models');

-- Politique upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = '3d-models'
  AND auth.role() = 'authenticated'
);
```

---

### 1.2 Structure des Dossiers dans le Bucket

```
3d-models/                    (bucket root)
├── structures/
│   ├── struct-001.glb
│   ├── struct-002.glb
│   ├── struct-003.glb
│   └── struct-004.glb
├── walls/
│   ├── wall-001.glb
│   ├── wall-002.glb
│   ├── wall-003.glb
│   └── wall-004.glb
├── furniture/
│   ├── furn-001.glb
│   ├── furn-002.glb
│   ├── ... (jusqu'à furn-010.glb)
├── lighting/
│   ├── light-001.glb
│   ├── ... (jusqu'à light-010.glb)
├── multimedia/
│   ├── multi-001.glb
│   ├── ... (jusqu'à multi-005.glb)
├── decoration/
│   ├── deco-001.glb
│   ├── ... (jusqu'à deco-007.glb)
├── floors/
│   ├── floor-001.glb
│   ├── floor-002.glb
│   └── floor-003.glb
├── plv/
│   ├── plv-001.glb
│   ├── ... (jusqu'à plv-005.glb)
└── levels/
    ├── level-001.glb
    ├── level-002.glb
    └── level-003.glb
```

---

## 🔑 Étape 2: Configuration Variables d'Environnement

### 2.1 Récupérer les Clés Supabase

**Dashboard Supabase**:
```
1. Project Settings (⚙️) → API
2. Copier:
   - Project URL: https://xxxxx.supabase.co
   - anon public key: eyJhbGc...
   - service_role key: eyJhbGc... (⚠️ secret!)
```

### 2.2 Créer `.env` à la racine du projet

```bash
# .env (NE PAS COMMITER!)

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...votre_anon_key_ici...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre_service_role_key_ici...

# Base de données (optionnel si SQLite suffit)
# DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Bucket pour modèles 3D
VITE_SUPABASE_3D_MODELS_BUCKET=3d-models
```

**Important**:
- Ajouter `.env` au `.gitignore` (déjà fait normalement)
- Ne JAMAIS commiter le service_role_key (accès admin total!)

---

## 📤 Étape 3: Upload des Modèles 3D

### 3.1 Script d'Upload Node.js

Créer `scripts/upload-3d-models.js`:

```javascript
#!/usr/bin/env node
/**
 * Script d'upload des modèles 3D vers Supabase Storage
 * Usage: node scripts/upload-3d-models.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.VITE_SUPABASE_3D_MODELS_BUCKET || '3d-models';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!');
  console.error('   VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis');
  process.exit(1);
}

// Initialiser client Supabase (avec service role key pour upload)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Dossier local contenant les modèles téléchargés
const MODELS_DIR = path.join(__dirname, '../temp-models');

// Mapping catégories → dossiers Supabase
const CATEGORIES = {
  'structures': 'structures',
  'walls': 'walls',
  'furniture': 'furniture',
  'lighting': 'lighting',
  'multimedia': 'multimedia',
  'decoration': 'decoration',
  'floors': 'floors',
  'plv': 'plv',
  'levels': 'levels'
};

/**
 * Upload un fichier GLB vers Supabase Storage
 */
async function uploadModel(localPath, remotePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);

    console.log(`📤 Upload: ${remotePath}...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(remotePath, fileBuffer, {
        contentType: 'model/gltf-binary',
        cacheControl: '3600', // Cache 1 heure
        upsert: true // Écraser si existe déjà
      });

    if (error) {
      throw error;
    }

    console.log(`   ✅ ${remotePath} uploadé`);
    return data;
  } catch (error) {
    console.error(`   ❌ Erreur upload ${remotePath}:`, error.message);
    throw error;
  }
}

/**
 * Obtenir l'URL publique d'un fichier
 */
function getPublicUrl(filePath) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Upload tous les modèles d'une catégorie
 */
async function uploadCategory(category, folderName) {
  const categoryDir = path.join(MODELS_DIR, category);

  if (!fs.existsSync(categoryDir)) {
    console.log(`⚠️  Dossier ${category} non trouvé, skip`);
    return [];
  }

  const files = fs.readdirSync(categoryDir)
    .filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));

  console.log(`\n📁 Catégorie: ${category} (${files.length} fichiers)`);

  const results = [];

  for (const file of files) {
    const localPath = path.join(categoryDir, file);
    const remotePath = `${folderName}/${file}`;

    try {
      await uploadModel(localPath, remotePath);
      const publicUrl = getPublicUrl(remotePath);

      results.push({
        file,
        remotePath,
        publicUrl,
        success: true
      });
    } catch (error) {
      results.push({
        file,
        remotePath,
        error: error.message,
        success: false
      });
    }
  }

  return results;
}

/**
 * Main: Upload tous les modèles
 */
async function main() {
  console.log('🚀 Début upload des modèles 3D vers Supabase Storage\n');
  console.log(`📍 Bucket: ${BUCKET_NAME}`);
  console.log(`📂 Source: ${MODELS_DIR}\n`);

  const allResults = {};
  let totalUploaded = 0;
  let totalErrors = 0;

  // Upload chaque catégorie
  for (const [category, folder] of Object.entries(CATEGORIES)) {
    const results = await uploadCategory(category, folder);
    allResults[category] = results;

    const success = results.filter(r => r.success).length;
    const errors = results.filter(r => !r.success).length;

    totalUploaded += success;
    totalErrors += errors;
  }

  // Rapport final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT D\'UPLOAD');
  console.log('='.repeat(60));
  console.log(`✅ Fichiers uploadés: ${totalUploaded}`);
  console.log(`❌ Erreurs: ${totalErrors}`);
  console.log(`📦 Total: ${totalUploaded + totalErrors}`);

  // Générer fichier de mapping URLs
  const urlsMapping = {};
  for (const [category, results] of Object.entries(allResults)) {
    urlsMapping[category] = {};
    results.forEach(r => {
      if (r.success) {
        urlsMapping[category][r.file] = r.publicUrl;
      }
    });
  }

  // Sauvegarder mapping
  const mappingPath = path.join(__dirname, '../supabase-3d-urls.json');
  fs.writeFileSync(mappingPath, JSON.stringify(urlsMapping, null, 2));
  console.log(`\n📝 Mapping URLs sauvegardé: ${mappingPath}`);

  console.log('\n🎉 Upload terminé!\n');

  if (totalErrors > 0) {
    console.log('⚠️  Certains fichiers ont échoué. Vérifier les erreurs ci-dessus.');
    process.exit(1);
  }
}

// Exécuter
main().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});
```

---

### 3.2 Installation des Dépendances

```bash
# Installer @supabase/supabase-js si pas déjà fait
npm install @supabase/supabase-js

# Rendre le script exécutable
chmod +x scripts/upload-3d-models.js
```

---

### 3.3 Utilisation du Script

**Préparation**:
```bash
# 1. Créer dossier temporaire pour modèles téléchargés
mkdir -p temp-models/{structures,walls,furniture,lighting,multimedia,decoration,floors,plv,levels}

# 2. Télécharger modèles depuis Sketchfab (voir GUIDE_MODELES_3D_GRATUITS.md)
# 3. Placer les .glb dans les bons dossiers temp-models/

# Exemple:
# temp-models/
# ├── structures/
# │   ├── struct-001.glb
# │   └── struct-002.glb
# ├── furniture/
# │   ├── furn-001.glb
# │   └── furn-002.glb
# └── ...
```

**Upload**:
```bash
# Charger les variables d'environnement
source .env  # ou: export $(cat .env | xargs)

# Exécuter l'upload
node scripts/upload-3d-models.js
```

**Sortie attendue**:
```
🚀 Début upload des modèles 3D vers Supabase Storage

📍 Bucket: 3d-models
📂 Source: /path/to/project/temp-models

📁 Catégorie: structures (4 fichiers)
📤 Upload: structures/struct-001.glb...
   ✅ structures/struct-001.glb uploadé
📤 Upload: structures/struct-002.glb...
   ✅ structures/struct-002.glb uploadé
...

============================================================
📊 RAPPORT D'UPLOAD
============================================================
✅ Fichiers uploadés: 50
❌ Erreurs: 0
📦 Total: 50

📝 Mapping URLs sauvegardé: /path/to/project/supabase-3d-urls.json

🎉 Upload terminé!
```

---

## 🔗 Étape 4: Modifier le Code pour Charger depuis Supabase

### 4.1 Créer Helper pour URLs Supabase

`client/src/lib/supabase-3d-loader.ts`:

```typescript
import { supabase } from '@/lib/supabase';

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_3D_MODELS_BUCKET || '3d-models';

/**
 * Obtenir l'URL publique d'un modèle 3D depuis Supabase Storage
 */
export function get3DModelUrl(category: string, filename: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${category}/${filename}`);

  return data.publicUrl;
}

/**
 * Précharger un modèle 3D (optionnel, pour cache navigateur)
 */
export async function preload3DModel(url: string): Promise<void> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      console.warn(`⚠️ Modèle non trouvé: ${url}`);
    }
  } catch (error) {
    console.error(`❌ Erreur préchargement: ${url}`, error);
  }
}

/**
 * Mapping des IDs de modules vers chemins Supabase
 */
export const MODULE_3D_PATHS: Record<string, { category: string; filename: string }> = {
  // Structures
  'struct-001': { category: 'structures', filename: 'struct-001.glb' },
  'struct-002': { category: 'structures', filename: 'struct-002.glb' },
  'struct-003': { category: 'structures', filename: 'struct-003.glb' },
  'struct-004': { category: 'structures', filename: 'struct-004.glb' },

  // Murs
  'wall-001': { category: 'walls', filename: 'wall-001.glb' },
  'wall-002': { category: 'walls', filename: 'wall-002.glb' },
  'wall-003': { category: 'walls', filename: 'wall-003.glb' },
  'wall-004': { category: 'walls', filename: 'wall-004.glb' },

  // Mobilier
  'furn-001': { category: 'furniture', filename: 'furn-001.glb' },
  'furn-002': { category: 'furniture', filename: 'furn-002.glb' },
  // ... (compléter pour les 50 modules)
};

/**
 * Obtenir l'URL d'un module par son ID
 */
export function getModuleUrl(moduleId: string): string {
  const pathInfo = MODULE_3D_PATHS[moduleId];

  if (!pathInfo) {
    console.warn(`⚠️ Module inconnu: ${moduleId}`);
    return '';
  }

  return get3DModelUrl(pathInfo.category, pathInfo.filename);
}
```

---

### 4.2 Modifier les Définitions de Modules

`client/src/lib/3d/gltf-models.ts`:

```typescript
import { getModuleUrl } from '@/lib/supabase-3d-loader';

export const STRUCTURE_GLTF_MODULES: GLTFModuleDefinition[] = [
  {
    id: 'struct-001',
    name: 'Structure 3x3m',
    category: 'structure',
    // ❌ Avant: chemin local
    // gltfPath: '/assets/models/structures/struct-001.glb',

    // ✅ Après: URL Supabase dynamique
    gltfPath: () => getModuleUrl('struct-001'),

    price: 1200,
    dimensions: { width: 3, height: 3, depth: 3 },
    // ...
  },
  // ... autres modules
];
```

**OU** (si type GLTFModuleDefinition ne supporte pas fonction):

Modifier le chargement dans `gltf-loader.ts`:

```typescript
export async function loadGLTFModel(options: GLTFLoadOptions): Promise<LoadedGLTFModel> {
  let { url } = options;

  // Si l'URL est une fonction, l'exécuter pour obtenir l'URL Supabase
  if (typeof url === 'function') {
    url = url();
  }

  // ... reste du code de chargement
}
```

---

### 4.3 Modifier GLTFModule3D.tsx

`client/src/components/3d/GLTFModule3D.tsx`:

```typescript
import { getModuleUrl } from '@/lib/supabase-3d-loader';

export function GLTFModule3D({ module, ...props }: GLTFModule3DProps) {
  // Obtenir l'URL Supabase du modèle
  const gltfUrl = useMemo(() => {
    if (module.gltfPath) {
      return typeof module.gltfPath === 'function'
        ? module.gltfPath()
        : module.gltfPath;
    }
    // Fallback: générer depuis l'ID
    return getModuleUrl(module.id);
  }, [module.id, module.gltfPath]);

  // Charger le modèle
  const { scene, isLoading, error } = useGLTF(gltfUrl);

  // ... reste du composant
}
```

---

## 🧪 Étape 5: Tests

### 5.1 Vérifier les URLs

```typescript
// Dans la console du navigateur ou un test:
import { getModuleUrl } from '@/lib/supabase-3d-loader';

console.log(getModuleUrl('struct-001'));
// Devrait afficher: https://xxxxx.supabase.co/storage/v1/object/public/3d-models/structures/struct-001.glb
```

### 5.2 Tester le Chargement

```bash
# Démarrer l'app
npm run dev

# 1. Ouvrir http://localhost:5000
# 2. Aller dans Studio 3D
# 3. Ajouter un module (ex: struct-001)
# 4. Vérifier dans Network tab (F12) que le .glb se charge depuis Supabase
# 5. Vérifier qu'il n'y a pas d'erreurs CORS
```

### 5.3 Vérifier CORS (si erreurs)

**Dashboard Supabase**:
```
Storage → Configuration → CORS
Ajouter:
- Allowed origins: https://votre-domaine.com, http://localhost:5000
- Allowed methods: GET, HEAD
- Allowed headers: *
```

---

## 📊 Étape 6: Monitoring et Optimisation

### 6.1 Vérifier les Stats Storage

**Dashboard Supabase**:
```
Storage → 3d-models → Statistics
- Nombre de fichiers
- Taille totale
- Bandwidth utilisé
```

### 6.2 Optimiser les Performances

**Cache Headers** (déjà configurés dans le script upload):
```javascript
cacheControl: '3600'  // 1 heure
```

**CDN Supabase**: Automatique, pas de config requise ✅

**Compression**: Les .glb sont déjà compressés (format binaire)

---

## 🔄 Étape 7: Workflow Mise à Jour

### Ajouter un nouveau modèle:

```bash
# 1. Télécharger le nouveau modèle .glb
# 2. Le placer dans temp-models/category/

# 3. Uploader vers Supabase (le script détecte les nouveaux)
node scripts/upload-3d-models.js

# 4. Ajouter l'entrée dans MODULE_3D_PATHS
# client/src/lib/supabase-3d-loader.ts:
'new-module-id': { category: 'furniture', filename: 'new-model.glb' }

# 5. Ajouter la définition dans gltf-models.ts
{
  id: 'new-module-id',
  name: 'Nouveau Module',
  gltfPath: () => getModuleUrl('new-module-id'),
  // ...
}

# 6. Commit + Push
git add .
git commit -m "feat: ajout nouveau modèle 3D (new-module-id)"
git push
```

---

## 💰 Coûts Supabase Storage

### Free Tier:
```
✅ 1 GB stockage
✅ 2 GB bandwidth/mois
✅ Suffisant pour ~200 modèles de 5MB chacun
```

**Estimation Stand-Planet**:
```
50 modèles × 500KB moyen = 25 MB stockage ✅
1000 utilisateurs × 50 chargements × 500KB = 25 GB bandwidth/mois
→ Pro plan requis si >2GB bandwidth
```

### Pro Plan (25$/mois):
```
✅ 100 GB stockage
✅ 200 GB bandwidth
✅ Largement suffisant
```

---

## 🚀 Avantages vs Stockage Local

| Aspect | Local (client/public/) | Supabase Storage |
|--------|------------------------|------------------|
| **Bundle size** | +25MB (50 modèles) | 0MB ✅ |
| **Temps de build** | +30s | Instantané ✅ |
| **CDN global** | ❌ Non | ✅ Oui |
| **Cache** | Service worker | CDN Supabase ✅ |
| **Mise à jour** | Rebuild requis | Instantané ✅ |
| **Versioning** | Git (lourd) | Supabase ✅ |
| **Scalabilité** | Limitée | Illimitée ✅ |

**Recommandation**: ✅ **Utiliser Supabase Storage** (meilleure solution!)

---

## 📝 Checklist Finale

### Configuration:
- [ ] Bucket `3d-models` créé dans Supabase
- [ ] Politique d'accès public configurée
- [ ] Variables d'environnement (.env) configurées
- [ ] Script d'upload testé

### Upload:
- [ ] 50 modèles téléchargés depuis Sketchfab
- [ ] Modèles placés dans temp-models/
- [ ] Script upload exécuté avec succès
- [ ] Fichier supabase-3d-urls.json généré

### Code:
- [ ] supabase-3d-loader.ts créé
- [ ] MODULE_3D_PATHS complété (50 entrées)
- [ ] gltf-models.ts modifié (URLs Supabase)
- [ ] GLTFModule3D.tsx modifié

### Tests:
- [ ] URLs Supabase accessibles (test dans navigateur)
- [ ] Modèles se chargent dans l'app
- [ ] Pas d'erreurs CORS
- [ ] Performances acceptables (<2s chargement)

### Production:
- [ ] Variables d'environnement Railway configurées
- [ ] Build réussi
- [ ] Déploiement fonctionnel
- [ ] Monitoring Supabase Storage activé

---

## 🆘 Dépannage

### Erreur: "Storage bucket not found"
```bash
# Vérifier que le bucket existe
# Dashboard Supabase → Storage → Chercher "3d-models"

# Si absent, le créer via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('3d-models', '3d-models', true);
```

### Erreur CORS
```bash
# Ajouter votre domaine aux CORS
# Dashboard → Storage → Configuration → CORS
# Allowed origins: http://localhost:5000, https://votre-app.com
```

### Modèle ne se charge pas (404)
```bash
# Vérifier l'URL dans Network tab (F12)
# Doit être: https://xxxxx.supabase.co/storage/v1/object/public/3d-models/category/file.glb

# Si chemin incorrect, vérifier MODULE_3D_PATHS
```

### Upload échoue
```bash
# Vérifier les clés API
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Vérifier permissions bucket
# Dashboard → Storage → 3d-models → Policies
```

---

**Prêt à configurer Supabase Storage ?** 🚀

Dis-moi quand tu as:
1. ✅ Créé le bucket `3d-models`
2. ✅ Copié tes clés API

Et je t'aide pour la suite (script upload + modification code)!
