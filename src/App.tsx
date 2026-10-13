import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { GradientWaves } from './components/GradientWaves';
import { ShapeGrid } from './components/ShapeGrid';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Videography } from './components/Videography';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AddGoogleDriveVideoModal } from './components/AddGoogleDriveVideoModal';
import { VideoGalleryItem } from './components/VideoGalleryPage';
import { deleteVideoBlob } from './utils/videoStorage';
import { FirebaseDataProvider } from './context/FirebaseDataContext';
import { fetchCatalogFromFirebase, saveCatalogToFirebase } from './utils/firebase';

export function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mushfiq_videography_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [customVideos, setCustomVideos] = useState<VideoGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('mushfiq_custom_drive_videos');
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

  // Global listeners to open admin panel anywhere & keyboard shortcut Alt+A / Ctrl+Shift+A
  useEffect(() => {
    const handleOpenAdmin = () => {
      setIsAdminOpen(true);
    };

    const handleSyncVideos = () => {
      try {
        const saved = localStorage.getItem('mushfiq_custom_drive_videos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCustomVideos(parsed.map((item: any) => ({ ...item, isCustom: true })));
          }
        }
      } catch {
        // ignore
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Shortcut Alt+A or Ctrl+Shift+A to open Admin from anywhere
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('open-admin-panel', handleOpenAdmin);
    window.addEventListener('custom-videos-updated', handleSyncVideos);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('open-admin-panel', handleOpenAdmin);
      window.removeEventListener('custom-videos-updated', handleSyncVideos);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleAddVideo = async (newVideo: VideoGalleryItem) => {
    const videoWithCustom = { ...newVideo, isCustom: true };
    const updated = [videoWithCustom, ...customVideos];
    setCustomVideos(updated);
    try {
      localStorage.setItem('mushfiq_custom_drive_videos', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    try {
      const fbData = await fetchCatalogFromFirebase();
      if (fbData && Array.isArray(fbData.videos)) {
        const merged = [videoWithCustom, ...fbData.videos.filter((v: any) => v.id !== newVideo.id)];
        await saveCatalogToFirebase(merged, fbData.categories || []);
      }
    } catch (fbErr) {
      console.warn('Firebase catalog sync note:', fbErr);
    }
    setIsAddVideoOpen(false);
    window.dispatchEvent(new CustomEvent('custom-videos-updated'));
  };

  const handleDeleteCustomVideo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customVideos.filter((v) => v.id !== id);
    setCustomVideos(updated);
    try {
      localStorage.setItem('mushfiq_custom_drive_videos', JSON.stringify(updated));
      await deleteVideoBlob(id);
    } catch (e) {
      console.error('Failed to delete video', e);
    }
    try {
      const fbData = await fetchCatalogFromFirebase();
      if (fbData && Array.isArray(fbData.videos)) {
        const filtered = fbData.videos.filter((v: any) => v.id !== id);
        await saveCatalogToFirebase(filtered, fbData.categories || []);
      }
    } catch (fbErr) {
      console.warn('Firebase catalog delete note:', fbErr);
    }
    window.dispatchEvent(new CustomEvent('custom-videos-updated'));
  };

  // Initialize Lenis smooth scroll engine and force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <FirebaseDataProvider>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans antialiased overflow-x-hidden">
        
        {/* Smooth Magnetic Cursor */}
        <CustomCursor />

        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Animated Blue and White Gradient Waves Background */}
        <GradientWaves />

        {/* Interactive Apple/Linear/Vercel Style Grid Backdrop */}
        <ShapeGrid
          direction="diagonal"
          speed={0.4}
          squareSize={42}
          shape="square"
          hoverTrailAmount={8}
        />

        {/* Main Portfolio Content */}
        <div className="opacity-100 transition-opacity duration-300">
          <Navigation />

          <main>
            <Hero />
            <About />
            <div id="projects">
              <Projects />
              <Videography />
            </div>
            <Contact />
          </main>

          <Footer />
        </div>

        {/* Global Admin Authentication & Video Management Modals Accessible From Anywhere */}
        <AdminAuthModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onOpenAddVideoModal={() => {
            setIsAdminOpen(false);
            setIsAddVideoOpen(true);
          }}
          customVideos={customVideos}
          onDeleteCustomVideo={handleDeleteCustomVideo}
          isAuthenticated={isAdminAuthenticated}
          setIsAuthenticated={setIsAdminAuthenticated}
        />

        <AddGoogleDriveVideoModal
          isOpen={isAddVideoOpen}
          onClose={() => setIsAddVideoOpen(false)}
          onAddVideo={handleAddVideo}
          existingCount={customVideos.length}
        />

      </div>
    </FirebaseDataProvider>
  );
}

export default App;
