import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

const LOCAL_ADMIN_KEY = 'mushfii_admin_local_auth_session';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isFirebaseUser: boolean;
}

/**
 * Signs in the admin using Firebase Authentication.
 * If Firebase is not configured, provides a secure local demo session
 * so the user can inspect and configure the dashboard.
 */
export async function adminSignIn(email: string, pass: string): Promise<AdminUser> {
  if (isFirebaseConfigured() && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Mushfiq (Admin)',
        isFirebaseUser: true,
      };
    } catch (err: any) {
      console.error('[AuthService] Firebase sign-in failed:', err);
      let message = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily disabled due to many failed attempts. Try again later.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }
      throw new Error(message);
    }
  }

  // Graceful local development fallback when Firebase credentials are not yet entered in .env
  // Allows testing the admin UI immediately
  if ((email === 'muhammedmushfiq178@gmail.com' || email === 'admin@mushfii.com') && (pass === '@Mushfii_786' || pass === 'Mushfii_786')) {
    const localUser: AdminUser = {
      uid: 'local-admin-dev',
      email: email,
      displayName: 'Mushfiq (Local Admin)',
      isFirebaseUser: false,
    };
    try {
      sessionStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(localUser));
    } catch {}
    return localUser;
  }

  throw new Error(
    'Firebase environment variables are not yet configured. For local preview testing, use: muhammedmushfiq178@gmail.com / @Mushfii_786 or add your VITE_FIREBASE_* credentials.'
  );
}

/**
 * Signs out the currently authenticated administrator.
 */
export async function adminSignOut(): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    await firebaseSignOut(auth);
  }
  try {
    sessionStorage.removeItem(LOCAL_ADMIN_KEY);
  } catch {}
}

/**
 * Sends a password reset email via Firebase.
 */
export async function adminResetPassword(email: string): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    await sendPasswordResetEmail(auth, email.trim());
    return;
  }
  throw new Error('Firebase credentials not configured yet. Configure VITE_FIREBASE_* in your environment to send password reset emails.');
}

/**
 * Subscribes to authentication state changes.
 */
export function subscribeAdminAuthState(callback: (user: AdminUser | null) => void): () => void {
  if (isFirebaseConfigured() && auth) {
    return onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Mushfiq (Admin)',
          isFirebaseUser: true,
        });
      } else {
        // Check if there is an active local demo session
        try {
          const localStored = sessionStorage.getItem(LOCAL_ADMIN_KEY);
          if (localStored) {
            callback(JSON.parse(localStored));
            return;
          }
        } catch {}
        callback(null);
      }
    });
  }

  // Check local demo session
  try {
    const localStored = sessionStorage.getItem(LOCAL_ADMIN_KEY);
    if (localStored) {
      callback(JSON.parse(localStored));
    } else {
      callback(null);
    }
  } catch {
    callback(null);
  }

  return () => {};
}

/**
 * Gets the currently cached administrator user, if any.
 */
export function getCurrentAdminUser(): AdminUser | null {
  if (isFirebaseConfigured() && auth && auth.currentUser) {
    const user = auth.currentUser;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Mushfiq (Admin)',
      isFirebaseUser: true,
    };
  }
  try {
    const localStored = sessionStorage.getItem(LOCAL_ADMIN_KEY);
    if (localStored) {
      return JSON.parse(localStored);
    }
  } catch {}
  return null;
}
