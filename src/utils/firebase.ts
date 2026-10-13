import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
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
import { Project, Photo, VideoItem, TimelineItem, TechItem, PolaroidPhoto, SiteConfig } from '../types';

// Initialize Firebase App & Firestore with configured databaseId
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
const auth = getAuth(app);

export { app, db, auth };

// Error handling conforming to the FirestoreErrorInfo standard
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
  return errInfo;
}

// Connection check using getDocFromServer
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing in fallback mode.');
    }
  }
}
// Run test connection
testConnection();

// Document references
const SITE_PROFILE_REF = doc(db, 'portfolios', 'site_profile');
const VIDEOGRAPHY_CATALOG_REF = doc(db, 'portfolios', 'videography_catalog');
const PHOTOGRAPHY_CATALOG_REF = doc(db, 'portfolios', 'photography_catalog');
const PROJECTS_CATALOG_REF = doc(db, 'portfolios', 'projects_catalog');
const TIMELINE_CATALOG_REF = doc(db, 'portfolios', 'timeline_catalog');
const SKILLS_CATALOG_REF = doc(db, 'portfolios', 'skills_catalog');
const POLAROIDS_CATALOG_REF = doc(db, 'portfolios', 'polaroids_catalog');
const ADMIN_CREDS_REF = doc(db, 'portfolios', 'admin_credentials');

/* ==========================================================
   1. SITE PROFILE & METADATA
   ========================================================== */
