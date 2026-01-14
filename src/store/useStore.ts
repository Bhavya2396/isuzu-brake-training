import { create } from 'zustand';
import { ScreenType, ChatMessage, QuizAnswer, StoreState } from '../types';
import { SCREEN_ORDER, getNextScreen, getPrevScreen } from '../data/screens';
import { safetyItems } from '../data/steps';
import { quizQuestions } from '../data/quizQuestions';

const initialSafetyChecks: Record<string, boolean> = {};
safetyItems.forEach(item => {
  initialSafetyChecks[item.key] = false;
});

// Extended store state with camera focus
interface ExtendedStoreState extends StoreState {
  // Camera focus
  cameraFocusTarget: {
    position: [number, number, number];
    target: [number, number, number];
  } | null;
  focusOnPoint: (position: [number, number, number], target: [number, number, number]) => void;
  clearCameraFocus: () => void;
  
  // Interactive demo state
  showCarLift: boolean;
  setShowCarLift: (show: boolean) => void;
  animationState: string | null;
  setAnimationState: (state: string | null) => void;
}

export const useStore = create<ExtendedStoreState>((set, get) => ({
  // Navigation
  currentScreen: 'landing',
  currentStepIndex: 0,
  
  // 3D Scene
  hoveredPart: null,
  selectedPart: null,
  explodedView: false,
  explodeProgress: 0,
  activeModel: 'land-cruiser',
  
  // Camera focus
  cameraFocusTarget: null,
  
  // Interactive demo
  showCarLift: false,
  animationState: null,
  
  // Safety
  safetyChecks: initialSafetyChecks,
  allSafetyChecked: false,
  
  // Quiz
  quizAnswers: [],
  quizScore: 0,
  quizComplete: false,
  
  // AI Chat
  chatOpen: false,
  chatMessages: [],
  chatLoading: false,
  
  // Actions
  setScreen: (screen: ScreenType) => {
    const index = SCREEN_ORDER.indexOf(screen);
    set({ 
      currentScreen: screen, 
      currentStepIndex: index,
      selectedPart: null,
      hoveredPart: null,
      cameraFocusTarget: null,
      animationState: null
    });
  },
  
  nextScreen: () => {
    const { currentScreen } = get();
    const next = getNextScreen(currentScreen);
    if (next) {
      const index = SCREEN_ORDER.indexOf(next);
      set({ 
        currentScreen: next, 
        currentStepIndex: index,
        selectedPart: null,
        hoveredPart: null,
        explodedView: false,
        explodeProgress: 0,
        cameraFocusTarget: null,
        animationState: null
      });
    }
  },
  
  prevScreen: () => {
    const { currentScreen } = get();
    const prev = getPrevScreen(currentScreen);
    if (prev) {
      const index = SCREEN_ORDER.indexOf(prev);
      set({ 
        currentScreen: prev, 
        currentStepIndex: index,
        selectedPart: null,
        hoveredPart: null,
        explodedView: false,
        explodeProgress: 0,
        cameraFocusTarget: null,
        animationState: null
      });
    }
  },
  
  setHoveredPart: (partId: string | null) => {
    set({ hoveredPart: partId });
  },
  
  setSelectedPart: (partId: string | null) => {
    set({ selectedPart: partId });
  },
  
  toggleExplodedView: () => {
    const { explodedView } = get();
    set({ explodedView: !explodedView });
  },
  
  setExplodeProgress: (progress: number) => {
    set({ explodeProgress: Math.max(0, Math.min(1, progress)) });
  },
  
  setActiveModel: (modelId: string) => {
    set({ 
      activeModel: modelId,
      selectedPart: null,
      hoveredPart: null,
      explodedView: false,
      explodeProgress: 0
    });
  },
  
  // Camera focus actions
  focusOnPoint: (position: [number, number, number], target: [number, number, number]) => {
    set({ cameraFocusTarget: { position, target } });
  },
  
  clearCameraFocus: () => {
    set({ cameraFocusTarget: null });
  },
  
  // Interactive demo actions
  setShowCarLift: (show: boolean) => {
    set({ showCarLift: show });
  },
  
  setAnimationState: (state: string | null) => {
    set({ animationState: state });
  },
  
  toggleSafetyCheck: (key: string) => {
    const { safetyChecks } = get();
    const newChecks = { ...safetyChecks, [key]: !safetyChecks[key] };
    const allChecked = Object.values(newChecks).every(v => v);
    set({ safetyChecks: newChecks, allSafetyChecked: allChecked });
  },
  
  submitQuizAnswer: (questionId: number, selectedIndex: number) => {
    const { quizAnswers } = get();
    const question = quizQuestions.find(q => q.id === questionId);
    const isCorrect = question ? question.correctIndex === selectedIndex : false;
    
    const existingIndex = quizAnswers.findIndex(a => a.questionId === questionId);
    let newAnswers: QuizAnswer[];
    
    if (existingIndex >= 0) {
      newAnswers = [...quizAnswers];
      newAnswers[existingIndex] = { questionId, selectedIndex, isCorrect };
    } else {
      newAnswers = [...quizAnswers, { questionId, selectedIndex, isCorrect }];
    }
    
    const correctCount = newAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / quizQuestions.length) * 100);
    const complete = newAnswers.length === quizQuestions.length;
    
    set({ 
      quizAnswers: newAnswers, 
      quizScore: score,
      quizComplete: complete
    });
  },
  
  toggleChat: () => {
    const { chatOpen } = get();
    set({ chatOpen: !chatOpen });
  },
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const { chatMessages } = get();
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    set({ chatMessages: [...chatMessages, newMessage] });
  },
  
  setChatLoading: (loading: boolean) => {
    set({ chatLoading: loading });
  },
  
  reset: () => {
    set({
      currentScreen: 'landing',
      currentStepIndex: 0,
      hoveredPart: null,
      selectedPart: null,
      explodedView: false,
      explodeProgress: 0,
      activeModel: 'land-cruiser',
      cameraFocusTarget: null,
      showCarLift: false,
      animationState: null,
      safetyChecks: initialSafetyChecks,
      allSafetyChecked: false,
      quizAnswers: [],
      quizScore: 0,
      quizComplete: false,
      chatMessages: [],
      chatLoading: false
    });
  }
}));

