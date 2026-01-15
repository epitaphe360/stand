import { ModuleBase } from '@/types/modules';

/**
 * Modules d'éclairage professionnels pour stands d'exposition
 * Reproduit les effets lumineux des stands comme CIMAT
 */

export const LIGHTING_MODULES: ModuleBase[] = [
  {
    id: 'light-001',
    name: 'Spot LED Directionnel',
    category: 'lighting',
    description: 'Projecteur LED directionnel avec faisceau réglable',
    thumbnailUrl: '/modules/lighting/spot-led.png',
    dimensions: { width: 0.15, height: 0.2, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#1a1a1a', metalness: 0.9, roughness: 0.2 },
    price: 150,
    tags: ['spot', 'led', 'directionnel', 'professionnel'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false },
    lightConfig: {
      type: 'spot',
      color: '#ffffff',
      intensity: 2,
      distance: 10,
      angle: Math.PI / 6, // 30 degrés
      penumbra: 0.3,
      castShadow: true,
      shadowMapSize: 1024,
    },
    weight: 1.5,
  },
  {
    id: 'light-002',
    name: 'Bande LED RGB',
    category: 'lighting',
    description: 'Bande LED RGB programmable pour contour de stand',
    thumbnailUrl: '/modules/lighting/led-strip.png',
    dimensions: { width: 3, height: 0.02, depth: 0.03 },
    defaultMaterial: { type: 'color', value: '#0066ff', emissive: '#0066ff', emissiveIntensity: 1.5 },
    price: 200,
    tags: ['led', 'rgb', 'strip', 'ambiance'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true },
    lightConfig: {
      type: 'rect',
      color: '#0066ff',
      intensity: 3,
      distance: 3,
      width: 3,
      height: 0.02,
      castShadow: false,
    },
    weight: 0.5,
  },
  {
    id: 'light-003',
    name: 'Panneau LED Rétroéclairé',
    category: 'lighting',
    description: 'Panneau lumineux pour affichage rétroéclairé',
    thumbnailUrl: '/modules/lighting/backlight-panel.png',
    dimensions: { width: 2, height: 2.5, depth: 0.05 },
    defaultMaterial: {
      type: 'color',
      value: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 2,
      opacity: 0.95,
      transparent: true
    },
    price: 500,
    tags: ['panneau', 'rétroéclairé', 'affichage', 'premium'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true },
    lightConfig: {
      type: 'rect',
      color: '#ffffff',
      intensity: 4,
      distance: 4,
      width: 2,
      height: 2.5,
      castShadow: false,
    },
    weight: 8,
  },
  {
    id: 'light-004',
    name: 'Downlight Encastré',
    category: 'lighting',
    description: 'Spot encastré pour plafond de stand',
    thumbnailUrl: '/modules/lighting/downlight.png',
    dimensions: { width: 0.12, height: 0.08, depth: 0.12 },
    defaultMaterial: { type: 'color', value: '#cccccc', metalness: 0.5, roughness: 0.3 },
    price: 80,
    tags: ['downlight', 'encastré', 'plafond'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false },
    lightConfig: {
      type: 'point',
      color: '#ffffee',
      intensity: 1.5,
      distance: 5,
      decay: 2,
      castShadow: true,
      shadowMapSize: 512,
    },
    weight: 0.8,
  },
  {
    id: 'light-005',
    name: 'Projecteur Par LED',
    category: 'lighting',
    description: 'Projecteur Par LED pour éclairage d\'ambiance coloré',
    thumbnailUrl: '/modules/lighting/par-led.png',
    dimensions: { width: 0.25, height: 0.3, depth: 0.25 },
    defaultMaterial: { type: 'color', value: '#000000', metalness: 0.7, roughness: 0.4 },
    price: 250,
    tags: ['par', 'led', 'ambiance', 'couleur'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false },
    lightConfig: {
      type: 'spot',
      color: '#ff0080',
      intensity: 3,
      distance: 12,
      angle: Math.PI / 4, // 45 degrés
      penumbra: 0.5,
      castShadow: true,
      shadowMapSize: 1024,
    },
    weight: 2.5,
  },
  {
    id: 'light-006',
    name: 'Néon LED Flexible',
    category: 'lighting',
    description: 'Tube néon LED flexible pour signalétique lumineuse',
    thumbnailUrl: '/modules/lighting/neon-flex.png',
    dimensions: { width: 2, height: 0.015, depth: 0.015 },
    defaultMaterial: {
      type: 'color',
      value: '#00ffff',
      emissive: '#00ffff',
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.9
    },
    price: 180,
    tags: ['néon', 'flexible', 'signalétique'],
    meshType: 'cylinder',
    customizable: { dimensions: true, material: false, color: true },
    lightConfig: {
      type: 'tube',
      color: '#00ffff',
      intensity: 2.5,
      distance: 2,
      width: 2,
      radius: 0.015,
      castShadow: false,
    },
    weight: 0.3,
  },
  {
    id: 'light-007',
    name: 'Lampe d\'Accentuation',
    category: 'lighting',
    description: 'Lampe pour mettre en valeur les produits',
    thumbnailUrl: '/modules/lighting/accent-light.png',
    dimensions: { width: 0.1, height: 0.25, depth: 0.1 },
    defaultMaterial: { type: 'color', value: '#333333', metalness: 0.8, roughness: 0.2 },
    price: 120,
    tags: ['accent', 'produit', 'vitrine'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false },
    lightConfig: {
      type: 'spot',
      color: '#fffacd',
      intensity: 2.5,
      distance: 3,
      angle: Math.PI / 8, // 22.5 degrés - faisceau étroit
      penumbra: 0.1,
      castShadow: true,
      shadowMapSize: 512,
    },
    weight: 1,
  },
  {
    id: 'light-008',
    name: 'Éclairage Sol LED',
    category: 'lighting',
    description: 'Spot LED encastré au sol pour éclairage ascendant',
    thumbnailUrl: '/modules/lighting/floor-light.png',
    dimensions: { width: 0.15, height: 0.05, depth: 0.15 },
    defaultMaterial: { type: 'color', value: '#888888', metalness: 0.6, roughness: 0.5 },
    price: 100,
    tags: ['sol', 'uplight', 'architectural'],
    meshType: 'cylinder',
    customizable: { dimensions: false, material: false, color: false },
    lightConfig: {
      type: 'spot',
      color: '#ffffff',
      intensity: 2,
      distance: 6,
      angle: Math.PI / 3, // 60 degrés - large
      penumbra: 0.4,
      castShadow: true,
      shadowMapSize: 512,
    },
    weight: 1.2,
  },
  {
    id: 'light-009',
    name: 'Lustre LED Suspendu',
    category: 'lighting',
    description: 'Lustre LED moderne pour stand premium',
    thumbnailUrl: '/modules/lighting/chandelier.png',
    dimensions: { width: 0.8, height: 0.6, depth: 0.8 },
    defaultMaterial: { type: 'color', value: '#d4af37', metalness: 1, roughness: 0.1 },
    price: 800,
    tags: ['lustre', 'premium', 'suspendu', 'design'],
    meshType: 'custom',
    customizable: { dimensions: false, material: true, color: true },
    lightConfig: {
      type: 'point',
      color: '#fff8dc',
      intensity: 3,
      distance: 8,
      decay: 1.5,
      castShadow: true,
      shadowMapSize: 2048,
    },
    weight: 12,
  },
  {
    id: 'light-010',
    name: 'Rampe LED Linéaire',
    category: 'lighting',
    description: 'Rampe LED linéaire pour éclairage uniforme',
    thumbnailUrl: '/modules/lighting/linear-led.png',
    dimensions: { width: 3, height: 0.05, depth: 0.05 },
    defaultMaterial: {
      type: 'color',
      value: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 1.8
    },
    price: 220,
    tags: ['rampe', 'linéaire', 'uniforme'],
    meshType: 'box',
    customizable: { dimensions: true, material: false, color: true },
    lightConfig: {
      type: 'rect',
      color: '#ffffff',
      intensity: 2.5,
      distance: 4,
      width: 3,
      height: 0.05,
      castShadow: false,
    },
    weight: 1.5,
  },
];

/**
 * Type de configuration pour les lumières Three.js
 */
export interface LightConfig {
  type: 'spot' | 'point' | 'directional' | 'rect' | 'tube';
  color: string;
  intensity: number;
  distance?: number;
  angle?: number; // Pour spot
  penumbra?: number; // Pour spot
  decay?: number; // Pour point
  width?: number; // Pour rect/tube
  height?: number; // Pour rect
  radius?: number; // Pour tube
  castShadow: boolean;
  shadowMapSize?: number;
}

/**
 * Préréglages d'ambiance lumineuse
 */
export const LIGHT_PRESETS = {
  exhibition: {
    name: 'Salon Professionnel',
    ambient: '#f5f5f5',
    ambientIntensity: 0.6,
    mainLight: '#ffffff',
    mainLightIntensity: 1.2,
  },
  modern: {
    name: 'Moderne & Tech',
    ambient: '#e0e8f0',
    ambientIntensity: 0.5,
    mainLight: '#ffffff',
    mainLightIntensity: 1.5,
  },
  warm: {
    name: 'Chaleureux',
    ambient: '#fff8e7',
    ambientIntensity: 0.7,
    mainLight: '#fffacd',
    mainLightIntensity: 1,
  },
  dramatic: {
    name: 'Dramatique',
    ambient: '#1a1a2e',
    ambientIntensity: 0.2,
    mainLight: '#ffffff',
    mainLightIntensity: 2,
  },
  colorful: {
    name: 'Coloré & Dynamique',
    ambient: '#2a2a40',
    ambientIntensity: 0.3,
    mainLight: '#ffffff',
    mainLightIntensity: 1,
  },
};
