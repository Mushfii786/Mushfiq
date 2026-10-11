import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Maximize2, Heart, Share2, Camera, MapPin, Sparkles, Video, Play, Eye, Film, Plus, ExternalLink, Trash2, Lock, Unlock, Shield, FolderOpen } from 'lucide-react';
import { GradientWaves } from './GradientWaves';
import { extractGoogleDriveId, isGoogleDriveUrl } from '../utils/googleDrive';
import { getVideoBlob, deleteVideoBlob } from '../utils/videoStorage';
import { AddGoogleDriveVideoModal } from './AddGoogleDriveVideoModal';
import { AdminAuthModal } from './AdminAuthModal';

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
    id: "vgal-1-1",
    title: "Tokyo Neon Streets & Midnight Drift",
    category: "Cinematic Reels",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-with-neon-lights-at-night-41541-large.mp4",
    caption: "Night walkthrough through Shinjuku neon lanes featuring anamorphic lens flares and deep teal-orange color balance.",
    location: "Tokyo, Japan",
    camera: "Sony A7S III",
    lens: "35mm T1.5 Anamorphic",
    settings: "4K 60fps • S-Log3",
    year: "2026 Film",
    column: 1,
    aspectRatioClass: "aspect-[3/4]",
    duration: "0:45",
    views: 14200,
    likes: 1850
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

const videoCategories = ['ALL', 'GALLERY UPLOADS', 'GOOGLE DRIVE', 'CINEMATIC REELS', 'DRONE & FPV', 'COMMERCIAL', 'MOTION & VFX', 'DOCUMENTARY'];

const STORAGE_KEY = 'mushfiq_custom_drive_videos';

