import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Star, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { voiceover, narrations } from '../../../services/voiceoverService';
import confetti from 'canvas-confetti';

export function CompleteScreen() {
  const quizScore = useStore(state => state.quizScore);
  const reset = useStore(state => state.reset);
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedOutro, setHasPlayedOutro] = useState(false);

  // Play celebration
  useEffect(() => {
    // Confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00d4ff', '#00ff88', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00d4ff', '#00ff88', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Voiceover
    if (!hasPlayedOutro && voiceEnabled) {
      setTimeout(() => {
        voiceover.speak(narrations.complete.outro);
        setHasPlayedOutro(true);
      }, 1500);
    }

    return () => voiceover.stop();
  }, [hasPlayedOutro, voiceEnabled]);

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) voiceover.stop();
  };

  const handleRestart = () => {
    voiceover.stop();
    reset();
  };

  const getScoreMessage = () => {
    if (quizScore >= 80) return 'Excellent work!';
    if (quizScore >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
    >
      {/* Voice toggle */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <button
          onClick={handleToggleVoice}
          className={`p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 ${
            voiceEnabled ? 'text-primary' : 'text-gray-500'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="pointer-events-auto text-center px-6">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <Trophy className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Training Complete!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          {getScoreMessage()}
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/60 backdrop-blur-md rounded-xl p-6 mb-8 max-w-xs mx-auto border border-white/10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.ceil(quizScore / 20) ? 'text-primary fill-primary' : 'text-gray-600'}`}
              />
            ))}
          </div>
          <p className="text-4xl font-bold text-white mb-1">{quizScore}%</p>
          <p className="text-sm text-gray-500">Quiz Score</p>
        </motion.div>

        {/* Restart button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 mx-auto rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </motion.button>
      </div>
    </motion.div>
  );
}
