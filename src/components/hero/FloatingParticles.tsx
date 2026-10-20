import React, { useEffect, useRef, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  maxAlpha: number;
  r: number;
  g: number;
  b: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number;
}

const COLOR_PALETTE = [
  { r: 255, g: 255, b: 255 },
  { r: 167, g: 139, b: 250 },
  { r: 96, g: 165, b: 250 },
  { r: 45, g: 212, b: 191 },
  { r: 244, g: 114, b: 182 }
];

export const FloatingParticles = memo(function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    let animationFrameId: number | null = null;
    let isVisibleInViewport = true;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    let rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
    let width = rect.width;
    let height = rect.height;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const maxParticles = width < 768 ? 28 : 75;
    const particleCount = Math.min(Math.floor((width * height) / 18000), maxParticles);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
      const layer = Math.random() < 0.5 ? 1 : Math.random() < 0.85 ? 2 : 3;
      const size = layer === 1 ? Math.random() * 1.0 + 0.4 : layer === 2 ? Math.random() * 1.8 + 0.8 : Math.random() * 2.6 + 1.1;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        vx: (Math.random() - 0.5) * (0.15 * layer),
        vy: -((Math.random() * 0.25 + 0.05) * layer),
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.3 + 0.1,
        maxAlpha: Math.random() * 0.85 + 0.3,
        r: color.r,
        g: color.g,
        b: color.b,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        layer,
      });
    }

    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!canvas || !canvas.parentElement) return;
        const r = canvas.parentElement.getBoundingClientRect();
        width = r.width;
        height = r.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }, 150);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleInViewport) return;
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    // Pause particle rendering completely when Hero section scrolls out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleInViewport = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    window.addEventListener('resize', handleResize, { passive: true });
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    let lastTime = performance.now();

    const drawStaticOrAnimated = (delta: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connection lines only on desktop screens
      if (width >= 768) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          if (p1.layer < 2) continue;
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.layer >= 2) {
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < 11000) {
                const dist = Math.sqrt(distSq);
                const alphaFactor = (1 - dist / 105) * 0.14 * Math.min(p1.alpha, p2.alpha);
                ctx.strokeStyle = `rgba(139, 92, 246, ${alphaFactor.toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx * (delta * 120);
          p.y += p.vy * (delta * 120);

          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          if (!isTouchDevice && mouseX > 0 && mouseY > 0) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 150;
            const maxDistSq = maxDist * maxDist;

            if (distSq < maxDistSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (maxDist - dist) / maxDist;
              p.x -= (dx / dist) * force * 3.5 * (delta * 120);
              p.y -= (dy / dist) * force * 3.5 * (delta * 120);
            }
          }

          p.twinklePhase += p.twinkleSpeed * (delta * 60);
          p.alpha = p.baseAlpha + (Math.sin(p.twinklePhase) + 1) * 0.5 * (p.maxAlpha - p.baseAlpha);
        }

        if (p.layer >= 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${(p.alpha * 0.22).toFixed(3)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    if (prefersReducedMotion) {
      drawStaticOrAnimated(0);
      return () => {
        observer.disconnect();
        if (resizeTimer !== null) clearTimeout(resizeTimer);
        window.removeEventListener('resize', handleResize);
      };
    }

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisibleInViewport || document.hidden) return;

      const delta = Math.min((now - lastTime) / 1000, 0.033);
      // Cap mobile particle frame rate to ~30fps to preserve battery and touch scroll smoothness
      if (isTouchDevice && delta < 0.03) return;
      lastTime = now;

      if (!isTouchDevice) {
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
      }

      drawStaticOrAnimated(delta);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-95"
    />
  );
});
