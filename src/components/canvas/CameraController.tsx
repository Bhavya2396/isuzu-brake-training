import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { screens } from '../../data/screens';

interface CameraControllerProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export function CameraController({
  autoRotate = false,
  autoRotateSpeed = 0.3,
  enablePan = false,
  minDistance = 1,
  maxDistance = 40,
  minPolarAngle = 0.2,
  maxPolarAngle = Math.PI / 2
}: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const currentScreen = useStore(state => state.currentScreen);
  const cameraFocusTarget = useStore(state => state.cameraFocusTarget);
  const prevScreenRef = useRef(currentScreen);
  const isAnimatingRef = useRef(false);

  // Animate camera when screen changes
  useEffect(() => {
    if (prevScreenRef.current !== currentScreen && controlsRef.current) {
      const screenConfig = screens[currentScreen];
      
      if (screenConfig?.cameraPosition && screenConfig?.cameraTarget) {
        animateCamera(
          screenConfig.cameraPosition,
          screenConfig.cameraTarget,
          1.5
        );
      }
      
      prevScreenRef.current = currentScreen;
    }
  }, [currentScreen, camera]);

  // Animate camera when focus target changes
  useEffect(() => {
    if (cameraFocusTarget && controlsRef.current) {
      animateCamera(
        cameraFocusTarget.position,
        cameraFocusTarget.target,
        1.0
      );
    }
  }, [cameraFocusTarget, camera]);

  // Helper function to animate camera
  const animateCamera = (
    position: [number, number, number],
    target: [number, number, number],
    duration: number
  ) => {
    if (!controlsRef.current) return;
    
    const targetPosition = new THREE.Vector3(...position);
    const targetLookAt = new THREE.Vector3(...target);
    
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);
    
    isAnimatingRef.current = true;
    
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
      }
    });
    
    gsap.to(controlsRef.current.target, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        controlsRef.current?.update();
      }
    });
  };

  // Set initial camera position on mount
  useEffect(() => {
    const screenConfig = screens[currentScreen];
    if (screenConfig?.cameraPosition) {
      camera.position.set(...screenConfig.cameraPosition);
    }
    if (screenConfig?.cameraTarget && controlsRef.current) {
      controlsRef.current.target.set(...screenConfig.cameraTarget);
      controlsRef.current.update();
    }
  }, []);

  const shouldAutoRotate = autoRotate && 
    (currentScreen === 'landing' || currentScreen === 'complete') && 
    !isAnimatingRef.current &&
    !cameraFocusTarget;

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={shouldAutoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enablePan={enablePan}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
      zoomSpeed={0.7}
      makeDefault
    />
  );
}
