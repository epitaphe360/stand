import { useRef, useState, useEffect } from 'react';
import { PlacedModule } from '@/types/modules';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ScreenModule3DProps {
  module: PlacedModule;
  isSelected: boolean;
  contentUrl?: string; // URL de l'image ou vidéo à afficher
  contentType?: 'image' | 'video';
}

export default function ScreenModule3D({
  module,
  isSelected,
  contentUrl,
  contentType = 'image'
}: ScreenModule3DProps) {
  const screenRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | THREE.VideoTexture | null>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  // Charger le contenu
  useEffect(() => {
    if (!contentUrl) {
      setTexture(null);
      return;
    }

    if (contentType === 'video') {
      // Créer un élément vidéo
      const videoElement = document.createElement('video');
      videoElement.src = contentUrl;
      videoElement.crossOrigin = 'anonymous';
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.playsInline = true;

      // Créer la texture vidéo
      const videoTexture = new THREE.VideoTexture(videoElement);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;

      setVideo(videoElement);
      setTexture(videoTexture);

      // Démarrer la vidéo
      videoElement.play().catch((err) => {
        console.error('Erreur lecture vidéo:', err);
      });

      return () => {
        videoElement.pause();
        videoTexture.dispose();
      };
    } else {
      // Charger une image
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        contentUrl,
        (loadedTexture) => {
          loadedTexture.encoding = THREE.sRGBEncoding;
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error('Erreur chargement image:', error);
        }
      );
    }
  }, [contentUrl, contentType]);

  // Animation de l'écran (scan lines subtiles)
  useFrame((state) => {
    if (screenRef.current && !contentUrl) {
      // Effet de scan lines pour écran vide
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
      }
    }
  });

  const { width, height, depth } = module.dimensions;

  // Position et rotation pour écran vertical ou horizontal
  const isVertical = height > width;

  return (
    <group position={[module.position.x, module.position.y + height / 2, module.position.z]}>
      {/* Cadre de l'écran (bezel) */}
      <mesh position={[0, 0, -depth / 2 - 0.02]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.05]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Écran */}
      <mesh ref={screenRef}>
        <planeGeometry args={[width, height]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            emissive="#ffffff"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshStandardMaterial
            color="#0a0a0a"
            emissive="#001a33"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Support arrière */}
      <mesh position={[0, 0, -depth / 2]}>
        <boxGeometry args={[width, height, depth - 0.1]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Lumière émise par l'écran */}
      {texture && (
        <pointLight
          position={[0, 0, 0.2]}
          color="#ffffff"
          intensity={1}
          distance={3}
          decay={2}
        />
      )}

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

      {/* Logo "pas de signal" si pas de contenu */}
      {!contentUrl && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width * 0.3, height * 0.3]} />
          <meshBasicMaterial
            color="#004466"
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}
