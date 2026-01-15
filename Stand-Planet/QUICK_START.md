# 🚀 Guide de Démarrage Rapide - Stand Studio

## Installation et Lancement

### 1. Installer les dépendances (si ce n'est pas déjà fait)
```bash
npm install
```

Toutes les dépendances nécessaires sont déjà dans le `package.json` :
- ✅ React & React DOM
- ✅ Three.js & React Three Fiber
- ✅ Zustand (state management)
- ✅ Shadcn UI components
- ✅ Lucide React (icons)
- ✅ TailwindCSS

### 2. Lancer l'application
```bash
npm run dev
```

### 3. Accéder au Stand Studio
Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/studio
```

## 🎯 Premiers Pas

### Option 1: Utiliser l'Assistant IA (Recommandé)

1. Sur la page d'accueil, cliquez sur **"Créer avec l'IA"**
2. Décrivez votre stand dans le chat, par exemple :
   ```
   Je veux un stand moderne pour une entreprise tech de 6x3m 
   avec 2 écrans LED, un comptoir d'accueil et un éclairage 
   dynamique. Budget : 5000€
   ```
3. L'IA génère automatiquement 3 propositions
4. Sélectionnez celle qui vous plaît
5. Personnalisez dans le Studio

### Option 2: Partir d'un Template

1. Cliquez sur **"Templates Pro"**
2. Parcourez la galerie de 6 templates professionnels :
   - 🖥️ Stand Tech Moderne
   - 💎 Stand Luxe Premium
   - 🌿 Stand Écologique
   - 🎮 Stand Interactif
   - 🔄 Stand Îlot 360°
   - ⚪ Stand Minimaliste
3. Cliquez sur un template pour l'ouvrir dans le Studio
4. Personnalisez selon vos besoins

### Option 3: Créer de Zéro

1. Cliquez sur **"Partir de zéro"**
2. Vous arrivez dans le Studio vide
3. Ouvrez la **bibliothèque de modules** (panneau gauche)
4. Glissez-déposez des modules sur le canvas 3D
5. Ajustez position, rotation, couleurs

## 🎨 Interface du Studio

```
┌─────────────────────────────────────────────────────────┐
│  Stand Studio  │  Undo/Redo  │  Grille  │  Stats  │ IA │ Top Toolbar
├──────────────┬──────────────────────────┬───────────────┤
│              │                          │               │
│  Bibliothèque│     Canvas 3D            │  Propriétés   │
│  de Modules  │     (Drag & Drop)        │  ou           │
│              │                          │  Chat IA      │
│  • Structure │                          │               │
│  • Murs      │     🏗️ Stand ici        │  Position     │
│  • Mobilier  │                          │  Rotation     │
│  • Éclairage │                          │  Échelle      │
│  • Média     │                          │  Couleur      │
│  • Déco      │                          │               │
│              │                          │               │
└──────────────┴──────────────────────────┴───────────────┘
     320px              Flex 1                  320px
