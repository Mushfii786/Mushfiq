import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { FirebaseProvider } from './context/FirebaseContext';
import { FirebaseDataProvider } from './context/FirebaseDataContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <FirebaseDataProvider>
        <App />
      </FirebaseDataProvider>
    </FirebaseProvider>
  </StrictMode>,
);

