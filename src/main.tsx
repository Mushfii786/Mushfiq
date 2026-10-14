import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { FirebaseProvider } from './context/FirebaseContext';
import { FirebaseDataProvider } from './context/FirebaseDataContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminProvider } from './admin/AdminContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <FirebaseDataProvider>
        <SiteContentProvider>
          <AdminAuthProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </AdminAuthProvider>
        </SiteContentProvider>
      </FirebaseDataProvider>
    </FirebaseProvider>
  </StrictMode>,
);
