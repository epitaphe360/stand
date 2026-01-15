import { useRef } from 'react';
import { PlacedModule } from '@/types/modules';
import { LightConfig } from '@/lib/3d/lighting-modules';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LightModule3DProps {
  module: PlacedModule;
  isSelected: boolean;
}

export default function LightModule3D({ module, isSelected }: LightModule3DProps) {
  const lightRef = useRef<any>(null);
  const helperRef = useRef<any>(null);

  // Configuration de la lumière depuis le module
  const lightConfig = (module as any).lightConfig as LightConfig | undefined;

  if (!lightConfig) {
    // Si pas de config, rendre juste un mesh basique
    return (
      <mesh position={[module.position.x, module.position.y + module.dimensions.height / 2, module.position.z]}>
        <boxGeometry args={[module.dimensions.width, module.dimensions.height, module.dimensions.depth]} />
        <meshStandardMaterial
          color={module.material.value as string || '#ffffff'}
          emissive={isSelected ? '#4CAF50' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    );
  }

  // Calculer la position de la lumière
  const lightPosition: [number, number, number] = [
    module.position.x,
    module.position.y + module.dimensions.height,
    module.position.z
  ];

  // Calculer la cible pour les spots (vers le bas)
  const targetPosition: [number, number, number] = [
    module.position.x,
    0, // Au sol
    module.position.z
  ];

  // Animation subtile pour les lumières colorées
  useFrame((state) => {
    if (lightRef.current && lightConfig.type === 'rect') {
      // Pulsation subtile pour les bandes LED
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      lightRef.current.intensity = lightConfig.intensity * pulse;
    }
  });

  // Rendu selon le type de lumière
  const renderLight = () => {
    switch (lightConfig.type) {
      case 'spot':
        return (
          <group position={lightPosition}>
            <spotLight
              ref={lightRef}
              color={lightConfig.color}
              intensity={lightConfig.intensity}
              distance={lightConfig.distance || 10}
              angle={lightConfig.angle || Math.PI / 6}
              penumbra={lightConfig.penumbra || 0.3}
              castShadow={lightConfig.castShadow}
              shadow-mapSize-width={lightConfig.shadowMapSize || 1024}
              shadow-mapSize-height={lightConfig.shadowMapSize || 1024}
              target-position={targetPosition}
            />

            {/* Helper visuel si sélectionné */}
            {isSelected && (
              <mesh>
                <coneGeometry args={[0.1, 0.2, 8]} />
                <meshBasicMaterial color={lightConfig.color} wireframe />
              </mesh>
            )}

            {/* Corps de la lumière */}
            <mesh position={[0, -module.dimensions.height / 2, 0]}>
              <cylinderGeometry args={[
                module.dimensions.width / 2,
                module.dimensions.width / 2,
                module.dimensions.height,
                16
              ]} />
              <meshStandardMaterial
                color={module.material.value as string || '#1a1a1a'}
                metalness={module.material.metalness || 0.9}
                roughness={module.material.roughness || 0.2}
              />
            </mesh>
          </group>
        );

      case 'point':
        return (
          <group position={lightPosition}>
            <pointLight
              ref={lightRef}
              color={lightConfig.color}
              intensity={lightConfig.intensity}
              distance={lightConfig.distance || 10}
              decay={lightConfig.decay || 2}
              castShadow={lightConfig.castShadow}
              shadow-mapSize-width={lightConfig.shadowMapSize || 512}
              shadow-mapSize-height={lightConfig.shadowMapSize || 512}
            />

            {/* Helper visuel */}
            {isSelected && (
              <mesh>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color={lightConfig.color} wireframe />
              </mesh>
            )}

            {/* Corps de la lumière */}
            <mesh position={[0, -module.dimensions.height / 2, 0]}>
              <cylinderGeometry args={[
                module.dimensions.width / 2,
                module.dimensions.width / 2,
                module.dimensions.height,
                16
              ]} />
              <meshStandardMaterial
                color={module.material.value as string || '#cccccc'}
                metalness={module.material.metalness || 0.5}
                roughness={module.material.roughness || 0.3}
              />
            </mesh>
          </group>
        );

      case 'rect': // Bandes LED, panneaux rétroéclairés
        return (
          <group position={[module.position.x, module.position.y + module.dimensions.height / 2, module.position.z]}>
            {/* Lumière rectangulaire (simulée avec plusieurs point lights) */}
            {Array.from({ length: 5 }).map((_, i) => {
              const offset = (i - 2) * (module.dimensions.width / 5);
              return (
                <pointLight
                  key={i}
                  position={[offset, 0, 0]}
                  color={lightConfig.color}
                  intensity={lightConfig.intensity / 5}
                  distance={lightConfig.distance || 3}
                  decay={1}
                />
              );
            })}

            {/* Panneau émissif */}
            <mesh>
              <boxGeometry args={[module.dimensions.width, module.dimensions.height, module.dimensions.depth]} />
              <meshStandardMaterial
                color={module.material.value as string || lightConfig.color}
                emissive={lightConfig.color}
                emissiveIntensity={module.material.emissiveIntensity || 1.5}
                transparent={module.material.transparent || false}
                opacity={module.material.opacity || 1}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>

            {/* Halo lumineux si sélectionné */}
            {isSelected && (
              <mesh>
                <boxGeometry args={[
                  module.dimensions.width + 0.1,
                  module.dimensions.height + 0.1,
                  module.dimensions.depth + 0.1
                ]} />
                <meshBasicMaterial color="#4CAF50" wireframe />
              </mesh>
            )}
          </group>
        );

      case 'tube': // Néons flexibles
        return (
          <group position={[module.position.x, module.position.y, module.position.z]}>
            {/* Série de point lights le long du tube */}
            {Array.from({ length: 10 }).map((_, i) => {
              const offset = (i - 4.5) * (module.dimensions.width / 10);
              return (
                <pointLight
                  key={i}
                  position={[offset, module.dimensions.height / 2, 0]}
                  color={lightConfig.color}
                  intensity={lightConfig.intensity / 10}
                  distance={lightConfig.distance || 2}
                  decay={1.5}
                />
              );
            })}

            {/* Tube émissif */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[
                lightConfig.radius || 0.015,
                lightConfig.radius || 0.015,
                module.dimensions.width,
                16
              ]} />
              <meshStandardMaterial
                color={lightConfig.color}
                emissive={lightConfig.color}
                emissiveIntensity={module.material.emissiveIntensity || 2}
                transparent={module.material.transparent || true}
                opacity={module.material.opacity || 0.9}
                roughness={0.1}
                metalness={0}
              />
            </mesh>
          </group>
        );

      default:
        return null;
    }
  };

  return <>{renderLight()}</>;
}
