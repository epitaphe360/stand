import { useRef, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { PlacedModule } from '@/types/modules';
import { useStudioStore } from '@/store/useStudioStore';
import * as THREE from 'three';
import { getMaterialProps, getCertifiedMaterialById } from '@/lib/3d/materials';
import { RoundedBox } from '@react-three/drei'; // Import pour formes réalistes
import GLTFLoader from './GLTFLoader';
import LightModule3D from './LightModule3D';
import ScreenModule3D from './ScreenModule3D';
import MultiLevelModule3D from './MultiLevelModule3D';
import { checkAABBCollision, getSnappedPosition, findNearestSnapPoint, canStack } from '@/lib/3d/collision';
import { loadAssetTexture } from '@/lib/3d/texture-loader';

interface Module3DProps {
  module: PlacedModule;
  isSelected: boolean;
  onSelect: () => void;
}

export default function Module3D({ module, isSelected, onSelect }: Module3DProps) {
  const meshRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { updateModule, snapToGrid, gridSize, placedModules } = useStudioStore();
  const [hasCollision, setHasCollision] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Vérifier les collisions et gérer le stacking
  const checkCollisionsAndStacking = (x: number, z: number, instanceId: string) => {
    const currentModule = placedModules.find(m => m.instanceId === instanceId);
    if (!currentModule) return { collision: false, y: currentModule?.position.y || 0 };

    let collision = false;
    let newY = 0; // Par défaut au sol

    for (const other of placedModules) {
      if (other.instanceId === instanceId) continue;

      const isColliding = checkAABBCollision(
        { x, y: 0, z },
        currentModule.dimensions,
        other.position,
        other.dimensions
      );

      if (isColliding) {
        if (canStack(currentModule, other)) {
          // Si empilable, on ajuste la hauteur au lieu de marquer une collision
          newY = other.position.y + other.dimensions.height;
        } else {
          collision = true;
        }
      }
    }
    return { collision, y: newY };
  };

  // Animation de sélection (désactivée pour éviter confusion utilisateur)
  // useFrame(() => {
  //   if (meshRef.current && isSelected) {
  //     meshRef.current.rotation.y += 0.005;
  //   }
  // });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    onSelect();
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();

    let newX = e.point.x;
    let newZ = e.point.z;

    // 1. Snapping aux points d'accroche (snap points)
    const nearestSnap = findNearestSnapPoint({ x: newX, y: 0, z: newZ }, placedModules);
    if (nearestSnap) {
      newX = nearestSnap.x;
      newZ = nearestSnap.z;
    } else {
      // 2. Sinon Snap to grid standard
      const snapped = getSnappedPosition({ x: newX, y: 0, z: newZ }, gridSize, snapToGrid);
      newX = snapped.x;
      newZ = snapped.z;
    }

    // 3. Vérifier les collisions et le stacking
    const { collision, y } = checkCollisionsAndStacking(newX, newZ, module.instanceId);
    setHasCollision(collision);

    updateModule(module.instanceId, {
      position: { x: newX, y: y, z: newZ }
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Optionnel : On pourrait forcer un retour à la position précédente si collision
    // Mais ici on préfère l'avertissement visuel
  };

  // Couleur basée sur le matériau
  const getColor = () => {
    if (module.material.type === 'certified' && module.material.certifiedMaterialId) {
      const certified = getCertifiedMaterialById(module.material.certifiedMaterialId);
      if (certified) return certified.pbr.color;
    }
    if (module.material.type === 'color') {
      return module.material.value;
    }
    // Couleurs par défaut plus vives par catégorie
    const categoryColors: Record<string, string> = {
      structure: '#95a5a6',
      wall: '#3498db',
      furniture: '#e67e22',
      lighting: '#f1c40f',
      multimedia: '#9b59b6',
      decoration: '#e91e63',
      flooring: '#27ae60'
    };
    return categoryColors[module.category] || '#cccccc';
  };

  // Opacité basée sur le matériau
  const getOpacity = () => {
    return module.material.opacity || 1;
  };

  // Propriétés du matériau
  const getBaseMaterialProps = () => {
    if (module.material.type === 'certified' && module.material.certifiedMaterialId) {
      const certified = getCertifiedMaterialById(module.material.certifiedMaterialId);
      if (certified) {
        return {
          metalness: certified.pbr.metalness,
          roughness: certified.pbr.roughness,
          transparent: (module.material.opacity || 1) < 1,
          opacity: getOpacity()
        };
      }
    }
    return {
      metalness: module.material.metalness || 0.2,
      roughness: module.material.roughness || 0.8,
      transparent: (module.material.opacity || 1) < 1,
      opacity: getOpacity()
    };
  };

  // Alias pour compatibilité
  const getMaterialProps = getBaseMaterialProps;

  // Rendu détaillé par catégorie
  const renderDetailedModule = () => {
    const { width, height, depth } = module.dimensions;
    const color = getColor();
    // Rouge si collision, vert si sélectionné, bleu si survolé
    const emissive = hasCollision ? '#ff0000' : (isSelected ? '#4CAF50' : (hovered ? '#2196F3' : '#000000'));
    const emissiveIntensity = hasCollision ? 0.8 : (isSelected ? 0.5 : (hovered ? 0.3 : 0));

    // MURS - Cloison Premium
    if (module.category === 'wall') {
      return (
        <group>
          {/* Panneau principal */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={color}
              {...getMaterialProps()}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              roughness={0.9} // Aspect mat peinture murale
            />
          </mesh>
          {/* Profilé supérieur (Alu/Finition) */}
          <RoundedBox args={[width + 0.02, 0.04, depth + 0.04]} radius={0.01} smoothness={4} position={[0, height/2, 0]}>
            <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.3} />
          </RoundedBox>
          {/* Plinthe inférieure */}
          <RoundedBox args={[width + 0.02, 0.08, depth + 0.04]} radius={0.01} smoothness={4} position={[0, -height/2 + 0.02, 0]}>
            <meshStandardMaterial color="#2c3e50" metalness={0.4} roughness={0.6} />
          </RoundedBox>
        </group>
      );
    }

    // MOBILIER - Comptoir avec détails
    if (module.category === 'furniture' && module.id.includes('furn-001')) {
      return (
        <group>
          {/* Corps principal - bois chêne */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.7}
              metalness={0}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Plateau - métal brossé */}
          <mesh position={[0, height/2, 0]} castShadow>
            <boxGeometry args={[width, 0.05, depth]} />
            <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Tiroirs - détails métal */}
          <mesh position={[0, height/4, depth/2 + 0.01]}>
            <boxGeometry args={[width * 0.4, height * 0.15, 0.02]} />
            <meshStandardMaterial color="#797979" roughness={0.2} metalness={1} />
          </mesh>
          <mesh position={[0, 0, depth/2 + 0.01]}>
            <boxGeometry args={[width * 0.4, height * 0.15, 0.02]} />
            <meshStandardMaterial color="#797979" roughness={0.2} metalness={1} />
          </mesh>
          {/* Poignées chromées */}
          {[-width * 0.15, width * 0.15].map((x, i) => (
            <mesh key={i} position={[x, height/4, depth/2 + 0.03]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.1, 16]} />
              <meshStandardMaterial color="#E8E8E8" roughness={0.1} metalness={1} />
            </mesh>
          ))}
        </group>
      );
    }

    // VITRINE - Avec cadre en métal et verre réaliste
    if (module.category === 'furniture' && module.id.includes('furn-002')) {
      return (
        <group>
          {/* Vitrine en verre réaliste */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.2}
              transmission={0.9}
              thickness={0.5}
            />
          </mesh>
          {/* Cadre métallique aluminium */}
          {/* Montants verticaux */}
          {[-width/2, width/2].map((x, i) => (
            <mesh key={`v${i}`} position={[x, 0, depth/2]}>
              <boxGeometry args={[0.04, height, 0.04]} />
              <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.9} />
            </mesh>
          ))}
          {/* Traverses horizontales */}
          <mesh position={[0, height/2, depth/2]}>
            <boxGeometry args={[width, 0.04, 0.04]} />
            <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, -height/2, depth/2]}>
            <boxGeometry args={[width, 0.04, 0.04]} />
            <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Étagères en verre à l'intérieur */}
          {[height * 0.25, height * -0.25].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[width - 0.1, 0.02, depth - 0.1]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                roughness={0.1}
                metalness={0.1}
                transparent
                opacity={0.2}
                transmission={0.9}
                thickness={0.5}
              />
            </mesh>
          ))}
        </group>
      );
    }

    // ÉCLAIRAGE - Spot avec support
    if (module.category === 'lighting') {
      return (
        <group>
          {/* Support */}
          <mesh position={[0, -height/4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, height/2, 16]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Lampe */}
          <mesh position={[0, height/4, 0]} castShadow>
            <coneGeometry args={[width/2, height/2, 32]} />
            <meshStandardMaterial
              color={color}
              emissive="#fff3cd"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Point lumineux */}
          <pointLight
            position={[0, 0, 0]}
            intensity={isSelected ? 2 : 1}
            distance={5}
            color="#fff3cd"
          />
        </group>
      );
    }

    // TABLE - Avec pieds
    if (module.category === 'furniture' && module.id.includes('furn-003')) {
      return (
        <group>
          {/* Plateau */}
          <mesh position={[0, height - 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[width/2, width/2, 0.1, 32]} />
            <meshStandardMaterial
              color={color}
              {...getMaterialProps()}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Pied central */}
          <mesh position={[0, height/2, 0]}>
            <cylinderGeometry args={[0.05, 0.08, height - 0.1, 16]} />
            <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[width/3, width/3, 0.1, 32]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      );
    }

    // MULTIMÉDIA - Écran avec support
    if (module.category === 'multimedia') {
      return (
        <group>
          {/* Pied */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.4, 32]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Bras support */}
          <mesh position={[0, height/2, -depth/3]} rotation={[Math.PI / 6, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
            <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Écran */}
          <mesh position={[0, height - height/3, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height - 0.5, 0.05]} />
            <meshStandardMaterial
              color="#1a1a1a"
              {...getMaterialProps()}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Écran allumé */}
          <mesh position={[0, height - height/3, 0.026]}>
            <planeGeometry args={[width - 0.1, height - 0.6]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
        </group>
      );
    }

    // DÉCORATION - Plante avec pot
    if (module.category === 'decoration' && module.id.includes('deco-001')) {
      return (
        <group>
          {/* Pot */}
          <mesh position={[0, height * 0.15, 0]} castShadow>
            <cylinderGeometry args={[width/3, width/2.5, height * 0.3, 32]} />
            <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.1} />
          </mesh>
          {/* Terre */}
          <mesh position={[0, height * 0.28, 0]}>
            <cylinderGeometry args={[width/3.2, width/3.2, 0.05, 32]} />
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </mesh>
          {/* Tronc */}
          <mesh position={[0, height * 0.55, 0]}>
            <cylinderGeometry args={[0.03, 0.05, height * 0.5, 16]} />
            <meshStandardMaterial color="#228b22" roughness={0.7} />
          </mesh>
          {/* Feuillage */}
          <mesh position={[0, height * 0.85, 0]} castShadow>
            <sphereGeometry args={[width/2.5, 16, 16]} />
            <meshStandardMaterial
              color={color || '#2ecc71'}
              {...getMaterialProps()}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        </group>
      );
    }

    // DÉCORATION - Cadre photo
    if (module.category === 'decoration' && module.id.includes('deco-002')) {
      return (
        <group>
          {/* Cadre */}
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[width, height, 0.05]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Image/Toile */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[width - 0.1, height - 0.1]} />
            <meshStandardMaterial
              color={color}
              {...getMaterialProps()}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        </group>
      );
    }

    // CANAPÉ - Avec dossier et accoudoirs réalistes
    if (module.category === 'furniture' && module.id.includes('furn-004')) {
      return (
        <group>
          {/* Assise en tissu velours */}
          <mesh position={[0, height * 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height * 0.2, depth]} />
            <meshStandardMaterial
              color={color}
              roughness={0.9}
              metalness={0}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Dossier rembourré */}
          <mesh position={[0, height * 0.65, -depth * 0.35]} castShadow>
            <boxGeometry args={[width, height * 0.5, depth * 0.3]} />
            <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
          </mesh>
          {/* Accoudoirs rembourrés */}
          {[-width/2 + 0.1, width/2 - 0.1].map((x, i) => (
            <mesh key={i} position={[x, height * 0.5, 0]} castShadow>
              <boxGeometry args={[0.2, height * 0.4, depth]} />
              <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
            </mesh>
          ))}
          {/* Pieds en bois */}
          {[
            [-width/2 + 0.1, depth/2 - 0.1],
            [width/2 - 0.1, depth/2 - 0.1],
            [-width/2 + 0.1, -depth/2 + 0.1],
            [width/2 - 0.1, -depth/2 + 0.1]
          ].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.1, z]}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
              <meshStandardMaterial color="#5C4033" roughness={0.6} metalness={0} />
            </mesh>
          ))}
        </group>
      );
    }

    // Rendu par défaut selon le type de mesh
    if (module.meshType === 'gltf' && module.gltfUrl && !useFallback) {
      return (
        <group
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <GLTFLoader 
            url={module.gltfUrl} 
            dimensions={module.dimensions} 
            color={hasCollision ? '#ff0000' : (isSelected ? '#4CAF50' : undefined)}
            onError={() => setUseFallback(true)}
          />
        </group>
      );
    }

    return renderBasicMesh();
  };

  // Rendu basique (fallback) avec finition premium
  const renderBasicMesh = () => {
    const { width, height, depth } = module.dimensions;
    const color = getColor();

    switch (module.meshType) {
      case 'box':
        return (
          <RoundedBox
            ref={meshRef}
            args={[width, height, depth]}
            radius={0.02} // Bords légèrement arrondis pour réalisme
            smoothness={4}
            castShadow
            receiveShadow
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <meshStandardMaterial
              color={color}
              {...getMaterialProps()}
	              emissive={emissive}
	              emissiveIntensity={emissiveIntensity}
              roughness={0.5}
            />
          </RoundedBox>
        );

      case 'cylinder':
        return (
          <mesh
            ref={meshRef}
            castShadow
            receiveShadow
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Cylindre plus lisse */}
            <cylinderGeometry args={[width / 2, width / 2, height, 64]} />
            <meshStandardMaterial
              color={color}
              {...getMaterialProps()}
	              emissive={emissive}
	              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        );

      case 'sphere':
        return (
          <mesh
            ref={meshRef}
            castShadow
            receiveShadow
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <sphereGeometry args={[width / 2, 32, 32]} />
            <meshStandardMaterial
              color={color}
              {...getMaterialProps()}
	              emissive={emissive}
	              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        );

      // === PLV (PUBLICITÉ SUR LIEU DE VENTE) ===
      
      // Totem publicitaire LED (plv-001)
      if (module.category === 'plv' && module.id === 'plv-001') {
        return (
          <group>
            {/* Base lourde */}
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[width, 0.1, depth + 0.2]} />
              <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Structure principale double face */}
            <mesh position={[0, height/2, 0]} castShadow receiveShadow
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
            >
              <boxGeometry args={[width, height - 0.3, depth]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.3}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>
            {/* Cadre aluminium - Montants verticaux */}
            {[-width/2, width/2].map((x, i) => (
              <mesh key={`v${i}`} position={[x, height/2, 0]}>
                <boxGeometry args={[0.03, height, 0.03]} />
                <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.9} />
              </mesh>
            ))}
            {/* Éclairage LED intégré */}
            <pointLight position={[0, height/2, 0.2]} intensity={1.5} distance={3} color={color} />
          </group>
        );
      }

      // Roll-up (plv-002)
      if (module.category === 'plv' && module.id === 'plv-002') {
        return (
          <group>
            {/* Base enrouleur */}
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[width, 0.1, 0.35]} />
              <meshStandardMaterial color="#95a5a6" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Pied télescopique arrière */}
            <mesh position={[0, height * 0.4, -0.15]} rotation={[Math.PI / 12, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, height * 0.8, 16]} />
              <meshStandardMaterial color="#7f8c8d" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Bâche imprimée */}
            <mesh position={[0, height/2, 0]} castShadow receiveShadow
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
            >
              <boxGeometry args={[width, height - 0.15, 0.01]} />
              <meshStandardMaterial color={color} roughness={0.7} metalness={0} />
            </mesh>
            {/* Barre supérieure */}
            <mesh position={[0, height - 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, width, 16]} />
              <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      }

      // Kakémono suspendu (plv-003)
      if (module.category === 'plv' && module.id === 'plv-003') {
        return (
          <group>
            {/* Barre suspension supérieure */}
            <mesh position={[0, height/2 + 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, width + 0.2, 16]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Câbles de suspension */}
            {[-width/3, width/3].map((x, i) => (
              <mesh key={i} position={[x, height/2 + 0.6, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
                <meshStandardMaterial color="#7f8c8d" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            {/* Tissu tendu */}
	            <mesh position={[0, 0, 0]} castShadow receiveShadow
	              onPointerDown={handlePointerDown}
	              onPointerMove={handlePointerMove}
	              onPointerUp={handlePointerUp}
	              onPointerEnter={() => setHovered(true)}
	              onPointerLeave={() => setHovered(false)}
	            >
	              <boxGeometry args={[width, height, depth]} />
	              <meshStandardMaterial
	                color={color}
	                roughness={0.8}
	                metalness={0}
	                emissive={emissive}
	                emissiveIntensity={emissiveIntensity}
	              />
	            </mesh>
            {/* Lest inférieur */}
            <mesh position={[0, -height/2 - 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, width + 0.1, 16]} />
              <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      }

      // Enseigne lumineuse 3D (plv-005)
      if (module.category === 'plv' && module.id === 'plv-005') {
        return (
          <group>
            {/* Fond rétroéclairé */}
            <mesh position={[0, 0, -depth/2]} castShadow>
              <boxGeometry args={[width, height, depth/2]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={color}
                emissiveIntensity={0.4}
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
            {/* Lettres 3D en relief */}
            {[-width * 0.3, -width * 0.1, width * 0.1, width * 0.3].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} castShadow
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
              >
                <boxGeometry args={[width * 0.15, height * 0.7, depth]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.6}
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
            ))}
            {/* Éclairage LED RGB */}
            <pointLight position={[0, 0, depth/2]} intensity={2} distance={4} color={color} />
          </group>
        );
      }

      // PLV générique (autres types)
	      if (module.category === 'plv') {
	        return (
	          <mesh
	            ref={meshRef}
	            castShadow
	            receiveShadow
	            onPointerDown={handlePointerDown}
	            onPointerMove={handlePointerMove}
	            onPointerUp={handlePointerUp}
	            onPointerEnter={() => setHovered(true)}
	            onPointerLeave={() => setHovered(false)}
	          >
	            <boxGeometry args={[width, height, depth]} />
	            <meshStandardMaterial
	              color={color}
	              {...getMaterialProps()}
	              emissive={emissive}
	              emissiveIntensity={emissiveIntensity}
	            />
	          </mesh>
	        );
	      }

      // MULTIMEDIA - Écran LED 55"
      if (module.meshType === 'multi-001') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Base */}
            <mesh castShadow position={[0, -height / 2 + 0.08, 0]}>
              <boxGeometry args={[0.6, 0.16, 0.4]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
            </mesh>

            {/* Support arm */}
            <mesh castShadow position={[0, -height / 2 + 0.3, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.15} />
            </mesh>

	            {/* Écran */}
	            <mesh castShadow position={[0, 0, 0]}>
	              <boxGeometry args={[1.2, 0.68, 0.04]} />
	              <meshStandardMaterial
	                color="#0a0a0a"
	                metalness={0.3}
	                roughness={0.1}
	                emissive={emissive}
	                emissiveIntensity={emissiveIntensity}
	              />
	            </mesh>

            {/* Écran affichage (emissive) */}
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[1.15, 0.65, 0.02]} />
              <meshStandardMaterial 
                color="#00ff88" 
                emissive="#00ff88" 
                emissiveIntensity={0.8}
                toneMapped={false}
              />
            </mesh>

            {/* Bezel corners */}
            {[[-0.6, 0.35], [0.6, 0.35], [-0.6, -0.35], [0.6, -0.35]].map((pos, i) => (
              <mesh key={i} position={[pos[0], pos[1], 0]} castShadow>
                <boxGeometry args={[0.05, 0.05, 0.04]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            ))}
          </group>
        );
      }

      // MULTIMEDIA - Écran LED 85"
      if (module.meshType === 'multi-002') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Base lourde */}
            <mesh castShadow position={[0, -height / 2 + 0.1, 0]}>
              <boxGeometry args={[0.8, 0.2, 0.5]} />
              <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Support bras industriel */}
            <mesh castShadow position={[0, -height / 2 + 0.35, 0]}>
              <boxGeometry args={[0.08, 0.4, 0.08]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>

	            {/* Écran 85" */}
	            <mesh castShadow position={[0, 0, 0]}>
	              <boxGeometry args={[1.88, 1.06, 0.06]} />
	              <meshStandardMaterial
	                color="#0a0a0a"
	                metalness={0.4}
	                roughness={0.15}
	                emissive={emissive}
	                emissiveIntensity={emissiveIntensity}
	              />
	            </mesh>

            {/* Affichage (emissive) */}
            <mesh position={[0, 0, 0.035]}>
              <boxGeometry args={[1.82, 1.02, 0.02]} />
              <meshStandardMaterial 
                color="#00ffff" 
                emissive="#0088ff" 
                emissiveIntensity={0.7}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      }

      // MULTIMEDIA - Borne tactile 32"
      if (module.meshType === 'multi-003') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Base circulaire */}
            <mesh castShadow position={[0, -height / 2 + 0.08, 0]}>
              <cylinderGeometry args={[0.4, 0.45, 0.16, 32]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
            </mesh>

            {/* Colonne support */}
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.14, height - 0.4, 32]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.15} />
            </mesh>

	            {/* Écran circulaire */}
	            <mesh position={[0, height / 2 - 0.2, 0]}>
	              <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
	              <meshStandardMaterial
	                color="#0a0a0a"
	                metalness={0.3}
	                roughness={0.1}
	                emissive={emissive}
	                emissiveIntensity={emissiveIntensity}
	              />
	            </mesh>

            {/* Surface tactile (emissive) */}
            <mesh position={[0, height / 2 - 0.15, 0.03]}>
              <cylinderGeometry args={[0.33, 0.33, 0.02, 32]} />
              <meshStandardMaterial 
                color="#ff00ff" 
                emissive="#ff0088" 
                emissiveIntensity={0.6}
                toneMapped={false}
              />
            </mesh>

            {/* Anneau chrome */}
            <mesh position={[0, height / 2 - 0.2, 0.06]}>
              <torusGeometry args={[0.36, 0.02, 16, 32]} />
              <meshStandardMaterial color="#e8e8e8" metalness={0.95} roughness={0.05} />
            </mesh>
          </group>
        );
      }

      // MULTIMEDIA - Table tactile interactive
      if (module.meshType === 'multi-006') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Plateau de table */}
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[width, 0.05, depth]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.3} />
            </mesh>

            {/* Surface tactile encastrée */}
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[width - 0.1, 0.02, depth - 0.1]} />
              <meshStandardMaterial 
                color="#00dd00" 
                emissive="#00aa00" 
                emissiveIntensity={0.5}
                toneMapped={false}
              />
            </mesh>

            {/* Cadre intérieur */}
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[width - 0.08, 0.01, depth - 0.08]} />
              <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.1} />
            </mesh>

            {/* Pieds */}
            {[[-width / 2 + 0.15, -height / 2 + 0.05, -depth / 2 + 0.15],
              [width / 2 - 0.15, -height / 2 + 0.05, -depth / 2 + 0.15],
              [-width / 2 + 0.15, -height / 2 + 0.05, depth / 2 - 0.15],
              [width / 2 - 0.15, -height / 2 + 0.05, depth / 2 - 0.15]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow>
                <boxGeometry args={[0.08, height - 0.1, 0.08]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      }

      // MULTIMEDIA - Mur LED interactif
      if (module.meshType === 'multi-007') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Cadre de montage */}
            <mesh castShadow position={[0, 0, -0.05]}>
              <boxGeometry args={[width + 0.1, height + 0.1, 0.1]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Panneaux LED (3x2 grid) */}
            {Array.from({ length: 6 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const x = -width / 2 + (col + 0.5) * (width / 3) + 0.05;
              const y = height / 2 - (row + 0.5) * (height / 2) - 0.05;
              return (
                <mesh key={i} position={[x, y, 0]} castShadow>
                  <boxGeometry args={[width / 3 - 0.1, height / 2 - 0.1, 0.08]} />
                  <meshStandardMaterial 
                    color="#ff0000" 
                    emissive="#ff0000" 
                    emissiveIntensity={0.8}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}

            {/* Joints entre panneaux */}
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh key={`v${i}`} position={[-width / 2 + (i + 1) * (width / 3), 0, 0.04]}>
                <boxGeometry args={[0.08, height, 0.02]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
            ))}
            {Array.from({ length: 2 }).map((_, i) => (
              <mesh key={`h${i}`} position={[0, height / 2 - (i + 1) * (height / 2), 0.04]}>
                <boxGeometry args={[width, 0.08, 0.02]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
            ))}
          </group>
        );
      }

      // MULTIMEDIA - Tablette sur socle
      if (module.meshType === 'multi-008') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Socle */}
            <mesh castShadow position={[0, -height / 2 + 0.1, 0]}>
              <boxGeometry args={[0.35, 0.2, 0.35]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Tige support */}
            <mesh castShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, height - 0.3, 16]} />
              <meshStandardMaterial color="#a0a0a0" metalness={0.85} roughness={0.1} />
            </mesh>

            {/* Support tablette */}
            <mesh castShadow position={[0, height / 2 - 0.15, 0]}>
              <boxGeometry args={[0.25, 0.05, 0.15]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.2} />
            </mesh>

            {/* Tablette */}
            <mesh position={[0, height / 2 - 0.08, 0]}>
              <boxGeometry args={[0.23, 0.015, 0.13]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.2} />
            </mesh>

            {/* Écran tablette */}
            <mesh position={[0, height / 2 - 0.055, 0.008]}>
              <boxGeometry args={[0.22, 0.01, 0.125]} />
              <meshStandardMaterial 
                color="#00ccff" 
                emissive="#0099cc" 
                emissiveIntensity={0.4}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      }

      // FURNITURE - Fauteuil Lounge Ultra-Réaliste
      if (module.meshType === 'furn-008') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Coussin d'assise moelleux (RoundedBox) */}
            <RoundedBox args={[0.7, 0.25, 0.75]} radius={0.08} smoothness={8} position={[0, -height / 2 + 0.35, 0.05]} castShadow>
               <meshStandardMaterial 
                 color="#d9cbb8" 
                 roughness={0.9} 
                 normalScale={new THREE.Vector2(0.3, 0.3)} // Simulation texture tissu
               />
            </RoundedBox>

            {/* Base assise structure */}
            <RoundedBox args={[0.7, 0.15, 0.75]} radius={0.02} smoothness={4} position={[0, -height / 2 + 0.20, 0.05]} castShadow>
               <meshStandardMaterial color="#5a4d41" roughness={0.8} />
            </RoundedBox>

            {/* Dossier incliné ergonomique */}
            <group position={[0, -height / 2 + 0.45, -0.25]} rotation={[0.15, 0, 0]}>
              <RoundedBox args={[0.7, 0.55, 0.2]} radius={0.08} smoothness={8} castShadow>
                <meshStandardMaterial color="#d9cbb8" roughness={0.9} />
              </RoundedBox>
            </group>

            {/* Accoudoirs arrondis */}
            {[-1, 1].map((side) => (
              <RoundedBox 
                key={side}
                args={[0.12, 0.35, 0.6]} 
                radius={0.06} 
                smoothness={8} 
                position={[side * 0.36, -height / 2 + 0.45, 0.05]} 
                castShadow
              >
                <meshStandardMaterial color="#d9cbb8" roughness={0.9} />
              </RoundedBox>
            ))}

            {/* Pieds coniques modernes */}
            {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map((pos, i) => (
              <mesh key={i} position={[pos[0], -height / 2 + 0.1, pos[1] + 0.05]} castShadow>
                <cylinderGeometry args={[0.025, 0.015, 0.2, 16]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      }

      // FURNITURE - Table Basse Verre Premium
      if (module.meshType === 'furn-007') {
        const glassMaterial = new THREE.MeshPhysicalMaterial({  
          transmission: 1,  
          opacity: 1,
          metalness: 0, 
          roughness: 0, 
          ior: 1.5, 
          thickness: 0.02, 
          specularIntensity: 1, 
          color: '#ffffff',
          transparent: true
        });

        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Plateau de verre physique */}
            <RoundedBox 
              args={[width, 0.02, depth]} 
              radius={0.01} 
              smoothness={4} 
              position={[0, 0, 0]} 
            >
              <primitive object={glassMaterial} attach="material" />
            </RoundedBox>

            {/* Cadre métal fin */}
            <mesh position={[0, -0.015, 0]} castShadow>
              <boxGeometry args={[width - 0.05, 0.015, depth - 0.05]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Pieds design minimaliste */}
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map((sign, i) => {
              const x = (sign[0] * (width - 0.1)) / 2;
              const z = (sign[1] * (depth - 0.1)) / 2;
              return (
                <mesh key={i} position={[x, -height / 2 + height / 2 - 0.1, z]} castShadow>
                  <cylinderGeometry args={[0.015, 0.01, height - 0.02, 16]} />
                  <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                </mesh>
              );
            })}
          </group>
        );
      }

      // FURNITURE - Comptoir bar LED Ultra-Premium
      if (module.meshType === 'furn-009') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Corps principal laqué blanc/noir */}
            <RoundedBox 
              args={[width, height, depth - 0.2]} 
              radius={0.05} 
              smoothness={8} 
              position={[0, 0, 0.1]} 
              castShadow
            >
              <meshPhysicalMaterial 
                color="#ffffff" 
                roughness={0.1} 
                metalness={0.1} 
                clearcoat={1} 
                clearcoatRoughness={0.1}
                reflectivity={1}
              />
            </RoundedBox>

            {/* Plateau supérieur en marbre noir/granit */}
            <RoundedBox 
              args={[width + 0.05, 0.04, depth]} 
              radius={0.02} 
              smoothness={4} 
              position={[0, height / 2 + 0.02, 0]} 
              castShadow
            >
              <meshStandardMaterial 
                color="#111111" 
                roughness={0.2} 
                metalness={0.5} 
              />
            </RoundedBox>

            {/* Insert LED Neon Frontal */}
            <mesh position={[0, height / 2 - 0.1, depth / 2 + 0.11]}>
              <boxGeometry args={[width - 0.2, 0.02, 0.01]} />
              <meshStandardMaterial 
                color="#0066ff" 
                emissive="#0066ff" 
                emissiveIntensity={2} 
                toneMapped={false}
              />
            </mesh>

            {/* Repose-pieds Chrome (Tube) */}
            <mesh position={[0, -height / 2 + 0.15, depth / 2 + 0.15]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, width - 0.2, 16]} />
              <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
            </mesh>
            
            {/* Supports Repose-pieds */}
            {[-width/3, width/3].map((x, i) => (
               <mesh key={i} position={[x, -height / 2 + 0.15, depth / 2]} rotation={[Math.PI/2, 0, 0]}>
                 <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
                 <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
               </mesh>
            ))}

            {/* Intérieur (Côté staff) - Évidé sommairement pour réalisme */}
            <mesh position={[0, 0, -depth/2 + 0.05]}>
              <boxGeometry args={[width - 0.2, height - 0.2, 0.1]} />
              <meshStandardMaterial color="#333333" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      // FURNITURE - Présentoir multi-niveaux Design
      if (module.meshType === 'furn-010') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Structure Métallique Fine (Chrome ou Noir Mat) */}
            {/* Montants verticaux */}
            {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map((sign, i) => (
              <mesh key={i} position={[sign[0] * (width / 2 - 0.02), 0, sign[1] * (depth / 2 - 0.02)]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, height, 16]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}

            {/* Étagères en Verre Trempé */}
            {[height/2 - 0.1, 0, -height/2 + 0.3].map((y, i) => (
              <group key={`shelf-${i}`} position={[0, y, 0]}>
                 <RoundedBox args={[width, 0.015, depth]} radius={0.005} smoothness={4}>
                    <meshPhysicalMaterial 
                      transmission={1} 
                      opacity={1} 
                      thickness={0.02} 
                      roughness={0} 
                      color="#ffffff" 
                      ior={1.5}
                      transparent
                    />
                 </RoundedBox>
                 {/* Support étagère discret */}
                 <mesh position={[0, -0.01, 0]}>
                   <boxGeometry args={[width-0.01, 0.01, depth-0.01]} />
                   <meshBasicMaterial color="#000000" wireframe transparent opacity={0.1} />
                 </mesh>
              </group>
            ))}

           {/* Base solide (Bois ou Marbre) */}
           <RoundedBox args={[width, 0.05, depth]} radius={0.01} smoothness={4} position={[0, -height/2 + 0.025, 0]} castShadow>
             <meshStandardMaterial color="#444444" roughness={0.5} metalness={0.5} />
           </RoundedBox>
          </group>
        );
      }

      // DECORATION - Mur végétal Haute Densité
      if (module.meshType === 'deco-006') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Cadre support Noir Mat */}
            <RoundedBox args={[width, height, 0.1]} radius={0.02} smoothness={4} position={[0, 0, -0.05]} castShadow>
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </RoundedBox>

            {/* Fond sombre (Terre/Support mousse) */}
            <mesh position={[0, 0, 0.01]} receiveShadow>
               <planeGeometry args={[width - 0.1, height - 0.1]} />
               <meshStandardMaterial color="#0b1a0b" roughness={1} />
            </mesh>
            
            {/* Végétation procédurale dense (50 clusters) */}
            {Array.from({ length: 50 }).map((_, i) => {
              // Distribution plus organique
              const randomX = (Math.random() - 0.5) * (width - 0.2);
              const randomY = (Math.random() - 0.5) * (height - 0.2);
              const randomZ = 0.05 + Math.random() * 0.1; // Profondeur variable
              const scale = 0.05 + Math.random() * 0.08;
              
              // Variation de vert (plus naturel)
              const hue = 100 + Math.random() * 40; // 100-140 (vert tendre à vert forêt)
              const lightness = 20 + Math.random() * 30; // 20-50%

              return (
                <group key={i} position={[randomX, randomY, randomZ]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                   <mesh castShadow receiveShadow>
                     <dodecahedronGeometry args={[scale, 0]} />
                     <meshStandardMaterial 
                       color={`hsl(${hue}, 60%, ${lightness}%)`}
                       roughness={0.8}
                       flatShading={true} // Style "Low Poly" artistique qui passe bien en procédural
                     />
                   </mesh>
                </group>
              );
            })}
          </group>
        );
      }

      // DECORATION - Panneau 3D Architectural
      if (module.meshType === 'deco-007') {
        return (
          <group
            ref={meshRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            {/* Base Panneau */}
            <RoundedBox args={[width, height, 0.05]} radius={0.01} smoothness={2} position={[0, 0, -0.05]}>
               <meshPhysicalMaterial 
                 color="#ffffff" 
                 roughness={0.5} 
                 metalness={0.1}
                 clearcoat={0.3}
               />
            </RoundedBox>

            {/* Motifs Géométriques Complexes */}
            {Array.from({ length: 8 }).map((_, i) => {
              const row = Math.floor(i / 4); // 2 lignes
              const col = i % 4;             // 4 colonnes
              
              const x = -width / 2 + (width/8) + col * (width/4);
              const y = height / 2 - (height/4) - row * (height/2);
              
              return (
                <group key={i} position={[x, y, 0]}>
                  {/* Pyramide tronquée inversée ou extrudée */}
                  <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 4]}>
                    <cylinderGeometry args={[0.02, 0.12, 0.08, 4]} />
                    <meshStandardMaterial 
                      color={color || '#ecf0f1'} // Utilise la couleur du module ou blanc
                      roughness={0.3}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      }

      // Default - Rendu générique pour types non spécifiés
      return (
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={color} {...getMaterialProps()} />
        </mesh>
      );
    }
  };

  // Si c'est un module d'éclairage avec lightConfig, utiliser le composant spécialisé
  if (module.category === 'lighting' && (module as any).lightConfig) {
    return <LightModule3D module={module} isSelected={isSelected} />;
  }

  // Si c'est un écran multimédia
  if (module.category === 'multimedia' && module.id.startsWith('multi-')) {
    return <ScreenModule3D module={module} isSelected={isSelected} />;
  }

  // Si c'est une structure multi-niveaux (plateforme, escalier, garde-corps)
  if (module.id.startsWith('level-')) {
    return <MultiLevelModule3D module={module} isSelected={isSelected} />;
  }

  return (
    <group
      position={[module.position.x, module.position.y + module.dimensions.height / 2, module.position.z]}
      rotation={[module.rotation.x, module.rotation.y, module.rotation.z]}
      scale={[module.scale.x, module.scale.y, module.scale.z]}
    >
      {renderDetailedModule()}

      {/* Outline pour sélection */}
      {(isSelected || hovered) && (
        <mesh>
          <boxGeometry args={[
            module.dimensions.width + 0.1,
            module.dimensions.height + 0.1,
            module.dimensions.depth + 0.1
          ]} />
          <meshBasicMaterial
            color={isSelected ? '#3b82f6' : '#6b7280'}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}
