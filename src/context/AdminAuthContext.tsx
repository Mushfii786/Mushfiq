import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdminUser,
  adminSignIn,
  adminSignOut,
  adminResetPassword,
  subscribeAdminAuthState,
  getCurrentAdminUser
} from '../services/authService';

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => getCurrentAdminUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeAdminAuthState((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    const authenticatedUser = await adminSignIn(email, pass);
    setUser(authenticatedUser);
  };

  const signOut = async () => {
    await adminSignOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await adminResetPassword(email);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
