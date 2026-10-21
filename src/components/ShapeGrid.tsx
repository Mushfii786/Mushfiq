import React, { useEffect, useRef, memo } from 'react';

export interface ShapeGridProps {
  direction?: 'diagonal' | 'horizontal' | 'vertical';
  speed?: number;
  squareSize?: number;
  shape?: 'square';
  hoverTrailAmount?: number;
  className?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  intensity: number;
}

export const ShapeGrid = memo(function ShapeGrid({
  direction = 'diagonal',
  speed = 0.4,
  squareSize = 42,
  hoverTrailAmount = 8,
  className = '',
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animFrameIdRef = useRef<number | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovering: false,
  });
  const trailRef = useRef<TrailPoint[]>([]);
  const isHiddenRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const supportsCssMaskRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    supportsCssMaskRef.current =
      typeof CSS !== 'undefined' &&
      Boolean(
        CSS.supports?.('mask-image', 'radial-gradient(circle, black, transparent)') ||
          CSS.supports?.('-webkit-mask-image', 'radial-gradient(circle, black, transparent)')
      );

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    reducedMotionRef.current = mediaQuery.matches || isTouchDevice;

    const getResponsiveSquareSize = (width: number) => {
      if (width >= 1024) return squareSize;
      if (width >= 640) return Math.min(34, squareSize);
      return Math.min(28, squareSize);
    };

    let width = 0;
    let height = 0;
    let currentSquareSize = getResponsiveSquareSize(window.innerWidth);

    const drawGridFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const size = currentSquareSize;
      const shiftX = offsetRef.current.x % size;
      const shiftY = offsetRef.current.y % size;

      const startCol = -1;
      const endCol = Math.ceil(width / size) + 1;
      const startRow = -1;
      const endRow = Math.ceil(height / size) + 1;

      const trail = trailRef.current;
      const hoverRadius = size * 2.2;

      if (trail.length > 0 && !reducedMotionRef.current) {
        for (let c = startCol; c <= endCol; c++) {
          const px = c * size + shiftX;
          const cellCenterX = px + size / 2;

          if (cellCenterX < -hoverRadius || cellCenterX > width + hoverRadius) continue;

          for (let r = startRow; r <= endRow; r++) {
            const py = r * size + shiftY;
            const cellCenterY = py + size / 2;

            if (cellCenterY < -hoverRadius || cellCenterY > height + hoverRadius) continue;

            let maxIntensity = 0;
            for (let i = 0; i < trail.length; i++) {
              const tp = trail[i];
              const distSq = (cellCenterX - tp.x) ** 2 + (cellCenterY - tp.y) ** 2;
              if (distSq < hoverRadius ** 2) {
                const dist = Math.sqrt(distSq);
                const normDist = 1 - dist / hoverRadius;
                const cellIntensity = normDist * normDist * tp.intensity;
                if (cellIntensity > maxIntensity) {
                  maxIntensity = cellIntensity;
                }
              }
            }

            if (maxIntensity > 0.01) {
              const alpha = Math.min(0.14, 0.14 * maxIntensity);
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
              ctx.fillRect(px, py, size, size);
            }
          }
        }
      }

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;

      for (let c = startCol; c <= endCol; c++) {
        const x = Math.floor(c * size + shiftX) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let r = startRow; r <= endRow; r++) {
        const y = Math.floor(r * size + shiftY) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();

      if (!supportsCssMaskRef.current) {
        ctx.globalCompositeOperation = 'destination-in';
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.max(width, height) * 0.65;
        const radGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.15, centerX, centerY, radius);
        radGrad.addColorStop(0, 'rgba(0,0,0,1)');
        radGrad.addColorStop(0.5, 'rgba(0,0,0,0.8)');
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = window.innerHeight;
      currentSquareSize = getResponsiveSquareSize(width);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGridFrame();
    };

    handleResize();

    let resizeTimeout: number | null = null;
    const onResize = () => {
      if (resizeTimeout !== null) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(handleResize, 120);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches || isTouchDevice;
      if (reducedMotionRef.current) {
        drawGridFrame();
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // On mobile / touch devices or reduced motion, static crisp grid only (zero 60fps CPU/GPU loop during scroll)
    if (reducedMotionRef.current) {
      return () => {
        if (resizeTimeout !== null) clearTimeout(resizeTimeout);
        mediaQuery.removeEventListener('change', handleMotionChange);
        window.removeEventListener('resize', onResize);
      };
    }

    let isScrolling = false;
    let scrollTimer: number | null = null;
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimer !== null) clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        isScrolling = false;
        lastTime = performance.now();
      }, 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isHovering = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const handleVisibilityChange = () => {
      isHiddenRef.current = document.hidden;
      if (!document.hidden) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let dx = 1;
    let dy = 1;
    if (direction === 'horizontal') {
      dx = 1;
      dy = 0;
    } else if (direction === 'vertical') {
      dx = 0;
      dy = 1;
    }

    let lastTime = performance.now();
    let lastTrailSampleTime = 0;

    const render = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      if (isHiddenRef.current || isScrolling || reducedMotionRef.current) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      // Throttle background grid animation to ~30fps when cursor is idle and trail has faded
      if (!mouseRef.current.isHovering && trailRef.current.length === 0 && dt < 0.032) return;
      lastTime = time;

      const frameScale = dt * 60;
      const moveStep = speed * 30 * dt;
      offsetRef.current.x = (offsetRef.current.x + dx * moveStep) % currentSquareSize;
      offsetRef.current.y = (offsetRef.current.y + dy * moveStep) % currentSquareSize;

      const mouse = mouseRef.current;
      const lerpFactor = 1 - Math.pow(1 - 0.25, frameScale);
      if (mouse.isHovering) {
        mouse.x += (mouse.targetX - mouse.x) * lerpFactor;
        mouse.y += (mouse.targetY - mouse.y) * lerpFactor;
      } else {
        mouse.x += (-1000 - mouse.x) * lerpFactor;
        mouse.y += (-1000 - mouse.y) * lerpFactor;
      }

      const trail = trailRef.current;
      const decayFactor = Math.pow(0.88, frameScale);
      for (let i = 0; i < trail.length; i++) {
        trail[i].intensity *= decayFactor;
      }

      if (mouse.x > -500 && mouse.y > -500 && time - lastTrailSampleTime >= 14) {
        lastTrailSampleTime = time;
        trail.push({ x: mouse.x, y: mouse.y, intensity: 1.0 });
      }

      const maxPoints = Math.max(1, hoverTrailAmount);
      while (trail.length > maxPoints) {
        trail.shift();
      }

      while (trail.length > 0 && trail[0].intensity < 0.01) {
        trail.shift();
      }

      drawGridFrame();
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (resizeTimeout !== null) clearTimeout(resizeTimeout);
      if (scrollTimer !== null) clearTimeout(scrollTimer);
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [direction, speed, squareSize, hoverTrailAmount]);

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none bg-[#050505] overflow-hidden ${className}`}
      style={{
        contain: 'strict',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 25%, rgba(0,0,0,0.8) 55%, transparent 85%)',
        maskImage: 'radial-gradient(circle at 50% 50%, black 25%, rgba(0,0,0,0.8) 55%, transparent 85%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
});

export default ShapeGrid;
