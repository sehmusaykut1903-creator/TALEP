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
import { MembershipProvider } from './context/MembershipContext';
import PremiumUpgradeModal from './components/premium/PremiumUpgradeModal';

function LoginGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, loading, startOfflineMode } = useAuth();
  const [timedOut, setTimedOut] = React.useState(false);

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('[TALEP Failsafe] LoginGuard loading timeout. Forcing resolution.');
        setTimedOut(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4 selection:bg-cyan-500/30 text-slate-900">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center p-8 bg-white/70 backdrop-blur-xl border border-slate-200/45 rounded-[2.5rem] shadow-xl">
          <span className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <div className="space-y-1">
            <p className="text-xs text-slate-800 font-bold tracking-tight uppercase">Kimlik Doğrulama Katmanı</p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Tıbbi anahtarlar ve kromatografi modülü kuruluyor.</p>
          </div>
          <button
            onClick={startOfflineMode}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl active:scale-95 transition-all cursor-pointer shadow-md shadow-slate-900/10 border border-slate-800"
          >
            Çevrimdışı Güvenli Modda Başlat
          </button>
        </div>
      </div>
    );
  }
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function ProtectedShell() {
  const { currentUser, loading, startOfflineMode } = useAuth();
  const [timedOut, setTimedOut] = React.useState(false);

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('[TALEP Failsafe] ProtectedShell loading timeout. Forcing resolution.');
        setTimedOut(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  if (loading && !timedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4 selection:bg-cyan-500/30 text-slate-900">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center p-8 bg-white/70 backdrop-blur-xl border border-slate-200/45 rounded-[2.5rem] shadow-xl">
          <span className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <div className="space-y-1">
            <p className="text-xs text-slate-800 font-bold tracking-tight uppercase">Güvenli Oturum Başlatılıyor</p>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">C-DSS Klinik Karar Destek şebekesi yükleniyor.</p>
          </div>
          <button
            onClick={startOfflineMode}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl active:scale-95 transition-all cursor-pointer shadow-md shadow-slate-900/10 border border-slate-800"
          >
            Çevrimdışı Güvenli Modda Başlat
          </button>
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
      <PremiumUpgradeModal />
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    // Guarantees StartupLoader (Splash Screen) finishes inside a maximum of 3.8s
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  export default {
  async fetch(request, env, ctx) {
    try {
      return await env.ASSETS.fetch(request);
    } catch (error) {
      return new Response(
        "TALEP v4.0 Premium - Asset loading error",
        { status: 500 }
      );
    }
  }
}
  return (
    <SettingsProvider>
      <AuthProvider>
        <FirebaseSyncProvider>
          <MembershipProvider>
            <Routes>
              {/* Public/Auth pages without global navigation wrappers */}
              <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />
              <Route path="/register" element={<LoginGuard><Register /></LoginGuard>} />
              <Route path="/forgot-password" element={<LoginGuard><ForgotPassword /></LoginGuard>} />
              
              {/* All other routes are protected under the clinical shell wrap */}
              <Route path="/*" element={<ProtectedShell />} />
            </Routes>
          </MembershipProvider>
        </FirebaseSyncProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
