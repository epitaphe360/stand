import { ModuleBase } from '@/types/modules';
import * as THREE from 'three';

/**
 * Modules pour structures multi-niveaux (escaliers, plateformes, garde-corps)
 */

export const MULTI_LEVEL_MODULES: ModuleBase[] = [
  {
    id: 'level-001',
    name: 'Plateforme Surélevée 3x3m',
    category: 'structure',
    description: 'Plateforme surélevée de 1m avec accès escalier',
    thumbnailUrl: '/modules/levels/platform-3x3.png',
    dimensions: { width: 3, height: 1, depth: 3 },
    defaultMaterial: { type: 'color', value: '#e0e0e0', metalness: 0.1, roughness: 0.8 },
    price: 1200,
    tags: ['plateforme', 'niveau', 'étage', 'structure'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 250,
    stackable: true,
    levelConfig: {
      type: 'platform',
      height: 1.0,
      hasRailing: true,
      hasStairs: true,
      stairPosition: 'front',
      capacity: 500, // kg
    },
  },
  {
    id: 'level-002',
    name: 'Escalier Modulaire',
    category: 'structure',
    description: 'Escalier métallique avec 6 marches, hauteur 1m',
    thumbnailUrl: '/modules/levels/stairs.png',
    dimensions: { width: 1, height: 1, depth: 1.5 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.7, roughness: 0.3 },
    price: 600,
    tags: ['escalier', 'marches', 'accès', 'stairs'],
    meshType: 'custom',
    customizable: { dimensions: false, material: true, color: true },
    weight: 80,
    stackable: false,
    stairConfig: {
      steps: 6,
      stepHeight: 0.167, // ~16.7cm par marche
      stepDepth: 0.25,
      width: 1.0,
      hasHandrail: true,
    },
  },
  {
    id: 'level-003',
    name: 'Garde-Corps Linéaire 3m',
    category: 'structure',
    description: 'Garde-corps de sécurité conforme normes (H: 1.1m)',
    thumbnailUrl: '/modules/levels/railing.png',
    dimensions: { width: 3, height: 1.1, depth: 0.05 },
    defaultMaterial: { type: 'color', value: '#708090', metalness: 0.9, roughness: 0.1 },
    price: 200,
    tags: ['garde-corps', 'railing', 'sécurité', 'balustrade'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 15,
    stackable: false,
  },
  {
    id: 'level-004',
    name: 'Mezzanine 6x3m',
    category: 'structure',
    description: 'Mezzanine complète avec escalier et garde-corps intégrés',
    thumbnailUrl: '/modules/levels/mezzanine.png',
    dimensions: { width: 6, height: 2.5, depth: 3 },
    defaultMaterial: { type: 'color', value: '#d0d0d0', metalness: 0.2, roughness: 0.7 },
    price: 3500,
    tags: ['mezzanine', 'étage', 'premium', 'double-hauteur'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 800,
    stackable: false,
    levelConfig: {
      type: 'mezzanine',
      height: 2.5,
      hasRailing: true,
      hasStairs: true,
      stairPosition: 'side',
      capacity: 1000,
    },
  },
  {
    id: 'level-005',
    name: 'Podium Présentation',
    category: 'structure',
    description: 'Podium surélevé pour présentation produits (H: 0.4m)',
    thumbnailUrl: '/modules/levels/podium.png',
    dimensions: { width: 2, height: 0.4, depth: 2 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0, roughness: 0.9 },
    price: 350,
    tags: ['podium', 'présentation', 'vitrine', 'display'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 50,
    stackable: true,
    levelConfig: {
      type: 'podium',
      height: 0.4,
      hasRailing: false,
      hasStairs: false,
      capacity: 200,
    },
  },
  {
    id: 'level-006',
    name: 'Rampe d\'Accès PMR',
    category: 'structure',
    description: 'Rampe d\'accès conforme PMR, pente 5%',
    thumbnailUrl: '/modules/levels/ramp.png',
    dimensions: { width: 1.2, height: 0.5, depth: 10 },
    defaultMaterial: { type: 'color', value: '#95a5a6', metalness: 0.3, roughness: 0.8 },
    price: 800,
    tags: ['rampe', 'pmr', 'accessibilité', 'handicap'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 150,
    stackable: false,
  },
];

/**
 * Configuration pour niveaux
 */
export interface LevelConfig {
  type: 'platform' | 'mezzanine' | 'podium';
  height: number;
  hasRailing: boolean;
  hasStairs: boolean;
  stairPosition?: 'front' | 'back' | 'left' | 'right' | 'side';
  capacity: number; // Charge maximale en kg
}

/**
 * Configuration pour escaliers
 */
export interface StairConfig {
  steps: number;
  stepHeight: number;
  stepDepth: number;
  width: number;
  hasHandrail: boolean;
}

/**
 * Calcule les points d'accroche pour plateforme
 */
export function getPlatformSnapPoints(
  position: THREE.Vector3,
  dimensions: { width: number; height: number; depth: number }
): Array<{ position: THREE.Vector3; type: string }> {
  const snapPoints = [];

  // Points sur le dessus de la plateforme
  snapPoints.push({
    position: new THREE.Vector3(position.x, position.y + dimensions.height, position.z),
    type: 'platform-top',
  });

  // Points pour escalier (4 côtés)
  snapPoints.push(
    {
      position: new THREE.Vector3(position.x, position.y, position.z + dimensions.depth / 2),
      type: 'stair-front',
    },
    {
      position: new THREE.Vector3(position.x, position.y, position.z - dimensions.depth / 2),
      type: 'stair-back',
    },
    {
      position: new THREE.Vector3(position.x + dimensions.width / 2, position.y, position.z),
      type: 'stair-right',
    },
    {
      position: new THREE.Vector3(position.x - dimensions.width / 2, position.y, position.z),
      type: 'stair-left',
    }
  );

  return snapPoints;
}

/**
 * Calcule la position automatique d'un escalier pour rejoindre une plateforme
 */
export function calculateStairPosition(
  platformPosition: THREE.Vector3,
  platformDimensions: { width: number; height: number; depth: number },
  stairDimensions: { width: number; height: number; depth: number },
  side: 'front' | 'back' | 'left' | 'right' = 'front'
): THREE.Vector3 {
  const stairPos = new THREE.Vector3();

  switch (side) {
    case 'front':
      stairPos.set(
        platformPosition.x,
        platformPosition.y,
        platformPosition.z + platformDimensions.depth / 2 + stairDimensions.depth / 2
      );
      break;
    case 'back':
      stairPos.set(
        platformPosition.x,
        platformPosition.y,
        platformPosition.z - platformDimensions.depth / 2 - stairDimensions.depth / 2
      );
      break;
    case 'left':
      stairPos.set(
        platformPosition.x - platformDimensions.width / 2 - stairDimensions.depth / 2,
        platformPosition.y,
        platformPosition.z
      );
      break;
    case 'right':
      stairPos.set(
        platformPosition.x + platformDimensions.width / 2 + stairDimensions.depth / 2,
        platformPosition.y,
        platformPosition.z
      );
      break;
  }

  return stairPos;
}

/**
 * Vérifie si un module peut être placé sur une plateforme
 */
export function canPlaceOnPlatform(
  modulePosition: THREE.Vector3,
  moduleDimensions: { width: number; height: number; depth: number },
  platformPosition: THREE.Vector3,
  platformDimensions: { width: number; height: number; depth: number }
): boolean {
  const platformTop = platformPosition.y + platformDimensions.height;
  const isAtCorrectHeight = Math.abs(modulePosition.y - platformTop) < 0.1;

  if (!isAtCorrectHeight) return false;

  // Vérifier que le module est bien sur la surface de la plateforme
  const moduleHalfWidth = moduleDimensions.width / 2;
  const moduleHalfDepth = moduleDimensions.depth / 2;
  const platformHalfWidth = platformDimensions.width / 2;
  const platformHalfDepth = platformDimensions.depth / 2;

  const isWithinX =
    modulePosition.x - moduleHalfWidth >= platformPosition.x - platformHalfWidth &&
    modulePosition.x + moduleHalfWidth <= platformPosition.x + platformHalfWidth;

  const isWithinZ =
    modulePosition.z - moduleHalfDepth >= platformPosition.z - platformHalfDepth &&
    modulePosition.z + moduleHalfDepth <= platformPosition.z + platformHalfDepth;

  return isWithinX && isWithinZ;
}
