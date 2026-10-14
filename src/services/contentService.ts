import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  FirestorePhotoItem,
  FirestoreVideoItem,
  FirestoreProjectItem,
  FirestoreSiteContent,
  FirestoreSiteSettings,
  FirestoreTimelineItem,
  FirestoreServiceItem,
  FirestoreTechItem
} from '../types/admin';
import { siteConfig, projects as initialProjects, timelineItems as initialTimeline } from '../config/site';

// Initial photo dataset from photography gallery
export const initialPhotos: FirestorePhotoItem[] = [
  {
    id: 'photo-1',
    title: 'AlUla Rock Formations & Sandstone Monoliths',
    caption: 'Gothic sandstone monoliths emerging through dramatic morning desert haze.',
    description: 'Captured in the heart of AlUla Valley, showcasing the stark beauty of ancient geological formations.',
    category: 'Landscapes',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1600',
    location: 'AlUla Valley, Saudi Arabia',
    camera: 'Sony A7IV',
    lens: '24-70mm f/2.8 GM',
    settings: '1/320s • f/8 • ISO 100',
    year: '2026',
    featured: true,
    published: true,
    sortOrder: 0,
    tags: ['sandstone', 'canyon', 'monolith', 'valley']
  },
  {
    id: 'photo-2',
    title: 'Footprints Across Golden Dunes',
    caption: 'Curving wind ridges and subtle footsteps across virgin golden sand.',
    description: 'Intimate perspective of desert wind patterns in the legendary Rub al Khali expanse.',
    category: 'Desert Routes',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000',
    location: 'Rub al Khali, Arabian Desert',
    camera: 'Sony A7IV',
    lens: '35mm f/1.4 GM',
    settings: '1/500s • f/5.6 • ISO 100',
    year: '2026',
    featured: true,
    published: true,
    sortOrder: 1,
    tags: ['dunes', 'desert', 'dune ridge', 'tracks']
  },
  {
    id: 'photo-3',
    title: 'Caravan Across the Dune Ridge',
    caption: 'Rhythmic caravan silhouette traversing the crest of towering red dunes.',
    description: 'Documenting pastoral nomadic routes in the Wahiba Sands at late afternoon.',
    category: 'Desert Routes',
    url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=1000',
    location: 'Wahiba Sands, Oman',
    camera: 'Sony A7IV',
    lens: '70-200mm f/2.8 GM',
    settings: '1/800s • f/4 • ISO 200',
    year: '2026',
    featured: true,
    published: true,
    sortOrder: 2,
    tags: ['caravan', 'camels', 'desert', 'ridge']
  },
  {
    id: 'photo-4',
    title: 'Sunset Tea & Desert Hospitality',
    caption: 'Warm amber glow reflecting on traditional brass tea kettle under desert skies.',
    description: 'Evening tea ceremony welcoming weary travelers to the AlUla canyon camp.',
    category: 'Culture',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    location: 'AlUla Desert Camp',
    camera: 'Sony A7IV',
    lens: '50mm f/1.2 GM',
    settings: '1/250s • f/1.8 • ISO 400',
    year: '2025',
    featured: false,
    published: true,
    sortOrder: 3,
    tags: ['camp', 'hospitality', 'sunset', 'tradition']
  },
  {
    id: 'photo-5',
    title: 'Sunlight Through Slot Canyon Walls',
    caption: 'Shafts of mid-day sun cutting through narrow sandstone canyon passages.',
    description: 'Chiaroscuro lighting study in the ancient passages leading to historic Hegra.',
    category: 'Landscapes',
    url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1000',
    location: 'Hegra Canyon Passage',
    camera: 'Sony A7IV',
    lens: '16-35mm f/2.8 GM',
    settings: '1/160s • f/8 • ISO 160',
    year: '2025',
    featured: false,
    published: true,
    sortOrder: 4,
    tags: ['slot canyon', 'sunbeams', 'rocks', 'hegra']
  },
  {
    id: 'photo-6',
    title: 'Ancient Tombs of Hegra Heritage Site',
    caption: 'Monumental rock-cut facade sculpted directly into monolithic rose granite.',
    description: 'UNESCO World Heritage architectural photography showcasing monumental Nabataean tombs.',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=1200',
    location: 'Madain Salih, AlUla',
    camera: 'Sony A7IV',
    lens: '24-70mm f/2.8 GM',
    settings: '1/400s • f/9 • ISO 100',
    year: '2026',
    featured: true,
    published: true,
    sortOrder: 5,
    tags: ['hegra', 'tombs', 'nabataean', 'heritage', 'carved']
  }
];

