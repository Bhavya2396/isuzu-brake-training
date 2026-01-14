import { Scene } from './components/canvas/Scene';
import { ScreenNavigator } from './components/ui/navigation/ScreenNavigator';
import { ProgressBar } from './components/ui/shared/ProgressBar';
import { AITrainer } from './components/ui/shared/AITrainer';

function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-dark-400">
      {/* 3D Scene */}
      <Scene />
      
      {/* Progress bar */}
      <ProgressBar />
      
      {/* Screen content */}
      <ScreenNavigator />
      
      {/* AI Trainer */}
      <AITrainer />
    </div>
  );
}

export default App;