export function VideoGalleryPage({ onClose }: VideoGalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [animKey, setAnimKey] = useState<number>(0);
  const [activeVideo, setActiveVideo] = useState<VideoGalleryItem | null>(null);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mushfiq_videography_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Load custom user-added videos from localStorage
  const [customVideos, setCustomVideos] = useState<VideoGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({ ...item, isCustom: true }));
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Rehydrate video URLs for items stored in IndexedDB (gallery uploads)
  useEffect(() => {
    let isCancelled = false;
    const restoreBlobs = async () => {
      let hasUpdates = false;
      const updated = await Promise.all(
        customVideos.map(async (v) => {
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
        setCustomVideos(updated);
      }
    };
    restoreBlobs();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleAddVideo = (newVideo: VideoGalleryItem) => {
    const videoWithCustom: VideoGalleryItem = { ...newVideo, isCustom: true };
    const updated = [videoWithCustom, ...customVideos];
    setCustomVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    // Instantly open the newly added video so the user previews it immediately!
    setActiveVideo(videoWithCustom);
    setShowAddModal(false);
  };

  const handleDeleteCustomVideo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customVideos.filter((v) => v.id !== id);
    setCustomVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await deleteVideoBlob(id);
    } catch (e) {
      console.error('Failed to delete video', e);
    }
    if (activeVideo?.id === id) {
      setActiveVideo(null);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setAnimKey((prev) => prev + 1);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // Focus container on mount for immediate mouse wheel & keyboard interaction
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Keyboard shortcut to close on Escape & lock body scrolling & Mouse Wheel scroll handling
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
  }, [activeVideo, showAddModal, showAdminModal, onClose]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Combine custom user videos with base curated catalog
  const allVideos: VideoGalleryItem[] = [...customVideos, ...videoGalleryItems];

  const filteredVideos = allVideos.filter((v) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'GALLERY UPLOADS') return Boolean(v.isGalleryUpload);
    if (selectedCategory === 'GOOGLE DRIVE') return isGoogleDriveUrl(v.videoUrl);
    return v.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  const totalDriveVideos = allVideos.filter((v) => isGoogleDriveUrl(v.videoUrl)).length;

  return (
    <motion.div
      ref={containerRef}
      tabIndex={-1}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#080808]/90 backdrop-blur-2xl text-neutral-100 overflow-y-auto overscroll-contain touch-pan-y outline-none selection:bg-[#2563EB] selection:text-white"
    >
      <GradientWaves />
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="group px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 text-xs font-mono font-bold tracking-widest uppercase hover:bg-[#2563EB] hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO PORTFOLIO</span>
          </button>

          <div className="hidden sm:block h-5 w-[1px] bg-neutral-800" />

          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#2563EB]" />
            <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-tight font-mono text-white">
              CURATED VIDEOGRAPHY GALLERY
            </h1>
          </div>
        </div>

        {/* Center: Video Category Filters */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar overscroll-contain"
        >
          {videoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3 text-current" />
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Right: Admin Status (if authenticated), Counter & Close */}
        <div className="flex items-center justify-end gap-3 text-xs font-mono text-neutral-500">
          {isAdminAuthenticated && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:text-white hover:bg-blue-600 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              title="Open Admin Control"
            >
              <Unlock className="w-3 h-3" />
              <span>ADMIN ACTIVE</span>
            </button>
          )}

          <span className="hidden lg:inline">{filteredVideos.length} REELS</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-900 text-neutral-300 hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer"
            title="Close Gallery (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Main Grid Area - Matching the exact 4-column layout of reference image */}
      <main className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 py-6 sm:py-10">
        
        {/* Admin Bar (Only visible when authenticated) */}
        {isAdminAuthenticated && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 via-neutral-900 to-neutral-900 border border-blue-800/40 backdrop-blur-md transition-all shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-blue-300">
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Owner Admin Mode Active • Google Drive Videography Access</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Drive Video</span>
              </button>
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs transition-all cursor-pointer"
              >
                Admin Hub
              </button>
            </div>
          </div>
        )}

        {/* Dark Framed Grid Container */}
        <div className="bg-[#080808] p-2 sm:p-4 rounded-xl">
          
          {/* 4-Column Responsive Grid with Category Startup Animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${animKey}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-start"
            >
              {[1, 2, 3, 4].map((colNum) => {
                const columnVideos = filteredVideos.filter((v) => v.column === colNum);

                return (
                  <div key={colNum} className="flex flex-col gap-3 sm:gap-4">
                    {columnVideos.map((item, idx) => {
                      const isLiked = Boolean(likedVideos[item.id]);

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 18, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => setActiveVideo(item)}
                          className="group relative w-full overflow-hidden rounded-sm sm:rounded-md bg-neutral-900 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-neutral-800/80"
                        >
                        {/* Video Poster Image with crisp aspect ratio styling */}
                        <div className={`w-full ${item.aspectRatioClass} relative overflow-hidden bg-neutral-900`}>
                          <img
                            src={item.url}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                          />

                          {/* Top Left: Video Source Badge */}
                          {item.isGalleryUpload ? (
                            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md border border-emerald-400/30">
                              <FolderOpen className="w-2.5 h-2.5" />
                              <span>Gallery Reel</span>
                            </div>
                          ) : isGoogleDriveUrl(item.videoUrl) ? (
                            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md border border-blue-400/30">
                              <Video className="w-2.5 h-2.5" />
                              <span>Drive Stream</span>
                            </div>
                          ) : null}

                          {/* Video Duration Badge Top Right */}
                          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20 shadow-md">
                            <Play className="w-3 h-3 fill-white text-white" />
                            <span>{item.duration}</span>
                          </div>

                          {/* Minimalist Hover Vignette Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <span className="px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <Video className="w-3 h-3 text-white" />
                                <span>{item.category}</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                {item.isCustom && isAdminAuthenticated && (
                                  <button
                                    onClick={(e) => handleDeleteCustomVideo(item.id, e)}
                                    className="p-2 rounded-full bg-red-600/70 hover:bg-red-600 text-white backdrop-blur-md transition-all cursor-pointer"
                                    title="Delete Video"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => toggleLike(item.id, e)}
                                  className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                                    isLiked
                                      ? 'bg-[#2563EB] text-white'
                                      : 'bg-black/50 text-white hover:bg-[#2563EB]'
                                  }`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                                </button>
                              </div>
                            </div>

                            {/* Center Play Button Icon on Hover */}
                            <div className="self-center p-3.5 rounded-full bg-[#2563EB] text-white shadow-2xl transform scale-90 group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 fill-white ml-0.5" />
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-white font-mono font-bold text-sm tracking-tight leading-snug">
                                {item.title}
                              </h3>
                              <p className="text-neutral-300 text-xs font-sans line-clamp-1">
                                {item.caption}
                              </p>
                              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-white/20">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#2563EB]" />
                                  {item.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-[#2563EB]" />
                                  {item.views.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}

          </motion.div>
        </AnimatePresence>

        </div>

      </main>

      {/* Footer of Videography Gallery with Admin Access Icon */}
      <footer className="mt-12 sm:mt-16 border-t border-neutral-900/90 bg-[#060608]/80 backdrop-blur-md py-6 sm:py-8 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="tracking-wider uppercase text-[11px] text-neutral-400">
              MUSHFIQ ARCHIVE • CINEMATIC & COMMERCIAL VIDEOGRAPHY
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">{filteredVideos.length} REELS AVAILABLE</span>
            <span className="text-neutral-800">|</span>

            {/* Admin Lock / Google Drive Management Icon in Footer */}
            <button
              onClick={() => setShowAdminModal(true)}
              className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80 hover:border-blue-500/50 transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              title={isAdminAuthenticated ? "Owner Admin Active • Manage Google Drive Videos" : "Owner Admin Access (Requires ID & Password)"}
              aria-label="Admin Access"
            >
              {isAdminAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-[11px] font-bold text-blue-400 tracking-wider">ADMIN MODE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition-colors" />
                  <span className="text-[11px] tracking-wider text-neutral-400 group-hover:text-white">ADMIN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Lightbox Inspector Overlay when a video item card is clicked */}
      <AnimatePresence>
        {activeVideo && (() => {
          const driveId = extractGoogleDriveId(activeVideo.videoUrl);

          return (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 md:p-10">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveVideo(null)}
                className="fixed inset-0 bg-black/95 backdrop-blur-2xl"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative max-w-5xl w-full max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col lg:flex-row my-auto text-white"
              >
                {/* Video Player Viewport */}
                <div className="relative flex-1 bg-black flex items-center justify-center p-2 sm:p-4 min-h-[340px] lg:min-h-[520px]">
                  {driveId ? (
                    <div className="relative w-full h-full min-h-[340px] lg:min-h-[520px] flex items-center justify-center bg-black">
                      <iframe
                        src={`https://drive.google.com/file/d/${driveId}/preview`}
                        className="w-full h-full min-h-[340px] lg:min-h-[520px] rounded-lg border-0 bg-black shadow-2xl"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        title={activeVideo.title}
                      />
                    </div>
                  ) : (
                    <video
                      src={activeVideo.videoUrl}
                      poster={activeVideo.url}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                    />
                  )}

                  {/* Close Overlay Icon Mobile */}
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-[#2563EB] text-white backdrop-blur-md transition-colors cursor-pointer lg:hidden z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sidebar Video Details */}
                <div className="w-full lg:w-80 p-6 lg:p-8 bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#2563EB] text-xs font-mono font-bold uppercase flex items-center gap-1.5 w-fit">
                          <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>{activeVideo.category}</span>
                        </span>
                        <h2 className="text-xl font-bold font-mono text-white mt-3 leading-tight">
                          {activeVideo.title}
                        </h2>
                      </div>

                      <button
                        onClick={() => setActiveVideo(null)}
                        className="hidden lg:flex p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {driveId && (
                      <div className="mb-4 p-2.5 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/35 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-blue-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          Drive Preview
                        </span>
                        <a
                          href={`https://drive.google.com/file/d/${driveId}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-blue-400 hover:text-white underline flex items-center gap-1"
                        >
                          Open in Drive <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6">
                      "{activeVideo.caption}"
                    </p>

                    <div className="space-y-3 pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#2563EB]" />
                        <span>{activeVideo.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#2563EB]" />
                        <span>{activeVideo.camera} • {activeVideo.lens}</span>
                      </div>

                      <div className="text-[11px] text-neutral-500 pl-6">
                        {activeVideo.settings}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                        <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{activeVideo.views.toLocaleString()} VIEWS • {activeVideo.duration}</span>
                      </div>

                      <div className="pt-2 text-[11px] text-neutral-500">
                        {activeVideo.year}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={(e) => toggleLike(activeVideo.id, e)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-colors cursor-pointer ${
                        likedVideos[activeVideo.id]
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedVideos[activeVideo.id] ? 'fill-white' : ''}`} />
                      <span>{likedVideos[activeVideo.id] ? 'LIKED' : 'LIKE'}</span>
                    </button>

                    <span className="text-[10px] font-mono text-neutral-500">
                      MUSHFIQ ARCHIVE
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Add Google Drive Video Modal */}
      <AddGoogleDriveVideoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddVideo={handleAddVideo}
        existingCount={allVideos.length}
      />

      {/* Admin Authentication & Control Modal */}
      <AdminAuthModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onOpenAddVideoModal={() => setShowAddModal(true)}
        customVideos={customVideos}
        onDeleteCustomVideo={handleDeleteCustomVideo}
        onSelectVideo={(v) => setActiveVideo(v)}
        isAuthenticated={isAdminAuthenticated}
        setIsAuthenticated={setIsAdminAuthenticated}
      />
    </motion.div>
  );
}

export default VideoGalleryPage;
