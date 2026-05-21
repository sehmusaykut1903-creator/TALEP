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
import MainLayout from './components/layout/MainLayout';
import IosMobileTabBar from './components/navigation/IosMobileTabBar';
import { AnimatePresence } from 'motion/react';
import { SettingsProvider } from './context/SettingsContext';
import { FirebaseSyncProvider } from './context/FirebaseSyncContext';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import PremiumUpgradeModal from './components/premium/PremiumUpgradeModal';

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
    <SettingsProvider>
      <AuthProvider>
        <FirebaseSyncProvider>
          <MembershipProvider>
            <MainAppSelector />
          </MembershipProvider>
        </FirebaseSyncProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
