// Voiceover service using Web Speech API with British accent

class VoiceoverService {
  private synth: SpeechSynthesis;
  private britishVoice: SpeechSynthesisVoice | null = null;
  private enabled: boolean = true;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoice();
  }

  private initVoice() {
    // Wait for voices to load
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Prefer British English voices
      this.britishVoice = voices.find(voice => 
        voice.lang === 'en-GB' && voice.name.includes('Female')
      ) || voices.find(voice => 
        voice.lang === 'en-GB'
      ) || voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Daniel')
      ) || voices.find(voice =>
        voice.lang.startsWith('en')
      ) || voices[0];
    };

    if (this.synth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synth.addEventListener('voiceschanged', loadVoices);
    }
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!this.enabled) return;
    
    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.britishVoice) {
      utterance.voice = this.britishVoice;
    }
    
    utterance.rate = options?.rate ?? 0.9; // Slightly slower for clarity
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 0.8;
    utterance.lang = 'en-GB';

    this.synth.speak(utterance);

    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
    });
  }

  stop() {
    this.synth.cancel();
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  isSpeaking() {
    return this.synth.speaking;
  }
}

// Singleton instance
export const voiceover = new VoiceoverService();

// Predefined narrations for each screen/action
export const narrations = {
  landing: {
    welcome: "Welcome to the Front Brake Pad Replacement training module. Click Start Lesson when you're ready to begin.",
  },
  objectives: {
    intro: "By the end of this lesson, you will be able to identify brake system components, follow safe procedures, install brake pads correctly, and perform post-installation checks.",
  },
  context: {
    intro: "Let's examine the key components of a disc brake system. Click on each part to learn more.",
    rotor: "This is the brake rotor. It's the disc that rotates with the wheel. The brake pads clamp onto this surface to slow the vehicle.",
    caliper: "The brake caliper houses the pistons and brake pads. When you press the brake pedal, hydraulic pressure pushes the pistons, which squeeze the pads against the rotor.",
    pads: "These are the brake pads. They contain friction material that wears down over time. Regular inspection and replacement is essential for safety.",
  },
  safety: {
    intro: "Before we begin, complete this safety checklist. Click each item to confirm and learn more.",
    vehicle_secured: "Ensure the vehicle is securely lifted on jack stands or a professional lift. Never work under a vehicle supported only by a jack.",
    parking_brake: "Engage the parking brake to prevent any vehicle movement during the service.",
    ppe: "Always wear safety glasses to protect your eyes from debris, and gloves to protect your hands from sharp components and brake dust.",
    wheel_chocks: "Place wheel chocks behind the rear wheels as an additional safety measure against rolling.",
  },
  tools: {
    intro: "Here are the tools you'll need. Click each tool to see it in detail.",
    socket: "A socket wrench with appropriate sizes for your vehicle's lug nuts and caliper bolts.",
    torque: "A torque wrench ensures bolts are tightened to manufacturer specifications.",
    lift: "A jack or lift to safely raise and support the vehicle.",
  },
  step1: {
    intro: "Step one: Wheel Removal. We'll start by removing the wheel to access the brake components.",
    instruction1: "Loosen the lug nuts in a star pattern while the wheel is still on the ground. This prevents the wheel from spinning.",
    instruction2: "Remove the wheel completely and set it aside safely.",
    instruction3: "With the wheel removed, you now have clear access to the brake assembly.",
  },
  step2: {
    intro: "Step two: Accessing the Brake Caliper. We need to remove the caliper to access the brake pads.",
    instruction1: "Locate the caliper mounting bolts. There are usually two bolts on the back of the caliper.",
    instruction2: "Use the appropriate socket to remove these bolts.",
    instruction3: "Carefully slide the caliper off the rotor. Be gentle to avoid damaging the brake line.",
    instruction4: "Important: Support the caliper during removal. Never let it hang by the brake hose, as this can cause internal damage.",
    warning: "Warning: Never allow the caliper to hang by the brake hose. This causes internal damage to the hose.",
  },
  step3: {
    intro: "Step three: Removing the Old Brake Pads. Inspect them carefully as you remove them.",
    instruction1: "Note the orientation of the pads before removal. This will help you install the new ones correctly.",
    instruction2: "Slide the old pads out of the caliper bracket.",
    instruction3: "Inspect the wear patterns. Even wear indicates proper operation.",
    instruction4: "Uneven wear may indicate issues with the caliper or alignment that should be addressed.",
  },
  step4: {
    intro: "Step four: Installing the New Brake Pads. Correct installation is crucial for proper braking.",
    instruction1: "Compare the new pads to the old ones to ensure you have the correct part.",
    instruction2: "Install any included shims or anti-squeal clips.",
    instruction3: "Slide the new pads into the bracket, ensuring correct orientation.",
    instruction4: "Verify the pads move freely without binding.",
  },
  step5: {
    intro: "Step five: Reassembly. We'll now put everything back together.",
    instruction1: "Compress the caliper piston to make room for the new, thicker pads.",
    instruction2: "Reinstall the caliper over the new pads.",
    instruction3: "Tighten the mounting bolts to the manufacturer's specification.",
    instruction4: "Reinstall the wheel and tighten lug nuts in a star pattern.",
  },
  postInstall: {
    intro: "Post-installation checks are essential to ensure everything is working correctly.",
    check1: "Pump the brake pedal several times until it feels firm.",
    check2: "The pedal should feel solid, not spongy. If it feels soft, there may be an issue.",
    check3: "Listen for any unusual sounds when pressing the pedal.",
    check4: "Perform a visual inspection to ensure everything is properly installed.",
  },
  quiz: {
    intro: "Let's test your knowledge with a few scenario-based questions.",
  },
  complete: {
    outro: "Congratulations! You have successfully completed the Front Brake Pad Replacement training module. You're now equipped with the knowledge to perform this procedure safely and correctly.",
  },
};

export type NarrationKey = keyof typeof narrations;
