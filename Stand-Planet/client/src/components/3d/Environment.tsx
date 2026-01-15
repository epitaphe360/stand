// Environnement 3D réaliste pour le stand
import { Environment as DreiEnvironment, ContactShadows, Grid } from '@react-three/drei';

export default function Environment() {
  return (
    <>
      {/* Éclairage professionnel */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.3} />
      <spotLight position={[0, 15, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
      
      {/* Sol avec grille professionnelle */}
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#3b82f6"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Ombres de contact réalistes */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={10}
      />

      {/* Environnement HDRI pour reflets réalistes */}
      <DreiEnvironment preset="city" background={false} />
    </>
  );
}
