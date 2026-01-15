import { useRef, useMemo } from 'react';
import { PlacedModule } from '@/types/modules';
import { CurveConfig, createBezierCurve, createArcCurve, createSplineCurve, getDefaultExtrudeSettings } from '@/lib/3d/curved-modules';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CurvedModule3DProps {
  module: PlacedModule;
  isSelected: boolean;
}

export default function CurvedModule3D({ module, isSelected }: CurvedModule3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const curveConfig = (module as any).curveConfig as CurveConfig | undefined;

  if (!curveConfig) {
    console.warn('CurvedModule3D: pas de curveConfig trouvée');
    return null;
  }

  const { width, height, depth } = module.dimensions;
  const color = module.material?.value as string || '#ffffff';

  // Générer la géométrie en fonction du type de courbe
  const geometry = useMemo(() => {
    try {
      switch (curveConfig.type) {
        case 'arc':
          return createArcGeometry(curveConfig);
        case 'bezier':
          return createBezierGeometry(curveConfig);
        case 'circular':
          return createCircularGeometry(curveConfig);
        case 'spline':
          return createSplineGeometry(curveConfig);
        default:
          return new THREE.BoxGeometry(width, height, depth);
      }
    } catch (error) {
      console.error('Erreur création géométrie courbe:', error);
      return new THREE.BoxGeometry(width, height, depth);
    }
  }, [curveConfig, width, height, depth]);

  return (
    <group
      ref={groupRef}
      position={[module.position.x, module.position.y + height / 2, module.position.z]}
      rotation={[module.rotation.x, module.rotation.y, module.rotation.z]}
    >
      {/* Mesh principal */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={module.material?.metalness || 0.2}
          roughness={module.material?.roughness || 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[width + 0.2, height + 0.2, depth + 0.2]} />
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Créer géométrie pour arc circulaire
 */
function createArcGeometry(config: CurveConfig): THREE.BufferGeometry {
  const radius = config.radius || 3;
  const startAngle = config.startAngle || 0;
  const endAngle = config.endAngle || Math.PI;
  const extrudeHeight = config.extrudeHeight || 2.5;
  const extrudeDepth = config.extrudeDepth || 0.1;

  // Si c'est un tube/arche (avec tubeRadius)
  if (config.tubeRadius !== undefined) {
    const curve = new THREE.EllipseCurve(
      0, 0,                    // center
      radius, radius,          // xRadius, yRadius
      startAngle, endAngle,    // start, end angle
      false,                   // clockwise
      0                        // rotation
    );

    const points = curve.getPoints(config.tubularSegments || 32);
    const points3D = points.map(p => new THREE.Vector3(p.x, p.y, 0));
    const curve3D = new THREE.CatmullRomCurve3(points3D);

    return new THREE.TubeGeometry(
      curve3D,
      config.tubularSegments || 32,
      config.tubeRadius,
      config.radialSegments || 16,
      false
    );
  }

  // Sinon, créer un mur courbe avec extrusion
  const arcCurve = new THREE.EllipseCurve(
    0, 0,
    radius, radius,
    startAngle, endAngle,
    false,
    0
  );

  const points = arcCurve.getPoints(64);
  const shape = new THREE.Shape(points);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: extrudeDepth,
    bevelEnabled: config.bevelEnabled || false,
    bevelThickness: config.bevelThickness || 0.02,
    bevelSize: config.bevelSize || 0.02,
    bevelSegments: 3,
    curveSegments: 64,
    steps: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Rotation pour que le mur soit vertical
  geometry.rotateX(Math.PI / 2);

  // Mise à l'échelle en hauteur
  if (extrudeHeight) {
    geometry.scale(1, extrudeHeight / extrudeDepth, 1);
  }

  return geometry;
}

/**
 * Créer géométrie pour courbe de Bézier
 */
function createBezierGeometry(config: CurveConfig): THREE.BufferGeometry {
  if (!config.controlPoints || config.controlPoints.length < 3) {
    console.warn('Pas assez de points de contrôle pour courbe Bézier');
    return new THREE.BoxGeometry(1, 1, 1);
  }

  const extrudeHeight = config.extrudeHeight || 2.5;
  const extrudeDepth = config.extrudeDepth || 0.1;

  // Créer la courbe 2D (dans le plan XZ)
  let curve2D: THREE.Curve<THREE.Vector2>;

  if (config.controlPoints.length === 3) {
    curve2D = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(config.controlPoints[0].x, config.controlPoints[0].z),
      new THREE.Vector2(config.controlPoints[1].x, config.controlPoints[1].z),
      new THREE.Vector2(config.controlPoints[2].x, config.controlPoints[2].z)
    );
  } else {
    curve2D = new THREE.CubicBezierCurve(
      new THREE.Vector2(config.controlPoints[0].x, config.controlPoints[0].z),
      new THREE.Vector2(config.controlPoints[1].x, config.controlPoints[1].z),
      new THREE.Vector2(config.controlPoints[2].x, config.controlPoints[2].z),
      new THREE.Vector2(config.controlPoints[3].x, config.controlPoints[3].z)
    );
  }

  const points = curve2D.getPoints(64);
  const shape = new THREE.Shape(points);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: extrudeDepth,
    bevelEnabled: config.bevelEnabled || false,
    bevelThickness: config.bevelThickness || 0.02,
    bevelSize: config.bevelSize || 0.02,
    bevelSegments: 3,
    curveSegments: 64,
    steps: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Rotation pour mur vertical
  geometry.rotateX(Math.PI / 2);

  // Mise à l'échelle en hauteur
  if (extrudeHeight) {
    geometry.scale(1, extrudeHeight / extrudeDepth, 1);
  }

  return geometry;
}

/**
 * Créer géométrie circulaire (360°)
 */
function createCircularGeometry(config: CurveConfig): THREE.BufferGeometry {
  const radius = config.radius || 2;
  const extrudeHeight = config.extrudeHeight || 2.5;
  const extrudeDepth = config.extrudeDepth || 0.1;

  // Créer cercle complet
  const circleShape = new THREE.Shape();
  circleShape.absarc(0, 0, radius, 0, Math.PI * 2, false);

  // Créer le trou intérieur pour avoir un mur circulaire
  const holeRadius = radius - extrudeDepth;
  const holePath = new THREE.Path();
  holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  circleShape.holes.push(holePath);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: extrudeHeight,
    bevelEnabled: false,
    curveSegments: 64,
    steps: 1,
  };

  const geometry = new THREE.ExtrudeGeometry(circleShape, extrudeSettings);

  // Rotation pour que le mur soit vertical
  geometry.rotateX(Math.PI / 2);

  return geometry;
}

/**
 * Créer géométrie spline (pour colonnes torsadées, etc.)
 */
function createSplineGeometry(config: CurveConfig): THREE.BufferGeometry {
  if (!config.controlPoints || config.controlPoints.length < 2) {
    console.warn('Pas assez de points pour spline');
    return new THREE.BoxGeometry(1, 1, 1);
  }

  const curve3D = createSplineCurve(config.controlPoints);

  if (!curve3D) {
    return new THREE.BoxGeometry(1, 1, 1);
  }

  return new THREE.TubeGeometry(
    curve3D,
    config.tubularSegments || 64,
    config.tubeRadius || 0.2,
    config.radialSegments || 16,
    config.closed || false
  );
}
