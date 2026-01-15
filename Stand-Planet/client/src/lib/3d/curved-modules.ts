import { ModuleBase } from '@/types/modules';
import * as THREE from 'three';

/**
 * Modules avec formes courbes (murs arrondis, comptoirs, arches)
 */

/**
 * Configuration pour modules courbes
 */
export interface CurveConfig {
  type: 'arc' | 'bezier' | 'circular' | 'spline' | 'custom';

  // Pour arc circulaire
  radius?: number;
  startAngle?: number; // En radians
  endAngle?: number;

  // Pour courbe de Bézier
  controlPoints?: Array<{ x: number; y: number; z: number }>;

  // Pour extrusion
  extrudeDepth?: number;
  extrudeHeight?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;

  // Pour tube
  tubularSegments?: number;
  radialSegments?: number;
  tubeRadius?: number;

  // Closed curve
  closed?: boolean;
}

export const CURVED_MODULES: ModuleBase[] = [
  // === MURS COURBES ===
  {
    id: 'curve-001',
    name: 'Mur Courbe Arc 180°',
    category: 'walls',
    description: 'Mur incurvé semi-circulaire de 3m de rayon',
    thumbnailUrl: '/modules/curves/curved-wall-180.png',
    dimensions: { width: 6, height: 2.5, depth: 3 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.1, roughness: 0.9 },
    price: 800,
    tags: ['mur', 'courbe', 'arc', 'circulaire'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 120,
    stackable: false,
    curveConfig: {
      type: 'arc',
      radius: 3,
      startAngle: 0,
      endAngle: Math.PI, // 180°
      extrudeHeight: 2.5,
      extrudeDepth: 0.1,
      bevelEnabled: false,
    },
  },
  {
    id: 'curve-002',
    name: 'Mur Courbe Arc 90°',
    category: 'walls',
    description: 'Mur d\'angle courbe quart de cercle',
    thumbnailUrl: '/modules/curves/curved-wall-90.png',
    dimensions: { width: 3, height: 2.5, depth: 3 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.1, roughness: 0.9 },
    price: 500,
    tags: ['mur', 'courbe', 'angle', 'corner'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 80,
    stackable: false,
    curveConfig: {
      type: 'arc',
      radius: 3,
      startAngle: 0,
      endAngle: Math.PI / 2, // 90°
      extrudeHeight: 2.5,
      extrudeDepth: 0.1,
      bevelEnabled: false,
    },
  },
  {
    id: 'curve-003',
    name: 'Mur Courbe Serpentin',
    category: 'walls',
    description: 'Mur en forme de S (courbe de Bézier)',
    thumbnailUrl: '/modules/curves/curved-wall-s.png',
    dimensions: { width: 6, height: 2.5, depth: 2 },
    defaultMaterial: { type: 'color', value: '#f5f5f5', metalness: 0.2, roughness: 0.8 },
    price: 950,
    tags: ['mur', 'courbe', 'serpentin', 's-curve', 'design'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 150,
    stackable: false,
    curveConfig: {
      type: 'bezier',
      controlPoints: [
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 0, z: 1 },
        { x: 4, y: 0, z: -1 },
        { x: 6, y: 0, z: 0 },
      ],
      extrudeHeight: 2.5,
      extrudeDepth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
    },
  },
  {
    id: 'curve-004',
    name: 'Mur Circulaire Complet',
    category: 'walls',
    description: 'Mur circulaire fermé (stand îlot)',
    thumbnailUrl: '/modules/curves/curved-wall-360.png',
    dimensions: { width: 4, height: 2.5, depth: 4 },
    defaultMaterial: { type: 'color', value: '#e8e8e8', metalness: 0.15, roughness: 0.85 },
    price: 1200,
    tags: ['mur', 'circulaire', 'îlot', 'fermé', '360'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 180,
    stackable: false,
    curveConfig: {
      type: 'circular',
      radius: 2,
      startAngle: 0,
      endAngle: Math.PI * 2, // 360°
      extrudeHeight: 2.5,
      extrudeDepth: 0.1,
      closed: true,
    },
  },

  // === COMPTOIRS COURBES ===
  {
    id: 'curve-005',
    name: 'Comptoir Courbe Arrondi',
    category: 'furniture',
    description: 'Comptoir d\'accueil avec façade incurvée',
    thumbnailUrl: '/modules/curves/curved-counter.png',
    dimensions: { width: 3, height: 1.1, depth: 1.5 },
    defaultMaterial: { type: 'color', value: '#2c3e50', metalness: 0.6, roughness: 0.3 },
    price: 1100,
    tags: ['comptoir', 'accueil', 'courbe', 'réception'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 95,
    stackable: false,
    curveConfig: {
      type: 'arc',
      radius: 2,
      startAngle: -Math.PI / 4,
      endAngle: Math.PI / 4,
      extrudeHeight: 1.1,
      extrudeDepth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
    },
  },
  {
    id: 'curve-006',
    name: 'Comptoir Circulaire',
    category: 'furniture',
    description: 'Comptoir circulaire 360° avec éclairage LED',
    thumbnailUrl: '/modules/curves/circular-counter.png',
    dimensions: { width: 2.5, height: 1.1, depth: 2.5 },
    defaultMaterial: { type: 'color', value: '#34495e', metalness: 0.7, roughness: 0.2 },
    price: 1800,
    tags: ['comptoir', 'circulaire', 'îlot', 'premium', 'led'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 120,
    stackable: false,
    curveConfig: {
      type: 'circular',
      radius: 1.25,
      startAngle: 0,
      endAngle: Math.PI * 2,
      extrudeHeight: 1.1,
      extrudeDepth: 0.3,
      closed: true,
    },
  },

  // === ARCHES ===
  {
    id: 'curve-007',
    name: 'Arche d\'Entrée',
    category: 'structure',
    description: 'Arche décorative pour délimiter l\'espace',
    thumbnailUrl: '/modules/curves/arch.png',
    dimensions: { width: 3, height: 3, depth: 0.3 },
    defaultMaterial: { type: 'color', value: '#bdc3c7', metalness: 0.4, roughness: 0.6 },
    price: 650,
    tags: ['arche', 'entrée', 'décoration', 'portique'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 75,
    stackable: false,
    curveConfig: {
      type: 'arc',
      radius: 1.5,
      startAngle: 0,
      endAngle: Math.PI,
      extrudeDepth: 0.3,
      tubeRadius: 0.15,
      tubularSegments: 32,
      radialSegments: 16,
    },
  },

  // === COLONNES COURBES ===
  {
    id: 'curve-008',
    name: 'Colonne Torsadée',
    category: 'structure',
    description: 'Colonne décorative avec forme hélicoïdale',
    thumbnailUrl: '/modules/curves/twisted-column.png',
    dimensions: { width: 0.4, height: 3, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#95a5a6', metalness: 0.8, roughness: 0.2 },
    price: 450,
    tags: ['colonne', 'torsade', 'décoration', 'structure'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 50,
    stackable: false,
    curveConfig: {
      type: 'spline',
      controlPoints: [
        { x: 0, y: 0, z: 0 },
        { x: 0.2, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 },
        { x: -0.2, y: 3, z: 0 },
      ],
      tubeRadius: 0.2,
      tubularSegments: 64,
      radialSegments: 16,
      closed: false,
    },
  },

  // === ÉTAGÈRES COURBES ===
  {
    id: 'curve-009',
    name: 'Étagère Murale Courbe',
    category: 'furniture',
    description: 'Étagère design avec forme ondulée',
    thumbnailUrl: '/modules/curves/curved-shelf.png',
    dimensions: { width: 2.5, height: 0.3, depth: 0.4 },
    defaultMaterial: { type: 'color', value: '#ecf0f1', metalness: 0.3, roughness: 0.7 },
    price: 280,
    tags: ['étagère', 'courbe', 'design', 'murale'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 15,
    stackable: true,
    curveConfig: {
      type: 'bezier',
      controlPoints: [
        { x: 0, y: 0, z: 0 },
        { x: 0.8, y: 0.1, z: 0 },
        { x: 1.7, y: -0.1, z: 0 },
        { x: 2.5, y: 0, z: 0 },
      ],
      extrudeDepth: 0.4,
      extrudeHeight: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
    },
  },

  // === PLAFONDS COURBES ===
  {
    id: 'curve-010',
    name: 'Plafond Voûté',
    category: 'structure',
    description: 'Plafond en forme de voûte (demi-cylindre)',
    thumbnailUrl: '/modules/curves/vaulted-ceiling.png',
    dimensions: { width: 4, height: 2, depth: 6 },
    defaultMaterial: { type: 'color', value: '#ffffff', metalness: 0.2, roughness: 0.9 },
    price: 1500,
    tags: ['plafond', 'voûte', 'courbe', 'architecture'],
    meshType: 'custom',
    customizable: { dimensions: true, material: true, color: true },
    weight: 180,
    stackable: false,
    curveConfig: {
      type: 'arc',
      radius: 2,
      startAngle: 0,
      endAngle: Math.PI,
      extrudeDepth: 6,
      extrudeHeight: 0.05,
    },
  },
];

/**
 * Helper: Créer une courbe de Bézier à partir de points de contrôle
 */
export function createBezierCurve(points: Array<{ x: number; y: number; z: number }>): THREE.CubicBezierCurve3 | THREE.QuadraticBezierCurve3 | null {
  if (points.length === 3) {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(points[0].x, points[0].y, points[0].z),
      new THREE.Vector3(points[1].x, points[1].y, points[1].z),
      new THREE.Vector3(points[2].x, points[2].y, points[2].z)
    );
  } else if (points.length === 4) {
    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(points[0].x, points[0].y, points[0].z),
      new THREE.Vector3(points[1].x, points[1].y, points[1].z),
      new THREE.Vector3(points[2].x, points[2].y, points[2].z),
      new THREE.Vector3(points[3].x, points[3].y, points[3].z)
    );
  }
  return null;
}

/**
 * Helper: Créer un arc circulaire
 */
export function createArcCurve(
  radius: number,
  startAngle: number,
  endAngle: number,
  height: number = 0
): THREE.EllipseCurve {
  return new THREE.EllipseCurve(
    0, height,           // center x, y
    radius, radius,      // xRadius, yRadius
    startAngle, endAngle, // start, end angle
    false,               // clockwise
    0                    // rotation
  );
}

/**
 * Helper: Créer une spline catmull-rom
 */
export function createSplineCurve(points: Array<{ x: number; y: number; z: number }>): THREE.CatmullRomCurve3 {
  const vectors = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
  return new THREE.CatmullRomCurve3(vectors);
}

/**
 * Helper: Créer un shape 2D à partir d'une courbe (pour extrusion)
 */
export function createShapeFromCurve(curve: THREE.Curve<THREE.Vector2>): THREE.Shape {
  const points = curve.getPoints(50);
  const shape = new THREE.Shape(points);
  return shape;
}

/**
 * Helper: Obtenir les paramètres d'extrusion par défaut
 */
export function getDefaultExtrudeSettings(config: CurveConfig): THREE.ExtrudeGeometryOptions {
  return {
    depth: config.extrudeDepth || 0.1,
    bevelEnabled: config.bevelEnabled || false,
    bevelThickness: config.bevelThickness || 0.05,
    bevelSize: config.bevelSize || 0.03,
    bevelSegments: 3,
    curveSegments: 64,
    steps: 1,
  };
}
