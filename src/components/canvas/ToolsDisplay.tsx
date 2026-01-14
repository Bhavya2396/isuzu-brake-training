import { useRef, useMemo, useEffect } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import gsap from 'gsap';

interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

// Tool configurations - ALL PROPERLY SCALED to match socket wrench
const tools: Tool[] = [
  {
    id: 'ratchet-wrench',
    name: 'Socket Wrench',
    description: 'For loosening lug nuts and caliper bolts',
    path: '/models/tools/scene.gltf',
    scale: 12,
    position: [-3, 0.5, 0],
    rotation: [0, 0, Math.PI / 6]
  },
  {
    id: 'torque-wrench',
    name: 'Torque Wrench',
    description: 'Ensures proper bolt tightening specifications',
    path: '/models/tools/torque-wrench/scene.gltf',
    scale: 0.7, // MASSIVE INCREASE - was 0.15, now ~5x bigger
    position: [0, 0.8, 0],
    rotation: [0, Math.PI / 4, 0]
  },
  {
    id: 'car-lift',
    name: 'Car Lift / Jack',
    description: 'Safely lifts vehicle for brake access',
    path: '/models/tools/car-lift/scene.gltf',
    scale: 0.5, // MASSIVE INCREASE - was 0.1, now 5x bigger
    position: [3.5, -0.1, 0],
    rotation: [0, -Math.PI / 6, 0]
  }
];

function ToolModel({ tool }: { tool: Tool }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(tool.path);
  
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
  
  const selectedPart = useStore(state => state.selectedPart);
  const setSelectedPart = useStore(state => state.setSelectedPart);
  const hoveredPart = useStore(state => state.hoveredPart);
  const setHoveredPart = useStore(state => state.setHoveredPart);
  
  const isSelected = selectedPart === tool.id;
  const isHovered = hoveredPart === tool.id;

  // Animate when selected
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: isSelected ? tool.scale * 1.1 : tool.scale,
        y: isSelected ? tool.scale * 1.1 : tool.scale,
        z: isSelected ? tool.scale * 1.1 : tool.scale,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isSelected, tool.scale]);

  // Gentle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = tool.rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Glow effect
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (isHovered || isSelected) {
          material.emissive = new THREE.Color(isSelected ? '#00ff88' : '#00d4ff');
          material.emissiveIntensity = isSelected ? 0.3 : 0.15;
        } else {
          material.emissive = new THREE.Color('#000000');
          material.emissiveIntensity = 0;
        }
      }
    });
  }, [isHovered, isSelected, clonedScene]);

  return (
    <group
      ref={groupRef}
      position={tool.position}
      scale={tool.scale}
      rotation={tool.rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredPart(tool.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredPart(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPart(isSelected ? null : tool.id);
      }}
    >
      <primitive object={clonedScene} />
      
      {/* Label - only show when hovered or selected */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, 0.2 / tool.scale, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="px-4 py-2 rounded-lg text-center"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: `2px solid ${isSelected ? '#00ff88' : '#00d4ff'}`,
              minWidth: '160px'
            }}
          >
            <p className="text-sm font-bold text-white">{tool.name}</p>
            <p className="text-xs text-gray-300 mt-1">{tool.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function ToolsDisplay() {
  return (
    <group position={[0, 0, 0]}>
      {tools.map((tool) => (
        <ToolModel key={tool.id} tool={tool} />
      ))}
    </group>
  );
}

// Preload
useGLTF.preload('/models/tools/scene.gltf');
useGLTF.preload('/models/tools/torque-wrench/scene.gltf');
useGLTF.preload('/models/tools/car-lift/scene.gltf');
