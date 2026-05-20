import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Assessment from './pages/Assessment';
import Chemicals from './pages/Chemicals';
import Settings from './pages/Settings';
import TalepAI from './pages/TalepAI';
import MainLayout from './components/layout/MainLayout';
import IosMobileTabBar from './components/navigation/IosMobileTabBar';
import { AnimatePresence } from 'motion/react';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SettingsProvider>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/chemicals" element={<Chemicals />} />
            <Route path="/ai" element={<TalepAI />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
      <IosMobileTabBar />
    </SettingsProvider>
  );
}
