import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, Check, Share2 } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { Photo } from '../types';
import { siteConfig } from '../config/site';

interface PhotoLightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onSelectPhoto: (p: Photo) => void;
}

export function PhotoLightbox({ photo, photos, onClose, onSelectPhoto }: PhotoLightboxProps) {
  const [downloading, setDownloading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const currentIndex = photo ? photos.findIndex(p => p.id === photo.id) : -1;

  // Preload adjacent photos for instant Next/Previous transitions
  useEffect(() => {
    if (!photo || photos.length <= 1 || currentIndex === -1) return;
    const nextPhoto = photos[(currentIndex + 1) % photos.length];
    const prevPhoto = photos[(currentIndex - 1 + photos.length) % photos.length];
    [nextPhoto?.url, prevPhoto?.url].forEach((src) => {
      if (src) {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      }
    });
  }, [photo, photos, currentIndex]);

  if (!photo) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIdx]);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${photo.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'photo'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = `${photo.title || 'photo'}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => setDownloading(false), 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/75 backdrop-blur-md"
        />

        {/* Outer Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 lg:left-16 z-20 p-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/10"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 lg:right-16 z-20 p-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/10"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Modal Card matching website dark luxury aesthetic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative max-w-[460px] sm:max-w-[500px] w-full bg-[#121316]/95 border border-white/15 rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(37,99,235,0.15)] backdrop-blur-2xl z-10 flex flex-col my-auto text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 shadow-lg cursor-pointer backdrop-blur-md border border-white/15"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Inner Frame */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-[#181920] border border-white/10 rounded-[24px] overflow-hidden flex items-center justify-center shadow-inner">
            {/* Ambient Blurred Background Image */}
            {photo.url ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src={photo.url}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  className="w-full h-full object-cover blur-2xl scale-125 opacity-35 select-none"
                />
                <div className="absolute inset-0 bg-neutral-950/40" />
              </div>
            ) : null}

            {/* Main Photo Image - Fitted to Height */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2 rounded-[20px] overflow-hidden">
              {photo.url ? (
                <img
                  src={photo.url}
                  alt={photo.title}
                  decoding="async"
                  className="h-full w-auto max-w-full object-contain rounded-[18px] select-none block shadow-2xl"
                />
              ) : null}
            </div>

            {/* Action Buttons: Share & Download positioned alongside each other (Icon only) */}
            <div className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-2">
              {/* Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                title="Share photo"
                aria-label="Share photo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/80 hover:bg-white text-neutral-200 hover:text-black border border-white/15 backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95 cursor-pointer group flex items-center justify-center"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                title="Download image"
                aria-label="Download image"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/80 hover:bg-white text-neutral-200 hover:text-black border border-white/15 backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95 cursor-pointer group flex items-center justify-center"
              >
                {downloading ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 stroke-[2.5]" />
                ) : (
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Bar: Title & Subtitle/Location (Centered) */}
          <div className="mt-4 px-2 text-center">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {photo.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-0.5 truncate">
              {photo.location || photo.caption || 'Frames by Mushfii'}
            </p>
          </div>
        </motion.div>

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={photo.title}
          text={`Check out "${photo.title}" by Muhammed Mushfiq (MUSHFII)`}
          url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#${photo.id}` : undefined}
        />
      </div>
    </AnimatePresence>
  );
}
