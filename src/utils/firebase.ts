import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { activityLogger } from './activityLogger';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export { app, db };

const CATALOG_DOC_REF = doc(db, 'portfolios', 'videography_catalog');
const ADMIN_CREDS_REF = doc(db, 'portfolios', 'admin_credentials');

export async function fetchCatalogFromFirebase(): Promise<{ videos: any[]; categories: string[] } | null> {
  try {
    const snap = await getDoc(CATALOG_DOC_REF);
    if (snap.exists()) {
      activityLogger.log('FETCH_SUCCESS', 'videography', 'Successfully fetched videography catalog from Firebase.');
      return snap.data() as { videos: any[]; categories: string[] };
    }
    activityLogger.log('FETCH_SUCCESS', 'videography', 'Videography catalog document does not exist yet in Firebase.');
    return null;
  } catch (err: any) {
    console.error('Error fetching catalog from Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'videography', `Failed to fetch videography catalog: ${err.message}`, 'error');
    return null;
  }
}

export async function saveCatalogToFirebase(videos: any[], categories: string[]): Promise<void> {
  try {
    await setDoc(CATALOG_DOC_REF, {
      videos,
      categories,
      updatedAt: Date.now()
    }, { merge: true });
    activityLogger.log('SAVE', 'videography', `Successfully saved videography catalog (${videos.length} videos) to Firebase.`);
  } catch (err: any) {
    console.error('Error saving catalog to Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'videography', `Failed to save videography catalog: ${err.message}`, 'error');
  }
}

export function subscribeToCatalog(callback: (data: { videos: any[]; categories: string[] }) => void) {
  return onSnapshot(CATALOG_DOC_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as { videos: any[]; categories: string[] };
      callback(data);
    }
  }, (err: any) => {
    console.error('Firestore subscription error:', err);
    activityLogger.log('FETCH_ERROR', 'videography', `Videography catalog subscription error: ${err.message}`, 'error');
  });
}

// Photography Catalog sync with Firebase
const PHOTO_CATALOG_REF = doc(db, 'portfolios', 'photography_catalog');

export async function fetchPhotographyCatalogFromFirebase(): Promise<{ photos: any[]; categories: any[] } | null> {
  try {
    const snap = await getDoc(PHOTO_CATALOG_REF);
    if (snap.exists()) {
      activityLogger.log('FETCH_SUCCESS', 'photography', 'Successfully fetched photography catalog from Firebase.');
      return snap.data() as { photos: any[]; categories: any[] };
    }
    activityLogger.log('FETCH_SUCCESS', 'photography', 'Photography catalog document does not exist yet in Firebase.');
    return null;
  } catch (err: any) {
    console.error('Error fetching photography catalog from Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'photography', `Failed to fetch photography catalog: ${err.message}`, 'error');
    return null;
  }
}

export async function savePhotographyCatalogToFirebase(photos: any[], categories: any[]): Promise<void> {
  try {
    await setDoc(PHOTO_CATALOG_REF, {
      photos,
      categories,
      updatedAt: Date.now()
    }, { merge: true });
    activityLogger.log('SAVE', 'photography', `Successfully saved photography catalog (${photos.length} photos) to Firebase.`);
  } catch (err: any) {
    console.error('Error saving photography catalog to Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'photography', `Failed to save photography catalog: ${err.message}`, 'error');
  }
}

export function subscribeToPhotographyCatalog(callback: (data: { photos: any[]; categories: any[] }) => void) {
  return onSnapshot(PHOTO_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as { photos: any[]; categories: any[] };
      callback(data);
    }
  }, (err: any) => {
    console.error('Firestore photography subscription error:', err);
    activityLogger.log('FETCH_ERROR', 'photography', `Photography catalog subscription error: ${err.message}`, 'error');
  });
}