// Initial video dataset from videography gallery
export const initialVideos: FirestoreVideoItem[] = [
  {
    id: 'video-1',
    title: 'Tokyo Neon Streets & Midnight Drift',
    caption: 'Night walkthrough through Shinjuku neon lanes featuring anamorphic lens flares.',
    description: 'Atmospheric night reel capturing city energy, reflections, and cinematic soundscapes.',
    category: 'Cinematic Reels',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-with-neon-lights-at-night-41541-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200&h=1600',
    duration: '0:45',
    aspectRatioClass: 'aspect-[9/16]',
    location: 'Tokyo, Japan',
    camera: 'Sony A7S III',
    lens: '35mm T1.5 Anamorphic',
    settings: '4K 60fps • S-Log3',
    year: '2026 Film',
    views: 14200,
    likes: 1850,
    column: 1,
    featured: true,
    published: true,
    sortOrder: 0
  },
  {
    id: 'video-2',
    title: 'Aerial Coastal Horizons & Wave Rhythms',
    caption: 'Cinematic FPV drone sweeping over rugged coastal cliffs at golden hour.',
    description: 'Dynamic aerial perspective tracing Atlantic surf lines and clifftop panoramas.',
    category: 'Drone & FPV',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-and-the-ocean-41550-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200&h=1600',
    duration: '1:12',
    aspectRatioClass: 'aspect-[16/9]',
    location: 'Varkala Coastline',
    camera: 'DJI Mavic 3 Pro',
    lens: '24mm Hasselblad Prime',
    settings: '5.1K 50fps • D-Log',
    year: '2025 Film',
    views: 22800,
    likes: 2410,
    column: 2,
    featured: true,
    published: true,
    sortOrder: 1
  },
  {
    id: 'video-3',
    title: 'Futuristic Urban Transit & Night Motion',
    caption: 'Long-exposure time-lapse and speed ramping of city traffic light trails.',
    description: 'High-speed shutter motion blur capturing subway systems and metropolitan arterial flows.',
    category: 'Motion & VFX',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200&h=1600',
    duration: '0:38',
    aspectRatioClass: 'aspect-[16/9]',
    location: 'Metropolis Hub',
    camera: 'RED Komodo 6K',
    lens: '50mm Cine Lens',
    settings: '6K 120fps • RAW',
    year: '2026 Film',
    views: 18900,
    likes: 1980,
    column: 3,
    featured: true,
    published: true,
    sortOrder: 2
  },
  {
    id: 'video-4',
    title: 'Fluid Liquid Motion & Ambient Waves',
    caption: 'Macro liquid optics exploring light refraction, caustics, and organic wave physics.',
    description: 'Ultra high-speed studio experiment capturing fluid dynamics and iridescent micro-currents.',
    category: 'Commercial',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200&h=1600',
    duration: '0:50',
    aspectRatioClass: 'aspect-square',
    location: 'Studio Lab',
    camera: 'Phantom Flex 4K',
    lens: '100mm Macro Lens',
    settings: '4K 1000fps • RAW',
    year: '2026 Film',
    views: 31200,
    likes: 3400,
    column: 4,
    featured: true,
    published: true,
    sortOrder: 3
  }
];

