import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export interface CoverFlowItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  likes?: number;
  type?: 'photo' | 'video' | 'project';
  data?: any;
}

interface CoverFlowGalleryProps {
  items: CoverFlowItem[];
  onSelectItem?: (item: CoverFlowItem) => void;
  autoPlayInterval?: number; // default 5000ms (5 seconds)
  badgeTitle?: string;
}

export function CoverFlowGallery({
  items,
  onSelectItem,
  autoPlayInterval = 5000,
  badgeTitle = "PHOTOGRAPHY WORKS",
}: CoverFlowGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = items.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-scroll effect: advances continuously every 5 seconds (autoPlayInterval = 5000ms) without pausing on hover
  useEffect(() => {
    if (total <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [total, autoPlayInterval]);

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      if (onSelectItem) {
        onSelectItem(items[index]);
      }
    } else {
      setActiveIndex(index);
    }
  };

  // Helper to calculate 3D Cover Flow positioning for each item relative to activeIndex
  const getCardStyle = (index: number) => {
    let diff = index - activeIndex;

    // Wrap around for smooth infinite carousel calculations
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);

    // Only render cards within a visible range (-2 to +2)
    if (absDiff > 2) {
      return {
        visible: false,
        x: diff > 0 ? 600 : -600,
        scale: 0.5,
        rotateY: diff > 0 ? 45 : -45,
        opacity: 0,
        zIndex: 0,
      };
    }

    // Positions & 3D transforms based on offset
    let xOffset = 0;
    let scale = 1;
    let rotateY = 0;
    let opacity = 1;
    let zIndex = 30;

    if (diff === 0) {
      // Center Active Card
      xOffset = 0;
      scale = 1;
      rotateY = 0;
      opacity = 1;
      zIndex = 30;
    } else if (diff === 1) {
      // Right 1
      xOffset = 210;
      scale = 0.84;
      rotateY = -28;
      opacity = 0.82;
      zIndex = 20;
    } else if (diff === -1) {
      // Left 1
      xOffset = -210;
      scale = 0.84;
      rotateY = 28;
      opacity = 0.82;
      zIndex = 20;
    } else if (diff === 2) {
      // Far Right
      xOffset = 370;
      scale = 0.68;
      rotateY = -42;
      opacity = 0.45;
      zIndex = 10;
    } else if (diff === -2) {
      // Far Left
      xOffset = -370;
      scale = 0.68;
      rotateY = 42;
      opacity = 0.45;
      zIndex = 10;
    }

    return {
      visible: true,
      x: xOffset,
      scale,
      rotateY,
      opacity,
      zIndex,
    };
  };

  return (
    <div
      className="relative w-full py-10 px-2 sm:px-6 rounded-3xl overflow-hidden bg-neutral-950/90 dark:bg-[#08080a]/95 border border-neutral-800/80 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl my-4 select-none"
    >
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#2563EB]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 3D Coverflow Container */}
      <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center perspective-[1200px] overflow-hidden">
        {items.map((item, index) => {
          const style = getCardStyle(index);
          if (!style.visible) return null;

          const isActive = index === activeIndex;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleCardClick(index)}
              initial={false}
              animate={{
                x: style.x,
                scale: style.scale,
                rotateY: style.rotateY,
                opacity: style.opacity,
                zIndex: style.zIndex,
              }}
              transition={{
                duration: 0.65,
                ease: [0.25, 1, 0.5, 1], // Custom smooth cubic-bezier curve
              }}
              style={{
                position: 'absolute',
                transformStyle: 'preserve-3d',
              }}
              className={`cursor-pointer group w-[220px] sm:w-[270px] ${
                isActive ? 'pointer-events-auto' : 'pointer-events-auto'
              }`}
            >
              {/* Card Container Frame matching dark website theme */}
              <div
                className={`relative p-3 pb-4 sm:p-4 sm:pb-5 rounded-[2rem] transition-all duration-300 ${
                  isActive
                    ? 'bg-neutral-900/95 border-2 border-[#2563EB]/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-[#2563EB]/40'
                    : 'bg-neutral-900/80 border border-neutral-800 shadow-xl opacity-90 hover:opacity-100 hover:border-neutral-700'
                }`}
              >
                {/* Image Wrap */}
                <div className="relative w-full aspect-[4/5] rounded-[1.4rem] overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner group">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  {/* Hover Overlay Badge for active card */}
                  {isActive && (
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-[#2563EB]" />
                    </div>
                  )}
                </div>

                {/* Text Content below image: Title and Location/Category */}
                <div className="mt-3.5 px-1 text-center flex flex-col items-center">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate group-hover:text-[#2563EB] transition-colors max-w-full">
                    {item.title}
                  </h3>
                  {(item.data?.location || item.subtitle || item.category) && (
                    <p className="text-xs font-medium text-neutral-400 truncate mt-0.5">
                      {item.data?.location || item.subtitle || item.category}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Chevrons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-900/85 hover:bg-[#2563EB] border border-white/15 text-white flex items-center justify-center backdrop-blur-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-900/85 hover:bg-[#2563EB] border border-white/15 text-white flex items-center justify-center backdrop-blur-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4 relative z-40">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex
                ? 'w-8 bg-[#2563EB] shadow-[0_0_12px_#2563EB]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
