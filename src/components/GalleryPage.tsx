import React, { useState, useEffect, useRef, useCallback, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Heart, Share2, Sparkles, Layers, Palette, Check, Camera, Download, MapPin, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Video, Play } from 'lucide-react';
import { videography } from '../config/site';
import RegeneratedImage from '../assets/images/regenerated_image_1786114032574.webp'; 
import RegeneratedImage2 from '../assets/images/regenerated_image_1786192879031.jpg'; 
import FortKochi from '../assets/images/FortKochi.jpg';
import PostTruthImg from '../assets/images/regenerated_image_1787832022914.jpg';
import ProphetYaqoobImg from '../assets/images/regenerated_image_1787832024208.jpg';
import Night from '../assets/images/Night.jpg';
import Horse from '../assets/images/Horse.jpg';
import Dog from '../assets/images/Dog.jpg';
import House from '../assets/images/House.jpg';
import RegeneratedImage6 from '../assets/images/regenerated_image_1786192953982.jpg';
import EditorialImg from '../assets/images/regenerated_image_1787834708404.jpg';
import SunlitShadowsImg from '../assets/images/regenerated_image_1787837850773.jpg';
import YellowCourtyardImg from '../assets/images/regenerated_image_1787837959046.jpg';
import NeonMotionImg from '../assets/images/regenerated_image_1787838076486.jpg';
import MonochromeBotanicalImg from '../assets/images/regenerated_image_1787838078346.jpg';
import ForestLightImg from '../assets/images/regenerated_image_1787839186720.jpg';
import MusicFestImg from '../assets/images/regenerated_image_1787839188725.jpg';
import AbstractGeometricImg from '../assets/images/regenerated_image_1787840133505.jpg';
import UploadedImg1 from '../assets/images/regenerated_image_1787832278363.jpg';
import UploadedImg2 from '../assets/images/regenerated_image_1787832279801.jpg';
import UploadedImg3 from '../assets/images/regenerated_image_1787832281218.jpg';
import UploadedImg4 from '../assets/images/regenerated_image_1787832283145.jpg';
import UploadedImg5 from '../assets/images/regenerated_image_1787832284639.jpg';
import UploadedImg6 from '../assets/images/regenerated_image_1787832286039.jpg';
import UploadedImg7 from '../assets/images/regenerated_image_1787807967477.jpg';
import UploadedImg8 from '../assets/images/regenerated_image_1786113837883.jpg';
import UploadedImg9 from '../assets/images/regenerated_image_1787840681000.jpg';
import UploadedImg10 from '../assets/images/regenerated_image_1787840682571.jpg';
import UploadedImg11 from '../assets/images/regenerated_image_1787807484045.jpg';
import UploadedImg12 from '../assets/images/regenerated_image_1787841584292.webp';
import UploadedImg13 from '../assets/images/regenerated_image_1787913915768.jpg';
import PosterDesign1 from '../assets/images/poster_design_1.jpg';
import PosterDesign2 from '../assets/images/poster_design_2.jpg';
import PosterDesign3 from '../assets/images/poster_design_3.jpg';
import PosterDesign4 from '../assets/images/poster_design_4.jpg';
import PosterDesign5 from '../assets/images/poster_design_5.jpg';
import PosterDesign6 from '../assets/images/poster_design_6.jpg';
import PosterDesign7 from '../assets/images/poster_design_7.jpg';
import PosterDesign8 from '../assets/images/poster_design_8.jpg';
import PosterDesign9 from '../assets/images/poster_design_9.jpg';
import PosterDesign10 from '../assets/images/poster_design_10.jpg';

interface GalleryPageProps {
  onClose: () => void;
  initialCategory?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Photography' | 'Book Cover Design' | 'Photo Editing' | 'Videography';
  url: string;
  videoUrl?: string;
  caption: string;
  clientOrEvent?: string;
  tools?: string;
  year?: string;
  badge?: string;
}

