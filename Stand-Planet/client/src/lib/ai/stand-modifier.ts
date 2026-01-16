import { StandConfiguration, PlacedModule, ModuleBase } from '@/types/modules';
import { ALL_MODULES } from '@/lib/3d/modules';

/**
 * Système IA pour modifier des stands existants
 * Permet des commandes comme "change tous les murs en bleu", "ajoute un écran",
 * "supprime les tables", "rends le stand plus moderne", etc.
 */

export interface ModificationCommand {
  type:
    | 'change_color'
    | 'change_material'
    | 'add_module'
    | 'remove_module'
    | 'replace_module'
    | 'scale_module'
    | 'move_module'
    | 'rotate_module'
    | 'change_style'
    | 'optimize_layout';
  targets?: string[]; // IDs ou catégories ciblées
  parameters: Record<string, any>;
}

export interface ModificationResult {
  success: boolean;
  modifiedConfiguration: StandConfiguration;
  changes: string[];
  errors?: string[];
}

/**
 * Parser un prompt utilisateur en commandes de modification
 */
export function parseModificationPrompt(
  prompt: string,
  currentConfig: StandConfiguration
): ModificationCommand[] {
  const commands: ModificationCommand[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // === CHANGEMENT DE COULEUR ===
  const colorPatterns = [
    /chang(?:e|ez?)\s+(?:la\s+)?couleur\s+(?:de[s]?\s+)?(\w+)\s+en\s+(\w+)/i,
    /(?:met|mets|mettre)\s+(?:les?\s+)?(\w+)\s+en\s+(\w+)/i,
    /tous?\s+les?\s+(\w+)\s+en\s+(\w+)/i,
  ];

  for (const pattern of colorPatterns) {
    const match = prompt.match(pattern);
    if (match) {
      const category = match[1];
      const color = match[2];

      commands.push({
        type: 'change_color',
        targets: [category],
        parameters: { color: normalizeColor(color) },
      });
    }
  }

  // === AJOUT DE MODULES ===
  const addPatterns = [
    /ajout(?:e|ez?)\s+(?:un|une|des)\s+(\w+)/i,
    /plac(?:e|ez?)\s+(?:un|une|des)\s+(\w+)/i,
    /j['']ai\s+besoin\s+d[''](?:un|une|des)\s+(\w+)/i,
  ];

  for (const pattern of addPatterns) {
    const match = prompt.match(pattern);
    if (match) {
      const moduleType = match[1];

      commands.push({
        type: 'add_module',
        parameters: { moduleType, quantity: 1 },
      });
    }
  }

  // === SUPPRESSION DE MODULES ===
  const removePatterns = [
    /supprim(?:e|ez?)\s+(?:le|la|les|tous?|toutes?)\s+(\w+)/i,
    /enlev(?:e|ez?)\s+(?:le|la|les|tous?|toutes?)\s+(\w+)/i,
    /retir(?:e|ez?)\s+(?:le|la|les|tous?|toutes?)\s+(\w+)/i,
  ];

  for (const pattern of removePatterns) {
    const match = prompt.match(pattern);
    if (match) {
      const category = match[1];

      commands.push({
        type: 'remove_module',
        targets: [category],
        parameters: {},
      });
    }
  }

  // === CHANGEMENT DE STYLE ===
  const stylePatterns = [
    /rends?\s+(?:le\s+stand\s+)?plus\s+(\w+)/i,
    /style\s+(\w+)/i,
    /(?:plus|davantage)\s+(\w+)/i,
  ];

  for (const pattern of stylePatterns) {
    const match = prompt.match(pattern);
    if (match) {
      const style = match[1];

      commands.push({
        type: 'change_style',
        parameters: { style: normalizeStyle(style) },
      });
    }
  }

  // === OPTIMISATION ===
  if (
    lowerPrompt.includes('optim') ||
    lowerPrompt.includes('améliore') ||
    lowerPrompt.includes('réorganise')
  ) {
    commands.push({
      type: 'optimize_layout',
      parameters: {},
    });
  }

  return commands;
}

/**
 * Appliquer une commande de modification
 */
export function applyModificationCommand(
  command: ModificationCommand,
  config: StandConfiguration
): ModificationResult {
  const changes: string[] = [];
  const errors: string[] = [];
  let modifiedModules = [...config.modules];

  try {
    switch (command.type) {
      case 'change_color':
        modifiedModules = changeModulesColor(
          modifiedModules,
          command.targets || [],
          command.parameters.color
        );
        changes.push(
          `Couleur changée en ${command.parameters.color} pour ${command.targets?.join(', ')}`
        );
        break;

      case 'change_material':
        modifiedModules = changeModulesMaterial(
          modifiedModules,
          command.targets || [],
          command.parameters.material
        );
        changes.push(
          `Matériau changé pour ${command.targets?.join(', ')}`
        );
        break;

      case 'add_module':
        const addedModule = addModuleToConfig(
          modifiedModules,
          command.parameters.moduleType,
          config.dimensions
        );
        if (addedModule) {
          modifiedModules.push(addedModule);
          changes.push(`Ajouté: ${addedModule.name}`);
        } else {
          errors.push(
            `Impossible d'ajouter un module de type ${command.parameters.moduleType}`
          );
        }
        break;

      case 'remove_module':
        const beforeCount = modifiedModules.length;
        modifiedModules = removeModulesByTarget(
          modifiedModules,
          command.targets || []
        );
        const removedCount = beforeCount - modifiedModules.length;
        changes.push(`Supprimé ${removedCount} module(s)`);
        break;

      case 'replace_module':
        modifiedModules = replaceModules(
          modifiedModules,
          command.targets || [],
          command.parameters.newModuleType
        );
        changes.push(`Modules remplacés`);
        break;

      case 'change_style':
        modifiedModules = applyStyleToModules(
          modifiedModules,
          command.parameters.style
        );
        changes.push(`Style changé: ${command.parameters.style}`);
        break;

      case 'optimize_layout':
        modifiedModules = optimizeModuleLayout(
          modifiedModules,
          config.dimensions
        );
        changes.push(`Layout optimisé`);
        break;

      default:
        errors.push(`Type de commande non supporté: ${command.type}`);
    }
  } catch (error) {
    errors.push(`Erreur: ${error}`);
  }

  return {
    success: errors.length === 0,
    modifiedConfiguration: {
      ...config,
      modules: modifiedModules,
      updatedAt: new Date(),
    },
    changes,
    errors,
  };
}

/**
 * Changer la couleur de modules ciblés
 */
function changeModulesColor(
  modules: PlacedModule[],
  targets: string[],
  color: string
): PlacedModule[] {
  return modules.map((module) => {
    // Vérifier si le module correspond aux cibles
    const matches = targets.some((target) => {
      const lowerTarget = target.toLowerCase();
      return (
        module.category.toLowerCase().includes(lowerTarget) ||
        module.name.toLowerCase().includes(lowerTarget) ||
        module.tags.some((tag) => tag.toLowerCase().includes(lowerTarget))
      );
    });

    if (matches) {
      return {
        ...module,
        material: {
          ...module.material,
          value: color,
          type: 'color',
        },
      };
    }

    return module;
  });
}

/**
 * Changer le matériau de modules ciblés
 */
function changeModulesMaterial(
  modules: PlacedModule[],
  targets: string[],
  materialName: string
): PlacedModule[] {
  return modules.map((module) => {
    const matches = targets.some((target) => {
      const lowerTarget = target.toLowerCase();
      return (
        module.category.toLowerCase().includes(lowerTarget) ||
        module.name.toLowerCase().includes(lowerTarget)
      );
    });

    if (matches) {
      return {
        ...module,
        material: {
          ...module.material,
          type: 'material',
          value: materialName,
        },
      };
    }

    return module;
  });
}

/**
 * Ajouter un module à la configuration
 */
function addModuleToConfig(
  existingModules: PlacedModule[],
  moduleType: string,
  standDimensions: { width: number; depth: number }
): PlacedModule | null {
  // Rechercher un module correspondant
  const availableModule = ALL_MODULES.find((m) => {
    const lowerType = moduleType.toLowerCase();
    return (
      m.category.toLowerCase().includes(lowerType) ||
      m.name.toLowerCase().includes(lowerType) ||
      m.tags.some((tag) => tag.toLowerCase().includes(lowerType))
    );
  });

  if (!availableModule) {
    return null;
  }

  // Trouver une position libre
  const position = findFreePosition(
    existingModules,
    availableModule.dimensions,
    standDimensions
  );

  // Créer l'instance
  const placedModule: PlacedModule = {
    ...availableModule,
    instanceId: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position,
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    material: availableModule.defaultMaterial,
    isSelected: false,
    isLocked: false,
  };

  return placedModule;
}

/**
 * Supprimer des modules par cible
 */
function removeModulesByTarget(
  modules: PlacedModule[],
  targets: string[]
): PlacedModule[] {
  return modules.filter((module) => {
    const matches = targets.some((target) => {
      const lowerTarget = target.toLowerCase();
      return (
        module.category.toLowerCase().includes(lowerTarget) ||
        module.name.toLowerCase().includes(lowerTarget) ||
        module.tags.some((tag) => tag.toLowerCase().includes(lowerTarget))
      );
    });

    return !matches; // Garder les modules qui ne correspondent PAS
  });
}

/**
 * Remplacer des modules
 */
function replaceModules(
  modules: PlacedModule[],
  targets: string[],
  newModuleType: string
): PlacedModule[] {
  const newModuleBase = ALL_MODULES.find((m) =>
    m.name.toLowerCase().includes(newModuleType.toLowerCase())
  );

  if (!newModuleBase) {
    return modules;
  }

  return modules.map((module) => {
    const matches = targets.some((target) => {
      const lowerTarget = target.toLowerCase();
      return (
        module.category.toLowerCase().includes(lowerTarget) ||
        module.name.toLowerCase().includes(lowerTarget)
      );
    });

    if (matches) {
      return {
        ...newModuleBase,
        instanceId: module.instanceId,
        position: module.position,
        rotation: module.rotation,
        scale: module.scale,
        material: newModuleBase.defaultMaterial,
        isSelected: false,
        isLocked: false,
      } as PlacedModule;
    }

    return module;
  });
}

/**
 * Appliquer un style à tous les modules
 */
function applyStyleToModules(
  modules: PlacedModule[],
  style: string
): PlacedModule[] {
  const stylePalettes: Record<string, Record<string, string>> = {
    moderne: {
      structure: '#ecf0f1',
      wall: '#34495e',
      furniture: '#95a5a6',
      lighting: '#f39c12',
      multimedia: '#3498db',
      plv: '#e74c3c',
      decoration: '#9b59b6',
      flooring: '#bdc3c7',
    },
    luxe: {
      structure: '#f4e4c1',
      wall: '#2c3e50',
      furniture: '#8B4513',
      lighting: '#FFD700',
      multimedia: '#000000',
      plv: '#C0C0C0',
      decoration: '#8B008B',
      flooring: '#2F4F4F',
    },
    industriel: {
      structure: '#95a5a6',
      wall: '#34495e',
      furniture: '#5D4E37',
      lighting: '#C0C0C0',
      multimedia: '#4A4A4A',
      plv: '#e67e22',
      decoration: '#7f8c8d',
      flooring: '#2c3e50',
    },
    minimal: {
      structure: '#ffffff',
      wall: '#f8f9fa',
      furniture: '#ecf0f1',
      lighting: '#bdc3c7',
      multimedia: '#000000',
      plv: '#34495e',
      decoration: '#95a5a6',
      flooring: '#e8e8e8',
    },
  };

  const palette = stylePalettes[style] || stylePalettes.moderne;

  return modules.map((module) => ({
    ...module,
    material: {
      ...module.material,
      value: palette[module.category] || module.material.value,
      type: 'color',
    },
  }));
}

/**
 * Optimiser le layout (espacement, alignement)
 */
function optimizeModuleLayout(
  modules: PlacedModule[],
  standDimensions: { width: number; depth: number }
): PlacedModule[] {
  // Regrouper par catégorie
  const byCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, PlacedModule[]>);

  // Réorganiser selon des zones
  const zones = {
    wall: { x: 0, z: 0 },
    furniture: { x: standDimensions.width / 2, z: standDimensions.depth / 2 },
    lighting: { x: standDimensions.width / 2, z: standDimensions.depth / 4 },
    multimedia: { x: standDimensions.width / 3, z: standDimensions.depth / 2 },
    plv: { x: standDimensions.width / 4, z: standDimensions.depth / 3 },
    decoration: { x: 2 * standDimensions.width / 3, z: 2 * standDimensions.depth / 3 },
  };

  const optimized: PlacedModule[] = [];

  for (const [category, categoryModules] of Object.entries(byCategory)) {
    const zone = zones[category as keyof typeof zones] || { x: 0, z: 0 };

    categoryModules.forEach((module, index) => {
      const offset = index * 1.5; // Espacement de 1.5m

      optimized.push({
        ...module,
        position: {
          x: zone.x + (index % 2) * 1,
          y: module.position.y,
          z: zone.z + offset,
        },
      });
    });
  }

  return optimized;
}

