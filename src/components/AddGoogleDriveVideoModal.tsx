import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Eye,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  FolderOpen,
  Sliders,
  Film,
  ExternalLink,
  Clock,
  HardDrive
} from 'lucide-react';
import { VideoGalleryItem } from './VideoGalleryPage';
import { extractGoogleDriveId } from '../utils/googleDrive';
import { saveVideoBlob, captureVideoFrame } from '../utils/videoStorage';

interface AddGoogleDriveVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: VideoGalleryItem) => void;
  existingCount: number;
}

const SAMPLE_DRIVE_LINKS = [
  {
    label: "Demo 1: Cinematic Drone Reel",
    url: "https://drive.google.com/file/d/1wN-76uOqA9mB5YxX3_7C3U2cZ4j9L1vP/view?usp=sharing",
    title: "Cinematic Horizons Reel",
    category: "Cinematic Reels",
    caption: "High-definition drone sweep and horizon perspective hosted on Google Drive.",
  },
  {
    label: "Demo 2: Cultural Event Highlights",
    url: "https://drive.google.com/file/d/1_9bXm4Z0qA8rD2vT6wE7uP1oK3jL5mN8/view?usp=sharing",
    title: "Campus Cultural Night Aftermovie",
    category: "Commercial & Brand",
    caption: "Low-light stage performances and audience energy streamed via Google Drive.",
  }
];

const DEFAULT_POSTERS = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?auto=format&fit=crop&q=80&w=1200",
];

