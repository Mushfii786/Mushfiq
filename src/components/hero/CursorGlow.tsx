import React, { useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CursorGlow = memo(function CursorGlow() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.3 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden hidden md:block">
      <motion.div
        className="absolute top-0 left-0 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,rgba(59,130,246,0.04)_45%,transparent_70%)] transform-gpu"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
});
