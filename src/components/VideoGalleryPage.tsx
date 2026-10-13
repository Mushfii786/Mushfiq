import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, X, Maximize2, Heart, Share2, Camera, MapPin, Sparkles, Video, Play, Eye, Film, Plus, ExternalLink, Trash2, Lock, Unlock, Shield, Search, ChevronLeft, ChevronRight, Download, Check, CheckCircle2, Save, Edit3, Tag, RotateCcw, ArrowUp, ArrowDown, AlertTriangle, GripVertical, Upload, Move, MoreVertical } from 'lucide-react';
import { GradientWaves } from './GradientWaves';
import { extractGoogleDriveId, isGoogleDriveUrl } from '../utils/googleDrive';
import { getVideoBlob, deleteVideoBlob, clearAllVideoBlobs } from '../utils/videoStorage';
import { AddGoogleDriveVideoModal } from './AddGoogleDriveVideoModal';
import { AdminAuthModal } from './AdminAuthModal';
import { ThumbnailEditStudioModal } from './ThumbnailEditStudioModal';

interface VideoGalleryPageProps {
  onClose: () => void;
}

export interface VideoGalleryItem {
  id: string;
  title: string;
  category: string;
  url: string; // Poster image
  videoUrl: string; // MP4 stream, object URL, or Google Drive URL
  caption: string;
  location: string;
  camera: string;
  lens: string;
  settings: string;
  year: string;
  column: 1 | 2 | 3 | 4;
  aspectRatioClass: string;
  duration: string;
  views: number;
  likes: number;
  isCustom?: boolean;
  isGalleryUpload?: boolean;
  videoFileName?: string;
  videoFileSize?: string;
}

// 16 Curated Videography Works structured into 4 columns matching the reference image layout
export const videoGalleryItems: VideoGalleryItem[] = [
  // COLUMN 1
  {
    id: "vgal-drive-featured",
    title: "Cinematic Horizons Reel (Google Drive)",
    category: "Cinematic Reels",
    url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://drive.google.com/file/d/1wN-76uOqA9mB5YxX3_7C3U2cZ4j9L1vP/preview",
    caption: "Cinematic drone sweep and horizon perspective streamed live via Google Drive preview integration.",
    location: "Kerala Coastline",
    camera: "Sony FX3",
    lens: "35mm T1.5 Anamorphic",
    settings: "4K 60fps • S-Log3",
    year: "2026 Film",
    column: 1,
    aspectRatioClass: "aspect-[16/9]",
    duration: "0:45",
    views: 18400,
    likes: 2150
  },
  {
    id: "vgal-1-2",
    title: "Subterranean Transit Motion",
    category: "Motion & VFX",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-subway-train-passing-by-at-night-41551-large.mp4",
    caption: "High-speed shutter motion blur capturing subterranean subway train entering Shibuya platform.",
    location: "Shibuya Terminal",
    camera: "RED Komodo 6K",
    lens: "24mm f/1.4 Cine",
    settings: "6K 120fps • RAW",
    year: "2026 Film",
    column: 1,
    aspectRatioClass: "aspect-[9/16]",
    duration: "0:32",
    views: 9800,
    likes: 1240
  },
  {
    id: "vgal-1-3",
    title: "Architectural Brick & Shadow",
    category: "Commercial",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunlight-filtering-through-the-trees-41552-large.mp4",
    caption: "Slow-motion shadows sweeping across vintage brick facades during golden hour.",
    location: "SoHo, New York",
    camera: "Canon C300 Mark III",
    lens: "50mm Cinema Prime",
    settings: "4K 60fps • C-Log2",
    year: "2025 Film",
    column: 1,
    aspectRatioClass: "aspect-[3/4]",
    duration: "0:58",
    views: 16500,
    likes: 1940
  },
  {
    id: "vgal-1-4",
    title: "Urban Facade Night Tones",
    category: "Documentary",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    caption: "Cinematic atmospheric night walk through industrial East London warehouse districts.",
    location: "London East End",
    camera: "Sony FX6",
    lens: "35mm f/1.4 GM",
    settings: "4K 120fps • S-Cinetone",
    year: "2025 Film",
    column: 1,
    aspectRatioClass: "aspect-[4/3]",
    duration: "1:05",
    views: 11300,
    likes: 1420
  },

  // COLUMN 2
  {
    id: "vgal-2-1",
    title: "Aerial Coastal Horizons & Wave Rhythms",
    category: "Drone & FPV",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-and-the-ocean-41550-large.mp4",
    caption: "Cinematic FPV drone sweeping over ocean cliffs and crashing turquoise waves at golden hour.",
    location: "Varkala & Wayanad",
    camera: "DJI Mavic 3 Pro",
    lens: "24mm Hasselblad Prime",
    settings: "5.1K 50fps • D-Log",
    year: "2025 Film",
    column: 2,
    aspectRatioClass: "aspect-[16/9]",
    duration: "1:12",
    views: 22800,
    likes: 2410
  },
  {
    id: "vgal-2-2",
    title: "Studio Chiaroscuro & Silhouette",
    category: "Commercial",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    caption: "Minimalist studio lighting performance examining form, shadow, and controlled highlight roll-off.",
    location: "Creative Space Studio",
    camera: "ARRI Alexa Mini LF",
    lens: "85mm ARRI Signature Prime",
    settings: "4.5K 24fps • ARRIRAW",
    year: "2026 Film",
    column: 2,
    aspectRatioClass: "aspect-[3/4]",
    duration: "0:40",
    views: 18900,
    likes: 2150
  },
  {
    id: "vgal-2-3",
    title: "Ballet Movement & Light Sequence",
    category: "Cinematic Reels",
    url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-camera-taking-a-photo-41549-large.mp4",
    caption: "Slow motion 120fps choreography tracking graceful stage movement in dramatic spotlight.",
    location: "Ballet Academy",
    camera: "Canon EOS R3",
    lens: "50mm f/1.2 L USM",
    settings: "4K 120fps • C-Log3",
    year: "2025 Film",
    column: 2,
    aspectRatioClass: "aspect-square",
    duration: "0:52",
    views: 13400,
    likes: 1560
  },
  {
    id: "vgal-2-4",
    title: "Volcanic Ridge Drone Pass",
    category: "Drone & FPV",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-with-waves-41548-large.mp4",
    caption: "High-speed FPV dive down volcanic sea cliffs with mist hovering over mountain valleys.",
    location: "Big Sur Coast",
    camera: "Custom FPV Cinema Drone",
    lens: "GoPro Hero 12 Black",
    settings: "5.3K 60fps • Reelsteady",
    year: "2026 Film",
    column: 2,
    aspectRatioClass: "aspect-[4/3]",
    duration: "1:18",
    views: 24100,
    likes: 2950
  },

  // COLUMN 3
  {
    id: "vgal-3-1",
    title: "Futuristic Urban Light Trails",
    category: "Motion & VFX",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    caption: "Long-exposure time-lapse and speed ramping of city traffic light trails.",
    location: "Metropolis Hub",
    camera: "RED Komodo 6K",
    lens: "50mm Cine Lens",
    settings: "6K 120fps • REDCODE RAW",
    year: "2026 Film",
    column: 3,
    aspectRatioClass: "aspect-[16/9]",
    duration: "0:38",
    views: 18900,
    likes: 1980
  },
  {
    id: "vgal-3-2",
    title: "Kyoto Bamboo Forest Mist Walk",
    category: "Documentary",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunlight-filtering-through-the-trees-41552-large.mp4",
    caption: "Serene morning stroll under towering bamboo stalks with soft sunlight rays piercing morning fog.",
    location: "Arashiyama, Kyoto",
    camera: "Sony A7S III",
    lens: "24-70mm f/2.8 GM II",
    settings: "4K 60fps • S-Log3",
    year: "2026 Film",
    column: 3,
    aspectRatioClass: "aspect-[3/4]",
    duration: "1:25",
    views: 27400,
    likes: 3120
  },
  {
    id: "vgal-3-3",
    title: "Macro Liquid Refraction & Caustics",
    category: "Commercial",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    caption: "Macro liquid optics exploring light refraction, caustics, and organic wave physics.",
    location: "Studio Lab",
    camera: "Phantom Flex 4K",
    lens: "100mm Macro Lens",
    settings: "4K 1000fps • RAW",
    year: "2026 Film",
    column: 3,
    aspectRatioClass: "aspect-square",
    duration: "0:50",
    views: 31200,
    likes: 3400
  },
  {
    id: "vgal-3-4",
    title: "Fashion Week Backstage Story",
    category: "Cinematic Reels",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-with-neon-lights-at-night-41541-large.mp4",
    caption: "High energy candid backstage documentary following models and runway preparation.",
    location: "Paris Fashion Week",
    camera: "Leica SL2-S",
    lens: "35mm Summilux-SL",
    settings: "4K 60fps • L-Log",
    year: "2025 Film",
    column: 3,
    aspectRatioClass: "aspect-[21/9]",
    duration: "1:40",
    views: 20500,
    likes: 2280
  },

  // COLUMN 4
  {
    id: "vgal-4-1",
    title: "Golden Hour Ocean Sunset & Reflection",
    category: "Commercial",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-with-waves-41548-large.mp4",
    caption: "Atmospheric brand promo highlighting natural sunlight, gentle ocean swells, and peaceful mood.",
    location: "Kozhikode Beach",
    camera: "Sony FX6",
    lens: "85mm F1.4 GM",
    settings: "4K 120fps • S-Cinetone",
    year: "2026 Film",
    column: 4,
    aspectRatioClass: "aspect-[3/4]",
    duration: "1:05",
    views: 28500,
    likes: 3100
  },
  {
    id: "vgal-4-2",
    title: "Nordic Winter Solitude & Snow",
    category: "Documentary",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunlight-filtering-through-the-trees-41552-large.mp4",
    caption: "Poetic documentary short exploring silence, snowbound pine forests, and minimalist wooden architecture.",
    location: "Lofoten Islands, Norway",
    camera: "Hasselblad H6D-100c",
    lens: "35-90mm Zoom",
    settings: "4K 24fps • Hasselblad RAW",
    year: "2026 Film",
    column: 4,
    aspectRatioClass: "aspect-square",
    duration: "1:55",
    views: 17200,
    likes: 1950
  },
  {
    id: "vgal-4-3",
    title: "Desert Dunes Sunset FPV Flight",
    category: "Drone & FPV",
    url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-and-the-ocean-41550-large.mp4",
    caption: "Proximity FPV flight skimming over golden sand ripples at dusk.",
    location: "Dubai Desert Reserve",
    camera: "RED Komodo 6K",
    lens: "18mm Cine Lens",
    settings: "6K 60fps • REDCODE RAW",
    year: "2025 Film",
    column: 4,
    aspectRatioClass: "aspect-[3/4]",
    duration: "0:48",
    views: 25600,
    likes: 2890
  },
  {
    id: "vgal-4-4",
    title: "Foggy Mountain Shoreline Reel",
    category: "Cinematic Reels",
    url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-with-waves-41548-large.mp4",
    caption: "Solitary figure overlooking mist-shrouded mountain lake with low ambient sound design.",
    location: "Lake Braies, Italy",
    camera: "Leica SL2",
    lens: "50mm Summilux-SL",
    settings: "4K 60fps • L-Log",
    year: "2025 Film",
    column: 4,
    aspectRatioClass: "aspect-[16/9]",
    duration: "1:15",
    views: 19400,
    likes: 2180
  }
];