export function AddGoogleDriveVideoModal({
  isOpen,
  onClose,
  onAddVideo,
  existingCount,
}: AddGoogleDriveVideoModalProps) {
  // Source mode: 'gallery' (default upload from device gallery) or 'url' (Google Drive / link)
  const [sourceMode, setSourceMode] = useState<'gallery' | 'url'>('gallery');

  // Video file from gallery
  const [galleryVideoFile, setGalleryVideoFile] = useState<File | null>(null);
  const [galleryVideoUrl, setGalleryVideoUrl] = useState<string>('');
  const [galleryVideoDuration, setGalleryVideoDuration] = useState<string>('');
  const [autoThumbnail, setAutoThumbnail] = useState<string>('');
  const [isVideoDragging, setIsVideoDragging] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL mode state
  const [driveUrl, setDriveUrl] = useState('');
  const [testPreviewOpen, setTestPreviewOpen] = useState(true);

  // Common metadata
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cinematic Reels');
  const [caption, setCaption] = useState('');

  // Thumbnail from gallery
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string>('');
  const [thumbnailFileName, setThumbnailFileName] = useState<string>('');
  const [isThumbDragging, setIsThumbDragging] = useState(false);
  const [thumbUploadError, setThumbUploadError] = useState('');

  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const sliderRailRef = useRef<HTMLDivElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  // Scroll Slider & Mouse Scroll State
  const [scrollRatio, setScrollRatio] = useState(0); // 0 to 1
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [sliderThumbHeight, setSliderThumbHeight] = useState(50);
  const [sliderMaxOffset, setSliderMaxOffset] = useState(250);

  // Update metrics for slider and scrollbar
  const updateScrollMetrics = useCallback(() => {
    if (!formRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = formRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    setScrollRatio(ratio);

    if (sliderRailRef.current) {
      const railH = sliderRailRef.current.clientHeight;
      const calculatedThumb = maxScroll > 0 
        ? Math.max(36, Math.min(100, Math.round(railH * (clientHeight / scrollHeight))))
        : 50;
      setSliderThumbHeight(calculatedThumb);
      setSliderMaxOffset(Math.max(10, railH - calculatedThumb - 8));
    }
  }, []);

  // Update on content or resize changes
  useEffect(() => {
    updateScrollMetrics();
    const handleResize = () => updateScrollMetrics();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollMetrics, testPreviewOpen, thumbnailDataUrl, galleryVideoUrl, sourceMode]);

  // Handle native wheel events directly on the form so mouse wheel scrolls smoothly
  useEffect(() => {
    const el = formRef.current;
    if (!el || !isOpen) return;

    const onNativeWheel = (e: WheelEvent) => {
      e.stopPropagation();
      el.scrollTop += e.deltaY;
      updateScrollMetrics();
    };

    el.addEventListener('wheel', onNativeWheel, { passive: true });
    return () => {
      el.removeEventListener('wheel', onNativeWheel);
    };
  }, [isOpen, updateScrollMetrics]);

  const handleFormScroll = () => {
    updateScrollMetrics();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (formRef.current) {
      formRef.current.scrollTop += e.deltaY;
      updateScrollMetrics();
    }
  };

  // Dragging / Clicking on Scroll Slider
  const applyScrollFromRailY = useCallback((clientY: number) => {
    if (!formRef.current || !sliderRailRef.current) return;
    const rect = sliderRailRef.current.getBoundingClientRect();
    const effectiveH = rect.height - sliderThumbHeight - 8;
    if (effectiveH <= 0) return;
    const relativeY = clientY - rect.top - 4 - sliderThumbHeight / 2;
    const ratio = Math.max(0, Math.min(1, relativeY / effectiveH));
    const maxScroll = formRef.current.scrollHeight - formRef.current.clientHeight;
    formRef.current.scrollTop = ratio * maxScroll;
    setScrollRatio(ratio);
  }, [sliderThumbHeight]);

  const handleRailClick = (e: React.MouseEvent) => {
    applyScrollFromRailY(e.clientY);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingSlider(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      applyScrollFromRailY(moveEvent.clientY);
    };

    const onMouseUp = () => {
      setIsDraggingSlider(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const thumbOffset = Math.round(scrollRatio * sliderMaxOffset);

  // Video processing from device gallery
  const processVideoFile = async (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm|mkv|avi|m4v)$/i)) {
      setVideoError('Please select a valid video file from your gallery (MP4, MOV, WEBM, MKV).');
      return;
    }
    setVideoError('');
    setIsProcessingVideo(true);

    try {
      if (galleryVideoUrl) {
        URL.revokeObjectURL(galleryVideoUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setGalleryVideoUrl(newUrl);
      setGalleryVideoFile(file);

      // Auto-populate video title if currently empty
      if (!title.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        if (cleanName) {
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }

      // Automatically capture first frame for poster thumbnail & detect duration
      const { dataUrl, duration } = await captureVideoFrame(file);
      if (duration > 0) {
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        setGalleryVideoDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      } else {
        setGalleryVideoDuration('HD Reel');
      }

      if (dataUrl) {
        setAutoThumbnail(dataUrl);
        if (!thumbnailDataUrl) {
          setThumbnailDataUrl(dataUrl);
          setThumbnailFileName(`${file.name} (Auto-captured Cinema Frame)`);
        }
      }
    } catch (e) {
      console.warn('Frame capture notice:', e);
    } finally {
      setIsProcessingVideo(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVideoDragging(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVideoDragging(false);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsVideoDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveGalleryVideo = () => {
    if (galleryVideoUrl) {
      URL.revokeObjectURL(galleryVideoUrl);
    }
    setGalleryVideoUrl('');
    setGalleryVideoFile(null);
    setGalleryVideoDuration('');
    setAutoThumbnail('');
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  // Thumbnail processing from device gallery
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setThumbUploadError('Please select a valid image file from your gallery (JPEG, PNG, WEBP).');
      return;
    }
    setThumbUploadError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 720;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setThumbnailDataUrl(optimizedDataUrl);
        } else {
          setThumbnailDataUrl(rawDataUrl);
        }
        setThumbnailFileName(file.name);
      };
      img.onerror = () => {
        setThumbnailDataUrl(rawDataUrl);
        setThumbnailFileName(file.name);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleThumbDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsThumbDragging(true);
  };

  const handleThumbDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsThumbDragging(false);
  };

  const handleThumbDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsThumbDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailDataUrl('');
    setThumbnailFileName('');
    if (thumbFileInputRef.current) {
      thumbFileInputRef.current.value = '';
    }
  };

  // Google Drive sample loader
  const handleUseSample = (sample: typeof SAMPLE_DRIVE_LINKS[0]) => {
    setSourceMode('url');
    setDriveUrl(sample.url);
    setTitle(sample.title);
    setCategory(sample.category);
    setCaption(sample.caption);
    setThumbnailDataUrl(DEFAULT_POSTERS[existingCount % DEFAULT_POSTERS.length]);
    setThumbnailFileName("Default Cinematic Poster");
  };

  const detectedDriveId = extractGoogleDriveId(driveUrl);
  const isGalleryMode = sourceMode === 'gallery';
  const isValid = isGalleryMode
    ? Boolean(galleryVideoFile && title.trim())
    : Boolean(detectedDriveId && title.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const finalPoster = thumbnailDataUrl.trim() || autoThumbnail.trim() || DEFAULT_POSTERS[existingCount % DEFAULT_POSTERS.length];
      const finalCaption = caption.trim() || (isGalleryMode
        ? `Cinematic visual reel uploaded from gallery.`
        : `Cinematic visual reel streamed directly from Google Drive.`
      );

      const videoId = isGalleryMode ? `vgal-gallery-${Date.now()}` : `vgal-drive-${Date.now()}`;

      // Persist gallery video file into IndexedDB for persistent local playback across sessions
      if (isGalleryMode && galleryVideoFile) {
        await saveVideoBlob(videoId, galleryVideoFile);
      }

      const newVideo: VideoGalleryItem = {
        id: videoId,
        title: title.trim(),
        category: category,
        url: finalPoster,
        videoUrl: isGalleryMode ? galleryVideoUrl : `https://drive.google.com/file/d/${detectedDriveId}/preview`,
        caption: finalCaption,
        location: "Cinematic Film",
        camera: "Cinema Rig",
        lens: "35mm Prime",
        settings: "4K UHD • High Bitrate",
        year: new Date().getFullYear().toString(),
        column: ((existingCount % 4) + 1) as 1 | 2 | 3 | 4,
        aspectRatioClass: "aspect-[16/9]",
        duration: isGalleryMode && galleryVideoDuration ? galleryVideoDuration : "HD Reel",
        views: 1,
        likes: 0,
        isCustom: true,
        isGalleryUpload: isGalleryMode,
        videoFileName: isGalleryMode && galleryVideoFile ? galleryVideoFile.name : undefined,
        videoFileSize: isGalleryMode && galleryVideoFile ? `${(galleryVideoFile.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
      };

      onAddVideo(newVideo);
    } catch (err) {
      console.error('Failed saving video:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div data-lenis-prevent="true" className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Box */}
        <motion.div
          data-lenis-prevent="true"
          onWheel={handleWheel}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative max-w-2xl w-full bg-[#0a0a0c] border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Header */}
          <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white flex-shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>Professional Video Upload</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                    Gallery Ready
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  Select video directly from your device gallery with instant preview & custom poster
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/40 border border-blue-800/40 text-[10px] font-mono text-blue-300">
                <Sliders className="w-3 h-3 text-[#2563EB]" />
                <span>Scroll Slider Active</span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scroll Slider Progress Indicator */}
          <div className="h-0.5 bg-neutral-900 w-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] to-blue-400 transition-all duration-75"
              style={{ width: `${Math.round(scrollRatio * 100)}%` }}
            />
          </div>

          {/* Form Content & Scroll Slider Track */}
          <div className="relative">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onScroll={handleFormScroll}
              onWheel={handleWheel}
              data-lenis-prevent="true"
              className="p-5 sm:p-7 pr-8 sm:pr-9 space-y-5 max-h-[75vh] overflow-y-auto modal-scroll-slider overscroll-contain"
            >

            {/* VIDEO SOURCE BLOCK (CSS Selector Target 1 & 2) */}
            <div className="space-y-3">
              {/* Top Row with Label (CSS Selector 2) & Mode Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>
                    {isGalleryMode ? 'Add Video from Gallery' : 'Google Drive Video Link'} <span className="text-red-400">*</span>
                  </span>
                </label>

                {/* Source Mode Toggle Tabs */}
                <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSourceMode('gallery')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      isGalleryMode
                        ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>From Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode('url')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      !isGalleryMode
                        ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Drive URL</span>
                  </button>
                </div>
              </div>

              {/* Primary Video Input Element (Direct child of div:nth-of-type(1) - CSS Selector 1) */}
              <input
                type="text"
                readOnly={isGalleryMode}
                value={isGalleryMode ? (galleryVideoFile ? `${galleryVideoFile.name} (${(galleryVideoFile.size / (1024 * 1024)).toFixed(1)} MB)` : '') : driveUrl}
                onChange={(e) => {
                  if (!isGalleryMode) {
                    setDriveUrl(e.target.value);
                  }
                }}
                onClick={() => {
                  if (isGalleryMode) {
                    videoFileInputRef.current?.click();
                  }
                }}
                placeholder={isGalleryMode ? "Click here to choose video from your gallery / files..." : "https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing"}
                className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700/80 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-sm text-white placeholder-neutral-500 font-mono transition-all outline-none ${
                  isGalleryMode ? 'cursor-pointer hover:border-[#2563EB]/80' : ''
                }`}
                required={!isGalleryMode}
              />

              {/* Hidden Native Video File Picker */}
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/mkv,video/avi,video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                id="gallery-video-file-picker"
              />

              {/* GALLERY MODE INTERFACE */}
              {isGalleryMode && (
                <div className="space-y-3">
                  {galleryVideoUrl ? (
                    /* Video Loaded - Live Preview Card */
                    <div className="relative rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950/90 p-3 group">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-inner">
                        <video
                          src={galleryVideoUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500/95 text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg pointer-events-none">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Gallery Video Ready</span>
                        </div>
                      </div>

                      {/* Video File Specs & Action Buttons */}
                      <div className="mt-3 px-1 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2 text-neutral-300">
                          <span className="truncate max-w-[200px] sm:max-w-[280px] font-bold text-white">
                            {galleryVideoFile?.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300">
                            {galleryVideoFile ? `${(galleryVideoFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}
                          </span>
                          {galleryVideoDuration && (
                            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 text-[10px] flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{galleryVideoDuration}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Change Video</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveGalleryVideo}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer"
                            title="Remove Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Video Upload Drop Zone */
                    <div
                      onDragOver={handleVideoDragOver}
                      onDragLeave={handleVideoDragLeave}
                      onDrop={handleVideoDrop}
                      onClick={() => videoFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                        isVideoDragging
                          ? 'border-[#2563EB] bg-[#2563EB]/10 scale-[1.01]'
                          : 'border-neutral-700/80 hover:border-[#2563EB]/70 bg-neutral-950/60 hover:bg-neutral-950'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                          <Film className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-mono font-bold text-white flex items-center justify-center gap-1.5">
                            <FolderOpen className="w-4 h-4 text-[#2563EB]" />
                            <span>Click to Choose Video from Gallery</span>
                          </p>
                          <p className="text-xs text-neutral-400 mt-1 font-sans">
                            Select MP4, MOV, WEBM, or MKV video from your phone or computer
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                            MP4
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                            MOV / QuickTime
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                            WEBM
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                            4K & HD Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {videoError && (
                    <p className="text-xs text-red-400 font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{videoError}</span>
                    </p>
                  )}
                </div>
              )}

              {/* URL MODE INTERFACE */}
              {!isGalleryMode && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-end gap-2 text-[11px] font-mono text-[#2563EB]">
                    <span>Sample links:</span>
                    <button
                      type="button"
                      onClick={() => handleUseSample(SAMPLE_DRIVE_LINKS[0])}
                      className="hover:underline text-blue-400 cursor-pointer"
                    >
                      Demo 1
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleUseSample(SAMPLE_DRIVE_LINKS[1])}
                      className="hover:underline text-blue-400 cursor-pointer"
                    >
                      Demo 2
                    </button>
                  </div>

                  {detectedDriveId ? (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>Drive ID Connected: <strong className="text-white font-bold">{detectedDriveId.slice(0, 14)}...</strong></span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setTestPreviewOpen(!testPreviewOpen)}
                          className="text-[11px] text-emerald-400 hover:text-white underline cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{testPreviewOpen ? 'Hide Preview' : 'Show Preview'}</span>
                        </button>
                      </div>

                      {testPreviewOpen && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-inner">
                          <iframe
                            src={`https://drive.google.com/file/d/${detectedDriveId}/preview`}
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            title="Live Google Drive Preview"
                          />
                        </div>
                      )}
                    </div>
                  ) : driveUrl.trim() ? (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-2 text-xs font-mono text-amber-300">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Please enter a valid Google Drive shareable link or file ID.</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Supported formats: /file/d/ID/view, open?id=ID, uc?id=ID, or direct Drive ID
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Video Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Video Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cinematic Highlights & Aftermovie"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700/80 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-sm text-white placeholder-neutral-500 font-mono transition-all outline-none"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700/80 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs text-white font-mono transition-all outline-none cursor-pointer"
              >
                <option value="Cinematic Reels">Cinematic Reels</option>
                <option value="Commercial & Brand">Commercial & Brand</option>
                <option value="Drone & FPV">Drone & FPV</option>
                <option value="Motion & VFX">Motion & VFX</option>
                <option value="Documentary">Documentary</option>
                <option value="Creative Direction">Creative Direction</option>
                <option value="Music Video">Music Video</option>
              </select>
            </div>

            {/* Thumbnail Upload from Gallery (Device File Picker & Drag-and-Drop) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Upload Thumbnail from Gallery</span>
                </label>
                {thumbnailDataUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Hidden File Input for Thumbnail */}
              <input
                ref={thumbFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbFileChange}
                className="hidden"
                id="gallery-thumbnail-upload"
              />

              {thumbnailDataUrl ? (
                /* Thumbnail Preview Card */
                <div className="relative rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950/80 p-3 group">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-neutral-800">
                    <img
                      src={thumbnailDataUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{autoThumbnail && thumbnailDataUrl === autoThumbnail ? 'Video Frame Thumbnail' : 'Gallery Thumbnail Ready'}</span>
                    </div>

                    {/* Change Button in Overlay */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => thumbFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-neutral-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-neutral-700 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 px-1 flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span className="truncate max-w-[280px] sm:max-w-[360px] text-neutral-300">
                      {thumbnailFileName || 'Custom gallery image'}
                    </span>
                    <button
                      type="button"
                      onClick={() => thumbFileInputRef.current?.click()}
                      className="text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Choose different
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload Drop Zone for Thumbnail */
                <div
                  onDragOver={handleThumbDragOver}
                  onDragLeave={handleThumbDragLeave}
                  onDrop={handleThumbDrop}
                  onClick={() => thumbFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    isThumbDragging
                      ? 'border-[#2563EB] bg-[#2563EB]/10 scale-[1.01]'
                      : 'border-neutral-700/80 hover:border-[#2563EB]/70 bg-neutral-950/60 hover:bg-neutral-950'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-white flex items-center justify-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-[#2563EB]" />
                        <span>Click to Upload Thumbnail from Gallery</span>
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 font-sans">
                        Choose photo from your device gallery or drag & drop image here
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
                      Supports JPG, PNG, WEBP • Auto 16:9 Cinema Ready
                    </span>
                  </div>
                </div>
              )}

              {thumbUploadError && (
                <p className="text-xs text-red-400 font-mono flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{thumbUploadError}</span>
                </p>
              )}
            </div>

            {/* Caption / Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Caption / Narrative (Optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                placeholder="Brief narrative or technical notes about the visual production..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700/80 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs text-white placeholder-neutral-500 font-sans transition-all outline-none resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isValid && !isSubmitting
                    ? 'bg-[#2563EB] text-white hover:bg-blue-500 shadow-blue-600/30 hover:scale-105 active:scale-95'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Video...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Add Video to Gallery</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Interactive Vertical Scroll Slider Rail */}
          <div
            ref={sliderRailRef}
            onClick={handleRailClick}
            onWheel={handleWheel}
            data-lenis-prevent="true"
            className="absolute right-2 sm:right-2.5 top-3 bottom-3 w-3 sm:w-3.5 bg-neutral-950/80 hover:bg-neutral-900/90 rounded-full flex flex-col justify-start p-0.5 cursor-pointer border border-neutral-800/80 transition-colors z-20 group shadow-inner"
            title="Scroll Slider (Click, drag with mouse, or scroll with mouse wheel)"
          >
            <div
              onMouseDown={handleThumbMouseDown}
              style={{
                transform: `translateY(${thumbOffset}px)`,
                height: `${sliderThumbHeight}px`,
              }}
              className={`w-full rounded-full bg-gradient-to-b from-blue-400 via-[#2563EB] to-blue-600 shadow-md shadow-blue-500/40 cursor-grab active:cursor-grabbing transition-transform duration-75 flex flex-col items-center justify-center ${
                isDraggingSlider
                  ? 'ring-2 ring-blue-400 brightness-125 cursor-grabbing'
                  : 'hover:brightness-110'
              }`}
            >
              {/* Thumb Grip lines */}
              <div className="w-1.5 h-3 flex flex-col justify-between items-center opacity-85 pointer-events-none">
                <div className="w-1 h-0.5 bg-white rounded-full shadow-xs" />
                <div className="w-1 h-0.5 bg-white rounded-full shadow-xs" />
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
