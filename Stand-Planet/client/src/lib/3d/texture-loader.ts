import * as THREE from 'three';

/**
 * Gestionnaire de chargement de textures PBR pour matériaux réalistes
 * Support: Albedo/Diffuse, Normal, Roughness, Metalness, AO, Displacement
 */

export interface PBRTextureMaps {
  albedo?: THREE.Texture;
  normal?: THREE.Texture;
  roughness?: THREE.Texture;
  metalness?: THREE.Texture;
  ao?: THREE.Texture; // Ambient Occlusion
  displacement?: THREE.Texture;
  emissive?: THREE.Texture;
}

export interface TextureLoadOptions {
  repeat?: { x: number; y: number };
  rotation?: number;
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  anisotropy?: number;
  colorSpace?: string; // 'srgb' | 'srgb-linear' | '' (Three.js r152+)
}

/**
 * Cache de textures pour éviter de charger plusieurs fois la même texture
 */
const textureCache = new Map<string, THREE.Texture>();

/**
 * Loader global pour les textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Charge une texture avec mise en cache
 */
export async function loadTexture(
  url: string,
  options: TextureLoadOptions = {}
): Promise<THREE.Texture> {
  // Vérifier le cache
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!.clone();
  }

  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        // Appliquer les options
        if (options.repeat) {
          texture.repeat.set(options.repeat.x, options.repeat.y);
        }

        if (options.rotation !== undefined) {
          texture.rotation = options.rotation;
        }

        texture.wrapS = options.wrapS || THREE.RepeatWrapping;
        texture.wrapT = options.wrapT || THREE.RepeatWrapping;

        if (options.anisotropy !== undefined) {
          texture.anisotropy = options.anisotropy;
        }

        if (options.colorSpace !== undefined) {
          texture.colorSpace = options.colorSpace;
        }

        // Mettre en cache
        textureCache.set(cacheKey, texture);
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error(`Erreur lors du chargement de la texture ${url}:`, error);
        reject(error);
      }
    );
  });
}

/**
 * Charge un set complet de textures PBR
 */
export async function loadPBRTextures(
  basePath: string,
  maps: {
    albedo?: string;
    normal?: string;
    roughness?: string;
    metalness?: string;
    ao?: string;
    displacement?: string;
    emissive?: string;
  },
  options: TextureLoadOptions = {}
): Promise<PBRTextureMaps> {
  const promises: Promise<[keyof PBRTextureMaps, THREE.Texture]>[] = [];

  // Charger toutes les textures en parallèle
  for (const [key, filename] of Object.entries(maps)) {
    if (filename) {
      const fullPath = `${basePath}/${filename}`;
      promises.push(
        loadTexture(fullPath, options).then((texture) => [
          key as keyof PBRTextureMaps,
          texture,
        ])
      );
    }
  }

  const results = await Promise.all(promises);

  // Construire l'objet de retour
  const textureMaps: PBRTextureMaps = {};
  for (const [key, texture] of results) {
    textureMaps[key] = texture;
  }

  return textureMaps;
}

/**
 * Applique les textures PBR à un matériau Three.js
 */
export function applyPBRTextures(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  textures: PBRTextureMaps
): void {
  if (textures.albedo) {
    material.map = textures.albedo;
    material.map.colorSpace = THREE.SRGBColorSpace;
  }

  if (textures.normal) {
    material.normalMap = textures.normal;
    material.normalScale = new THREE.Vector2(1, 1);
  }

  if (textures.roughness) {
    material.roughnessMap = textures.roughness;
  }

  if (textures.metalness) {
    material.metalnessMap = textures.metalness;
  }

  if (textures.ao) {
    material.aoMap = textures.ao;
    material.aoMapIntensity = 1.0;
  }

  if (textures.displacement) {
    material.displacementMap = textures.displacement;
    material.displacementScale = 0.1;
  }

  if (textures.emissive) {
    material.emissiveMap = textures.emissive;
  }

  material.needsUpdate = true;
}

/**
 * Charge une texture depuis un asset uploadé (pour branding)
 */
export async function loadAssetTexture(
  assetUrl: string,
  options: TextureLoadOptions = {}
): Promise<THREE.Texture> {
  // Par défaut, on utilise sRGB colorSpace pour les images
  const defaultOptions: TextureLoadOptions = {
    colorSpace: THREE.SRGBColorSpace,
    anisotropy: 16, // Meilleure qualité
    ...options,
  };

  return loadTexture(assetUrl, defaultOptions);
}

/**
 * Crée un matériau PBR à partir de paramètres
 */
export function createPBRMaterial(
  params: {
    color?: string | number;
    roughness?: number;
    metalness?: number;
    emissive?: string | number;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    textures?: PBRTextureMaps;
  }
): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color: params.color !== undefined ? new THREE.Color(params.color) : 0xffffff,
    roughness: params.roughness !== undefined ? params.roughness : 0.5,
    metalness: params.metalness !== undefined ? params.metalness : 0.0,
    emissive: params.emissive !== undefined ? new THREE.Color(params.emissive) : 0x000000,
    emissiveIntensity: params.emissiveIntensity !== undefined ? params.emissiveIntensity : 1.0,
    transparent: params.transparent || false,
    opacity: params.opacity !== undefined ? params.opacity : 1.0,
  });

  if (params.textures) {
    applyPBRTextures(material, params.textures);
  }

  return material;
}

/**
 * Vide le cache de textures
 */
export function clearTextureCache(): void {
  textureCache.forEach((texture) => texture.dispose());
  textureCache.clear();
}

/**
 * Obtient la taille du cache
 */
export function getTextureCacheSize(): number {
  return textureCache.size;
}
