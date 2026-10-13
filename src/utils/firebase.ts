import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export { app, db };

const CATALOG_DOC_REF = doc(db, 'portfolios', 'videography_catalog');

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
