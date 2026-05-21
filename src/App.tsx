import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-3xl font-black">
      TALEP v4.0
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-black mb-6">
        TALEP v4.0 Premium
      </h1>

      <div className="flex gap-4 mb-10 flex-wrap">
        <Link to="/" className="bg-indigo-600 px-4 py-2 rounded-xl">
          Dashboard
        </Link>

        <Link to="/ai" className="bg-slate-800 px-4 py-2 rounded-xl">
          AI
        </Link>

        <Link to="/chemicals" className="bg-slate-800 px-4 py-2 rounded-xl">
          Chemicals
        </Link>

        <Link to="/patients" className="bg-slate-800 px-4 py-2 rounded-xl">
          Patients
        </Link>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        Sistem başarıyla çalışıyor.
      </div>
    </div>
  );
}

function AIPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-black">TALEP AI</h1>
    </div>
  );
}

function ChemicalsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-black">Chemical Database</h1>
    </div>
  );
}

function PatientsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-black">Patients</h1>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/ai" element={<AIPage />} />
      <Route path="/chemicals" element={<ChemicalsPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
