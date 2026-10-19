import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Video, MapPin, Calendar, Film, Eye, Heart, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoLightboxProps {
  video: VideoItem | null;
  videos: VideoItem[];
  onClose: () => void;
  onSelectVideo: (v: VideoItem) => void;
}

export function VideoLightbox({ video, videos, onClose, onSelectVideo }: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
  }, [video]);

  if (!video) return null;

  const currentIndex = videos.findIndex(v => v.id === video.id);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
      setProgress(val);
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/92 backdrop-blur-xl"
        />

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto"
        >
          {/* Main Video Viewport */}
          <div className="relative flex-1 bg-black flex flex-col items-center justify-center min-h-[350px] lg:min-h-[500px] group overflow-hidden">
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.posterUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full max-h-[75vh] object-contain cursor-pointer"
            />

            {/* Floating Overlay Controls on Video */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              {/* Progress Scrubber */}
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-neutral-700 accent-[#2563EB] rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-white text-xs font-mono pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-[#2563EB] transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-[#2563EB] transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-neutral-400">{video.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-[#2563EB] transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#2563EB] text-white hover:scale-110 active:scale-90 transition-all duration-200 backdrop-blur-md cursor-pointer z-20"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#2563EB] text-white hover:scale-110 active:scale-90 transition-all duration-200 backdrop-blur-md cursor-pointer z-20"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-full lg:w-80 p-6 lg:p-8 bg-neutral-900 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-800 text-white">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#2563EB] text-xs font-mono font-bold uppercase tracking-wider">
                    {video.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3 font-mono leading-tight">{video.title}</h3>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
                "{video.caption}"
              </p>

              {/* Video Equipment & Specs */}
              <div className="space-y-4 pt-6 border-t border-neutral-800 text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  <span>{video.location}</span>
                </div>

                {video.camera && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#2563EB]" />
                    <span>{video.camera} • {video.lens}</span>
                  </div>
                )}

                {video.settings && (
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#2563EB]" />
                    <span>{video.settings}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <span>Released {video.year}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#2563EB] font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-[#2563EB]" />
                    <span>{video.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-xs font-mono text-neutral-500 flex justify-between">
              <span>Reel {currentIndex + 1} of {videos.length}</span>
              <span>Muhammed Mushfiq</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
