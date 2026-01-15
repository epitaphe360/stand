// Bibliothèque de modules prédéfinis pour le Stand Studio
import { ModuleBase } from '@/types/modules';

// === STRUCTURES DE BASE ===
export const STRUCTURES: ModuleBase[] = [
  {
    id: 'struct-001',
    name: 'Base Stand 3x3m',
    category: 'structure',
    description: 'Structure de base carrée de 3x3 mètres',
    thumbnailUrl: '/modules/structures/3x3.png',
    dimensions: { width: 3, height: 0.1, depth: 3 },
    defaultMaterial: { type: 'color', value: '#e8e8e8' },
    price: 500,
    tags: ['base', 'small', 'standard'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'struct-002',
    name: 'Base Stand 6x3m',
    category: 'structure',
    description: 'Structure rectangulaire de 6x3 mètres',
    thumbnailUrl: '/modules/structures/6x3.png',
    dimensions: { width: 6, height: 0.1, depth: 3 },
    defaultMaterial: { type: 'color', value: '#e8e8e8' },
    price: 800,
    tags: ['base', 'medium', 'rectangular'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'struct-003',
    name: 'Base Stand 9x3m',
    category: 'structure',
    description: 'Grande structure de 9x3 mètres',
    thumbnailUrl: '/modules/structures/9x3.png',
    dimensions: { width: 9, height: 0.1, depth: 3 },
    defaultMaterial: { type: 'color', value: '#e8e8e8' },
    price: 1200,
    tags: ['base', 'large', 'rectangular'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'struct-004',
    name: 'Base Stand Îlot 6x6m',
    category: 'structure',
    description: 'Stand îlot carré de 6x6 mètres',
    thumbnailUrl: '/modules/structures/6x6-island.png',
    dimensions: { width: 6, height: 0.1, depth: 6 },
    defaultMaterial: { type: 'color', value: '#e8e8e8' },
    price: 2000,
    tags: ['base', 'island', 'large', 'premium'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  }
];

// === MURS & CLOISONS ===
export const WALLS: ModuleBase[] = [
  {
    id: 'wall-001',
    name: 'Mur Plein Blanc',
    category: 'wall',
    description: 'Mur plein standard blanc, hauteur 2.5m',
    thumbnailUrl: '/modules/walls/plain-white.png',
    dimensions: { width: 3, height: 2.5, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#ffffff' },
    price: 150,
    tags: ['wall', 'plain', 'standard'],
    meshType: 'gltf',
    gltfUrl: '/models/walls/wall_standard.glb',
    weight: 25,
    stackable: false,
    snapPoints: [
      { position: { x: 0, y: 1.25, z: 0.05 }, type: 'wall' },
      { position: { x: 0, y: 1.25, z: -0.05 }, type: 'wall' }
    ],
    customizable: { dimensions: true, material: false, color: true }
  },
  {
    id: 'wall-002',
    name: 'Mur Vitré',
    category: 'wall',
    description: 'Cloison vitrée transparente',
    thumbnailUrl: '/modules/walls/glass.png',
    dimensions: { width: 3, height: 2.5, depth: 0.05 },
    defaultMaterial: { type: 'material', value: 'glass', opacity: 0.3, metalness: 0.9, roughness: 0.1 },
    price: 400,
    tags: ['wall', 'glass', 'transparent', 'modern'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: false }
  },
  {
    id: 'wall-003',
    name: 'Mur LED Lumineux',
    category: 'wall',
    description: 'Panneau LED rétroéclairé',
    thumbnailUrl: '/modules/walls/led-wall.png',
    dimensions: { width: 3, height: 2.5, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#00aaff' },
    price: 800,
    tags: ['wall', 'led', 'light', 'premium', 'modern'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true }
  },
  {
    id: 'wall-004',
    name: 'Mur Courbe Design',
    category: 'wall',
    description: 'Cloison courbe moderne',
    thumbnailUrl: '/modules/walls/curved.png',
    dimensions: { width: 3, height: 2.5, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#2c3e50' },
    price: 600,
    tags: ['wall', 'curved', 'design', 'premium'],
    meshType: 'custom',
    customizable: { dimensions: false, material: true, color: true }
  }
];

// === MOBILIER ===
export const FURNITURE: ModuleBase[] = [
  {
    id: 'furn-001',
    name: 'Comptoir Accueil',
    category: 'furniture',
    description: 'Comptoir d\'accueil standard avec rangements',
    thumbnailUrl: '/modules/furniture/counter.png',
    dimensions: { width: 2, height: 1.1, depth: 0.6 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.2, roughness: 0.8 },
    price: 350,
    tags: ['counter', 'reception', 'essential'],
    meshType: 'gltf',
    gltfUrl: '/models/furniture/counter.glb',
    weight: 45,
    stackable: true,
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'furn-002',
    name: 'Vitrine Verticale',
    category: 'furniture',
    description: 'Vitrine d\'exposition éclairée',
    thumbnailUrl: '/modules/furniture/display-case.png',
    dimensions: { width: 0.8, height: 2, depth: 0.8 },
    defaultMaterial: { type: 'material', value: 'glass', opacity: 0.4, metalness: 0.9, roughness: 0.1 },
    price: 450,
    tags: ['display', 'showcase', 'glass', 'premium'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'furn-003',
    name: 'Table Haute Bar',
    category: 'furniture',
    description: 'Table haute style bar avec plateau rond',
    thumbnailUrl: '/modules/furniture/bar-table.png',
    dimensions: { width: 0.8, height: 1.1, depth: 0.8 },
    defaultMaterial: { type: 'color', value: '#ecf0f1' },
    price: 120,
    tags: ['table', 'bar', 'meeting'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'furn-004',
    name: 'Canapé 2 Places',
    category: 'furniture',
    description: 'Canapé design pour espace lounge',
    thumbnailUrl: '/modules/furniture/sofa.png',
    dimensions: { width: 1.8, height: 0.8, depth: 0.9 },
    defaultMaterial: { type: 'color', value: '#3498db' },
    price: 400,
    tags: ['sofa', 'lounge', 'seating', 'comfort'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'furn-005',
    name: 'Étagère Murale',
    category: 'furniture',
    description: 'Étagère modulaire à 3 niveaux',
    thumbnailUrl: '/modules/furniture/shelf.png',
    dimensions: { width: 2, height: 2, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#8b4513', roughness: 0.9 },
    price: 200,
    tags: ['shelf', 'storage', 'display'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'furn-006',
    name: 'Tabouret Design',
    category: 'furniture',
    description: 'Tabouret haut moderne',
    thumbnailUrl: '/modules/furniture/stool.png',
    dimensions: { width: 0.4, height: 0.75, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#e74c3c', metalness: 0.5, roughness: 0.5 },
    price: 80,
    tags: ['stool', 'seating', 'bar'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'furn-007',
    name: 'Table Basse Design',
    category: 'furniture',
    description: 'Table basse moderne pour espace lounge',
    thumbnailUrl: '/modules/furniture/coffee-table.png',
    dimensions: { width: 1.2, height: 0.4, depth: 0.7 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.3, roughness: 0.6 },
    price: 180,
    tags: ['table', 'lounge', 'modern', 'coffee'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'furn-008',
    name: 'Fauteuil Lounge',
    category: 'furniture',
    description: 'Fauteuil confortable design premium',
    thumbnailUrl: '/modules/furniture/armchair.png',
    dimensions: { width: 0.8, height: 0.9, depth: 0.9 },
    defaultMaterial: { type: 'color', value: '#34495e' },
    price: 320,
    tags: ['armchair', 'lounge', 'seating', 'comfort', 'premium'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'furn-009',
    name: 'Comptoir Bar Lumineux',
    category: 'furniture',
    description: 'Comptoir bar avec éclairage LED intégré',
    thumbnailUrl: '/modules/furniture/bar-counter-led.png',
    dimensions: { width: 2.5, height: 1.2, depth: 0.6 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.8, roughness: 0.2 },
    price: 750,
    tags: ['bar', 'counter', 'led', 'premium', 'modern'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'furn-010',
    name: 'Présentoir Multi-Niveaux',
    category: 'furniture',
    description: 'Présentoir produits 3 niveaux avec éclairage',
    thumbnailUrl: '/modules/furniture/display-stand.png',
    dimensions: { width: 1, height: 1.5, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.4, roughness: 0.6 },
    price: 280,
    tags: ['display', 'showcase', 'shelf', 'product'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  }
];

// === PLV (PUBLICITÉ SUR LIEU DE VENTE) ===
export const PLV: ModuleBase[] = [
  {
    id: 'plv-001',
    name: 'Totem Publicitaire LED',
    category: 'plv',
    description: 'Totem lumineux double face avec éclairage LED',
    thumbnailUrl: '/modules/plv/totem-led.png',
    dimensions: { width: 0.8, height: 2.4, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.2, roughness: 0.8 },
    price: 450,
    tags: ['totem', 'signage', 'led', 'display', 'advertising'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'plv-002',
    name: 'Roll-up Premium',
    category: 'plv',
    description: 'Roll-up enroulable 85x200cm avec impression HD',
    thumbnailUrl: '/modules/plv/rollup.png',
    dimensions: { width: 0.85, height: 2, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#ffffff' },
    price: 120,
    tags: ['rollup', 'banner', 'portable', 'advertising'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'plv-003',
    name: 'Kakémono Suspendu',
    category: 'plv',
    description: 'Kakémono tissu suspendu avec structure aluminium',
    thumbnailUrl: '/modules/plv/kakemono-hanging.png',
    dimensions: { width: 1, height: 2.5, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#ffffff' },
    price: 180,
    tags: ['kakemono', 'hanging', 'banner', 'fabric', 'large'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'plv-004',
    name: 'X-Banner Compact',
    category: 'plv',
    description: 'X-Banner léger 60x160cm',
    thumbnailUrl: '/modules/plv/xbanner.png',
    dimensions: { width: 0.6, height: 1.6, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#ffffff' },
    price: 60,
    tags: ['xbanner', 'compact', 'portable', 'cheap'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'plv-005',
    name: 'Enseigne Lumineuse 3D',
    category: 'plv',
    description: 'Logo 3D rétroéclairé avec LED RGB',
    thumbnailUrl: '/modules/plv/3d-sign.png',
    dimensions: { width: 1.5, height: 0.5, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.1, roughness: 0.9 },
    price: 650,
    tags: ['sign', '3d', 'led', 'logo', 'premium', 'branding'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true }
  },
  {
    id: 'plv-006',
    name: 'Drapeau Publicitaire',
    category: 'plv',
    description: 'Drapeau publicitaire wind flag 3m',
    thumbnailUrl: '/modules/plv/flag.png',
    dimensions: { width: 0.7, height: 3, depth: 0.02 },
    defaultMaterial: { type: 'color', value: '#e74c3c' },
    price: 95,
    tags: ['flag', 'outdoor', 'wind', 'tall'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'plv-007',
    name: 'Comptoir Pliable PLV',
    category: 'plv',
    description: 'Comptoir portable avec visuel imprimé',
    thumbnailUrl: '/modules/plv/counter-portable.png',
    dimensions: { width: 1.2, height: 0.9, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#3498db' },
    price: 220,
    tags: ['counter', 'portable', 'compact', 'display'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  }
];

// === ÉCLAIRAGE ===
export const LIGHTING: ModuleBase[] = [
  {
    id: 'light-001',
    name: 'Spot LED Encastré',
    category: 'lighting',
    description: 'Spot LED orientable',
    thumbnailUrl: '/modules/lighting/spot.png',
    dimensions: { width: 0.15, height: 0.2, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#ffffff' },
    price: 50,
    tags: ['spot', 'led', 'ceiling'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'light-002',
    name: 'Bandeau LED',
    category: 'lighting',
    description: 'Barre LED RGB programmable',
    thumbnailUrl: '/modules/lighting/led-strip.png',
    dimensions: { width: 2, height: 0.05, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#00ffff' },
    price: 150,
    tags: ['led', 'strip', 'rgb', 'modern'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true }
  },
  {
    id: 'light-003',
    name: 'Suspension Design',
    category: 'lighting',
    description: 'Luminaire suspendu moderne',
    thumbnailUrl: '/modules/lighting/pendant.png',
    dimensions: { width: 0.5, height: 1.5, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#f39c12', metalness: 0.8, roughness: 0.2 },
    price: 250,
    tags: ['pendant', 'design', 'premium'],
    meshType: 'sphere',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'light-004',
    name: 'Projecteur Sol',
    category: 'lighting',
    description: 'Projecteur au sol pour éclairage d\'accentuation',
    thumbnailUrl: '/modules/lighting/floor-light.png',
    dimensions: { width: 0.3, height: 0.4, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.6, roughness: 0.4 },
    price: 180,
    tags: ['floor', 'spotlight', 'accent'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false }
  }
];

// === MULTIMÉDIA ===
export const MULTIMEDIA: ModuleBase[] = [
  {
    id: 'multi-001',
    name: 'Écran LED 55"',
    category: 'multimedia',
    description: 'Écran LED Full HD 55 pouces',
    thumbnailUrl: '/modules/multimedia/screen-55.png',
    dimensions: { width: 1.2, height: 0.7, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#000000' },
    price: 600,
    tags: ['screen', 'display', 'led', 'hd'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'multi-002',
    name: 'Écran LED 85"',
    category: 'multimedia',
    description: 'Grand écran LED 4K 85 pouces',
    thumbnailUrl: '/modules/multimedia/screen-85.png',
    dimensions: { width: 1.9, height: 1.1, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#000000' },
    price: 1200,
    tags: ['screen', 'display', 'led', '4k', 'large'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'multi-003',
    name: 'Borne Tactile',
    category: 'multimedia',
    description: 'Borne interactive tactile 32"',
    thumbnailUrl: '/modules/multimedia/kiosk.png',
    dimensions: { width: 0.6, height: 1.5, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.4, roughness: 0.6 },
    price: 800,
    tags: ['kiosk', 'interactive', 'touchscreen'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'multi-004',
    name: 'Projecteur Vidéo',
    category: 'multimedia',
    description: 'Projecteur Full HD pour grandes surfaces',
    thumbnailUrl: '/modules/multimedia/projector.png',
    dimensions: { width: 0.4, height: 0.3, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.5, roughness: 0.5 },
    price: 450,
    tags: ['projector', 'video', 'presentation'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'multi-005',
    name: 'Système Audio',
    category: 'multimedia',
    description: 'Enceintes professionnelles stéréo',
    thumbnailUrl: '/modules/multimedia/speakers.png',
    dimensions: { width: 0.3, height: 0.5, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#000000', metalness: 0.3, roughness: 0.7 },
    price: 350,
    tags: ['audio', 'speakers', 'sound'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'multi-006',
    name: 'Écran Tactile 32" Table',
    category: 'multimedia',
    description: 'Table tactile interactive horizontale',
    thumbnailUrl: '/modules/multimedia/touch-table.png',
    dimensions: { width: 0.7, height: 0.5, depth: 1.2 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.6, roughness: 0.4 },
    price: 1800,
    tags: ['interactive', 'touchscreen', 'table', 'premium'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'multi-007',
    name: 'Mur LED Interactif',
    category: 'multimedia',
    description: 'Mur d\'écrans LED 3x2m modulaire',
    thumbnailUrl: '/modules/multimedia/video-wall.png',
    dimensions: { width: 3, height: 2, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#000000' },
    price: 3500,
    tags: ['videowall', 'led', 'large', 'premium', 'display'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: false }
  },
  {
    id: 'multi-008',
    name: 'Tablette sur Socle',
    category: 'multimedia',
    description: 'iPad sur support design pour catalogue digital',
    thumbnailUrl: '/modules/multimedia/tablet-stand.png',
    dimensions: { width: 0.25, height: 1.2, depth: 0.25 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.7, roughness: 0.3 },
    price: 280,
    tags: ['tablet', 'ipad', 'catalog', 'digital', 'modern'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  }
];

// === DÉCORATION ===
export const DECORATION: ModuleBase[] = [
  {
    id: 'deco-001',
    name: 'Plante Haute',
    category: 'decoration',
    description: 'Plante verte décorative haute',
    thumbnailUrl: '/modules/decoration/plant-tall.png',
    dimensions: { width: 0.5, height: 1.8, depth: 0.5 },
    defaultMaterial: { type: 'color', value: '#27ae60' },
    price: 80,
    tags: ['plant', 'nature', 'green', 'decoration'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false }
  },
  {
    id: 'deco-002',
    name: 'Kakémono',
    category: 'decoration',
    description: 'Kakémono publicitaire 2m',
    thumbnailUrl: '/modules/decoration/kakemono.png',
    dimensions: { width: 0.85, height: 2, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#ffffff' },
    price: 120,
    tags: ['kakemono', 'banner', 'branding', 'display'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'deco-003',
    name: 'Tapis Design',
    category: 'decoration',
    description: 'Tapis décoratif moderne',
    thumbnailUrl: '/modules/decoration/carpet.png',
    dimensions: { width: 2, height: 0.02, depth: 3 },
    defaultMaterial: { type: 'color', value: '#95a5a6' },
    price: 150,
    tags: ['carpet', 'floor', 'decoration', 'comfort'],
    meshType: 'box',
    customizable: { dimensions: true, material: true, color: true }
  },
  {
    id: 'deco-004',
    name: 'Œuvre d\'Art Moderne',
    category: 'decoration',
    description: 'Tableau moderne encadré',
    thumbnailUrl: '/modules/decoration/artwork.png',
    dimensions: { width: 1.2, height: 0.8, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#e74c3c' },
    price: 200,
    tags: ['art', 'painting', 'wall', 'decoration', 'premium'],
    meshType: 'box',
    customizable: { dimensions: false, material: false, color: true }
  },
  {
    id: 'deco-005',
    name: 'Sculpture Design',
    category: 'decoration',
    description: 'Sculpture décorative contemporaine',
    thumbnailUrl: '/modules/decoration/sculpture.png',
    dimensions: { width: 0.4, height: 1.2, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#bdc3c7', metalness: 0.9, roughness: 0.2 },
    price: 300,
    tags: ['sculpture', 'art', '3d', 'premium', 'modern'],
    meshType: 'custom',
    customizable: { dimensions: false, material: true, color: true }
  },
  {
    id: 'deco-006',
    name: 'Mur Végétal Stabilisé',
    category: 'decoration',
    description: 'Panneau de végétaux stabilisés naturels',
    thumbnailUrl: '/modules/decoration/green-wall.png',
    dimensions: { width: 2, height: 3, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#27ae60' },
    price: 850,
    tags: ['plants', 'nature', 'wall', 'premium', 'eco'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: false }
  },
  {
    id: 'deco-007',
    name: 'Panneau Décoratif 3D',
    category: 'decoration',
    description: 'Panneau mural avec relief géométrique',
    thumbnailUrl: '/modules/decoration/3d-panel.png',
    dimensions: { width: 1, height: 1, depth: 0.08 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.1, roughness: 0.9 },
    price: 120,
    tags: ['panel', 'wall', '3d', 'geometric', 'modern'],
    meshType: 'box',
    customizable: { dimensions: false, material: true, color: true }
  }
];

// === SOL ===
export const FLOORING: ModuleBase[] = [
  {
    id: 'floor-001',
    name: 'Moquette Grise',
    category: 'flooring',
    description: 'Moquette standard grise',
    thumbnailUrl: '/modules/flooring/carpet-grey.png',
    dimensions: { width: 1, height: 0.01, depth: 1 },
    defaultMaterial: { type: 'color', value: '#7f8c8d', roughness: 0.9 },
    price: 30,
    tags: ['carpet', 'floor', 'standard'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true }
  },
  {
    id: 'floor-002',
    name: 'Parquet Bois',
    category: 'flooring',
    description: 'Parquet en bois naturel',
    thumbnailUrl: '/modules/flooring/wood.png',
    dimensions: { width: 1, height: 0.02, depth: 1 },
    defaultMaterial: { type: 'color', value: '#8b4513', roughness: 0.7 },
    price: 60,
    tags: ['wood', 'floor', 'natural', 'premium'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: false }
  },
  {
    id: 'floor-003',
    name: 'Carrelage Blanc',
    category: 'flooring',
    description: 'Carrelage brillant blanc',
    thumbnailUrl: '/modules/flooring/tile-white.png',
    dimensions: { width: 1, height: 0.02, depth: 1 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.6, roughness: 0.2 },
    price: 50,
    tags: ['tile', 'floor', 'modern', 'clean'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true }
  }
];

// Export de tous les modules
export const ALL_MODULES: ModuleBase[] = [
  ...STRUCTURES,
  ...WALLS,
  ...FURNITURE,
  ...LIGHTING,
  ...MULTIMEDIA,
  ...PLV,
  ...DECORATION,
  ...FLOORING
];

// Fonction utilitaire pour récupérer des modules par catégorie
export const getModulesByCategory = (category: ModuleBase['category']): ModuleBase[] => {
  return ALL_MODULES.filter(module => module.category === category);
};

// Fonction utilitaire pour récupérer un module par ID
export const getModuleById = (id: string): ModuleBase | undefined => {
  return ALL_MODULES.find(module => module.id === id);
};

// Fonction utilitaire pour rechercher des modules
export const searchModules = (query: string, tags?: string[]): ModuleBase[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_MODULES.filter(module => {
    const matchesQuery = 
      module.name.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery) ||
      module.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    const matchesTags = !tags || tags.length === 0 || 
      tags.some(tag => module.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });
};
