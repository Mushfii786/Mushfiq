import React, { memo } from 'react';
import { FloatingParticles } from './FloatingParticles';

export const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden pointer-events-none select-none" style={{ contain: 'strict' }}>
      {/* Layer 1: GPU Accelerated Gradient Radial Orbs (Static on mobile for zero-lag touch scrolling) */}
      <div
        className="absolute -top-20 -left-20 w-[65vw] max-w-[800px] h-[65vw] max-h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22)_0%,rgba(59,130,246,0.12)_45%,transparent_70%)] transform-gpu"
      />

      <div
        className="absolute -bottom-20 -right-20 w-[70vw] max-w-[850px] h-[70vw] max-h-[850px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,rgba(59,130,246,0.14)_45%,transparent_70%)] transform-gpu"
      />

      {/* Layer 2: Center Aurora Wave Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1100px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.14)_0%,rgba(59,130,246,0.18)_40%,rgba(6,182,212,0.10)_70%,transparent_90%)] transform-gpu"
      />

      {/* Layer 3: Spotlight Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)] transform-gpu" />

      {/* Layer 4: Floating Particles Canvas (Viewport-paused when scrolled past Hero) */}
      <FloatingParticles />

      {/* Layer 5: Top Subtle Light Ray */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.16),transparent_100%)] transform-gpu"
      />

      {/* Layer 6: Edge Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050505_95%)] pointer-events-none" />
    </div>
  );
});
