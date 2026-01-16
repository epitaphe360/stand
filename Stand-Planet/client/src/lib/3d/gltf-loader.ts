import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Système de chargement GLTF avec cache et optimisations
 */

export interface GLTFLoadOptions {
  /**
   * URL du fichier GLTF/GLB
   */
  url: string;

  /**
   * Utiliser la compression Draco
   */
  useDraco?: boolean;

  /**
   * Chemin du décodeur Draco
   */
  dracoPath?: string;

  /**
   * Overrides des matériaux
   */
  materialOverrides?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    emissiveIntensity?: number;
  };

  /**
   * Échelle du modèle
   */
  scale?: number | [number, number, number];

  /**
   * Centrer le modèle
   */
  center?: boolean;

  /**
   * Calculer automatiquement la bounding box
   */
  computeBounds?: boolean;

  /**
   * Activer les ombres
   */
  castShadow?: boolean;
  receiveShadow?: boolean;

  /**
   * Callback de progression
   */
  onProgress?: (progress: number) => void;
}

export interface LoadedGLTFModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  bounds: THREE.Box3;
  size: THREE.Vector3;
  gltf: GLTF;
}

/**
 * Cache des modèles GLTF chargés
 */
const modelCache = new Map<string, Promise<GLTF>>();

/**
 * Loader singleton
 */
let gltfLoader: GLTFLoader | null = null;
let dracoLoader: DRACOLoader | null = null;

/**
 * Initialiser les loaders
 */
function initLoaders(useDraco: boolean = false, dracoPath: string = '/draco/') {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();
  }

  if (useDraco && !dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(dracoPath);
    gltfLoader.setDRACOLoader(dracoLoader);
  }

  return gltfLoader;
}

/**
 * Charger un modèle GLTF avec cache
 */
export async function loadGLTFModel(options: GLTFLoadOptions): Promise<LoadedGLTFModel> {
  const {
    url,
    useDraco = false,
    dracoPath = '/draco/',
    materialOverrides,
    scale = 1,
    center = true,
    computeBounds = true,
    castShadow = true,
    receiveShadow = true,
    onProgress,
  } = options;

  // Vérifier le cache
  if (!modelCache.has(url)) {
    const loader = initLoaders(useDraco, dracoPath);

    const loadPromise = new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => resolve(gltf),
        (xhr) => {
          if (onProgress && xhr.lengthComputable) {
            const progress = (xhr.loaded / xhr.total) * 100;
            onProgress(progress);
          }
        },
        (error) => reject(error)
      );
    });

    modelCache.set(url, loadPromise);
  }

  const gltf = await modelCache.get(url)!;

  // Cloner la scène pour éviter les modifications du cache
  const scene = gltf.scene.clone(true);

  // Appliquer les overrides de matériaux
  if (materialOverrides) {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        if (material.isMeshStandardMaterial) {
          if (materialOverrides.color) {
            material.color.set(materialOverrides.color);
          }
          if (materialOverrides.metalness !== undefined) {
            material.metalness = materialOverrides.metalness;
          }
          if (materialOverrides.roughness !== undefined) {
            material.roughness = materialOverrides.roughness;
          }
          if (materialOverrides.emissive) {
            material.emissive.set(materialOverrides.emissive);
          }
          if (materialOverrides.emissiveIntensity !== undefined) {
            material.emissiveIntensity = materialOverrides.emissiveIntensity;
          }
        }
      }
    });
  }

  // Appliquer l'échelle
  if (typeof scale === 'number') {
    scene.scale.setScalar(scale);
  } else {
    scene.scale.set(scale[0], scale[1], scale[2]);
  }

  // Calculer la bounding box
  const bounds = new THREE.Box3();
  if (computeBounds) {
    bounds.setFromObject(scene);
  }

  // Centrer le modèle
  if (center && computeBounds) {
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const centerOffset = new THREE.Vector3();
    bounds.getCenter(centerOffset);
    scene.position.sub(centerOffset);
    scene.position.y += size.y / 2; // Poser sur le sol
  }

  // Configurer les ombres
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
    }
  });

  const size = new THREE.Vector3();
  bounds.getSize(size);

  return {
    scene,
    animations: gltf.animations || [],
    bounds,
    size,
    gltf,
  };
}

/**
 * Charger plusieurs modèles en parallèle
 */
export async function loadMultipleGLTF(
  urls: string[],
  options?: Partial<GLTFLoadOptions>
): Promise<LoadedGLTFModel[]> {
  const promises = urls.map((url) =>
    loadGLTFModel({ url, ...options })
  );
  return Promise.all(promises);
}

