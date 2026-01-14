import { Screen, ScreenType } from '../types';

export const SCREEN_ORDER: ScreenType[] = [
  'landing',
  'objectives',
  'context',
  'safety',
  'tools',
  'step1',
  'step2',
  'step3',
  'step4',
  'step5',
  'postInstall',
  'quiz',
  'complete'
];

// Model mappings for each screen with optimized camera positions
export const screens: Record<ScreenType, Screen> = {
  // Landing: Full car, rotating, cinematic view
  landing: {
    id: 'landing',
    title: 'Front Brake Pad Replacement',
    subtitle: 'Interactive Training Module',
    model: 'land-cruiser',
    cameraPosition: [12, 5, 12],
    cameraTarget: [0, 0, 0]
  },
  
  // Objectives: Keep car visible but subtle
  objectives: {
    id: 'objectives',
    title: 'Learning Objectives',
    model: 'land-cruiser',
    cameraPosition: [10, 4, 10],
    cameraTarget: [0, 0, 0]
  },
  
  // Context: Show brake assembly to explain parts
  context: {
    id: 'context',
    title: 'Vehicle Context & Scope',
    model: 'brake-assembly',
    cameraPosition: [2, 1, 2],
    cameraTarget: [0, 0, 0],
    exploded: false
  },
  
  // Safety: Back to car for context
  safety: {
    id: 'safety',
    title: 'Safety Checklist',
    subtitle: 'Complete all items before proceeding',
    model: 'land-cruiser',
    cameraPosition: [10, 4, 10],
    cameraTarget: [0, 0, 0]
  },
  
  // Tools: Show the tools
  tools: {
    id: 'tools',
    title: 'Tools & Parts Overview',
    model: 'tools',
    cameraPosition: [6, 3, 6],
    cameraTarget: [0, 0.5, 0]
  },
  
  // Step 1: Wheel removal - show wheel with exploded view enabled
  step1: {
    id: 'step1',
    title: 'Step 1: Wheel Removal',
    model: 'wheel-brake',
    focusPart: 'tire-low_tire-low_0',
    cameraPosition: [2.5, 1.2, 2.5],
    cameraTarget: [0, 0, 0],
    exploded: false // Can be toggled by user
  },
  
  // Step 2: Access caliper - show brake assembly, highlight caliper
  step2: {
    id: 'step2',
    title: 'Step 2: Access Brake Caliper',
    model: 'brake-assembly',
    focusPart: 'Object_10',
    cameraPosition: [2, 1, 2],
    cameraTarget: [0, 0, 0],
    exploded: false
  },
  
  // Step 3: Remove pads - exploded view
  step3: {
    id: 'step3',
    title: 'Step 3: Remove Old Brake Pads',
    model: 'brake-assembly',
    focusPart: 'Object_4',
    cameraPosition: [2.5, 1.5, 2.5],
    cameraTarget: [0, 0.1, 0],
    exploded: true
  },
  
  // Step 4: Install new pads - still exploded
  step4: {
    id: 'step4',
    title: 'Step 4: Install New Brake Pads',
    model: 'brake-assembly',
    focusPart: 'Object_4',
    cameraPosition: [2.5, 1.5, 2.5],
    cameraTarget: [0, 0.1, 0],
    exploded: true
  },
  
  // Step 5: Reassembly - assembled view
  step5: {
    id: 'step5',
    title: 'Step 5: Reassembly',
    model: 'brake-assembly',
    cameraPosition: [2, 1, 2],
    cameraTarget: [0, 0, 0],
    exploded: false
  },
  
  // Post-install checks - assembled brake
  postInstall: {
    id: 'postInstall',
    title: 'Post-Installation Checks',
    model: 'brake-assembly',
    cameraPosition: [2, 1, 2],
    cameraTarget: [0, 0, 0],
    exploded: false
  },
  
  // Quiz - brake assembly in background
  quiz: {
    id: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Scenario-Based Assessment',
    model: 'brake-assembly',
    cameraPosition: [3, 1.5, 3],
    cameraTarget: [0, 0, 0],
    exploded: false
  },
  
  // Complete - back to full car
  complete: {
    id: 'complete',
    title: 'Training Complete',
    model: 'land-cruiser',
    cameraPosition: [12, 5, 12],
    cameraTarget: [0, 0, 0]
  }
};

export const getNextScreen = (current: ScreenType): ScreenType | null => {
  const currentIndex = SCREEN_ORDER.indexOf(current);
  if (currentIndex < SCREEN_ORDER.length - 1) {
    return SCREEN_ORDER[currentIndex + 1];
  }
  return null;
};

export const getPrevScreen = (current: ScreenType): ScreenType | null => {
  const currentIndex = SCREEN_ORDER.indexOf(current);
  if (currentIndex > 0) {
    return SCREEN_ORDER[currentIndex - 1];
  }
  return null;
};

export const getScreenIndex = (screen: ScreenType): number => {
  return SCREEN_ORDER.indexOf(screen);
};

export const getTotalScreens = (): number => {
  return SCREEN_ORDER.length;
};
