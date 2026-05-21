import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import MainLayout from './components/layout/MainLayout';
import IosMobileTabBar from './components/navigation/IosMobileTabBar';
import { AnimatePresence } from 'motion/react';
import { SettingsProvider } from './context/SettingsContext';
import { FirebaseSyncProvider } from './context/FirebaseSyncContext';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import PremiumUpgradeModal from './components/premium/PremiumUpgradeModal';
import { RuntimeErrorBoundary, SafeRenderWrapper, EmergencyDashboardFallback, safeLazy } from './components/RuntimeErrorManager';

// Safe lazy loading of medical dashboard modules to avoid raw chunk load abort white screens
const Dashboard = safeLazy(() => import('./pages/Dashboard'), 'Ana Panel');
const Patients = safeLazy(() => import('./pages/Patients'), 'Sürveyans');
const Assessment = safeLazy(() => import('./pages/Assessment'), 'Kriter Analiz');
const Chemicals = safeLazy(() => import('./pages/Chemicals'), 'Toksikoloji DB');
const Settings = safeLazy(() => import('./pages/Settings'), 'Sistem Ayarları');
const TalepAI = safeLazy(() => import('./pages/TalepAI'), 'TALEP Klinik AI');
const ScientificIntelligence = safeLazy(() => import('./pages/ScientificIntelligence'), 'Akademik Port');

// Custom medical-themed suspense loader
function MainPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-800 dark:text-slate-100 p-8">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/30">
          <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tıbbi Yükleme Modülü</p>
      <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">Kriter ve kromatografi analizi yükleniyor...</p>
    </div>
  );
}

// Pre-seed local storage immediately on module initialization to unlock physician session instantly
try {
  localStorage.setItem('talep_mode', 'demo');
  localStorage.setItem('talep_demo_auth_user', JSON.stringify({
    uid: 'demo-guest-uid',
    email: 'guest@talep.org',
    displayName: 'Dr. Şehmus Aykut',
    emailVerified: true
  }));
  localStorage.setItem('talep_demo_auth_profile', JSON.stringify({
    uid: 'demo-guest-uid',
    email: 'guest@talep.org',
    displayName: 'Dr. Şehmus Aykut',
    role: 'physician',
    institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
    department: 'Halk Sağlığı Anabilim Dalı',
    city: 'Yozgat, Turkey'
  }));
} catch (e) {
  console.warn('Initial session self-seeding not completed:', e);
}

function PureAppShell() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Strict failsafe max limit for splash
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Suspense fallback={<MainPageLoader />}>
            <Routes>
              <Route path="/" element={<SafeRenderWrapper><Dashboard /></SafeRenderWrapper>} />
              <Route path="/patients" element={<SafeRenderWrapper><Patients /></SafeRenderWrapper>} />
              <Route path="/assessment" element={<SafeRenderWrapper><Assessment /></SafeRenderWrapper>} />
              <Route path="/chemicals" element={<SafeRenderWrapper><Chemicals /></SafeRenderWrapper>} />
              <Route path="/ai" element={<SafeRenderWrapper><TalepAI /></SafeRenderWrapper>} />
              <Route path="/settings" element={<SafeRenderWrapper><Settings /></SafeRenderWrapper>} />
              <Route path="/literature" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="literature" /></SafeRenderWrapper>} />
              <Route path="/epidemiology" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="epidemiology" /></SafeRenderWrapper>} />
              <Route path="/exposure-db" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="exposure_db" /></SafeRenderWrapper>} />
              <Route path="/case-archive" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="case_archive" /></SafeRenderWrapper>} />
              <Route path="/reports-center" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="case_archive" /></SafeRenderWrapper>} />
              <Route path="/ai-research-assistant" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="ai_research" /></SafeRenderWrapper>} />
              <Route path="/team-collaboration" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="ai_research" /></SafeRenderWrapper>} />
              <Route path="/audit-logs" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="case_archive" /></SafeRenderWrapper>} />
              <Route path="/emergency-mode" element={<SafeRenderWrapper><ScientificIntelligence defaultTab="emergency" /></SafeRenderWrapper>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </MainLayout>
      <IosMobileTabBar />
      <PremiumUpgradeModal />
    </>
  );
}

function MainAppSelector() {
  React.useEffect(() => {
    // Keep ensuring demo mode is locked in context during hook cycles
    try {
      localStorage.setItem('talep_mode', 'demo');
      localStorage.setItem('talep_demo_auth_user', JSON.stringify({
        uid: 'demo-guest-uid',
        email: 'guest@talep.org',
        displayName: 'Dr. Şehmus Aykut',
        emailVerified: true
      }));
      localStorage.setItem('talep_demo_auth_profile', JSON.stringify({
        uid: 'demo-guest-uid',
        email: 'guest@talep.org',
        displayName: 'Dr. Şehmus Aykut',
        role: 'physician',
        institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
        department: 'Halk Sağlığı Anabilim Dalı',
        city: 'Yozgat, Turkey'
      }));
    } catch (e) {
      console.warn('LocalStorage setup is unavailable:', e);
    }
  }, []);

  return <PureAppShell />;
}

export default function App() {
  return (
    <RuntimeErrorBoundary fallback={<EmergencyDashboardFallback />}>
      <SettingsProvider>
        <AuthProvider>
          <FirebaseSyncProvider>
            <MembershipProvider>
              <MainAppSelector />
            </MembershipProvider>
          </FirebaseSyncProvider>
        </AuthProvider>
      </SettingsProvider>
    </RuntimeErrorBoundary>
  );
}