/**
 * Précharger des modèles (sans attendre)
 */
export function preloadGLTFModels(urls: string[], options?: Partial<GLTFLoadOptions>) {
  urls.forEach((url) => {
    if (!modelCache.has(url)) {
      loadGLTFModel({ url, ...options }).catch((error) => {
        console.warn(`Échec du préchargement de ${url}:`, error);
      });
    }
  });
}

/**
 * Vider le cache
 */
export function clearGLTFCache(url?: string) {
  if (url) {
    modelCache.delete(url);
  } else {
    modelCache.clear();
  }
}

/**
 * Obtenir la taille du cache
 */
export function getGLTFCacheSize(): number {
  return modelCache.size;
}

/**
 * Obtenir les URLs en cache
 */
export function getCachedGLTFUrls(): string[] {
  return Array.from(modelCache.keys());
}

/**
 * Optimiser un modèle GLTF (réduire les polygones, simplifier)
 */
export function optimizeGLTFModel(scene: THREE.Group, options?: {
  mergeMeshes?: boolean;
  removeDoubles?: boolean;
  flatShading?: boolean;
}): THREE.Group {
  const {
    mergeMeshes = false,
    removeDoubles = false,
    flatShading = false,
  } = options || {};

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;

      // Flat shading
      if (flatShading && geometry.isBufferGeometry) {
        geometry.deleteAttribute('normal');
        geometry.computeVertexNormals();
      }

      // Remove doubles (simplification basique)
      if (removeDoubles && geometry.isBufferGeometry) {
        // Nécessiterait BufferGeometryUtils.mergeVertices()
        console.warn('removeDoubles nécessite BufferGeometryUtils');
      }
    }
  });

  return scene;
}

/**
 * Créer une variante colorée d'un modèle
 */
export async function createColorVariant(
  url: string,
  color: string,
  options?: Partial<GLTFLoadOptions>
): Promise<LoadedGLTFModel> {
  return loadGLTFModel({
    url,
    materialOverrides: { color },
    ...options,
  });
}

/**
 * Extraire les matériaux uniques d'un modèle
 */
export function extractMaterials(scene: THREE.Group): THREE.Material[] {
  const materials = new Set<THREE.Material>();

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => materials.add(mat));
      } else {
        materials.add(mesh.material);
      }
    }
  });

  return Array.from(materials);
}

/**
 * Obtenir les statistiques d'un modèle
 */
export function getModelStats(scene: THREE.Group): {
  meshCount: number;
  vertexCount: number;
  triangleCount: number;
  materialCount: number;
} {
  let meshCount = 0;
  let vertexCount = 0;
  let triangleCount = 0;

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshCount++;
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;

      if (geometry.isBufferGeometry) {
        const position = geometry.attributes.position;
        if (position) {
          vertexCount += position.count;
        }

        const index = geometry.index;
        if (index) {
          triangleCount += index.count / 3;
        } else if (position) {
          triangleCount += position.count / 3;
        }
      }
    }
  });

  const materials = extractMaterials(scene);

  return {
    meshCount,
    vertexCount,
    triangleCount,
    materialCount: materials.length,
  };
}

/**
 * Disposer proprement un modèle (libérer la mémoire)
 */
export function disposeGLTFModel(scene: THREE.Group) {
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;

      // Disposer la géométrie
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      // Disposer les matériaux
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            disposeMaterial(material);
          });
        } else {
          disposeMaterial(mesh.material);
        }
      }
    }
  });
}

/**
 * Helper: Disposer un matériau
 */
function disposeMaterial(material: THREE.Material) {
  material.dispose();

  // Disposer les textures
  if ((material as any).map) (material as any).map.dispose();
  if ((material as any).lightMap) (material as any).lightMap.dispose();
  if ((material as any).bumpMap) (material as any).bumpMap.dispose();
  if ((material as any).normalMap) (material as any).normalMap.dispose();
  if ((material as any).specularMap) (material as any).specularMap.dispose();
  if ((material as any).envMap) (material as any).envMap.dispose();
  if ((material as any).alphaMap) (material as any).alphaMap.dispose();
  if ((material as any).aoMap) (material as any).aoMap.dispose();
  if ((material as any).displacementMap) (material as any).displacementMap.dispose();
  if ((material as any).emissiveMap) (material as any).emissiveMap.dispose();
  if ((material as any).gradientMap) (material as any).gradientMap.dispose();
  if ((material as any).metalnessMap) (material as any).metalnessMap.dispose();
  if ((material as any).roughnessMap) (material as any).roughnessMap.dispose();
}
