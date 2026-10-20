import React, { memo } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress = memo(function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 dark:from-purple-500 dark:via-blue-500 dark:to-cyan-400 shadow-[0_0_15px_rgba(168,85,247,0.85)] origin-left z-[90] pointer-events-none transform-gpu"
      style={{ scaleX }}
    />
  );
});
