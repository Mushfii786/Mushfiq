import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export { app, db };

const CATALOG_DOC_REF = doc(db, 'portfolios', 'videography_catalog');
const ADMIN_CREDS_REF = doc(db, 'portfolios', 'admin_credentials');

export async function fetchCatalogFromFirebase(): Promise<{ videos: any[]; categories: string[] } | null> {
  try {
    const snap = await getDoc(CATALOG_DOC_REF);
    if (snap.exists()) {
      return snap.data() as { videos: any[]; categories: string[] };
    }
    return null;
  } catch (err) {
    console.error('Error fetching catalog from Firebase:', err);
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
  } catch (err) {
    console.error('Error saving catalog to Firebase:', err);
  }
}

export function subscribeToCatalog(callback: (data: { videos: any[]; categories: string[] }) => void) {
  return onSnapshot(CATALOG_DOC_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as { videos: any[]; categories: string[] };
      callback(data);
    }
  }, (err) => {
    console.error('Firestore subscription error:', err);
  });
}

// Photography Catalog sync with Firebase
const PHOTO_CATALOG_REF = doc(db, 'portfolios', 'photography_catalog');

export async function fetchPhotographyCatalogFromFirebase(): Promise<{ photos: any[]; categories: any[] } | null> {
  try {
    const snap = await getDoc(PHOTO_CATALOG_REF);
    if (snap.exists()) {
      return snap.data() as { photos: any[]; categories: any[] };
    }
    return null;
  } catch (err) {
    console.error('Error fetching photography catalog from Firebase:', err);
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
  } catch (err) {
    console.error('Error saving photography catalog to Firebase:', err);
  }
}

export function subscribeToPhotographyCatalog(callback: (data: { photos: any[]; categories: any[] }) => void) {
  return onSnapshot(PHOTO_CATALOG_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as { photos: any[]; categories: any[] };
      callback(data);
    }
  }, (err) => {
    console.error('Firestore photography subscription error:', err);
  });
}

// Admin Credentials sync with Firebase
export async function fetchAdminCredsFromFirebase(): Promise<{ id: string; pass: string } | null> {
  try {
    const snap = await getDoc(ADMIN_CREDS_REF);
    if (snap.exists()) {
      return snap.data() as { id: string; pass: string };
    }
    return null;
  } catch (err) {
    console.error('Error fetching admin credentials from Firebase:', err);
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
  } catch (err) {
    console.error('Error saving admin credentials to Firebase:', err);
  }
}

// Contact messages storage in Firebase
export async function saveContactMessageToFirebase(messageData: Record<string, any>): Promise<void> {
  try {
    await addDoc(collection(db, 'contact_messages'), {
      ...messageData,
      createdAt: Date.now()
    });
  } catch (err) {
    console.error('Error saving contact message to Firebase:', err);
    throw err;
  }
}

export async function fetchContactMessagesFromFirebase(): Promise<any[]> {
  try {
    const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error fetching contact messages from Firebase:', err);
    return [];
  }
}

export function subscribeToContactMessages(callback: (messages: any[]) => void) {
  const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (err) => {
    console.error('Contact messages subscription error:', err);
  });
}
