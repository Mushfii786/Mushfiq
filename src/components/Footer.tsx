import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Instagram, Github, Linkedin, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/site';
import { useFirebaseData } from '../context/FirebaseDataContext';

export function Footer() {
  const { siteProfile } = useFirebaseData();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nameLetters = (siteProfile.initials || "MUSHFII").toUpperCase().split("");

  const socialLinks = [
    { name: "Instagram", url: siteProfile.socials?.instagram || siteConfig.socials.instagram, icon: Instagram },
    { name: "GitHub", url: siteProfile.socials?.github || siteConfig.socials.github, icon: Github },
    { name: "LinkedIn", url: siteProfile.socials?.linkedin || siteConfig.socials.linkedin, icon: Linkedin },
    { name: "WhatsApp", url: siteProfile.socials?.whatsapp || siteConfig.socials.whatsapp, icon: MessageCircle },
    { name: "Email", url: siteProfile.socials?.email || siteConfig.socials.email, icon: Mail },
  ];

  return (
    <footer className="relative pt-14 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-8 bg-[#050505] text-white overflow-hidden border-t border-white/10 select-none">
      
      {/* Top Gradient Shimmer Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] via-[#3B82F6] to-transparent animate-pulse duration-[4000ms]" />

      {/* Multi-layered Premium Ambient Background Halos */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] h-[200px] sm:h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,rgba(59,130,246,0.08)_45%,transparent_70%)] blur-[90px] sm:blur-[120px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-0 left-1/4 w-[250px] sm:w-[400px] h-[150px] sm:h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] blur-[80px] sm:blur-[100px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[150px] sm:h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] blur-[80px] sm:blur-[100px] pointer-events-none transform-gpu" />

      {/* Tactile Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8 relative z-10">
        
        {/* Availability Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.15)] group hover:border-purple-500/40 transition-all duration-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-neutral-300 tracking-wider uppercase">
            AVAILABLE FOR FREELANCE PROJECTS
          </span>
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
        </motion.div>

        {/* Animated Brand Typography with Gradient Wave Hover */}
        <div className="overflow-hidden select-none py-1 w-full flex justify-center">
          <a
            href="#home"
            className="inline-flex items-center justify-center tracking-tight font-extrabold text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase text-white leading-none group transition-transform duration-300 max-w-full whitespace-nowrap"
          >
            {nameLetters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: 90, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="inline-block font-mono transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:via-[#3B82F6] group-hover:to-[#06B6D4] hover:-translate-y-2 hover:scale-110"
              >
                {char}
              </motion.span>
            ))}
          </a>
        </div>

        {/* Minimal Tagline / Bio */}
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md sm:max-w-lg mx-auto leading-relaxed px-2">
          Video Editor & Visual Designer crafting cinematic stories, stunning photography, and impactful creative designs.
        </p>

        {/* Navigation Bar */}
        <motion.nav
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-1 sm:gap-3 py-1"
        >
          <a
            href="#home"
            className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Home
          </a>
          <span className="text-neutral-700 text-xs font-sans">•</span>
          <a
            href="#about"
            className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            About
          </a>
          <span className="text-neutral-700 text-xs font-sans">•</span>
          <a
            href="#projects"
            className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Works
          </a>
          <span className="text-neutral-700 text-xs font-sans">•</span>
          <a
            href="#contact"
            className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </motion.nav>

        {/* Divider Line with Shimmer Node */}
        <div className="w-full relative flex items-center justify-center my-2 sm:my-3">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#8B5CF6]" />
        </div>

        {/* Bottom Row: Copyright & Premium Back to Top Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs font-mono text-neutral-400 gap-3 sm:gap-4 pt-1">

          {/* Copyright Notice */}
          <div className="text-neutral-400 text-[10px] sm:text-xs font-sans tracking-wider text-center sm:text-left">
            © 2026 <span className="text-white font-extrabold tracking-widest uppercase">MUSHFII</span>. Photography <span className="text-purple-400/80 mx-0.5 sm:mx-1">•</span> Videography <span className="text-purple-400/80 mx-0.5 sm:mx-1">•</span> Design
          </div>

          <div className="flex items-center gap-3">
            {/* Premium Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-2 px-3 py-2 sm:px-0 sm:py-0 text-xs font-mono text-neutral-400 hover:text-white transition-all duration-300 cursor-pointer bg-neutral-900/60 sm:bg-transparent border border-white/5 sm:border-none rounded-full sm:rounded-none"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </motion.button>
          </div>

        </div>

      </div>
    </footer>
  );
}

