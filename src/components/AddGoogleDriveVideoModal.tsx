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
  Film,
  ExternalLink,
  Clock,
  HardDrive,
  Camera,
  Crop,
  Sliders
} from 'lucide-react';
import { VideoGalleryItem } from './VideoGalleryPage';
import { extractGoogleDriveId } from '../utils/googleDrive';
import { saveVideoBlob, captureVideoFrame } from '../utils/videoStorage';
import { ThumbnailEditStudioModal } from './ThumbnailEditStudioModal';
import { VideoThumbnailEditor } from './VideoThumbnailEditor';

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
  const [galleryAspectRatio, setGalleryAspectRatio] = useState<string>('aspect-[16/9]');
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

  // Video Frame Scrubber & Thumbnail Edit Studio State
  const [videoScrubTime, setVideoScrubTime] = useState<number>(0);
  const [videoDurationSeconds, setVideoDurationSeconds] = useState<number>(0);
  const [showEditStudio, setShowEditStudio] = useState<boolean>(false);
  const [editStudioImageSrc, setEditStudioImageSrc] = useState<string>('');
  const [isEditingCover, setIsEditingCover] = useState<boolean>(false);

  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Video Scrubber & Frame Capture Handlers
  const extractFrameToThumbnail = useCallback((vid: HTMLVideoElement, targetTime?: number) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = vid.videoWidth || 1280;
      canvas.height = vid.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        const capturedUrl = canvas.toDataURL('image/jpeg', 0.90);
        setThumbnailDataUrl(capturedUrl);
        setAutoThumbnail(capturedUrl);
        const secLabel = (targetTime !== undefined ? targetTime : vid.currentTime).toFixed(1);
        setThumbnailFileName(`Extracted Frame at ${secLabel}s`);
      }
    } catch (e) {
      console.warn('Live frame extraction notice:', e);
    }
  }, []);

  const handleVideoLoadedMetadata = () => {
    if (previewVideoRef.current) {
      setVideoDurationSeconds(previewVideoRef.current.duration || 0);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (previewVideoRef.current) {
      setVideoScrubTime(previewVideoRef.current.currentTime);
    }
  };

  const handleSeekVideo = (seconds: number) => {
    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = seconds;
      setVideoScrubTime(seconds);
      if (previewVideoRef.current.readyState >= 2) {
        extractFrameToThumbnail(previewVideoRef.current, seconds);
      }
    }
  };

  const handleVideoSeeked = () => {
    if (previewVideoRef.current) {
      extractFrameToThumbnail(previewVideoRef.current, previewVideoRef.current.currentTime);
    }
  };

  const captureFrameFromVideo = () => {
    if (!previewVideoRef.current) return;
    const vid = previewVideoRef.current;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = vid.videoWidth || 1280;
      canvas.height = vid.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        const capturedUrl = canvas.toDataURL('image/jpeg', 0.92);
        setThumbnailDataUrl(capturedUrl);
        setAutoThumbnail(capturedUrl);
        setThumbnailFileName(`Captured Video Frame (${vid.currentTime.toFixed(1)}s)`);

        // Launch Edit & Crop Studio immediately with captured frame
        setEditStudioImageSrc(capturedUrl);
        setShowEditStudio(true);
      }
    } catch (e) {
      console.error('Error capturing video frame:', e);
    }
  };

  // Scroll Progress State
  const [scrollRatio, setScrollRatio] = useState(0); // 0 to 1

  // Update metrics for scrollbar
  const updateScrollMetrics = useCallback(() => {
    if (!formRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = formRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    setScrollRatio(ratio);
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
      // Automatically trigger Instagram Reels thumbnail editor once video is loaded
      setIsEditingCover(true);

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

      // Automatically capture first frame for poster thumbnail & detect duration and orientation
      const { dataUrl, duration, aspectRatioClass: detectedRatio } = await captureVideoFrame(file);
      if (detectedRatio) {
        setGalleryAspectRatio(detectedRatio);
      }
      if (duration > 0) {
        const mins = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        setGalleryVideoDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      } else {
        setGalleryVideoDuration('');
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
    setThumbnailDataUrl('');
    setIsEditingCover(false);
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
        aspectRatioClass: isGalleryMode ? (galleryAspectRatio || "aspect-[16/9]") : "aspect-[16/9]",
        duration: isGalleryMode && galleryVideoDuration ? galleryVideoDuration : "",
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
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative max-w-2xl w-full bg-[#090a0f]/98 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Subtle Top Ambient Aura Glow */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[480px] h-36 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-28 right-0 w-72 h-36 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

          {/* Header (CSS Selector 1) - Ultra-Premium Cinema Studio Look */}
          <div className="px-6 sm:px-8 py-5 border-b border-white/[0.08] flex items-center justify-between bg-black/70 backdrop-blur-2xl relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500/40 via-indigo-500/30 to-purple-500/40 blur-sm opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                <div className="relative w-12 h-12 rounded-2xl bg-[#090b12] border border-white/20 p-0.5 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/10 flex items-center justify-center text-blue-400">
                    <Video className="w-5 h-5 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-['Syne'] font-bold text-white tracking-wide">
                  VIDEO MASTER UPLOAD
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Direct reel upload with live timeline cover extraction & Drive preview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-neutral-400 hover:text-white transition-all flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scroll Progress Indicator */}
          <div className="h-[2px] bg-neutral-900/90 w-full overflow-hidden relative z-10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-75 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
              style={{ width: `${Math.round(scrollRatio * 100)}%` }}
            />
          </div>

          {/* Form Content (CSS Selector 2) - Premium Glassmorphic Studio Form */}
          <div className="relative font-sans bg-gradient-to-b from-white/[0.015] via-transparent to-black/40">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onScroll={handleFormScroll}
              onWheel={handleWheel}
              data-lenis-prevent="true"
              className="p-6 sm:p-8 space-y-7 max-h-[75vh] overflow-y-auto modal-scroll-slider overscroll-contain select-text"
            >

            {/* VIDEO SOURCE BLOCK */}
            <div className="space-y-4">
              {/* Top Row with Label & Mode Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-neutral-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <span>
                    {isGalleryMode ? 'Video Source File' : 'Google Drive Video Link'}
                  </span>
                  <span className="text-blue-400 font-normal">*</span>
                </label>

                {/* Source Mode Toggle Tabs */}
                <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/[0.12] text-xs font-sans self-start sm:self-auto shadow-2xl backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setSourceMode('gallery')}
                    className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer font-medium text-xs ${
                      isGalleryMode
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/40 font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>From Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode('url')}
                    className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer font-medium text-xs ${
                      !isGalleryMode
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/40 font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Drive URL</span>
                  </button>
                </div>
              </div>

              {/* Hidden Native Video File Picker */}
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/mkv,video/avi,video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                id="gallery-video-file-picker"
              />

              {/* GALLERY MODE INTERFACE (CSS Selector 3) - Cinema Grade Upload & Preview */}
              {isGalleryMode && (
                <div className="space-y-3">
                  {isEditingCover && galleryVideoUrl ? (
                    /* Instagram Reels-Style Video Thumbnail Editor */
                    <VideoThumbnailEditor
                      videoFile={galleryVideoFile}
                      videoSrc={galleryVideoUrl}
                      initialThumbnail={thumbnailDataUrl || autoThumbnail}
                      onDone={(newThumbnail) => {
                        setThumbnailDataUrl(newThumbnail);
                        setAutoThumbnail(newThumbnail);
                        setThumbnailFileName(`${galleryVideoFile?.name || 'Reel'} (Instagram Cover)`);
                        setIsEditingCover(false);
                      }}
                      onBack={() => setIsEditingCover(false)}
                      mode="inline"
                    />
                  ) : galleryVideoUrl ? (
                    /* Video Loaded - Cinema Monitor Preview Card with Selected Cover */
                    <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-[#07080d] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl group transition-all">
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group/cover">
                        {thumbnailDataUrl || autoThumbnail ? (
                          <img
                            src={thumbnailDataUrl || autoThumbnail}
                            alt="Selected video cover thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            ref={previewVideoRef}
                            src={galleryVideoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        )}

                        {/* Selected Cover Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] flex items-center gap-1.5 shadow-md z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#159BFF] animate-pulse" />
                          <span>SELECTED COVER THUMBNAIL</span>
                        </div>

                        {/* Edit cover button matching Instagram Reels */}
                        <button
                          type="button"
                          onClick={() => setIsEditingCover(true)}
                          className="absolute bottom-4 left-4 px-4 py-2.5 rounded-full bg-black/85 hover:bg-black text-white text-xs font-sans font-semibold tracking-wide border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl cursor-pointer transition-all hover:scale-105 hover:border-[#159BFF] hover:shadow-[0_0_25px_rgba(21,155,255,0.6)] active:scale-95 flex items-center gap-2 z-20 group/btn"
                        >
                          <Crop className="w-3.5 h-3.5 text-[#159BFF] group-hover/btn:rotate-45 transition-transform" />
                          <span>Edit cover</span>
                        </button>
                      </div>

                      {/* Video File Specs & Action Buttons */}
                      <div className="mt-3.5 px-1 flex flex-wrap items-center justify-between gap-2.5 text-xs font-sans">
                        <div className="flex items-center gap-2 text-neutral-300">
                          <span className="truncate max-w-[200px] sm:max-w-[280px] font-semibold text-white">
                            {galleryVideoFile?.name}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-mono text-neutral-300">
                            {galleryVideoFile ? `${(galleryVideoFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}
                          </span>
                          {galleryVideoDuration && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-blue-950/90 text-blue-300 border border-blue-500/40 text-[10px] font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{galleryVideoDuration}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Change Video</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveGalleryVideo}
                            className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900 border border-red-500/30 text-red-300 hover:text-white transition-colors cursor-pointer"
                            title="Remove Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Video Upload Drop Zone (CSS Selector 3) - Cinema Pro Glass Dropzone */
                    <div
                      onDragOver={handleVideoDragOver}
                      onDragLeave={handleVideoDragLeave}
                      onDrop={handleVideoDrop}
                      onClick={() => videoFileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-11 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
                        isVideoDragging
                          ? 'border-blue-500 bg-blue-500/15 scale-[1.01] shadow-[0_0_50px_rgba(59,130,246,0.35)]'
                          : 'border-white/15 hover:border-blue-400/60 bg-gradient-to-b from-[#11131c]/90 via-[#0a0b12]/95 to-[#06070a]/98 hover:shadow-[0_0_45px_rgba(59,130,246,0.2)] shadow-2xl backdrop-blur-2xl'
                      }`}
                    >
                      {/* Ambient Glow Aura */}
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-32 bg-blue-500/10 blur-3xl pointer-events-none rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />

                      <div className="relative flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative w-16 h-16 rounded-2xl bg-[#090b14] border border-white/20 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:text-blue-300 group-hover:border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all">
                            <Film className="w-7 h-7" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-base font-['Syne'] font-bold text-white tracking-wide flex items-center justify-center gap-2">
                            <span>SELECT OR DROP MASTER REEL</span>
                          </p>
                          <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto">
                            Upload 4K cinematic video from your device for instant frame extraction and smooth playback
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {videoError && (
                    <p className="text-xs text-red-400 font-sans flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{videoError}</span>
                    </p>
                  )}
                </div>
              )}

              {/* URL MODE INTERFACE */}
              {!isGalleryMode && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-white placeholder-neutral-500 font-sans transition-all outline-none shadow-inner"
                    required
                  />

                  {detectedDriveId ? (
                    <div className="space-y-2">
                      {isEditingCover ? (
                        <VideoThumbnailEditor
                          initialThumbnail={thumbnailDataUrl || DEFAULT_POSTERS[existingCount % DEFAULT_POSTERS.length]}
                          onDone={(newThumbnail) => {
                            setThumbnailDataUrl(newThumbnail);
                            setAutoThumbnail(newThumbnail);
                            setIsEditingCover(false);
                          }}
                          onBack={() => setIsEditingCover(false)}
                          mode="inline"
                        />
                      ) : (
                        <>
                          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-sans text-emerald-300">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span>Drive ID Connected: <strong className="text-white font-semibold">{detectedDriveId.slice(0, 14)}...</strong></span>
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setIsEditingCover(true)}
                                className="text-xs text-[#159BFF] hover:text-white underline cursor-pointer flex items-center gap-1 font-semibold"
                              >
                                <Crop className="w-3 h-3" />
                                <span>Edit cover</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setTestPreviewOpen(!testPreviewOpen)}
                                className="text-xs text-emerald-400 hover:text-white underline cursor-pointer flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{testPreviewOpen ? 'Hide Preview' : 'Show Preview'}</span>
                              </button>
                            </div>
                          </div>

                          {thumbnailDataUrl && !testPreviewOpen && (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                              <img
                                src={thumbnailDataUrl}
                                alt="Selected Drive thumbnail"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] flex items-center gap-1.5 shadow-md z-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#159BFF] animate-pulse" />
                                <span>SELECTED COVER THUMBNAIL</span>
                              </div>
                            </div>
                          )}

                          {testPreviewOpen && (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                              <iframe
                                src={`https://drive.google.com/file/d/${detectedDriveId}/preview`}
                                className="w-full h-full border-0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                title="Live Google Drive Preview"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : driveUrl.trim() ? (
                    <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-xs font-sans text-amber-300">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Please enter a valid Google Drive shareable link or file ID.</span>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 font-sans">
                      Supported formats: /file/d/ID/view, open?id=ID, uc?id=ID, or direct Drive ID
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Video Title */}
            <div className="space-y-2 font-sans">
              <label className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-neutral-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Video Title</span>
                <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cinematic Highlights & Aftermovie"
                className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-white placeholder-neutral-500 font-sans transition-all outline-none shadow-inner"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2 font-sans">
              <label className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-neutral-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#090a0f] border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs text-white font-sans transition-all outline-none cursor-pointer shadow-inner"
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

            {/* Description */}
            <div className="space-y-2 font-sans">
              <label className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-neutral-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                <span>Description (Optional)</span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                placeholder="Brief narrative or technical notes about the visual production..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/[0.12] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs text-white placeholder-neutral-500 font-sans transition-all outline-none resize-none shadow-inner"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-5 border-t border-white/[0.08] flex items-center justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`relative group overflow-hidden px-8 py-3.5 rounded-2xl text-xs font-sans font-bold tracking-wider uppercase flex items-center gap-2.5 transition-all cursor-pointer shadow-xl ${
                  isValid && !isSubmitting
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.45)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-neutral-800/80 text-neutral-500 cursor-not-allowed opacity-60 border border-white/5'
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
        </div>
        </motion.div>

        {/* Thumbnail Edit, Crop & Adjust Studio Modal */}
        <ThumbnailEditStudioModal
          isOpen={showEditStudio}
          imageSrc={editStudioImageSrc || thumbnailDataUrl || autoThumbnail}
          videoSrc={galleryVideoUrl}
          onClose={() => setShowEditStudio(false)}
          onSave={(editedDataUrl) => {
            setThumbnailDataUrl(editedDataUrl);
            setThumbnailFileName("Custom Cropped & Adjusted Thumbnail");
          }}
        />
      </div>
    </AnimatePresence>
  );
}
