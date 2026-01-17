// Canvas 3D interactif avec drag & drop
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO, ToneMapping } from '@react-three/postprocessing';
import { VRButton, XR } from '@react-three/xr';
import { useStudioStore } from '@/store/useStudioStore';
import { downloadBOMCSV, downloadCNCPlanSVG, downloadCNC_DXF } from '@/lib/3d/export';
import Module3D from './Module3D';
import EnvironmentScene from './Environment';
import { Suspense } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';

export default function DragDropCanvas() {
  const isMobile = useIsMobile();
  const {
    placedModules,
    currentConfiguration,
    snapToGrid,
    gridSize,
    selectModule,
    selectedModuleId,
    environmentPreset,
    setEnvironmentPreset,
    connectCollaboration,
    disconnectCollaboration,
    roomId
  } = useStudioStore();

  const { width, depth } = currentConfiguration.dimensions;

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative">
      {/* TODO: VR/XR support needs proper store configuration */}
      {/* <VRButton /> */}
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ antialias: !isMobile, alpha: false }}
      >
        {/* TODO: XR needs store prop from createXRStore() */}
        {/* <XR> */}
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
            {/* Sol réaliste avec texture simulée par roughnessMap et normalMap si disponibles */}
            <meshStandardMaterial
              color={currentConfiguration.floorMaterial.value}
              roughness={0.8}
              metalness={0.05}
              envMapIntensity={0.8}
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

          {/* Post-Processing optimisé (désactivé sur mobile pour fluidité) */}
          {!isMobile && (
            <EffectComposer>
              <SSAO
                intensity={1.5}
                radius={0.4}
                luminanceInfluence={0.5}
              />
              <Bloom 
                intensity={0.5}
                luminanceThreshold={1}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <ToneMapping 
                adaptive={true}
                resolution={256}
                middleGrey={0.6}
                maxLuminance={16.0}
                averageLuminance={1.0}
                adaptationRate={1.0}
              />
            </EffectComposer>
          )}
        </Suspense>
        {/* </XR> */}
      </Canvas>

      {/* Overlay d'informations */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm space-y-1 shadow-xl">
        <p className="flex items-center gap-2"><span className="text-blue-400">🖱️</span> Clic gauche + glisser : Rotation caméra</p>
        <p className="flex items-center gap-2"><span className="text-green-400">🖱️</span> Molette : Zoom avant/arrière</p>
        <p className="flex items-center gap-2"><span className="text-purple-400">🖱️</span> Clic droit + glisser : Déplacer vue</p>
        <p className="flex items-center gap-2"><span className="text-yellow-400">👆</span> Clic sur module : Sélectionner</p>
      </div>

      {/* Stats & Exports */}
      <div className="absolute top-4 right-4 flex flex-col gap-4">
        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm space-y-1 shadow-xl">
          <p className="font-semibold text-blue-300">Stand: {width}m x {depth}m</p>
          <p>Modules: {placedModules.length}</p>
          <p className="font-semibold text-green-300">
            Prix: {placedModules.reduce((sum, m) => sum + m.price, 0).toFixed(0)}€
          </p>
        </div>

        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm shadow-xl flex flex-col gap-2">
          <p className="font-semibold text-orange-300 border-b border-white/20 pb-1 mb-1">Export Technique</p>
          <button 
            onClick={() => downloadBOMCSV(currentConfiguration)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors text-xs"
          >
            <span>📊</span> Nomenclature (BOM)
          </button>
          <button 
            onClick={() => downloadCNCPlanSVG(currentConfiguration)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors text-xs"
          >
            <span>📐</span> Plan (SVG)
          </button>
          <button 
            onClick={() => downloadCNC_DXF(currentConfiguration)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors text-xs"
          >
            <span>⚙️</span> CNC (DXF)
          </button>
        </div>
      </div>

      {/* Collaboration & Environnement */}
      <div className="absolute top-4 left-4 flex flex-col gap-4">
        {/* Bouton Collaboration */}
        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm shadow-xl flex flex-col gap-2">
          <p className="font-semibold text-blue-300 border-b border-white/20 pb-1 mb-1">Collaboration Mondiale</p>
          {!roomId ? (
            <button 
              onClick={() => connectCollaboration('stand-global-1')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
            >
              <span>🌐</span> Activer le mode Multijoueur
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                En ligne (Room: {roomId})
              </div>
              <button 
                onClick={disconnectCollaboration}
                className="bg-red-600/50 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                Quitter la session
              </button>
            </div>
          )}
        </div>

        {/* Sélecteur d'environnement HDR */}
        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm shadow-xl flex flex-col gap-2">
          <p className="font-semibold text-purple-300 border-b border-white/20 pb-1 mb-1">Ambiance Lumineuse</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'studio', label: 'Studio Photo', icon: '📸' },
            { id: 'lobby', label: 'Hall Expo', icon: '🏢' },
            { id: 'city', label: 'Urbain', icon: '🏙️' },
            { id: 'warehouse', label: 'Entrepôt', icon: '🏭' },
            { id: 'night', label: 'Nuit', icon: '🌙' },
            { id: 'forest', label: 'Extérieur', icon: '🌳' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setEnvironmentPreset(preset.id as any)}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                environmentPreset === preset.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <span>{preset.icon}</span>
              <span className="text-xs">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
