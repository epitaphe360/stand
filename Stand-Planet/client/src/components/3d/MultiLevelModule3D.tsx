import { useRef } from 'react';
import { PlacedModule } from '@/types/modules';
import { LevelConfig, StairConfig } from '@/lib/3d/multi-level';
import * as THREE from 'three';

interface MultiLevelModule3DProps {
  module: PlacedModule;
  isSelected: boolean;
}

export default function MultiLevelModule3D({ module, isSelected }: MultiLevelModule3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { width, height, depth } = module.dimensions;
  const levelConfig = (module as any).levelConfig as LevelConfig | undefined;
  const stairConfig = (module as any).stairConfig as StairConfig | undefined;

  // Couleur du matériau
  const color = module.material.value as string || '#d0d0d0';
  const metalColor = '#708090';

  // Rendu selon le type
  if (stairConfig) {
    // ESCALIER
    return (
      <group
        ref={groupRef}
        position={[module.position.x, module.position.y, module.position.z]}
      >
        {/* Marches */}
        {Array.from({ length: stairConfig.steps }).map((_, i) => {
          const stepY = i * stairConfig.stepHeight;
          const stepZ = i * stairConfig.stepDepth - (stairConfig.steps * stairConfig.stepDepth) / 2;

          return (
            <group key={i}>
              {/* Marche */}
              <mesh
                position={[0, stepY + stairConfig.stepHeight / 2, stepZ]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[stairConfig.width, stairConfig.stepHeight, stairConfig.stepDepth]} />
                <meshStandardMaterial
                  color={color}
                  metalness={module.material.metalness || 0.7}
                  roughness={module.material.roughness || 0.3}
                />
              </mesh>

              {/* Surface antidérapante */}
              <mesh position={[0, stepY + stairConfig.stepHeight, stepZ]}>
                <boxGeometry args={[stairConfig.width - 0.02, 0.005, stairConfig.stepDepth - 0.02]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
              </mesh>
            </group>
          );
        })}

        {/* Rampe gauche */}
        {stairConfig.hasHandrail && (
          <>
            <mesh
              position={[-stairConfig.width / 2 - 0.05, height / 2, -stairConfig.stepDepth / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, height, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Main courante gauche */}
            <mesh
              position={[-stairConfig.width / 2 - 0.05, height, 0]}
              rotation={[0, 0, Math.atan2(height, depth)]}
            >
              <cylinderGeometry args={[0.04, 0.04, depth * 1.1, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        )}

        {/* Rampe droite */}
        {stairConfig.hasHandrail && (
          <>
            <mesh
              position={[stairConfig.width / 2 + 0.05, height / 2, -stairConfig.stepDepth / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, height, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Main courante droite */}
            <mesh
              position={[stairConfig.width / 2 + 0.05, height, 0]}
              rotation={[0, 0, Math.atan2(height, depth)]}
            >
              <cylinderGeometry args={[0.04, 0.04, depth * 1.1, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
            </mesh>
          </>
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
  }

  if (levelConfig) {
    // PLATEFORME / MEZZANINE / PODIUM
    return (
      <group
        ref={groupRef}
        position={[module.position.x, module.position.y + height / 2, module.position.z]}
      >
        {/* Structure principale (plancher) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={color}
            metalness={module.material.metalness || 0.1}
            roughness={module.material.roughness || 0.8}
          />
        </mesh>

        {/* Surface de marche antidérapante */}
        <mesh position={[0, height / 2 + 0.01, 0]}>
          <boxGeometry args={[width - 0.1, 0.01, depth - 0.1]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
        </mesh>

        {/* Poutres de renfort (dessous) */}
        {Array.from({ length: 3 }).map((_, i) => {
          const beamZ = (i - 1) * (depth / 3);
          return (
            <mesh key={i} position={[0, -height / 2 + 0.05, beamZ]} castShadow>
              <boxGeometry args={[width - 0.2, 0.1, 0.15]} />
              <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
            </mesh>
          );
        })}

        {/* Pieds de support */}
        {levelConfig.type !== 'podium' && height > 0.5 && (
          <>
            {[
              [-width / 2 + 0.2, -depth / 2 + 0.2],
              [width / 2 - 0.2, -depth / 2 + 0.2],
              [-width / 2 + 0.2, depth / 2 - 0.2],
              [width / 2 - 0.2, depth / 2 - 0.2],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, -height / 2, z]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, height, 16]} />
                <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </>
        )}

        {/* Garde-corps */}
        {levelConfig.hasRailing && (
          <>
            {/* Garde-corps avant */}
            {renderRailing([0, height / 2 + 0.55, depth / 2], width, 0)}

            {/* Garde-corps arrière */}
            {renderRailing([0, height / 2 + 0.55, -depth / 2], width, 0)}

            {/* Garde-corps gauche */}
            {renderRailing([-width / 2, height / 2 + 0.55, 0], depth, Math.PI / 2)}

            {/* Garde-corps droite */}
            {renderRailing([width / 2, height / 2 + 0.55, 0], depth, Math.PI / 2)}
          </>
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
  }

  // GARDE-CORPS SEUL
  if (module.id.includes('level-003')) {
    return (
      <group position={[module.position.x, module.position.y + height / 2, module.position.z]}>
        {renderRailing([0, 0, 0], width, 0)}

        {isSelected && (
          <mesh>
            <boxGeometry args={[width + 0.2, height + 0.2, depth + 0.2]} />
            <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    );
  }

  // RAMPE PMR
  if (module.id.includes('level-006')) {
    return (
      <group position={[module.position.x, module.position.y, module.position.z]}>
        {/* Surface de la rampe */}
        <mesh
          rotation={[Math.atan2(height, depth), 0, 0]}
          position={[0, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, 0.05, Math.sqrt(depth * depth + height * height)]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>

        {/* Bords latéraux */}
        {[-width / 2, width / 2].map((x, i) => (
          <mesh
            key={i}
            position={[x, height / 2, 0]}
            rotation={[Math.atan2(height, depth), 0, 0]}
          >
            <boxGeometry args={[0.05, 0.1, Math.sqrt(depth * depth + height * height)]} />
            <meshStandardMaterial color="#f39c12" metalness={0.3} roughness={0.7} />
          </mesh>
        ))}

        {isSelected && (
          <mesh>
            <boxGeometry args={[width + 0.2, height + 0.2, depth + 0.2]} />
            <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    );
  }

  // Fallback
  return null;

  // Fonction helper pour rendre un garde-corps
  function renderRailing(
    position: [number, number, number],
    railingWidth: number,
    rotation: number
  ) {
    return (
      <group position={position} rotation={[0, rotation, 0]}>
        {/* Main courante */}
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, railingWidth, 16]} />
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Montants verticaux */}
        {Array.from({ length: Math.floor(railingWidth / 0.5) + 1 }).map((_, i) => {
          const x = (i * 0.5) - railingWidth / 2;
          return (
            <mesh key={i} position={[x, -0.55, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.1, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}

        {/* Lisse intermédiaire */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.03, 0.03, railingWidth, 16]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    );
  }
}
