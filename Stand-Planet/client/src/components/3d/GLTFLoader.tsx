import { useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

interface GLTFLoaderProps {
  url: string;
  dimensions: { width: number; height: number; depth: number };
  color?: string;
  onError?: () => void;
}

function Model({ url, dimensions, color, onError }: GLTFLoaderProps) {
  try {
    const { scene } = useGLTF(url);
    
    // Calculer l'échelle pour correspondre aux dimensions souhaitées
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    
    const scaleX = dimensions.width / size.x;
    const scaleY = dimensions.height / size.y;
    const scaleZ = dimensions.depth / size.z;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (color && child.material) {
          // Appliquer la couleur si nécessaire, tout en gardant les propriétés du matériau
          if (Array.isArray(child.material)) {
            child.material.forEach(m => (m as THREE.MeshStandardMaterial).color.set(color));
          } else {
            (child.material as THREE.MeshStandardMaterial).color.set(color);
          }
        }
      }
    });

    return <primitive object={scene} scale={[scaleX, scaleY, scaleZ]} />;
  } catch (error) {
    console.error("Erreur lors du chargement du modèle GLTF:", error);
    if (onError) onError();
    return null;
  }
}

export default function GLTFLoader(props: GLTFLoaderProps) {
  return (
    <Suspense fallback={null}>
      <Model {...props} />
    </Suspense>
  );
}
