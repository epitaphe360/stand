# 🚂 GUIDE RAILWAY - Configuration Minutieuse

Ce guide détaille la configuration **COMPLÈTE** et **MINUTIEUSE** de Railway pour déployer Stand-Planet en production avec Supabase.

⚠️ **ATTENTION**: Suivez chaque étape exactement pour éviter les bugs en production.

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#1-prérequis)
2. [Création du projet Railway](#2-création-du-projet-railway)
3. [Configuration des variables d'environnement](#3-configuration-des-variables-denvironnement)
4. [Configuration du build](#4-configuration-du-build)
5. [Déploiement initial](#5-déploiement-initial)
6. [Vérification et tests](#6-vérification-et-tests)
7. [Configuration du domaine personnalisé](#7-configuration-du-domaine-personnalisé)
8. [Monitoring et logs](#8-monitoring-et-logs)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. PRÉREQUIS

### Checklist avant de commencer:

- [ ] Projet Supabase créé et configuré (voir `SUPABASE.md`)
- [ ] Tables créées dans Supabase
- [ ] RLS policies appliquées
- [ ] Variables Supabase notées (URL, keys, DATABASE_URL)
- [ ] Code compilé localement sans erreurs (`npm run build`)
- [ ] Git repository à jour

```bash
# Vérifier la compilation locale
npm run build
# ✓ Doit réussir sans erreurs

# Vérifier que le serveur démarre
npm start
# ✓ Doit afficher "serving on port 5000"
```

---

## 2. CRÉATION DU PROJET RAILWAY

### Étape 2.1: Créer un compte Railway

1. Aller sur https://railway.app
2. Cliquer sur "Login" ou "Start a New Project"
3. Se connecter avec GitHub (recommandé pour auto-deploy)

### Étape 2.2: Créer un nouveau projet

#### Option A: Depuis GitHub (RECOMMANDÉ)

1. Dashboard Railway > **New Project**
2. Sélectionner **Deploy from GitHub repo**
3. Autoriser Railway à accéder à GitHub
4. Sélectionner le repository `epitaphe360/stand`
5. Sélectionner la branche `main` (ou `claude/analyze-server-startup-em5Yb`)

#### Option B: Depuis CLI Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialiser
cd /path/to/stand-planet
railway init

# Link to project
railway link
```

### Étape 2.3: Configurer le service

Railway détecte automatiquement Node.js. Vérifier:

```
Build Command: npm run build
Start Command: npm start
```

---

## 3. CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

### ⚠️ CRITIQUE: Variables à configurer

Railway > Project > **Variables**

#### 3.1: Variables Supabase (OBLIGATOIRES)

```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
```

**Comment obtenir**:
- Supabase Dashboard > Settings > API > Project URL

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[VOTRE_CLE_PUBLIQUE]
```

**Comment obtenir**:
- Supabase Dashboard > Settings > API > Project API keys > `anon` `public`

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[VOTRE_CLE_PRIVEE]
```

⚠️ **PRIVÉE - NE JAMAIS PARTAGER**

**Comment obtenir**:
- Supabase Dashboard > Settings > API > Project API keys > `service_role` (cliquer "Reveal")

#### 3.2: Database URL (OBLIGATOIRE)

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

⚠️ **UTILISER LE CONNECTION POOLER** (port 6543), pas la connexion directe (5432)

**Comment obtenir**:
- Supabase Dashboard > Settings > Database
- Section "Connection String" > **Connection Pooling** (pas Direct connection)
- Mode: `Transaction`
- Copier l'URL et remplacer `[YOUR-PASSWORD]` par votre vrai mot de passe

**Format exact**:
```
postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@[POOLER-HOST]:6543/postgres
```

Exemple:
```
postgresql://postgres.abcdefghijklmnop:MySecurePass123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

#### 3.3: Session Secret (OBLIGATOIRE)

```env
SESSION_SECRET=[GENERER_UNE_CLE_ALEATOIRE_64_CARACTERES]
```

**Générer la clé**:

```bash
# Linux/Mac
openssl rand -hex 64

# Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou avec Node
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copier le résultat (128 caractères hex) et le mettre dans `SESSION_SECRET`.

#### 3.4: Environment (OBLIGATOIRE)

```env
NODE_ENV=production
```

#### 3.5: Port (AUTOMATIQUE - Ne PAS définir)

❌ **NE PAS AJOUTER `PORT=5000`**

Railway injecte automatiquement la variable `PORT`. Votre code doit utiliser:

```typescript
const port = process.env.PORT || 5000;
```

✅ Déjà configuré dans `server/index.ts`.

---

## 4. CONFIGURATION DU BUILD

### Étape 4.1: Vérifier railway.json (optionnel mais recommandé)

Créer un fichier `railway.json` à la racine:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Étape 4.2: Vérifier .dockerignore (optionnel)

Si vous utilisez Docker, créer `.dockerignore`:

```
node_modules
.git
.env
.env.local
*.log
dist
uploads
standplanet.db
```

### Étape 4.3: Vérifier les scripts package.json

Railway exécute:
1. `npm install` (automatique)
2. `npm run build` (configuré ci-dessus)
3. `npm start` (configuré ci-dessus)

Vérifier dans `package.json`:

```json
{
  "scripts": {
    "build": "tsx script/build.ts",
    "start": "cross-env NODE_ENV=production node dist/index.cjs"
  }
}
```

✅ Déjà configuré correctement.

---

## 5. DÉPLOIEMENT INITIAL

### Étape 5.1: Déclencher le build

#### Via GitHub (recommandé):

```bash
git add -A
git commit -m "feat: configuration Railway complète"
git push origin main
```

Railway détecte automatiquement le push et démarre le build.

#### Via CLI Railway:

```bash
railway up
```

### Étape 5.2: Suivre les logs de build

Railway Dashboard > Deployments > Cliquer sur le deployment en cours

**Logs attendus**:

```
[INFO] Installing dependencies...
[INFO] Running build command: npm run build
[INFO] building client...
[INFO] ✓ 2796 modules transformed
[INFO] ✓ built in ~18s
[INFO] building server...
[INFO] ⚡ Done
[INFO] Build completed successfully
[INFO] Starting application...
[INFO] serving on port 5000
```

⏱️ **Temps estimé**: 3-5 minutes

### Étape 5.3: Vérifier le déploiement

Une fois déployé, Railway génère une URL:

```
https://stand-planet-production.up.railway.app
```

Cliquer sur l'URL ou copier dans le navigateur.

✅ **Attendu**: Page d'accueil de Stand-Planet (pas de page blanche!)

---

## 6. VÉRIFICATION ET TESTS

### Test 6.1: Page d'accueil

```bash
curl -I https://stand-planet-production.up.railway.app
```

**Attendu**:
```
HTTP/2 200
content-type: text/html; charset=UTF-8
```

### Test 6.2: API Health Check

```bash
curl https://stand-planet-production.up.railway.app/api/health
```

**Attendu**:
```json
{"status":"ok"}
```

Si cette route n'existe pas, ajouter dans `server/routes.ts`:

```typescript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Test 6.3: Connexion Base de Données

Tester une requête qui utilise Supabase:

```bash
curl https://stand-planet-production.up.railway.app/api/events
```

**Attendu**: Liste d'events (peut être vide `[]`) sans erreur 500.

### Test 6.4: Authentification

Essayer de créer un compte depuis l'interface web:

1. Aller sur `/register`
2. Créer un compte test
3. Vérifier que l'email de confirmation Supabase est reçu
4. Se connecter

✅ Si tout fonctionne → Déploiement réussi!

---

## 7. CONFIGURATION DU DOMAINE PERSONNALISÉ

### Étape 7.1: Ajouter un domaine

Railway Dashboard > Settings > **Domains**

1. Cliquer sur **Add Domain**
2. Entrer votre domaine: `stand-planet.com`
3. Railway génère des DNS records

### Étape 7.2: Configurer le DNS

Chez votre registrar (Namecheap, GoDaddy, Cloudflare, etc.):

**Option A: CNAME (sous-domaine)**

```
Type: CNAME
Name: www (ou app, ou @)
Value: [railway-generated-domain].railway.app
TTL: 3600
```

**Option B: A Record (root domain)**

Railway vous donne une IP:

```
Type: A
Name: @
Value: [IP fournie par Railway]
TTL: 3600
```

### Étape 7.3: Activer HTTPS

Railway gère automatiquement SSL/TLS via Let's Encrypt.

⏱️ **Temps de propagation DNS**: 5 minutes à 48 heures

---

## 8. MONITORING ET LOGS

### Étape 8.1: Logs en temps réel

Railway Dashboard > Deployments > **View Logs**

Ou via CLI:

```bash
railway logs
```

### Étape 8.2: Métriques

Railway Dashboard > **Metrics**:

- CPU Usage
- Memory Usage
- Network I/O
- Request Count

### Étape 8.3: Alertes (optionnel)

Railway > Settings > **Notifications**:

- Deployment failed
- Service crashed
- High resource usage

Configurer email ou webhook (Discord, Slack).

---

## 9. TROUBLESHOOTING

### Problème 9.1: Build échoue

**Symptôme**: Build failed, erreur npm

**Solutions**:

1. Vérifier `package.json` est valide JSON
2. Vérifier `npm run build` fonctionne localement
3. Vérifier les dépendances manquantes:

```bash
npm install --save-dev tsx vite drizzle-kit
```

4. Vérifier les versions Node:

Railway > Settings > **Environment**:

```env
NODE_VERSION=20
```

### Problème 9.2: Page blanche après déploiement

**Symptôme**: 200 OK mais page vide

**Cause probable**: Imports TypeScript incorrects (déjà corrigé dans ce projet)

**Solutions**:

1. Vérifier logs Railway pour erreurs JavaScript
2. Ouvrir DevTools navigateur > Console pour erreurs
3. Vérifier que les fichiers `dist/public/assets/*.js` sont générés
4. Vérifier variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Problème 9.3: Erreur connexion base de données

**Symptôme**: 500 Internal Server Error, logs "connection refused"

**Solutions**:

1. **Vérifier DATABASE_URL**:
   - Doit utiliser le **Connection Pooler** (port 6543)
   - Format: `postgresql://postgres.[REF]:[PASSWORD]@[POOLER]:6543/postgres`

2. **Vérifier le mot de passe**:
   - Pas d'espaces, pas de caractères spéciaux non échappés
   - Réinitialiser si nécessaire (Supabase > Settings > Database > Reset Password)

3. **Tester la connexion**:

```bash
# Via Railway shell
railway run psql $DATABASE_URL -c "SELECT 1"
```

Attendu: `1` (success)

### Problème 9.4: Auth ne fonctionne pas

**Symptôme**: Impossible de se connecter, erreur "Invalid credentials"

**Solutions**:

1. Vérifier `SUPABASE_SERVICE_ROLE_KEY` est définie (Railway Variables)
2. Vérifier URL de redirection Supabase:
   - Supabase > Auth > URL Configuration
   - Ajouter: `https://[votre-domaine-railway].up.railway.app/auth/callback`

3. Tester l'auth directement:

```bash
curl -X POST https://[votre-app].up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Problème 9.5: Déploiement lent

**Symptôme**: Build prend >10 minutes

**Solutions**:

1. Activer le cache NPM:

Railway > Settings > **Build Settings**:

```
Enable build cache: ON
```

2. Optimiser dépendances:

```json
{
  "devDependencies": {
    // Déplacer ici les packages non nécessaires en production
  }
}
```

3. Utiliser `npm ci` au lieu de `npm install`:

Railway utilise `npm ci` par défaut si `package-lock.json` existe.

### Problème 9.6: Crash au démarrage

**Symptôme**: "Application crashed", logs "Error: Cannot find module"

**Solutions**:

1. Vérifier que `dist/` est créé pendant le build
2. Vérifier que `npm start` pointe sur `dist/index.cjs`
3. Vérifier les imports absolus:

```typescript
// ❌ Mauvais
import { api } from '../../../shared/routes';

// ✅ Bon
import { api } from '@shared/routes';
```

4. Vérifier `tsconfig.json` paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./shared/*"],
      "@/*": ["./client/src/*"]
    }
  }
}
```

---

## 🎯 CHECKLIST FINALE RAILWAY

### Avant le déploiement:

- [ ] Build local réussi (`npm run build`)
- [ ] Server démarre localement (`npm start`)
- [ ] Variables Supabase prêtes
- [ ] DATABASE_URL (Connection Pooler) prêt
- [ ] SESSION_SECRET généré (64 bytes hex)
- [ ] Git repository à jour

### Configuration Railway:

- [ ] Projet Railway créé
- [ ] Repository GitHub lié
- [ ] Variables d'environnement ajoutées:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `DATABASE_URL` (pooler!)
  - [ ] `SESSION_SECRET`
  - [ ] `NODE_ENV=production`
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] ❌ PAS de variable `PORT` (Railway l'injecte)

### Après le déploiement:

- [ ] Build réussi (logs verts)
- [ ] Application démarrée (logs "serving on port")
- [ ] URL Railway accessible (pas de page blanche)
- [ ] API health check répond 200 OK
- [ ] Connexion BDD fonctionne
- [ ] Authentification testée
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] SSL actif (HTTPS)
- [ ] Logs propres (pas d'erreurs)

---

## 📚 RESSOURCES

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Guide](https://docs.railway.app/develop/cli)
- [Nixpacks (Builder)](https://nixpacks.com/docs)
- [Node.js Deployment Guide](https://docs.railway.app/guides/nodejs)
- [Environment Variables](https://docs.railway.app/develop/variables)

---

## 🆘 SUPPORT

Si vous rencontrez un problème non listé:

1. **Logs Railway**: Toujours commencer par les logs
2. **Railway Discord**: https://discord.gg/railway
3. **GitHub Issues**: `epitaphe360/stand`

---

**Date**: 2026-01-16
**Version**: 1.0
**Statut**: Configuration Production-Ready
**Auteur**: Configuration minutieuse pour éviter tout bug
