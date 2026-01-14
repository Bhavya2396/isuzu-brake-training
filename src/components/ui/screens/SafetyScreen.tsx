import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Check, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { safetyItems } from '../../../data/steps';
import { voiceover, narrations } from '../../../services/voiceoverService';

const safetyFocus: Record<string, { 
  position: [number, number, number]; 
  target: [number, number, number];
}> = {
  vehicle_secured: { position: [8, 2, 4], target: [0, -0.5, 0] },
  parking_brake: { position: [4, 2, 8], target: [0, 0, 0] },
  ppe: { position: [12, 5, 12], target: [0, 0, 0] },
  wheel_chocks: { position: [6, 1.5, 6], target: [0, -0.5, 0] }
};

export function SafetyScreen() {
  const safetyChecks = useStore(state => state.safetyChecks);
  const allSafetyChecked = useStore(state => state.allSafetyChecked);
  const toggleSafetyCheck = useStore(state => state.toggleSafetyCheck);
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  const focusOnPoint = useStore(state => state.focusOnPoint);
  const setShowCarLift = useStore(state => state.setShowCarLift);
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Play intro
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled) {
      voiceover.speak(narrations.safety.intro);
      setHasPlayedIntro(true);
    }
    return () => voiceover.stop();
  }, [hasPlayedIntro, voiceEnabled]);

  const handleItemClick = (key: string) => {
    voiceover.stop();
    
    // Toggle active
    if (activeItem === key) {
      setActiveItem(null);
      setShowCarLift(false);
      return;
    }
    
    setActiveItem(key);
    
    // Camera focus
    const focus = safetyFocus[key];
    if (focus) {
      focusOnPoint(focus.position, focus.target);
    }
    
    // Show car lift for vehicle_secured
    setShowCarLift(key === 'vehicle_secured');
    
    // Play narration
    if (voiceEnabled) {
      const narration = narrations.safety[key as keyof typeof narrations.safety];
      if (narration) {
        voiceover.speak(narration);
      }
    }
  };

  const handleCheckToggle = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    toggleSafetyCheck(key);
  };

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) voiceover.stop();
  };

  const handleNext = () => {
    voiceover.stop();
    setShowCarLift(false);
    nextScreen();
  };

  const handlePrev = () => {
    voiceover.stop();
    setShowCarLift(false);
    prevScreen();
  };

  const checkedCount = Object.values(safetyChecks).filter(Boolean).length;

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
                <ShieldCheck className="w-5 h-5 text-warning" />
                <h2 className="text-lg font-semibold text-white">Safety Checklist</h2>
              </div>
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Complete all items before proceeding
            </p>
          </div>

          {/* Safety items */}
          <div className="p-4 space-y-2">
            {safetyItems.map((item) => {
              const isChecked = safetyChecks[item.key];
              const isActive = activeItem === item.key;
              
              return (
                <motion.div
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-primary/20 border border-primary'
                      : isChecked
                      ? 'bg-success/10 border border-success/30'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => handleCheckToggle(e, item.key)}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                      isChecked ? 'bg-success' : 'bg-white/10 border border-white/20'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4 text-white" />}
                  </button>
                  
                  {/* Label */}
                  <span className={`flex-1 text-sm ${isChecked ? 'text-success' : 'text-white'}`}>
                    {item.label}
                  </span>
                  
                  {/* Indicator */}
                  <span className="text-xs text-gray-500">
                    {isActive ? 'viewing' : 'click to view'}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500">Progress</span>
              <span className="text-primary">{checkedCount} / {safetyItems.length}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-warning to-success"
                animate={{ width: `${(checkedCount / safetyItems.length) * 100}%` }}
              />
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
              disabled={!allSafetyChecked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                allSafetyChecked
                  ? 'bg-success text-white'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              {allSafetyChecked ? 'Continue' : 'Complete all checks'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
