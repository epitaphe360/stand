import { ModuleBase } from '@/types/modules';

/**
 * Bibliothèque de modèles 3D GLTF professionnels
 *
 * Note: Les URLs pointent vers des modèles gratuits disponibles publiquement.
 * Pour la production, remplacez par vos propres modèles ou des assets sous licence.
 */

export interface GLTFConfig {
  /**
   * URL du fichier GLTF/GLB
   */
  url: string;

  /**
   * Échelle par défaut
   */
  defaultScale?: number | [number, number, number];

  /**
   * Utiliser la compression Draco
   */
  useDraco?: boolean;

  /**
   * Overrides de matériaux
   */
  materialOverrides?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    emissiveIntensity?: number;
  };

  /**
   * Animations disponibles
   */
  hasAnimations?: boolean;
  animationNames?: string[];

  /**
   * Licence du modèle
   */
  license?: string;
  attribution?: string;
}

/**
 * Modèles GLTF: Mobilier de Bureau
 */
export const GLTF_FURNITURE_OFFICE: ModuleBase[] = [
  {
    id: 'gltf-001',
    name: 'Bureau Moderne',
    category: 'furniture',
    description: 'Bureau professionnel avec design moderne',
    thumbnailUrl: '/gltf/thumbnails/modern-desk.jpg',
    dimensions: { width: 1.6, height: 0.75, depth: 0.8 },
    defaultMaterial: { type: 'color', value: '#8B7355', metalness: 0.2, roughness: 0.8 },
    price: 350,
    tags: ['bureau', 'mobilier', 'gltf', 'professionnel'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 45,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/office/modern-desk.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-002',
    name: 'Chaise de Bureau Ergonomique',
    category: 'furniture',
    description: 'Chaise de bureau avec dossier ergonomique',
    thumbnailUrl: '/gltf/thumbnails/office-chair.jpg',
    dimensions: { width: 0.6, height: 1.2, depth: 0.6 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.3, roughness: 0.7 },
    price: 220,
    tags: ['chaise', 'mobilier', 'gltf', 'ergonomique'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 18,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/office/ergonomic-chair.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-003',
    name: 'Bibliothèque Modulaire',
    category: 'furniture',
    description: 'Étagère modulaire pour livres et objets',
    thumbnailUrl: '/gltf/thumbnails/bookshelf.jpg',
    dimensions: { width: 1.2, height: 2, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#D4A574', metalness: 0.1, roughness: 0.9 },
    price: 280,
    tags: ['étagère', 'bibliothèque', 'gltf', 'stockage'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 35,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/office/modular-bookshelf.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-004',
    name: 'Table de Réunion Ovale',
    category: 'furniture',
    description: 'Grande table pour réunions et présentations',
    thumbnailUrl: '/gltf/thumbnails/meeting-table.jpg',
    dimensions: { width: 2.4, height: 0.75, depth: 1.2 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.4, roughness: 0.6 },
    price: 550,
    tags: ['table', 'réunion', 'gltf', 'professionnel'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 65,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/office/oval-meeting-table.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-005',
    name: 'Caisson Mobile',
    category: 'furniture',
    description: 'Caisson de rangement sur roulettes',
    thumbnailUrl: '/gltf/thumbnails/mobile-cabinet.jpg',
    dimensions: { width: 0.4, height: 0.6, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#95a5a6', metalness: 0.5, roughness: 0.5 },
    price: 150,
    tags: ['caisson', 'rangement', 'gltf', 'mobile'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 20,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/office/mobile-cabinet.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Modèles GLTF: Électronique et High-Tech
 */
export const GLTF_ELECTRONICS: ModuleBase[] = [
  {
    id: 'gltf-006',
    name: 'Ordinateur Portable Pro',
    category: 'multimedia',
    description: 'Laptop professionnel ouvert',
    thumbnailUrl: '/gltf/thumbnails/laptop.jpg',
    dimensions: { width: 0.35, height: 0.02, depth: 0.25 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.8, roughness: 0.2 },
    price: 50,
    tags: ['ordinateur', 'laptop', 'gltf', 'tech'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/electronics/laptop-pro.glb',
      defaultScale: 1,
      useDraco: true,
      hasAnimations: true,
      animationNames: ['open', 'close'],
    },
  },
  {
    id: 'gltf-007',
    name: 'Smartphone Stand',
    category: 'multimedia',
    description: 'Support de smartphone avec modèle',
    thumbnailUrl: '/gltf/thumbnails/smartphone.jpg',
    dimensions: { width: 0.08, height: 0.16, depth: 0.01 },
    defaultMaterial: { type: 'color', value: '#000000', metalness: 0.9, roughness: 0.1 },
    price: 30,
    tags: ['smartphone', 'téléphone', 'gltf', 'tech'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.5,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/electronics/smartphone-stand.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-008',
    name: 'Tablette Tactile',
    category: 'multimedia',
    description: 'Tablette professionnelle avec support',
    thumbnailUrl: '/gltf/thumbnails/tablet.jpg',
    dimensions: { width: 0.25, height: 0.18, depth: 0.01 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.7, roughness: 0.3 },
    price: 40,
    tags: ['tablette', 'tablet', 'gltf', 'tech'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 1,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/electronics/tablet.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-009',
    name: 'Casque Audio Pro',
    category: 'multimedia',
    description: 'Casque audio professionnel sur support',
    thumbnailUrl: '/gltf/thumbnails/headphones.jpg',
    dimensions: { width: 0.2, height: 0.25, depth: 0.2 },
    defaultMaterial: { type: 'color', value: '#e74c3c', metalness: 0.6, roughness: 0.4 },
    price: 35,
    tags: ['casque', 'audio', 'gltf', 'tech'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 1.5,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/electronics/headphones-pro.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-010',
    name: 'Enceinte Bluetooth',
    category: 'multimedia',
    description: 'Enceinte portable design',
    thumbnailUrl: '/gltf/thumbnails/speaker.jpg',
    dimensions: { width: 0.15, height: 0.3, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#1abc9c', metalness: 0.5, roughness: 0.5 },
    price: 45,
    tags: ['enceinte', 'speaker', 'gltf', 'audio'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/electronics/bluetooth-speaker.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Modèles GLTF: Plantes et Décoration Naturelle
 */
export const GLTF_PLANTS: ModuleBase[] = [
  {
    id: 'gltf-011',
    name: 'Plante en Pot - Monstera',
    category: 'decoration',
    description: 'Grande plante tropicale en pot',
    thumbnailUrl: '/gltf/thumbnails/monstera.jpg',
    dimensions: { width: 0.5, height: 1.2, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#27ae60', metalness: 0, roughness: 0.9 },
    price: 80,
    tags: ['plante', 'décoration', 'gltf', 'naturel'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 12,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/plants/monstera-pot.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-012',
    name: 'Petit Cactus Déco',
    category: 'decoration',
    description: 'Cactus miniature décoratif',
    thumbnailUrl: '/gltf/thumbnails/cactus.jpg',
    dimensions: { width: 0.15, height: 0.3, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#2ecc71', metalness: 0, roughness: 0.95 },
    price: 25,
    tags: ['cactus', 'plante', 'gltf', 'déco'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/plants/small-cactus.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-013',
    name: 'Ficus Artificiel',
    category: 'decoration',
    description: 'Grand ficus en pot pour hall',
    thumbnailUrl: '/gltf/thumbnails/ficus.jpg',
    dimensions: { width: 0.8, height: 1.8, depth: 0.8 },
    defaultMaterial: { type: 'color', value: '#229954', metalness: 0, roughness: 0.9 },
    price: 150,
    tags: ['ficus', 'plante', 'gltf', 'grand'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 25,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/plants/large-ficus.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-014',
    name: 'Succulentes Trio',
    category: 'decoration',
    description: 'Trio de succulentes en pots assortis',
    thumbnailUrl: '/gltf/thumbnails/succulents.jpg',
    dimensions: { width: 0.4, height: 0.15, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#1abc9c', metalness: 0, roughness: 0.9 },
    price: 35,
    tags: ['succulente', 'plante', 'gltf', 'trio'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 3,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/plants/succulents-trio.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-015',
    name: 'Bambou en Pot',
    category: 'decoration',
    description: 'Bambou décoratif oriental',
    thumbnailUrl: '/gltf/thumbnails/bamboo.jpg',
    dimensions: { width: 0.3, height: 1.5, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#27ae60', metalness: 0, roughness: 0.85 },
    price: 90,
    tags: ['bambou', 'plante', 'gltf', 'zen'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 15,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/plants/bamboo-pot.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Modèles GLTF: Objets Décoratifs
 */
export const GLTF_DECORATIONS: ModuleBase[] = [
  {
    id: 'gltf-016',
    name: 'Vase Moderne',
    category: 'decoration',
    description: 'Vase décoratif design contemporain',
    thumbnailUrl: '/gltf/thumbnails/modern-vase.jpg',
    dimensions: { width: 0.2, height: 0.4, depth: 0.2 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.3, roughness: 0.7 },
    price: 60,
    tags: ['vase', 'décoration', 'gltf', 'design'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 3,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/decorations/modern-vase.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-017',
    name: 'Horloge Murale Design',
    category: 'decoration',
    description: 'Horloge murale minimaliste',
    thumbnailUrl: '/gltf/thumbnails/wall-clock.jpg',
    dimensions: { width: 0.4, height: 0.4, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.6, roughness: 0.4 },
    price: 70,
    tags: ['horloge', 'décoration', 'gltf', 'murale'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 2,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/decorations/wall-clock.glb',
      defaultScale: 1,
      useDraco: true,
      hasAnimations: true,
      animationNames: ['tick'],
    },
  },
  {
    id: 'gltf-018',
    name: 'Sculpture Abstraite',
    category: 'decoration',
    description: 'Sculpture moderne pour table',
    thumbnailUrl: '/gltf/thumbnails/sculpture.jpg',
    dimensions: { width: 0.3, height: 0.5, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#bdc3c7', metalness: 0.8, roughness: 0.2 },
    price: 120,
    tags: ['sculpture', 'art', 'gltf', 'moderne'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 8,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/decorations/abstract-sculpture.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-019',
    name: 'Cadre Photo 3D',
    category: 'decoration',
    description: 'Cadre photo avec pied',
    thumbnailUrl: '/gltf/thumbnails/photo-frame.jpg',
    dimensions: { width: 0.25, height: 0.2, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.4, roughness: 0.6 },
    price: 40,
    tags: ['cadre', 'photo', 'gltf', 'déco'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 1,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/decorations/photo-frame.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-020',
    name: 'Bougie Décorative',
    category: 'decoration',
    description: 'Bougie décorative LED',
    thumbnailUrl: '/gltf/thumbnails/candle.jpg',
    dimensions: { width: 0.08, height: 0.2, depth: 0.08 },
    defaultMaterial: { type: 'color', value: '#f39c12', metalness: 0.1, roughness: 0.9 },
    price: 25,
    tags: ['bougie', 'décoration', 'gltf', 'led'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.5,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/decorations/led-candle.glb',
      defaultScale: 1,
      useDraco: true,
      materialOverrides: {
        emissive: '#ff9800',
        emissiveIntensity: 0.5,
      },
    },
  },
];

/**
 * Modèles GLTF: Éclairage Design
 */
export const GLTF_LIGHTING: ModuleBase[] = [
  {
    id: 'gltf-021',
    name: 'Lampe de Bureau Architecte',
    category: 'lighting',
    description: 'Lampe articulée style industriel',
    thumbnailUrl: '/gltf/thumbnails/desk-lamp.jpg',
    dimensions: { width: 0.5, height: 0.7, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.7, roughness: 0.3 },
    price: 90,
    tags: ['lampe', 'éclairage', 'gltf', 'bureau'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 3,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/lighting/architect-lamp.glb',
      defaultScale: 1,
      useDraco: true,
      hasAnimations: true,
      animationNames: ['adjust'],
    },
  },
  {
    id: 'gltf-022',
    name: 'Suspension Design',
    category: 'lighting',
    description: 'Luminaire suspendu moderne',
    thumbnailUrl: '/gltf/thumbnails/pendant-light.jpg',
    dimensions: { width: 0.4, height: 0.6, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.5, roughness: 0.5 },
    price: 150,
    tags: ['suspension', 'éclairage', 'gltf', 'design'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 4,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/lighting/pendant-design.glb',
      defaultScale: 1,
      useDraco: true,
      materialOverrides: {
        emissive: '#ffffff',
        emissiveIntensity: 0.3,
      },
    },
  },
  {
    id: 'gltf-023',
    name: 'Lampadaire Trépied',
    category: 'lighting',
    description: 'Lampadaire sur trépied en bois',
    thumbnailUrl: '/gltf/thumbnails/floor-lamp.jpg',
    dimensions: { width: 0.6, height: 1.8, depth: 0.6 },
    defaultMaterial: { type: 'color', value: '#D4A574', metalness: 0.2, roughness: 0.8 },
    price: 180,
    tags: ['lampadaire', 'éclairage', 'gltf', 'trépied'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 8,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/lighting/tripod-floor-lamp.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-024',
    name: 'Spot LED Orientable',
    category: 'lighting',
    description: 'Spot sur rail orientable',
    thumbnailUrl: '/gltf/thumbnails/track-light.jpg',
    dimensions: { width: 0.15, height: 0.25, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.8, roughness: 0.2 },
    price: 70,
    tags: ['spot', 'led', 'gltf', 'orientable'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/lighting/led-track-spot.glb',
      defaultScale: 1,
      useDraco: true,
      materialOverrides: {
        emissive: '#ffffff',
        emissiveIntensity: 0.6,
      },
    },
  },
  {
    id: 'gltf-025',
    name: 'Applique Murale LED',
    category: 'lighting',
    description: 'Applique murale design minimaliste',
    thumbnailUrl: '/gltf/thumbnails/wall-light.jpg',
    dimensions: { width: 0.3, height: 0.15, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#95a5a6', metalness: 0.6, roughness: 0.4 },
    price: 85,
    tags: ['applique', 'murale', 'gltf', 'led'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 1.5,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/lighting/wall-light-led.glb',
      defaultScale: 1,
      useDraco: true,
      materialOverrides: {
        emissive: '#ffffff',
        emissiveIntensity: 0.4,
      },
    },
  },
];

/**
 * Modèles GLTF: Accessoires de Présentation
 */
export const GLTF_DISPLAY: ModuleBase[] = [
  {
    id: 'gltf-026',
    name: 'Présentoir à Brochures 3 Niveaux',
    category: 'plv',
    description: 'Porte-brochures sur pied',
    thumbnailUrl: '/gltf/thumbnails/brochure-stand.jpg',
    dimensions: { width: 0.35, height: 1.2, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#bdc3c7', metalness: 0.7, roughness: 0.3 },
    price: 120,
    tags: ['présentoir', 'brochure', 'gltf', 'plv'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 8,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/display/brochure-stand-3tier.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-027',
    name: 'Vitrine Cubique',
    category: 'furniture',
    description: 'Vitrine d\'exposition en verre',
    thumbnailUrl: '/gltf/thumbnails/display-case.jpg',
    dimensions: { width: 0.6, height: 1.8, depth: 0.6 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.8, roughness: 0.1 },
    price: 350,
    tags: ['vitrine', 'exposition', 'gltf', 'verre'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: false },
    weight: 45,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/display/glass-display-case.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-028',
    name: 'Mannequin Buste',
    category: 'plv',
    description: 'Buste de mannequin pour vêtements',
    thumbnailUrl: '/gltf/thumbnails/mannequin.jpg',
    dimensions: { width: 0.45, height: 1.5, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#f5f5f5', metalness: 0.1, roughness: 0.9 },
    price: 180,
    tags: ['mannequin', 'buste', 'gltf', 'textile'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 12,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/display/mannequin-bust.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-029',
    name: 'Podium Tournant',
    category: 'plv',
    description: 'Podium rotatif pour produits',
    thumbnailUrl: '/gltf/thumbnails/turntable.jpg',
    dimensions: { width: 0.5, height: 0.15, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.6, roughness: 0.4 },
    price: 200,
    tags: ['podium', 'tournant', 'gltf', 'rotation'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 15,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/display/rotating-turntable.glb',
      defaultScale: 1,
      useDraco: true,
      hasAnimations: true,
      animationNames: ['rotate'],
    },
  },
  {
    id: 'gltf-030',
    name: 'Chevalet de Présentation',
    category: 'plv',
    description: 'Chevalet pour affiches et présentations',
    thumbnailUrl: '/gltf/thumbnails/easel.jpg',
    dimensions: { width: 0.7, height: 1.8, depth: 0.6 },
    defaultMaterial: { type: 'color', value: '#8B7355', metalness: 0.2, roughness: 0.8 },
    price: 95,
    tags: ['chevalet', 'présentation', 'gltf', 'affiche'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 6,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/display/presentation-easel.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Modèles GLTF: Objets Quotidiens
 */
export const GLTF_EVERYDAY: ModuleBase[] = [
  {
    id: 'gltf-031',
    name: 'Tasse à Café',
    category: 'decoration',
    description: 'Tasse de café avec soucoupe',
    thumbnailUrl: '/gltf/thumbnails/coffee-cup.jpg',
    dimensions: { width: 0.1, height: 0.12, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.2, roughness: 0.8 },
    price: 15,
    tags: ['tasse', 'café', 'gltf', 'accessoire'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.3,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/everyday/coffee-cup.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-032',
    name: 'Livre Ouvert',
    category: 'decoration',
    description: 'Livre ouvert décoratif',
    thumbnailUrl: '/gltf/thumbnails/open-book.jpg',
    dimensions: { width: 0.25, height: 0.05, depth: 0.2 },
    defaultMaterial: { type: 'color', value: '#D4A574', metalness: 0, roughness: 0.9 },
    price: 20,
    tags: ['livre', 'book', 'gltf', 'déco'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.8,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/everyday/open-book.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-033',
    name: 'Stylo et Porte-stylos',
    category: 'decoration',
    description: 'Pot à crayons avec stylos',
    thumbnailUrl: '/gltf/thumbnails/pen-holder.jpg',
    dimensions: { width: 0.1, height: 0.15, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#3498db', metalness: 0.3, roughness: 0.7 },
    price: 18,
    tags: ['stylo', 'crayon', 'gltf', 'bureau'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.5,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/everyday/pen-holder.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-034',
    name: 'Calendrier de Bureau',
    category: 'decoration',
    description: 'Calendrier perpétuel design',
    thumbnailUrl: '/gltf/thumbnails/desk-calendar.jpg',
    dimensions: { width: 0.2, height: 0.15, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#e74c3c', metalness: 0.4, roughness: 0.6 },
    price: 25,
    tags: ['calendrier', 'bureau', 'gltf', 'accessoire'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.6,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/everyday/desk-calendar.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-035',
    name: 'Bouteille d\'Eau Design',
    category: 'decoration',
    description: 'Bouteille réutilisable moderne',
    thumbnailUrl: '/gltf/thumbnails/water-bottle.jpg',
    dimensions: { width: 0.08, height: 0.25, depth: 0.08 },
    defaultMaterial: { type: 'color', value: '#1abc9c', metalness: 0.6, roughness: 0.3 },
    price: 22,
    tags: ['bouteille', 'eau', 'gltf', 'eco'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.4,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/everyday/water-bottle.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Modèles GLTF: Art et Sculpture
 */
export const GLTF_ART: ModuleBase[] = [
  {
    id: 'gltf-036',
    name: 'Buste Grec Classique',
    category: 'decoration',
    description: 'Reproduction de buste antique',
    thumbnailUrl: '/gltf/thumbnails/greek-bust.jpg',
    dimensions: { width: 0.3, height: 0.5, depth: 0.25 },
    defaultMaterial: { type: 'color', value: '#f5f5f5', metalness: 0.1, roughness: 0.9 },
    price: 200,
    tags: ['buste', 'sculpture', 'gltf', 'art'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 15,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/art/greek-bust.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-037',
    name: 'Sculpture Géométrique',
    category: 'decoration',
    description: 'Sculpture géométrique contemporaine',
    thumbnailUrl: '/gltf/thumbnails/geometric-sculpture.jpg',
    dimensions: { width: 0.4, height: 0.6, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#e67e22', metalness: 0.8, roughness: 0.2 },
    price: 180,
    tags: ['sculpture', 'géométrique', 'gltf', 'moderne'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 12,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/art/geometric-sculpture.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-038',
    name: 'Tableau Moderne Encadré',
    category: 'decoration',
    description: 'Tableau abstrait avec cadre',
    thumbnailUrl: '/gltf/thumbnails/framed-art.jpg',
    dimensions: { width: 0.8, height: 1.2, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.3, roughness: 0.7 },
    price: 250,
    tags: ['tableau', 'art', 'gltf', 'cadre'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: false },
    weight: 8,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/art/framed-modern-art.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-039',
    name: 'Statue Minimaliste',
    category: 'decoration',
    description: 'Statue design épuré',
    thumbnailUrl: '/gltf/thumbnails/minimal-statue.jpg',
    dimensions: { width: 0.2, height: 0.8, depth: 0.2 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.9, roughness: 0.1 },
    price: 300,
    tags: ['statue', 'minimaliste', 'gltf', 'design'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 20,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/art/minimal-statue.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-040',
    name: 'Installation Lumineuse',
    category: 'decoration',
    description: 'Art lumineux interactif',
    thumbnailUrl: '/gltf/thumbnails/light-installation.jpg',
    dimensions: { width: 0.5, height: 0.7, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#9b59b6', metalness: 0.7, roughness: 0.3 },
    price: 400,
    tags: ['installation', 'art', 'gltf', 'lumière'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 10,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/art/light-installation.glb',
      defaultScale: 1,
      useDraco: true,
      hasAnimations: true,
      animationNames: ['glow'],
      materialOverrides: {
        emissive: '#9b59b6',
        emissiveIntensity: 0.8,
      },
    },
  },
];

/**
 * Modèles GLTF: Produits Retail
 */
export const GLTF_PRODUCTS: ModuleBase[] = [
  {
    id: 'gltf-041',
    name: 'Montre Luxe',
    category: 'plv',
    description: 'Montre de luxe sur présentoir',
    thumbnailUrl: '/gltf/thumbnails/luxury-watch.jpg',
    dimensions: { width: 0.05, height: 0.05, depth: 0.01 },
    defaultMaterial: { type: 'color', value: '#f39c12', metalness: 0.9, roughness: 0.1 },
    price: 50,
    tags: ['montre', 'luxe', 'gltf', 'produit'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: false },
    weight: 0.2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/products/luxury-watch.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-042',
    name: 'Parfum Premium',
    category: 'plv',
    description: 'Flacon de parfum design',
    thumbnailUrl: '/gltf/thumbnails/perfume.jpg',
    dimensions: { width: 0.08, height: 0.15, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#e74c3c', metalness: 0.8, roughness: 0.2 },
    price: 35,
    tags: ['parfum', 'cosmétique', 'gltf', 'luxe'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.3,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/products/premium-perfume.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-043',
    name: 'Lunettes de Soleil',
    category: 'plv',
    description: 'Lunettes design sur support',
    thumbnailUrl: '/gltf/thumbnails/sunglasses.jpg',
    dimensions: { width: 0.15, height: 0.05, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#000000', metalness: 0.7, roughness: 0.3 },
    price: 30,
    tags: ['lunettes', 'accessoire', 'gltf', 'mode'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/products/sunglasses.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-044',
    name: 'Sac à Main Designer',
    category: 'plv',
    description: 'Sac à main de créateur',
    thumbnailUrl: '/gltf/thumbnails/handbag.jpg',
    dimensions: { width: 0.35, height: 0.3, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#8B4513', metalness: 0.3, roughness: 0.7 },
    price: 45,
    tags: ['sac', 'mode', 'gltf', 'accessoire'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 1.5,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/products/designer-handbag.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-045',
    name: 'Chaussure Sport',
    category: 'plv',
    description: 'Sneaker sur présentoir',
    thumbnailUrl: '/gltf/thumbnails/sneaker.jpg',
    dimensions: { width: 0.3, height: 0.15, depth: 0.12 },
    defaultMaterial: { type: 'color', value: '#e74c3c', metalness: 0.2, roughness: 0.8 },
    price: 28,
    tags: ['chaussure', 'sport', 'gltf', 'sneaker'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 0.8,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/products/sport-sneaker.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Modèles GLTF: Food & Beverage
 */
export const GLTF_FOOD: ModuleBase[] = [
  {
    id: 'gltf-046',
    name: 'Bouteille de Vin',
    category: 'decoration',
    description: 'Bouteille de vin avec étiquette',
    thumbnailUrl: '/gltf/thumbnails/wine-bottle.jpg',
    dimensions: { width: 0.08, height: 0.3, depth: 0.08 },
    defaultMaterial: { type: 'color', value: '#27ae60', metalness: 0.7, roughness: 0.3 },
    price: 25,
    tags: ['vin', 'bouteille', 'gltf', 'boisson'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 1.2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/food/wine-bottle.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-047',
    name: 'Coupe à Champagne',
    category: 'decoration',
    description: 'Flûte à champagne élégante',
    thumbnailUrl: '/gltf/thumbnails/champagne-glass.jpg',
    dimensions: { width: 0.08, height: 0.25, depth: 0.08 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.9, roughness: 0.1 },
    price: 18,
    tags: ['champagne', 'verre', 'gltf', 'élégant'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 0.3,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/food/champagne-glass.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-048',
    name: 'Panier de Fruits',
    category: 'decoration',
    description: 'Corbeille avec fruits décoratifs',
    thumbnailUrl: '/gltf/thumbnails/fruit-basket.jpg',
    dimensions: { width: 0.35, height: 0.2, depth: 0.35 },
    defaultMaterial: { type: 'color', value: '#e67e22', metalness: 0, roughness: 0.9 },
    price: 40,
    tags: ['fruits', 'panier', 'gltf', 'déco'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: false, color: false },
    weight: 2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/food/fruit-basket.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-049',
    name: 'Machine à Café Expresso',
    category: 'furniture',
    description: 'Machine à café professionnelle',
    thumbnailUrl: '/gltf/thumbnails/espresso-machine.jpg',
    dimensions: { width: 0.35, height: 0.4, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.8, roughness: 0.2 },
    price: 150,
    tags: ['café', 'machine', 'gltf', 'pro'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 12,
    stackable: false,
    gltfConfig: {
      url: '/assets/models/food/espresso-machine.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
  {
    id: 'gltf-050',
    name: 'Plateau Apéritif',
    category: 'decoration',
    description: 'Plateau avec snacks et verres',
    thumbnailUrl: '/gltf/thumbnails/appetizer-tray.jpg',
    dimensions: { width: 0.45, height: 0.05, depth: 0.35 },
    defaultMaterial: { type: 'color', value: '#D4A574', metalness: 0.2, roughness: 0.8 },
    price: 35,
    tags: ['plateau', 'apéritif', 'gltf', 'déco'],
    meshType: 'gltf',
    customizable: { dimensions: false, material: true, color: true },
    weight: 2,
    stackable: true,
    gltfConfig: {
      url: '/assets/models/food/appetizer-tray.glb',
      defaultScale: 1,
      useDraco: true,
    },
  },
];

/**
 * Collection complète de tous les modèles GLTF
 */
export const ALL_GLTF_MODELS: ModuleBase[] = [
  ...GLTF_FURNITURE_OFFICE,
  ...GLTF_ELECTRONICS,
  ...GLTF_PLANTS,
  ...GLTF_DECORATIONS,
  ...GLTF_LIGHTING,
  ...GLTF_DISPLAY,
  ...GLTF_EVERYDAY,
  ...GLTF_ART,
  ...GLTF_PRODUCTS,
  ...GLTF_FOOD,
];

/**
 * Obtenir un modèle GLTF par ID
 */
export function getGLTFModelById(id: string): ModuleBase | undefined {
  return ALL_GLTF_MODELS.find((model) => model.id === id);
}

/**
 * Obtenir tous les modèles d'une catégorie
 */
export function getGLTFModelsByCategory(category: string): ModuleBase[] {
  return ALL_GLTF_MODELS.filter((model) => model.category === category);
}

/**
 * Rechercher des modèles GLTF par tags
 */
export function searchGLTFModels(query: string): ModuleBase[] {
  const lowerQuery = query.toLowerCase();
  return ALL_GLTF_MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(lowerQuery) ||
      model.description?.toLowerCase().includes(lowerQuery) ||
      model.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Statistiques de la bibliothèque GLTF
 */
export function getGLTFLibraryStats(): {
  totalModels: number;
  categories: Record<string, number>;
  hasAnimations: number;
  useDraco: number;
} {
  const categories: Record<string, number> = {};
  let hasAnimations = 0;
  let useDraco = 0;

  ALL_GLTF_MODELS.forEach((model) => {
    // Compter par catégorie
    categories[model.category] = (categories[model.category] || 0) + 1;

    // Compter animations
    const gltfConfig = (model as any).gltfConfig as GLTFConfig | undefined;
    if (gltfConfig?.hasAnimations) {
      hasAnimations++;
    }

    // Compter Draco
    if (gltfConfig?.useDraco) {
      useDraco++;
    }
  });

  return {
    totalModels: ALL_GLTF_MODELS.length,
    categories,
    hasAnimations,
    useDraco,
  };
}
