import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Splash from './pages/Splash';
import MainLayout from './components/layout/MainLayout';
import IosMobileTabBar from './components/navigation/IosMobileTabBar';
import { AnimatePresence } from 'motion/react';
import { SettingsProvider } from './context/SettingsContext';
import { FirebaseSyncProvider } from './context/FirebaseSyncContext';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import PremiumUpgradeModal from './components/premium/PremiumUpgradeModal';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load large medical dashboard modules for production bundle optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Chemicals = lazy(() => import('./pages/Chemicals'));
const Settings = lazy(() => import('./pages/Settings'));
const TalepAI = lazy(() => import('./pages/TalepAI'));
const ScientificIntelligence = lazy(() => import('./pages/ScientificIntelligence'));

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
  return (
    <>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Suspense fallback={<MainPageLoader />}>
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
          </Suspense>
        </AnimatePresence>
      </MainLayout>
      <IosMobileTabBar />
      <PremiumUpgradeModal />
    </>
  );
}

function MainAppSelector() {
  const [showSplash, setShowSplash] = React.useState(true);

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

    // Force fluid splash timeout to exactly 1.5 seconds (Requirement 2)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return <PureAppShell />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <SettingsProvider>
          <AuthProvider>
            <FirebaseSyncProvider>
              <MembershipProvider>
                <MainAppSelector />
              </MembershipProvider>
            </FirebaseSyncProvider>
          </AuthProvider>
        </SettingsProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
