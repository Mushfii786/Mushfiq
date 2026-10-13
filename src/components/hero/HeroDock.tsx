import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageSquare } from 'lucide-react';

export function HeroDock() {
  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center justify-center gap-4 w-full z-30 pt-2"
    >
      <a
        href="#projects"
        onClick={handleScrollToProjects}
        className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#3b82f6] hover:from-[#9333ea] hover:via-[#4f46e5] hover:to-[#2563eb] text-white text-sm sm:text-base font-semibold tracking-wide shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_45px_rgba(139,92,246,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-white/20"
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
        <span className="relative z-10 font-semibold tracking-wide">Explore My Work</span>
        <ArrowRight className="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform duration-300 group-hover:translate-x-1" />
      </a>

      <a
        href="#contact"
        onClick={handleScrollToContact}
        className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-neutral-900/90 hover:bg-neutral-900 text-neutral-200 hover:text-white text-sm sm:text-base font-semibold tracking-wide border border-white/15 hover:border-purple-500/50 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_35px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden ring-1 ring-white/5"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
        <span className="relative z-10 font-semibold tracking-wide">Get in Touch</span>
        <MessageSquare className="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 group-hover:rotate-12" />
      </a>
    </motion.div>
  );
}
