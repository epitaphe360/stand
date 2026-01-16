import * as THREE from 'three';

/**
 * Système de matériaux PBR (Physically Based Rendering) professionnels
 * Avec textures procédurales et presets réalistes
 */

export interface PBRMaterialConfig {
  name: string;
  baseColor: string;
  metalness: number;
  roughness: number;
  normalScale?: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  // URLs de textures optionnelles
  colorMap?: string;
  normalMap?: string;
  roughnessMap?: string;
  metalnessMap?: string;
  aoMap?: string;
  displacementMap?: string;
  displacementScale?: number;
}

/**
 * Bibliothèque de matériaux PBR réalistes
 */
export const PBR_MATERIALS: Record<string, PBRMaterialConfig> = {
  // === BOIS ===
  oakWood: {
    name: 'Chêne Naturel',
    baseColor: '#D4A574',
    metalness: 0.0,
    roughness: 0.85,
    normalScale: 0.5,
  },
  walnutWood: {
    name: 'Noyer Foncé',
    baseColor: '#6B4423',
    metalness: 0.0,
    roughness: 0.75,
    normalScale: 0.6,
  },
  whiteWood: {
    name: 'Bois Blanc Verni',
    baseColor: '#F5F5DC',
    metalness: 0.1,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
  bamboo: {
    name: 'Bambou',
    baseColor: '#D2B48C',
    metalness: 0.0,
    roughness: 0.7,
    normalScale: 0.3,
  },

  // === MÉTAUX ===
  brushedAluminum: {
    name: 'Aluminium Brossé',
    baseColor: '#C0C0C0',
    metalness: 1.0,
    roughness: 0.3,
    normalScale: 0.2,
  },
  polishedSteel: {
    name: 'Acier Poli',
    baseColor: '#E0E0E0',
    metalness: 1.0,
    roughness: 0.15,
  },
  brushedSteel: {
    name: 'Acier Brossé',
    baseColor: '#B8B8B8',
    metalness: 1.0,
    roughness: 0.4,
    normalScale: 0.3,
  },
  chrome: {
    name: 'Chrome',
    baseColor: '#F0F0F0',
    metalness: 1.0,
    roughness: 0.05,
  },
  blackMetal: {
    name: 'Métal Noir Mat',
    baseColor: '#2C2C2C',
    metalness: 1.0,
    roughness: 0.6,
  },
  gold: {
    name: 'Or',
    baseColor: '#FFD700',
    metalness: 1.0,
    roughness: 0.2,
  },
  copper: {
    name: 'Cuivre',
    baseColor: '#B87333',
    metalness: 1.0,
    roughness: 0.3,
  },

  // === TISSUS ===
  cottonFabric: {
    name: 'Tissu Coton',
    baseColor: '#F0E68C',
    metalness: 0.0,
    roughness: 1.0,
  },
  velvet: {
    name: 'Velours',
    baseColor: '#8B008B',
    metalness: 0.0,
    roughness: 0.95,
    normalScale: 0.4,
  },
  leather: {
    name: 'Cuir',
    baseColor: '#8B4513',
    metalness: 0.0,
    roughness: 0.7,
    normalScale: 0.5,
  },
  canvas: {
    name: 'Toile',
    baseColor: '#F5F5DC',
    metalness: 0.0,
    roughness: 0.95,
  },

  // === PLASTIQUES ===
  mattePlastic: {
    name: 'Plastique Mat',
    baseColor: '#FFFFFF',
    metalness: 0.0,
    roughness: 0.8,
  },
  glossyPlastic: {
    name: 'Plastique Brillant',
    baseColor: '#FFFFFF',
    metalness: 0.0,
    roughness: 0.2,
  },
  rubberMatte: {
    name: 'Caoutchouc Mat',
    baseColor: '#1C1C1C',
    metalness: 0.0,
    roughness: 0.95,
  },

  // === VERRE ===
  clearGlass: {
    name: 'Verre Transparent',
    baseColor: '#FFFFFF',
    metalness: 0.0,
    roughness: 0.05,
  },
  frostedGlass: {
    name: 'Verre Dépoli',
    baseColor: '#F0F0F0',
    metalness: 0.0,
    roughness: 0.4,
  },
  tintedGlass: {
    name: 'Verre Teinté',
    baseColor: '#4A4A4A',
    metalness: 0.0,
    roughness: 0.1,
  },

  // === PIERRE & BÉTON ===
  marble: {
    name: 'Marbre',
    baseColor: '#F8F8FF',
    metalness: 0.1,
    roughness: 0.3,
    normalScale: 0.2,
  },
  granite: {
    name: 'Granit',
    baseColor: '#808080',
    metalness: 0.0,
    roughness: 0.7,
    normalScale: 0.5,
  },
  concrete: {
    name: 'Béton',
    baseColor: '#A9A9A9',
    metalness: 0.0,
    roughness: 0.9,
    normalScale: 0.4,
  },
  polishedConcrete: {
    name: 'Béton Ciré',
    baseColor: '#696969',
    metalness: 0.1,
    roughness: 0.5,
  },

  // === PEINTURES ===
  mattePaint: {
    name: 'Peinture Mate',
    baseColor: '#FFFFFF',
    metalness: 0.0,
    roughness: 0.95,
  },
  satinPaint: {
    name: 'Peinture Satinée',
    baseColor: '#FFFFFF',
    metalness: 0.0,
    roughness: 0.6,
  },
  glossyPaint: {
    name: 'Peinture Brillante',
    baseColor: '#FFFFFF',
    metalness: 0.1,
    roughness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  },

  // === COMPOSITES ===
  carbonFiber: {
    name: 'Fibre de Carbone',
    baseColor: '#1C1C1C',
    metalness: 0.5,
    roughness: 0.4,
    normalScale: 0.3,
  },
  plywood: {
    name: 'Contreplaqué',
    baseColor: '#DEB887',
    metalness: 0.0,
    roughness: 0.85,
  },
  mdf: {
    name: 'MDF Peint',
    baseColor: '#FFFFFF',
    metalness: 0.0,
    roughness: 0.75,
  },

  // === SPÉCIAUX ===
  screenEmissive: {
    name: 'Écran LED',
    baseColor: '#000000',
    metalness: 0.0,
    roughness: 0.1,
    emissive: '#FFFFFF',
    emissiveIntensity: 1.0,
  },
  neon: {
    name: 'Néon',
    baseColor: '#FF1493',
    metalness: 0.0,
    roughness: 0.3,
    emissive: '#FF1493',
    emissiveIntensity: 2.0,
  },
  mirror: {
    name: 'Miroir',
    baseColor: '#F0F0F0',
    metalness: 1.0,
    roughness: 0.0,
  },
};

/**
 * Créer un matériau PBR Three.js à partir d'une configuration
 */
export function createPBRMaterial(
  configOrName: PBRMaterialConfig | string,
  overrides?: Partial<PBRMaterialConfig>
): THREE.MeshStandardMaterial {
  // Récupérer la config
  let config: PBRMaterialConfig;
  if (typeof configOrName === 'string') {
    config = PBR_MATERIALS[configOrName];
    if (!config) {
      console.warn(`Matériau PBR inconnu: ${configOrName}, utilisation du défaut`);
      config = PBR_MATERIALS.mattePlastic;
    }
  } else {
    config = configOrName;
  }

  // Appliquer les overrides
  if (overrides) {
    config = { ...config, ...overrides };
  }

  // Créer le matériau
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.baseColor),
    metalness: config.metalness,
    roughness: config.roughness,
  });

  // Emissive
  if (config.emissive) {
    material.emissive = new THREE.Color(config.emissive);
    material.emissiveIntensity = config.emissiveIntensity || 0.5;
  }

  // Clearcoat (vernis)
  if (config.clearcoat !== undefined) {
    material.clearcoat = config.clearcoat;
    material.clearcoatRoughness = config.clearcoatRoughness || 0.1;
  }

  // Normal scale
  if (config.normalScale !== undefined) {
    material.normalScale = new THREE.Vector2(config.normalScale, config.normalScale);
  }

  // Textures (si fournies)
  if (config.colorMap) {
    const textureLoader = new THREE.TextureLoader();
    material.map = textureLoader.load(config.colorMap);
    material.map.colorSpace = THREE.SRGBColorSpace;
  }

  if (config.normalMap) {
    const textureLoader = new THREE.TextureLoader();
    material.normalMap = textureLoader.load(config.normalMap);
  }

  if (config.roughnessMap) {
    const textureLoader = new THREE.TextureLoader();
    material.roughnessMap = textureLoader.load(config.roughnessMap);
  }

  if (config.metalnessMap) {
    const textureLoader = new THREE.TextureLoader();
    material.metalnessMap = textureLoader.load(config.metalnessMap);
  }

  if (config.aoMap) {
    const textureLoader = new THREE.TextureLoader();
    material.aoMap = textureLoader.load(config.aoMap);
    material.aoMapIntensity = 1.0;
  }

  if (config.displacementMap) {
    const textureLoader = new THREE.TextureLoader();
    material.displacementMap = textureLoader.load(config.displacementMap);
    material.displacementScale = config.displacementScale || 0.1;
  }

  return material;
}

