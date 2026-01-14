import { motion } from 'framer-motion';
import { useStore } from '../../../store/useStore';
import { SCREEN_ORDER } from '../../../data/screens';

export function ProgressBar() {
  const currentScreen = useStore(state => state.currentScreen);
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
  const totalScreens = SCREEN_ORDER.length;
  const progress = ((currentIndex + 1) / totalScreens) * 100;

  // Don't show on landing or complete screens
  if (currentScreen === 'landing' || currentScreen === 'complete') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Simple progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-highlight rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        {/* Minimal indicator */}
        <div className="flex items-center justify-center mt-2">
          <span className="text-xs text-gray-500">
            {Math.round(progress)}% complete
          </span>
        </div>
      </div>
    </div>
  );
}
