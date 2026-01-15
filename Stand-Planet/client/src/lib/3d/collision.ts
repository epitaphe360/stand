import { PlacedModule, ModulePosition } from '@/types/modules';

/**
 * Détection de collision AABB (Axis-Aligned Bounding Box)
 */
export const checkAABBCollision = (
  pos1: ModulePosition,
  dim1: { width: number; depth: number },
  pos2: ModulePosition,
  dim2: { width: number; depth: number },
  margin: number = 0.01
): boolean => {
  const halfW1 = dim1.width / 2;
  const halfD1 = dim1.depth / 2;
  const halfW2 = dim2.width / 2;
  const halfD2 = dim2.depth / 2;

  const collisionX = Math.abs(pos1.x - pos2.x) < (halfW1 + halfW2 - margin);
  const collisionZ = Math.abs(pos1.z - pos2.z) < (halfD1 + halfD2 - margin);

  return collisionX && collisionZ;
};

/**
 * Vérifie si un module peut être empilé sur un autre
 */
export const canStack = (
  moduleToPlace: PlacedModule,
  targetModule: PlacedModule
): boolean => {
  if (!targetModule.stackable) return false;
  
  // Vérifier si le module à placer est plus petit ou égal en surface
  const surfaceFit = 
    moduleToPlace.dimensions.width <= targetModule.dimensions.width &&
    moduleToPlace.dimensions.depth <= targetModule.dimensions.depth;
    
  return surfaceFit;
};

/**
 * Calcule la position de snapping automatique
 */
export const getSnappedPosition = (
  position: ModulePosition,
  gridSize: number,
  snapToGrid: boolean
): ModulePosition => {
  if (!snapToGrid) return position;
  
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: position.y,
    z: Math.round(position.z / gridSize) * gridSize
  };
};

/**
 * Calcule la distance entre deux modules
 */
export const getDistance = (pos1: ModulePosition, pos2: ModulePosition): number => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.z - pos2.z, 2)
  );
};

/**
 * Trouve le point d'accroche (snap point) le plus proche
 */
export const findNearestSnapPoint = (
  position: ModulePosition,
  modules: PlacedModule[],
  threshold: number = 0.5
) => {
  let nearestPoint = null;
  let minDistance = threshold;

  for (const module of modules) {
    if (!module.snapPoints) continue;

    for (const snapPoint of module.snapPoints) {
      // Calculer la position absolue du snap point
      const absoluteSnapPos = {
        x: module.position.x + snapPoint.position.x,
        y: module.position.y + snapPoint.position.y,
        z: module.position.z + snapPoint.position.z
      };

      const dist = getDistance(position, absoluteSnapPos);
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = absoluteSnapPos;
      }
    }
  }

  return nearestPoint;
};
