import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  FirestorePhotoItem,
  FirestoreVideoItem,
  FirestoreProjectItem,
  FirestoreSiteContent,
  FirestoreSiteSettings,
} from '../types/admin';
import {
  subscribePhotos,
  subscribeVideos,
  subscribeProjects,
  subscribeSiteContent,
  subscribeSiteSettings,
  savePhoto,
  removePhoto,
  reorderPhotos,
  saveVideo,
  removeVideo,
  reorderVideos,
  saveProject,
  removeProject,
  reorderProjects,
  saveSiteContent,
  saveSiteSettings,
  initialPhotos,
  initialVideos,
  initialSiteContent,
  initialSiteSettings,
} from '../services/contentService';
import { isFirebaseConfigured } from '../lib/firebase';
import { projects as initialProjects } from '../config/site';

interface SiteContentContextType {
  photos: FirestorePhotoItem[];
  videos: FirestoreVideoItem[];
  projects: FirestoreProjectItem[];
  siteContent: FirestoreSiteContent;
  settings: FirestoreSiteSettings;
  isLoading: boolean;
  isFirebaseActive: boolean;
  // Mutations
  updatePhoto: (photo: FirestorePhotoItem) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  updatePhotoOrder: (ids: string[]) => Promise<void>;
  updateVideo: (video: FirestoreVideoItem) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  updateVideoOrder: (ids: string[]) => Promise<void>;
  updateProject: (project: FirestoreProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectOrder: (ids: string[]) => Promise<void>;
  updateSiteContentSection: (content: Partial<FirestoreSiteContent>) => Promise<void>;
  updateSettings: (settings: Partial<FirestoreSiteSettings>) => Promise<void>;
}

const defaultProjectsFallback: FirestoreProjectItem[] = initialProjects.map((p, idx) => ({
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
  metrics: p.metrics,
}));

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<FirestorePhotoItem[]>(initialPhotos);
  const [videos, setVideos] = useState<FirestoreVideoItem[]>(initialVideos);
  const [projectsList, setProjectsList] = useState<FirestoreProjectItem[]>(defaultProjectsFallback);
  const [siteContent, setSiteContent] = useState<FirestoreSiteContent>(initialSiteContent);
  const [settings, setSettings] = useState<FirestoreSiteSettings>(initialSiteSettings);
  const [isLoading, setIsLoading] = useState(true);
  const isFirebaseActive = isFirebaseConfigured();

  useEffect(() => {
    let unsubCount = 0;
    const checkDone = () => {
      unsubCount++;
      if (unsubCount >= 4) {
        setIsLoading(false);
      }
    };

    const unsubPhotos = subscribePhotos((data) => {
      setPhotos(data);
      checkDone();
    });

    const unsubVideos = subscribeVideos((data) => {
      setVideos(data);
      checkDone();
    });

    const unsubProjects = subscribeProjects((data) => {
      setProjectsList(data);
      checkDone();
    });

    const unsubContent = subscribeSiteContent((data) => {
      setSiteContent(data);
      checkDone();
    });

    const unsubSettings = subscribeSiteSettings((data) => {
      setSettings(data);
    });

    return () => {
      unsubPhotos();
      unsubVideos();
      unsubProjects();
      unsubContent();
      unsubSettings();
    };
  }, []);

  const updatePhoto = async (photo: FirestorePhotoItem) => {
    setPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === photo.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = photo;
        return copy;
      }
      return [photo, ...prev];
    });
    await savePhoto(photo);
  };

  const deletePhoto = async (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    await removePhoto(id);
  };

  const updatePhotoOrder = async (ids: string[]) => {
    setPhotos((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return ids
        .map((id, index) => {
          const item = map.get(id);
          return item ? { ...item, sortOrder: index } : null;
        })
        .filter(Boolean) as FirestorePhotoItem[];
    });
    await reorderPhotos(ids);
  };

  const updateVideo = async (video: FirestoreVideoItem) => {
    setVideos((prev) => {
      const idx = prev.findIndex((v) => v.id === video.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = video;
        return copy;
      }
      return [video, ...prev];
    });
    await saveVideo(video);
  };

  const deleteVideo = async (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    await removeVideo(id);
  };

  const updateVideoOrder = async (ids: string[]) => {
    setVideos((prev) => {
      const map = new Map(prev.map((v) => [v.id, v]));
      return ids
        .map((id, index) => {
          const item = map.get(id);
          return item ? { ...item, sortOrder: index } : null;
        })
        .filter(Boolean) as FirestoreVideoItem[];
    });
    await reorderVideos(ids);
  };

  const updateProject = async (project: FirestoreProjectItem) => {
    setProjectsList((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = project;
        return copy;
      }
      return [project, ...prev];
    });
    await saveProject(project);
  };

  const deleteProject = async (id: string) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    await removeProject(id);
  };

  const updateProjectOrder = async (ids: string[]) => {
    setProjectsList((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return ids
        .map((id, index) => {
          const item = map.get(id);
          return item ? { ...item, sortOrder: index } : null;
        })
        .filter(Boolean) as FirestoreProjectItem[];
    });
    await reorderProjects(ids);
  };

  const updateSiteContentSection = async (content: Partial<FirestoreSiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...content }));
    await saveSiteContent(content);
  };

  const updateSettings = async (newSettings: Partial<FirestoreSiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    await saveSiteSettings(newSettings);
  };

  return (
    <SiteContentContext.Provider
      value={{
        photos,
        videos,
        projects: projectsList,
        siteContent,
        settings,
        isLoading,
        isFirebaseActive,
        updatePhoto,
        deletePhoto,
        updatePhotoOrder,
        updateVideo,
        deleteVideo,
        updateVideoOrder,
        updateProject,
        deleteProject,
        updateProjectOrder,
        updateSiteContentSection,
        updateSettings,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentContextType {
  const context = useContext(SiteContentContext);
  if (!context) {
    return {
      photos: initialPhotos,
      videos: initialVideos,
      projects: defaultProjectsFallback,
      siteContent: initialSiteContent,
      settings: initialSiteSettings,
      isLoading: false,
      isFirebaseActive: false,
      updatePhoto: async () => {},
      deletePhoto: async () => {},
      updatePhotoOrder: async () => {},
      updateVideo: async () => {},
      deleteVideo: async () => {},
      updateVideoOrder: async () => {},
      updateProject: async () => {},
      deleteProject: async () => {},
      updateProjectOrder: async () => {},
      updateSiteContentSection: async () => {},
      updateSettings: async () => {},
    };
  }
  return context;
}
