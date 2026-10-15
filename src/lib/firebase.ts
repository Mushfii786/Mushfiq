import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type Auth, type User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  type Firestore 
} from 'firebase/firestore';

// Environment variables for Firebase Web SDK
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey.length > 5
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.warn('Firebase initialization error, running in offline fallback mode:', error);
  }
} else {
  // Graceful fallback dummy objects to avoid undefined crashes
}

export { app, auth, db, googleProvider };

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message: string;
  createdAt?: string | number | null;
  read?: boolean;
}

const LOCAL_INQUIRIES_KEY = 'mushfiq_portfolio_inquiries_local';

/**
 * Save contact message to Firestore and fallback to localStorage
 */
export async function saveContactMessage(msg: {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message: string;
}): Promise<void> {
  const newMsg: ContactMessage = {
    ...msg,
    createdAt: new Date().toISOString(),
    read: false,
    id: `inq-${Date.now()}`
  };

  // Always keep a local copy
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_INQUIRIES_KEY) || '[]');
    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify([newMsg, ...existing]));
  } catch {}

  // If Firebase is live, save to Firestore 'inquiries' collection
  if (db && isFirebaseConfigured) {
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...msg,
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch (err) {
      console.warn('Could not save to Firestore, saved to local cache:', err);
    }
  }
}

/**
 * Save custom video to Firestore
 */
export async function saveVideoToFirestore(video: any): Promise<void> {
  if (db && isFirebaseConfigured && video && video.id) {
    try {
      const cleanVideo = { ...video };
      // Strip any complex non-serializable objects
      await setDoc(doc(db, 'videos', String(video.id)), {
        ...cleanVideo,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore video sync skipped:', err);
    }
  }
}

/**
 * Delete custom video from Firestore
 */
export async function deleteVideoFromFirestore(id: string): Promise<void> {
  if (db && isFirebaseConfigured && id) {
    try {
      await deleteDoc(doc(db, 'videos', String(id)));
    } catch (err) {
      console.warn('Firestore video delete skipped:', err);
    }
  }
}

/**
 * Retrieve inquiries from Firestore or fallback to localStorage
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const remote = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          message: data.message || '',
          createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          read: Boolean(data.read),
        } as ContactMessage;
      });
      if (remote.length > 0) return remote;
    } catch (err) {
      console.warn('Reading remote inquiries failed, using local cache:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
