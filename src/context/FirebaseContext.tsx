import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User 
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  db, 
  isFirebaseConfigured, 
  getContactMessages, 
  type ContactMessage 
} from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'muhammedmushfiq178@gmail.com';
const LOCAL_INQUIRIES_KEY = 'mushfiq_portfolio_inquiries_local';

interface FirebaseContextType {
  user: User | null;
  isAdmin: boolean;
  isConfigured: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  messages: ContactMessage[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isAdmin: false,
  isConfigured: false,
  loginWithGoogle: async () => null,
  logout: async () => {},
  messages: [],
  unreadCount: 0,
  markAsRead: async () => {},
  deleteMessage: async () => {},
  loading: false,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Track Firebase auth state if auth is configured
  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const isAdmin = Boolean(
    user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  // Listen to inquiries live when admin is authenticated, or load local cache
  useEffect(() => {
    if (!isAdmin) return;

    if (db && isFirebaseConfigured) {
      try {
        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetched = snapshot.docs.map((docSnap) => {
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
          setMessages(fetched);
          try {
            localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(fetched));
          } catch {}
        }, (err) => {
          console.warn('Inquiries snapshot listener error:', err);
          getContactMessages().then(setMessages);
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('Setting up inquiries listener failed:', err);
      }
    } else {
      getContactMessages().then(setMessages);
    }
  }, [isAdmin]);

  const loginWithGoogle = useCallback(async (): Promise<User | null> => {
    if (auth && googleProvider && isFirebaseConfigured) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        return result.user;
      } catch (error) {
        console.error('Google Sign-In failed:', error);
        throw error;
      }
    } else {
      // Offline / unconfigured simulation: simulate logged in user
      const mockUser = {
        uid: 'demo-admin-uid',
        email: ADMIN_EMAIL,
        displayName: 'Muhammed Mushfiq',
        photoURL: null,
      } as unknown as User;
      setUser(mockUser);
      return mockUser;
    }
  }, []);

  const logout = useCallback(async () => {
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
    setUser(null);
    try {
      sessionStorage.removeItem('mushfiq_videography_admin_session');
    } catch {}
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
    if (db && isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'inquiries', id), { read: true });
      } catch {}
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (db && isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch {}
    }
  }, []);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const contextValue = useMemo(
    () => ({
      user,
      isAdmin,
      isConfigured: isFirebaseConfigured,
      loginWithGoogle,
      logout,
      messages,
      unreadCount,
      markAsRead,
      deleteMessage,
      loading,
    }),
    [user, isAdmin, loginWithGoogle, logout, messages, unreadCount, markAsRead, deleteMessage, loading]
  );

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
export default FirebaseContext;
