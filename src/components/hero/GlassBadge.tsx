import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface GlassBadgeProps {
  text?: string;
  onClick?: () => void;
}

export const GlassBadge = memo(function GlassBadge({ text = "Available for Freelance Projects", onClick }: GlassBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
      className="inline-block z-20 cursor-default select-none"
    >
      <div
        onClick={onClick}
        className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-neutral-950/80 hover:bg-neutral-900 border border-white/10 hover:border-amber-500/40 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-98 transition-all duration-300 overflow-hidden ring-1 ring-white/5"
      >
        {/* Shimmer Light Beam Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Subtle Ambient Edge Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Tiny Animated Emerald/Amber Status Indicator */}
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
        </span>

        {/* Badge Text */}
        <span className="text-[10px] sm:text-xs font-medium text-neutral-300 group-hover:text-white tracking-wider uppercase font-mono transition-colors truncate">
          {text}
        </span>

        {/* Subtle Sparkle Accent */}
        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0" />
      </div>
    </motion.div>
  );
});

