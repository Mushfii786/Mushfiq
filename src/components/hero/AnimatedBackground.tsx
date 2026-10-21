import React, { memo } from 'react';
import { FloatingParticles } from './FloatingParticles';

interface AnimatedBackgroundProps {
  isMuted?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export const AnimatedBackground = memo(function AnimatedBackground({
  isMuted = true,
  videoRef,
}: AnimatedBackgroundProps) {
  return (
    <div
      className="absolute inset-0 bg-[#050505] overflow-hidden pointer-events-none select-none"
      style={{ contain: 'strict' }}
    >
      {/* Layer 0: Ambient Looping Cinematic Showreel Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/vision-26-promo.mp4"
          poster="/images/vision-26-promo-poster.jpg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-25 sm:opacity-30 filter saturate-110 contrast-110 scale-105 motion-reduce:hidden transform-gpu"
        />
      </div>

      {/* Layer 1: Warm Amber & Gold Cinematic Glows (matching black & light-orange theme) */}
      <div
        className="absolute -top-24 -left-20 w-[65vw] max-w-[800px] h-[65vw] max-h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.14)_0%,rgba(251,146,60,0.06)_45%,transparent_70%)] transform-gpu"
      />

      <div
        className="absolute -bottom-24 -right-20 w-[70vw] max-w-[850px] h-[70vw] max-h-[850px] rounded-full bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.12)_0%,rgba(245,158,11,0.06)_45%,transparent_70%)] transform-gpu"
      />

      {/* Layer 2: Center Warm Anamorphic Beam */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1100px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.09)_0%,rgba(217,119,6,0.05)_40%,transparent_80%)] transform-gpu"
      />

      {/* Layer 3: Floating Particles */}
      <FloatingParticles />

      {/* Layer 4: Deep Cinematic Vignette Overlays for Maximum Typography Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#050505_90%)]" />

      {/* Layer 5: Film Grain Texture (Lightweight SVG) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

