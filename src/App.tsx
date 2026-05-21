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
    // Save state as demo to avoid any server-side Firebase delay and activate the mock clinician immediately
    try {
      localStorage.setItem('talep_mode', 'demo');
    } catch (e) {
      console.warn('LocalStorage is unavailable in this sandbox environment:', e);
    }

    // Force splash completion within exactly 2 seconds (Requirement 4)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
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
