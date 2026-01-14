import { useRef, useEffect, useMemo, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import gsap from 'gsap';

interface PartInfo {
  label: string;
  description: string;
  explodeDir: [number, number, number];
  explodeDistance: number;
}

interface ModelViewerProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  partsConfig?: Record<string, PartInfo>;
  interactive?: boolean;
  highlightColor?: string;
  showLabels?: boolean;
}

export function ModelViewer({
  path,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  partsConfig,
  interactive = true,
  highlightColor = '#00ff88',
  showLabels = true
}: ModelViewerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);
  const [partPositions, setPartPositions] = useState<Map<string, THREE.Vector3>>(new Map());
  
  // Clone scene and materials
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
  
  const hoveredPart = useStore(state => state.hoveredPart);
  const selectedPart = useStore(state => state.selectedPart);
  const explodedView = useStore(state => state.explodedView);
  const setHoveredPart = useStore(state => state.setHoveredPart);
  const setSelectedPart = useStore(state => state.setSelectedPart);

  // Store original positions for exploded view
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());

  // Initialize original positions and track part world positions
  useEffect(() => {
    const positions = new Map<string, THREE.Vector3>();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        originalPositions.current.set(child.name, child.position.clone());
        // Get world position for labels
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        positions.set(child.name, worldPos);
      }
    });
    setPartPositions(positions);
  }, [clonedScene]);

  // Update part positions each frame for labels
  useFrame(() => {
    if (partsConfig && showLabels) {
      const newPositions = new Map<string, THREE.Vector3>();
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && partsConfig[child.name]) {
          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);
          newPositions.set(child.name, worldPos);
        }
      });
      // Only update if positions changed significantly
      let hasChanged = false;
      newPositions.forEach((pos, name) => {
        const oldPos = partPositions.get(name);
        if (!oldPos || pos.distanceTo(oldPos) > 0.01) {
          hasChanged = true;
        }
      });
      if (hasChanged) {
        setPartPositions(newPositions);
      }
    }
  });

  // Apply exploded view animation
  useEffect(() => {
    if (!partsConfig) return;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name) {
        const partConfig = partsConfig[child.name];
        const originalPos = originalPositions.current.get(child.name);
        
        if (partConfig && originalPos) {
          const targetPos = explodedView
            ? new THREE.Vector3(
                originalPos.x + partConfig.explodeDir[0] * partConfig.explodeDistance,
                originalPos.y + partConfig.explodeDir[1] * partConfig.explodeDistance,
                originalPos.z + partConfig.explodeDir[2] * partConfig.explodeDistance
              )
            : originalPos;
          
          gsap.to(child.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      }
    });
  }, [explodedView, partsConfig, clonedScene]);

  // Apply hover/selection effects with pulsing glow
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        const isHovered = child.name === hoveredPart;
        const isSelected = child.name === selectedPart;
        
        if (isHovered || isSelected) {
          if (!material.userData.originalEmissive) {
            material.userData.originalEmissive = material.emissive?.clone() || new THREE.Color(0x000000);
            material.userData.originalEmissiveIntensity = material.emissiveIntensity || 0;
          }
          material.emissive = new THREE.Color(highlightColor);
          material.emissiveIntensity = isSelected ? 0.5 : 0.3;
        } else {
          if (material.userData.originalEmissive) {
            material.emissive = material.userData.originalEmissive;
            material.emissiveIntensity = material.userData.originalEmissiveIntensity;
          }
        }
      }
    });
  }, [hoveredPart, selectedPart, clonedScene, highlightColor]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (mesh.name && partsConfig?.[mesh.name]) {
      setHoveredPart(mesh.name);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (!interactive) return;
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (mesh.name && partsConfig?.[mesh.name]) {
      setSelectedPart(selectedPart === mesh.name ? null : mesh.name);
    }
  };

  // Get selected/hovered part info
  const activePart = selectedPart || hoveredPart;
  const activePartInfo = activePart && partsConfig?.[activePart];

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
      scale={scale}
    >
      <primitive 
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      
      {/* Interactive Labels for each part */}
      {showLabels && partsConfig && Object.entries(partsConfig).map(([partName, partInfo]) => {
        const isActive = partName === hoveredPart || partName === selectedPart;
        const partPos = partPositions.get(partName);
        
        if (!partPos) return null;
        
        // Calculate label position relative to group
        const labelPos: [number, number, number] = [
          (partPos.x - position[0]) / scale,
          (partPos.y - position[1]) / scale + 0.05,
          (partPos.z - position[2]) / scale
        ];
        
        return (
          <group key={partName} position={labelPos}>
            {/* Connection line when active */}
            {isActive && (
              <mesh>
                <cylinderGeometry args={[0.002, 0.002, 0.1, 8]} />
                <meshBasicMaterial color={highlightColor} transparent opacity={0.5} />
              </mesh>
            )}
            
            {/* Label */}
            {isActive && (
              <Html
                position={[0, 0.08, 0]}
                center
                style={{ pointerEvents: 'none' }}
                distanceFactor={1.5}
              >
                <div 
                  className="px-4 py-3 rounded-xl min-w-[200px] animate-fade-in"
                  style={{
                    background: 'rgba(10, 10, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${partName === selectedPart ? '#00ff88' : '#00d4ff'}`,
                    boxShadow: `0 4px 20px ${partName === selectedPart ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 212, 255, 0.3)'}`,
                    transform: 'translateY(-100%)'
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1">{partInfo.label}</p>
                  <p className="text-xs text-gray-400">{partInfo.description}</p>
                </div>
              </Html>
            )}
            
            {/* Small indicator dot when not active but interactive */}
            {!isActive && interactive && (
              <mesh>
                <sphereGeometry args={[0.01, 16, 16]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Preload commonly used models
useGLTF.preload('/models/components/brake-assembly/brake-assembly.gltf');
useGLTF.preload('/models/components/wheel-brake/scene.gltf');
useGLTF.preload('/models/vehicles/land-cruiser/scene.gltf');
