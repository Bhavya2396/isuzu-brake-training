import { TrainingStep } from '../types';

export const trainingSteps: TrainingStep[] = [
  {
    id: 1,
    screen: 'step1',
    title: 'Wheel Removal',
    instructions: [
      'Loosen lug nuts evenly in a star pattern',
      'Remove wheel and place safely aside',
      'Ensure vehicle is stable on jack stands'
    ],
    tip: 'Even lug nut loosening helps prevent wheel hub stress.',
    aiContext: 'User is learning wheel removal for brake service. Focus on proper loosening pattern and safety.'
  },
  {
    id: 2,
    screen: 'step2',
    title: 'Access Brake Caliper',
    instructions: [
      'Locate caliper mounting bolts (usually 2)',
      'Remove bolts with appropriate socket',
      'Carefully slide caliper off rotor',
      'Support caliper during removal'
    ],
    warning: '⚠️ Do not allow caliper to hang by the brake hose - this causes internal damage!',
    tip: 'Use wire or bungee cord to suspend caliper from suspension.',
    aiContext: 'User is learning caliper removal. Critical safety: never let caliper hang by brake hose.',
    focusPart: 'Brake_Caliper_2',
    animation: 'highlight'
  },
  {
    id: 3,
    screen: 'step3',
    title: 'Remove Old Brake Pads',
    instructions: [
      'Note pad orientation before removal',
      'Slide old pads out of caliper bracket',
      'Inspect wear patterns on old pads',
      'Check for uneven wear (indicates other issues)'
    ],
    tip: 'Uneven pad wear may indicate stuck caliper pins or alignment issues.',
    aiContext: 'User is learning pad inspection. Uneven wear diagnosis is important for identifying underlying problems.',
    focusPart: 'Brake_Pads_0',
    animation: 'explode'
  },
  {
    id: 4,
    screen: 'step4',
    title: 'Install New Brake Pads',
    instructions: [
      'Compare new pads to old - ensure correct part',
      'Install any included shims or clips',
      'Slide new pads into bracket',
      'Verify pads move freely'
    ],
    tip: 'Some pads have wear indicators - ensure they face correctly.',
    aiContext: 'User is installing new pads. Orientation and hardware installation matter.',
    focusPart: 'Brake_Pads_0',
    animation: 'explode'
  },
  {
    id: 5,
    screen: 'step5',
    title: 'Reassembly',
    instructions: [
      'Compress caliper piston carefully',
      'Reinstall caliper over new pads',
      'Tighten mounting bolts securely',
      'Reinstall wheel and tighten lug nuts'
    ],
    warning: '⚠️ Tightening specifications vary by vehicle manufacturer.',
    tip: 'First few stops may feel different as pads bed in.',
    aiContext: 'User is reassembling. Proper torque and seating is critical.',
    animation: 'highlight'
  }
];

export const postInstallChecks = [
  { id: 1, label: 'Pump brake pedal several times', icon: '🦶' },
  { id: 2, label: 'Confirm pedal firmness', icon: '✋' },
  { id: 3, label: 'Listen for abnormal noise', icon: '👂' },
  { id: 4, label: 'Perform visual inspection', icon: '👁️' }
];

export const safetyItems = [
  { key: 'vehicle_secured', label: 'Vehicle is securely lifted', icon: '🚗' },
  { key: 'parking_brake', label: 'Parking brake engaged', icon: '🅿️' },
  { key: 'ppe', label: 'PPE worn (safety glasses, gloves)', icon: '🥽' },
  { key: 'wheel_chocks', label: 'Wheel chocks in place', icon: '🔺' }
];

export const learningObjectives = [
  { id: 1, text: 'Identify brake system components', icon: '🔍' },
  { id: 2, text: 'Follow a safe brake pad replacement procedure', icon: '⚙️' },
  { id: 3, text: 'Install brake pads correctly', icon: '🔧' },
  { id: 4, text: 'Perform post-installation checks', icon: '✅' }
];

export const getStepByScreen = (screenId: string): TrainingStep | undefined => {
  return trainingSteps.find(step => step.screen === screenId);
};
