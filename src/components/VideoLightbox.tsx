import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, Check } from 'lucide-react';
import { VideoItem } from '../types';
import { extractGoogleDriveId } from '../utils/googleDrive';

interface VideoLightboxProps {
  video: VideoItem | null;
  videos: VideoItem[];
  onClose: () => void;
  onSelectVideo: (v: VideoItem) => void;
}

export function VideoLightbox({ video, videos, onClose, onSelectVideo }: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (!video || videos.length === 0) return;
        const curIdx = videos.findIndex((v) => v.id === video.id);
        const prevIdx = (curIdx - 1 + videos.length) % videos.length;
        onSelectVideo(videos[prevIdx]);
      } else if (e.key === 'ArrowRight') {
        if (!video || videos.length === 0) return;
        const curIdx = videos.findIndex((v) => v.id === video.id);
        const nextIdx = (curIdx + 1) % videos.length;
        onSelectVideo(videos[nextIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video, videos, onClose, onSelectVideo]);

  if (!video) return null;

  const currentIndex = videos.findIndex((v) => v.id === video.id);
  const googleDriveId = extractGoogleDriveId(video.videoUrl);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid.videoWidth && vid.videoHeight) {
      if (vid.videoWidth > vid.videoHeight * 1.1) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + videos.length) % videos.length;
    onSelectVideo(videos[prevIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % videos.length;
    onSelectVideo(videos[nextIdx]);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      if (googleDriveId) {
        window.open(`https://drive.google.com/uc?export=download&id=${googleDriveId}`, '_blank');
      } else {
        const response = await fetch(video.videoUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${video.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'video'}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch {
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.download = `${video.title || 'video'}.mp4`;
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
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
          aria-label="Previous video"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 lg:right-16 z-20 p-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/10"
          aria-label="Next video"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Modal Card matching exact reference image layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative ${
            isLandscape ? 'max-w-[760px]' : 'max-w-[460px] sm:max-w-[500px]'
          } w-full bg-[#121316]/95 border border-white/15 rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(37,99,235,0.15)] backdrop-blur-2xl z-10 flex flex-col my-auto text-white`}
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
          <div
            className={`relative w-full ${
              isLandscape
                ? 'aspect-video min-h-[300px] sm:min-h-[420px]'
                : 'h-[380px] sm:h-[460px] md:h-[500px]'
            } bg-[#181920] border border-white/10 rounded-[24px] overflow-hidden flex items-center justify-center shadow-inner group`}
          >
            {/* Ambient Blurred Background from Video Poster */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={video.posterUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover blur-2xl scale-125 opacity-35 select-none"
              />
              <div className="absolute inset-0 bg-neutral-950/40" />
            </div>

            {/* Main Video Viewport - Fitted to Height */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2 rounded-[20px] overflow-hidden">
              {googleDriveId ? (
                <iframe
                  src={`https://drive.google.com/file/d/${googleDriveId}/preview`}
                  className="h-full w-full max-w-full rounded-[18px] border-0 bg-black shadow-2xl"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={video.title}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.posterUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  onLoadedMetadata={handleVideoMetadata}
                  onClick={togglePlay}
                  className="h-full w-auto max-w-full object-contain rounded-[18px] select-none block shadow-2xl cursor-pointer"
                />
              )}
            </div>

            {/* Premium Download Pill Button matching exact reference image */}
            <button
              onClick={handleDownload}
              title="Download video"
              className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-white text-neutral-200 hover:text-black border border-white/15 backdrop-blur-md text-xs font-sans font-medium transition-all duration-200 shadow-lg active:scale-95 cursor-pointer group"
            >
              {downloading ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Bar: Title & Location/Subtitle (Centered) matching exact reference image */}
          <div className="mt-4 px-2 text-center">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {video.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1 truncate">
              {video.location}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
