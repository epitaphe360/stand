import { useRef, useMemo } from 'react';
import { PlacedModule } from '@/types/modules';
import { CeilingConfig, getSuspensionPoints, createWaveShape } from '@/lib/3d/ceiling-modules';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CeilingModule3DProps {
  module: PlacedModule;
  isSelected: boolean;
}

export default function CeilingModule3D({ module, isSelected }: CeilingModule3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ceilingConfig = (module as any).ceilingConfig as CeilingConfig | undefined;

  if (!ceilingConfig) {
    console.warn('CeilingModule3D: pas de ceilingConfig trouvée');
    return null;
  }

  const { width, height, depth } = module.dimensions;
  const color = module.material?.value as string || '#ffffff';

  // Calculer les points de suspension
  const suspensionPoints = useMemo(() => {
    return getSuspensionPoints(
      module.position,
      { width, height: ceilingConfig.suspensionHeight, depth },
      ceilingConfig.cableCount || 4
    );
  }, [module.position, width, depth, ceilingConfig.suspensionHeight, ceilingConfig.cableCount]);

  // Animation légère de balancement pour les plafonds suspendus
  useFrame((state) => {
    if (groupRef.current && ceilingConfig.type === 'tensile') {
      // Balancement très subtil
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[module.position.x, module.position.y, module.position.z]}
      rotation={[module.rotation.x, module.rotation.y, module.rotation.z]}
    >
      {/* Câbles de suspension */}
      {ceilingConfig.hasCables &&
        suspensionPoints.map((point, i) => (
          <mesh key={`cable-${i}`} position={[point.x - module.position.x, point.y - module.position.y - ceilingConfig.suspensionHeight / 2, point.z - module.position.z]}>
            <cylinderGeometry args={[0.005, 0.005, ceilingConfig.suspensionHeight, 8]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

      {/* Rendu du plafond selon le type */}
      {renderCeiling()}

      {/* Éclairage intégré */}
      {ceilingConfig.lightingIntegrated && (
        <pointLight
          position={[0, -0.2, 0]}
          color="#ffffff"
          intensity={2}
          distance={8}
          decay={2}
        />
      )}

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[width + 0.2, height + 0.2, depth + 0.2]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );

  function renderCeiling() {
    switch (ceilingConfig!.type) {
      case 'suspended':
      case 'floating':
        return renderSuspendedCeiling();

      case 'grid':
        return renderGridCeiling();

      case 'organic':
        return renderOrganicCeiling();

      case 'tensile':
        return renderTensileCeiling();

      default:
        return renderSuspendedCeiling();
    }
  }

  function renderSuspendedCeiling() {
    // Plafond rectangulaire ou circulaire simple
    const isCircular = module.id.includes('circular') || module.id.includes('ring');

    if (isCircular) {
      const radius = width / 2;
      return (
        <group>
          {/* Panneau circulaire */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[radius, radius, ceilingConfig!.thickness, 64]} />
            <meshStandardMaterial
              color={color}
              metalness={module.material?.metalness || 0.3}
              roughness={module.material?.roughness || 0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Bord lumineux si c'est un anneau */}
          {module.id.includes('ring') && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius - 0.15, 0.08, 16, 64]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          )}
        </group>
      );
    }

    // Plafond rectangulaire
    return (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, ceilingConfig!.thickness, depth]} />
        <meshStandardMaterial
          color={color}
          metalness={module.material?.metalness || 0.3}
          roughness={module.material?.roughness || 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  function renderGridCeiling() {
    const gridSize = 0.6; // Taille des dalles
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(depth / gridSize);

    return (
      <group>
        {/* Dalles de plafond */}
        {Array.from({ length: cols * rows }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);

          const x = -width / 2 + (col + 0.5) * (width / cols);
          const z = -depth / 2 + (row + 0.5) * (depth / rows);

          return (
            <mesh key={i} position={[x, 0, z]} castShadow receiveShadow>
              <boxGeometry args={[width / cols - 0.02, ceilingConfig!.thickness, depth / rows - 0.02]} />
              <meshStandardMaterial
                color={color}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
          );
        })}

        {/* Grille de support */}
        {/* Lignes verticales */}
        {Array.from({ length: cols + 1 }).map((_, i) => {
          const x = -width / 2 + i * (width / cols);
          return (
            <mesh key={`v${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.02, ceilingConfig!.thickness, depth]} />
              <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}

        {/* Lignes horizontales */}
        {Array.from({ length: rows + 1 }).map((_, i) => {
          const z = -depth / 2 + i * (depth / rows);
          return (
            <mesh key={`h${i}`} position={[0, 0, z]}>
              <boxGeometry args={[width, ceilingConfig!.thickness, 0.02]} />
              <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}
      </group>
    );
  }

  function renderOrganicCeiling() {
    // Forme organique (vagues, cloud, etc.)
    if (module.id.includes('wave')) {
      // Plafond en vagues
      const wavePoints = createWaveShape(width, depth, 0.3, 2);

      // Créer une géométrie à partir des points
      // Pour simplifier, on utilise plusieurs plans incurvés
      const segments = 20;

      return (
        <group>
          {Array.from({ length: segments }).map((_, i) => {
            const y = (i / segments - 0.5) * 0.6; // Amplitude de la vague
            const z = (i / segments - 0.5) * depth;

            return (
              <mesh key={i} position={[0, y, z]} castShadow receiveShadow>
                <planeGeometry args={[width, depth / segments, 10, 1]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.4}
                  roughness={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </group>
      );
    }

    // Cloud (nuage)
    if (module.id.includes('cloud')) {
      return (
        <group>
          {/* Formes de nuages avec plusieurs sphères */}
          {[
            [0, 0, 0, 1.2],
            [-0.8, -0.2, 0.3, 0.9],
            [0.7, -0.1, -0.2, 0.8],
            [0, 0.3, 0.5, 0.7],
            [-0.4, 0.2, -0.4, 0.6],
          ].map(([x, y, z, scale], i) => (
            <mesh key={i} position={[x, y, z]} scale={scale} castShadow>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0}
                roughness={1}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
        </group>
      );
    }

    // Défaut: forme organique arrondie
    return (
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[width / 2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  function renderTensileCeiling() {
    // Toile tendue - forme organique avec courbe douce
    return (
      <group>
        {/* Surface de toile avec courbure */}
        <mesh castShadow receiveShadow>
          <planeGeometry args={[width, depth, 20, 20]} />
          <meshStandardMaterial
            color={color}
            metalness={0}
            roughness={0.95}
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Effet de plis subtils */}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = (i / 4 - 0.5) * width;
          return (
            <mesh key={i} position={[x, -0.1 - i * 0.02, 0]}>
              <cylinderGeometry args={[0.01, 0.01, depth, 8]} />
              <meshStandardMaterial
                color={color}
                metalness={0}
                roughness={1}
                transparent
                opacity={0.3}
              />
            </mesh>
          );
        })}
      </group>
    );
  }
}
