import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Check,
  Film,
  Image as ImageIcon,
  Type,
  Crop,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Loader2,
  Trash2,
  Palette,
  MoveHorizontal,
  SlidersHorizontal
} from 'lucide-react';

export interface TextOverlayConfig {
  text: string;
  color: string;
  bgColor: 'pill-dark' | 'pill-translucent' | 'pill-neon' | 'none';
  positionY: number; // 0 to 100 percentage from top
  fontSize: number; // px at standard scale
  fontStyle: 'sans' | 'serif' | 'mono';
}

export interface VideoThumbnailEditorProps {
  videoFile?: File | null;
  videoSrc?: string;
  initialThumbnail?: string;
  onDone: (thumbnailDataUrl: string, metadata?: { selectedTime: number; textOverlay?: TextOverlayConfig }) => void;
  onBack?: () => void;
  mode?: 'inline' | 'modal';
  className?: string;
}

const TEXT_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Electric Blue', value: '#5265FF' },
  { name: 'Cyber Cyan', value: '#06B6D4' },
  { name: 'Yellow', value: '#FACC15' },
  { name: 'Hot Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Black', value: '#000000' }
];

export function VideoThumbnailEditor({
  videoFile,
  videoSrc,
  initialThumbnail,
  onDone,
  onBack,
  mode = 'inline',
  className = ''
}: VideoThumbnailEditorProps) {
  // Video element and canvas references
  const videoRef = useRef<HTMLVideoElement>(null);
  const filmstripTrackRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video metadata
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({ width: 1080, height: 1920 });
  const [videoOrientation, setVideoOrientation] = useState<'portrait' | 'landscape' | 'square'>('portrait');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Extracted filmstrip frames
  const [filmstripFrames, setFilmstripFrames] = useState<{ time: number; dataUrl: string }[]>([]);
  const [isExtractingFrames, setIsExtractingFrames] = useState<boolean>(false);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);

  // DRAG SCRUBBER STATE (Instagram Reels style interactive dragging)
  const [isDraggingTimeline, setIsDraggingTimeline] = useState<boolean>(false);
  const [dragProgress, setDragProgress] = useState<number>(0); // 0 to 1
  const isDraggingRef = useRef<boolean>(false);

  // Direct video preview dragging state
  const [isPreviewScrubbing, setIsPreviewScrubbing] = useState<boolean>(false);
  const previewDragStartXRef = useRef<number>(0);
  const previewDragStartTimeRef = useRef<number>(0);

  // Custom uploaded cover image (from camera roll)
  const [customImageSrc, setCustomImageSrc] = useState<string>('');
  const [activeCoverSource, setActiveCoverSource] = useState<'video' | 'custom'>('video');

  // Crop mode state: 'original' | '9/16' | '1/1' | '16/9'
  const [cropMode, setCropMode] = useState<'original' | '9/16' | '1/1' | '16/9'>('original');

  // Text overlay editor state
  const [showTextEditor, setShowTextEditor] = useState<boolean>(false);
  const [textOverlay, setTextOverlay] = useState<TextOverlayConfig>({
    text: '',
    color: '#FFFFFF',
    bgColor: 'pill-dark',
    positionY: 75,
    fontSize: 22,
    fontStyle: 'sans'
  });

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [internalVideoUrl, setInternalVideoUrl] = useState<string>('');

  // Handle video source resolution (file vs url)
  useEffect(() => {
    let objectUrl = '';
    if (videoFile) {
      objectUrl = URL.createObjectURL(videoFile);
      setInternalVideoUrl(objectUrl);
    } else if (videoSrc) {
      setInternalVideoUrl(videoSrc);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videoFile, videoSrc]);

  // Set initial thumbnail as custom cover if provided and no video yet
  useEffect(() => {
    if (initialThumbnail && !customImageSrc) {
      setCustomImageSrc(initialThumbnail);
    }
  }, [initialThumbnail, customImageSrc]);

  // Sync drag progress with current time when not actively dragging
  useEffect(() => {
    if (!isDraggingRef.current && videoDuration > 0) {
      const p = Math.max(0, Math.min(1, currentTime / videoDuration));
      setDragProgress(p);
    }
  }, [currentTime, videoDuration]);

  // High-performance seeking locks for real-time butter-smooth preview without video stall
  const isSeekingLockRef = useRef<boolean>(false);
  const pendingSeekTimeRef = useRef<number | null>(null);

  // Seek video safely and update active frame with fastSeek hardware acceleration
  const seekVideoToTime = useCallback((time: number, isFinal: boolean = false) => {
    if (!videoRef.current || isNaN(time)) return;
    const boundedTime = Math.max(0, Math.min(videoDuration || 1000, time));
    
    // Immediately reflect currentTime for zero-lag UI feedback
    setCurrentTime(boundedTime);
    setActiveCoverSource('video');

    // Also sync nearest frame in filmstrip
    if (filmstripFrames.length > 0 && videoDuration > 0) {
      const idx = Math.min(
        filmstripFrames.length - 1,
        Math.max(0, Math.round((boundedTime / videoDuration) * (filmstripFrames.length - 1)))
      );
      setSelectedFrameIndex(idx);
    }

    const vid = videoRef.current;

    // Final release: lock exact frame precisely
    if (isFinal) {
      pendingSeekTimeRef.current = null;
      isSeekingLockRef.current = false;
      try {
        vid.currentTime = boundedTime;
      } catch {}
      return;
    }

    // Live Scrubbing: If the browser is currently decoding, hold newest time in pending buffer
    if (isSeekingLockRef.current || vid.seeking) {
      pendingSeekTimeRef.current = boundedTime;
      return;
    }

    isSeekingLockRef.current = true;

    // Use fastSeek if supported by browser for instantaneous scrubbing
    if ('fastSeek' in vid && typeof (vid as any).fastSeek === 'function') {
      try {
        (vid as any).fastSeek(boundedTime);
      } catch {
        vid.currentTime = boundedTime;
      }
    } else {
      vid.currentTime = boundedTime;
    }
  }, [videoDuration, filmstripFrames]);

  // Handle onSeeked on the video element to flush pending frames immediately
  const handleVideoSeeked = useCallback(() => {
    isSeekingLockRef.current = false;
    if (pendingSeekTimeRef.current !== null && videoRef.current) {
      const nextTime = pendingSeekTimeRef.current;
      pendingSeekTimeRef.current = null;
      isSeekingLockRef.current = true;
      const vid = videoRef.current;
      if ('fastSeek' in vid && typeof (vid as any).fastSeek === 'function') {
        try {
          (vid as any).fastSeek(nextTime);
        } catch {
          vid.currentTime = nextTime;
        }
      } else {
        vid.currentTime = nextTime;
      }
    }
  }, []);

  // Extract frames rapidly across duration for instant preview ready state
  const extractFrames = useCallback(async (vidUrl: string) => {
    if (!vidUrl) return;
    setIsExtractingFrames(true);
    setFilmstripFrames([]);

    const tempVideo = document.createElement('video');
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.preload = 'auto';
    tempVideo.muted = true;
    tempVideo.playsInline = true;
    tempVideo.src = vidUrl;

    const cleanup = () => {
      tempVideo.pause();
      tempVideo.removeAttribute('src');
      tempVideo.load();
    };

    try {
      await new Promise<void>((resolve, reject) => {
        tempVideo.onloadedmetadata = () => resolve();
        tempVideo.onerror = () => reject(new Error('Video metadata loading failed'));
        setTimeout(() => reject(new Error('Video metadata timeout')), 4000);
      });

      const duration = tempVideo.duration || 5;
      const vw = tempVideo.videoWidth || 1080;
      const vh = tempVideo.videoHeight || 1920;
      setVideoDuration(duration);
      setVideoDimensions({ width: vw, height: vh });

      if (vh > vw * 1.1) {
        setVideoOrientation('portrait');
      } else if (vw > vh * 1.1) {
        setVideoOrientation('landscape');
      } else {
        setVideoOrientation('square');
      }

      // Generate 12 optimized frames rapidly for fast filmstrip preview
      const frameCount = 12;
      const step = duration / frameCount;
      const extracted: { time: number; dataUrl: string }[] = [];

      const thumbCanvas = document.createElement('canvas');
      const thumbW = vw >= vh ? 90 : 54;
      const thumbH = vw >= vh ? 54 : 90;
      thumbCanvas.width = thumbW;
      thumbCanvas.height = thumbH;
      const ctx = thumbCanvas.getContext('2d');

      for (let i = 0; i < frameCount; i++) {
        const targetTime = Math.min(duration - 0.05, Math.max(0.05, (i + 0.5) * step));
        tempVideo.currentTime = targetTime;

        await new Promise<void>((res) => {
          tempVideo.onseeked = () => res();
          setTimeout(() => res(), 100);
        });

        if (ctx) {
          ctx.drawImage(tempVideo, 0, 0, thumbW, thumbH);
          const frameUrl = thumbCanvas.toDataURL('image/jpeg', 0.65);
          extracted.push({ time: targetTime, dataUrl: frameUrl });
        }
      }

      setFilmstripFrames(extracted);
      if (extracted.length > 0) {
        setSelectedFrameIndex(0);
        setCurrentTime(extracted[0].time);
        setDragProgress(0);
        if (videoRef.current) {
          videoRef.current.currentTime = extracted[0].time;
        }
      }
    } catch (err) {
      console.warn('Local frame extraction notice:', err);
    } finally {
      setIsExtractingFrames(false);
      cleanup();
    }
  }, []);

  // Trigger frame extraction when internal video URL changes
  useEffect(() => {
    if (internalVideoUrl) {
      extractFrames(internalVideoUrl);
    }
  }, [internalVideoUrl, extractFrames]);

  // Frame selection handler when clicking a specific frame
  const handleSelectFrame = (index: number) => {
    setSelectedFrameIndex(index);
    setActiveCoverSource('video');
    const frame = filmstripFrames[index];
    if (frame) {
      setCurrentTime(frame.time);
      if (videoDuration > 0) {
        setDragProgress(Math.max(0, Math.min(1, frame.time / videoDuration)));
      }
      if (videoRef.current) {
        videoRef.current.currentTime = frame.time;
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Step backward / forward by 0.1s for precision frame picking
  const handleStepTime = (delta: number) => {
    if (!videoRef.current || videoDuration <= 0) return;
    const newTime = Math.max(0, Math.min(videoDuration, currentTime + delta));
    seekVideoToTime(newTime);
    videoRef.current.pause();
    setIsPlaying(false);
  };

  // Play / Pause preview toggle
  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle custom image upload from device ("Add from camera roll")
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setCustomImageSrc(evt.target.result as string);
          setActiveCoverSource('custom');
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Crop mode cycler
  const handleCycleCrop = () => {
    const modes: ('original' | '9/16' | '1/1' | '16/9')[] = ['original', '9/16', '1/1', '16/9'];
    const nextIndex = (modes.indexOf(cropMode) + 1) % modes.length;
    setCropMode(modes[nextIndex]);
  };

  // =========================================================================
  // INTERACTIVE TIMELINE DRAGGING LOGIC (Instagram Reels Scrubber)
  // =========================================================================
  const updateScrubFromPointer = useCallback((clientX: number) => {
    if (!filmstripTrackRef.current || videoDuration <= 0) return;
    const rect = filmstripTrackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const progress = Math.max(0, Math.min(1, relativeX / rect.width));

    setDragProgress(progress);
    const targetTime = progress * videoDuration;
    seekVideoToTime(targetTime);
  }, [videoDuration, seekVideoToTime]);

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    setIsDraggingTimeline(true);

    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    // Capture pointer to track smoothly outside filmstrip bounding box
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    updateScrubFromPointer(e.clientX);
  };

  const handleTimelinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateScrubFromPointer(e.clientX);
  };

  const handleTimelinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingTimeline(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    seekVideoToTime(currentTime, true);
  };

  // =========================================================================
  // DIRECT VIDEO PREVIEW DRAGGING LOGIC (Scrub by dragging on video player)
  // =========================================================================
  const handlePreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeCoverSource !== 'video' || videoDuration <= 0) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    setIsPreviewScrubbing(true);

    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    // Instant direct scrub to tapped or touched horizontal position
    if (previewContainerRef.current) {
      const rect = previewContainerRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetTime = ratio * videoDuration;
      seekVideoToTime(targetTime, false);
    }
  };

  const handlePreviewPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPreviewScrubbing || videoDuration <= 0 || !previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * videoDuration;
    seekVideoToTime(targetTime, false);
  };

  const handlePreviewPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPreviewScrubbing) return;
    setIsPreviewScrubbing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    // Lock in high-definition frame immediately upon release
    seekVideoToTime(currentTime, true);
  };

  // Export finalized cover image with crop & text overlay onto high-res Canvas
  const handleDone = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      let sourceWidth = 1080;
      let sourceHeight = 1920;

      // Determine export dimensions and draw source image
      if (activeCoverSource === 'custom' && customImageSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load'));
          img.src = customImageSrc;
        });

        sourceWidth = img.naturalWidth || 1080;
        sourceHeight = img.naturalHeight || 1920;

        let targetW = sourceWidth;
        let targetH = sourceHeight;

        if (cropMode === '9/16') {
          targetW = 1080;
          targetH = 1920;
        } else if (cropMode === '1/1') {
          targetW = 1080;
          targetH = 1080;
        } else if (cropMode === '16/9') {
          targetW = 1920;
          targetH = 1080;
        }

        canvas.width = targetW;
        canvas.height = targetH;

        const scale = Math.max(targetW / sourceWidth, targetH / sourceHeight);
        const drawW = sourceWidth * scale;
        const drawH = sourceHeight * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      } else if (videoRef.current && videoRef.current.readyState >= 2) {
        const vid = videoRef.current;
        sourceWidth = vid.videoWidth || 1080;
        sourceHeight = vid.videoHeight || 1920;

        let targetW = sourceWidth;
        let targetH = sourceHeight;

        if (cropMode === '9/16') {
          targetW = 1080;
          targetH = 1920;
        } else if (cropMode === '1/1') {
          targetW = 1080;
          targetH = 1080;
        } else if (cropMode === '16/9') {
          targetW = 1920;
          targetH = 1080;
        }

        canvas.width = targetW;
        canvas.height = targetH;

        const scale = Math.max(targetW / sourceWidth, targetH / sourceHeight);
        const drawW = sourceWidth * scale;
        const drawH = sourceHeight * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;

        ctx.drawImage(vid, offsetX, offsetY, drawW, drawH);
      } else if (filmstripFrames[selectedFrameIndex]) {
        const img = new Image();
        await new Promise<void>((res) => {
          img.onload = () => res();
          img.src = filmstripFrames[selectedFrameIndex].dataUrl;
        });
        canvas.width = 1080;
        canvas.height = 1920;
        ctx.drawImage(img, 0, 0, 1080, 1920);
      } else if (initialThumbnail) {
        const img = new Image();
        await new Promise<void>((res) => {
          img.onload = () => res();
          img.src = initialThumbnail;
        });
        canvas.width = 1080;
        canvas.height = 1920;
        ctx.drawImage(img, 0, 0, 1080, 1920);
      }

      // Render Text Overlay onto Canvas if text is present
      if (textOverlay.text.trim()) {
        const textY = (canvas.height * textOverlay.positionY) / 100;
        const fontSize = Math.round(canvas.height * (textOverlay.fontSize / 700));

        const fontMap = {
          sans: 'Inter, system-ui, -apple-system, sans-serif',
          serif: 'Georgia, serif',
          mono: 'monospace'
        };

        ctx.font = `bold ${fontSize}px ${fontMap[textOverlay.fontStyle]}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const metrics = ctx.measureText(textOverlay.text);
        const textW = metrics.width;
        const paddingX = fontSize * 0.7;
        const paddingY = fontSize * 0.45;
        const pillW = textW + paddingX * 2;
        const pillH = fontSize + paddingY * 2;
        const pillX = canvas.width / 2 - pillW / 2;
        const pillY = textY - pillH / 2;

        if (textOverlay.bgColor === 'pill-dark') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
          ctx.fill();
        } else if (textOverlay.bgColor === 'pill-translucent') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
          ctx.fill();
        } else if (textOverlay.bgColor === 'pill-neon') {
          ctx.fillStyle = textOverlay.color;
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.strokeStyle = textOverlay.color;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;

        ctx.fillStyle = textOverlay.color;
        ctx.fillText(textOverlay.text, canvas.width / 2, textY);
        ctx.shadowColor = 'transparent';
      }

      const finalizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onDone(finalizedDataUrl, {
        selectedTime: currentTime,
        textOverlay: textOverlay.text.trim() ? textOverlay : undefined
      });
    } catch (err) {
      console.error('Failed to export cover thumbnail:', err);
      if (filmstripFrames[selectedFrameIndex]?.dataUrl) {
        onDone(filmstripFrames[selectedFrameIndex].dataUrl);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const getPreviewAspectClass = () => {
    if (cropMode === '9/16') return 'aspect-[9/16] max-w-[270px] sm:max-w-[310px]';
    if (cropMode === '1/1') return 'aspect-square max-w-[320px] sm:max-w-[360px]';
    if (cropMode === '16/9') return 'aspect-video max-w-lg';

    if (videoOrientation === 'landscape') return 'aspect-video max-w-lg';
    if (videoOrientation === 'square') return 'aspect-square max-w-[320px] sm:max-w-[360px]';
    return 'aspect-[9/16] max-w-[270px] sm:max-w-[310px]';
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  return (
    <div
      className={`relative w-full rounded-3xl bg-[#0B0D12] border border-white/15 text-white font-sans overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)] select-none ${className}`}
    >
      {/* Top Navigation Bar: Back Arrow | "Edit cover" | "Done" */}
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/[0.08] bg-black/60 backdrop-blur-xl relative z-20">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#F5F5F7]">
            Edit cover
          </h2>
        </div>

        <button
          type="button"
          onClick={handleDone}
          disabled={isExporting}
          className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#5265FF] to-blue-600 hover:from-blue-600 hover:to-indigo-600 shadow-[0_0_20px_rgba(82,101,255,0.4)] hover:shadow-[0_0_25px_rgba(82,101,255,0.6)] active:scale-95 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Done</span>
            </>
          )}
        </button>
      </div>

      {/* Instructional Banner & Crop Profile Link */}
      <div className="px-4 py-2.5 text-center bg-black/40 border-b border-white/[0.04]">
        <p className="text-xs text-[#A3A7B2]">
          Drag horizontally across the video to scrub and choose your thumbnail frame.
        </p>
        <button
          type="button"
          onClick={handleCycleCrop}
          className="mt-1 text-xs text-[#5265FF] hover:text-blue-400 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Crop className="w-3 h-3" />
          <span>
            {cropMode === 'original' && 'Crop cover (Fit Original)'}
            {cropMode === '9/16' && 'Crop cover (9:16 Portrait)'}
            {cropMode === '1/1' && 'Crop cover (1:1 Profile Square)'}
            {cropMode === '16/9' && 'Crop cover (16:9 Cinema)'}
          </span>
        </button>
      </div>

      {/* Main Cover Preview Area (With Direct Horizontal Drag-to-Scrub Support) */}
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#0B0D12] to-black min-h-[320px]">
        <div
          ref={previewContainerRef}
          onPointerDown={handlePreviewPointerDown}
          onPointerMove={handlePreviewPointerMove}
          onPointerUp={handlePreviewPointerUp}
          onPointerCancel={handlePreviewPointerUp}
          className={`relative w-full rounded-[28px] overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(82,101,255,0.2)] bg-neutral-950 flex items-center justify-center transition-all duration-300 touch-none cursor-ew-resize group ${getPreviewAspectClass()}`}
          title="Drag horizontally to scrub video frame"
        >
          {activeCoverSource === 'custom' && customImageSrc ? (
            <img
              src={customImageSrc}
              alt="Custom Cover"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          ) : (
            <video
              ref={videoRef}
              src={internalVideoUrl}
              preload="auto"
              autoPlay={false}
              playsInline
              muted
              disableRemotePlayback
              onSeeked={handleVideoSeeked}
              onTimeUpdate={() => {
                if (videoRef.current && !isDraggingRef.current && !isPreviewScrubbing) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setVideoDuration(videoRef.current.duration || 0);
                }
              }}
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{ willChange: 'contents, transform' }}
            />
          )}

          {/* Timecode badge */}
          {activeCoverSource === 'video' && videoDuration > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/15 z-10 flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#159BFF] animate-pulse" />
              <span>{formatSec(currentTime)}</span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-400">{formatSec(videoDuration)}</span>
            </div>
          )}

          {/* Text Overlay Render in Preview */}
          {textOverlay.text.trim() && (
            <div
              style={{ top: `${textOverlay.positionY}%` }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 max-w-[90%] text-center"
            >
              <div
                style={{
                  color: textOverlay.color,
                  fontSize: `${textOverlay.fontSize}px`,
                  fontFamily:
                    textOverlay.fontStyle === 'serif'
                      ? 'Georgia, serif'
                      : textOverlay.fontStyle === 'mono'
                      ? 'monospace'
                      : 'sans-serif'
                }}
                className={`font-bold px-4 py-1.5 rounded-full transition-all tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${
                  textOverlay.bgColor === 'pill-dark'
                    ? 'bg-black/80 backdrop-blur-md border border-white/10'
                    : textOverlay.bgColor === 'pill-translucent'
                    ? 'bg-white/20 backdrop-blur-md border border-white/20'
                    : textOverlay.bgColor === 'pill-neon'
                    ? 'bg-blue-600/30 border border-blue-400 backdrop-blur-md'
                    : ''
                }`}
              >
                {textOverlay.text}
              </div>
            </div>
          )}

          {/* Micro Play / Scrub Navigation Controls removed per user request */}
        </div>
      </div>

      {/* Video Scrubber Slider */}
      <div className="px-5 py-3.5 bg-[#090b10] border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-400">0:00.0</span>
          <input
            type="range"
            min="0"
            max={videoDuration || 1}
            step="0.01"
            value={currentTime}
            onInput={(e) => {
              const val = parseFloat((e.target as HTMLInputElement).value);
              seekVideoToTime(val, false);
            }}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              seekVideoToTime(val, true);
            }}
            className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#159BFF] hover:accent-blue-400 transition-all"
            aria-label="Seek video frame rapidly"
          />
          <span className="text-[11px] font-mono text-[#159BFF] font-semibold">{formatSec(currentTime)}</span>
        </div>
      </div>

      {/* Bottom Action: "Add from camera roll" matching reference design */}
      <div className="p-4 sm:p-5 bg-[#08090E] border-t border-white/[0.08] flex flex-col items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          onChange={handleCustomImageUpload}
          className="hidden"
          id="custom-cover-camera-roll"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm py-3 px-6 rounded-2xl bg-[#5265FF] hover:bg-[#4353e6] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-[0_4px_25px_rgba(82,101,255,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Add from camera roll</span>
        </button>

        {activeCoverSource === 'custom' && (
          <button
            type="button"
            onClick={() => {
              setActiveCoverSource('video');
              if (filmstripFrames[selectedFrameIndex]) {
                handleSelectFrame(selectedFrameIndex);
              }
            }}
            className="mt-2 text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Revert to extracted video frame
          </button>
        )}
      </div>
    </div>
  );
}
