import React, { useState, useEffect, useRef, useCallback, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Heart, Share2, Sparkles, Layers, Palette, Check, Camera, Download, MapPin, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Plus, Edit3, Trash2, MoreVertical, Upload, Unlock, Lock, Shield, CheckCircle2, RotateCcw, Save, AlertTriangle, Tag } from 'lucide-react';
import { AdminAuthModal } from './AdminAuthModal';
import { fetchPhotographyCatalogFromFirebase, savePhotographyCatalogToFirebase, subscribeToPhotographyCatalog } from '../utils/firebase';

import RegeneratedImage from '../assets/images/regenerated_image_1786114032574.png'; 
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
import UploadedImg12 from '../assets/images/regenerated_image_1787841584292.png';
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
  category: string;
  url: string;
  caption: string;
  clientOrEvent?: string;
  tools?: string;
  year?: string;
  badge?: string;
  isCustom?: boolean;
}

export const galleryGridPhotos: GalleryItem[] = [
  {
    id: "gal-photo-2",
    title: "Post-truth",
    category: "Poster Designing",
    url: PostTruthImg,
    caption: "Book cover design exploring contemporary themes and visual storytelling.",
    clientOrEvent: "Book cover Design",
    tools: "Fujifilm X-T5 • 35mm f/2.0",
    year: "2025 Archive",
    badge: "Book Cover"
  },
  {
    id: "gal-photo-1",
    title: "Prophet Ya'qoob",
    category: "Poster Designing",
    url: ProphetYaqoobImg,
    caption: "Book cover design with atmospheric tones and thematic typography.",
    clientOrEvent: "Book cover Design",
    tools: "Sony A7IV • 85mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Book Cover"
  },
  {
    id: "gal-photo-3",
    title: "Captured Moments",
    category: "Photography",
    url: RegeneratedImage,
    caption: "Gothic architecture emerging through dramatic fog and atmospheric lighting.",
    clientOrEvent: "Frames by Mushfii",
    tools: "Sony A7IV • 35mm f/1.4 GM",
    year: "2025 Archive",
    badge: "Atmospheric"
  },
  {
    id: "gal-photo-4",
    title: "The Ship",
    category: "Photography",
    url: FortKochi,
    caption: "Vessel anchored along the historic coastline of Fort Kochi.",
    clientOrEvent: "Fort Kochi, Kerala",
    tools: "Sony A7IV • 24-70mm f/2.8 GM",
    year: "2026 Archive",
    badge: "Fort Kochi"
  },
  {
    id: "gal-photo-5",
    title: "Wild Horse",
    category: "Photography",
    url: Horse,
    caption: "Wild horse grazing in the misty landscapes of Kodaikanal.",
    clientOrEvent: "Kodaikanal, Tamil Nadu",
    tools: "Sony A7IV • 70-200mm f/2.8 GM",
    year: "2026 Archive",
    badge: "Wildlife"
  },
  {
    id: "gal-photo-6",
    title: "Wheel of Lights",
    category: "Photography",
    url: Night,
    caption: "Night perspectives and festival lights in Kozhikode.",
    clientOrEvent: "Kozhikode, Kerala",
    tools: "Sony A7IV • 50mm f/1.2 GM",
    year: "2026 Archive",
    badge: "Night Lights"
  },
  {
    id: "gal-photo-7",
    title: "Dog",
    category: "Photography",
    url: Dog,
    caption: "Intimate candid portrait capturing golden sunlight and gentle spirit.",
    clientOrEvent: "Kerala, India",
    tools: "Sony A7IV • 85mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Candid"
  },
  {
    id: "gal-photo-11",
    title: "Jew Town",
    category: "Photography",
    url: RegeneratedImage6,
    caption: "Atmospheric perspectives and heritage alleys in Fort Kochi.",
    clientOrEvent: "Fort Kochi, Kerala",
    tools: "Fujifilm X-T5 • 50-140mm",
    year: "2026 Archive",
    badge: "Jew Town"
  },
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
    category: "Poster Designing",
    url: AbstractGeometricImg,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • InDesign",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-3",
    title: "Eid al-Adha",
    category: "Poster Designing",
    url: UploadedImg1,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-4",
    title: "Wedding invitation Poster",
    category: "Poster Designing",
    url: UploadedImg2,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "InDesign • Illustrator",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-5",
    title: "Welcome Baby",
    category: "Poster Designing",
    url: UploadedImg3,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Photoshop • Lightroom",
    year: "2025",
    badge: "Poster"
  },
  {
    id: "gal-poster-6",
    title: "Moulid Majlis",
    category: "Poster Designing",
    url: UploadedImg4,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Figma",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-1",
    title: "Majlisunnoor",
    category: "Poster Designing",
    url: House,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Sony A7IV • 24mm f/1.4 GM",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-2",
    title: "Kerala Day Program",
    category: "Poster Designing",
    url: UploadedImg5,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Fujifilm X-T5 • 35mm f/1.4",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-3",
    title: "Pista Water Poster",
    category: "Poster Designing",
    url: UploadedImg6,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Sony A7IV • 85mm f/1.8",
    year: "2026 Archive",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-4",
    title: "Voice of Campus",
    category: "Poster Designing",
    url: UploadedImg7,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Sony A7IV • 50mm f/1.4",
    year: "2025 Archive",
    badge: "Poster"
  },
  {
    id: "gal-edit-new-1",
    title: "Watermelon Poster",
    category: "Poster Designing",
    url: UploadedImg8,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Lightroom Classic • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-edit-new-2",
    title: "Painting Competition Poster",
    category: "Poster Designing",
    url: UploadedImg9,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Lightroom Classic",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-7",
    title: "Collage Program",
    category: "Poster Designing",
    url: UploadedImg10,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "InDesign • Illustrator",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-photo-new-5",
    title: "Program Hunt",
    category: "Poster Designing",
    url: UploadedImg11,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
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
    category: "Poster Designing",
    url: PosterDesign1,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-9",
    title: "Meelad Fest 26",
    category: "Poster Designing",
    url: PosterDesign2,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Photoshop • InDesign",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-10",
    title: "Wedding Wishes",
    category: "Poster Designing",
    url: PosterDesign3,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Figma",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-11",
    title: "Family Onam",
    category: "Poster Designing",
    url: PosterDesign4,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-12",
    title: "Family Onam",
    category: "Poster Designing",
    url: PosterDesign5,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "InDesign • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-13",
    title: "Family Onam",
    category: "Poster Designing",
    url: PosterDesign6,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Lightroom",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-14",
    title: "Mandhi Poster",
    category: "Poster Designing",
    url: PosterDesign7,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Photoshop • Illustrator",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-15",
    title: "Gandhi Jayanthi Poster",
    category: "Poster Designing",
    url: PosterDesign8,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-16",
    title: "Avil Milk Poster",
    category: "Poster Designing",
    url: PosterDesign9,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Photoshop • InDesign",
    year: "2026",
    badge: "Poster"
  },
  {
    id: "gal-poster-new-17",
    title: "Sabaq-Ul-Sibaq",
    category: "Poster Designing",
    url: PosterDesign10,
    caption: "Poster Design",
    clientOrEvent: "Poster Design",
    tools: "Illustrator • Photoshop",
    year: "2026",
    badge: "Poster"
  }
];

