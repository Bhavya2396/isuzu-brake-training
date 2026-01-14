// Screen types
export type ScreenType = 
  | 'landing'
  | 'objectives'
  | 'context'
  | 'safety'
  | 'tools'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'postInstall'
  | 'quiz'
  | 'complete';

export interface Screen {
  id: ScreenType;
  title: string;
  subtitle?: string;
  model?: string;
  focusPart?: string;
  exploded?: boolean;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
}

// Part types
export interface PartConfig {
  label: string;
  description: string;
  explodeDir: [number, number, number];
  explodeDistance: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  path: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  parts?: Record<string, PartConfig>;
  highlightParts?: string[];
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface PartsConfig {
  models: {
    vehicles: ModelConfig[];
    components: ModelConfig[];
    tools: ToolConfig[];
  };
}

// Safety check types
export interface SafetyCheck {
  key: string;
  label: string;
  icon: string;
  checked: boolean;
}

// Quiz types
export interface QuizQuestion {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAnswer {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
}

// AI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Training step types
export interface TrainingStep {
  id: number;
  screen: ScreenType;
  title: string;
  instructions: string[];
  tip?: string;
  warning?: string;
  aiContext: string;
  focusPart?: string;
  animation?: 'explode' | 'highlight' | 'slide';
}

// Store state types
export interface StoreState {
  // Navigation
  currentScreen: ScreenType;
  currentStepIndex: number;
  
  // 3D Scene
  hoveredPart: string | null;
  selectedPart: string | null;
  explodedView: boolean;
  explodeProgress: number;
  activeModel: string;
  
  // Safety
  safetyChecks: Record<string, boolean>;
  allSafetyChecked: boolean;
  
  // Quiz
  quizAnswers: QuizAnswer[];
  quizScore: number;
  quizComplete: boolean;
  
  // AI Chat
  chatOpen: boolean;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  
  // Actions
  setScreen: (screen: ScreenType) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  setHoveredPart: (partId: string | null) => void;
  setSelectedPart: (partId: string | null) => void;
  toggleExplodedView: () => void;
  setExplodeProgress: (progress: number) => void;
  setActiveModel: (modelId: string) => void;
  toggleSafetyCheck: (key: string) => void;
  submitQuizAnswer: (questionId: number, selectedIndex: number) => void;
  toggleChat: () => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setChatLoading: (loading: boolean) => void;
  reset: () => void;
}
