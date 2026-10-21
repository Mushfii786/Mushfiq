import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { GradientWaves } from './components/GradientWaves';
import { ShapeGrid } from './components/ShapeGrid';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export function App() {
  // Initialize Lenis smooth scroll engine and force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');

    // Skip smooth-scrolling wrapper if user prefers reduced motion or is on touch mobile device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    let rafId: number;
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 0,
    });

    function raf(time: number) {
      if (!document.hidden && document.body.style.overflow !== 'hidden') {
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans antialiased overflow-x-hidden">
      
      {/* Smooth Magnetic Cursor */}
      <CustomCursor />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Animated Blue and White Gradient Waves Background */}
      <GradientWaves />

      {/* Interactive Apple/Linear/Vercel Style Grid Backdrop */}
      <ShapeGrid
        direction="diagonal"
        speed={0.4}
        squareSize={42}
        shape="square"
        hoverTrailAmount={8}
      />

      {/* Main Portfolio Content */}
      <div className="opacity-100 transition-opacity duration-300">
        <Navigation />

        <main>
          <Hero />
          <About />
          <div id="projects">
            <Projects />
          </div>
          <Contact />
        </main>

        <Footer />
      </div>

    </div>
  );
}

export default App;
