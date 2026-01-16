import { ModuleDimensions, ModulePosition, PlacedModule } from '@/types/modules';

/**
 * Moteur physique simple pour le Stand Studio
 * Gestion des collisions, stacking et contraintes spatiales
 */

export interface AABB {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
}

export interface CollisionResult {
  hasCollision: boolean;
  collidingWith?: PlacedModule[];
  canStack: boolean;
  suggestedY?: number;
  suggestedPosition?: ModulePosition;
}

/**
 * Calculer l'AABB (Axis-Aligned Bounding Box) d'un module
 */
export function calculateAABB(
  position: ModulePosition,
  dimensions: ModuleDimensions,
  includeMargin: number = 0
): AABB {
  const halfWidth = dimensions.width / 2 + includeMargin;
  const halfDepth = dimensions.depth / 2 + includeMargin;
  const height = dimensions.height + includeMargin * 2;

  return {
    min: {
      x: position.x - halfWidth,
      y: position.y,
      z: position.z - halfDepth,
    },
    max: {
      x: position.x + halfWidth,
      y: position.y + height,
      z: position.z + halfDepth,
    },
  };
}

/**
 * Vérifier si deux AABB se chevauchent
 */
export function aabbIntersects(a: AABB, b: AABB): boolean {
  return (
    a.min.x < b.max.x &&
    a.max.x > b.min.x &&
    a.min.y < b.max.y &&
    a.max.y > b.min.y &&
    a.min.z < b.max.z &&
    a.max.z > b.min.z
  );
}

/**
 * Vérifier si un module peut être empilé sur un autre
 */
export function canStackOn(
  topModule: PlacedModule,
  bottomModule: PlacedModule
): boolean {
  // Vérifier si le module du bas est stackable
  if (!bottomModule.stackable) {
    return false;
  }

  // Vérifier la capacité de charge (si définie)
  const maxWeight = bottomModule.weight ? bottomModule.weight * 2 : 1000; // Par défaut 1 tonne
  const topWeight = topModule.weight || 0;

  if (topWeight > maxWeight) {
    return false;
  }

  // Vérifier que le module du haut est plus petit ou égal en surface
  const topSurface = topModule.dimensions.width * topModule.dimensions.depth;
  const bottomSurface = bottomModule.dimensions.width * bottomModule.dimensions.depth;

  if (topSurface > bottomSurface * 1.1) {
    // Tolérance de 10%
    return false;
  }

  return true;
}

/**
 * Vérifier les collisions et proposer un positionnement valide
 */
export function checkCollisionAndStack(
  module: PlacedModule,
  targetPosition: ModulePosition,
  allModules: PlacedModule[],
  options: {
    allowStacking?: boolean;
    collisionMargin?: number;
    snapToSurface?: boolean;
  } = {}
): CollisionResult {
  const {
    allowStacking = true,
    collisionMargin = 0.01, // 1cm de marge
    snapToSurface = true,
  } = options;

  // AABB du module à la position cible
  const targetAABB = calculateAABB(
    targetPosition,
    module.dimensions,
    collisionMargin
  );

  const collidingModules: PlacedModule[] = [];
  let suggestedY = 0; // Par défaut au sol
  let canStack = false;

  // Vérifier les collisions avec tous les autres modules
  for (const other of allModules) {
    if (other.instanceId === module.instanceId) {
      continue; // Ne pas se comparer avec soi-même
    }

    const otherAABB = calculateAABB(
      other.position,
      other.dimensions,
      collisionMargin
    );

    // Vérifier la collision en XZ (plan horizontal)
    const xzCollision =
      targetAABB.min.x < otherAABB.max.x &&
      targetAABB.max.x > otherAABB.min.x &&
      targetAABB.min.z < otherAABB.max.z &&
      targetAABB.max.z > otherAABB.min.z;

    if (xzCollision) {
      // Il y a chevauchement en XZ
      collidingModules.push(other);

      if (allowStacking && canStackOn(module, other)) {
        // On peut empiler
        const stackY = other.position.y + other.dimensions.height;

        // Si snapToSurface, suggérer cette hauteur
        if (snapToSurface && stackY > suggestedY) {
          suggestedY = stackY;
          canStack = true;
        }
      }
    }
  }

  // Si collision mais stacking possible
  if (collidingModules.length > 0 && canStack && allowStacking) {
    return {
      hasCollision: false, // Pas vraiment une collision si on peut empiler
      collidingWith: collidingModules,
      canStack: true,
      suggestedY,
      suggestedPosition: {
        x: targetPosition.x,
        y: suggestedY,
        z: targetPosition.z,
      },
    };
  }

  // Si collision sans possibilité de stacking
  if (collidingModules.length > 0) {
    // Proposer la position la plus proche sans collision
    const validPosition = findNearestValidPosition(
      module,
      targetPosition,
      allModules,
      collisionMargin
    );

    return {
      hasCollision: true,
      collidingWith: collidingModules,
      canStack: false,
      suggestedPosition: validPosition || targetPosition,
    };
  }

  // Pas de collision
  return {
    hasCollision: false,
    canStack: false,
    suggestedPosition: targetPosition,
  };
}