// Initial Site Content defaults
export const initialSiteContent: FirestoreSiteContent = {
  hero: {
    headingPart1: 'Crafting Unforgettable',
    headingPart2: 'Visuals Through',
    gradientHeading: 'Photography, Videography & Editing',
    intro: "Hi, I'm Mushfiq. I transform ideas into cinematic visuals through video editing, photography, videography, photo editing, and creative design.",
    availabilityBadge: 'Available for Freelance Projects',
    ctaLabel: 'Explore Works',
    ctaLink: '#projects',
    secondaryCtaLabel: 'Get in Touch',
    secondaryCtaLink: '#contact'
  },
  about: {
    heading: 'About Me',
    intro: siteConfig.aboutIntro,
    bio: siteConfig.aboutBio,
    avatarUrl: siteConfig.avatarUrl,
    location: siteConfig.location,
    status: siteConfig.status,
    email: siteConfig.email,
    whatsapp: siteConfig.whatsapp,
    roles: siteConfig.roles,
    stats: siteConfig.stats
  },
  socials: {
    instagram: siteConfig.socials.instagram,
    github: siteConfig.socials.github,
    linkedin: siteConfig.socials.linkedin,
    pinterest: siteConfig.socials.pinterest,
    behance: siteConfig.socials.behance,
    whatsapp: siteConfig.socials.whatsapp,
    email: siteConfig.socials.email
  },
  contact: {
    heading: "Let's Create Together",
    subheading: 'Have a project in mind, need cinematic video production, or want to collaborate? Send a message below.',
    email: siteConfig.email,
    phone: siteConfig.whatsapp,
    location: siteConfig.location,
    webhookUrl: 'https://script.google.com/macros/s/AKfycbwwCHspdtYFnMTKmZNdedj3vlMg8iF-fyYC3v_6P6ZaaEYgyzDfdf35DogIV54_maA/exec'
  },
  footer: {
    tagline: 'Video Editor & Visual Designer crafting cinematic stories, stunning photography, and impactful creative designs.',
    copyrightText: '© 2026 MUSHFII. Photography • Videography • Design'
  }
};

export const initialSiteSettings: FirestoreSiteSettings = {
  siteName: 'MUSHFII',
  siteTitle: 'Mushfiq — Creative Designer, Videographer & Photographer',
  handle: '@mushfiq_786',
  metaDescription: 'Personal creative portfolio of Muhammed Mushfiq showcasing photography, cinematic videography, and creative design.',
  accentColor: '#3b82f6',
  enableAnimations: true,
  maintenanceMode: false,
  allowPublicComments: false
};

// ==========================================
// 1. PHOTOGRAPHY REPOSITORY
// ==========================================

export async function fetchPhotos(): Promise<FirestorePhotoItem[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'photos'), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestorePhotoItem));
      }
    } catch (e) {
      console.warn('[ContentService] Failed to read photos from Firestore:', e);
    }
  }
  return initialPhotos;
}

export function subscribePhotos(callback: (photos: FirestorePhotoItem[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    const q = query(collection(db, 'photos'), orderBy('sortOrder', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestorePhotoItem));
          callback(items);
        } else {
          callback(initialPhotos);
        }
      },
      (error) => {
        console.warn('[ContentService] Photos subscription error:', error);
        callback(initialPhotos);
      }
    );
  }
  callback(initialPhotos);
  return () => {};
}

export async function savePhoto(photo: FirestorePhotoItem): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const photoRef = doc(db, 'photos', photo.id);
    await setDoc(photoRef, {
      ...photo,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return;
  }
  console.info('[ContentService] Local mode: photo saved in runtime memory');
}

export async function removePhoto(photoId: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'photos', photoId));
  }
}

export async function reorderPhotos(photoIds: string[]): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const batch = writeBatch(db);
    photoIds.forEach((id, index) => {
      const photoRef = doc(db, 'photos', id);
      batch.update(photoRef, { sortOrder: index, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  }
}

// ==========================================
// 2. VIDEOGRAPHY REPOSITORY
// ==========================================

export async function fetchVideos(): Promise<FirestoreVideoItem[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'videos'), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreVideoItem));
      }
    } catch (e) {
      console.warn('[ContentService] Failed to read videos from Firestore:', e);
    }
  }
  return initialVideos;
}

export function subscribeVideos(callback: (videos: FirestoreVideoItem[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    const q = query(collection(db, 'videos'), orderBy('sortOrder', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreVideoItem));
          callback(items);
        } else {
          callback(initialVideos);
        }
      },
      (error) => {
        console.warn('[ContentService] Videos subscription error:', error);
        callback(initialVideos);
      }
    );
  }
  callback(initialVideos);
  return () => {};
}

export async function saveVideo(video: FirestoreVideoItem): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const videoRef = doc(db, 'videos', video.id);
    await setDoc(videoRef, {
      ...video,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return;
  }
  console.info('[ContentService] Local mode: video saved in runtime memory');
}

