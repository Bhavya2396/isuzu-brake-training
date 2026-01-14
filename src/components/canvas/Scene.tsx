import { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Preload, PerformanceMonitor, AdaptiveDpr, BakeShadows, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Environment } from './Environment';
import { CameraController } from './CameraController';
import { ModelViewer } from './ModelViewer';
import { ToolsDisplay } from './ToolsDisplay';
import { useStore } from '../../store/useStore';
import { screens } from '../../data/screens';

// Model configurations with proper scales for each model type
const modelConfigs = {
  'land-cruiser': {
    path: '/models/vehicles/land-cruiser/scene.gltf',
    scale: 1.0,
    position: [0, -0.5, 0] as [number, number, number],
    rotation: [0, -30, 0] as [number, number, number],
    interactive: false,
    partsConfig: undefined
  },
  'brake-assembly': {
    path: '/models/components/brake-assembly/brake-assembly.gltf',
    scale: 12,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 30, 0] as [number, number, number],
    interactive: true,
    partsConfig: {
      'Object_4': {
        label: 'Brake Pads',
        description: 'Friction material that clamps against the rotor to slow the wheel',
        explodeDir: [0, 1, 0] as [number, number, number],
        explodeDistance: 0.25
      },
      'Object_6': {
        label: 'Brake Rotor',
        description: 'Ventilated disc that rotates with the wheel - pads press against this',
        explodeDir: [0, 0, -1] as [number, number, number],
        explodeDistance: 0.3
      },
      'Object_7': {
        label: 'Rotor Vents',
        description: 'Internal ventilation channels for heat dissipation during braking',
        explodeDir: [0, 0, -1] as [number, number, number],
        explodeDistance: 0.3
      },
      'Object_8': {
        label: 'Rotor Hub',
        description: 'Central mounting hub that connects the rotor to the wheel hub',
        explodeDir: [0, 0, -1] as [number, number, number],
        explodeDistance: 0.3
      },
      'Object_10': {
        label: 'Brake Caliper',
        description: 'Houses the pistons and pads - squeezes pads against rotor when braking',
        explodeDir: [0, 0.8, 0.3] as [number, number, number],
        explodeDistance: 0.4
      },
      'Object_11': {
        label: 'Brake Lines',
        description: 'Hydraulic lines carrying pressurized brake fluid to the caliper',
        explodeDir: [0, 0.8, 0.3] as [number, number, number],
        explodeDistance: 0.4
      }
    }
  },
  'wheel-brake': {
    path: '/models/components/wheel-brake/scene.gltf',
    scale: 3,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    interactive: true,
    partsConfig: {
      'tire-low_tire-low_0': {
        label: 'Tire',
        description: 'Rubber tire - must be removed to access the brake components',
        explodeDir: [-1, 0, 0] as [number, number, number],
        explodeDistance: 0.5
      },
      'wheel-full_wheel-brake-disc_0': {
        label: 'Wheel Rim',
        description: 'Alloy wheel rim - secured by lug nuts that must be loosened',
        explodeDir: [-0.5, 0, 0] as [number, number, number],
        explodeDistance: 0.3
      },
      'brake-caliper_wheel-brake-disc_0': {
        label: 'Brake Caliper',
        description: 'Contains the brake pads - remove mounting bolts to access',
        explodeDir: [0, 0.6, 0] as [number, number, number],
        explodeDistance: 0.35
      },
      'brake-disc_wheel-brake-disc_0': {
        label: 'Brake Disc (Rotor)',
        description: 'The rotor surface that the pads clamp onto',
        explodeDir: [0, 0, 0] as [number, number, number],
        explodeDistance: 0
      }
    }
  }
};

// Car lift model for safety demonstration
function CarLiftOverlay() {
  const showCarLift = useStore(state => state.showCarLift);
  const { scene } = useGLTF('/models/tools/car-lift/scene.gltf');
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material = child.material.clone();
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  if (!showCarLift) return null;

  return (
    <group position={[0, -0.5, 0]} scale={0.08}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Post-processing effects
function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom 
        intensity={0.2}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette 
        offset={0.35}
        darkness={0.4}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

function SceneContent() {
  const currentScreen = useStore(state => state.currentScreen);
  const screenConfig = screens[currentScreen];
  
  // Update exploded view state when screen changes
  useEffect(() => {
    const shouldExplode = screenConfig?.exploded === true;
    useStore.setState({ explodedView: shouldExplode });
  }, [currentScreen, screenConfig?.exploded]);
  
  const activeModel = useMemo(() => {
    if (screenConfig?.model === 'tools') {
      return 'tools';
    }
    return screenConfig?.model || 'land-cruiser';
  }, [screenConfig]);

  const renderModel = () => {
    if (activeModel === 'tools') {
      return <ToolsDisplay />;
    }
    
    const config = modelConfigs[activeModel as keyof typeof modelConfigs];
    if (!config) {
      return null;
    }
    
    return (
      <ModelViewer
        key={activeModel}
        path={config.path}
        scale={config.scale}
        position={config.position}
        rotation={config.rotation}
        partsConfig={config.partsConfig}
        interactive={config.interactive}
        showLabels={config.interactive}
      />
    );
  };

  return (
    <>
      <Environment />
      <CameraController 
        autoRotate={currentScreen === 'landing' || currentScreen === 'complete'}
        autoRotateSpeed={0.3}
      />
      <Suspense fallback={null}>
        {renderModel()}
        {/* Show car lift overlay when demonstrating safety */}
        {currentScreen === 'safety' && <CarLiftOverlay />}
      </Suspense>
      <PostProcessing />
      <Preload all />
      <BakeShadows />
    </>
  );
}

export function Scene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows="soft"
        camera={{ 
          position: [12, 5, 12], 
          fov: 40,
          near: 0.1,
          far: 150
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#080810']} />
        <fog attach="fog" args={['#080810', 25, 80]} />
        
        <PerformanceMonitor>
          <AdaptiveDpr pixelated />
        </PerformanceMonitor>
        
        <SceneContent />
      </Canvas>
      
      <Loader 
        containerStyles={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
          backdropFilter: 'blur(20px)'
        }}
        innerStyles={{
          background: 'rgba(255,255,255,0.1)',
          width: '300px',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden'
        }}
        barStyles={{
          background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
          height: '100%',
          borderRadius: '3px'
        }}
        dataStyles={{
          color: '#ffffff',
          fontSize: '14px',
          fontFamily: 'Space Grotesk, sans-serif',
          marginTop: '16px'
        }}
        dataInterpolation={(p) => `Loading... ${p.toFixed(0)}%`}
      />
    </div>
  );
}
