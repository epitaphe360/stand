import * as THREE from 'three';
import { CurveConfig } from './curved-modules';

/**
 * Utilitaires pour créer et manipuler des courbes personnalisées
 */

export interface CurvePoint {
  x: number;
  y: number;
  z: number;
}

export interface CurvePreset {
  name: string;
  description: string;
  controlPoints: CurvePoint[];
  type: CurveConfig['type'];
}

/**
 * Créer une courbe personnalisée
 */
export class CurveBuilder {
  private points: CurvePoint[] = [];
  private curveType: CurveConfig['type'] = 'bezier';

  constructor(type: CurveConfig['type'] = 'bezier') {
    this.curveType = type;
  }

  /**
   * Ajouter un point de contrôle
   */
  addPoint(x: number, y: number, z: number = 0): this {
    this.points.push({ x, y, z });
    return this;
  }

  /**
   * Définir tous les points d'un coup
   */
  setPoints(points: CurvePoint[]): this {
    this.points = [...points];
    return this;
  }

  /**
   * Obtenir les points
   */
  getPoints(): CurvePoint[] {
    return [...this.points];
  }

  /**
   * Supprimer un point
   */
  removePoint(index: number): this {
    if (index >= 0 && index < this.points.length) {
      this.points.splice(index, 1);
    }
    return this;
  }

  /**
   * Déplacer un point
   */
  movePoint(index: number, x: number, y: number, z: number = 0): this {
    if (index >= 0 && index < this.points.length) {
      this.points[index] = { x, y, z };
    }
    return this;
  }

  /**
   * Créer la courbe Three.js
   */
  build(): THREE.Curve<THREE.Vector3> | null {
    if (this.points.length < 2) {
      console.warn('CurveBuilder: au moins 2 points requis');
      return null;
    }

    const vectors = this.points.map(p => new THREE.Vector3(p.x, p.y, p.z));

    switch (this.curveType) {
      case 'bezier':
        if (this.points.length === 3) {
          return new THREE.QuadraticBezierCurve3(vectors[0], vectors[1], vectors[2]);
        } else if (this.points.length === 4) {
          return new THREE.CubicBezierCurve3(vectors[0], vectors[1], vectors[2], vectors[3]);
        }
        // Fallback to spline for other lengths
        return new THREE.CatmullRomCurve3(vectors, false);

      case 'spline':
        return new THREE.CatmullRomCurve3(vectors, false);

      case 'arc':
      case 'circular':
        // Pour arc, on utilise les 2 premiers points pour définir rayon et angles
        console.warn('Arc curves should use createArcCurve() directly');
        return new THREE.CatmullRomCurve3(vectors, false);

      default:
        return new THREE.CatmullRomCurve3(vectors, false);
    }
  }

  /**
   * Obtenir la configuration pour CurveConfig
   */
  toConfig(): Partial<CurveConfig> {
    return {
      type: this.curveType,
      controlPoints: this.points,
    };
  }

  /**
   * Créer à partir d'une config existante
   */
  static fromConfig(config: CurveConfig): CurveBuilder {
    const builder = new CurveBuilder(config.type);
    if (config.controlPoints) {
      builder.setPoints(config.controlPoints);
    }
    return builder;
  }
}

/**
 * Calculer la longueur d'une courbe
 */
export function getCurveLength(curve: THREE.Curve<THREE.Vector3>): number {
  return curve.getLength();
}

/**
 * Obtenir des points équidistants le long d'une courbe
 */
export function getEquidistantPoints(
  curve: THREE.Curve<THREE.Vector3>,
  count: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    points.push(curve.getPoint(t));
  }
  return points;
}

/**
 * Calculer la bounding box d'une courbe
 */
export function getCurveBounds(curve: THREE.Curve<THREE.Vector3>): THREE.Box3 {
  const points = curve.getPoints(100);
  const box = new THREE.Box3();
  points.forEach(p => box.expandByPoint(p));
  return box;
}

/**
 * Lisser une courbe (ajouter plus de points de contrôle)
 */
export function smoothCurve(points: CurvePoint[], factor: number = 2): CurvePoint[] {
  if (points.length < 2) return points;

  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(p.x, p.y, p.z))
  );

  const smoothedPoints = curve.getPoints(points.length * factor);
  return smoothedPoints.map(p => ({ x: p.x, y: p.y, z: p.z }));
}

/**
 * Simplifier une courbe (réduire le nombre de points)
 */
