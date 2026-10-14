import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL: Required by skill)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Storage
export const storage = getStorage(app);

// Check if Firebase configuration is valid and active
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);
}

export { firebaseConfig };

// Standard Error Handler Structure (MANDATORY in Skill)
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation (CRITICAL CONSTRAINT: Boots test connection with getDocFromServer)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Authentication Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Sign in with Google error:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Messages Service
export interface ContactMessageData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
}

export async function saveContactMessage(msg: Omit<ContactMessageData, 'id' | 'createdAt' | 'read'>) {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const path = `messages/${messageId}`;
  const payload = {
    name: msg.name.trim().substring(0, 100),
    email: msg.email.trim().substring(0, 150),
    phone: msg.phone ? msg.phone.trim().substring(0, 30) : '',
    location: msg.location ? msg.location.trim().substring(0, 100) : '',
    message: msg.message.trim().substring(0, 3000),
    createdAt: new Date().toISOString(),
    read: false,
  };

  try {
    await setDoc(doc(db, 'messages', messageId), payload);
    return { id: messageId, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeContactMessages(
  onMessages: (messages: ContactMessageData[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'messages';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: ContactMessageData[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ContactMessageData, 'id'>),
      }));
      onMessages(msgs);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Videos / Reel Service
export interface VideoFirestoreDoc {
  id: string;
  title: string;
  category?: string;
  url: string;
  videoUrl: string;
  caption?: string;
  location?: string;
  camera?: string;
  lens?: string;
  settings?: string;
  year?: string;
  column?: number;
  aspectRatioClass?: string;
  duration?: string;
  views?: number;
  likes?: number;
  isCustom?: boolean;
}

export function subscribeVideos(
  onVideos: (videos: VideoFirestoreDoc[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'videos';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const vids: VideoFirestoreDoc[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<VideoFirestoreDoc, 'id'>),
      }));
      onVideos(vids);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveVideoToFirestore(video: VideoFirestoreDoc) {
  const path = `videos/${video.id}`;
  try {
    await setDoc(doc(db, 'videos', video.id), {
      ...video,
      views: video.views ?? 0,
      likes: video.likes ?? 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteVideoFromFirestore(videoId: string) {
  const path = `videos/${videoId}`;
  try {
    await deleteDoc(doc(db, 'videos', videoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function incrementVideoInteractions(videoId: string, type: 'views' | 'likes') {
  const path = `videos/${videoId}`;
  try {
    await updateDoc(doc(db, 'videos', videoId), {
      [type]: increment(1),
    });
  } catch (error) {
    // If not found or permissions issue, log cleanly
    console.warn(`Could not update ${type} for video ${videoId}:`, error);
  }
}
