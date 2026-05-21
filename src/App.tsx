import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Assessment from './pages/Assessment';
import Chemicals from './pages/Chemicals';
import Settings from './pages/Settings';
import TalepAI from './pages/TalepAI';
import ScientificIntelligence from './pages/ScientificIntelligence';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import MainLayout from './components/layout/MainLayout';
import IosMobileTabBar from './components/navigation/IosMobileTabBar';
import { AnimatePresence } from 'motion/react';
import { SettingsProvider } from './context/SettingsContext';
import { FirebaseSyncProvider } from './context/FirebaseSyncContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function LoginGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <span className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function ProtectedShell() {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          <p className="text-xs text-brand-navy/60 font-bold tracking-tight">Güvenli klinik oturumu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/chemicals" element={<Chemicals />} />
            <Route path="/ai" element={<TalepAI />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/literature" element={<ScientificIntelligence defaultTab="literature" />} />
            <Route path="/epidemiology" element={<ScientificIntelligence defaultTab="epidemiology" />} />
            <Route path="/exposure-db" element={<ScientificIntelligence defaultTab="exposure_db" />} />
            <Route path="/case-archive" element={<ScientificIntelligence defaultTab="case_archive" />} />
            <Route path="/reports-center" element={<ScientificIntelligence defaultTab="case_archive" />} />
            <Route path="/ai-research-assistant" element={<ScientificIntelligence defaultTab="ai_research" />} />
            <Route path="/team-collaboration" element={<ScientificIntelligence defaultTab="ai_research" />} />
            <Route path="/audit-logs" element={<ScientificIntelligence defaultTab="case_archive" />} />
            <Route path="/emergency-mode" element={<ScientificIntelligence defaultTab="emergency" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
      <IosMobileTabBar />
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SettingsProvider>
      <AuthProvider>
        <FirebaseSyncProvider>
          <Routes>
            {/* Public/Auth pages without global navigation wrappers */}
            <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />
            <Route path="/register" element={<LoginGuard><Register /></LoginGuard>} />
            <Route path="/forgot-password" element={<LoginGuard><ForgotPassword /></LoginGuard>} />
            
            {/* All other routes are protected under the clinical shell wrap */}
            <Route path="/*" element={<ProtectedShell />} />
          </Routes>
        </FirebaseSyncProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