export async function fetchSiteProfileFromFirebase(): Promise<SiteConfig | null> {
  const path = 'portfolios/site_profile';
  try {
    const snap = await getDoc(SITE_PROFILE_REF);
    if (snap.exists()) {
      return snap.data() as SiteConfig;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveSiteProfileToFirebase(profile: Partial<SiteConfig>): Promise<void> {
  const path = 'portfolios/site_profile';
  try {
    await setDoc(SITE_PROFILE_REF, {
      ...profile,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToSiteProfile(callback: (data: SiteConfig) => void): Unsubscribe {
  const path = 'portfolios/site_profile';
  return onSnapshot(SITE_PROFILE_REF, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as SiteConfig);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   2. VIDEOGRAPHY CATALOG (VIDEOS & CATEGORIES)
   ========================================================== */
export async function fetchCatalogFromFirebase(): Promise<{ videos: any[]; categories: string[] } | null> {
  const path = 'portfolios/videography_catalog';
  try {
    const snap = await getDoc(VIDEOGRAPHY_CATALOG_REF);
    if (snap.exists()) {
      return snap.data() as { videos: any[]; categories: string[] };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveCatalogToFirebase(videos: any[], categories: string[]): Promise<void> {
  const path = 'portfolios/videography_catalog';
  try {
    await setDoc(VIDEOGRAPHY_CATALOG_REF, {
      videos,
      categories,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToCatalog(callback: (data: { videos: any[]; categories: string[] }) => void): Unsubscribe {
  const path = 'portfolios/videography_catalog';
  return onSnapshot(VIDEOGRAPHY_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as { videos: any[]; categories: string[] });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   3. PHOTOGRAPHY CATALOG (PHOTOS & CATEGORIES)
   ========================================================== */
export async function fetchPhotographyCatalogFromFirebase(): Promise<{ photos: Photo[]; categories: string[] } | null> {
  const path = 'portfolios/photography_catalog';
  try {
    const snap = await getDoc(PHOTOGRAPHY_CATALOG_REF);
    if (snap.exists()) {
      return snap.data() as { photos: Photo[]; categories: string[] };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function savePhotographyCatalogToFirebase(photos: any[], categories: any[]): Promise<void> {
  const path = 'portfolios/photography_catalog';
  try {
    await setDoc(PHOTOGRAPHY_CATALOG_REF, {
      photos,
      categories,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToPhotographyCatalog(callback: (data: { photos: any[]; categories: any[] }) => void): Unsubscribe {
  const path = 'portfolios/photography_catalog';
  return onSnapshot(PHOTOGRAPHY_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as { photos: any[]; categories: any[] });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   4. PROJECTS CATALOG
   ========================================================== */
export async function fetchProjectsCatalogFromFirebase(): Promise<Project[] | null> {
  const path = 'portfolios/projects_catalog';
  try {
    const snap = await getDoc(PROJECTS_CATALOG_REF);
    if (snap.exists()) {
      const data = snap.data();
      return (data.projects || []) as Project[];
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveProjectsCatalogToFirebase(projects: Project[]): Promise<void> {
  const path = 'portfolios/projects_catalog';
  try {
    await setDoc(PROJECTS_CATALOG_REF, {
      projects,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToProjectsCatalog(callback: (projects: Project[]) => void): Unsubscribe {
  const path = 'portfolios/projects_catalog';
  return onSnapshot(PROJECTS_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback((data.projects || []) as Project[]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   5. TIMELINE (EXPERIENCE & EDUCATION)
   ========================================================== */
export async function fetchTimelineFromFirebase(): Promise<TimelineItem[] | null> {
  const path = 'portfolios/timeline_catalog';
  try {
    const snap = await getDoc(TIMELINE_CATALOG_REF);
    if (snap.exists()) {
      const data = snap.data();
      return (data.items || []) as TimelineItem[];
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveTimelineToFirebase(items: TimelineItem[]): Promise<void> {
  const path = 'portfolios/timeline_catalog';
  try {
    await setDoc(TIMELINE_CATALOG_REF, {
      items,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToTimeline(callback: (items: TimelineItem[]) => void): Unsubscribe {
  const path = 'portfolios/timeline_catalog';
  return onSnapshot(TIMELINE_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback((data.items || []) as TimelineItem[]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   6. SKILLS & TECH STACK
   ========================================================== */
export async function fetchSkillsFromFirebase(): Promise<{ techCategories: any[]; techStack: TechItem[] } | null> {
  const path = 'portfolios/skills_catalog';
  try {
    const snap = await getDoc(SKILLS_CATALOG_REF);
    if (snap.exists()) {
      const data = snap.data();
      return {
        techCategories: data.techCategories || defaultTechCategories,
        techStack: data.techStack || defaultTechStack
      };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveSkillsToFirebase(techCategories: any[], techStack: TechItem[]): Promise<void> {
  const path = 'portfolios/skills_catalog';
  try {
    await setDoc(SKILLS_CATALOG_REF, {
      techCategories,
      techStack,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToSkills(callback: (data: { techCategories: any[]; techStack: TechItem[] }) => void): Unsubscribe {
  const path = 'portfolios/skills_catalog';
  return onSnapshot(SKILLS_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback({
        techCategories: data.techCategories || defaultTechCategories,
        techStack: data.techStack || defaultTechStack
      });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   7. POLAROIDS CATALOG
   ========================================================== */
export async function fetchPolaroidsFromFirebase(): Promise<PolaroidPhoto[] | null> {
  const path = 'portfolios/polaroids_catalog';
  try {
    const snap = await getDoc(POLAROIDS_CATALOG_REF);
    if (snap.exists()) {
      const data = snap.data();
      return (data.polaroids || []) as PolaroidPhoto[];
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function savePolaroidsToFirebase(polaroids: PolaroidPhoto[]): Promise<void> {
  const path = 'portfolios/polaroids_catalog';
  try {
    await setDoc(POLAROIDS_CATALOG_REF, {
      polaroids,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToPolaroids(callback: (polaroids: PolaroidPhoto[]) => void): Unsubscribe {
  const path = 'portfolios/polaroids_catalog';
  return onSnapshot(POLAROIDS_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback((data.polaroids || []) as PolaroidPhoto[]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   8. ADMIN CREDENTIALS
   ========================================================== */
export async function fetchAdminCredsFromFirebase(): Promise<{ id: string; pass: string } | null> {
  const path = 'portfolios/admin_credentials';
  try {
    const snap = await getDoc(ADMIN_CREDS_REF);
    if (snap.exists()) {
      return snap.data() as { id: string; pass: string };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveAdminCredsToFirebase(id: string, pass: string): Promise<void> {
  const path = 'portfolios/admin_credentials';
  try {
    await setDoc(ADMIN_CREDS_REF, {
      id,
      pass,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToAdminCreds(callback: (creds: { id: string; pass: string }) => void): Unsubscribe {
  const path = 'portfolios/admin_credentials';
  return onSnapshot(ADMIN_CREDS_REF, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as { id: string; pass: string });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, path);
  });
}

/* ==========================================================
   9. CONTACT MESSAGES (VISITOR INQUIRIES)
   ========================================================== */
export async function saveContactMessageToFirebase(messageData: Record<string, any>): Promise<void> {
  const path = 'contact_messages';
  try {
    await addDoc(collection(db, path), {
      ...messageData,
      createdAt: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function fetchContactMessagesFromFirebase(): Promise<any[]> {
  const path = 'contact_messages';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToContactMessages(callback: (messages: any[]) => void): Unsubscribe {
  const path = 'contact_messages';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, path);
  });
}

/* ==========================================================
   10. AUTO-INITIALIZE & SEED ALL WEBSITE DATA IN FIREBASE
   Ensures that every data entity across the entire website
   is fully seeded and active in Firebase Firestore!
   ========================================================== */
let hasSeeded = false;

export async function initializeAllDataInFirebase(): Promise<void> {
  if (hasSeeded) return;
  hasSeeded = true;

  try {
    // 1. Site Profile
    const siteSnap = await getDoc(SITE_PROFILE_REF);
    if (!siteSnap.exists()) {
      await setDoc(SITE_PROFILE_REF, {
        ...defaultSiteConfig,
        updatedAt: Date.now()
      });
    }

    // 2. Videography Catalog
    const videoSnap = await getDoc(VIDEOGRAPHY_CATALOG_REF);
    if (!videoSnap.exists()) {
      const defaultCategories = ['ALL', 'DRIVE STREAM REEL', 'CINEMATIC REEL', 'DRONE REEL', 'MOTION & VFX', 'CREATIVE DIRECTION', 'COMMERCIAL FILM'];
      await setDoc(VIDEOGRAPHY_CATALOG_REF, {
        videos: defaultVideography,
        categories: defaultCategories,
        updatedAt: Date.now()
      });
    }

    // 3. Photography Catalog
    const photoSnap = await getDoc(PHOTOGRAPHY_CATALOG_REF);
    if (!photoSnap.exists()) {
      const defaultPhotoCategories = ['ALL', 'PHOTOGRAPHY', 'NIGHT PHOTOGRAPHY'];
      await setDoc(PHOTOGRAPHY_CATALOG_REF, {
        photos: defaultPhotography,
        categories: defaultPhotoCategories,
        updatedAt: Date.now()
      });
    }

    // 4. Projects Catalog
    const projSnap = await getDoc(PROJECTS_CATALOG_REF);
    if (!projSnap.exists()) {
      await setDoc(PROJECTS_CATALOG_REF, {
        projects: defaultProjects,
        updatedAt: Date.now()
      });
    }

    // 5. Timeline Catalog
    const timelineSnap = await getDoc(TIMELINE_CATALOG_REF);
    if (!timelineSnap.exists()) {
      await setDoc(TIMELINE_CATALOG_REF, {
        items: defaultTimelineItems,
        updatedAt: Date.now()
      });
    }

    // 6. Skills Catalog
    const skillsSnap = await getDoc(SKILLS_CATALOG_REF);
    if (!skillsSnap.exists()) {
      await setDoc(SKILLS_CATALOG_REF, {
        techCategories: defaultTechCategories,
        techStack: defaultTechStack,
        updatedAt: Date.now()
      });
    }

    // 7. Polaroids Catalog
    const polSnap = await getDoc(POLAROIDS_CATALOG_REF);
    if (!polSnap.exists()) {
      await setDoc(POLAROIDS_CATALOG_REF, {
        polaroids: defaultPolaroids,
        updatedAt: Date.now()
      });
    }

    // 8. Admin Credentials
    const credSnap = await getDoc(ADMIN_CREDS_REF);
    if (!credSnap.exists()) {
      await setDoc(ADMIN_CREDS_REF, {
        id: 'admin',
        pass: 'admin123',
        updatedAt: Date.now()
      });
    }

    console.info('Firebase Firestore: All website data sets initialized successfully.');
  } catch (err) {
    console.warn('Firebase seeding non-blocking note:', err);
  }
}