// Selector hooks for performance optimization
export const useCurrentScreen = () => useStore(state => state.currentScreen);
export const useNavigation = () => useStore(state => ({
  currentScreen: state.currentScreen,
  currentStepIndex: state.currentStepIndex,
  setScreen: state.setScreen,
  nextScreen: state.nextScreen,
  prevScreen: state.prevScreen
}));
export const useSceneState = () => useStore(state => ({
  hoveredPart: state.hoveredPart,
  selectedPart: state.selectedPart,
  explodedView: state.explodedView,
  explodeProgress: state.explodeProgress,
  activeModel: state.activeModel,
  setHoveredPart: state.setHoveredPart,
  setSelectedPart: state.setSelectedPart,
  toggleExplodedView: state.toggleExplodedView,
  setExplodeProgress: state.setExplodeProgress,
  setActiveModel: state.setActiveModel
}));
export const useSafetyState = () => useStore(state => ({
  safetyChecks: state.safetyChecks,
  allSafetyChecked: state.allSafetyChecked,
  toggleSafetyCheck: state.toggleSafetyCheck
}));
export const useQuizState = () => useStore(state => ({
  quizAnswers: state.quizAnswers,
  quizScore: state.quizScore,
  quizComplete: state.quizComplete,
  submitQuizAnswer: state.submitQuizAnswer
}));
export const useChatState = () => useStore(state => ({
  chatOpen: state.chatOpen,
  chatMessages: state.chatMessages,
  chatLoading: state.chatLoading,
  toggleChat: state.toggleChat,
  addChatMessage: state.addChatMessage,
  setChatLoading: state.setChatLoading
}));
export const useCameraFocus = () => useStore(state => ({
  cameraFocusTarget: state.cameraFocusTarget,
  focusOnPoint: state.focusOnPoint,
  clearCameraFocus: state.clearCameraFocus
}));
