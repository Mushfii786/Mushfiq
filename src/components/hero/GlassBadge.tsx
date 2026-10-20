import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface GlassBadgeProps {
  text?: string;
  onClick?: () => void;
}

export function GlassBadge({ text = "Available for Freelance Projects", onClick }: GlassBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className="inline-block z-20 cursor-default select-none"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-neutral-900/85 hover:bg-neutral-900 border border-white/10 hover:border-purple-500/50 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 overflow-hidden ring-1 ring-white/5"
      >
        {/* Shimmer Light Beam Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Subtle Ambient Edge Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Tiny Animated Green Status Indicator */}
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
        </span>

        {/* Badge Text */}
        <span className="text-[10px] sm:text-xs font-medium text-neutral-200 group-hover:text-white tracking-wide font-sans transition-colors truncate">
          {text}
        </span>

        {/* Subtle Sparkle Accent */}
        <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-purple-400 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0" />
      </motion.div>
    </motion.div>
  );
}
