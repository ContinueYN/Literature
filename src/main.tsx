import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { SettingsProvider } from './store/SettingsContext';
import { LibraryProvider } from './store/LibraryContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <SettingsProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </SettingsProvider>
    </HashRouter>
  </React.StrictMode>
);
