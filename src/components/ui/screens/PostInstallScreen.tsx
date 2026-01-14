import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ClipboardCheck, Check, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { postInstallChecks } from '../../../data/steps';
import { voiceover, narrations } from '../../../services/voiceoverService';
import { DemoOverlay } from '../shared/DemoOverlay';

export function PostInstallScreen() {
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  
  const [completedChecks, setCompletedChecks] = useState<number[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Play intro
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled) {
      voiceover.speak(narrations.postInstall.intro);
      setHasPlayedIntro(true);
    }
    return () => voiceover.stop();
  }, [hasPlayedIntro, voiceEnabled]);

  const handleCheckClick = (id: number, index: number) => {
    voiceover.stop();
    
    if (completedChecks.includes(id)) {
      setCompletedChecks(completedChecks.filter(c => c !== id));
    } else {
      setCompletedChecks([...completedChecks, id]);
      
      // Play narration
      if (voiceEnabled) {
        const checkKey = `check${index + 1}` as keyof typeof narrations.postInstall;
        const narration = narrations.postInstall[checkKey];
        if (narration) {
          voiceover.speak(narration);
        }
      }
    }
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

  const allChecksComplete = completedChecks.length === postInstallChecks.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none"
    >
      {/* Animated SVG Demo - Pedal Pump Animation */}
      <div className="pointer-events-none">
        <DemoOverlay activeDemo="pedal-pump" />
      </div>
      
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
                <ClipboardCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Post-Installation</h2>
              </div>
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Verify proper installation
            </p>
          </div>

          {/* Checks */}
          <div className="p-4 space-y-2">
            {postInstallChecks.map((check, index) => {
              const isComplete = completedChecks.includes(check.id);
              
              return (
                <motion.button
                  key={check.id}
                  onClick={() => handleCheckClick(check.id, index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isComplete
                      ? 'bg-success/20 border border-success/30'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    isComplete ? 'bg-success' : 'bg-white/10'
                  }`}>
                    {isComplete && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm ${isComplete ? 'text-success' : 'text-white'}`}>
                    {check.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500">Verification Progress</span>
              <span className="text-primary">{completedChecks.length} / {postInstallChecks.length}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-success"
                animate={{ width: `${(completedChecks.length / postInstallChecks.length) * 100}%` }}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                allChecksComplete
                  ? 'bg-success text-white'
                  : 'bg-primary text-black'
              }`}
            >
              {allChecksComplete ? 'Proceed to Quiz' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