// Curated works with balanced items across all categories
export const galleryGridPhotos: GalleryItem[] = [
  // ================= PHOTOGRAPHY & BOOK COVERS =================
  {
    id: "gal-photo-2",
    title: "Post-Truth",
    category: "Book Cover Design",
    url: PostTruthImg,
    caption: "Cover Design",
    clientOrEvent: "Cover Design",
    tools: "Fujifilm X-T5 • 35mm f/2.0",
    year: "2025 Archive",
    badge: "Book Cover"
  },
  {
    id: "gal-photo-1",
    title: "Prophet Ya'qoob",
    category: "Book Cover Design",
    url: ProphetYaqoobImg,
    caption: "Cover Design",
    clientOrEvent: "Cover Design",
    tools: "Sony A7IV • 85mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Book Cover"
  },
  {
    id: "gal-photo-3",
    title: "Captured Moments",
    category: "Photography",
    url: RegeneratedImage,
    caption: "Old Town Square",
    clientOrEvent: "Old Town Square",
    tools: "Sony A7IV • 35mm f/1.4 GM",
    year: "2025 Archive",
    badge: "Atmospheric"
  },
  {
    id: "gal-photo-4",
    title: "The Ship",
    category: "Photography",
    url: FortKochi,
    caption: "Captured in Fort Kochi",
    clientOrEvent: "Captured in Fort Kochi",
    tools: "Sony A7IV • 24-70mm f/2.8 GM",
    year: "2026 Archive",
    badge: "Fort Kochi"
  },
  {
    id: "gal-photo-5",
    title: "Wild Horse",
    category: "Photography",
    url: Horse,
    caption: "Captured in Kodaikanal",
    clientOrEvent: "Captured in Kodaikanal",
    tools: "Sony A7IV • 70-200mm f/2.8 GM",
    year: "2026 Archive",
    badge: "Wildlife"
  },
  {
    id: "gal-photo-6",
    title: "Wheel of Lights",
    category: "Photography",
    url: Night,
    caption: "Captured in Kozhikode",
    clientOrEvent: "Captured in Kozhikode",
    tools: "Sony A7IV • 50mm f/1.2 GM",
    year: "2026 Archive",
    badge: "Night Lights"
  },
  {
    id: "gal-photo-7",
    title: "Dog",
    category: "Photography",
    url: Dog,
    caption: "Captured in Kodaikanal",
    clientOrEvent: "Captured in Kodaikanal",
    tools: "Sony A7IV • 85mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Candid"
  },
  {
    id: "gal-photo-11",
    title: "Jew Town",
    category: "Photography",
    url: RegeneratedImage6,
    caption: "Captured in Fort Kochi",
    clientOrEvent: "Captured in Fort Kochi",
    tools: "Fujifilm X-T5 • 50-140mm",
    year: "2026 Archive",
    badge: "Jew Town"
  },

  // ================= PHOTO EDITING & CAPTURES =================
  {
    id: "gal-edit-1",
    title: "Mysore Stories",
    category: "Photography",
    url: EditorialImg,
    caption: "Captured in Mysore.",
    clientOrEvent: "Captured in Mysore",
    tools: "Photoshop • Capture One",
    year: "2026",
    badge: "Mysore"
  },
  {
    id: "gal-edit-2",
    title: "Travel Memories",
    category: "Photography",
    url: SunlitShadowsImg,
    caption: "Captured in Mysore.",
    clientOrEvent: "Captured in Mysore",
    tools: "Lightroom Classic",
    year: "2025",
    badge: "Mysore"
  },
  {
    id: "gal-edit-3",
    title: "Railway Moments",
    category: "Photography",
    url: YellowCourtyardImg,
    caption: "Captured at Shornur Railway Station",
    clientOrEvent: "Captured at Shornur Railway Station",
    tools: "Photoshop • Camera Raw",
    year: "2026",
    badge: "Shornur"
  },
  {
    id: "gal-edit-4",
    title: "Hilltop Moments",
    category: "Photography",
    url: NeonMotionImg,
    caption: "Captured in Kodaikanal",
    clientOrEvent: "Captured in Kodaikanal",
    tools: "Lightroom • Photoshop",
    year: "2025",
    badge: "Kodaikanal"
  },
  {
    id: "gal-edit-5",
    title: "Kodaikanal Memories",
    category: "Photography",
    url: MonochromeBotanicalImg,
    caption: "Captured in Kodaikanal",
    clientOrEvent: "Captured in Kodaikanal",
    tools: "Lightroom Classic",
    year: "2026",
    badge: "Kodaikanal"
  },
  {
    id: "gal-edit-6",
    title: "Kodaikanal Memories",
    category: "Photography",
    url: ForestLightImg,
    caption: "Captured in Kodaikanal",
    clientOrEvent: "Captured in Kodaikanal",
    tools: "Photoshop • Camera Raw",
    year: "2025",
    badge: "Kodaikanal"
  },

  // ================= POSTER DESIGNING =================
  {
    id: "gal-poster-1",
    title: "Kodaikanal Memories",
    category: "Photography",
    url: MusicFestImg,
    caption: "Captured in Kodaikanal",
    clientOrEvent: "Captured in Kodaikanal",
    tools: "Illustrator • Photoshop",
    year: "2025",
    badge: "Kodaikanal"
  },
  {
    id: "gal-poster-2",
    title: "Meelad-Un-Nabi",
    category: "Book Cover Design",
    url: AbstractGeometricImg,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • InDesign",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-3",
    title: "Eid al-Adha",
    category: "Book Cover Design",
    url: UploadedImg1,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-4",
    title: "Wedding invitation Poster",
    category: "Book Cover Design",
    url: UploadedImg2,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "InDesign • Illustrator",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-5",
    title: "Welcome Baby",
    category: "Book Cover Design",
    url: UploadedImg3,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Photoshop • Lightroom",
    year: "2025",
    badge: "Poster"
  },
  {
    id: "gal-poster-6",
    title: "Moulid Majlis",
    category: "Book Cover Design",
    url: UploadedImg4,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Figma",
    year: "2026",
    badge: "Poster"
  },

  // ================= EXPANDED GALLERY WORKS =================
  {
    id: "gal-photo-new-1",
    title: "Majlisunnoor",
    category: "Book Cover Design",
    url: House,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Sony A7IV • 24mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-2",
    title: "Kerala Day Program",
    category: "Book Cover Design",
    url: UploadedImg5,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Fujifilm X-T5 • 35mm f/1.4",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-3",
    title: "Pista Water Poster",
    category: "Book Cover Design",
    url: UploadedImg6,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Sony A7IV • 85mm f/1.8",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-4",
    title: "Voice of Campus",
    category: "Book Cover Design",
    url: UploadedImg7,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Sony A7IV • 50mm f/1.4",
    year: "2025 Archive",
    badge: "Poster"
  },
  {
    id: "gal-edit-new-1",
    title: "Watermelon Poster",
    category: "Book Cover Design",
    url: UploadedImg8,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Lightroom Classic • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-edit-new-2",
    title: "Painting Competition Poster",
    category: "Book Cover Design",
    url: UploadedImg9,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Lightroom Classic",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-7",
    title: "Collage Program",
    category: "Book Cover Design",
    url: UploadedImg10,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "InDesign • Illustrator",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-5",
    title: "Program Hunt",
    category: "Book Cover Design",
    url: UploadedImg11,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Sony A7IV • 70-200mm f/2.8 GM",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-6",
    title: "Kochi Metro",
    category: "Photography",
    url: UploadedImg12,
    caption: "Kochi, Kerala",
    clientOrEvent: "Kochi, Kerala",
    tools: "Sony A7IV • 35mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Kochi"
  },
  {
    id: "gal-photo-new-7",
    title: "Monsoon Mood",
    category: "Photography",
    url: UploadedImg13,
    caption: "Capturing the serene rainy atmosphere and lush greenery of Malappuram, Kerala.",
    clientOrEvent: "malappuram,kerala",
    tools: "Sony A7IV • 24-70mm f/2.8 GM",
    year: "2026 Archive",
    badge: "Kerala"
  },
  {
    id: "gal-poster-new-8",
    title: "Meelad Program",
    category: "Book Cover Design",
    url: PosterDesign1,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-9",
    title: "Meelad Fest 26",
    category: "Book Cover Design",
    url: PosterDesign2,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Photoshop • InDesign",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-10",
    title: "Wedding Wishes",
    category: "Book Cover Design",
    url: PosterDesign3,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Figma",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-11",
    title: "Family Onam",
    category: "Book Cover Design",
    url: PosterDesign4,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-12",
    title: "Family Onam",
    category: "Book Cover Design",
    url: PosterDesign5,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "InDesign • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-13",
    title: "Family Onam",
    category: "Book Cover Design",
    url: PosterDesign6,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Lightroom",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-14",
    title: "Mandhi Poster",
    category: "Book Cover Design",
    url: PosterDesign7,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Photoshop • Illustrator",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-15",
    title: "Gandhi Jayanthi Poster",
    category: "Book Cover Design",
    url: PosterDesign8,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-16",
    title: "Avil Milk Poster",
    category: "Book Cover Design",
    url: PosterDesign9,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Photoshop • InDesign",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-17",
    title: "Sabaq-Ul-Sibaq",
    category: "Book Cover Design",
    url: PosterDesign10,
    caption: "Book Cover Design",
    clientOrEvent: "Book Cover Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-workshop-1",
    title: "Arabic Literature Workshop",
    category: "Book Cover Design",
    url: "/images/arabic-literature.jpg",
    caption: "Poster Designing",
    clientOrEvent: "Poster Designing",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-workshop-2",
    title: "Urdu Literature Workshop",
    category: "Book Cover Design",
    url: "/images/urdu-literature.jpg",
    caption: "Poster Designing",
    clientOrEvent: "Poster Designing",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-workshop-3",
    title: "Leadership Workshop",
    category: "Book Cover Design",
    url: "/images/leadership-workshop.jpg",
    caption: "Poster Designing",
    clientOrEvent: "Poster Designing",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-workshop-4",
    title: "Multilingual Workshop",
    category: "Book Cover Design",
    url: "/images/multilingual-workshop.jpg",
    caption: "Poster Designing",
    clientOrEvent: "Poster Designing",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  // ================= VIDEOGRAPHY =================
  ...videography.map((v) => ({
    id: `gal-${v.id}`,
    title: v.title,
    category: 'Videography' as const,
    url: v.posterUrl,
    videoUrl: v.videoUrl,
    caption: v.caption,
    clientOrEvent: v.location,
    tools: `${v.camera} • ${v.lens}`,
    year: v.year,
    badge: v.category
  }))
];

const categories = [
  { id: 'ALL', label: 'All Works', icon: Sparkles },
  { id: 'PHOTOGRAPHY', label: 'Photography', icon: Camera },
  { id: 'BOOK COVER DESIGN', label: 'Poster Designs', icon: Layers },
  { id: 'VIDEOGRAPHY', label: 'Videography', icon: Video },
];

interface GalleryCardProps {
  item: GalleryItem;
  priority?: boolean;
  onSelect: (item: GalleryItem) => void;
}

const GalleryCard = React.memo(function GalleryCard({ item, priority = false, onSelect }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (item.videoUrl) {
      setIsHovered(true);
    }
  }, [item.videoUrl]);

  const handleMouseLeave = useCallback(() => {
    if (item.videoUrl) {
      setIsHovered(false);
    }
  }, [item.videoUrl]);

  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col p-1.5 pb-2 sm:p-3 sm:pb-4 rounded-[14px] sm:rounded-[24px] md:rounded-[28px] bg-[#111216]/95 border sm:border-2 border-[#2563EB]/70 hover:border-[#3B82F6] shadow-[0_6px_20px_rgba(0,0,0,0.7),0_0_12px_rgba(37,99,235,0.15)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(37,99,235,0.35)] transition-all duration-300 active:scale-[0.97] cursor-pointer animate-fadeIn transform-gpu"
    >
      {/* Image / Video Container with Rounded Inside */}
      <div className="relative w-full aspect-[4/5] rounded-[10px] sm:rounded-[18px] md:rounded-[20px] overflow-hidden bg-neutral-950 border border-neutral-800/60 shadow-inner">
        {/* Base Poster / Photo */}
        <img
          src={item.url}
          alt={item.title}
          width={400}
          height={500}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
            isHovered && item.videoUrl ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Auto Preview Video — mounted only on intentional hover so gallery open triggers zero video downloads */}
        {item.videoUrl && isHovered && (
          <video
            src={item.videoUrl}
            poster={item.url}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none opacity-100 scale-105"
          />
        )}

        {/* Play Icon Badge */}
        {item.category === 'Videography' && (
          <div className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/75 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg transition-all duration-200 ${
            isHovered ? 'bg-[#2563EB] border-[#2563EB] scale-110' : 'group-hover:bg-[#2563EB] group-hover:border-[#2563EB]'
          }`}>
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white ml-0.5" />
          </div>
        )}
      </div>

      {/* Centered Typography Matching Reference Card */}
      <div className="mt-1.5 sm:mt-3 text-center px-0.5 sm:px-1">
        <h3 className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-blue-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 font-medium mt-0.5 line-clamp-2">
          {item.caption || item.clientOrEvent || item.category}
        </p>
      </div>
    </div>
  );
});

const INITIAL_BATCH_SIZE = 20;

export function GalleryPage({ onClose, initialCategory = 'ALL' }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory.toUpperCase());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [animKey, setAnimKey] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async (url: string, title: string, e: React.MouseEvent, isVideo = false) => {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    const ext = isVideo ? 'mp4' : 'jpg';
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'media'}.${ext}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  const handleCategoryClick = useCallback((catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(INITIAL_BATCH_SIZE);
    setAnimKey((prev) => prev + 1);
  }, []);

  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [deferredSearch]);

  const filteredItems = useMemo(() => {
    const q = deferredSearch.toLowerCase().trim();
    return galleryGridPhotos.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' || item.category.toUpperCase() === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.clientOrEvent && item.clientOrEvent.toLowerCase().includes(q)) ||
        (item.caption && item.caption.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.tools && item.tools.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, deferredSearch]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const activeIndex = activeItem ? filteredItems.findIndex((p) => p.id === activeItem.id) : -1;

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeItem || filteredItems.length === 0) return;
    const currentIdx = filteredItems.findIndex((p) => p.id === activeItem.id);
    const prevIdx = (currentIdx - 1 + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[prevIdx]);
  }, [activeItem, filteredItems]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeItem || filteredItems.length === 0) return;
    const currentIdx = filteredItems.findIndex((p) => p.id === activeItem.id);
    const nextIdx = (currentIdx + 1) % filteredItems.length;
    setActiveItem(filteredItems[nextIdx]);
  }, [activeItem, filteredItems]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Progressive viewport-based loading for large galleries
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || visibleCount >= filteredItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + INITIAL_BATCH_SIZE, filteredItems.length));
        }
      },
      { root: containerRef.current, rootMargin: '400px 0px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredItems.length]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeItem) {
          setActiveItem(null);
        } else {
          onClose();
        }
      } else if (activeItem) {
        if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeItem, onClose, handlePrev, handleNext]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyLink = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      ref={containerRef}
      data-lenis-prevent
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] bg-[#090A0F] text-neutral-100 overflow-y-auto overscroll-contain touch-pan-y outline-none font-sans selection:bg-[#2563EB] selection:text-white"
    >
      {/* Background Ambient Glow (Pure GPU Radial Gradients instead of 140px CSS blur filters) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ contain: 'strict' }}>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] transform-gpu" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.10)_0%,transparent_70%)] transform-gpu" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/95 backdrop-blur-xl border-b border-white/[0.08] px-2.5 sm:px-4 lg:px-8 py-2 sm:py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.85)] relative">
        {/* Subtle Top Ambient Gradient Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2563EB]/40 via-purple-500/30 to-transparent pointer-events-none" />
        
        {/* Left: Brand / Return to Portfolio */}
        <div className="flex items-center justify-between lg:justify-start gap-2">
          <button
            onClick={onClose}
            className="group relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.05] hover:bg-[#2563EB] text-white border border-white/10 hover:border-blue-400/40 text-[11px] sm:text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 overflow-hidden shrink-0"
          >
            <ArrowLeft className="w-3 h-3 transition-transform duration-300 group-hover:-translate-x-1 text-blue-400 group-hover:text-white" />
            <span className="font-medium tracking-wide">Back</span>
            <span className="hidden sm:inline font-medium tracking-wide">to Portfolio</span>
          </button>

          <div className="hidden sm:block h-3.5 w-[1px] bg-white/15" />

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
            <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text truncate">
              Photography & Videography
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/25 shadow-[0_0_12px_rgba(37,99,235,0.18)] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {filteredItems.length} {filteredItems.length === 1 ? 'WORK' : 'WORKS'}
            </span>
          </div>
        </div>

        {/* Center: Compact Professional Search Bar */}
        <div className="w-full lg:max-w-xs xl:max-w-sm relative">
          <div className="relative flex items-center w-full group">
            <div className="absolute left-3 pointer-events-none flex items-center justify-center text-neutral-400 group-focus-within:text-blue-400 transition-colors duration-200">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search works..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-900 focus:bg-neutral-950 text-[11px] sm:text-xs text-white placeholder-neutral-500 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right / Compact Category Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-neutral-950/80 border border-neutral-800 backdrop-blur-xl overflow-x-auto touch-pan-x pb-1 lg:pb-0 no-scrollbar shadow-inner -mx-1 px-1 sm:mx-0 sm:px-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`relative px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1 z-10 select-none shrink-0 ${
                  isSelected
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.45)] border border-blue-400/30 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Icon className={`w-3 h-3 transition-colors duration-200 ${isSelected ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-neutral-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Gallery Area - Orderly Responsive Grid */}
      <main className="max-w-[1540px] mx-auto px-2 xs:px-3 sm:px-6 md:px-8 py-4 sm:py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${animKey}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 items-stretch"
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
                  {searchQuery ? <Search className="w-6 h-6 sm:w-7 sm:h-7" /> : <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {searchQuery ? `No works matching "${searchQuery}"` : 'No works in this category'}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-sm">
                  {searchQuery
                    ? 'Try searching with different keywords, location names, or clear the search filter.'
                    : 'All photos and posters are presented in the All Works gallery.'}
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
                    View All Works
                  </button>
                </div>
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  priority={idx < 10}
                  onSelect={setActiveItem}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Lightbox Modal when a work is selected */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Left Scroll / Navigation Arrow Button */}
            {filteredItems.length > 1 && (
              <button
                onClick={handlePrev}
                className="hidden sm:flex absolute left-4 sm:left-6 md:left-12 lg:left-24 z-[160] p-3.5 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                aria-label="Previous image"
                title="Previous image (Left Arrow key)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Scroll / Navigation Arrow Button */}
            {filteredItems.length > 1 && (
              <button
                onClick={handleNext}
                className="hidden sm:flex absolute right-4 sm:right-6 md:right-12 lg:right-24 z-[160] p-3.5 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md cursor-pointer border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                aria-label="Next image"
                title="Next image (Right Arrow key)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative max-w-[460px] sm:max-w-[500px] w-full bg-[#121316]/95 border border-white/15 rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(37,99,235,0.15)] backdrop-blur-2xl z-10 flex flex-col my-auto text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button at top right */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 hover:bg-white text-white hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 shadow-lg cursor-pointer backdrop-blur-md border border-white/15"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Inner Photo / Video Area */}
              <div className="relative w-full h-[400px] sm:h-[480px] bg-[#181920] border border-white/10 rounded-[24px] overflow-hidden flex items-center justify-center shadow-inner group">
                {/* Ambient Blurred Fill */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={activeItem.url}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover blur-2xl scale-125 opacity-35 select-none"
                  />
                  <div className="absolute inset-0 bg-neutral-950/40" />
                </div>

                {/* Main Photo / Video Media - Fitted to Height */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-2 rounded-[20px] overflow-hidden">
                  {activeItem.videoUrl ? (
                    activeItem.videoUrl.includes('pinterest.com') ? (
                      <iframe
                        src={activeItem.videoUrl}
                        height="714"
                        width="345"
                        frameBorder="0"
                        scrolling="no"
                        title={activeItem.title}
                        className="h-full w-auto max-w-full rounded-[18px] shadow-2xl"
                      />
                    ) : (
                      <video
                        key={activeItem.videoUrl}
                        src={activeItem.videoUrl}
                        poster={activeItem.url}
                        controls
                        autoPlay
                        playsInline
                        loop
                        className="h-full w-auto max-w-full object-contain rounded-[18px] select-none block shadow-2xl"
                      />
                    )
                  ) : (
                    <img
                      src={activeItem.url}
                      alt={activeItem.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-auto max-w-full object-contain rounded-[18px] select-none block shadow-2xl transition-all duration-300"
                    />
                  )}
                </div>

                {/* Mobile In-card Left & Right Scroll Arrows */}
                {filteredItems.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="sm:hidden absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 hover:bg-white text-white hover:text-black backdrop-blur-md transition-all active:scale-90 border border-white/15 cursor-pointer shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleNext}
                      className="sm:hidden absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/75 hover:bg-white text-white hover:text-black backdrop-blur-md transition-all active:scale-90 border border-white/15 cursor-pointer shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Download Pill Button */}
                <button
                  onClick={(e) => handleDownload(activeItem.videoUrl || activeItem.url, activeItem.title, e, !!activeItem.videoUrl)}
                  title={activeItem.videoUrl ? 'Download video (MP4)' : 'Download photo (JPG)'}
                  className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-white text-neutral-200 hover:text-black border border-white/15 backdrop-blur-md text-xs font-sans font-medium transition-all duration-200 shadow-lg active:scale-95 cursor-pointer group"
                >
                  {downloading ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5] animate-bounce" />
                      <span>{activeItem.videoUrl ? 'Downloading...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                      <span>{activeItem.videoUrl ? 'Download Video' : 'Download'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Centered Typography: Title & Subtitle */}
              <div className="mt-4 px-2 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-0.5 truncate">
                  {activeItem.caption || activeItem.clientOrEvent || activeItem.category}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default GalleryPage;