export function simplifyCurve(points: CurvePoint[], tolerance: number = 0.1): CurvePoint[] {
  if (points.length <= 2) return points;

  // Algorithme de Douglas-Peucker simplifié
  const simplified: CurvePoint[] = [points[0]];

  let lastPoint = points[0];
  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const distance = Math.sqrt(
      Math.pow(current.x - lastPoint.x, 2) +
      Math.pow(current.y - lastPoint.y, 2) +
      Math.pow(current.z - lastPoint.z, 2)
    );

    if (distance > tolerance) {
      simplified.push(current);
      lastPoint = current;
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
}

/**
 * Inverser la direction d'une courbe
 */
export function reverseCurve(points: CurvePoint[]): CurvePoint[] {
  return [...points].reverse();
}

/**
 * Connecter deux courbes
 */
export function connectCurves(points1: CurvePoint[], points2: CurvePoint[]): CurvePoint[] {
  return [...points1, ...points2];
}

/**
 * Créer une courbe miroir
 */
export function mirrorCurve(points: CurvePoint[], axis: 'x' | 'y' | 'z'): CurvePoint[] {
  return points.map(p => {
    switch (axis) {
      case 'x': return { ...p, x: -p.x };
      case 'y': return { ...p, y: -p.y };
      case 'z': return { ...p, z: -p.z };
      default: return p;
    }
  });
}

/**
 * Transformer une courbe (translation, rotation, échelle)
 */
export function transformCurve(
  points: CurvePoint[],
  translation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 }
): CurvePoint[] {
  return points.map(p => ({
    x: p.x * scale.x + translation.x,
    y: p.y * scale.y + translation.y,
    z: p.z * scale.z + translation.z,
  }));
}

/**
 * Presets de courbes prédéfinies
 */
export const CURVE_PRESETS: CurvePreset[] = [
  {
    name: 'S-Curve Simple',
    description: 'Courbe en S douce',
    type: 'bezier',
    controlPoints: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 1 },
      { x: 2, y: 0, z: -1 },
      { x: 3, y: 0, z: 0 },
    ],
  },
  {
    name: 'Arc Doux',
    description: 'Arc régulier avec courbure douce',
    type: 'bezier',
    controlPoints: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0.5 },
      { x: 2, y: 0, z: 0 },
    ],
  },
  {
    name: 'Vague',
    description: 'Forme ondulée',
    type: 'spline',
    controlPoints: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0.5 },
      { x: 2, y: 0, z: 0 },
      { x: 3, y: 0, z: -0.5 },
      { x: 4, y: 0, z: 0 },
    ],
  },
  {
    name: 'U-Shape',
    description: 'Forme en U',
    type: 'bezier',
    controlPoints: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: -2 },
      { x: 3, y: 0, z: -2 },
      { x: 3, y: 0, z: 0 },
    ],
  },
  {
    name: 'Spirale Simple',
    description: 'Début de spirale',
    type: 'spline',
    controlPoints: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0.5, z: 0 },
      { x: 0.5, y: 1, z: 0.5 },
      { x: 0, y: 1.5, z: 1 },
    ],
  },
];

/**
 * Obtenir un preset par nom
 */
export function getPreset(name: string): CurvePreset | undefined {
  return CURVE_PRESETS.find(p => p.name === name);
}

/**
 * Créer une courbe à partir d'un preset
 */
export function createFromPreset(presetName: string): CurveBuilder | null {
  const preset = getPreset(presetName);
  if (!preset) return null;

  const builder = new CurveBuilder(preset.type);
  builder.setPoints(preset.controlPoints);
  return builder;
}

/**
 * Interpoler entre deux courbes (morphing)
 */
export function interpolateCurves(
  points1: CurvePoint[],
  points2: CurvePoint[],
  t: number // 0 = courbe 1, 1 = courbe 2
): CurvePoint[] {
  // Les courbes doivent avoir le même nombre de points
  const minLength = Math.min(points1.length, points2.length);
  const result: CurvePoint[] = [];

  for (let i = 0; i < minLength; i++) {
    result.push({
      x: points1[i].x + (points2[i].x - points1[i].x) * t,
      y: points1[i].y + (points2[i].y - points1[i].y) * t,
      z: points1[i].z + (points2[i].z - points1[i].z) * t,
    });
  }

  return result;
}

/**
 * Convertir une courbe 3D en courbe 2D (projection sur plan XZ)
 */
export function projectToXZ(points: CurvePoint[]): Array<{ x: number; z: number }> {
  return points.map(p => ({ x: p.x, z: p.z }));
}

/**
 * Détecter si une courbe est fermée
 */
export function isCurveClosed(points: CurvePoint[], tolerance: number = 0.01): boolean {
  if (points.length < 3) return false;

  const first = points[0];
  const last = points[points.length - 1];

  const distance = Math.sqrt(
    Math.pow(last.x - first.x, 2) +
    Math.pow(last.y - first.y, 2) +
    Math.pow(last.z - first.z, 2)
  );

  return distance < tolerance;
}

/**
 * Fermer une courbe (ajouter un point final qui rejoint le premier)
 */
export function closeCurve(points: CurvePoint[]): CurvePoint[] {
  if (isCurveClosed(points)) return points;
  return [...points, points[0]];
}
