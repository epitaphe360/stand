// Types pour les modules 3D du Stand Studio

export type ModuleCategory = 
  | 'structure' 
  | 'wall' 
  | 'furniture' 
  | 'lighting' 
  | 'multimedia' 
  | 'plv'
  | 'decoration'
  | 'flooring';

export interface CertifiedMaterial {
  id: string;
  name: string;
  category: 'wood' | 'metal' | 'fabric' | 'glass' | 'plastic';
  certification: string; // ex: FSC, PEFC, M1, Oeko-Tex
  origin: string;
  density: number; // kg/m² ou kg/m³
  thickness?: number; // mm
  pricePerUnit: number;
  unit: 'm2' | 'm3' | 'linear';
  pbr: {
    color: string;
    metalness: number;
    roughness: number;
    textureUrl?: string;
  };
  carbonFootprint: number; // kg CO2e / unit
}

export type ModuleMaterial = {
  type: 'color' | 'texture' | 'material' | 'certified';
  value: string; // hex color or texture URL or material name or certifiedMaterialId
  certifiedMaterialId?: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  // Propriétés émissives (pour lumières)
  emissive?: string;
  emissiveIntensity?: number;
  // Transparence
  transparent?: boolean;
  // Clearcoat (vernis brillant)
  clearcoat?: number;
  clearcoatRoughness?: number;
};

export interface ModuleDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ModulePosition {
  x: number;
  y: number;
  z: number;
}

export interface ModuleRotation {
  x: number;
  y: number;
  z: number;
}

// Presets de taille prédéfinis
export interface SizePreset {
  name: 'small' | 'medium' | 'large' | 'custom';
  dimensions: ModuleDimensions;
}

// Variantes de module (couleur, finition, etc.)
export interface ModuleVariant {
  id: string;
  name: string;
  material: ModuleMaterial;
  price: number; // prix supplémentaire
}

export interface ModuleBase {
  id: string;
  name: string;
  category: ModuleCategory;
  description: string;
  thumbnailUrl: string;
  dimensions: ModuleDimensions;
  defaultMaterial: ModuleMaterial;
  price: number; // en euros
  tags: string[];
  
  // Pour le mesh 3D
  meshType: 'box' | 'cylinder' | 'sphere' | 'custom' | 'gltf' | 'multi-001' | 'multi-002' | 'multi-003' | 'multi-006' | 'multi-007' | 'multi-008' | 'furn-007' | 'furn-008' | 'furn-009' | 'furn-010' | 'deco-006' | 'deco-007' | 'plv-001' | 'plv-002' | 'plv-003' | 'plv-005';
  gltfUrl?: string; // si meshType === 'gltf'
  
  // Propriétés physiques et comportementales
  weight?: number; // en kg
  stackable?: boolean; // peut-on poser des objets dessus ?
  snapPoints?: {
    position: ModulePosition;
    type: 'wall' | 'floor' | 'top' | 'side';
  }[];

  // Contraintes de module
  aspectRatio?: {
    width: number;
    height: number;
    depth: number;
  }; // Ratio fixe pour respecter les proportions
  minSize?: ModuleDimensions;
  maxSize?: ModuleDimensions;
  
  // Tailles prédéfinies
  sizePresets?: SizePreset[];
  
  // Variantes disponibles (couleurs, finitions)
  variants?: ModuleVariant[];

  // Configuration d'éclairage (pour modules de type lighting)
  lightConfig?: {
    type: 'spot' | 'point' | 'directional' | 'rect' | 'tube';
    color: string;
    intensity: number;
    distance?: number;
    angle?: number;
    penumbra?: number;
    decay?: number;
    width?: number;
    height?: number;
    radius?: number;
    castShadow: boolean;
    shadowMapSize?: number;
  };

  // Configuration multi-niveaux (pour plateformes, mezzanines)
  levelConfig?: {
    type: 'platform' | 'mezzanine' | 'podium';
    height: number;
    hasRailing: boolean;
    hasStairs: boolean;
    stairPosition?: 'front' | 'back' | 'left' | 'right' | 'side';
    capacity: number; // Charge maximale en kg
  };

  // Configuration escalier
  stairConfig?: {
    steps: number;
    stepHeight: number;
    stepDepth: number;
    width: number;
    hasHandrail: boolean;
  };

  // Configuration courbe (pour murs courbes, comptoirs arrondis, arches)
  curveConfig?: {
    type: 'arc' | 'bezier' | 'circular' | 'spline' | 'custom';
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    controlPoints?: Array<{ x: number; y: number; z: number }>;
    extrudeDepth?: number;
    extrudeHeight?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    tubularSegments?: number;
    radialSegments?: number;
    tubeRadius?: number;
    closed?: boolean;
  };

  // Configuration plafond suspendu
  ceilingConfig?: {
    type: 'suspended' | 'floating' | 'organic' | 'grid' | 'tensile';
    suspensionHeight: number;
    thickness: number;
    hasCables?: boolean;
    cableCount?: number;
    lightingIntegrated?: boolean;
    material?: 'fabric' | 'metal' | 'wood' | 'acrylic' | 'composite';
  };

  // Configuration GLTF (pour modèles 3D importés)
  gltfConfig?: {
    url: string;
    defaultScale?: number | [number, number, number];
    useDraco?: boolean;
    materialOverrides?: {
      color?: string;
      metalness?: number;
      roughness?: number;
      emissive?: string;
      emissiveIntensity?: number;
    };
    hasAnimations?: boolean;
    animationNames?: string[];
    license?: string;
    attribution?: string;
  };

  // Propriétés personnalisables
  customizable: {
    dimensions: boolean;
    material: boolean;
    color: boolean;
  };
}

export interface PlacedModule extends ModuleBase {
  instanceId: string; // ID unique pour cette instance placée
  position: ModulePosition;
  rotation: ModuleRotation;
  scale: { x: number; y: number; z: number };
  material: ModuleMaterial;
  isSelected: boolean;
  isLocked: boolean;
}

export interface StandConfiguration {
  id?: string;
  name: string;
  description?: string;
  dimensions: { width: number; depth: number }; // Taille du stand (ex: 3x3m)
  modules: PlacedModule[];
  backgroundColor: string;
  floorMaterial: ModuleMaterial;
  createdAt?: Date;
  updatedAt?: Date;
  style?: 'modern' | 'luxury' | 'industrial' | 'minimal' | 'creative';
  industry?: string;
  totalPrice?: number;
  tags?: string[];
  estimatedPrice?: number;
  carbonFootprint?: number;
  metadata?: {
    style?: string;
    targetSectors?: string[];
    difficulty?: string;
    setupTime?: string;
    requiredCrew?: number;
    specialFeatures?: string[];
    electricalNeeds?: string;
    certifications?: string[];
  };
}

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: 'complete' | 'partial';
  industry: string[];
  style: string[];
  configuration: StandConfiguration;
  tags: string[];
  popularity: number;
}

export interface AIGenerationRequest {
  prompt: string;
  dimensions?: { width: number; depth: number };
  budget?: number;
  industry?: string;
  style?: string;
  requirements?: string[];
}

export interface AIGenerationResponse {
  configurations: StandConfiguration[];
  explanation: string;
  alternatives?: string[];
}

export interface DesignHistoryItem {
  id: string;
  timestamp: Date;
  action: 'add' | 'remove' | 'modify' | 'generate';
  description: string;
  configuration: StandConfiguration;
}
