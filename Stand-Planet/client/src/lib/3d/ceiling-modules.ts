import { ModuleBase } from '@/types/modules';

/**
 * Modules de plafonds suspendus et structures aériennes
 */

export interface CeilingConfig {
  type: 'suspended' | 'floating' | 'organic' | 'grid' | 'tensile';
  suspensionHeight: number; // Hauteur de suspension en mètres
  thickness: number; // Épaisseur du plafond
  hasCables?: boolean; // Câbles de suspension visibles
  cableCount?: number; // Nombre de points de suspension
  lightingIntegrated?: boolean; // Éclairage intégré
  material?: 'fabric' | 'metal' | 'wood' | 'acrylic' | 'composite';
}

export const CEILING_MODULES: ModuleBase[] = [
  // === PLAFONDS SUSPENDUS TRADITIONNELS ===
  {
    id: 'ceiling-001',
    name: 'Plafond Suspendu Rectangulaire 6x3m',
    category: 'structure',
    description: 'Plafond flottant rectangulaire avec câbles de suspension',
    thumbnailUrl: '/modules/ceilings/suspended-rect.png',
    dimensions: { width: 6, height: 3, depth: 3 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.1, roughness: 0.9 },
    price: 2200,
    tags: ['plafond', 'suspendu', 'rectangulaire', 'moderne'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 150,
    stackable: false,
    ceilingConfig: {
      type: 'suspended',
      suspensionHeight: 3,
      thickness: 0.05,
      hasCables: true,
      cableCount: 4,
      lightingIntegrated: false,
      material: 'acrylic',
    },
  },
  {
    id: 'ceiling-002',
    name: 'Plafond Flottant Circulaire Ø4m',
    category: 'structure',
    description: 'Plafond circulaire suspendu avec éclairage LED intégré',
    thumbnailUrl: '/modules/ceilings/floating-circular.png',
    dimensions: { width: 4, height: 3, depth: 4 },
    defaultMaterial: { type: 'color', value: '#f5f5f5', metalness: 0.3, roughness: 0.7 },
    price: 3200,
    tags: ['plafond', 'circulaire', 'led', 'premium'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 180,
    stackable: false,
    ceilingConfig: {
      type: 'floating',
      suspensionHeight: 3,
      thickness: 0.1,
      hasCables: true,
      cableCount: 6,
      lightingIntegrated: true,
      material: 'composite',
    },
  },
  {
    id: 'ceiling-003',
    name: 'Structure Aérienne Vagues',
    category: 'structure',
    description: 'Plafond organique en forme de vagues suspendues',
    thumbnailUrl: '/modules/ceilings/wave-ceiling.png',
    dimensions: { width: 8, height: 3.5, depth: 4 },
    defaultMaterial: { type: 'color', value: '#e8e8e8', metalness: 0.4, roughness: 0.6 },
    price: 4500,
    tags: ['plafond', 'organique', 'vagues', 'design'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 250,
    stackable: false,
    ceilingConfig: {
      type: 'organic',
      suspensionHeight: 3.5,
      thickness: 0.08,
      hasCables: true,
      cableCount: 8,
      lightingIntegrated: true,
      material: 'fabric',
    },
  },
  {
    id: 'ceiling-004',
    name: 'Grille Suspendue Modulaire',
    category: 'structure',
    description: 'Plafond à grille modulaire avec panneaux amovibles',
    thumbnailUrl: '/modules/ceilings/grid-ceiling.png',
    dimensions: { width: 6, height: 3, depth: 6 },
    defaultMaterial: { type: 'color', value: '#c0c0c0', metalness: 0.6, roughness: 0.4 },
    price: 2800,
    tags: ['plafond', 'grille', 'modulaire', 'industriel'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 200,
    stackable: false,
    ceilingConfig: {
      type: 'grid',
      suspensionHeight: 3,
      thickness: 0.02,
      hasCables: true,
      cableCount: 9,
      lightingIntegrated: false,
      material: 'metal',
    },
  },
  {
    id: 'ceiling-005',
    name: 'Toile Tendue Architecturale',
    category: 'structure',
    description: 'Plafond en toile tendue avec forme libre personnalisable',
    thumbnailUrl: '/modules/ceilings/tensile-fabric.png',
    dimensions: { width: 10, height: 4, depth: 6 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0, roughness: 0.95 },
    price: 5500,
    tags: ['plafond', 'toile', 'tendue', 'architectural'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 120,
    stackable: false,
    ceilingConfig: {
      type: 'tensile',
      suspensionHeight: 4,
      thickness: 0.01,
      hasCables: true,
      cableCount: 12,
      lightingIntegrated: true,
      material: 'fabric',
    },
  },
  {
    id: 'ceiling-006',
    name: 'Baffles Acoustiques Suspendus',
    category: 'decoration',
    description: 'Panneaux acoustiques verticaux suspendus (lot de 10)',
    thumbnailUrl: '/modules/ceilings/acoustic-baffles.png',
    dimensions: { width: 0.6, height: 2.5, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.1, roughness: 0.9 },
    price: 1200,
    tags: ['acoustique', 'baffle', 'suspendu', 'design'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 40,
    stackable: false,
    ceilingConfig: {
      type: 'suspended',
      suspensionHeight: 2.5,
      thickness: 0.05,
      hasCables: true,
      cableCount: 10,
      lightingIntegrated: false,
      material: 'fabric',
    },
  },
  {
    id: 'ceiling-007',
    name: 'Cloud Flottant Organique',
    category: 'decoration',
    description: 'Élément décoratif en forme de nuage suspendu',
    thumbnailUrl: '/modules/ceilings/cloud-element.png',
    dimensions: { width: 3, height: 2, depth: 2 },
    defaultMaterial: { type: 'color', value: '#f0f0f0', metalness: 0, roughness: 1 },
    price: 1800,
    tags: ['cloud', 'nuage', 'décoratif', 'organique'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 35,
    stackable: false,
    ceilingConfig: {
      type: 'organic',
      suspensionHeight: 2,
      thickness: 0.3,
      hasCables: true,
      cableCount: 3,
      lightingIntegrated: false,
      material: 'fabric',
    },
  },
  {
    id: 'ceiling-008',
    name: 'Anneau Lumineux Suspendu Ø3m',
    category: 'lighting',
    description: 'Anneau circulaire avec LED intégré',
    thumbnailUrl: '/modules/ceilings/ring-light.png',
    dimensions: { width: 3, height: 2.5, depth: 3 },
    defaultMaterial: { type: 'color', value: '#d0d0d0', metalness: 0.8, roughness: 0.2 },
    price: 2600,
    tags: ['anneau', 'led', 'circulaire', 'design'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 80,
    stackable: false,
    ceilingConfig: {
      type: 'floating',
      suspensionHeight: 2.5,
      thickness: 0.1,
      hasCables: true,
      cableCount: 4,
      lightingIntegrated: true,
      material: 'metal',
    },
    lightConfig: {
      type: 'point',
      color: '#ffffff',
      intensity: 3,
      distance: 6,
      decay: 2,
      castShadow: false,
    },
  },
];

/**
 * Helper: Calculer les points de suspension pour câbles
 */
export function getSuspensionPoints(
  position: { x: number; y: number; z: number },
  dimensions: { width: number; height: number; depth: number },
  cableCount: number
): Array<{ x: number; y: number; z: number }> {
  const points: Array<{ x: number; y: number; z: number }> = [];

  if (cableCount === 4) {
    // Coins
    points.push(
      { x: position.x - dimensions.width / 2 + 0.2, y: position.y + dimensions.height, z: position.z - dimensions.depth / 2 + 0.2 },
      { x: position.x + dimensions.width / 2 - 0.2, y: position.y + dimensions.height, z: position.z - dimensions.depth / 2 + 0.2 },
      { x: position.x - dimensions.width / 2 + 0.2, y: position.y + dimensions.height, z: position.z + dimensions.depth / 2 - 0.2 },
      { x: position.x + dimensions.width / 2 - 0.2, y: position.y + dimensions.height, z: position.z + dimensions.depth / 2 - 0.2 }
    );
  } else if (cableCount === 6) {
    // Hexagone
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = Math.min(dimensions.width, dimensions.depth) / 2 - 0.2;
      points.push({
        x: position.x + Math.cos(angle) * radius,
        y: position.y + dimensions.height,
        z: position.z + Math.sin(angle) * radius,
      });
    }
  } else {
    // Grille régulière
    const cols = Math.ceil(Math.sqrt(cableCount));
    const rows = Math.ceil(cableCount / cols);

    for (let i = 0; i < cableCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = position.x - dimensions.width / 2 + (col + 0.5) * (dimensions.width / cols);
      const z = position.z - dimensions.depth / 2 + (row + 0.5) * (dimensions.depth / rows);

      points.push({ x, y: position.y + dimensions.height, z });
    }
  }

  return points;
}

/**
 * Helper: Créer une forme de vague paramétrique
 */
export function createWaveShape(
  width: number,
  depth: number,
  amplitude: number = 0.3,
  frequency: number = 2
): Array<{ x: number; y: number; z: number }> {
  const points: Array<{ x: number; y: number; z: number }> = [];
  const resolution = 20;

  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = (i / resolution - 0.5) * width;
      const z = (j / resolution - 0.5) * depth;

      // Fonction de vague
      const y = amplitude * Math.sin(frequency * Math.PI * (i / resolution)) * Math.cos(frequency * Math.PI * (j / resolution));

      points.push({ x, y, z });
    }
  }

  return points;
}
