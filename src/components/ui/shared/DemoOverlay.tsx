import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';

// SVG Illustrations for each demonstration
const illustrations: Record<string, React.ReactNode> = {
  // Safety Checklist Items
  'vehicle-lifted': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="liftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      {/* Floor */}
      <rect x="20" y="170" width="160" height="10" fill="#374151" rx="2" />
      {/* Lift Posts */}
      <motion.rect
        x="30" y="80" width="15" height="90" fill="url(#liftGrad)" rx="3"
        initial={{ height: 40, y: 130 }}
        animate={{ height: 90, y: 80 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.rect
        x="155" y="80" width="15" height="90" fill="url(#liftGrad)" rx="3"
        initial={{ height: 40, y: 130 }}
        animate={{ height: 90, y: 80 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      {/* Lift Arms */}
      <motion.rect
        x="45" y="85" width="110" height="8" fill="#FCD34D" rx="2"
        initial={{ y: 135 }}
        animate={{ y: 85 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      {/* Car Body */}
      <motion.g
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <rect x="50" y="45" width="100" height="35" fill="#D4A574" rx="5" />
        <rect x="55" y="30" width="90" height="20" fill="#87CEEB" rx="3" opacity="0.7" />
        {/* Wheels */}
        <circle cx="70" cy="80" r="12" fill="#1F2937" />
        <circle cx="70" cy="80" r="6" fill="#6B7280" />
        <circle cx="130" cy="80" r="12" fill="#1F2937" />
        <circle cx="130" cy="80" r="6" fill="#6B7280" />
      </motion.g>
      {/* Checkmark */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        <circle cx="170" cy="30" r="18" fill="#10B981" />
        <path d="M160 30 L167 37 L180 24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  ),

  'parking-brake': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Dashboard Background */}
      <rect x="20" y="40" width="160" height="120" fill="#1F2937" rx="10" />
      {/* Brake Lever */}
      <motion.g
        initial={{ rotate: 30 }}
        animate={{ rotate: -15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: '100px 140px' }}
      >
        <rect x="85" y="80" width="30" height="60" fill="#374151" rx="5" />
        <rect x="80" y="70" width="40" height="20" fill="#EF4444" rx="8" />
        <text x="100" y="84" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">P</text>
      </motion.g>
      {/* Indicator Light */}
      <motion.circle
        cx="100" cy="55"
        r="8"
        initial={{ fill: "#374151" }}
        animate={{ fill: "#EF4444" }}
        transition={{ delay: 0.8, duration: 0.2 }}
      />
      <text x="100" y="58" fill="white" fontSize="6" textAnchor="middle">!</text>
      {/* Label */}
      <text x="100" y="180" fill="#9CA3AF" fontSize="12" textAnchor="middle">PARKING BRAKE ENGAGED</text>
      {/* Checkmark */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <circle cx="170" cy="30" r="18" fill="#10B981" />
        <path d="M160 30 L167 37 L180 24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  ),

  'ppe-worn': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Safety Glasses */}
      <motion.g
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ellipse cx="60" cy="60" rx="25" ry="18" fill="none" stroke="#3B82F6" strokeWidth="3" />
        <ellipse cx="140" cy="60" rx="25" ry="18" fill="none" stroke="#3B82F6" strokeWidth="3" />
        <path d="M85 60 Q100 55 115 60" stroke="#3B82F6" strokeWidth="3" fill="none" />
        <line x1="35" y1="55" x2="20" y2="50" stroke="#3B82F6" strokeWidth="2" />
        <line x1="165" y1="55" x2="180" y2="50" stroke="#3B82F6" strokeWidth="2" />
        {/* Lens shine */}
        <ellipse cx="50" cy="55" rx="8" ry="5" fill="#93C5FD" opacity="0.3" />
        <ellipse cx="130" cy="55" rx="8" ry="5" fill="#93C5FD" opacity="0.3" />
      </motion.g>
      
      {/* Gloves */}
      <motion.g
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Left Glove */}
        <path d="M40 110 L40 160 Q40 175 55 175 L75 175 Q90 175 90 160 L90 130 L80 110 L70 130 L60 110 L50 130 Z" 
              fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
        {/* Right Glove */}
        <path d="M110 110 L110 160 Q110 175 125 175 L145 175 Q160 175 160 160 L160 130 L150 110 L140 130 L130 110 L120 130 Z" 
              fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
      </motion.g>
      
      {/* Label */}
      <text x="100" y="195" fill="#9CA3AF" fontSize="11" textAnchor="middle">SAFETY GLASSES & GLOVES</text>
      
      {/* Checkmark */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <circle cx="170" cy="20" r="18" fill="#10B981" />
        <path d="M160 20 L167 27 L180 14" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  ),

  'wheel-chocks': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Floor */}
      <rect x="10" y="160" width="180" height="10" fill="#374151" rx="2" />
      
      {/* Wheel */}
      <circle cx="100" cy="130" r="35" fill="#1F2937" />
      <circle cx="100" cy="130" r="25" fill="#374151" />
      <circle cx="100" cy="130" r="8" fill="#6B7280" />
      {/* Tire treads */}
      <circle cx="100" cy="130" r="32" fill="none" stroke="#4B5563" strokeWidth="2" strokeDasharray="8 4" />
      
      {/* Chocks animating into place */}
      <motion.g
        initial={{ x: -40 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <polygon points="45,160 65,160 65,140 45,155" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      </motion.g>
      
      <motion.g
        initial={{ x: 40 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <polygon points="135,160 155,160 155,155 135,140" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      </motion.g>
      
      {/* Arrows showing placement */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <path d="M55 120 L55 135" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <path d="M145 120 L145 135" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowhead)" />
      </motion.g>
      
      {/* Label */}
      <text x="100" y="185" fill="#9CA3AF" fontSize="11" textAnchor="middle">WHEEL CHOCKS IN PLACE</text>
      
      {/* Checkmark */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <circle cx="170" cy="30" r="18" fill="#10B981" />
        <path d="M160 30 L167 37 L180 24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  ),

  // Step demonstrations
  'lug-nut-pattern': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Wheel */}
      <circle cx="100" cy="100" r="80" fill="#1F2937" />
      <circle cx="100" cy="100" r="65" fill="#374151" />
      <circle cx="100" cy="100" r="20" fill="#6B7280" />
      
      {/* Lug nuts with sequence numbers */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180;
        const x = 100 + 45 * Math.cos(rad);
        const y = 100 + 45 * Math.sin(rad);
        const sequence = [1, 3, 5, 2, 4][i];
        return (
          <motion.g key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: sequence * 0.3, duration: 0.2 }}
          >
            <circle cx={x} cy={y} r="12" fill="#9CA3AF" />
            <motion.circle 
              cx={x} cy={y} r="14" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: sequence * 0.3 + 0.1, duration: 0.3 }}
            />
            <text x={x} y={y + 4} fill="#1F2937" fontSize="12" textAnchor="middle" fontWeight="bold">
              {sequence}
            </text>
          </motion.g>
        );
      })}
      
      {/* Star pattern lines */}
      <motion.path
        d="M100 55 L130 135 L55 85 L145 85 L70 135 Z"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray="5 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
      />
      
      <text x="100" y="195" fill="#9CA3AF" fontSize="10" textAnchor="middle">STAR PATTERN - LOOSEN EVENLY</text>
    </svg>
  ),

  'caliper-support': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Rotor */}
      <circle cx="100" cy="90" r="50" fill="#6B7280" />
      <circle cx="100" cy="90" r="40" fill="#4B5563" />
      <circle cx="100" cy="90" r="15" fill="#374151" />
      
      {/* Caliper */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: 30 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <rect x="130" y="60" width="25" height="60" fill="#EF4444" rx="3" />
        <rect x="125" y="70" width="10" height="40" fill="#B91C1C" rx="2" />
      </motion.g>
      
      {/* Brake hose */}
      <motion.path
        d="M155 70 Q170 50 160 30"
        fill="none"
        stroke="#1F2937"
        strokeWidth="4"
        initial={{ d: "M155 70 Q170 50 160 30" }}
        animate={{ d: "M185 70 Q200 50 190 30" }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      {/* Support wire/hook */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <path d="M175 40 L175 60 Q175 70 185 70" fill="none" stroke="#FCD34D" strokeWidth="3" />
        <circle cx="175" cy="35" r="8" fill="none" stroke="#FCD34D" strokeWidth="2" />
      </motion.g>
      
      {/* Warning */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <rect x="20" y="150" width="160" height="40" fill="#7F1D1D" rx="5" />
        <text x="100" y="168" fill="#FCA5A5" fontSize="9" textAnchor="middle">⚠️ NEVER LET CALIPER HANG</text>
        <text x="100" y="182" fill="#FCA5A5" fontSize="9" textAnchor="middle">BY THE BRAKE HOSE</text>
      </motion.g>
    </svg>
  ),

  'pad-orientation': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Correct orientation */}
      <motion.g
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="20" y="30" width="70" height="70" fill="#064E3B" rx="5" />
        <text x="55" y="20" fill="#10B981" fontSize="10" textAnchor="middle">✓ CORRECT</text>
        {/* Brake pad - correct */}
        <rect x="30" y="45" width="50" height="40" fill="#6B7280" rx="3" />
        <rect x="32" y="47" width="46" height="10" fill="#374151" rx="2" />
        {/* Wear indicator pointing up */}
        <polygon points="55,60 50,75 60,75" fill="#FCD34D" />
      </motion.g>
      
      {/* Incorrect orientation */}
      <motion.g
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <rect x="110" y="30" width="70" height="70" fill="#7F1D1D" rx="5" />
        <text x="145" y="20" fill="#EF4444" fontSize="10" textAnchor="middle">✗ INCORRECT</text>
        {/* Brake pad - incorrect (upside down) */}
        <rect x="120" y="45" width="50" height="40" fill="#6B7280" rx="3" />
        <rect x="122" y="73" width="46" height="10" fill="#374151" rx="2" />
        {/* Wear indicator pointing down - wrong! */}
        <polygon points="145,75 140,60 150,60" fill="#FCD34D" />
        {/* X mark */}
        <line x1="165" y1="35" x2="175" y2="45" stroke="#EF4444" strokeWidth="3" />
        <line x1="175" y1="35" x2="165" y2="45" stroke="#EF4444" strokeWidth="3" />
      </motion.g>
      
      {/* Arrow showing correct way */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <path d="M55 110 L55 130 L45 130 L55 145 L65 130 L55 130" fill="#10B981" />
        <text x="55" y="165" fill="#9CA3AF" fontSize="9" textAnchor="middle">WEAR INDICATOR</text>
        <text x="55" y="177" fill="#9CA3AF" fontSize="9" textAnchor="middle">FACES ROTOR</text>
      </motion.g>
    </svg>
  ),

  'torque-spec': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Torque wrench */}
      <motion.g
        initial={{ rotate: -30 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5, repeat: 2, repeatType: "reverse" }}
        style={{ transformOrigin: '100px 100px' }}
      >
        <rect x="40" y="90" width="120" height="20" fill="#6B7280" rx="3" />
        <rect x="35" y="85" width="30" height="30" fill="#374151" rx="5" />
        <circle cx="50" cy="100" r="8" fill="#1F2937" />
      </motion.g>
      
      {/* Gauge */}
      <rect x="60" y="130" width="80" height="40" fill="#1F2937" rx="5" />
      <motion.text
        x="100" y="158"
        fill="#10B981"
        fontSize="16"
        textAnchor="middle"
        fontFamily="monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        CLICK
      </motion.text>
      
      {/* Info box */}
      <rect x="30" y="10" width="140" height="50" fill="#1E3A5F" rx="5" />
      <text x="100" y="30" fill="#60A5FA" fontSize="9" textAnchor="middle">TORQUE TO MANUFACTURER</text>
      <text x="100" y="45" fill="#60A5FA" fontSize="9" textAnchor="middle">SPECIFICATIONS</text>
      
      <text x="100" y="190" fill="#9CA3AF" fontSize="10" textAnchor="middle">LISTEN FOR "CLICK" SOUND</text>
    </svg>
  ),

  'pedal-pump': (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Pedal housing */}
      <rect x="60" y="40" width="80" height="130" fill="#1F2937" rx="5" />
      
      {/* Brake pedal */}
      <motion.g
        animate={{ 
          y: [0, 20, 0, 20, 0, 20, 0] 
        }}
        transition={{ 
          duration: 3,
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <rect x="75" y="60" width="50" height="80" fill="#374151" rx="3" />
        <rect x="80" y="65" width="40" height="30" fill="#4B5563" rx="2" />
        <text x="100" y="85" fill="#9CA3AF" fontSize="10" textAnchor="middle">BRAKE</text>
      </motion.g>
      
      {/* Foot */}
      <motion.g
        animate={{ 
          y: [0, 20, 0, 20, 0, 20, 0] 
        }}
        transition={{ 
          duration: 3,
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <ellipse cx="100" cy="45" rx="25" ry="15" fill="#D4A574" />
      </motion.g>
      
      {/* Pressure indicator */}
      <rect x="150" y="60" width="20" height="100" fill="#374151" rx="3" />
      <motion.rect
        x="153" y="63"
        width="14"
        rx="2"
        fill="#10B981"
        animate={{ 
          height: [20, 90, 50, 90, 70, 94, 94],
          y: [137, 67, 107, 67, 87, 63, 63]
        }}
        transition={{ 
          duration: 3,
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
      
      <text x="100" y="190" fill="#9CA3AF" fontSize="10" textAnchor="middle">PUMP UNTIL FIRM</text>
    </svg>
  )
};

// Map screens and actions to illustrations
const getIllustrationKey = (screenId: string, activeDemo?: string): string | null => {
  if (activeDemo) return activeDemo;
  
  const screenMap: Record<string, string> = {
    'step1': 'lug-nut-pattern',
    'step2': 'caliper-support',
    'step4': 'pad-orientation',
    'step5': 'torque-spec',
    'post-install': 'pedal-pump'
  };
  
  return screenMap[screenId] || null;
};

interface DemoOverlayProps {
  activeDemo?: string;
}

export const DemoOverlay: React.FC<DemoOverlayProps> = ({ activeDemo }) => {
  const { currentScreen } = useStore();
  const illustrationKey = getIllustrationKey(currentScreen, activeDemo);
  const illustration = illustrationKey ? illustrations[illustrationKey] : null;

  return (
    <AnimatePresence mode="wait">
      {illustration && (
        <motion.div
          key={illustrationKey}
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-30"
        >
          <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <div className="w-64 h-64">
              {illustration}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoOverlay;
