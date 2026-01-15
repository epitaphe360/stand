// Environnement 3D réaliste pour le stand
import { Environment as DreiEnvironment, ContactShadows, Grid } from '@react-three/drei';
import { useStudioStore } from '@/store/useStudioStore';

export default function Environment() {
  const { environmentPreset } = useStudioStore();

  return (
    <>
      {/* Éclairage Studio Professionnel */}
      <ambientLight intensity={0.2} />
      
      {/* Key Light */}
      <spotLight
        position={[10, 20, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Fill Light */}
      <pointLight position={[-10, 10, -10]} intensity={1} color="#e2e8f0" />
      
      {/* Rim Light */}
      <directionalLight position={[0, 10, -15]} intensity={0.5} color="#ffffff" />

      {/* Sol avec grille professionnelle */}
      <Grid
        position={[0, -0.01, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3b82f6"
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Ombres de contact réalistes */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={40}
        blur={2.5}
        far={10}
        resolution={1024}
        color="#000000"
      />

      {/* Environnement HDRI dynamique pour reflets réalistes */}
      <DreiEnvironment preset={environmentPreset} background={false} />
    </>
  );
}
