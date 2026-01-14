import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Layers, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { trainingSteps, getStepByScreen } from '../../../data/steps';
import { voiceover, narrations } from '../../../services/voiceoverService';
import { DemoOverlay } from '../shared/DemoOverlay';

// Maps instructions to 3D actions (explode, focus, etc.)
const instructionActions: Record<string, Record<number, { 
  action: 'explode' | 'focus' | 'highlight';
  partName?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
}>> = {
  step1: {
    0: { action: 'highlight', partName: 'wheel-full_wheel-brake-disc_0' },
    1: { action: 'explode' },
    2: { action: 'focus', cameraPosition: [2, 1, 2], cameraTarget: [0, 0, 0] }
  },
  step2: {
    0: { action: 'highlight', partName: 'Object_10' },
    1: { action: 'focus', partName: 'Object_10', cameraPosition: [1.5, 1, 1.5], cameraTarget: [0, 0.1, 0] },
    2: { action: 'explode' }, // "slide caliper off rotor" triggers explode
    3: { action: 'highlight', partName: 'Object_11' }
  },
  step3: {
    0: { action: 'focus', partName: 'Object_4', cameraPosition: [1.5, 1.2, 1.5], cameraTarget: [0, 0.1, 0] },
    1: { action: 'explode' },
    2: { action: 'highlight', partName: 'Object_4' },
    3: { action: 'highlight', partName: 'Object_4' }
  },
  step4: {
    0: { action: 'focus', partName: 'Object_4', cameraPosition: [1.5, 1.2, 1.5], cameraTarget: [0, 0.1, 0] },
    1: { action: 'highlight', partName: 'Object_4' },
    2: { action: 'focus', cameraPosition: [2, 1, 2], cameraTarget: [0, 0, 0] },
    3: { action: 'explode' }
  },
  step5: {
    0: { action: 'focus', partName: 'Object_10', cameraPosition: [2, 1, 2], cameraTarget: [0, 0, 0] },
    1: { action: 'highlight', partName: 'Object_10' },
    2: { action: 'focus', cameraPosition: [2.5, 1.5, 2.5], cameraTarget: [0, 0, 0] },
    3: { action: 'focus', cameraPosition: [2.5, 1.2, 2.5], cameraTarget: [0, 0, 0] }
  }
};

// Map steps to demo illustrations
const stepDemoMap: Record<string, string> = {
  step1: 'lug-nut-pattern',
  step2: 'caliper-support',
  step4: 'pad-orientation',
  step5: 'torque-spec'
};

export function StepScreen() {
  const currentScreen = useStore(state => state.currentScreen);
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  const explodedView = useStore(state => state.explodedView);
  const setSelectedPart = useStore(state => state.setSelectedPart);
  const focusOnPoint = useStore(state => state.focusOnPoint);
  
  const [activeInstruction, setActiveInstruction] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  const step = getStepByScreen(currentScreen);
  
  // Reset state when screen changes
  useEffect(() => {
    setActiveInstruction(null);
    setHasPlayedIntro(false);
    setShowDemo(true);
    voiceover.stop();
  }, [currentScreen]);

  // Play intro narration when entering screen
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled && step) {
      const screenNarrations = narrations[currentScreen as keyof typeof narrations];
      if (screenNarrations && 'intro' in screenNarrations) {
        voiceover.speak(screenNarrations.intro as string);
        setHasPlayedIntro(true);
      }
    }
  }, [currentScreen, hasPlayedIntro, voiceEnabled, step]);

  const handleInstructionClick = useCallback((index: number) => {
    // Stop any current speech
    voiceover.stop();
    
    // Toggle instruction
    if (activeInstruction === index) {
      setActiveInstruction(null);
      setSelectedPart(null);
      useStore.setState({ explodedView: false });
      return;
    }
    
    setActiveInstruction(index);
    
    // Execute 3D action
    const actions = instructionActions[currentScreen];
    const action = actions?.[index];
    
    if (action) {
      if (action.action === 'explode') {
        useStore.setState({ explodedView: true });
      }
      if (action.action === 'highlight' && action.partName) {
        setSelectedPart(action.partName);
      }
      if (action.action === 'focus' && action.cameraPosition && action.cameraTarget) {
        focusOnPoint(action.cameraPosition, action.cameraTarget);
      }
      if (action.partName) {
        setSelectedPart(action.partName);
      }
    }
    
    // Play voiceover for this instruction
    if (voiceEnabled && step) {
      const screenNarrations = narrations[currentScreen as keyof typeof narrations];
      const instructionKey = `instruction${index + 1}` as keyof typeof screenNarrations;
      if (screenNarrations && instructionKey in screenNarrations) {
        voiceover.speak(screenNarrations[instructionKey] as string);
      }
    }
  }, [activeInstruction, currentScreen, voiceEnabled, step, setSelectedPart, focusOnPoint]);

  const handleToggleExplode = () => {
    voiceover.stop();
    useStore.setState({ explodedView: !explodedView });
  };

  const handleResetView = () => {
    voiceover.stop();
    setActiveInstruction(null);
    setSelectedPart(null);
    useStore.setState({ explodedView: false });
    focusOnPoint([2, 1, 2], [0, 0, 0]);
  };

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) {
      voiceover.stop();
    }
  };

  const handleNext = () => {
    voiceover.stop();
    nextScreen();
  };

  const handlePrev = () => {
    voiceover.stop();
    prevScreen();
  };
  
  if (!step) return null;

  const stepNumber = trainingSteps.findIndex(s => s.screen === currentScreen) + 1;
  const totalSteps = trainingSteps.length;

  const activeDemo = showDemo ? stepDemoMap[currentScreen] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none"
    >
      {/* Animated SVG Demo Overlay */}
      {activeDemo && (
        <div className="pointer-events-auto">
          <DemoOverlay activeDemo={activeDemo} />
        </div>
      )}
      
      <div className="pointer-events-auto w-full max-w-sm mr-6">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                Step {stepNumber} of {totalSteps}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleVoice}
                  className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
                  title={voiceEnabled ? 'Mute voiceover' : 'Enable voiceover'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleResetView}
                  className="p-2 rounded-lg text-gray-400 hover:text-white transition-all"
                  title="Reset view"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleExplode}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                    explodedView ? 'bg-highlight/20 text-highlight' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  {explodedView ? 'Assembled' : 'Exploded'}
                </button>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white">{step.title}</h2>
          </div>

          {/* Instructions */}
          <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
            {step.instructions.map((instruction, index) => {
              const isActive = activeInstruction === index;
              const hasAction = instructionActions[currentScreen]?.[index];
              
              return (
                <motion.button
                  key={index}
                  onClick={() => handleInstructionClick(index)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isActive ? 'bg-primary text-black' : 'bg-white/10 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {instruction}
                    </p>
                    {hasAction && (
                      <p className="text-xs text-primary/70 mt-1">
                        Click to {hasAction.action === 'explode' ? 'see exploded view' : 'focus on component'}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}

            {/* Warning */}
            {step.warning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-danger/10 border border-danger/30"
              >
                <p className="text-sm text-danger">{step.warning}</p>
              </motion.div>
            )}

            {/* Tip */}
            {step.tip && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-primary/10 border border-primary/30"
              >
                <p className="text-sm text-gray-300">💡 {step.tip}</p>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium hover:bg-primary/90 transition-all"
            >
              {stepNumber === totalSteps ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