```

## 🎯 Actions Rapides

### Dans la Toolbar
- **Undo/Redo** : Annuler ou refaire les dernières actions (jusqu'à 50)
- **Grille** : Activer/désactiver le snap to grid
- **Aperçu** : Mode prévisualisation (à venir)
- **Assistant IA** : Ouvrir le chat IA
- **Exporter** : Télécharger PDF/Images (à venir)
- **Sauvegarder** : Sauvegarder le design

### Dans le Canvas 3D
- **Clic gauche** sur un module : Sélectionner
- **Clic + Drag** : Déplacer le module
- **Molette souris** : Zoom avant/arrière
- **Clic droit + Drag** : Rotation de la caméra
- **Clic milieu + Drag** : Pan (déplacer la vue)

### Dans le Panneau Propriétés
- **Actions** : Dupliquer, Verrouiller, Supprimer
- **Position** : Ajuster X, Y, Z
- **Rotation** : 3 sliders (0-360°)
- **Échelle** : Agrandir/Réduire (50-200%)
- **Couleur** : Changer la couleur (si personnalisable)

## 📚 Bibliothèque de Modules (50+)

### 🏗️ Structures (4)
- Base 3x3m (500€)
- Base 6x3m (800€)
- Base 9x3m (1200€)
- Îlot 6x6m (2000€)

### 🧱 Murs (4)
- Mur plein blanc (150€)
- Mur vitré (400€)
- Mur LED lumineux (800€)
- Mur courbe design (600€)

### 🪑 Mobilier (6)
- Comptoir accueil (350€)
- Vitrine éclairée (450€)
- Table bar (120€)
- Canapé 2 places (400€)
- Étagère murale (200€)
- Tabouret design (80€)

### 💡 Éclairage (4)
- Spot LED (50€)
- Bandeau LED RGB (150€)
- Suspension design (250€)
- Projecteur sol (180€)

### 📺 Multimédia (5)
- Écran LED 55" (600€)
- Écran LED 85" (1200€)
- Borne tactile (800€)
- Projecteur vidéo (450€)
- Système audio (350€)

### 🎨 Décoration (5)
- Plante haute (80€)
- Kakémono 2m (120€)
- Tapis design (150€)
- Œuvre d'art (200€)
- Sculpture (300€)

### 🟫 Sol (3)
- Moquette grise (30€/m²)
- Parquet bois (60€/m²)
- Carrelage blanc (50€/m²)

## 🤖 Exemples de Prompts IA

### Prompt Simple
```
Un stand moderne de 6x3m pour une startup tech
```

### Prompt Détaillé
```
Je veux un stand luxueux de 9x3m pour une marque de parfums.
Style élégant avec matériaux nobles, éclairage d'ambiance tamisé,
2 vitrines pour exposer les produits, un comptoir design,
et une zone lounge avec canapé. Couleurs : or et noir.
Budget : 8000€
```

### Prompt avec Contraintes
```
Stand écologique 3x3m pour salon bio.
Matériaux naturels, beaucoup de plantes, parquet bois.
Pas d'écrans LED. Budget limité : 2000€
```

### Suggestions Rapides (1 clic)
- 🖥️ **Tech Moderne** : Stand tech avec LED et écrans
- 💎 **Luxe** : Stand haut de gamme premium
- 🌿 **Écologique** : Stand naturel et durable
- 🎮 **Interactif** : Bornes tactiles et démos

## 💾 Sauvegarde & Export

### Sauvegarde Automatique
Le design est automatiquement sauvegardé dans le localStorage :
- Configuration actuelle
- Modules placés
- Paramètres de grille

### Export (Fonctionnalités futures)
- PDF avec plans techniques
- Images HD/4K
- Vidéo 360°
- Devis automatique

## ⚙️ Configuration API IA

Pour activer la génération IA avec OpenAI :

```javascript
// Dans la console du navigateur
localStorage.setItem('openai_api_key', 'sk-votre-clé-api');
```

Sans clé API, le Studio fonctionne en **mode démo** avec des designs prédéfinis.

## 🐛 Dépannage

### Le Studio ne charge pas
1. Vérifiez que le serveur tourne : `npm run dev`
2. Videz le cache du navigateur
3. Vérifiez la console pour les erreurs

### Les modules ne s'affichent pas en 3D
1. Vérifiez que WebGL est supporté par votre navigateur
2. Mettez à jour vos drivers graphiques
3. Essayez un autre navigateur (Chrome/Firefox recommandés)

### L'IA ne génère rien
1. Vérifiez la clé API OpenAI dans localStorage
2. En mode démo, l'IA fonctionne avec des templates
3. Vérifiez votre connexion internet

### Performance lente
1. Réduisez le nombre de modules sur le stand
2. Désactivez les ombres (à venir dans settings)
3. Fermez les autres onglets du navigateur

## 📖 Ressources

- **Documentation complète** : Voir `STAND_STUDIO_README.md`
- **Types TypeScript** : `client/src/types/modules.ts`
- **Modules disponibles** : `client/src/lib/3d/modules.ts`
- **Store Zustand** : `client/src/store/useStudioStore.ts`

## 🎉 C'est Parti !

Vous êtes prêt à créer des stands exceptionnels en quelques minutes ! 🚀

Pour toute question, consultez la documentation ou explorez le code.

**Bon design ! 🎨✨**