/**
 * Créer une texture procédurale de bois
 */
export function createProceduralWoodTexture(
  width: number = 512,
  height: number = 512,
  baseColor: THREE.Color = new THREE.Color('#D4A574'),
  grainColor: THREE.Color = new THREE.Color('#8B6914')
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Fond de base
  ctx.fillStyle = `#${baseColor.getHexString()}`;
  ctx.fillRect(0, 0, width, height);

  // Veines du bois
  ctx.strokeStyle = `#${grainColor.getHexString()}`;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;

  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const y = Math.random() * height;
    ctx.moveTo(0, y);

    for (let x = 0; x < width; x += 10) {
      const offset = Math.sin(x * 0.02 + i) * 5;
      ctx.lineTo(x, y + offset);
    }

    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/**
 * Créer une texture procédurale de métal brossé
 */
export function createBrushedMetalTexture(
  width: number = 512,
  height: number = 512,
  baseColor: THREE.Color = new THREE.Color('#C0C0C0')
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Fond
  ctx.fillStyle = `#${baseColor.getHexString()}`;
  ctx.fillRect(0, 0, width, height);

  // Rayures de brossage
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    const variation = Math.random() * 30 - 15;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] += variation;     // R
      data[i + 1] += variation; // G
      data[i + 2] += variation; // B
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/**
 * Créer une texture procédurale de tissu
 */
export function createFabricTexture(
  width: number = 512,
  height: number = 512,
  baseColor: THREE.Color = new THREE.Color('#F0E68C')
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Fond
  ctx.fillStyle = `#${baseColor.getHexString()}`;
  ctx.fillRect(0, 0, width, height);

  // Trame du tissu
  ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
  ctx.lineWidth = 1;

  // Lignes horizontales
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Lignes verticales
  for (let x = 0; x < width; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(4, 4);

  return texture;
}

/**
 * Obtenir un matériau approprié pour une catégorie de module
 */
export function getMaterialForCategory(
  category: string,
  colorOverride?: string
): THREE.MeshStandardMaterial {
  const materialMap: Record<string, string> = {
    structure: 'polishedConcrete',
    wall: 'mattePaint',
    furniture: 'oakWood',
    lighting: 'brushedAluminum',
    multimedia: 'glossyPlastic',
    plv: 'glossyPaint',
    decoration: 'ceramic',
    flooring: 'polishedConcrete',
  };

  const materialName = materialMap[category] || 'mattePlastic';
  const overrides = colorOverride ? { baseColor: colorOverride } : undefined;

  return createPBRMaterial(materialName, overrides);
}

/**
 * Liste de tous les matériaux disponibles pour l'UI
 */
export function getAllPBRMaterialNames(): string[] {
  return Object.keys(PBR_MATERIALS);
}

/**
 * Obtenir les informations d'un matériau pour affichage
 */
export function getPBRMaterialInfo(name: string): PBRMaterialConfig | null {
  return PBR_MATERIALS[name] || null;
}
