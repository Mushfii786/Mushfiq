import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, X, Film, CheckCircle2, Award, Clapperboard, Sparkles } from 'lucide-react';
import { AnimatedBackground } from './hero/AnimatedBackground';
import { GlassBadge } from './hero/GlassBadge';
import { HeroDock } from './hero/HeroDock';
import { CursorGlow } from './hero/CursorGlow';
import { siteConfig } from '../config/site';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const Hero = memo(function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isMuted, setIsMuted] = useState(true);
  const [showreelModalOpen, setShowreelModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], shouldReduceMotion ? [1, 1] : [1, 0]);

  // Handle ambient sound toggle safely
  const toggleAmbientSound = () => {
    if (ambientVideoRef.current) {
      const nextMuted = !isMuted;
      ambientVideoRef.current.muted = nextMuted;
      if (!nextMuted) {
        ambientVideoRef.current.play().catch(() => {});
      }
      setIsMuted(nextMuted);
    }
  };

  // Close theater modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showreelModalOpen) {
        setShowreelModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showreelModalOpen]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden select-none bg-[#050505] px-4 sm:px-6 pt-24 pb-16 sm:py-24"
    >
      {/* Layered Cinematic Animated Background with ambient video loop */}
      <AnimatedBackground isMuted={isMuted} videoRef={ambientVideoRef} />

      {/* Interactive Cursor Spotlight Glow */}
      <CursorGlow />

      {/* Hero Core Content Container with Scroll Parallax */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-[1140px] w-full mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8 transform-gpu"
      >
        {/* Availability Badge */}
        <motion.div variants={lineVariants}>
          <GlassBadge text="Available for Commercial & Directing Commissions · 2026" />
        </motion.div>

        {/* Cinematic Director Eyebrow Header */}
        <motion.div variants={lineVariants} className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-amber-300/90 backdrop-blur-md">
          <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
          <span>Muhammed Mushfiq · Creative Director & Cinematographer</span>
        </motion.div>

        {/* Main Headline with Luxury Editorial Typography */}
        <motion.div variants={lineVariants} className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
            Directing & Crafting{' '}
            <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Cinematic Stories
            </span>{' '}
            That Resonate.
          </h1>
        </motion.div>

        {/* Subtitle Introduction & Production Scope */}
        <motion.div variants={lineVariants} className="max-w-[620px] mx-auto px-3">
          <p className="text-xs sm:text-base md:text-lg text-neutral-300 font-light leading-relaxed tracking-wide font-sans">
            Transforming vision into enduring imagery through commercial videography, cinematic video editing, editorial photography, and art direction.
          </p>
        </motion.div>

        {/* Production Specs Pill Strip */}
        <motion.div variants={lineVariants} className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-neutral-400 font-mono">
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300">
            Sony A7IV 4K 60FPS
          </span>
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300">
            DaVinci Resolve S-Log3
          </span>
          <span className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-neutral-300">
            Kerala, India · Worldwide Travel
          </span>
        </motion.div>

        {/* Interactive Hero Action Dock */}
        <motion.div variants={lineVariants} className="w-full">
          <HeroDock onWatchShowreel={() => setShowreelModalOpen(true)} />
        </motion.div>

        {/* Director Credentials & Milestone Bar */}
        <motion.div
          variants={lineVariants}
          className="w-full max-w-3xl mx-auto pt-4 sm:pt-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-neutral-950/70 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                5<span className="text-amber-400">+</span>
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-sans tracking-wide text-center">
                Years Experience
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                40<span className="text-amber-400">+</span>
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-sans tracking-wide text-center">
                Projects Delivered
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                250<span className="text-amber-400">K+</span>
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-sans tracking-wide text-center">
                Audience Reach
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                100<span className="text-amber-400">%</span>
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-sans tracking-wide text-center">
                Client Satisfaction
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Ambient Sound Equalizer Toggle in Bottom-Right Corner */}
      <button
        type="button"
        onClick={toggleAmbientSound}
        className="fixed bottom-6 right-6 z-30 group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-neutral-950/85 hover:bg-neutral-900 border border-white/10 hover:border-amber-400/50 text-neutral-300 hover:text-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all text-xs font-mono select-none cursor-pointer"
        title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-amber-400 transition-colors" />
        )}

        <div className="flex items-end gap-0.5 h-3">
          <span
            className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
              isMuted ? 'h-1 opacity-40' : 'h-3 animate-pulse'
            }`}
          />
          <span
            className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
              isMuted ? 'h-1 opacity-40' : 'h-2 animate-bounce'
            }`}
          />
          <span
            className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
              isMuted ? 'h-1 opacity-40' : 'h-3.5 animate-pulse'
            }`}
          />
        </div>

        <span className="text-[11px] font-medium tracking-wide">
          {isMuted ? "Sound Off" : "Ambient Sound"}
        </span>
      </button>

      {/* Subtle Scroll Down Prompt Indicator at bottom */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-[9px] sm:text-[10px] font-sans font-medium tracking-widest text-white/40 uppercase">
          SCROLL TO EXPLORE
        </span>
        <div className="w-3.5 h-6 rounded-full border border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-1.5 rounded-full bg-amber-400 animate-bounce" />
        </div>
      </div>

      {/* Full Cinematic Showreel Theater Modal */}
      <AnimatePresence>
        {showreelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowreelModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-neutral-950 border border-white/15 rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
            >
              {/* Theater Modal Header Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-neutral-900/80 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                    Muhammed Mushfiq — Official Showreel
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-medium">
                    4K S-Log3
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowreelModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Showreel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Theater Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  src="/videos/vision-26-promo.mp4"
                  poster="/images/vision-26-promo-poster.jpg"
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Theater Modal Film Credits Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-neutral-900/60 border-t border-white/5 text-[11px] sm:text-xs text-neutral-400 font-mono">
                <div>
                  Director & Editor: <span className="text-white font-medium">Muhammed Mushfiq</span>
                </div>
                <div>
                  Production: <span className="text-amber-400">Sony A7IV • DaVinci Resolve Studio</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

