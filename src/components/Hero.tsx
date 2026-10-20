import React, { useRef, memo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { AnimatedBackground } from './hero/AnimatedBackground';
import { GlassBadge } from './hero/GlassBadge';
import { GradientText } from './hero/GradientText';
import { HeroDock } from './hero/HeroDock';
import { CursorGlow } from './hero/CursorGlow';
import { siteConfig } from '../config/site';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const Hero = memo(function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteContent = siteConfig;
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], shouldReduceMotion ? [1, 1] : [1, 0]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden select-none bg-[#050505] px-4 sm:px-6 py-20"
    >
      {/* Layered Cinematic Animated Background */}
      <AnimatedBackground />

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
        className="relative z-20 max-w-[1200px] w-full mx-auto flex flex-col items-center justify-center space-y-8 sm:space-y-10 transform-gpu"
      >
        {/* Top Floating Glass Badge */}
        <motion.div variants={lineVariants}>
          <GlassBadge text={siteContent?.hero?.availabilityBadge || "Available for Freelance Projects"} />
        </motion.div>

        {/* Main Headline */}
        <div className="space-y-0.5 sm:space-y-1.5">
          <motion.div variants={lineVariants} className="overflow-hidden">
            <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              {siteContent?.hero?.headingPart1 || "Crafting Unforgettable"}
            </h1>
          </motion.div>

          <motion.div variants={lineVariants} className="overflow-hidden">
            <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              {siteContent?.hero?.headingPart2 || "Visuals Through"}
            </h1>
          </motion.div>

          <motion.div variants={lineVariants} className="overflow-hidden py-0.5 sm:py-1">
            <h1 className="text-base xs:text-lg sm:text-3xl md:text-4xl lg:text-[3.1rem] xl:text-[3.6rem] font-extrabold tracking-tight leading-[1.12] drop-shadow-[0_0_35px_rgba(139,92,246,0.4)]">
              <GradientText>{siteContent?.hero?.gradientHeading || "Photography, Videography & Editing"}</GradientText>
            </h1>
          </motion.div>
        </div>

        {/* Subtitle Introduction */}
        <motion.div variants={lineVariants} className="max-w-[540px] sm:max-w-[680px] mx-auto px-3 sm:px-2">
          <p className="text-xs sm:text-base md:text-lg text-white/70 font-light leading-relaxed tracking-wide font-sans">
            {siteContent?.hero?.intro || (
              <>Hi, I'm <strong className="font-semibold text-white">Mushfiq</strong>. I transform ideas into cinematic visuals through video editing, photography, videography, photo editing, and creative design.</>
            )}
          </p>
        </motion.div>

        {/* Interactive Hero Action Dock */}
        <motion.div variants={lineVariants} className="w-full">
          <HeroDock />
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Down Prompt Indicator at bottom */}
      <div
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[9px] sm:text-[10px] font-sans font-medium tracking-widest text-white/40 uppercase">
          SCROLL TO EXPLORE
        </span>
        <div
          className="w-3.5 h-6 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
});
