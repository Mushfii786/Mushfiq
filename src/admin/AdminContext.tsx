import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  db, 
  auth, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { siteConfig, projects as initialProjects, photography as initialPhotography } from '../config/site';
import { Project, Photo } from '../types';
import { 
  AdminModule, 
  ViewportMode, 
  StyleOverride, 
  SiteSettingsData, 
  BlogPostItem, 
  ContactMessageItem, 
  AnalyticsEventItem, 
  MediaAssetItem 
} from './types';
import { EDITABLE_ELEMENTS } from './elementRegistry';

interface AdminContextType {
  // Authentication & Studio Visibility
  isAdminAuthenticated: boolean;
  adminUser: User | null;
  isStudioOpen: boolean;
  setIsStudioOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithMasterKey: (id: string, pass: string) => boolean;
  logout: () => Promise<void>;

  // Navigation & Workspace
  activeModule: AdminModule;
  setActiveModule: (m: AdminModule) => void;
  activePage: string;
  setActivePage: (p: string) => void;

  // Visual Editor Canvas State
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  hoveredElementId: string | null;
  setHoveredElementId: (id: string | null) => void;
  viewportMode: ViewportMode;
  setViewportMode: (v: ViewportMode) => void;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (p: boolean) => void;

  // Overrides & Styling Engine
  overrides: Record<string, StyleOverride>;
  publishedOverrides: Record<string, StyleOverride>;
  updateElementOverride: (id: string, partial: Partial<StyleOverride>) => void;
  resetElementOverride: (id: string) => void;
  getEffectiveOverride: (id: string) => StyleOverride | undefined;
  
  // History & Publishing
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error' | 'published';
  saveDraft: () => Promise<void>;
  publishChanges: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Site Settings & Global Tokens
  siteSettings: SiteSettingsData;
  updateSiteSettings: (partial: Partial<SiteSettingsData>) => Promise<void>;