// Admin Credentials sync with Firebase
export async function fetchAdminCredsFromFirebase(): Promise<{ id: string; pass: string } | null> {
  try {
    const snap = await getDoc(ADMIN_CREDS_REF);
    if (snap.exists()) {
      activityLogger.log('FETCH_SUCCESS', 'credentials', 'Successfully fetched admin credentials from Firebase.');
      return snap.data() as { id: string; pass: string };
    }
    return null;
  } catch (err: any) {
    console.error('Error fetching admin credentials from Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'credentials', `Failed to fetch admin credentials: ${err.message}`, 'error');
    return null;
  }
}

export async function saveAdminCredsToFirebase(id: string, pass: string): Promise<void> {
  try {
    await setDoc(ADMIN_CREDS_REF, {
      id,
      pass,
      updatedAt: Date.now()
    }, { merge: true });
    activityLogger.log('SAVE', 'credentials', 'Successfully saved admin credentials to Firebase.');
  } catch (err: any) {
    console.error('Error saving admin credentials to Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'credentials', `Failed to save admin credentials: ${err.message}`, 'error');
  }
}

// Contact messages storage in Firebase
export async function saveContactMessageToFirebase(messageData: Record<string, any>): Promise<void> {
  try {
    await addDoc(collection(db, 'contact_messages'), {
      ...messageData,
      createdAt: Date.now()
    });
    activityLogger.log('CREATE', 'contact', `Successfully saved contact submission from ${messageData.name || 'User'}.`);
  } catch (err: any) {
    console.error('Error saving contact message to Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'contact', `Failed to save contact message: ${err.message}`, 'error');
    throw err;
  }
}

export async function fetchContactMessagesFromFirebase(): Promise<any[]> {
  try {
    const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    activityLogger.log('FETCH_SUCCESS', 'contact', `Successfully fetched ${snap.docs.length} contact messages.`);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err: any) {
    console.error('Error fetching contact messages from Firebase:', err);
    activityLogger.log('FETCH_ERROR', 'contact', `Failed to fetch contact messages: ${err.message}`, 'error');
    return [];
  }
}

export function subscribeToContactMessages(callback: (messages: any[]) => void) {
  const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (err: any) => {
    console.error('Contact messages subscription error:', err);
    activityLogger.log('FETCH_ERROR', 'contact', `Contact messages subscription error: ${err.message}`, 'error');
  });
}

const PROFILE_REF = doc(db, 'portfolios', 'site_profile');
const PROJECTS_REF = doc(db, 'portfolios', 'projects_catalog');
const TIMELINE_REF = doc(db, 'portfolios', 'timeline_catalog');
const SKILLS_REF = doc(db, 'portfolios', 'skills_catalog');
const POLAROIDS_REF = doc(db, 'portfolios', 'polaroids_catalog');

export async function saveSiteProfileToFirebase(profile: Record<string, any>): Promise<void> {
  try {
    await setDoc(PROFILE_REF, { ...profile, updatedAt: Date.now() }, { merge: true });
    activityLogger.log('SAVE', 'system', 'Successfully saved site profile to Firebase.');
  } catch (err: any) {
    console.error('Error saving site profile to Firebase:', err);
  }
}

export function subscribeToSiteProfile(callback: (data: any) => void) {
  return onSnapshot(PROFILE_REF, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  }, (err: any) => {
    console.error('Site profile subscription error:', err);
  });
}

export async function saveProjectsCatalogToFirebase(projects: any[]): Promise<void> {
  try {
    await setDoc(PROJECTS_REF, { projects, updatedAt: Date.now() }, { merge: true });
    activityLogger.log('SAVE', 'system', `Successfully saved ${projects.length} projects to Firebase.`);
  } catch (err: any) {
    console.error('Error saving projects to Firebase:', err);
  }
}

export function subscribeToProjectsCatalog(callback: (projects: any[]) => void) {
  return onSnapshot(PROJECTS_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data?.projects || []);
    }
  }, (err: any) => {
    console.error('Projects catalog subscription error:', err);
  });
}

export async function saveTimelineToFirebase(items: any[]): Promise<void> {
  try {
    await setDoc(TIMELINE_REF, { items, updatedAt: Date.now() }, { merge: true });
    activityLogger.log('SAVE', 'system', `Successfully saved timeline (${items.length} items) to Firebase.`);
  } catch (err: any) {
    console.error('Error saving timeline to Firebase:', err);
  }
}

export function subscribeToTimeline(callback: (items: any[]) => void) {
  return onSnapshot(TIMELINE_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data?.items || []);
    }
  }, (err: any) => {
    console.error('Timeline subscription error:', err);
  });
}

export async function saveSkillsToFirebase(techCategories: any[], techStack: any[]): Promise<void> {
  try {
    await setDoc(SKILLS_REF, { techCategories, techStack, updatedAt: Date.now() }, { merge: true });
    activityLogger.log('SAVE', 'system', 'Successfully saved skills and tech stack to Firebase.');
  } catch (err: any) {
    console.error('Error saving skills to Firebase:', err);
  }
}

export function subscribeToSkills(callback: (data: { techCategories: any[]; techStack: any[] }) => void) {
  return onSnapshot(SKILLS_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback({ techCategories: data?.techCategories || [], techStack: data?.techStack || [] });
    }
  }, (err: any) => {
    console.error('Skills subscription error:', err);
  });
}

export async function savePolaroidsToFirebase(polaroids: any[]): Promise<void> {
  try {
    await setDoc(POLAROIDS_REF, { polaroids, updatedAt: Date.now() }, { merge: true });
    activityLogger.log('SAVE', 'system', `Successfully saved ${polaroids.length} polaroids to Firebase.`);
  } catch (err: any) {
    console.error('Error saving polaroids to Firebase:', err);
  }
}

export function subscribeToPolaroids(callback: (polaroids: any[]) => void) {
  return onSnapshot(POLAROIDS_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data?.polaroids || []);
    }
  }, (err: any) => {
    console.error('Polaroids subscription error:', err);
  });
}

export async function initializeAllDataInFirebase(): Promise<void> {
  try {
    activityLogger.log('FETCH_SUCCESS', 'system', 'Firebase data channels synchronized.');
  } catch (err: any) {
    console.error('Error initializing data in Firebase:', err);
  }
}