const DEFAULT_PHOTO_CATEGORIES = ['ALL', 'PHOTOGRAPHY', 'POSTER DESIGNING'];
const PHOTO_STORAGE_KEY = 'mushfiq_custom_photos_catalog_v2';
const PHOTO_CATS_KEY = 'mushfiq_custom_photo_cats_v2';

export function GalleryPage({ onClose, initialCategory = 'ALL' }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory.toUpperCase());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [animKey, setAnimKey] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mushfiq_videography_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState<boolean>(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryItem | null>(null);
  const [openMenuPhotoId, setOpenMenuPhotoId] = useState<string | null>(null);
  const [saveToastMsg, setSaveToastMsg] = useState<string>('');

  // Categories and Catalog state
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PHOTO_CATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PHOTO_CATEGORIES;
  });

  const [catalogPhotos, setCatalogPhotos] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(PHOTO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return galleryGridPhotos;
  });

  // Saved Snapshots to detect unsaved changes (reset is ONLY available before saving changes)
  const [savedPhotosSnapshot, setSavedPhotosSnapshot] = useState<GalleryItem[]>(() => catalogPhotos);
  const [savedCategoriesSnapshot, setSavedCategoriesSnapshot] = useState<string[]>(() => categories);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  const hasUnsavedChanges = useMemo(() => {
    const savedPhotosSig = JSON.stringify(
      savedPhotosSnapshot.map((p) => ({ id: p.id, title: p.title, category: p.category, caption: p.caption }))
    );
    const currentPhotosSig = JSON.stringify(
      catalogPhotos.map((p) => ({ id: p.id, title: p.title, category: p.category, caption: p.caption }))
    );
    const savedCatsSig = JSON.stringify(savedCategoriesSnapshot);
    const currentCatsSig = JSON.stringify(categories);
    return savedPhotosSig !== currentPhotosSig || savedCatsSig !== currentCatsSig;
  }, [catalogPhotos, categories, savedPhotosSnapshot, savedCategoriesSnapshot]);

  const handleSaveAllChanges = () => {
    persistAndSync(catalogPhotos, categories);
    setSavedPhotosSnapshot(catalogPhotos);
    setSavedCategoriesSnapshot(categories);
    setSaveToastMsg('All photography reorderings, renames, categories & uploads saved successfully!');
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  const handleConfirmResetAll = () => {
    setCatalogPhotos(savedPhotosSnapshot);
    setCategories(savedCategoriesSnapshot);
    setShowResetConfirmModal(false);
    setSaveToastMsg('All unsaved edits and reorderings have been reset back to last saved state!');
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Category Manager Modal State & Handlers
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newCategoryName.trim().toUpperCase();
    if (!formatted) return;
    if (categories.some((c) => c.toUpperCase() === formatted)) {
      setSaveToastMsg(`Category "${formatted}" already exists!`);
      setTimeout(() => setSaveToastMsg(''), 3000);
      return;
    }
    const updated = [...categories, formatted];
    setCategories(updated);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    setSaveToastMsg(`Category "${formatted}" created! Click Save Changes to persist.`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  const handleDeleteCategory = (catToDelete: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (catToDelete.toUpperCase() === 'ALL') return;
    const updated = categories.filter((c) => c.toUpperCase() !== catToDelete.toUpperCase());
    setCategories(updated);
    if (selectedCategory === catToDelete.toUpperCase()) {
      setSelectedCategory('ALL');
    }
    setSaveToastMsg(`Category "${catToDelete}" removed! Click Save Changes to persist.`);
    setTimeout(() => setSaveToastMsg(''), 3500);
  };

  // Edit Form States
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editTools, setEditTools] = useState('');

  useEffect(() => {
    if (editingPhoto) {
      setEditTitle(editingPhoto.title || '');
      setEditCategory(editingPhoto.category || '');
      setEditCaption(editingPhoto.caption || '');
      setEditTools(editingPhoto.tools || '');
    }
  }, [editingPhoto]);

  // Add Photo Modal States
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('PHOTOGRAPHY');
  const [newCaption, setNewCaption] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreviewUrl, setNewPhotoPreviewUrl] = useState<string>('');
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const resUrl = evt.target.result as string;
          setNewPhotoPreviewUrl(resUrl);
          if (!newTitle) {
            setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync session auth
  useEffect(() => {
    const handleStorage = () => {
      try {
        const auth = sessionStorage.getItem('mushfiq_videography_admin_session') === 'true';
        setIsAuthenticated(auth);
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Firebase catalog sync
  useEffect(() => {
    fetchPhotographyCatalogFromFirebase().then((data) => {
      if (data && Array.isArray(data.photos) && data.photos.length > 0) {
        setCatalogPhotos(data.photos);
        localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(data.photos));
      }
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
        localStorage.setItem(PHOTO_CATS_KEY, JSON.stringify(data.categories));
      }
    });

    const unsubscribe = subscribeToPhotographyCatalog((data) => {
      if (data && Array.isArray(data.photos) && data.photos.length > 0) {
        setCatalogPhotos(data.photos);
        localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(data.photos));
      }
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
        localStorage.setItem(PHOTO_CATS_KEY, JSON.stringify(data.categories));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const persistAndSync = (photos: GalleryItem[], cats: string[]) => {
    try {
      localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(photos));
      localStorage.setItem(PHOTO_CATS_KEY, JSON.stringify(cats));
      savePhotographyCatalogToFirebase(photos, cats);
    } catch {}
  };

  const handleSavePhotoEdits = () => {
    if (!editingPhoto) return;
    const updated = {
      ...editingPhoto,
      title: editTitle.trim() || editingPhoto.title,
      category: editCategory.trim() || editingPhoto.category,
      caption: editCaption.trim(),
      tools: editTools.trim()
    };
    const newCatalog = catalogPhotos.map((p) => (p.id === updated.id ? updated : p));
    setCatalogPhotos(newCatalog);
    persistAndSync(newCatalog, categories);
    setEditingPhoto(null);
    setSaveToastMsg(`"${updated.title}" updated successfully!`);
    setTimeout(() => setSaveToastMsg(''), 3000);
  };

  const handleDeletePhoto = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newCatalog = catalogPhotos.filter((p) => p.id !== id);
    setCatalogPhotos(newCatalog);
    persistAndSync(newCatalog, categories);
    if (activeItem?.id === id) setActiveItem(null);
    setPhotoToDelete(null);
    setSaveToastMsg('Photo deleted successfully!');
    setTimeout(() => setSaveToastMsg(''), 3000);
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPhotoPreviewUrl) return;
    const newItem: GalleryItem = {
      id: `photo-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.toUpperCase(),
      url: newPhotoPreviewUrl,
      caption: newCaption.trim() || 'Custom added photography work',
      tools: 'Sony A7IV • Lightroom',
      year: '2026 Archive',
      badge: 'Custom',
      isCustom: true
    };
    const newCatalog = [newItem, ...catalogPhotos];
    setCatalogPhotos(newCatalog);

    let updatedCats = [...categories];
    if (!updatedCats.includes(newItem.category)) {
      updatedCats.push(newItem.category);
      setCategories(updatedCats);
    }

    persistAndSync(newCatalog, updatedCats);
    setShowAddPhotoModal(false);
    setNewTitle('');
    setNewPhotoFile(null);
    setNewPhotoPreviewUrl('');
    setNewCaption('');
    setSaveToastMsg(`"${newItem.title}" added successfully!`);
    setTimeout(() => setSaveToastMsg(''), 3000);
  };

  // Drag and drop reordering state
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<any>, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDraggedPhotoId(id);
  };

  const handleDragOver = (e: React.DragEvent<any>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPhotoId !== id) setDragOverPhotoId(id);
  };

  const handleDrop = (e: React.DragEvent<any>, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedPhotoId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) {
      setDraggedPhotoId(null);
      setDragOverPhotoId(null);
      return;
    }
    const fromIndex = catalogPhotos.findIndex((p) => p.id === sourceId);
    const toIndex = catalogPhotos.findIndex((p) => p.id === targetId);
    if (fromIndex !== -1 && toIndex !== -1) {
      const newArr = [...catalogPhotos];
      const [moved] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, moved);
      setCatalogPhotos(newArr);
      persistAndSync(newArr, categories);
      setSaveToastMsg('Gallery reordered and saved!');
      setTimeout(() => setSaveToastMsg(''), 3000);
    }
    setDraggedPhotoId(null);
    setDragOverPhotoId(null);
  };

  const handleDownload = async (url: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'photo'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'photo'}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => setDownloading(false), 1500);
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setAnimKey((prev) => prev + 1);
  };

  const deferredSearch = useDeferredValue(searchQuery);

  const filteredItems = useMemo(() => {
    const q = deferredSearch.toLowerCase().trim();
    return catalogPhotos.filter((item) => {
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
  }, [catalogPhotos, selectedCategory, deferredSearch]);

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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeItem) {
          setActiveItem(null);
        } else if (showAddPhotoModal) {
          setShowAddPhotoModal(false);
        } else if (editingPhoto) {
          setEditingPhoto(null);
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

    const handleWheel = (e: WheelEvent) => {
      if (activeItem || showAddPhotoModal || editingPhoto) return;
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
  }, [activeItem, showAddPhotoModal, editingPhoto, onClose, handlePrev, handleNext]);

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
      {/* Toast Notification */}
      {saveToastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-2.5 rounded-2xl bg-emerald-600/90 text-white font-bold text-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl border border-emerald-400/50 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{saveToastMsg}</span>
        </div>
      )}

      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-2xl border-b border-white/[0.08] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2563EB]/40 via-purple-500/30 to-transparent pointer-events-none" />
        
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
              Photography Gallery
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-sans font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/25 shadow-[0_0_12px_rgba(37,99,235,0.18)] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {filteredItems.length} {filteredItems.length === 1 ? 'WORK' : 'WORKS'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:max-w-md xl:max-w-lg relative">
          <div className="relative flex items-center w-full group">
            <div className="absolute left-3.5 pointer-events-none flex items-center justify-center text-neutral-400 group-focus-within:text-blue-400 transition-colors duration-200">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos by title, location, camera gear..."
              className="w-full pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-900 focus:bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-500 border border-neutral-800 hover:border-neutral-700 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories & Admin Cockpit Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-neutral-950/90 border border-white/10 backdrop-blur-2xl">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.toUpperCase();
              const isRemovable = cat.toUpperCase() !== 'ALL';
              return (
                <div key={cat} className="relative flex items-center group/cat">
                  <button
                    onClick={() => handleCategoryClick(cat.toUpperCase())}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap z-10 select-none flex items-center gap-1.5 ${
                      isSelected ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activePhotoCatPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-blue-400/40 -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span>{cat}</span>
                  </button>
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
          </div>

          {/* Admin Cockpit Toggle */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_22px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.85)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-400/40"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Upload Photo</span>
              </button>

              <button
                onClick={() => setShowAdminModal(true)}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-950/80 via-neutral-900/90 to-purple-950/80 border border-blue-400/50 text-blue-300 hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:border-blue-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <Unlock className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Active</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Admin Authentication Lock"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Cockpit Ribbon Bar */}
      {isAdminAuthenticated && (
        <div className="max-w-[1540px] mx-auto w-full px-3.5 sm:px-6 lg:px-8 pt-4">
          <div className="relative overflow-hidden px-4 py-3 rounded-2xl bg-[#090c16]/95 border border-white/15 hover:border-blue-500/40 shadow-[0_8px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(37,99,235,0.2)] backdrop-blur-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-sans">
            {/* Multi-layered Cosmic Ambient Aura */}
            <div className="absolute top-0 right-1/4 w-96 h-12 bg-gradient-to-r from-blue-600/15 via-indigo-500/15 to-purple-600/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-2 left-1/3 w-64 h-8 bg-emerald-500/10 blur-xl pointer-events-none" />

            {/* Left Status Bar */}
            <div className="flex items-center gap-3 relative z-10 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
                <Shield className="w-4 h-4 text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-['Syne'] font-extrabold text-white tracking-widest uppercase bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-sm">
                  ADMIN COCKPIT
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[9px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  LIVE
                </span>
                <span className="text-[11px] text-neutral-400 font-sans hidden lg:inline border-l border-white/10 pl-2.5">
                  Drag cards in any direction to reorder
                </span>
              </div>
            </div>

            {/* Right Action Button Deck */}
            <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all duration-200 shadow-[0_0_18px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Upload Photo</span>
              </button>

              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-600/30 text-purple-200 hover:text-white border border-purple-400/35 font-semibold text-[11px] flex items-center gap-1.5 transition-all duration-200 shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-purple-300" />
                <span>Category</span>
              </button>

              {/* Save All Changes Option */}
              {hasUnsavedChanges ? (
                <button
                  onClick={handleSaveAllChanges}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] flex items-center gap-1.5 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40 animate-pulse"
                  title="Save all unsaved reorderings and edits"
                >
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>Save Changes</span>
                </button>
              ) : (
                <button
                  disabled
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5 cursor-default shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  title="All changes are currently saved."
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved</span>
                </button>
              )}

              {/* Reset Option - available when there are unsaved changes */}
              {hasUnsavedChanges && (
                <button
                  onClick={() => setShowResetConfirmModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/25 to-red-600/25 hover:from-rose-600/45 hover:to-red-600/45 text-rose-200 hover:text-white border border-rose-500/40 font-bold text-[11px] flex items-center gap-1.5 transition-all duration-200 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_22px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
                  title="Reset unsaved changes back to last saved state"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={() => setShowAdminModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 hover:border-blue-400/40 font-semibold text-[11px] flex items-center gap-1.5 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Gallery Grid */}
      <main className="max-w-[1540px] mx-auto px-2 xs:px-3 sm:px-6 md:px-8 py-4 sm:py-8 relative z-10 flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${animKey}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6 items-stretch"
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4">
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">No works found</h4>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
                >
                  View All Works
                </button>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isBeingDragged = draggedPhotoId === item.id;
                const isDragTarget = dragOverPhotoId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    draggable={isAdminAuthenticated}
                    onDragStart={(e) => handleDragStart(e as any, item.id)}
                    onDragOver={(e) => handleDragOver(e as any, item.id)}
                    onDragEnd={() => {
                      setDraggedPhotoId(null);
                      setDragOverPhotoId(null);
                    }}
                    onDrop={(e) => handleDrop(e as any, item.id)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                    onClick={() => {
                      if (!draggedPhotoId) setActiveItem(item);
                    }}
                    className={`group relative flex flex-col p-1.5 pb-2 sm:p-3 sm:pb-4 rounded-[14px] sm:rounded-[24px] md:rounded-[28px] bg-[#111216]/95 border sm:border-2 transition-all duration-300 break-inside-avoid w-full ${
                      isBeingDragged
                        ? 'opacity-35 scale-95 border-dashed border-blue-400 bg-blue-950/20 cursor-grabbing'
                        : isDragTarget
                        ? 'scale-[1.02] border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-400/40 cursor-copy'
                        : 'border-[#2563EB]/70 hover:border-[#3B82F6] shadow-[0_6px_20px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(37,99,235,0.35)] cursor-pointer'
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/5] rounded-[10px] sm:rounded-[18px] md:rounded-[20px] overflow-hidden bg-neutral-950 border border-neutral-800/60 shadow-inner">
                      <img
                        src={item.url}
                        alt={item.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Top Right Admin 3-Dots Menu */}
                      {isAdminAuthenticated && (
                        <div className="absolute top-2 right-2 z-30">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuPhotoId((prev) => (prev === item.id ? null : item.id));
                              }}
                              title="Photo Edit Menu"
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xl shadow-lg border transition-all cursor-pointer ${
                                openMenuPhotoId === item.id
                                  ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/50'
                                  : 'bg-black/85 hover:bg-white text-neutral-300 hover:text-black border-white/20'
                              }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {openMenuPhotoId === item.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-950/98 border border-white/25 shadow-2xl backdrop-blur-2xl z-50"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuPhotoId(null);
                                    setEditingPhoto(item);
                                  }}
                                  title="Edit Photo Details"
                                  className="w-8 h-8 rounded-xl bg-blue-500/20 hover:bg-blue-600 border border-blue-400/30 flex items-center justify-center text-blue-400 hover:text-white transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <div className="w-5 h-px bg-white/20 my-0.5" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuPhotoId(null);
                                    setPhotoToDelete(item);
                                  }}
                                  title="Delete Photo"
                                  className="w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-600 border border-red-500/30 flex items-center justify-center text-red-400 hover:text-white transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Centered Typography */}
                    <div className="mt-1.5 sm:mt-3 text-center px-0.5 sm:px-1">
                      <h3 className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 font-medium mt-0.5 truncate">
                        {item.clientOrEvent || item.category}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Lightbox Modal */}
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
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative max-w-[460px] sm:max-w-[500px] w-full bg-[#121316]/95 border border-white/15 rounded-[32px] p-4 sm:p-5 shadow-2xl backdrop-blur-2xl z-10 flex flex-col my-auto text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 hover:bg-white text-white hover:text-black transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative w-full h-[380px] sm:h-[460px] bg-[#181920] border border-white/10 rounded-[24px] overflow-hidden flex items-center justify-center shadow-inner">
                <img
                  src={activeItem.url}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-auto max-w-full object-contain rounded-[18px] select-none block shadow-2xl"
                />
                <button
                  onClick={(e) => handleDownload(activeItem.url, activeItem.title, e)}
                  className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-white text-neutral-200 hover:text-black border border-white/15 backdrop-blur-md text-xs font-medium transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
              <div className="mt-4 px-2 text-center">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{activeItem.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-0.5">{activeItem.clientOrEvent || activeItem.category}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onOpenAddPhotoModal={() => setShowAddPhotoModal(true)}
        isAuthenticated={isAdminAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* Add Photo Modal matching Screenshot 2026-10-13 111720.png */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0F1117] border border-white/20 rounded-[30px] p-6 text-white shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddPhotoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/60 hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">PHOTO MASTER UPLOAD</h3>
                <p className="text-[11px] text-neutral-400">Upload photography directly from your device gallery with instant preview</p>
              </div>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4 text-xs">
              <input
                ref={photoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoFileSelect}
                className="hidden"
                id="photo-gallery-upload-input"
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">Photo Source File *</span>
                  <div className="inline-flex p-1 rounded-xl bg-neutral-900 border border-white/10">
                    <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-md">
                      <Upload className="w-3 h-3" />
                      <span>From Gallery</span>
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => photoFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-blue-500/40 hover:border-blue-400 rounded-2xl bg-black/40 hover:bg-black/60 p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                >
                  {newPhotoPreviewUrl ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-neutral-950 border border-white/20">
                      <img src={newPhotoPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg">Click to Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">SELECT OR DROP MASTER PHOTO</h4>
                      <p className="text-[11px] text-neutral-400 max-w-xs">Upload high-resolution photography or poster design from your device for instant gallery preview</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Coastal Serenity & Waves"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="PHOTOGRAPHY">Photography</option>
                  <option value="POSTER DESIGNING">Poster Designing</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">Caption / Location (Optional)</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="e.g. Captured in Kozhikode • Sony A7IV"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!newPhotoPreviewUrl}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                >
                  Publish Photo Work
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0F1117] border border-white/20 rounded-[30px] p-6 text-white shadow-2xl relative"
          >
            <button
              onClick={() => setEditingPhoto(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/60 hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-400" />
              <span>Edit Photo Details</span>
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">Caption / Location</label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleSavePhotoEdits}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0F1117] border border-red-500/40 rounded-[30px] p-6 text-white shadow-2xl relative text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold mb-1">Delete "{photoToDelete.title}"?</h3>
            <p className="text-xs text-neutral-400 mb-6">This action cannot be undone and will update the gallery instantly.</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => handleDeletePhoto(photoToDelete.id, e)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirmModal && (
          <div data-lenis-prevent="true" className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirmModal(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className="relative w-full max-w-md bg-[#0e0f14] border border-red-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-white font-sans my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Reset Unsaved Changes?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed">
                    This will revert all recent unsaved photography reorderings, title renames, categories, and photo uploads back to your last saved state.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#1e2026] hover:bg-[#2b2e37] text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetAll}
                  className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                  <span>Reset All Changes</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Manage Categories Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 select-none"
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
              className="relative w-full max-w-md bg-[#0e0f14] border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-white font-sans my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Category Manager</h3>
                    <p className="text-xs text-neutral-400">Add new category or remove existing tabs</p>
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
                    placeholder="e.g. PORTRAITS, EDITORIAL, EVENT"
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

              {/* Active Categories List & Remove */}
              <div className="mt-5 pt-4 border-t border-neutral-800 space-y-2 font-sans">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
                  <span>ACTIVE CATEGORIES ({categories.length})</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Click trash to remove</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 modal-scroll-slider">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-white"
                    >
                      <span className="font-medium text-xs">{cat}</span>
                      {cat.toUpperCase() !== 'ALL' ? (
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

      {/* Floating Upload Photo FAB at Bottom Right of Photography Gallery */}
      {isAdminAuthenticated && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowAddPhotoModal(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[120] px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-syne font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-[0_10px_35px_rgba(37,99,235,0.65),0_0_20px_rgba(168,85,247,0.4)] border border-blue-400/50 backdrop-blur-xl cursor-pointer group"
          title="Upload New Master Photo from Gallery"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-4 h-4 stroke-[3] text-white" />
          </div>
          <span>Upload Photo</span>
        </motion.button>
      )}
    </motion.div>
  );
}

export default GalleryPage;
