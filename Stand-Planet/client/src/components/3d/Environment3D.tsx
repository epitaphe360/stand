import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { EnvironmentPreset } from '@/lib/3d/environment';

interface Environment3DProps {
  preset: EnvironmentPreset;
  showGround?: boolean;
}

/**
 * Composant d'environnement 3D avec éclairage et fond
 */
export function Environment3D({ preset, showGround = true }: Environment3DProps) {
  const { scene } = useThree();
  const sunlightRef = useRef<THREE.DirectionalLight>(null);

  // Appliquer la couleur de fond
  useEffect(() => {
    scene.background = new THREE.Color(preset.backgroundColor);
  }, [preset.backgroundColor, scene]);

  return (
    <>
      {/* Lumière ambiante globale */}
      <ambientLight intensity={preset.ambientIntensity} color="#ffffff" />

      {/* Lumière du soleil / principale */}
      {preset.sunlight.enabled && (
        <directionalLight
          ref={sunlightRef}
          position={preset.sunlight.position}
          intensity={preset.sunlight.intensity}
          color={preset.sunlight.color}
          castShadow={preset.sunlight.castShadow}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
      )}

      {/* Lumière de remplissage */}
      {preset.fillLight.enabled && (
        <directionalLight
          position={preset.fillLight.position}
          intensity={preset.fillLight.intensity}
          color={preset.fillLight.color}
          castShadow={false}
        />
      )}

      {/* Environnement HDRI (si disponible) */}
      {preset.hdriUrl ? (
        <Environment files={preset.hdriUrl} background={false} />
      ) : (
        <Environment preset="studio" background={false} />
      )}

      {/* Sol avec ombres */}
      {showGround && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      )}
    </>
  );
}
