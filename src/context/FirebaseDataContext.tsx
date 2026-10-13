import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  siteConfig as defaultSiteConfig,
  projects as defaultProjects,
  photography as defaultPhotography,
  videography as defaultVideography,
  timelineItems as defaultTimelineItems,
  techCategories as defaultTechCategories,
  techStack as defaultTechStack,
  polaroids as defaultPolaroids
} from '../config/site';
import {
  initializeAllDataInFirebase,
  subscribeToSiteProfile,
  subscribeToCatalog,
  subscribeToPhotographyCatalog,
  subscribeToProjectsCatalog,
  subscribeToTimeline,
  subscribeToSkills,
  subscribeToPolaroids,
  subscribeToContactMessages,
  saveSiteProfileToFirebase,
  saveCatalogToFirebase,
  savePhotographyCatalogToFirebase,
  saveProjectsCatalogToFirebase,
  saveTimelineToFirebase,
  saveSkillsToFirebase,
  savePolaroidsToFirebase,
  saveContactMessageToFirebase
} from '../utils/firebase';
import { SiteConfig, Project, Photo, VideoItem, TimelineItem, TechItem, PolaroidPhoto } from '../types';

interface FirebaseDataContextType {
  siteProfile: SiteConfig;
  projects: Project[];
  photos: Photo[];
  photoCategories: string[];
  videos: VideoItem[];
  videoCategories: string[];
  timeline: TimelineItem[];
  techCategories: any[];
  techStack: TechItem[];
  polaroids: PolaroidPhoto[];
  contactMessages: any[];
  isLoaded: boolean;
  updateSiteProfile: (profile: Partial<SiteConfig>) => Promise<void>;
  updateProjects: (projects: Project[]) => Promise<void>;
  updateVideos: (videos: VideoItem[], categories: string[]) => Promise<void>;
  updatePhotos: (photos: Photo[], categories: string[]) => Promise<void>;
  updateTimeline: (items: TimelineItem[]) => Promise<void>;
  updateSkills: (techCategories: any[], techStack: TechItem[]) => Promise<void>;
  updatePolaroids: (polaroids: PolaroidPhoto[]) => Promise<void>;
  sendContactMessage: (data: Record<string, any>) => Promise<void>;
}

const FirebaseDataContext = createContext<FirebaseDataContextType | null>(null);

export function FirebaseDataProvider({ children }: { children: React.ReactNode }) {
  const [siteProfile, setSiteProfile] = useState<SiteConfig>(defaultSiteConfig);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [photos, setPhotos] = useState<Photo[]>(defaultPhotography);
  const [photoCategories, setPhotoCategories] = useState<string[]>(['ALL', 'PHOTOGRAPHY', 'NIGHT PHOTOGRAPHY']);
  const [videos, setVideos] = useState<VideoItem[]>(defaultVideography);
  const [videoCategories, setVideoCategories] = useState<string[]>([
    'ALL', 'DRIVE STREAM REEL', 'CINEMATIC REEL', 'DRONE REEL', 'MOTION & VFX', 'CREATIVE DIRECTION', 'COMMERCIAL FILM'
  ]);
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimelineItems);
  const [techCategories, setTechCategories] = useState<any[]>(defaultTechCategories);
  const [techStack, setTechStack] = useState<TechItem[]>(defaultTechStack);
  const [polaroids, setPolaroids] = useState<PolaroidPhoto[]>(defaultPolaroids);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initialize & Seed All Data into Firebase Firestore
    initializeAllDataInFirebase().catch(console.error);

    // 2. Attach real-time subscriptions to all Firestore data collections
    const unsubProfile = subscribeToSiteProfile((data) => {
      if (data && data.name) {
        setSiteProfile((prev) => ({ ...prev, ...data }));
      }
    });

    const unsubProjects = subscribeToProjectsCatalog((projs) => {
      if (Array.isArray(projs) && projs.length > 0) {
        setProjects(projs);
      }
    });

    const unsubVideos = subscribeToCatalog((data) => {
      if (data && Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos(data.videos);
      }
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        setVideoCategories(data.categories);
      }
    });

    const unsubPhotos = subscribeToPhotographyCatalog((data) => {
      if (data && Array.isArray(data.photos) && data.photos.length > 0) {
        setPhotos(data.photos);
      }
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        setPhotoCategories(data.categories);
      }
    });

    const unsubTimeline = subscribeToTimeline((items) => {
      if (Array.isArray(items) && items.length > 0) {
        setTimeline(items);
      }
    });

    const unsubSkills = subscribeToSkills((data) => {
      if (data && Array.isArray(data.techCategories)) {
        setTechCategories(data.techCategories);
      }
      if (data && Array.isArray(data.techStack)) {
        setTechStack(data.techStack);
      }
    });

    const unsubPolaroids = subscribeToPolaroids((pols) => {
      if (Array.isArray(pols) && pols.length > 0) {
        setPolaroids(pols);
      }
    });

    const unsubMessages = subscribeToContactMessages((msgs) => {
      if (Array.isArray(msgs)) {
        setContactMessages(msgs);
      }
    });

    setIsLoaded(true);

    return () => {
      unsubProfile();
      unsubProjects();
      unsubVideos();
      unsubPhotos();
      unsubTimeline();
      unsubSkills();
      unsubPolaroids();
      unsubMessages();
    };
  }, []);

  const updateSiteProfile = async (profile: Partial<SiteConfig>) => {
    setSiteProfile((prev) => ({ ...prev, ...profile }));
    await saveSiteProfileToFirebase(profile);
  };

  const updateProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    await saveProjectsCatalogToFirebase(newProjects);
  };

  const updateVideos = async (newVideos: VideoItem[], newCategories: string[]) => {
    setVideos(newVideos);
    setVideoCategories(newCategories);
    await saveCatalogToFirebase(newVideos, newCategories);
  };

  const updatePhotos = async (newPhotos: Photo[], newCategories: string[]) => {
    setPhotos(newPhotos);
    setPhotoCategories(newCategories);
    await savePhotographyCatalogToFirebase(newPhotos, newCategories);
  };

  const updateTimeline = async (items: TimelineItem[]) => {
    setTimeline(items);
    await saveTimelineToFirebase(items);
  };

  const updateSkills = async (newTechCats: any[], newTechStack: TechItem[]) => {
    setTechCategories(newTechCats);
    setTechStack(newTechStack);
    await saveSkillsToFirebase(newTechCats, newTechStack);
  };

  const updatePolaroids = async (newPolaroids: PolaroidPhoto[]) => {
    setPolaroids(newPolaroids);
    await savePolaroidsToFirebase(newPolaroids);
  };

  const sendContactMessage = async (data: Record<string, any>) => {
    await saveContactMessageToFirebase(data);
  };

  return (
    <FirebaseDataContext.Provider
      value={{
        siteProfile,
        projects,
        photos,
        photoCategories,
        videos,
        videoCategories,
        timeline,
        techCategories,
        techStack,
        polaroids,
        contactMessages,
        isLoaded,
        updateSiteProfile,
        updateProjects,
        updateVideos,
        updatePhotos,
        updateTimeline,
        updateSkills,
        updatePolaroids,
        sendContactMessage
      }}
    >
      {children}
    </FirebaseDataContext.Provider>
  );
}

export function useFirebaseData() {
  const context = useContext(FirebaseDataContext);
  if (!context) {
    throw new Error('useFirebaseData must be used within a FirebaseDataProvider');
  }
  return context;
}
