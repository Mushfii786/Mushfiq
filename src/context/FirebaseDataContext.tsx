import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { siteConfig, timelineItems, techStack } from '../config/site';
import { SiteConfig, TimelineItem, TechItem } from '../types';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface FirebaseDataContextType {
  siteProfile: SiteConfig;
  timeline: TimelineItem[];
  techStack: TechItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateSiteProfile: (updated: Partial<SiteConfig>) => Promise<void>;
  updateTimeline: (updated: TimelineItem[]) => Promise<void>;
  updateTechStack: (updated: TechItem[]) => Promise<void>;
}

const LOCAL_PROFILE_KEY = 'mushfiq_site_profile_local';
const LOCAL_TIMELINE_KEY = 'mushfiq_site_timeline_local';
const LOCAL_TECH_KEY = 'mushfiq_site_tech_local';

const FirebaseDataContext = createContext<FirebaseDataContextType>({
  siteProfile: siteConfig,
  timeline: timelineItems,
  techStack: techStack,
  loading: false,
  refreshData: async () => {},
  updateSiteProfile: async () => {},
  updateTimeline: async () => {},
  updateTechStack: async () => {},
});

export function FirebaseDataProvider({ children }: { children: ReactNode }) {
  const [siteProfile, setSiteProfile] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      return saved ? { ...siteConfig, ...JSON.parse(saved) } : siteConfig;
    } catch {
      return siteConfig;
    }
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_TIMELINE_KEY);
      return saved ? JSON.parse(saved) : timelineItems;
    } catch {
      return timelineItems;
    }
  });

  const [techStackState, setTechStackState] = useState<TechItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_TECH_KEY);
      return saved ? JSON.parse(saved) : techStack;
    } catch {
      return techStack;
    }
  });

  const [loading, setLoading] = useState(false);

  // If Firebase is configured, subscribe to Firestore documents for live profile updates
  useEffect(() => {
    if (db && isFirebaseConfigured) {
      try {
        const unsub = onSnapshot(doc(db, 'settings', 'profile'), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setSiteProfile((prev) => {
              const updated = { ...prev, ...data };
              try {
                localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
              } catch {}
              return updated;
            });
          }
        });
        return () => unsub();
      } catch (err) {
        console.warn('Profile snapshot listener error:', err);
      }
    }
  }, []);

  const updateSiteProfile = async (updated: Partial<SiteConfig>) => {
    const next = { ...siteProfile, ...updated };
    setSiteProfile(next);
    try {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));
    } catch {}

    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'settings', 'profile'), updated, { merge: true });
      } catch (err) {
        console.warn('Could not sync profile to Firestore:', err);
      }
    }
  };

  const updateTimeline = async (updated: TimelineItem[]) => {
    setTimeline(updated);
    try {
      localStorage.setItem(LOCAL_TIMELINE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const updateTechStack = async (updated: TechItem[]) => {
    setTechStackState(updated);
    try {
      localStorage.setItem(LOCAL_TECH_KEY, JSON.stringify(updated));
    } catch {}
  };

  const refreshData = async () => {};

  return (
    <FirebaseDataContext.Provider
      value={{
        siteProfile,
        timeline,
        techStack: techStackState,
        loading,
        refreshData,
        updateSiteProfile,
        updateTimeline,
        updateTechStack,
      }}
    >
      {children}
    </FirebaseDataContext.Provider>
  );
}

export function useFirebaseData() {
  return useContext(FirebaseDataContext);
}
export default FirebaseDataContext;
