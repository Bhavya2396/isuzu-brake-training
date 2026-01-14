import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Volume2, VolumeX, Check } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { learningObjectives } from '../../../data/steps';
import { voiceover, narrations } from '../../../services/voiceoverService';

export function ObjectivesScreen() {
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Play intro
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled) {
      voiceover.speak(narrations.objectives.intro);
      setHasPlayedIntro(true);
    }
    return () => voiceover.stop();
  }, [hasPlayedIntro, voiceEnabled]);

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
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Learning Objectives</h2>
              </div>
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              By the end of this lesson, you will be able to:
            </p>
          </div>

          {/* Objectives */}
          <div className="p-4 space-y-3">
            {learningObjectives.map((objective, index) => (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-300">{objective.text}</span>
              </motion.div>
            ))}
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
