import { useRef, useState, useEffect, Suspense } from 'react';
import { PlacedModule } from '@/types/modules';
import { GLTFConfig } from '@/lib/3d/gltf-models';
import { loadGLTFModel, LoadedGLTFModel } from '@/lib/3d/gltf-loader';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface GLTFModule3DProps {
  module: PlacedModule;
  isSelected: boolean;
}

/**
 * Composant pour afficher un module GLTF 3D
 */
export default function GLTFModule3D({ module, isSelected }: GLTFModule3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [loadedModel, setLoadedModel] = useState<LoadedGLTFModel | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const gltfConfig = (module as any).gltfConfig as GLTFConfig | undefined;

  const { width, height, depth } = module.dimensions;
  const color = module.material?.value as string || '#ffffff';

  useEffect(() => {
    if (!gltfConfig?.url) {
      setLoadError('Pas de configuration GLTF trouvée');
      return;
    }

    let isMounted = true;

    const loadModel = async () => {
      try {
        setLoadError(null);
        setLoadProgress(0);

        const model = await loadGLTFModel({
          url: gltfConfig.url,
          useDraco: gltfConfig.useDraco,
          dracoPath: '/draco/',
          scale: gltfConfig.defaultScale || 1,
          center: true,
          computeBounds: true,
          castShadow: true,
          receiveShadow: true,
          materialOverrides: gltfConfig.materialOverrides || {
            color,
            metalness: module.material?.metalness,
            roughness: module.material?.roughness,
          },
          onProgress: (progress) => {
            if (isMounted) {
              setLoadProgress(progress);
            }
          },
        });

        if (isMounted) {
          setLoadedModel(model);
          setLoadProgress(100);
        }
      } catch (error) {
        console.error('Erreur de chargement GLTF:', error);
        if (isMounted) {
          setLoadError(`Impossible de charger le modèle: ${error}`);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [gltfConfig, color, module.material]);

  // Animation du modèle si configuré
  useFrame((state) => {
    if (!groupRef.current || !loadedModel) return;

    // Rotation douce si le modèle a un podium tournant
    if (module.id === 'gltf-029') {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    // Animation de brillance pour les objets métalliques
    if (module.material?.metalness && module.material.metalness > 0.7) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material.isMeshStandardMaterial && material.emissive) {
            material.emissiveIntensity = pulse * (gltfConfig?.materialOverrides?.emissiveIntensity || 0.5);
          }
        }
      });
    }
  });

  // Afficher un placeholder pendant le chargement
  if (!loadedModel) {
    return (
      <group
        position={[module.position.x, module.position.y + height / 2, module.position.z]}
        rotation={[module.rotation.x, module.rotation.y, module.rotation.z]}
      >
        {/* Placeholder box */}
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color="#bdc3c7"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>

        {/* Indicateur de progression */}
        {loadProgress > 0 && loadProgress < 100 && (
          <Html center>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              Chargement... {Math.round(loadProgress)}%
            </div>
          </Html>
        )}

        {/* Message d'erreur */}
        {loadError && (
          <Html center>
            <div
              style={{
                background: 'rgba(231, 76, 60, 0.9)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                maxWidth: '200px',
              }}
            >
              {loadError}
            </div>
          </Html>
        )}
      </group>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[module.position.x, module.position.y, module.position.z]}
      rotation={[module.rotation.x, module.rotation.y, module.rotation.z]}
    >
      {/* Modèle GLTF chargé */}
      <Suspense fallback={null}>
        <primitive object={loadedModel.scene} />
      </Suspense>

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, loadedModel.size.y / 2, 0]}>
          <boxGeometry
            args={[
              loadedModel.size.x + 0.2,
              loadedModel.size.y + 0.2,
              loadedModel.size.z + 0.2,
            ]}
          />
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Helper pour visualiser la bounding box en mode debug */}
      {process.env.NODE_ENV === 'development' && isSelected && (
        <boxHelper args={[loadedModel.scene, 0x00ff00]} />
      )}
    </group>
  );
}

/**
 * Composant optimisé pour afficher plusieurs modèles GLTF identiques
 * (utilise l'instancing pour les performances)
 */
export function GLTFInstancedModule3D({
  modules,
  gltfUrl,
}: {
  modules: PlacedModule[];
  gltfUrl: string;
}) {
  const [loadedModel, setLoadedModel] = useState<LoadedGLTFModel | null>(null);

  useEffect(() => {
    loadGLTFModel({ url: gltfUrl })
      .then(setLoadedModel)
      .catch((error) => {
        console.error('Erreur de chargement GLTF instancié:', error);
      });
  }, [gltfUrl]);

  if (!loadedModel) {
    return null;
  }

  return (
    <>
      {modules.map((module) => (
        <group
          key={module.id}
          position={[module.position.x, module.position.y, module.position.z]}
          rotation={[module.rotation.x, module.rotation.y, module.rotation.z]}
        >
          <primitive object={loadedModel.scene.clone()} />
        </group>
      ))}
    </>
  );
}
