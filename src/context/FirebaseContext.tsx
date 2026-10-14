import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  subscribeContactMessages,
  ContactMessageData,
} from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  messages: ContactMessageData[];
  unreadCount: number;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const ADMIN_EMAIL = 'muhammedmushfiq178@gmail.com';

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessageData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    user &&
    user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    user.emailVerified
  );

  // Subscribe to contact messages in real-time ONLY when authenticated as admin (Data Fetching constraint)
  useEffect(() => {
    if (!isAdmin || loading) {
      setMessages([]);
      return;
    }

    try {
      const unsubscribe = subscribeContactMessages(
        (msgs) => {
          setMessages(msgs);
        },
        (err) => {
          console.warn('Live messages subscription error:', err);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Failed subscribing to messages:', e);
    }
  }, [isAdmin, loading]);

  const handleLoginWithGoogle = async () => {
    const loggedUser = await signInWithGoogle();
    return loggedUser;
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        loginWithGoogle: handleLoginWithGoogle,
        logout: handleLogout,
        messages,
        unreadCount,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
