import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, MessageSquare } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface HeroDockProps {
  onWatchShowreel?: () => void;
}

export function HeroDock({ onWatchShowreel }: HeroDockProps) {
  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full z-30 pt-2"
    >
      {/* Primary CTA: Watch Showreel with Theater Modal Trigger */}
      <button
        type="button"
        onClick={onWatchShowreel}
        className="group relative inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-black text-xs sm:text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:shadow-[0_0_45px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-amber-300/40"
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
        <span className="flex h-5 w-5 rounded-full bg-black/20 items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-2.5 h-2.5 text-black fill-black ml-0.5" />
        </span>
        <span className="relative z-10 font-bold uppercase tracking-wider">Watch Showreel</span>
        <span className="relative z-10 text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-black/20 text-black font-semibold">
          0:35
        </span>
      </button>

      {/* Secondary CTA: Explore Selected Works */}
      <a
        href="#projects"
        onClick={handleScrollToProjects}
        className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800/90 text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/15 hover:border-amber-400/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md"
      >
        <span>Explore Works</span>
        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-amber-400" />
      </a>

      {/* Tertiary CTA: Book Commission / Direct Inquiry */}
      <a
        href={siteConfig.socials.whatsapp || `mailto:${siteConfig.email}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-neutral-950/60 hover:bg-neutral-900/80 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium tracking-wide border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
      >
        <MessageSquare className="w-3.5 h-3.5 text-amber-400/80 group-hover:text-amber-400" />
        <span>Book Commission</span>
      </a>
    </motion.div>
  );
}

