// Bibliothèque de matériaux réalistes
import { MeshStandardMaterialProps } from '@react-three/fiber';

export const Materials = {
  // Bois
  wood: {
    oak: {
      color: '#8B4513',
      roughness: 0.7,
      metalness: 0,
    },
    walnut: {
      color: '#5C4033',
      roughness: 0.6,
      metalness: 0,
    },
    pine: {
      color: '#C19A6B',
      roughness: 0.8,
      metalness: 0,
    },
  },

  // Métaux
  metal: {
    aluminum: {
      color: '#C0C0C0',
      roughness: 0.3,
      metalness: 0.9,
    },
    steel: {
      color: '#797979',
      roughness: 0.2,
      metalness: 1,
    },
    brass: {
      color: '#B5A642',
      roughness: 0.4,
      metalness: 0.8,
    },
    chrome: {
      color: '#E8E8E8',
      roughness: 0.1,
      metalness: 1,
    },
  },

  // Verre
  glass: {
    clear: {
      color: '#FFFFFF',
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.2,
      transmission: 0.9,
      thickness: 0.5,
    },
    frosted: {
      color: '#F5F5F5',
      roughness: 0.5,
      metalness: 0,
      transparent: true,
      opacity: 0.5,
    },
    tinted: {
      color: '#4A90E2',
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.3,
    },
  },

  // Tissus
  fabric: {
    cotton: {
      color: '#F5F5F5',
      roughness: 1,
      metalness: 0,
    },
    velvet: {
      color: '#2C3E50',
      roughness: 0.9,
      metalness: 0,
    },
    leather: {
      color: '#4A4A4A',
      roughness: 0.6,
      metalness: 0.1,
    },
  },

  // Plastiques
  plastic: {
    glossy: {
      color: '#FFFFFF',
      roughness: 0.3,
      metalness: 0.1,
    },
    matte: {
      color: '#E0E0E0',
      roughness: 0.9,
      metalness: 0,
    },
  },

  // Peintures
  paint: {
    glossy: {
      color: '#FFFFFF',
      roughness: 0.2,
      metalness: 0.1,
    },
    matte: {
      color: '#FFFFFF',
      roughness: 0.8,
      metalness: 0,
    },
    metallic: {
      color: '#C0C0C0',
      roughness: 0.3,
      metalness: 0.6,
    },
  },
};

// Helper pour obtenir un matériau complet
export function getMaterialProps(
  category: keyof typeof Materials,
  type: string,
  customColor?: string
): Partial<MeshStandardMaterialProps> {
  const material = (Materials[category] as any)[type];
  if (!material) return {};

  return {
    ...material,
    color: customColor || material.color,
  };
}
