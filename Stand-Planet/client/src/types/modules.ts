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

export type ModuleMaterial = {
  type: 'color' | 'texture' | 'material';
  value: string; // hex color or texture URL or material name
  metalness?: number;
  roughness?: number;
  opacity?: number;
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
