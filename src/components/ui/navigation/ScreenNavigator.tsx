import { useStore } from '../../../store/useStore';
import { LandingScreen } from '../screens/LandingScreen';
import { ObjectivesScreen } from '../screens/ObjectivesScreen';
import { ContextScreen } from '../screens/ContextScreen';
import { SafetyScreen } from '../screens/SafetyScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { StepScreen } from '../screens/StepScreen';
import { PostInstallScreen } from '../screens/PostInstallScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { CompleteScreen } from '../screens/CompleteScreen';

export function ScreenNavigator() {
  const currentScreen = useStore(state => state.currentScreen);

  switch (currentScreen) {
    case 'landing':
      return <LandingScreen />;
    case 'objectives':
      return <ObjectivesScreen />;
    case 'context':
      return <ContextScreen />;
    case 'safety':
      return <SafetyScreen />;
    case 'tools':
      return <ToolsScreen />;
    case 'step1':
    case 'step2':
    case 'step3':
    case 'step4':
    case 'step5':
      return <StepScreen key={currentScreen} />;
    case 'postInstall':
      return <PostInstallScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'complete':
      return <CompleteScreen />;
    default:
      console.error('[ScreenNavigator] Unknown screen:', currentScreen);
      return <LandingScreen />;
  }
}
