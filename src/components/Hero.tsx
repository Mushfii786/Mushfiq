import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AnimatedBackground } from './hero/AnimatedBackground';
import { GlassBadge } from './hero/GlassBadge';
import { GradientText } from './hero/GradientText';
import { HeroDock } from './hero/HeroDock';
import { CursorGlow } from './hero/CursorGlow';
import { siteConfig } from '../config/site';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteContent = siteConfig;


  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Staggered entrance variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 35, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

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
          scale: contentScale,
          opacity: contentOpacity,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-[1200px] w-full mx-auto flex flex-col items-center justify-center space-y-8 sm:space-y-10"
      >
        {/* Top Floating Glass Badge */}
        <motion.div variants={lineVariants}>
          <GlassBadge text={siteContent?.hero?.availabilityBadge || "Available for Freelance Projects"} />
        </motion.div>

        {/* Main Headline */}
        <div className="space-y-1 sm:space-y-2">
          <motion.div variants={lineVariants} className="overflow-hidden">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              {siteContent?.hero?.headingPart1 || "Crafting Unforgettable"}
            </h1>
          </motion.div>

          <motion.div variants={lineVariants} className="overflow-hidden">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              {siteContent?.hero?.headingPart2 || "Visuals Through"}
            </h1>
          </motion.div>

          <motion.div variants={lineVariants} className="overflow-hidden py-1">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-[3.1rem] xl:text-[3.6rem] font-extrabold tracking-tight leading-[1.08] drop-shadow-[0_0_35px_rgba(139,92,246,0.4)]">
              <GradientText>{siteContent?.hero?.gradientHeading || "Photography, Videography & Editing"}</GradientText>
            </h1>
          </motion.div>
        </div>

        {/* Subtitle Introduction */}
        <motion.div variants={lineVariants} className="max-w-[680px] mx-auto px-2">
          <p className="text-sm sm:text-base md:text-lg text-white/70 font-light leading-relaxed tracking-wide font-sans">
            {siteContent?.hero?.intro || (
              <>Hi, I'm <strong className="font-semibold text-white">Mushfiq</strong>. I transform ideas into cinematic visuals through video editing, photography, videography, photo editing, and creative design.</>
            )}
          </p>
        </motion.div>

        {/* Interactive Hero Action Dock matching exact screenshot layout */}
        <motion.div variants={lineVariants} className="w-full">
          <HeroDock />
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Down Prompt Indicator at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[9px] sm:text-[10px] font-sans font-medium tracking-widest text-white/40 uppercase">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-3.5 h-6 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
