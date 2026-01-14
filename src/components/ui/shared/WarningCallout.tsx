import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WarningCalloutProps {
  children: React.ReactNode;
  className?: string;
}

export function WarningCallout({ children, className = '' }: WarningCalloutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30 ${className}`}
    >
      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
      <p className="text-sm text-warning">{children}</p>
    </motion.div>
  );
}