/**
 * Trouver la position valide la plus proche
 */
export function findNearestValidPosition(
  module: PlacedModule,
  targetPosition: ModulePosition,
  allModules: PlacedModule[],
  collisionMargin: number = 0.01
): ModulePosition | null {
  const searchRadius = 0.5; // Rechercher dans un rayon de 50cm
  const step = 0.1; // Pas de 10cm

  let bestPosition: ModulePosition | null = null;
  let bestDistance = Infinity;

  // Recherche en spirale autour de la position cible
  for (let radius = step; radius <= searchRadius; radius += step) {
    const steps = Math.ceil((2 * Math.PI * radius) / step);

    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const testPosition: ModulePosition = {
        x: targetPosition.x + Math.cos(angle) * radius,
        y: targetPosition.y,
        z: targetPosition.z + Math.sin(angle) * radius,
      };

      const testAABB = calculateAABB(
        testPosition,
        module.dimensions,
        collisionMargin
      );

      let hasCollision = false;

      for (const other of allModules) {
        if (other.instanceId === module.instanceId) continue;

        const otherAABB = calculateAABB(
          other.position,
          other.dimensions,
          collisionMargin
        );

        if (aabbIntersects(testAABB, otherAABB)) {
          hasCollision = true;
          break;
        }
      }

      if (!hasCollision) {
        const distance = Math.sqrt(
          Math.pow(testPosition.x - targetPosition.x, 2) +
            Math.pow(testPosition.z - targetPosition.z, 2)
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          bestPosition = testPosition;
        }
      }
    }

    // Si on a trouvé une position valide, on peut arrêter
    if (bestPosition) {
      return bestPosition;
    }
  }

  return bestPosition;
}

/**
 * Vérifier si un module est dans les limites du stand
 */
export function isWithinStandBounds(
  position: ModulePosition,
  dimensions: ModuleDimensions,
  standWidth: number,
  standDepth: number
): boolean {
  const halfWidth = dimensions.width / 2;
  const halfDepth = dimensions.depth / 2;

  return (
    position.x - halfWidth >= 0 &&
    position.x + halfWidth <= standWidth &&
    position.z - halfDepth >= 0 &&
    position.z + halfDepth <= standDepth
  );
}

/**
 * Contraindre une position aux limites du stand
 */
export function clampToStandBounds(
  position: ModulePosition,
  dimensions: ModuleDimensions,
  standWidth: number,
  standDepth: number
): ModulePosition {
  const halfWidth = dimensions.width / 2;
  const halfDepth = dimensions.depth / 2;

  return {
    x: Math.max(halfWidth, Math.min(standWidth - halfWidth, position.x)),
    y: position.y,
    z: Math.max(halfDepth, Math.min(standDepth - halfDepth, position.z)),
  };
}

/**
 * Calculer le centre de masse d'un module
 */
export function calculateCenterOfMass(
  module: PlacedModule
): { x: number; y: number; z: number } {
  return {
    x: module.position.x,
    y: module.position.y + module.dimensions.height / 2,
    z: module.position.z,
  };
}

/**
 * Vérifier la stabilité d'un empilement (centre de masse)
 */
export function checkStackingStability(
  topModule: PlacedModule,
  bottomModule: PlacedModule
): { isStable: boolean; stabilityScore: number } {
  const topCOM = calculateCenterOfMass(topModule);
  const bottomCOM = calculateCenterOfMass(bottomModule);

  // Calculer le décalage horizontal
  const horizontalOffset = Math.sqrt(
    Math.pow(topCOM.x - bottomCOM.x, 2) +
      Math.pow(topCOM.z - bottomCOM.z, 2)
  );

  // Calculer le rayon de la base du module du bas
  const baseRadius = Math.min(
    bottomModule.dimensions.width,
    bottomModule.dimensions.depth
  ) / 2;

  // Score de stabilité (0 = instable, 1 = parfaitement stable)
  const stabilityScore = Math.max(0, 1 - horizontalOffset / baseRadius);

  // Considérer comme stable si le score est > 0.7
  const isStable = stabilityScore > 0.7;

  return { isStable, stabilityScore };
}