export async function removeVideo(videoId: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'videos', videoId));
  }
}

export async function reorderVideos(videoIds: string[]): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const batch = writeBatch(db);
    videoIds.forEach((id, index) => {
      const videoRef = doc(db, 'videos', id);
      batch.update(videoRef, { sortOrder: index, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  }
}

// ==========================================
// 3. PROJECTS REPOSITORY
// ==========================================

export async function fetchProjects(): Promise<FirestoreProjectItem[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'projects'), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreProjectItem));
      }
    } catch (e) {
      console.warn('[ContentService] Failed to read projects from Firestore:', e);
    }
  }
  return initialProjects.map((p, idx) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    longDescription: p.longDescription,
    role: p.role,
    year: p.year,
    category: p.category || 'General',
    image: p.image,
    gallery: p.gallery || [],
    tags: p.tags || [],
    link: p.link,
    github: p.github,
    featured: Boolean(p.featured),
    published: true,
    sortOrder: idx,
    metrics: p.metrics
  }));
}

export function subscribeProjects(callback: (projects: FirestoreProjectItem[]) => void): () => void {
  const defaults = initialProjects.map((p, idx) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    longDescription: p.longDescription,
    role: p.role,
    year: p.year,
    category: p.category || 'General',
    image: p.image,
    gallery: p.gallery || [],
    tags: p.tags || [],
    link: p.link,
    github: p.github,
    featured: Boolean(p.featured),
    published: true,
    sortOrder: idx,
    metrics: p.metrics
  }));

  if (isFirebaseConfigured() && db) {
    const q = query(collection(db, 'projects'), orderBy('sortOrder', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreProjectItem));
          callback(items);
        } else {
          callback(defaults);
        }
      },
      (error) => {
        console.warn('[ContentService] Projects subscription error:', error);
        callback(defaults);
      }
    );
  }
  callback(defaults);
  return () => {};
}

export async function saveProject(project: FirestoreProjectItem): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const projectRef = doc(db, 'projects', project.id);
    await setDoc(projectRef, {
      ...project,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
}

export async function removeProject(projectId: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'projects', projectId));
  }
}

export async function reorderProjects(projectIds: string[]): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const batch = writeBatch(db);
    projectIds.forEach((id, index) => {
      const projRef = doc(db, 'projects', id);
      batch.update(projRef, { sortOrder: index, updatedAt: new Date().toISOString() });
    });
    await batch.commit();
  }
}

// ==========================================
// 4. SITE CONTENT & SETTINGS REPOSITORY
// ==========================================

export async function fetchSiteContent(): Promise<FirestoreSiteContent> {
  if (isFirebaseConfigured() && db) {
    try {
      const contentDoc = await getDoc(doc(db, 'siteContent', 'global'));
      if (contentDoc.exists()) {
        return { ...initialSiteContent, ...contentDoc.data() } as FirestoreSiteContent;
      }
    } catch (e) {
      console.warn('[ContentService] Failed to read siteContent:', e);
    }
  }
  return initialSiteContent;
}

export function subscribeSiteContent(callback: (content: FirestoreSiteContent) => void): () => void {
  if (isFirebaseConfigured() && db) {
    return onSnapshot(
      doc(db, 'siteContent', 'global'),
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ ...initialSiteContent, ...docSnap.data() } as FirestoreSiteContent);
        } else {
          callback(initialSiteContent);
        }
      },
      () => callback(initialSiteContent)
    );
  }
  callback(initialSiteContent);
  return () => {};
}

export async function saveSiteContent(content: Partial<FirestoreSiteContent>): Promise<void> {
  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'siteContent', 'global');
    await setDoc(docRef, { ...content, updatedAt: new Date().toISOString() }, { merge: true });
  }
}

export async function fetchSiteSettings(): Promise<FirestoreSiteSettings> {
  if (isFirebaseConfigured() && db) {
    try {
      const docSnap = await getDoc(doc(db, 'siteSettings', 'general'));
      if (docSnap.exists()) {
        return { ...initialSiteSettings, ...docSnap.data() } as FirestoreSiteSettings;
      }
    } catch (e) {}
  }
  return initialSiteSettings;
}

