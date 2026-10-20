import React, { memo } from 'react';

export const GradientWaves = memo(function GradientWaves() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden select-none bg-[#050505]"
      style={{ contain: 'strict' }}
    >
      {/* Background Base Deep Dark Canvas */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Top-Left Corner Glow: Pure GPU Radial Gradient (No expensive CSS blur filter needed) */}
      <div className="absolute top-[-15%] left-[-15%] w-[65vw] max-w-[900px] h-[65vw] max-h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18)_0%,rgba(168,85,247,0.08)_38%,transparent_70%)] transform-gpu" />

      {/* Top-Right Corner Glow: Cyan & Electric Blue */}
      <div className="absolute top-[-15%] right-[-15%] w-[65vw] max-w-[900px] h-[65vw] max-h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.16)_0%,rgba(59,130,246,0.08)_38%,transparent_70%)] transform-gpu" />

      {/* Bottom-Left Corner Glow: Indigo & Purple Mesh */}
      <div className="absolute bottom-[-15%] left-[-15%] w-[70vw] max-w-[950px] h-[70vw] max-h-[950px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16)_0%,rgba(139,92,246,0.07)_42%,transparent_70%)] transform-gpu" />

      {/* Bottom-Right Corner Glow: Cyan & Deep Blue Glow */}
      <div className="absolute bottom-[-15%] right-[-15%] w-[70vw] max-w-[950px] h-[70vw] max-h-[950px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.14)_0%,rgba(37,99,235,0.08)_42%,transparent_70%)] transform-gpu" />

      {/* Center Core Ambient Illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[60vh] max-h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.07)_0%,rgba(59,130,246,0.05)_40%,rgba(6,182,212,0.03)_70%,transparent_90%)] transform-gpu" />

      {/* Lightweight SVG Fluid Waves (Without expensive feGaussianBlur or mix-blend-mode rasterization) */}
      <div className="hidden sm:block absolute inset-0 opacity-20">
        <svg
          className="w-full h-full min-w-[1200px] animate-wave-slow motion-reduce:animate-none transform-gpu"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cornerWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M-100 200 C 200 100, 400 350, 700 180 C 1000 10, 1300 300, 1600 150 L 1600 850 L -100 850 Z"
            fill="url(#cornerWave1)"
          />
        </svg>
      </div>
    </div>
  );
});
