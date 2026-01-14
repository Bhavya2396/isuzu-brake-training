import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Wrench, Package, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { voiceover, narrations } from '../../../services/voiceoverService';

const tools = [
  { 
    id: 'ratchet-wrench', 
    name: 'Socket Wrench', 
    description: 'For lug nuts and caliper bolts',
    cameraPosition: [-4, 1, 2] as [number, number, number],
    cameraTarget: [-3, 0, 0] as [number, number, number]
  },
  { 
    id: 'torque-wrench', 
    name: 'Torque Wrench', 
    description: 'For proper bolt specifications',
    cameraPosition: [0, 2, 3] as [number, number, number],
    cameraTarget: [0, 0.5, 0] as [number, number, number]
  },
  { 
    id: 'car-lift', 
    name: 'Jack / Lift', 
    description: 'To safely raise vehicle',
    cameraPosition: [5, 1.5, 3] as [number, number, number],
    cameraTarget: [3.5, -0.5, 0] as [number, number, number]
  }
];

const parts = [
  { id: 'brake-pads', name: 'Brake Pads', description: 'New replacement pads' },
  { id: 'shims', name: 'Shims', description: 'Anti-squeal shims (if needed)' }
];

export function ToolsScreen() {
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  const selectedPart = useStore(state => state.selectedPart);
  const setSelectedPart = useStore(state => state.setSelectedPart);
  const focusOnPoint = useStore(state => state.focusOnPoint);
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Play intro
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled) {
      voiceover.speak(narrations.tools.intro);
      setHasPlayedIntro(true);
    }
    return () => voiceover.stop();
  }, [hasPlayedIntro, voiceEnabled]);

  const handleToolClick = (tool: typeof tools[0]) => {
    voiceover.stop();
    
    if (selectedPart === tool.id) {
      setSelectedPart(null);
      focusOnPoint([6, 3, 6], [0, 0, 0]);
      return;
    }
    
    setSelectedPart(tool.id);
    focusOnPoint(tool.cameraPosition, tool.cameraTarget);
  };

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) voiceover.stop();
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
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Tools & Parts</h2>
              </div>
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Click tools to view in 3D
            </p>
          </div>

          {/* Tools */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase">Tools Required</span>
            </div>
            <div className="space-y-2 mb-4">
              {tools.map((tool) => {
                const isSelected = selectedPart === tool.id;
                return (
                  <motion.button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">{tool.name}</p>
                      <p className="text-xs text-gray-500">{tool.description}</p>
                    </div>
                    <span className="text-xs text-primary">{isSelected ? 'viewing' : 'view'}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Parts */}
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase">Parts Required</span>
            </div>
            <div className="space-y-2">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div>
                    <p className="font-medium text-white text-sm">{part.name}</p>
                    <p className="text-xs text-gray-500">{part.description}</p>
                  </div>
                </div>
              ))}
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
              Begin Procedure
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
