# 🎨 Guide du Système de Branding Stand-Planet

## Vue d'ensemble
Le système de branding et de personnalisation permet aux clients d'appliquer leur identité visuelle complète à leurs stands 3D, y compris:
- 🏢 Logos et images de marque
- 🎨 Palette de couleurs personnalisée
- ✍️ Textes et headlines customisés
- 🏗️ Matériaux et finitions (murs, sols, mobilier)
- 💡 Effets visuels avancés

---

## Architecture Technique

### Store Zustand (`useBrandingStore.ts`)
Le state management central pour tous les paramètres de branding:

```typescript
interface BrandingConfig {
  companyName: string;
  primaryColor: string;           // Couleur principale (#rrggbb)
  secondaryColor: string;         // Couleur secondaire
  accentColor: string;            // Couleur d'accent
  logoUrl?: string;               // URL ou base64 du logo
  logoScale: number;              // Échelle 0.5-2.0x
  textCustom: {
    headline: string;
    tagline: string;
    customText: string;
  };
  materials: {
    wallMaterial: 'white' | 'black' | 'custom';
    wallColor: string;
    floorMaterial: 'marble' | 'polished' | 'wood' | 'concrete' | 'carpet';
    floorColor: string;
  };
  effects: {
    enableSpotlights: boolean;
    ambientIntensity: number;     // 0.5-1.5
    enableGlowEffect: boolean;
    enableFog: boolean;
  };
}
```

### Interface Utilisateur (`BrandingPanel.tsx`)
Composant React avec 4 onglets principaux:

#### 1. **Identité** - Fondation de la marque
- **Nom de l'Entreprise**: Champ texte libre
- **Upload du Logo**: 
  - Accepte JPG, PNG, GIF, WebP
  - Affichage en aperçu
  - Stockage en base64 ou URL
- **Titre Principal**: Headline du stand
- **Sous-titre**: Tagline secondaire
- **Texte Additionnel**: Contenu personnalisé

