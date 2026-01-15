// Canvas 3D interactif avec drag & drop
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useStudioStore } from '@/store/useStudioStore';
import Module3D from './Module3D';
import EnvironmentScene from './Environment';
import { Suspense } from 'react';

export default function DragDropCanvas() {
  const {
    placedModules,
    currentConfiguration,
    snapToGrid,
    gridSize,
    selectModule,
    selectedModuleId
  } = useStudioStore();

  const { width, depth } = currentConfiguration.dimensions;

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          {/* Caméra */}
          <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
          
          {/* Contrôles améliorés */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 1, 0]}
          />

          {/* Environnement réaliste (Gère l'éclairage, le sol, le HDRI) */}
          <EnvironmentScene />

          {/* Grille (Optionnelle au dessus du sol) */}
          {snapToGrid && (
            <Grid
              args={[width, depth]}
              cellSize={gridSize}
              cellThickness={0.5}
              cellColor="#6b7280"
              sectionSize={1}
              sectionThickness={1}
              sectionColor="#4b5563"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={false}
              position={[0, 0.01, 0]} // Légèrement au dessus du sol Environment
            />
          )}

          {/* NOTE: Le sol principal est géré par EnvironmentScene pour meilleure intégration */}
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.015, 0]} // Juste en dessous de la grille
          >
            <planeGeometry args={[width, depth]} />
            {/* Sol réaliste (type stratifié ou moquette dense) */}
            <meshStandardMaterial
              color={currentConfiguration.floorMaterial.value}
              roughness={0.6}
              metalness={0.1}
              envMapIntensity={0.5}
            />
          </mesh>
          
          {/* Bordures du stand */}
          <group>
            {/* Bordure avant */}
            <mesh position={[0, 0.05, depth / 2]}>
              <boxGeometry args={[width, 0.1, 0.05]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Bordure arrière */}
            <mesh position={[0, 0.05, -depth / 2]}>
              <boxGeometry args={[width, 0.1, 0.05]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Bordure gauche */}
            <mesh position={[-width / 2, 0.05, 0]}>
              <boxGeometry args={[0.05, 0.1, depth]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Bordure droite */}
            <mesh position={[width / 2, 0.05, 0]}>
              <boxGeometry args={[0.05, 0.1, depth]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>

          {/* Modules placés */}
          {placedModules.map((module) => (
            <Module3D
              key={module.instanceId}
              module={module}
              isSelected={module.instanceId === selectedModuleId}
              onSelect={() => selectModule(module.instanceId)}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Overlay d'informations */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm space-y-1 shadow-xl">
        <p className="flex items-center gap-2"><span className="text-blue-400">🖱️</span> Clic gauche + glisser : Rotation caméra</p>
        <p className="flex items-center gap-2"><span className="text-green-400">🖱️</span> Molette : Zoom avant/arrière</p>
        <p className="flex items-center gap-2"><span className="text-purple-400">🖱️</span> Clic droit + glisser : Déplacer vue</p>
        <p className="flex items-center gap-2"><span className="text-yellow-400">👆</span> Clic sur module : Sélectionner</p>
      </div>

      {/* Stats du stand */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm space-y-1 shadow-xl">
        <p className="font-semibold text-blue-300">Stand: {width}m x {depth}m</p>
        <p>Modules: {placedModules.length}</p>
        <p className="font-semibold text-green-300">
          Prix: {placedModules.reduce((sum, m) => sum + m.price, 0).toFixed(0)}€
        </p>
      </div>
    </div>
  );
}
