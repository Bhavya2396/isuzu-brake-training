import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface KnowledgeCalloutProps {
  children: React.ReactNode;
  className?: string;
}

export function KnowledgeCallout({ children, className = '' }: KnowledgeCalloutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30 ${className}`}
    >
      <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-sm text-gray-300">{children}</p>
    </motion.div>
  );
}
