import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, GraduationCap, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { voiceover, narrations } from '../../../services/voiceoverService';

export function LandingScreen() {
  const nextScreen = useStore(state => state.nextScreen);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  // Play welcome message on mount
  useEffect(() => {
    if (!hasPlayedWelcome && voiceEnabled) {
      const timer = setTimeout(() => {
        voiceover.speak(narrations.landing.welcome);
        setHasPlayedWelcome(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasPlayedWelcome, voiceEnabled]);

  const handleStart = () => {
    voiceover.stop();
    nextScreen();
  };

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) {
      voiceover.stop();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
    >
      {/* Voice toggle button */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <button
          onClick={handleToggleVoice}
          className={`p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-all ${
            voiceEnabled ? 'text-primary' : 'text-gray-500'
          }`}
          title={voiceEnabled ? 'Mute voiceover' : 'Enable voiceover'}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="pointer-events-auto max-w-xl mx-auto px-6 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gradient">Front Brake Pad</span>
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Replacement
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8 text-lg"
        >
          Interactive Training Module
        </motion.p>

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">10-12 min</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm">Beginner</span>
          </div>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleStart}
            className="group flex items-center gap-3 px-8 py-4 mx-auto rounded-xl bg-primary text-black font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            <Play className="w-5 h-5" />
            Start Lesson
          </button>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-600 mt-8"
        >
          Drag to rotate the 3D model
        </motion.p>
      </div>
    </motion.div>
  );
}
