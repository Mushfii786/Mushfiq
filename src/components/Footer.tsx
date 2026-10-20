import React, { memo } from 'react';
import { siteConfig } from '../config/site';

const nameLetters = "MUSHFII".split("");

export const Footer = memo(function Footer() {
  const siteContent = siteConfig;

  return (
    <footer className="relative pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-8 bg-[#050505] text-white overflow-hidden border-t border-white/10 select-none">
      
      {/* Top Gradient Shimmer Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-5 relative z-10">
        
        {/* Availability Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-neutral-300 tracking-wider uppercase">
            {siteContent?.hero?.availabilityBadge || 'AVAILABLE FOR FREELANCE'}
          </span>
        </div>

        {/* Brand Typography */}
        <div className="overflow-hidden select-none py-0.5 w-full flex justify-center">
          <a
            href="#home"
            className="inline-flex items-center justify-center tracking-tight font-extrabold text-2xl xs:text-3xl sm:text-5xl uppercase text-white leading-none group transition-transform duration-300 max-w-full whitespace-nowrap"
          >
            {nameLetters.map((char, index) => (
              <span
                key={index}
                className="inline-block font-mono text-neutral-200 group-hover:text-blue-400 transition-colors duration-300"
              >
                {char}
              </span>
            ))}
          </a>
        </div>

        {/* Clean Navigation Bar */}
        <nav className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-4 py-0.5">
          <a
            href="#home"
            className="px-2.5 py-1 text-[10px] sm:text-xs font-sans font-medium tracking-wider uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Home
          </a>
          <span className="text-neutral-700 text-xs">•</span>
          <a
            href="#about"
            className="px-2.5 py-1 text-[10px] sm:text-xs font-sans font-medium tracking-wider uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            About
          </a>
          <span className="text-neutral-700 text-xs">•</span>
          <a
            href="#projects"
            className="px-2.5 py-1 text-[10px] sm:text-xs font-sans font-medium tracking-wider uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Works
          </a>
          <span className="text-neutral-700 text-xs">•</span>
          <a
            href="#contact"
            className="px-2.5 py-1 text-[10px] sm:text-xs font-sans font-medium tracking-wider uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </nav>

        {/* Divider Line */}
        <div className="w-full max-w-xs h-[1px] bg-white/10 my-1" />

        {/* Bottom Copyright */}
        <div className="text-[10px] sm:text-xs font-mono text-neutral-400 tracking-wide text-center">
          <span>
            {siteContent?.footer?.copyrightText || '© 2026 MUSHFII. All rights reserved.'}
          </span>
        </div>

      </div>
    </footer>
  );
});