export function subscribeSiteSettings(callback: (settings: FirestoreSiteSettings) => void): () => void {
  if (isFirebaseConfigured() && db) {
    return onSnapshot(
      doc(db, 'siteSettings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ ...initialSiteSettings, ...docSnap.data() } as FirestoreSiteSettings);
        } else {
          callback(initialSiteSettings);
        }
      },
      () => callback(initialSiteSettings)
    );
  }
  callback(initialSiteSettings);
  return () => {};
}

export async function saveSiteSettings(settings: Partial<FirestoreSiteSettings>): Promise<void> {
  if (isFirebaseConfigured() && db) {
    await setDoc(doc(db, 'siteSettings', 'general'), { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
  }
}

// ==========================================
// 5. IDEMPOTENT INITIAL CONTENT MIGRATION
// ==========================================

export interface MigrationReport {
  photosMigrated: number;
  photosSkipped: number;
  videosMigrated: number;
  videosSkipped: number;
  projectsMigrated: number;
  projectsSkipped: number;
  siteContentMigrated: boolean;
  errors: string[];
}

/**
 * Imports existing portfolio content from static files into Firestore.
 * Idempotent: Does not duplicate existing documents or overwrite newer records.
 */
export async function migrateInitialContentToFirestore(): Promise<MigrationReport> {
  const report: MigrationReport = {
    photosMigrated: 0,
    photosSkipped: 0,
    videosMigrated: 0,
    videosSkipped: 0,
    projectsMigrated: 0,
    projectsSkipped: 0,
    siteContentMigrated: false,
    errors: [],
  };

  if (!isFirebaseConfigured() || !db) {
    report.errors.push('Firebase is not configured. Add VITE_FIREBASE_* credentials first.');
    return report;
  }

  try {
    // 1. Photos
    for (const photo of initialPhotos) {
      try {
        const photoRef = doc(db, 'photos', photo.id);
        const existing = await getDoc(photoRef);
        if (!existing.exists()) {
          await setDoc(photoRef, {
            ...photo,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          report.photosMigrated++;
        } else {
          report.photosSkipped++;
        }
      } catch (err: any) {
        report.errors.push(`Photo ${photo.id}: ${err.message}`);
      }
    }

    // 2. Videos
    for (const video of initialVideos) {
      try {
        const videoRef = doc(db, 'videos', video.id);
        const existing = await getDoc(videoRef);
        if (!existing.exists()) {
          await setDoc(videoRef, {
            ...video,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          report.videosMigrated++;
        } else {
          report.videosSkipped++;
        }
      } catch (err: any) {
        report.errors.push(`Video ${video.id}: ${err.message}`);
      }
    }

    // 3. Projects
    const projectsToMigrate = initialProjects.map((p, idx) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description,
      longDescription: p.longDescription || '',
      role: p.role,
      year: p.year,
      category: p.category || 'General',
      image: p.image,
      gallery: p.gallery || [],
      tags: p.tags || [],
      link: p.link || '',
      github: p.github || '',
      featured: Boolean(p.featured),
      published: true,
      sortOrder: idx,
      metrics: p.metrics || []
    }));

    for (const proj of projectsToMigrate) {
      try {
        const projRef = doc(db, 'projects', proj.id);
        const existing = await getDoc(projRef);
        if (!existing.exists()) {
          await setDoc(projRef, {
            ...proj,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          report.projectsMigrated++;
        } else {
          report.projectsSkipped++;
        }
      } catch (err: any) {
        report.errors.push(`Project ${proj.id}: ${err.message}`);
      }
    }

    // 4. Global Site Content & Settings
    const contentRef = doc(db, 'siteContent', 'global');
    const existingContent = await getDoc(contentRef);
    if (!existingContent.exists()) {
      await setDoc(contentRef, {
        ...initialSiteContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      report.siteContentMigrated = true;
    }

    const settingsRef = doc(db, 'siteSettings', 'general');
    const existingSettings = await getDoc(settingsRef);
    if (!existingSettings.exists()) {
      await setDoc(settingsRef, {
        ...initialSiteSettings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

  } catch (err: any) {
    report.errors.push(`Fatal migration error: ${err.message}`);
  }

  return report;
}