const DEFAULT_CATEGORIES = ['ALL', 'GALLERY UPLOADS', 'GOOGLE DRIVE', 'CINEMATIC REELS', 'DRONE & FPV', 'COMMERCIAL', 'MOTION & VFX', 'DOCUMENTARY'];
const CATEGORIES_STORAGE_KEY = 'mushfiq_custom_categories_v2';
const VIDEOS_CATALOG_STORAGE_KEY = 'mushfiq_custom_videos_catalog_v2';
const LEGACY_STORAGE_KEY = 'mushfiq_custom_drive_videos';

interface GalleryVideoCardProps {
  item: VideoGalleryItem;
  isAdminAuthenticated: boolean;
  openMenuVideoId: string | null;
  setOpenMenuVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingVideo: (item: VideoGalleryItem) => void;
  setThumbnailStudioVideo: (item: VideoGalleryItem) => void;
  setVideoToDelete: (item: VideoGalleryItem) => void;
  setActiveVideo: (item: VideoGalleryItem) => void;
  draggedVideoId: string | null;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDragOver: (e: React.DragEvent, id: string) => void;
  handleDragLeave: (e: React.DragEvent, id: string) => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent, id: string) => void;
  isDragTarget: boolean;
  isBeingDragged: boolean;
}

function GalleryVideoCard({
  item,
  isAdminAuthenticated,
  openMenuVideoId,
  setOpenMenuVideoId,
  setEditingVideo,
  setThumbnailStudioVideo,
  setVideoToDelete,
  setActiveVideo,
  draggedVideoId,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDragEnd,
  handleDrop,
  isDragTarget,
  isBeingDragged,
}: GalleryVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine video orientation (landscape vs portrait) and box aspect ratio
  const [detectedAspect, setDetectedAspect] = useState<'landscape' | 'portrait' | null>(() => {
    const ratio = item.aspectRatioClass?.toLowerCase() || '';
    if (
      ratio.includes('16/9') ||
      ratio.includes('4/3') ||
      ratio.includes('21/9') ||
      ratio.includes('16/10') ||
      ratio.includes('video')
    ) {
      return 'landscape';
    }
    if (
      ratio.includes('9/16') ||
      ratio.includes('3/4') ||
      ratio.includes('4/5')
    ) {
      return 'portrait';
    }
    return null;
  });

  const isLandscape = Boolean(
    detectedAspect === 'landscape' ||
    (detectedAspect === null && (
      item.aspectRatioClass?.includes('16/9') ||
      item.aspectRatioClass?.includes('4/3') ||
      item.aspectRatioClass?.includes('21/9') ||
      item.aspectRatioClass?.includes('16/10') ||
      item.aspectRatioClass?.includes('video')
    ))
  );

  const isPortrait = Boolean(
    detectedAspect === 'portrait' ||
    (detectedAspect === null && !isLandscape && (
      item.aspectRatioClass?.includes('9/16') ||
      item.aspectRatioClass?.includes('3/4') ||
      item.aspectRatioClass?.includes('4/5')
    ))
  );

  // Dynamic box aspect ratio: sets box to landscape if video is landscape, portrait if video is portrait
  const boxAspectClass = (() => {
    const ratio = item.aspectRatioClass?.toLowerCase() || '';
    if (ratio.includes('16/9') || ratio.includes('video')) return 'aspect-video';
    if (ratio.includes('4/3')) return 'aspect-[4/3]';
    if (ratio.includes('21/9')) return 'aspect-[21/9]';
    if (ratio.includes('9/16')) return 'aspect-[9/16]';
    if (ratio.includes('3/4')) return 'aspect-[3/4]';
    if (ratio.includes('4/5')) return 'aspect-[4/5]';
    if (ratio.includes('square') || ratio.includes('1/1')) return 'aspect-square';

    if (isLandscape) return 'aspect-video';
    if (isPortrait) return 'aspect-[9/16]';
    return isGoogleDriveUrl(item.videoUrl) ? 'aspect-video' : 'aspect-[9/16]';
  })();

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!item.aspectRatioClass && img.naturalWidth && img.naturalHeight) {
      if (img.naturalWidth > img.naturalHeight * 1.05) {
        setDetectedAspect('landscape');
      } else if (img.naturalHeight > img.naturalWidth * 1.05) {
        setDetectedAspect('portrait');
      }
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (!item.aspectRatioClass && vid.videoWidth && vid.videoHeight) {
      if (vid.videoWidth > vid.videoHeight * 1.05) {
        setDetectedAspect('landscape');
      } else if (vid.videoHeight > vid.videoWidth * 1.05) {
        setDetectedAspect('portrait');
      }
    }
  };

  // Playable video stream for hover motion preview
  const hoverVideoSrc = isGoogleDriveUrl(item.videoUrl)
    ? 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-and-the-ocean-41550-large.mp4'
    : item.videoUrl;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
      } catch {}
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {}
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    }
  }, [hoverVideoSrc]);

  return (
    <div
      draggable={isAdminAuthenticated}
      onDragStart={(e) => handleDragStart(e, item.id)}
      onDragOver={(e) => handleDragOver(e, item.id)}
      onDragLeave={(e) => handleDragLeave(e, item.id)}
      onDragEnd={handleDragEnd}
      onDrop={(e) => handleDrop(e, item.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (!draggedVideoId) setActiveVideo(item);
      }}
      className={`group relative flex flex-col p-2 pb-2.5 sm:p-3 sm:pb-3.5 rounded-[18px] sm:rounded-[24px] md:rounded-[28px] bg-gradient-to-b from-[#181b26]/95 via-[#0e1017]/98 to-[#090a0d]/98 border transition-all duration-300 animate-fadeIn break-inside-avoid w-full mb-3 sm:mb-4 md:mb-6 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)] ${
        openMenuVideoId === item.id ? 'z-40' : 'z-10'
      } ${
        isBeingDragged
          ? 'opacity-35 scale-95 border-dashed border-blue-400 bg-blue-950/20 cursor-grabbing shadow-none'
          : isDragTarget
          ? 'scale-[1.02] border-cyan-400 bg-cyan-950/30 shadow-[0_0_35px_rgba(6,182,212,0.6)] cursor-copy ring-2 ring-cyan-400/40'
          : 'border-white/[0.09] hover:border-blue-400/60 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(59,130,246,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1 active:scale-[0.98] cursor-pointer'
      }`}
    >
      {/* Top Metallic Glass Sheen Highlight */}
      <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:via-blue-300/50 transition-colors duration-500" />

      {/* Inner Video Poster Frame with video-aware aspect ratio (landscape or portrait) */}
      <div className={`relative w-full ${boxAspectClass} rounded-[14px] sm:rounded-[20px] md:rounded-[22px] overflow-hidden bg-neutral-950 border border-white/[0.1] group-hover:border-white/[0.22] transition-colors duration-300 shadow-inner`}>
        {/* Poster Image */}
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Auto-Playing Video Preview (Mobile & Desktop Compatible) */}
        {hoverVideoSrc && (
          <video
            ref={videoRef}
            src={hoverVideoSrc}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            onLoadedMetadata={handleVideoMetadata}
            onCanPlay={() => {
              if (videoRef.current) {
                videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
              }
            }}
            onPlaying={() => setIsVideoPlaying(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none rounded-[14px] sm:rounded-[20px] md:rounded-[22px] ${
              isVideoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Right Admin Controls */}
        {isAdminAuthenticated && (
          <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-30">
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuVideoId((prev) => (prev === item.id ? null : item.id));
                }}
                title="Reel Edit Menu (Three Dots)"
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-xl shadow-lg active:scale-90 border ${
                  openMenuVideoId === item.id
                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.7)]'
                    : 'bg-black/80 hover:bg-white text-neutral-300 hover:text-black border-white/20 hover:border-white'
                }`}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu for Edits - Compact Premium Icon Palette */}
              {openMenuVideoId === item.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-[#090b12]/98 border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.98),0_0_25px_rgba(37,99,235,0.35)] backdrop-blur-2xl z-50 animate-fadeIn select-none"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuVideoId(null);
                      setEditingVideo(item);
                    }}
                    title="Edit Details"
                    aria-label="Edit Details"
                    className="w-8 h-8 rounded-xl bg-blue-500/15 hover:bg-blue-600 border border-blue-400/25 hover:border-blue-400 flex items-center justify-center text-blue-400 hover:text-white transition-all active:scale-90 cursor-pointer shadow-sm group"
                  >
                    <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuVideoId(null);
                      setThumbnailStudioVideo(item);
                    }}
                    title="Cover Frame"
                    aria-label="Cover Frame"
                    className="w-8 h-8 rounded-xl bg-purple-500/15 hover:bg-purple-600 border border-purple-400/25 hover:border-purple-400 flex items-center justify-center text-purple-400 hover:text-white transition-all active:scale-90 cursor-pointer shadow-sm group"
                  >
                    <Film className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>

                  <div className="w-5 h-px bg-white/15 my-0.5" />

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuVideoId(null);
                      setVideoToDelete(item);
                    }}
                    title="Delete Reel"
                    aria-label="Delete Reel"
                    className="w-8 h-8 rounded-xl bg-red-500/15 hover:bg-red-600 border border-red-500/25 hover:border-red-400 flex items-center justify-center text-red-400 hover:text-white transition-all active:scale-90 cursor-pointer shadow-sm group"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Vignette Accent */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Center Play Button Overlay on Hover (Fades out when video starts auto-playing) */}
        {!isVideoPlaying && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 backdrop-blur-2xl border border-white/40 ring-1 ring-white/20 text-white shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 group-hover:border-blue-400/80 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.55)]">
              <Play className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-white text-white ml-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
            </div>
          </div>
        )}
      </div>

      {/* Centered Typography Matching Reference Card */}
      <div className="mt-2.5 sm:mt-3 text-center px-1 sm:px-2 font-sans select-none">
        <h3 className="text-xs sm:text-sm md:text-[14.5px] font-bold text-white tracking-tight line-clamp-1 group-hover:text-blue-300 transition-colors duration-200 drop-shadow-sm">
          {item.title}
        </h3>
        <p
          className="text-[10.5px] sm:text-xs text-neutral-400 font-medium mt-0.5 truncate tracking-normal group-hover:text-neutral-200 transition-colors duration-200"
          title={item.caption || item.location || item.category}
        >
          {item.caption || item.location || item.category}
        </p>
      </div>
    </div>
  );
}

export function VideoGalleryPage({ onClose }: VideoGalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [animKey, setAnimKey] = useState<number>(0);
  const [activeVideo, setActiveVideo] = useState<VideoGalleryItem | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [detectedVideoAspect, setDetectedVideoAspect] = useState<'landscape' | 'portrait' | null>(null);

  // Categories State (Supports custom added categories)
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_CATEGORIES;
  });

  // Full Persistent Catalog Videos (Supports custom ordering, renaming, recategorizing, custom delete)
  const [catalogVideos, setCatalogVideos] = useState<VideoGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(VIDEOS_CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((v) => ({
            ...v,
            duration: v.duration && v.duration.toLowerCase() === 'hd reel' ? '' : (v.duration || '')
          }));
        }
      }
      // Migrate from previous storage key if present
      const oldSaved = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (oldSaved) {
        const parsedOld = JSON.parse(oldSaved);
        if (Array.isArray(parsedOld) && parsedOld.length > 0) {
          return [...parsedOld, ...videoGalleryItems];
        }
      }
    } catch {
      // fallback
    }
    return videoGalleryItems;
  });

  // State for Dedicated Delete Warning Confirmation Modal
  const [videoToDelete, setVideoToDelete] = useState<VideoGalleryItem | null>(null);

  // State for 3-dots Edit Menu, Video Details Editing Modal & Thumbnail Studio Modal
  const [openMenuVideoId, setOpenMenuVideoId] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoGalleryItem | null>(null);
  const [thumbnailStudioVideo, setThumbnailStudioVideo] = useState<VideoGalleryItem | null>(null);

  // Edit Video Details Form States
  const [editFormTitle, setEditFormTitle] = useState<string>('');
  const [editFormCategory, setEditFormCategory] = useState<string>('');
  const [editFormLocation, setEditFormLocation] = useState<string>('');
  const [editFormDuration, setEditFormDuration] = useState<string>('');
  const [editFormCaption, setEditFormCaption] = useState<string>('');
  const [editFormAspectRatio, setEditFormAspectRatio] = useState<string>('aspect-[16/9]');

  // Populate form fields when video is selected for editing
  useEffect(() => {
    if (editingVideo) {
      setEditFormTitle(editingVideo.title || '');
      setEditFormCategory(editingVideo.category || '');
      setEditFormLocation(editingVideo.location || '');
      setEditFormDuration(editingVideo.duration || '');
      setEditFormCaption(editingVideo.caption || '');
      setEditFormAspectRatio(editingVideo.aspectRatioClass || 'aspect-[16/9]');
    }
  }, [editingVideo]);

  // Close 3-dots menu on click outside or Escape
  useEffect(() => {
    if (!openMenuVideoId) return;
    const handleGlobalClick = () => setOpenMenuVideoId(null);
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuVideoId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [openMenuVideoId]);

  // Helper to automatically persist and synchronize catalog & categories instantly across tabs, windows, and viewers
  const persistAndSyncCatalog = (videos: VideoGalleryItem[], cats: string[]) => {
    try {
      localStorage.setItem(VIDEOS_CATALOG_STORAGE_KEY, JSON.stringify(videos));
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
      const customOnly = videos.filter((v) => v.isCustom);
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(customOnly));

      setSavedVideosSnapshot(videos);
      setSavedCategoriesSnapshot(cats);

      window.dispatchEvent(new Event('sync-custom-videos'));

      try {
        const bc = new BroadcastChannel('portfolio_sync_channel');
        bc.postMessage({ type: 'VIDEOS_UPDATED', timestamp: Date.now() });
        bc.close();
      } catch {}
    } catch (err) {
      console.error('Auto-save error:', err);
    }
  };

  // Cross-tab & Cross-session Sync Listener
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('portfolio_sync_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'VIDEOS_UPDATED') {
          try {
            const savedVid = localStorage.getItem(VIDEOS_CATALOG_STORAGE_KEY);
            if (savedVid) {
              const parsed = JSON.parse(savedVid);
              if (Array.isArray(parsed)) {
                setCatalogVideos(parsed);
                setSavedVideosSnapshot(parsed);
              }
            }
            const savedCat = localStorage.getItem(CATEGORIES_STORAGE_KEY);
            if (savedCat) {
              const parsedCat = JSON.parse(savedCat);
              if (Array.isArray(parsedCat)) {
                setCategories(parsedCat);
                setSavedCategoriesSnapshot(parsedCat);
              }
            }
          } catch {}
        }
      };
    } catch {}

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VIDEOS_CATALOG_STORAGE_KEY || e.key === CATEGORIES_STORAGE_KEY) {
        try {
          const savedVid = localStorage.getItem(VIDEOS_CATALOG_STORAGE_KEY);
          if (savedVid) {
            const parsed = JSON.parse(savedVid);
            if (Array.isArray(parsed)) {
              setCatalogVideos(parsed);
              setSavedVideosSnapshot(parsed);
            }
          }
          const savedCat = localStorage.getItem(CATEGORIES_STORAGE_KEY);
          if (savedCat) {
            const parsedCat = JSON.parse(savedCat);
            if (Array.isArray(parsedCat)) {
              setCategories(parsedCat);
              setSavedCategoriesSnapshot(parsedCat);
            }
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const handleSyncEvent = () => {
      try {
        const savedVid = localStorage.getItem(VIDEOS_CATALOG_STORAGE_KEY);
        if (savedVid) {
          const parsed = JSON.parse(savedVid);
          if (Array.isArray(parsed)) {
            setCatalogVideos(parsed);
            setSavedVideosSnapshot(parsed);
          }
        }
      } catch {}
    };
    window.addEventListener('sync-custom-videos', handleSyncEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sync-custom-videos', handleSyncEvent);
      if (bc) bc.close();
    };
  }, []);

  // Save changes from Edit Video Details Modal
  const handleSaveVideoEdits = () => {
    if (!editingVideo) return;
    const cleanDuration = editFormDuration.trim().toLowerCase() === 'hd reel' ? '' : (editFormDuration.trim() || '');
    const updated: VideoGalleryItem = {
      ...editingVideo,
      title: editFormTitle.trim() || editingVideo.title,
      category: editFormCategory.trim() || editingVideo.category,
      location: editFormLocation.trim(),
      duration: cleanDuration,
      caption: editFormCaption.trim(),
      aspectRatioClass: editFormAspectRatio || editingVideo.aspectRatioClass || 'aspect-[16/9]'
    };
    let newCatalog: VideoGalleryItem[] = [];
    setCatalogVideos((prev) => {
      newCatalog = prev.map((v) => (v.id === updated.id ? updated : v));
      return newCatalog;
    });
    persistAndSyncCatalog(newCatalog, categories);

    setActiveVideo((current) => (current && current.id === updated.id ? updated : current));
    setEditingVideo(null);
    setSaveToastMsg(`"${updated.title}" updated and auto-saved successfully!`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Save new thumbnail selected from ThumbnailEditStudioModal
  const handleSaveThumbnailCover = (newCoverUrl: string) => {
    if (!thumbnailStudioVideo) return;
    const updated: VideoGalleryItem = {
      ...thumbnailStudioVideo,
      url: newCoverUrl
    };
    let newCatalog: VideoGalleryItem[] = [];
    setCatalogVideos((prev) => {
      newCatalog = prev.map((v) => (v.id === updated.id ? updated : v));
      return newCatalog;
    });
    persistAndSyncCatalog(newCatalog, categories);

    setThumbnailStudioVideo(null);
    setSaveToastMsg(`Thumbnail cover updated & auto-saved for "${updated.title}"!`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // State for Adding Category
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  // Reset detected aspect ratio when active video changes
  useEffect(() => {
    setDetectedVideoAspect(null);
  }, [activeVideo?.id]);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mushfiq_videography_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Rehydrate video URLs for items stored in IndexedDB (gallery uploads)
  useEffect(() => {
    let isCancelled = false;
    const restoreBlobs = async () => {
      let hasUpdates = false;
      const updated = await Promise.all(
        catalogVideos.map(async (v) => {
          if (v.isGalleryUpload && (!v.videoUrl || v.videoUrl.startsWith('blob:'))) {
            try {
              const blob = await getVideoBlob(v.id);
              if (blob && !isCancelled) {
                hasUpdates = true;
                return { ...v, videoUrl: URL.createObjectURL(blob) };
              }
            } catch (err) {
              console.warn('Failed restoring video blob for', v.id, err);
            }
          }
          return v;
        })
      );
      if (hasUpdates && !isCancelled) {
        setCatalogVideos(updated);
      }
    };
    restoreBlobs();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleAddVideo = (newVideo: VideoGalleryItem) => {
    const cleanDuration = newVideo.duration && newVideo.duration.toLowerCase() === 'hd reel' ? '' : (newVideo.duration || '');
    const videoWithCustom: VideoGalleryItem = { ...newVideo, duration: cleanDuration, isCustom: true };
    
    let updatedCatalog: VideoGalleryItem[] = [];
    setCatalogVideos((prev) => {
      updatedCatalog = [videoWithCustom, ...prev];
      return updatedCatalog;
    });

    let updatedCategories = [...categories];
    if (newVideo.category && !updatedCategories.includes(newVideo.category.toUpperCase())) {
      const cleanCat = newVideo.category.toUpperCase();
      updatedCategories = [...updatedCategories, cleanCat];
      setCategories(updatedCategories);
    }

    persistAndSyncCatalog(updatedCatalog, updatedCategories);

    setActiveVideo(videoWithCustom);
    setShowAddModal(false);
    setSaveToastMsg(`"${videoWithCustom.title}" added and auto-saved successfully!`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Custom Delete: Deletes ANY video from catalog
  const handleDeleteVideo = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    let updatedCatalog: VideoGalleryItem[] = [];
    setCatalogVideos((prev) => {
      updatedCatalog = prev.filter((v) => v.id !== id);
      return updatedCatalog;
    });

    persistAndSyncCatalog(updatedCatalog, categories);

    try {
      await deleteVideoBlob(id);
    } catch {}

    if (activeVideo?.id === id) {
      setActiveVideo(null);
    }
    setSaveToastMsg('Video deleted and changes auto-saved!');
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Reorder Videos: Moves a video earlier or later in the catalog order
  const handleMoveVideo = (id: string, direction: -1 | 1, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCatalogVideos((prev) => {
      const index = prev.findIndex((v) => v.id === id);
      if (index === -1) return prev;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newArr = [...prev];
      const [moved] = newArr.splice(index, 1);
      newArr.splice(targetIndex, 0, moved);

      persistAndSyncCatalog(newArr, categories);
      return newArr;
    });
    setSaveToastMsg('Video order updated and auto-saved!');
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // State for Drag & Drop Reordering in 2D Grid (left, right, up, down)
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null);
  const [dragOverVideoId, setDragOverVideoId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDraggedVideoId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverVideoId !== id) {
      setDragOverVideoId(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent, id: string) => {
    if (dragOverVideoId === id) {
      setDragOverVideoId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedVideoId(null);
    setDragOverVideoId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedVideoId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) {
      setDraggedVideoId(null);
      setDragOverVideoId(null);
      return;
    }

    setCatalogVideos((prev) => {
      const fromIndex = prev.findIndex((v) => v.id === sourceId);
      const toIndex = prev.findIndex((v) => v.id === targetId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;

      const newArr = [...prev];
      const [moved] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, moved);

      persistAndSyncCatalog(newArr, categories);
      return newArr;
    });

    setDraggedVideoId(null);
    setDragOverVideoId(null);
    setSaveToastMsg('Video order updated & auto-saved!');
    setTimeout(() => {
      setSaveToastMsg('');
    }, 3500);
  };

  // Add Category: Creates a new category tab and persists it
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategoryName.trim().toUpperCase();
    if (!clean) return;

    if (!categories.includes(clean)) {
      const updated = [...categories, clean];
      setCategories(updated);
      persistAndSyncCatalog(catalogVideos, updated);
      setSelectedCategory(clean);
    }
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    setSaveToastMsg(`Category "${clean}" created & auto-saved!`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Delete Custom Category
  const handleDeleteCategory = (catToDelete: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (catToDelete === 'ALL') return;
    const updated = categories.filter((c) => c !== catToDelete);
    setCategories(updated);
    persistAndSyncCatalog(catalogVideos, updated);
    if (selectedCategory === catToDelete) {
      setSelectedCategory('ALL');
    }
    setSaveToastMsg(`Category deleted & auto-saved!`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Saved Snapshots to detect unsaved changes (reset is ONLY available before saving changes)
  const [savedVideosSnapshot, setSavedVideosSnapshot] = useState<VideoGalleryItem[]>(() => catalogVideos);
  const [savedCategoriesSnapshot, setSavedCategoriesSnapshot] = useState<string[]>(() => categories);

  // State for Save & Reset Options Feedback & Modals
  const [saveToastMsg, setSaveToastMsg] = useState<string>('');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Check if there are unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    const savedVideosSig = JSON.stringify(
      savedVideosSnapshot.map((v) => ({ id: v.id, title: v.title, category: v.category, caption: v.caption }))
    );
    const currentVideosSig = JSON.stringify(
      catalogVideos.map((v) => ({ id: v.id, title: v.title, category: v.category, caption: v.caption }))
    );
    const savedCatsSig = JSON.stringify(savedCategoriesSnapshot);
    const currentCatsSig = JSON.stringify(categories);

    return savedVideosSig !== currentVideosSig || savedCatsSig !== currentCatsSig;
  }, [catalogVideos, categories, savedVideosSnapshot, savedCategoriesSnapshot]);

  // Save All Changes: Persists current video order, custom titles, categories, and uploads
  const handleSaveAllChanges = () => {
    persistAndSyncCatalog(catalogVideos, categories);
    setSaveToastMsg('All video reorderings, renames, categories & custom uploads saved successfully!');
    setTimeout(() => {
      setSaveToastMsg('');
    }, 3500);
  };

  // Reset Unsaved Changes: Reverts unsaved edits back to last saved state (only executable before save)
  const handleConfirmResetAll = async () => {
    try {
      setCatalogVideos(savedVideosSnapshot);
      setCategories(savedCategoriesSnapshot);

      setShowResetConfirmModal(false);
      setSaveToastMsg('All unsaved edits and reorderings have been reset back to last saved state!');
      setTimeout(() => {
        setSaveToastMsg('');
      }, 3500);
    } catch (err) {
      console.error('Error resetting changes', err);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setAnimKey((prev) => prev + 1);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredVideos = catalogVideos.filter((v) => {
    const matchesCategory = (() => {
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'GALLERY UPLOADS') return Boolean(v.isGalleryUpload);
      if (selectedCategory === 'GOOGLE DRIVE') return isGoogleDriveUrl(v.videoUrl);
      return v.category.toUpperCase() === selectedCategory.toUpperCase();
    })();
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      v.title.toLowerCase().includes(q) ||
      (v.caption && v.caption.toLowerCase().includes(q)) ||
      (v.location && v.location.toLowerCase().includes(q)) ||
      (v.category && v.category.toLowerCase().includes(q)) ||
      (v.camera && v.camera.toLowerCase().includes(q)) ||
      (v.year && v.year.toLowerCase().includes(q))
    );
  });

  const handlePrevVideo = () => {
    if (!activeVideo || filteredVideos.length === 0) return;
    const currentIndex = filteredVideos.findIndex((v) => v.id === activeVideo.id);
    const prevIndex = (currentIndex - 1 + filteredVideos.length) % filteredVideos.length;
    setActiveVideo(filteredVideos[prevIndex]);
  };

  const handleNextVideo = () => {
    if (!activeVideo || filteredVideos.length === 0) return;
    const currentIndex = filteredVideos.findIndex((v) => v.id === activeVideo.id);
    const nextIndex = (currentIndex + 1) % filteredVideos.length;
    setActiveVideo(filteredVideos[nextIndex]);
  };

  const handleDownloadVideo = async (video: VideoGalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const driveId = extractGoogleDriveId(video.videoUrl);
      if (driveId) {
        window.open(`https://drive.google.com/uc?export=download&id=${driveId}`, '_blank');
      } else {
        const response = await fetch(video.videoUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${video.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch {
      window.open(video.videoUrl, '_blank');
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  // Focus container on mount for immediate mouse wheel & keyboard interaction
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Keyboard shortcut to close on Escape, Arrow keys navigation & lock body scrolling & Mouse Wheel scroll handling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAdminModal) {
          setShowAdminModal(false);
        } else if (showAddModal) {
          setShowAddModal(false);
        } else if (activeVideo) {
          setActiveVideo(null);
        } else {
          onClose();
        }
      } else if (activeVideo && !showAdminModal && !showAddModal) {
        if (e.key === 'ArrowLeft') {
          handlePrevVideo();
        } else if (e.key === 'ArrowRight') {
          handleNextVideo();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeVideo || showAddModal || showAdminModal) return;
      if (containerRef.current) {
        containerRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeVideo, showAddModal, showAdminModal, onClose, filteredVideos]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.div
      ref={containerRef}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] bg-[#090A0F] text-neutral-100 overflow-y-auto overscroll-contain touch-pan-y outline-none font-sans selection:bg-[#2563EB] selection:text-white flex flex-col min-h-screen"
    >
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent" />
      </div>

      {/* Top Header Navigation matching exact reference style */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-2xl border-b border-white/[0.08] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] relative">
        {/* Subtle Top Ambient Gradient Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2563EB]/40 via-purple-500/30 to-transparent pointer-events-none" />
        
        {/* Left: Brand / Return to Portfolio */}
        <div className="flex items-center justify-between lg:justify-start gap-2.5 sm:gap-4">
          <button
            onClick={onClose}
            className="group relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.05] hover:bg-[#2563EB] text-white border border-white/10 hover:border-blue-400/40 text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 overflow-hidden shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1 text-blue-400 group-hover:text-white" />
            <span className="font-medium tracking-wide">Back</span>
            <span className="hidden sm:inline font-medium tracking-wide">to Portfolio</span>
          </button>

          <div className="hidden sm:block h-4 w-[1px] bg-white/15" />

          <div className="flex items-center gap-2 sm:gap-2.5 overflow-hidden font-sans">
            <span className="text-xs sm:text-base font-bold text-white tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text truncate">
              Videography Works
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-sans font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/25 shadow-[0_0_12px_rgba(37,99,235,0.18)] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {filteredVideos.length} {filteredVideos.length === 1 ? 'WORK' : 'WORKS'}
            </span>
          </div>
        </div>

        {/* Center: Premium Standard Search Bar */}
        <div className="w-full lg:max-w-md xl:max-w-lg relative">
          <div className="relative flex items-center w-full group">
            <div className="absolute left-3.5 pointer-events-none flex items-center justify-center text-neutral-400 group-focus-within:text-blue-400 transition-colors duration-200">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reels by title, category, location..."
              className="w-full pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-900 focus:bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-500 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right / Category Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-gradient-to-r from-neutral-950/90 via-neutral-900/95 to-neutral-950/90 border border-white/10 backdrop-blur-2xl overflow-x-auto touch-pan-x pb-1.5 lg:pb-1.5 no-scrollbar shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] -mx-1 px-1.5 sm:mx-0 sm:px-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const isRemovable = cat !== 'ALL';

            const getCategoryIcon = (categoryName: string) => {
              const upper = categoryName.toUpperCase();
              if (upper === 'ALL') return Sparkles;
              if (upper.includes('DRONE') || upper.includes('FPV')) return Camera;
              if (upper.includes('MOTION') || upper.includes('VFX')) return Video;
              if (upper.includes('COMMERCIAL')) return Tag;
              if (upper.includes('GALLERY') || upper.includes('UPLOAD')) return Upload;
              if (upper.includes('GOOGLE') || upper.includes('DRIVE')) return ExternalLink;
              return Film;
            };

            const CatIcon = getCategoryIcon(cat);

            return (
              <div key={cat} className="relative flex items-center group/cat shrink-0">
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 z-10 select-none shrink-0 ${
                    isSelected
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeVideoCategoryPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.6)] border border-blue-400/40 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <CatIcon className={`w-3.5 h-3.5 transition-colors duration-200 ${isSelected ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'text-neutral-400 group-hover/cat:text-neutral-200'}`} />
                  <span className="font-medium tracking-wide">{cat}</span>
                </button>

                {/* Custom Removal of Categories in Admin Mode */}
                {isAdminAuthenticated && isRemovable && (
                  <button
                    onClick={(e) => handleDeleteCategory(cat, e)}
                    title={`Remove "${cat}" category filter tab`}
                    className="w-4 h-4 rounded-full bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-[9px] flex items-center justify-center transition-all cursor-pointer mr-0.5 hover:scale-110 active:scale-90 z-20 shadow-sm"
                    aria-label={`Remove category ${cat}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Category Pill (Admin Only) */}
          {isAdminAuthenticated && (
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="px-3.5 py-1.5 sm:py-2 rounded-full bg-purple-500/15 hover:bg-purple-600/90 text-purple-300 hover:text-white border border-purple-500/35 text-xs font-sans font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-105 active:scale-95"
              title="Add New Category"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          )}
        </div>

        {/* Right Controls: Admin Active status (if logged in) & Close */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAdminAuthenticated && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-400/40 hover:border-blue-300 text-blue-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              title="Open Admin Control Hub"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
              <Unlock className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-mono">ADMIN ACTIVE</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close Gallery (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Gallery Area - Orderly Responsive Grid matching exact reference image style */}
      <main className="flex-1 w-full max-w-[1540px] mx-auto px-2 xs:px-3 sm:px-6 md:px-8 py-4 sm:py-8 relative z-10 font-sans">
        {/* Ambient Cinema Lighting Mesh for Ultra-Premium Atmosphere */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-blue-600/[0.08] via-indigo-600/[0.03] to-transparent blur-[140px] pointer-events-none rounded-full -z-10" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-blue-500/[0.03] blur-[150px] pointer-events-none rounded-full -z-10" />
        <div className="absolute top-2/3 -right-20 w-80 h-80 bg-purple-600/[0.03] blur-[150px] pointer-events-none rounded-full -z-10" />
        
        {/* Save/Reset Feedback Toast Banner */}
        <AnimatePresence>
          {saveToastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="mb-4 p-3.5 px-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-sans font-semibold flex items-center justify-between gap-3 shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveToastMsg}</span>
              </div>
              <button
                onClick={() => setSaveToastMsg('')}
                className="p-1 rounded-full hover:bg-white/10 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Bar (CSS Selector 1) - Compact, Ultra-Professional Studio Ribbon */}
        {isAdminAuthenticated && (
          <div className="relative overflow-hidden mb-5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#090b12]/95 border border-white/[0.08] shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 text-xs font-sans">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-1/4 w-80 h-10 bg-blue-500/10 blur-xl pointer-events-none" />

            {/* Left Status Bar */}
            <div className="flex items-center gap-2.5 relative z-10 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-sm shrink-0">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-['Syne'] font-bold text-white tracking-wide">
                  ADMIN COCKPIT
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-[9px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
                <span className="text-[11px] text-neutral-400 font-sans hidden lg:inline border-l border-white/10 pl-2">
                  Drag cards in any direction to reorder
                </span>
              </div>
            </div>

            {/* Right Action Button Deck */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 relative z-10 shrink-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Upload className="w-3 h-3 stroke-[2.5]" />
                <span>Upload Video</span>
              </button>

              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-600/30 text-purple-200 hover:text-white border border-purple-500/30 font-semibold text-[11px] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                <span>Category</span>
              </button>

              {/* Save All Changes Option */}
              {hasUnsavedChanges ? (
                <button
                  onClick={handleSaveAllChanges}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                  title="Save all unsaved reorderings and edits"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Changes</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-950/30 text-emerald-400/70 border border-emerald-500/20 text-[11px] font-medium flex items-center gap-1.5 cursor-default opacity-80"
                  title="All changes are currently saved."
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Saved</span>
                </button>
              )}

              {/* Reset Option */}
              {hasUnsavedChanges ? (
                <button
                  onClick={() => setShowResetConfirmModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 font-semibold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Reset unsaved edits back to last saved state"
                >
                  <RotateCcw className="w-3 h-3 text-red-400" />
                  <span>Reset</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.02] text-neutral-600 border border-white/[0.06] font-medium text-[11px] flex items-center gap-1.5 cursor-not-allowed opacity-40"
                  title="Reset cannot be used after saving changes."
                >
                  <RotateCcw className="w-3 h-3 text-neutral-600" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={() => setShowAdminModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-neutral-300 hover:text-white font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Unlock className="w-3 h-3 text-neutral-400" />
                <span>Hub</span>
              </button>
            </div>
          </div>
        )}

        {/* Responsive Gallery Arranged by Video Sizes */}
        <AnimatePresence mode="wait">
          {filteredVideos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 w-full"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
                {searchQuery ? <Search className="w-6 h-6 sm:w-7 sm:h-7" /> : <Film className="w-6 h-6 sm:w-7 sm:h-7" />}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {searchQuery ? `No videos matching "${searchQuery}"` : 'No videos in this category'}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-sm">
                {searchQuery
                  ? 'Try searching with different keywords, location names, or clear the search filter.'
                  : 'All reels and films are presented in the All category.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wide transition-all border border-white/15 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  View All Reels
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategory}-${animKey}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-2.5 sm:gap-4 md:gap-6"
            >
              {filteredVideos.map((item) => {
                const isBeingDragged = draggedVideoId === item.id;
                const isDragTarget = dragOverVideoId === item.id && !isBeingDragged;

                return (
                  <GalleryVideoCard
                    key={item.id}
                    item={item}
                    isAdminAuthenticated={isAdminAuthenticated}
                    openMenuVideoId={openMenuVideoId}
                    setOpenMenuVideoId={setOpenMenuVideoId}
                    setEditingVideo={setEditingVideo}
                    setThumbnailStudioVideo={setThumbnailStudioVideo}
                    setVideoToDelete={setVideoToDelete}
                    setActiveVideo={setActiveVideo}
                    draggedVideoId={draggedVideoId}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDragEnd={handleDragEnd}
                    handleDrop={handleDrop}
                    isDragTarget={isDragTarget}
                    isBeingDragged={isBeingDragged}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer of Videography Gallery with Admin Access Icon */}
      <footer className="mt-6 sm:mt-10 mt-auto border-t border-white/[0.06] bg-[#07080c]/90 backdrop-blur-md py-2.5 sm:py-3 px-3.5 sm:px-6 font-sans w-full">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 text-[10px] sm:text-[11px] font-sans text-neutral-400">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-[10px] sm:text-[11px] text-neutral-300 truncate">
              MUSHFIQ ARCHIVE • VIDEOGRAPHY
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400">
              {filteredVideos.length} REELS
            </span>
            <span className="text-white/10">|</span>

            {/* Admin Lock / Icon-Only Button */}
            <button
              onClick={() => setShowAdminModal(true)}
              className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
                isAdminAuthenticated
                  ? 'bg-blue-600/15 hover:bg-blue-600/30 border border-blue-400/40 text-blue-400 hover:text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-neutral-500 hover:text-neutral-200'
              }`}
              title={isAdminAuthenticated ? "Owner Admin Active" : "Admin Access"}
              aria-label="Admin Access"
            >
              {isAdminAuthenticated ? (
                <Unlock className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-200" />
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Lightbox Inspector Overlay when a video item card is clicked */}
      <AnimatePresence>
        {activeVideo && (() => {
          const driveId = extractGoogleDriveId(activeVideo.videoUrl);

          // Determine whether video is portrait or landscape:
          // Portrait: vertical reels (9:16), 3:4 or 4:5
          // Landscape: widescreen cinematic (16:9), 4:3, 21:9 ultrawide, or Google Drive / default landscape
          const isPortraitVideo = Boolean(
            detectedVideoAspect === 'portrait' ||
            (detectedVideoAspect === null && (
              activeVideo.aspectRatioClass?.includes('9/16') ||
              activeVideo.aspectRatioClass?.includes('3/4') ||
              activeVideo.aspectRatioClass?.includes('4/5')
            ))
          );
          const isLandscapeVideo = !isPortraitVideo;

          return (
            <div
              className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-y-auto"
              onClick={() => setActiveVideo(null)}
            >
              {/* Dark Blur Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/85 backdrop-blur-xl"
              />

              {/* Floating Left Navigation Arrow Button */}
              {filteredVideos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevVideo();
                  }}
                  className="hidden md:flex absolute left-3 sm:left-6 lg:left-8 xl:left-12 z-[160] p-3.5 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                  aria-label="Previous video"
                  title="Previous video (Left Arrow key)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Floating Right Navigation Arrow Button */}
              {filteredVideos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                  }}
                  className="hidden md:flex absolute right-3 sm:right-6 lg:right-8 xl:right-12 z-[160] p-3.5 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                  aria-label="Next video"
                  title="Next video (Right Arrow key)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Modal Container: Expanded width for Landscape videos, Increased height for Portrait videos */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className={`relative w-full bg-[#121316]/95 border border-white/15 rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(37,99,235,0.15)] backdrop-blur-2xl z-10 flex flex-col my-auto text-white font-sans transition-all duration-300 ${
                  isLandscapeVideo
                    ? 'max-w-[960px] md:max-w-[1040px] lg:max-w-[1120px]'
                    : 'max-w-[460px] sm:max-w-[500px] md:max-w-[540px]'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button at top right matching reference image */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 shadow-lg cursor-pointer backdrop-blur-md border border-white/15"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Inner Media Viewport Area: Dynamic Landscape Width & Tall Portrait Height */}
                <div
                  className={`relative w-full bg-[#181920] border border-white/10 rounded-[24px] overflow-hidden flex items-center justify-center shadow-inner group transition-all duration-300 ${
                    isLandscapeVideo
                      ? 'aspect-video min-h-[300px] sm:min-h-[440px] md:min-h-[520px] lg:min-h-[580px] max-h-[76vh]'
                      : 'h-[70vh] sm:h-[78vh] md:h-[82vh] min-h-[520px] sm:min-h-[620px] max-h-[820px]'
                  }`}
                >
                  {/* Ambient Blurred Fill from Video Poster */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      src={activeVideo.url}
                      alt=""
                      aria-hidden="true"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover blur-2xl scale-125 opacity-35 select-none"
                    />
                    <div className="absolute inset-0 bg-neutral-950/40" />
                  </div>

                  {/* Main Video Element */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-2 rounded-[20px] overflow-hidden">
                    {driveId ? (
                      <iframe
                        src={`https://drive.google.com/file/d/${driveId}/preview`}
                        className="w-full h-full rounded-[18px] border-0 bg-black shadow-2xl"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        title={activeVideo.title}
                      />
                    ) : (
                      <video
                        key={activeVideo.id}
                        src={activeVideo.videoUrl}
                        poster={activeVideo.url}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadedMetadata={(e) => {
                          const v = e.currentTarget;
                          if (v.videoWidth && v.videoHeight) {
                            if (v.videoWidth >= v.videoHeight * 1.1) {
                              setDetectedVideoAspect('landscape');
                            } else if (v.videoHeight > v.videoWidth * 1.05) {
                              setDetectedVideoAspect('portrait');
                            }
                          }
                        }}
                        className={`rounded-[18px] select-none block shadow-2xl ${
                          isLandscapeVideo
                            ? 'w-full h-full object-contain'
                            : 'h-full w-auto max-w-full object-contain'
                        }`}
                      />
                    )}
                  </div>

                  {/* Mobile In-card Left & Right Scroll Arrows */}
                  {filteredVideos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevVideo();
                        }}
                        className="md:hidden absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 hover:bg-white text-white hover:text-black backdrop-blur-md transition-all active:scale-90 border border-white/15 cursor-pointer shadow-lg"
                        aria-label="Previous video"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextVideo();
                        }}
                        className="md:hidden absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 hover:bg-white text-white hover:text-black backdrop-blur-md transition-all active:scale-90 border border-white/15 cursor-pointer shadow-lg"
                        aria-label="Next video"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Premium Download Pill Button matching exact reference image */}
                  <button
                    onClick={(e) => handleDownloadVideo(activeVideo, e)}
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

                {/* Centered Typography: Title & Subtitle matching reference card */}
                <div className="mt-4 px-2 text-center font-sans">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {activeVideo.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-neutral-400 font-medium mt-0.5 truncate"
                    title={activeVideo.caption || activeVideo.location || activeVideo.category}
                  >
                    {activeVideo.caption || activeVideo.location || activeVideo.category}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[170] flex items-center justify-center p-3 sm:p-6 select-none"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCategoryModal(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className="relative w-full max-w-md bg-[#0e0f14] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-white font-sans my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Add New Category</h3>
                    <p className="text-xs text-neutral-400">Create a new filter category tab</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. WEDDING FILMS, AUTOMOTIVE, TRAVEL"
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-purple-500 focus:outline-none text-xs text-white placeholder-neutral-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    Create Category
                  </button>
                </div>
              </form>

              {/* Manage & Remove Active Categories */}
              <div className="mt-5 pt-4 border-t border-neutral-800 space-y-2 font-sans">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
                  <span>ACTIVE CATEGORIES ({categories.length})</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Click trash to remove category</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 modal-scroll-slider">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-white"
                    >
                      <span className="font-medium text-xs">{cat}</span>
                      {cat !== 'ALL' ? (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(cat, e)}
                          title={`Remove category "${cat}"`}
                          className="p-1 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-600 italic">Default</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Warning Confirmation Modal for Video Deletion - Exact Match to Reference Image */}
      <AnimatePresence>
        {videoToDelete && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
            onClick={() => setVideoToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[540px] rounded-[28px] bg-[#0c0d12] border border-[#ef4444]/45 p-6 sm:p-8 shadow-2xl space-y-6 text-white font-sans"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#240f14] border border-red-500/35 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-[#f87171]" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Delete Video Warning
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-normal">
                    Are you sure you want to permanently delete
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    "{videoToDelete.title}"?
                  </p>
                  <p className="text-xs sm:text-sm text-[#f87171] pt-1 font-medium flex items-start gap-1.5 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>This action cannot be undone and will permanently remove this video from your showcase.</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => setVideoToDelete(null)}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#1e2026] hover:bg-[#2b2e37] text-neutral-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel (Keep Video)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteVideo(videoToDelete.id);
                    setVideoToDelete(null);
                  }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#e11d2e] hover:bg-[#ff2438] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                  <span>Yes, Delete Video</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Warning Confirmation Modal for Resetting All Changes */}
      <AnimatePresence>
        {showResetConfirmModal && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
            onClick={() => setShowResetConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[520px] rounded-[28px] bg-[#0c0d12] border border-red-500/45 p-6 sm:p-8 shadow-2xl space-y-6 text-white font-sans"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#240f14] border border-red-500/35 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 text-[#f87171]" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Reset Unsaved Changes?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                    This will revert all recent unsaved video reorderings, title renames, custom categories, and uploaded reels back to your last saved state.
                  </p>
                  <p className="text-xs sm:text-sm text-[#f87171] pt-1 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>This action cannot be undone.</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(false)}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#1e2026] hover:bg-[#2b2e37] text-neutral-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel (Keep Changes)
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetAll}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#e11d2e] hover:bg-[#ff2438] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                  <span>Reset All Changes</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Google Drive Video Modal */}
      <AddGoogleDriveVideoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddVideo={handleAddVideo}
        existingCount={catalogVideos.length}
      />

      {/* Admin Authentication & Control Modal */}
      <AdminAuthModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onOpenAddVideoModal={() => setShowAddModal(true)}
        customVideos={catalogVideos.filter((v) => v.isCustom)}
        onDeleteCustomVideo={handleDeleteVideo}
        onSelectVideo={(v) => setActiveVideo(v)}
        isAuthenticated={isAdminAuthenticated}
        setIsAuthenticated={setIsAdminAuthenticated}
      />

      {/* Thumbnail Frame Selection Studio Modal */}
      {thumbnailStudioVideo && (
        <ThumbnailEditStudioModal
          isOpen={Boolean(thumbnailStudioVideo)}
          imageSrc={thumbnailStudioVideo.url}
          videoSrc={thumbnailStudioVideo.videoUrl}
          onClose={() => setThumbnailStudioVideo(null)}
          onSave={handleSaveThumbnailCover}
        />
      )}

      {/* Edit Video Details & Metadata Modal */}
      <AnimatePresence>
        {editingVideo && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-6 select-none"
            onClick={() => setEditingVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className="relative w-full max-w-lg bg-[#090b12]/98 border border-white/[0.14] rounded-[28px] sm:rounded-[36px] p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_50px_rgba(37,99,235,0.22)] z-10 text-white font-sans my-auto max-h-[90vh] overflow-y-auto backdrop-blur-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Luxury Lighting Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] via-purple-500/80 to-transparent pointer-events-none z-30 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">Edit Reel Details</h3>
                    <p className="text-xs text-neutral-400">Update title, category and description</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveVideoEdits();
                }}
                className="mt-5 space-y-4 relative z-10"
              >
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Reel Title
                  </label>
                  <input
                    type="text"
                    value={editFormTitle}
                    onChange={(e) => setEditFormTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-xs text-white transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Category
                  </label>
                  <select
                    value={editFormCategory}
                    onChange={(e) => setEditFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-xs text-white transition-all cursor-pointer"
                  >
                    {categories
                      .filter((c) => c !== 'ALL')
                      .map((c) => (
                        <option key={c} value={c} className="bg-neutral-900 text-white">
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editFormCaption}
                    onChange={(e) => setEditFormCaption(e.target.value)}
                    placeholder="Short description of this reel..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-xs text-white resize-none transition-all"
                  />
                </div>

                {/* Video Box Size / Orientation */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    Video Box Size / Orientation
                  </label>
                  <select
                    value={editFormAspectRatio}
                    onChange={(e) => setEditFormAspectRatio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-xs text-white transition-all cursor-pointer"
                  >
                    <option value="aspect-[16/9]" className="bg-neutral-900 text-white">
                      Landscape (16:9 Widescreen)
                    </option>
                    <option value="aspect-[9/16]" className="bg-neutral-900 text-white">
                      Portrait (9:16 Vertical Reel)
                    </option>
                    <option value="aspect-[3/4]" className="bg-neutral-900 text-white">
                      Portrait (3:4 Classic)
                    </option>
                    <option value="aspect-[4/3]" className="bg-neutral-900 text-white">
                      Landscape (4:3 Classic)
                    </option>
                    <option value="aspect-[21/9]" className="bg-neutral-900 text-white">
                      Landscape (21:9 Ultrawide Cinema)
                    </option>
                    <option value="aspect-square" className="bg-neutral-900 text-white">
                      Square (1:1)
                    </option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingVideo(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default VideoGalleryPage;