#### 2. **Couleurs** - Palette visuelle
- **Sélecteur Couleur HTML5**: Color picker natif
- **Entrée Hex**: Saisie manuelle (#rrggbb)
- **Aperçu en Temps Réel**: Bandes de couleur
- **Palette d'Ensemble**: Visualisation des 3 couleurs

#### 3. **Matériaux** - Revêtements et finitions
- **Murs**:
  - Blanc (par défaut, mat)
  - Noir (luxe, brillant)
  - Personnalisé (couleur libre)
- **Sols**:
  - Marbre (élégant, réfléchissant)
  - Poli (industriel, brillant)
  - Bois (chaleureux, texture)
  - Béton (brut, design)
  - Moquette (confortable, moelleux)

#### 4. **Effets** - Ambiance visuelle
- **Intensité Lumineuse** (0.5-1.5): Slider ambiant
- **Projecteurs Orientables**: Toggle pour éclairage produit
- **Effet de Luminescence**: Toggle glow/bloom
- **Brume Atmosphérique**: Toggle fog effect

---

## Utilisation

### Accès au Panel
```typescript
import { BrandingPanel } from '@/components/studio/BrandingPanel';

// Dans le configurateur
<BrandingPanel />
```

### Actions Disponibles
1. **Réinitialiser**: Reset à la configuration par défaut
2. **Exporter Config**: Télécharge JSON de configuration
3. **Importer Config**: Charge une configuration antérieure

### Programmation (Hook)
```typescript
import { useBrandingStore } from '@/store/useBrandingStore';

function MonComponent() {
  const branding = useBrandingStore();

  // Lecture
  const color = branding.primaryColor;
  const logo = branding.logoUrl;

  // Écriture
  branding.setPrimaryColor('#ff6b35');
  branding.setCompanyName('Mon Entreprise');
  branding.setLogoUrl(base64ImageData);
  branding.setAmbientIntensity(1.2);

  return <div style={{ background: color }}>{branding.companyName}</div>;
}
```

---

## Application Visuelle dans le Stand

### Murs et Sol (Environment.tsx)
```typescript
const { materials, effects } = useBrandingStore();

// Application du matériau de mur
const wallColor = materials.wallMaterial === 'custom' 
  ? materials.wallColor 
  : materials.wallMaterial === 'black' ? '#000000' : '#ffffff';

// Intensité lumineuse
<ambientLight intensity={effects.ambientIntensity} />

// Effets avancés
{effects.enableGlowEffect && <UniversalCamera effects={Glow} />}
{effects.enableFog && <fog attach="fog" args={[...]} />}
```

### Textures et Logos (Module3D.tsx)
```typescript
if (module.meshType === 'wall-surface') {
  const { materials } = useBrandingStore();
  
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial 
        color={materials.wallColor}
        // Logo overlay si présent
        map={materials.logoUrl ? new THREE.TextureLoader().load(materials.logoUrl) : undefined}
      />
    </mesh>
  );
}
```

### Comptoir LED (Integration)
```typescript
// Comptoir bar peut afficher texts personnalisés
// via canvas texture + emissive map avec texte
```

---

## Configurations Prédéfinies

### Template "Startup Tech" 
```json
{
  "primaryColor": "#3b82f6",
  "secondaryColor": "#1e40af",
  "accentColor": "#ec4899",
  "materials": {
    "wallMaterial": "white",
    "floorMaterial": "polished"
  },
  "effects": {
    "enableSpotlights": true,
    "ambientIntensity": 1.2,
    "enableGlowEffect": true
  }
}
```

### Template "Luxe Premium"
```json
{
  "primaryColor": "#000000",
  "secondaryColor": "#d4af37",
  "accentColor": "#ffffff",
  "materials": {
    "wallMaterial": "black",
    "floorMaterial": "marble"
  },
  "effects": {
    "enableSpotlights": true,
    "ambientIntensity": 0.9,
    "enableFog": true
  }
}
```

### Template "Écologique"
```json
{
  "primaryColor": "#10b981",
  "secondaryColor": "#059669",
  "accentColor": "#34d399",
  "materials": {
    "wallMaterial": "custom",
    "wallColor": "#ecfdf5",
    "floorMaterial": "wood"
  },
  "effects": {
    "enableSpotlights": false,
    "ambientIntensity": 1.0,
    "enableGlowEffect": false
  }
}
```

---

## Optimisations Visuelles

### Performance
- **Lazy Loading**: Logos chargés seulement au rendu
- **Texture Caching**: Réutilisation des materials
- **LOD System**: Réduction détail selon zoom

### Qualité
- **Gamut Amélioration**: Sélection couleur avec contraste WCAG
- **Material Physics**: Roughness/Metalness ajustés par type
- **Lighting Balance**: Intensité normalisée 0-2.0 range

---

## Intégration Stand Templates

Chaque template pré-configure un branding par défaut:

```typescript
// Dans standTemplates.ts
const templates: StandTemplate[] = [
  {
    id: 'tech-9m',
    name: 'Tech Innovation 9m²',
    brandingPreset: {
      primaryColor: '#3b82f6',
      logoScale: 1.2,
      effects: { enableSpotlights: true }
    }
  }
];
```

---

## Export/Import

### Format JSON
```json
{
  "companyName": "Acme Corp",
  "primaryColor": "#ff6b35",
  "secondaryColor": "#004e89",
  "accentColor": "#1b6ca8",
  "logoScale": 1.0,
  "textCustom": {
    "headline": "Acme - Innovation Première",
    "tagline": "Depuis 1990",
    "customText": ""
  },
  "materials": {
    "wallMaterial": "custom",
    "wallColor": "#f5f5f5",
    "floorMaterial": "polished",
    "floorColor": "#d3d3d3"
  },
  "effects": {
    "enableSpotlights": true,
    "ambientIntensity": 1.1,
    "enableGlowEffect": false,
    "enableFog": false
  }
}
```

### Cas d'Usage
1. **Sauvegarde de Branding**: Exporte config, réutilise sur multiples stands
2. **Sharing B2B**: Client exporte, fournisseur importe
3. **Versioning**: Historique des configurations
4. **Templates Personnalisés**: Crée des presets custom

---

## Limitations et Considérations

### À Venir
- ✅ Upload logo basé64 / URL
- ✅ Palette 3 couleurs
- ✅ Contrôle matériaux simple
- ⏳ Générateur de palette (AI)
- ⏳ Upload polices custom
- ⏳ Logos sur modules individuels
- ⏳ Thème dynamique temps réel

### Performance
- Logo de **maximum 5MB** recommandé (compression automatique)
- **500px min** pour qualité acceptable
- Palettes couleur**contrast ratio 4.5:1** minimum (WCAG AA)

---

## Avenir: Features Plannifiées

### Phase 2
- **Générateur IA de Palette**: Analyse logo → génère palette harmonieuse
- **Pattern Overlay**: Textures répétables sur murs/sols
- **Animation de Branding**: Transitions de couleur au démarrage

### Phase 3
- **Branding par Module**: Appliquer couleurs différentes par zone
- **Fonts Personnalisées**: Upload de polices .woff2
- **QR Code Branding**: Logo customisé intégré aux codes QR

---

**Version**: 1.0  
**Dernier Update**: 2025-01-11  
**Support**: branding@stand-planet.com
