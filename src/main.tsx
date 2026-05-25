import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { FirebaseSyncProvider } from './context/FirebaseSyncContext';
import { MembershipProvider } from './context/MembershipContext';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <SettingsProvider>
      <AuthProvider>
        <FirebaseSyncProvider>
          <MembershipProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </MembershipProvider>
        </FirebaseSyncProvider>
      </AuthProvider>
    </SettingsProvider>
  </ErrorBoundary>
);