  // Content Modules Data & Actions
  projects: Project[];
  saveProject: (project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  blogPosts: BlogPostItem[];
  saveBlogPost: (post: Partial<BlogPostItem>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  galleryImages: Photo[];
  saveGalleryImage: (image: Partial<Photo>) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;

  contactMessages: ContactMessageItem[];
  submitContactMessage: (msg: { name: string; email: string; subject?: string; message: string }) => Promise<boolean>;
  markMessageRead: (id: string, read: boolean) => Promise<void>;
  archiveMessage: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  analyticsEvents: AnalyticsEventItem[];
  logAnalyticsEvent: (eventType: AnalyticsEventItem['eventType'], path: string, targetId?: string) => Promise<void>;

  mediaAssets: MediaAssetItem[];
  addMediaAsset: (asset: MediaAssetItem) => void;
  deleteMediaAsset: (id: string) => void;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  siteTitle: siteConfig.name,
  tagline: siteConfig.tagline,
  aboutIntro: siteConfig.aboutIntro,
  aboutBio: siteConfig.aboutBio,
  email: siteConfig.email,
  whatsapp: siteConfig.whatsapp,
  location: siteConfig.location,
  status: siteConfig.status,
  avatarUrl: siteConfig.avatarUrl,
  showAdminButton: true,
  adminButtonLabel: 'Admin',
  primaryAccent: '#8B5CF6',
  borderRadiusPreset: 'subtle',
  fontScale: 'normal',
  updatedAt: new Date().toISOString(),
};

const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'post-1',
    title: 'The Art of Cinematic Motion in Modern Web Design',
    slug: 'art-of-cinematic-motion',
    excerpt: 'How weaving video timelines, WebGL shaders, and high-frame-rate micro-interactions creates memorable digital portfolios.',
    content: `# The Art of Cinematic Motion in Modern Web Design\n\nMotion in web design is no longer just decorative fluff. When executed with cinematic precision, movement directs attention, establishes visual hierarchy, and tells a compelling story.\n\n### 1. Rhythm & Easing\nUsing organic easing curves (like cubic-bezier(0.16, 1, 0.3, 1)) transforms standard UI jumps into natural kinetic experiences.\n\n### 2. High-Frame-Rate Overlays\nPairing WebGL shaders with GPU-accelerated video frames yields unprecedented fluidity without bogging down CPU threads.`,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=800',
    category: 'Design Engineering',
    tags: ['Motion', 'WebGL', 'UI/UX', 'Cinematography'],
    author: 'Muhammed Mushfiq',
    status: 'published',
    publishedAt: '2026-03-15',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-15',
    views: 1420,
  },
  {
    id: 'post-2',
    title: 'Color Grading for Video & Atmospheric Photography',
    slug: 'color-grading-atmospheric-photography',
    excerpt: 'Exploring teal & amber color separation, shadow lift, and tactile film grain in Lightroom & DaVinci Resolve.',
    content: `# Color Grading for Video & Atmospheric Photography\n\nColor grading establishes the emotional core of any visual frame. Whether editing moody monsoon frames in Malappuram or neon night drift in Tokyo, intentional color pallets bring visual cohesion.\n\n### The S-Curve and Shadow Roll-off\nLifting pure blacks by 3-5% introduces that tactile cinematic softness that digital cameras often discard.`,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200&h=800',
    category: 'Photography',
    tags: ['Color Grading', 'Photography', 'DaVinci Resolve', 'Lightroom'],
    author: 'Muhammed Mushfiq',
    status: 'published',
    publishedAt: '2026-02-28',
    createdAt: '2026-02-20',
    updatedAt: '2026-02-28',
    views: 980,
  }
];

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mushfiq_videography_admin_session') === 'true';
    } catch {
      return false;
    }
  });
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Navigation
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [activePage, setActivePage] = useState<string>('home');

  // Canvas Viewport & Selection
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Overrides & History
  const [overrides, setOverrides] = useState<Record<string, StyleOverride>>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_draft_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [publishedOverrides, setPublishedOverrides] = useState<Record<string, StyleOverride>>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_published_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [history, setHistory] = useState<Record<string, StyleOverride>[]>([overrides]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error' | 'published'>('saved');

  // Content Store
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_blog');
      return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  const [galleryImages, setGalleryImages] = useState<Photo[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_gallery');
      return saved ? JSON.parse(saved) : initialPhotography;
    } catch {
      return initialPhotography;
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessageItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEventItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_analytics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_media');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track Firebase Auth user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      if (user && user.email === 'muhammedmushfiq178@gmail.com') {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('mushfiq_videography_admin_session', 'true');
      }
    });
    return () => unsub();
  }, []);

  // Listen to Firestore page customizations
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'pageCustomizations', 'home'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data?.elementOverrides) {
            setPublishedOverrides(data.elementOverrides);
            localStorage.setItem('portfolio_studio_published_overrides', JSON.stringify(data.elementOverrides));
          }
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'pageCustomizations/home');
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore live listener offline, using local state.');
    }
  }, []);

  // Sync projects from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
        if (!snap.empty) {
          const list: Project[] = [];
          snap.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          setProjects(list);
          localStorage.setItem('portfolio_studio_projects', JSON.stringify(list));
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'projects');
      });
      return () => unsub();
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync blog posts from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'blogPosts'), (snap) => {
        if (!snap.empty) {
          const list: BlogPostItem[] = [];
          snap.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          setBlogPosts(list);
          localStorage.setItem('portfolio_studio_blog', JSON.stringify(list));
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'blogPosts');
      });
      return () => unsub();
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync gallery photos from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'galleryImages'), (snap) => {
        if (!snap.empty) {
          const list: Photo[] = [];
          snap.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          setGalleryImages(list);
          localStorage.setItem('portfolio_studio_gallery', JSON.stringify(list));
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'galleryImages');
      });
      return () => unsub();
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync contact messages from Firestore
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    try {
      const unsub = onSnapshot(collection(db, 'contactMessages'), (snap) => {
        const list: ContactMessageItem[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as any) });
        });
        setContactMessages(list);
        localStorage.setItem('portfolio_studio_messages', JSON.stringify(list));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'contactMessages');
      });
      return () => unsub();
    } catch (e) {
      // ignore
    }
  }, [isAdminAuthenticated]);

  // Log page view on initial mount
  useEffect(() => {
    // Only log visitor activity if not currently an admin
    if (!isAdminAuthenticated) {
      logAnalyticsEvent('page_view', window.location.pathname || '/');
    }
  }, [isAdminAuthenticated]);

  // Handle URL hash '#admin' or keyboard shortcut
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsStudioOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Login methods
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('mushfiq_videography_admin_session', 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Google Sign In failed:', e);
      return false;
    }
  };

  const loginWithMasterKey = (id: string, pass: string): boolean => {
    if ((id === 'Mushfii_786' || id === 'admin') && (pass === '@Mushfii_786' || pass === 'admin123')) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('mushfiq_videography_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('mushfiq_videography_admin_session');
    setIsStudioOpen(false);
  };

  // Visual Override Management
  const updateElementOverride = useCallback((id: string, partial: Partial<StyleOverride>) => {
    setOverrides((prev) => {
      const current = prev[id] || {};
      const updated = {
        ...prev,
        [id]: { ...current, ...partial }
      };

      // Push to history
      setHistory((h) => {
        const next = h.slice(0, historyIndex + 1);
        return [...next, updated];
      });
      setHistoryIndex((idx) => idx + 1);

      // Local storage backup
      try {
        localStorage.setItem('portfolio_studio_draft_overrides', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      setSaveStatus('unsaved');
      return updated;
    });
  }, [historyIndex]);

  const resetElementOverride = useCallback((id: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem('portfolio_studio_draft_overrides', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      setSaveStatus('unsaved');
      return next;
    });
  }, []);

  const getEffectiveOverride = useCallback((id: string) => {
    // In studio editor mode, use working draft overrides; in public mode, use published overrides
    if (isStudioOpen) {
      return overrides[id];
    }
    return publishedOverrides[id];
  }, [isStudioOpen, overrides, publishedOverrides]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setOverrides(history[prevIdx]);
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setOverrides(history[nextIdx]);
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  // Save draft
  const saveDraft = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('portfolio_studio_draft_overrides', JSON.stringify(overrides));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'pageCustomizations', 'draft_home'), {
          pageId: 'home',
          elementOverrides: overrides,
          isPublished: false,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      setSaveStatus('saved');
    } catch (e) {
      console.error('Failed to save draft:', e);
      setSaveStatus('error');
    }
  };

  // Publish to public live website
  const publishChanges = async () => {
    setSaveStatus('saving');
    try {
      setPublishedOverrides(overrides);
      localStorage.setItem('portfolio_studio_published_overrides', JSON.stringify(overrides));
      localStorage.setItem('portfolio_studio_draft_overrides', JSON.stringify(overrides));

      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'pageCustomizations', 'home'), {
          pageId: 'home',
          elementOverrides: overrides,
          isPublished: true,
          version: Date.now(),
          updatedAt: new Date().toISOString()
        });
      }
      setSaveStatus('published');
      setTimeout(() => setSaveStatus('saved'), 2500);
    } catch (e) {
      console.error('Failed to publish changes:', e);
      handleFirestoreError(e, OperationType.WRITE, 'pageCustomizations/home');
      setSaveStatus('error');
    }
  };

  // Site Settings
  const updateSiteSettings = async (partial: Partial<SiteSettingsData>) => {
    const updated = { ...siteSettings, ...partial, updatedAt: new Date().toISOString() };
    setSiteSettings(updated);
    try {
      localStorage.setItem('portfolio_studio_settings', JSON.stringify(updated));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'siteSettings', 'global'), updated, { merge: true });
      }
    } catch (e) {
      console.error('Failed to update site settings:', e);
    }
  };

  // Content Handlers
  const saveProject = async (p: Partial<Project>) => {
    const id = p.id || `proj-${Date.now()}`;
    const fullProject = { ...p, id } as Project;
    const updatedList = projects.some((item) => item.id === id)
      ? projects.map((item) => (item.id === id ? fullProject : item))
      : [fullProject, ...projects];

    setProjects(updatedList);
    try {
      localStorage.setItem('portfolio_studio_projects', JSON.stringify(updatedList));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'projects', id), {
          ...fullProject,
          status: fullProject.featured ? 'published' : 'published',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Failed to persist project:', e);
    }
  };

  const deleteProject = async (id: string) => {
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    try {
      localStorage.setItem('portfolio_studio_projects', JSON.stringify(filtered));
      if (isAdminAuthenticated) {
        await deleteDoc(doc(db, 'projects', id));
      }
    } catch (e) {
      console.error('Failed to delete project:', e);
    }
  };

  const saveBlogPost = async (post: Partial<BlogPostItem>) => {
    const id = post.id || `post-${Date.now()}`;
    const now = new Date().toISOString();
    const fullPost: BlogPostItem = {
      id,
      title: post.title || 'Untitled Article',
      slug: post.slug || `article-${Date.now()}`,
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage,
      category: post.category || 'General',
      tags: post.tags || ['Design'],
      author: post.author || siteConfig.name,
      status: post.status || 'published',
      publishedAt: post.publishedAt || now,
      createdAt: post.createdAt || now,
      updatedAt: now,
      views: post.views || 0,
    };

    const updatedList = blogPosts.some((b) => b.id === id)
      ? blogPosts.map((b) => (b.id === id ? fullPost : b))
      : [fullPost, ...blogPosts];

    setBlogPosts(updatedList);
    try {
      localStorage.setItem('portfolio_studio_blog', JSON.stringify(updatedList));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'blogPosts', id), fullPost);
      }
    } catch (e) {
      console.error('Failed to save blog post:', e);
    }
  };

  const deleteBlogPost = async (id: string) => {
    const filtered = blogPosts.filter((b) => b.id !== id);
    setBlogPosts(filtered);
    try {
      localStorage.setItem('portfolio_studio_blog', JSON.stringify(filtered));
      if (isAdminAuthenticated) {
        await deleteDoc(doc(db, 'blogPosts', id));
      }
    } catch (e) {
      console.error('Failed to delete blog post:', e);
    }
  };

  const saveGalleryImage = async (img: Partial<Photo>) => {
    const id = img.id || `photo-${Date.now()}`;
    const fullPhoto = { ...img, id } as Photo;
    const updated = galleryImages.some((i) => i.id === id)
      ? galleryImages.map((i) => (i.id === id ? fullPhoto : i))
      : [fullPhoto, ...galleryImages];

    setGalleryImages(updated);
    try {
      localStorage.setItem('portfolio_studio_gallery', JSON.stringify(updated));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'galleryImages', id), {
          ...fullPhoto,
          published: true,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Failed to save photo:', e);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    const filtered = galleryImages.filter((i) => i.id !== id);
    setGalleryImages(filtered);
    try {
      localStorage.setItem('portfolio_studio_gallery', JSON.stringify(filtered));
      if (isAdminAuthenticated) {
        await deleteDoc(doc(db, 'galleryImages', id));
      }
    } catch (e) {
      console.error('Failed to delete photo:', e);
    }
  };

  const submitContactMessage = async (msg: { name: string; email: string; subject?: string; message: string }) => {
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessageItem = {
      id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || 'Portfolio Inquiry',
      message: msg.message,
      read: false,
      archived: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newMsg, ...contactMessages];
    setContactMessages(updated);
    try {
      localStorage.setItem('portfolio_studio_messages', JSON.stringify(updated));
      await setDoc(doc(db, 'contactMessages', id), newMsg);
      logAnalyticsEvent('contact_click', '/contact', id);
      return true;
    } catch (e) {
      console.error('Failed to send message:', e);
      return true; // Still true locally
    }
  };

  const markMessageRead = async (id: string, read: boolean) => {
    const updated = contactMessages.map((m) => (m.id === id ? { ...m, read } : m));
    setContactMessages(updated);
    try {
      localStorage.setItem('portfolio_studio_messages', JSON.stringify(updated));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'contactMessages', id), { read }, { merge: true });
      }
    } catch (e) {
      // ignore
    }
  };

  const archiveMessage = async (id: string) => {
    const updated = contactMessages.map((m) => (m.id === id ? { ...m, archived: true } : m));
    setContactMessages(updated);
    try {
      localStorage.setItem('portfolio_studio_messages', JSON.stringify(updated));
      if (isAdminAuthenticated) {
        await setDoc(doc(db, 'contactMessages', id), { archived: true }, { merge: true });
      }
    } catch (e) {
      // ignore
    }
  };

  const deleteMessage = async (id: string) => {
    const filtered = contactMessages.filter((m) => m.id !== id);
    setContactMessages(filtered);
    try {
      localStorage.setItem('portfolio_studio_messages', JSON.stringify(filtered));
      if (isAdminAuthenticated) {
        await deleteDoc(doc(db, 'contactMessages', id));
      }
    } catch (e) {
      // ignore
    }
  };

  const logAnalyticsEvent = async (
    eventType: AnalyticsEventItem['eventType'], 
    path: string, 
    targetId?: string
  ) => {
    // Avoid tracking admin editing sessions
    if (isAdminAuthenticated && isStudioOpen) return;

    const device: AnalyticsEventItem['device'] = window.innerWidth < 640 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
    const id = `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const event: AnalyticsEventItem = {
      id,
      eventType,
      path,
      referrer: document.referrer || 'direct',
      device,
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Firefox',
      timestamp: new Date().toISOString(),
      targetId,
    };

    setAnalyticsEvents((prev) => {
      const next = [event, ...prev].slice(0, 500);
      try {
        localStorage.setItem('portfolio_studio_analytics', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });

    try {
      await setDoc(doc(db, 'analyticsEvents', id), event);
    } catch (e) {
      // ignore
    }
  };

  const addMediaAsset = (asset: MediaAssetItem) => {
    setMediaAssets((prev) => {
      const updated = [asset, ...prev];
      localStorage.setItem('portfolio_studio_media', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      localStorage.setItem('portfolio_studio_media', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        isStudioOpen,
        setIsStudioOpen,
        loginWithGoogle,
        loginWithMasterKey,
        logout,

        activeModule,
        setActiveModule,
        activePage,
        setActivePage,

        selectedElementId,
        setSelectedElementId,
        hoveredElementId,
        setHoveredElementId,
        viewportMode,
        setViewportMode,
        zoomLevel,
        setZoomLevel,
        isPreviewMode,
        setIsPreviewMode,

        overrides,
        publishedOverrides,
        updateElementOverride,
        resetElementOverride,
        getEffectiveOverride,

        saveStatus,
        saveDraft,
        publishChanges,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,

        siteSettings,
        updateSiteSettings,

        projects,
        saveProject,
        deleteProject,

        blogPosts,
        saveBlogPost,
        deleteBlogPost,

        galleryImages,
        saveGalleryImage,
        deleteGalleryImage,

        contactMessages,
        submitContactMessage,
        markMessageRead,
        archiveMessage,
        deleteMessage,

        analyticsEvents,
        logAnalyticsEvent,

        mediaAssets,
        addMediaAsset,
        deleteMediaAsset,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}
