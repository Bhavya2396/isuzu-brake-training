import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Disc, Square, Box, Volume2, VolumeX, Layers } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { voiceover, narrations } from '../../../services/voiceoverService';

const brakeComponents = [
  {
    id: 'rotor',
    partName: 'Object_6',
    name: 'Brake Rotor',
    description: 'Metal disc that rotates with the wheel',
    icon: <Disc className="w-5 h-5" />,
    color: 'text-primary',
    narrationKey: 'rotor' as const,
    cameraPosition: [1.5, 0.8, 1.5] as [number, number, number],
    cameraTarget: [0, 0, 0] as [number, number, number]
  },
  {
    id: 'caliper',
    partName: 'Object_10',
    name: 'Brake Caliper',
    description: 'Houses pistons and brake pads',
    icon: <Box className="w-5 h-5" />,
    color: 'text-danger',
    narrationKey: 'caliper' as const,
    cameraPosition: [2, 1.2, 1.5] as [number, number, number],
    cameraTarget: [0, 0.2, 0] as [number, number, number]
  },
  {
    id: 'pads',
    partName: 'Object_4',
    name: 'Brake Pads',
    description: 'Friction material for stopping power',
    icon: <Square className="w-5 h-5" />,
    color: 'text-warning',
    narrationKey: 'pads' as const,
    cameraPosition: [1.8, 1.3, 1.8] as [number, number, number],
    cameraTarget: [0, 0.1, 0] as [number, number, number]
  }
];

export function ContextScreen() {
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  const setSelectedPart = useStore(state => state.setSelectedPart);
  const selectedPart = useStore(state => state.selectedPart);
  const focusOnPoint = useStore(state => state.focusOnPoint);
  const explodedView = useStore(state => state.explodedView);
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Play intro
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled) {
      voiceover.speak(narrations.context.intro);
      setHasPlayedIntro(true);
    }
    return () => voiceover.stop();
  }, [hasPlayedIntro, voiceEnabled]);

  const handleComponentClick = (component: typeof brakeComponents[0]) => {
    voiceover.stop();
    
    // Toggle selection
    if (selectedPart === component.partName) {
      setSelectedPart(null);
      return;
    }
    
    setSelectedPart(component.partName);
    focusOnPoint(component.cameraPosition, component.cameraTarget);
    
    // Play narration
    if (voiceEnabled) {
      const narration = narrations.context[component.narrationKey];
      if (narration) {
        voiceover.speak(narration);
      }
    }
  };

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) voiceover.stop();
  };

  const handleToggleExplode = () => {
    voiceover.stop();
    useStore.setState({ explodedView: !explodedView });
  };

  const handleNext = () => {
    voiceover.stop();
    nextScreen();
  };

  const handlePrev = () => {
    voiceover.stop();
    prevScreen();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-sm mr-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Brake Components</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleVoice}
                  className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleToggleExplode}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                    explodedView ? 'bg-highlight/20 text-highlight' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  {explodedView ? 'Assembled' : 'Exploded'}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Click each component to learn more
            </p>
          </div>

          {/* Components */}
          <div className="p-4 space-y-2">
            {brakeComponents.map((component) => {
              const isSelected = selectedPart === component.partName;
              
              return (
                <motion.button
                  key={component.id}
                  onClick={() => handleComponentClick(component)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${component.color}`}>
                    {component.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{component.name}</p>
                    <p className="text-xs text-gray-500">{component.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Note */}
          <div className="px-4 pb-4">
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-gray-400">
                <span className="text-warning font-medium">Note:</span> Specifications vary by manufacturer.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