/**
 * Obtenir tous les modules sur lesquels un module est empilé
 */
export function getModulesBelow(
  module: PlacedModule,
  allModules: PlacedModule[]
): PlacedModule[] {
  const modulesBelow: PlacedModule[] = [];
  const moduleAABB = calculateAABB(module.position, module.dimensions);

  for (const other of allModules) {
    if (other.instanceId === module.instanceId) continue;

    // Le module est en dessous si son sommet touche le bas de notre module
    const touchesBottom =
      Math.abs(other.position.y + other.dimensions.height - module.position.y) <
      0.05; // 5cm de tolérance

    if (touchesBottom) {
      // Vérifier le chevauchement en XZ
      const otherAABB = calculateAABB(other.position, other.dimensions);

      const xzOverlap =
        moduleAABB.min.x < otherAABB.max.x &&
        moduleAABB.max.x > otherAABB.min.x &&
        moduleAABB.min.z < otherAABB.max.z &&
        moduleAABB.max.z > otherAABB.min.z;

      if (xzOverlap) {
        modulesBelow.push(other);
      }
    }
  }

  return modulesBelow;
}

/**
 * Valider toute une configuration de stand
 */
export function validateStandConfiguration(
  modules: PlacedModule[],
  standWidth: number,
  standDepth: number
): {
  isValid: boolean;
  errors: Array<{
    moduleId: string;
    type: 'collision' | 'out_of_bounds' | 'unstable' | 'overweight';
    message: string;
  }>;
} {
  const errors: Array<{
    moduleId: string;
    type: 'collision' | 'out_of_bounds' | 'unstable' | 'overweight';
    message: string;
  }> = [];

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];

    // Vérifier les limites du stand
    if (
      !isWithinStandBounds(
        module.position,
        module.dimensions,
        standWidth,
        standDepth
      )
    ) {
      errors.push({
        moduleId: module.instanceId,
        type: 'out_of_bounds',
        message: `${module.name} dépasse les limites du stand`,
      });
    }

    // Vérifier les collisions
    for (let j = i + 1; j < modules.length; j++) {
      const other = modules[j];

      const moduleAABB = calculateAABB(module.position, module.dimensions, 0.01);
      const otherAABB = calculateAABB(other.position, other.dimensions, 0.01);

      if (aabbIntersects(moduleAABB, otherAABB)) {
        // Vérifier si c'est un stacking valide
        const isValidStack =
          (canStackOn(module, other) &&
            Math.abs(
              module.position.y -
                (other.position.y + other.dimensions.height)
            ) < 0.05) ||
          (canStackOn(other, module) &&
            Math.abs(
              other.position.y -
                (module.position.y + module.dimensions.height)
            ) < 0.05);

        if (!isValidStack) {
          errors.push({
            moduleId: module.instanceId,
            type: 'collision',
            message: `${module.name} est en collision avec ${other.name}`,
          });
        }
      }
    }

    // Vérifier la stabilité des empilements
    const modulesBelow = getModulesBelow(module, modules);
    for (const below of modulesBelow) {
      const { isStable } = checkStackingStability(module, below);

      if (!isStable) {
        errors.push({
          moduleId: module.instanceId,
          type: 'unstable',
          message: `${module.name} est instable sur ${below.name}`,
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Suggérer des corrections automatiques pour un stand invalide
 */
export function suggestConfigurationFixes(
  modules: PlacedModule[],
  standWidth: number,
  standDepth: number
): PlacedModule[] {
  const fixedModules = [...modules];

  for (let i = 0; i < fixedModules.length; i++) {
    const module = fixedModules[i];

    // Fixer les modules hors limites
    if (
      !isWithinStandBounds(
        module.position,
        module.dimensions,
        standWidth,
        standDepth
      )
    ) {
      module.position = clampToStandBounds(
        module.position,
        module.dimensions,
        standWidth,
        standDepth
      );
    }

    // Fixer les collisions
    const result = checkCollisionAndStack(
      module,
      module.position,
      fixedModules.filter((m) => m.instanceId !== module.instanceId),
      { allowStacking: true, snapToSurface: true }
    );

    if (result.suggestedPosition) {
      module.position = result.suggestedPosition;
    }
  }

  return fixedModules;
}