/**
 * Trouver une position libre
 */
function findFreePosition(
  existingModules: PlacedModule[],
  dimensions: { width: number; height: number; depth: number },
  standDimensions: { width: number; depth: number }
): { x: number; y: number; z: number } {
  const gridStep = 0.5; // Grille de 50cm

  for (let x = dimensions.width / 2; x < standDimensions.width - dimensions.width / 2; x += gridStep) {
    for (let z = dimensions.depth / 2; z < standDimensions.depth - dimensions.depth / 2; z += gridStep) {
      const position = { x, y: 0, z };

      // Vérifier collision
      const hasCollision = existingModules.some((module) => {
        const dx = Math.abs(module.position.x - position.x);
        const dz = Math.abs(module.position.z - position.z);

        return (
          dx < (module.dimensions.width + dimensions.width) / 2 &&
          dz < (module.dimensions.depth + dimensions.depth) / 2
        );
      });

      if (!hasCollision) {
        return position;
      }
    }
  }

  // Si aucune position trouvée, retourner le centre
  return {
    x: standDimensions.width / 2,
    y: 0,
    z: standDimensions.depth / 2,
  };
}

/**
 * Normaliser un nom de couleur
 */
function normalizeColor(colorName: string): string {
  const colorMap: Record<string, string> = {
    rouge: '#e74c3c',
    bleu: '#3498db',
    vert: '#27ae60',
    jaune: '#f1c40f',
    orange: '#e67e22',
    violet: '#9b59b6',
    rose: '#e91e63',
    noir: '#000000',
    blanc: '#ffffff',
    gris: '#95a5a6',
    marron: '#8B4513',
  };

  return colorMap[colorName.toLowerCase()] || colorName;
}

/**
 * Normaliser un nom de style
 */
function normalizeStyle(styleName: string): string {
  const styleMap: Record<string, string> = {
    moderne: 'moderne',
    modern: 'moderne',
    luxe: 'luxe',
    luxury: 'luxe',
    industriel: 'industriel',
    industrial: 'industriel',
    minimal: 'minimal',
    minimaliste: 'minimal',
  };

  return styleMap[styleName.toLowerCase()] || styleName;
}

/**
 * Appliquer plusieurs commandes en séquence
 */
export function applyMultipleModifications(
  commands: ModificationCommand[],
  config: StandConfiguration
): ModificationResult {
  let currentConfig = config;
  const allChanges: string[] = [];
  const allErrors: string[] = [];

  for (const command of commands) {
    const result = applyModificationCommand(command, currentConfig);

    if (result.success) {
      currentConfig = result.modifiedConfiguration;
      allChanges.push(...result.changes);
    } else {
      allErrors.push(...(result.errors || []));
    }
  }

  return {
    success: allErrors.length === 0,
    modifiedConfiguration: currentConfig,
    changes: allChanges,
    errors: allErrors.length > 0 ? allErrors : undefined,
  };
}
