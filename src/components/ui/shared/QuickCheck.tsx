import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { useState } from 'react';

interface CheckItem {
  id: string;
  label: string;
}

interface QuickCheckProps {
  items: CheckItem[];
  title?: string;
  onAllChecked?: () => void;
  className?: string;
}

export function QuickCheck({ items, title = 'Quick Check', onAllChecked, className = '' }: QuickCheckProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    const newChecked = { ...checked, [id]: !checked[id] };
    setChecked(newChecked);
    
    const allChecked = items.every(item => newChecked[item.id]);
    if (allChecked && onAllChecked) {
      onAllChecked();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg bg-dark-200/50 border border-white/5 ${className}`}
    >
      <h4 className="text-sm font-medium text-gray-400 mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleCheck(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              checked[item.id]
                ? 'bg-success/10 border border-success/30'
                : 'bg-dark-300/50 border border-white/5 hover:border-white/10'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              checked[item.id]
                ? 'bg-success text-white'
                : 'border-2 border-gray-500'
            }`}>
              {checked[item.id] ? (
                <Check className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3 opacity-0" />
              )}
            </div>
            <span className={`text-sm ${checked[item.id] ? 'text-success' : 'text-gray-300'}`}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
