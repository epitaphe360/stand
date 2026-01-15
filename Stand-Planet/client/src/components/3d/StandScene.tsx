import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, ContactShadows } from "@react-three/drei";
import { useConfigStore } from "@/store/useConfigStore";
import * as THREE from "three";

function Floor({ width, depth, texture }: { width: number, depth: number, texture: string }) {
  const colorMap = {
    wood: "#d4a373",
    concrete: "#9ca3af",
    carpet: "#3b82f6",
    tile: "#e5e7eb"
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={colorMap[texture as keyof typeof colorMap] || "#e5e7eb"} />
    </mesh>
  );
}

function Walls({ width, depth, color }: { width: number, depth: number, color: string }) {
  const height = 2.5; // Standard wall height
  
  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, height/2, -depth/2]} receiveShadow castShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Side Walls */}
      <mesh position={[-width/2, height/2, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[depth, height, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={[width/2, height/2, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[depth, height, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Furniture({ type, position, rotation }: { type: string, position: [number, number, number], rotation: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Simple geometry placeholders for furniture
  const getGeometry = () => {
    switch (type) {
      case 'table':
        return <boxGeometry args={[1.2, 0.8, 0.6]} />;
      case 'chair':
        return <boxGeometry args={[0.5, 0.9, 0.5]} />;
      case 'banner':
        return <boxGeometry args={[0.8, 2, 0.1]} />;
      case 'plant':
        return <cylinderGeometry args={[0.3, 0.2, 0.8, 16]} />;
      default:
        return <boxGeometry args={[0.5, 0.5, 0.5]} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'table': return "#a855f7";
      case 'chair': return "#3b82f6";
      case 'banner': return "#ef4444";
      case 'plant': return "#22c55e";
      default: return "#94a3b8";
    }
  };

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow ref={meshRef}>
      {getGeometry()}
      <meshStandardMaterial color={getColor()} roughness={0.3} />
    </mesh>
  );
}

export function StandScene() {
  const { dimensions, wallColor, floorTexture, objects } = useConfigStore();
  
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-border shadow-inner">
      <Canvas shadows camera={{ position: [4, 4, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          
          <group position={[0, 0, 0]}>
            <Floor width={dimensions.width} depth={dimensions.depth} texture={floorTexture} />
            <Walls width={dimensions.width} depth={dimensions.depth} color={wallColor} />
            
            {objects.map((obj) => (
              <Furniture 
                key={obj.id} 
                type={obj.type} 
                position={obj.position} 
                rotation={obj.rotation} 
              />
            ))}
            
            <Grid 
              position={[0, -0.01, 0]} 
              args={[10, 10]} 
              cellColor="#e5e7eb" 
              sectionColor="#d1d5db" 
              fadeDistance={20} 
            />
            
            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          </group>
          
          <OrbitControls 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1} 
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
