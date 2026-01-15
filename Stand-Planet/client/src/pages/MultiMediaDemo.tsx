import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';

// Simulation du composant Module3D simplifié pour démonstration
const Module3DDemo = ({ meshType, dimensions }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { width = 1, height = 1, depth = 1 } = dimensions || {};

  // Écran LED 55"
  if (meshType === 'multi-001') {
    return (
      <group position={[0, height / 2, 0]}>
        {/* Base */}
        <mesh position={[0, -height / 2 + 0.08, 0]} castShadow>
          <boxGeometry args={[0.6, 0.16, 0.4]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Support arm */}
        <mesh position={[0, -height / 2 + 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.15} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.68, 0.04]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.1} />
        </mesh>
        {/* Display */}
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[1.15, 0.65, 0.02]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive="#00ff88" 
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      </group>
    );
  }

  // Écran LED 85"
  if (meshType === 'multi-002') {
    return (
      <group position={[0, height / 2, 0]}>
        <mesh position={[0, -height / 2 + 0.1, 0]} castShadow>
          <boxGeometry args={[0.8, 0.2, 0.5]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -height / 2 + 0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.88, 1.06, 0.06]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.15} />
        </mesh>
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

  // Borne Tactile 32"
  if (meshType === 'multi-003') {
    return (
      <group position={[0, height / 2, 0]}>
        <mesh position={[0, -height / 2 + 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.45, 0.16, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, height - 0.4, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[0, height / 2 - 0.2, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[0, height / 2 - 0.15, 0.03]}>
          <cylinderGeometry args={[0.33, 0.33, 0.02, 32]} />
          <meshStandardMaterial 
            color="#ff00ff" 
            emissive="#ff0088" 
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
      </group>
    );
  }

  // Table Basse Design
  if (meshType === 'furn-007') {
    return (
      <group position={[0, height / 2, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[width, 0.02, depth]} />
          <meshStandardMaterial 
            color="#e8f4f8" 
            metalness={0.1} 
            roughness={0.05}
            transparent
            opacity={0.9}
          />
        </mesh>
        {[[-0.25, -0.3], [0.25, -0.3], [-0.25, 0.3], [0.25, 0.3]].map((pos, i) => (
          <mesh key={i} position={[pos[0], -height / 2 + height / 2 - 0.1, pos[1]]} castShadow>
            <boxGeometry args={[0.04, height - 0.05, 0.04]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
          </mesh>
        ))}
      </group>
    );
  }

  // Fauteuil Lounge
  if (meshType === 'furn-008') {
    return (
      <group position={[0, height / 2, 0]}>
        <mesh position={[0, -height / 2 + 0.25, 0]} castShadow>
          <boxGeometry args={[0.7, 0.4, 0.8]} />
          <meshStandardMaterial color="#c4a477" metalness={0.1} roughness={0.7} />
        </mesh>
        <mesh position={[0, -height / 2 + 0.5, -0.3]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.2]} />
          <meshStandardMaterial color="#b8956f" metalness={0.1} roughness={0.75} />
        </mesh>
      </group>
    );
  }

  return null;
};

// Composant de démo
function MultiMediaDemo() {
  const [selectedModule, setSelectedModule] = useState('multi-001');

  const modules = [
    { id: 'multi-001', name: 'Écran LED 55"', dim: { width: 1.2, height: 1.6, depth: 0.1 } },
    { id: 'multi-002', name: 'Écran LED 85"', dim: { width: 1.88, height: 2.0, depth: 0.15 } },
    { id: 'multi-003', name: 'Borne Tactile 32"', dim: { width: 0.7, height: 1.7, depth: 0.7 } },
    { id: 'furn-007', name: 'Table Basse Design', dim: { width: 1.2, height: 0.45, depth: 0.8 } },
    { id: 'furn-008', name: 'Fauteuil Lounge', dim: { width: 0.7, height: 0.85, depth: 0.8 } },
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">🎨 Stand-Planet Multimedia Demo</h1>
        <p className="text-sm opacity-90">Explore les rendus 3D des équipements et mobilier</p>
      </div>

      <div className="flex flex-1 gap-4 p-6 bg-gray-900">
        {/* Canvas 3D */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <directionalLight position={[-5, 3, -5]} intensity={0.5} castShadow />
            
            <Module3DDemo 
              meshType={selectedModule} 
              dimensions={modules.find(m => m.id === selectedModule)?.dim}
            />
            
            <ContactShadows position={[0, -0.5, 0]} scale={10} blur={2} opacity={0.4} />
            <Grid args={[10, 10]} cellSize={0.5} fadeDistance={10} fadeStrength={0.3} />
            <Environment preset="city" />
            <OrbitControls />
          </Canvas>
        </div>

        {/* Contrôles */}
        <div className="w-80 bg-gray-800 rounded-lg p-6 shadow-2xl text-white overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Modules</h2>
          <div className="space-y-3">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedModule === mod.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold">{mod.name}</div>
                <div className="text-xs opacity-75 mt-1">{mod.id}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">📊 Info Module</h3>
            {modules.find(m => m.id === selectedModule) && (
              <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
                <p><strong>ID:</strong> {selectedModule}</p>
                <p><strong>Nom:</strong> {modules.find(m => m.id === selectedModule)?.name}</p>
                <p className="mt-3"><strong>Dimensions:</strong></p>
                <p className="text-xs opacity-75">
                  L×H×P: {modules.find(m => m.id === selectedModule)?.dim.width.toFixed(2)}m × 
                  {modules.find(m => m.id === selectedModule)?.dim.height.toFixed(2)}m × 
                  {modules.find(m => m.id === selectedModule)?.dim.depth.toFixed(2)}m
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiMediaDemo;
