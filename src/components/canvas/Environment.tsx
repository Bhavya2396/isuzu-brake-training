import { useRef } from 'react';
import { Environment as DreiEnvironment, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';

export function Environment() {
  const floorRef = useRef<THREE.Mesh>(null);
  
  return (
    <>
      {/* HDRI environment for realistic reflections */}
      <DreiEnvironment
        files="/hdri/studio.hdr"
        background={false}
        blur={0.4}
      />
      
      {/* Main light */}
      <ambientLight intensity={0.4} />
      
      {/* Key light from above */}
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-8, 8, -5]}
        intensity={0.4}
        color="#88ccff"
      />
      
      {/* Rim light for definition */}
      <directionalLight
        position={[0, 5, -10]}
        intensity={0.6}
        color="#ffffff"
      />
      
      {/* Subtle contact shadows */}
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.5}
        scale={25}
        blur={2}
        far={6}
        color="#000022"
      />
      
      {/* Clean grid floor */}
      <Grid
        position={[0, -0.5, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1a2a3a"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#2a4a6a"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />
    </>
  );
}
