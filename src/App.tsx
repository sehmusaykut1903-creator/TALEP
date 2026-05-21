import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  Activity, Shield, Cpu, BookOpen, Database, Users, 
  ArrowRight, Star, Layers, FileText, ChevronRight, Menu
} from 'lucide-react';

// ==========================================
// 1. STATİK VE AKADEMİK METRİKLER (İÇ VERİTABANI)
// ==========================================
const ACADEMIC_CREDENTIALS = {
  title: "TALEP v4.0 PREMIUM",
  subtitle: "Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu",
  year: "2026 ©",
  developers: ["Şehmus AYKUT (Lead)", "Fatma Nur AYKUT", "Aghajan MUSALI"],
  advisor: "Prof. Dr. Vugar Ali TÜRKSOY",
  institution: "Yozgat Bozok Üniversitesi Tıp Fakültesi, Halk Sağlığı Anabilim Dalı"
};

// ==========================================
// 2. MİNİMALİST VE AKICI STARTUP LOADER
// ==========================================
function StartupLoader({ onFinished }) {
  useEffect(() => {
    const timer = setTimeout(onFinished, 1500); // 1.5 Saniye Sonra Zorla Paneli Açar
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="space-y-6 text-center max-w-xs w-full animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-600/40 animate-pulse">
          <Activity size={32} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-widest">TALEP</h2>
          <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-0.5 rounded-full border border-indigo-500/20 uppercase">
            v4.0 PREMIUM
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-slate-500 tracking-wider">
          Klinik Sistem Başlatılıyor...
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CORE PREMIUM ARABİRİM BİLEŞENLERİ (DASHBOARD)
// ==========================================
function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-slate-900/20 border border-indigo-500/10 backdrop-blur-md">
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Klinik Karar Destek Aktif
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Yapay Zekâ Destekli Toksikoloji İstihbarat Portalı
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sektörel kimyasal maruziyetleri, hedef organ hasar matrislerini ve laboratuvar biyobelirteçlerini multi-bilişsel düzeyde eşleştiren akademik sağlık teknolojisi.
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Aktif Kimyasal MSDS", count: "1,420+", icon: Database, color: "text-indigo-400" },
          { title: "Kritik Semptom Matrisi", count: "480+", icon: Activity, color: "text-emerald-400" },
          { title: "Akademik Atıf Sürveyansı", count: "Level Ia-IV", icon: BookOpen, color: "text-violet-400" }
        ].map((card, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">{card.title}</span>
              <span className="text-2xl font-black text-white block">{card.count}</span>
            </div>
            <div className={`p-3 rounded-xl bg-slate-800/50 ${card.color}`}><card.icon size={20} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. ANA DÜZEN VE RESPONSIVE SIDEBAR (MAIN LAYOUT)
// ==========================================
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-x-hidden font-sans">
      
      {/* PRE-RENDERED PREMIUM SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900/60 md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-slate-800/60 backdrop-blur-xl flex flex-col justify-between p-6 z-40">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">TALEP</span>
              <span className="text-[9px] font-extrabold tracking-widest text-indigo-400 uppercase block -mt-0.5">v4.0 PREMIUM</span>
            </div>
          </div>

          {/* Menü Navigasyonu */}
          <nav className="space-y-1">
            {[
              { label: "Kontrol Paneli", path: "/", icon: Layers },
              { label: "Klinik TALEP AI", path: "/ai", icon: Cpu },
              { label: "Toksikoloji Database", path: "/chemicals", icon: Database },
              { label: "Sürveyans Modülü", path: "/patients", icon: Users }
            ].map((item, idx) => (
              <Link 
                key={idx} 
                to={item.path} 
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="group-hover:text-indigo-400 transition-colors" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-1" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Kurumsal Künye Alt Alanı */}
        <div className="pt-6 border-t border-slate-800/60 space-y-3">
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-wider text-slate-500 block uppercase">Akademik Danışman</span>
            <span className="text-[11px] font-bold text-slate-300 block">{ACADEMIC_CREDENTIALS.advisor}</span>
          </div>
          <div className="text-[9px] font-medium text-slate-600 leading-normal">
            Yozgat Bozok Üniversitesi<br />Tıp Fakültesi • Halk Sağlığı AD
          </div>
        </div>
      </aside>

      {/* MERKEZİ İÇERİK ALANI (CONTENT SHELL) */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col justify-between min-h-screen">
        <div className="animate-fade-in">{children}</div>
        
        {/* Güvenli Sabitlenen Alt Bilgi (Footer) */}
        <footer className="pt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600 font-bold">
          <div>{ACADEMIC_CREDENTIALS.title} • SÜRÜM ONAYLANDI</div>
          <div className="text-center sm:text-right">
            2026 • Şehmus Aykut tarafından geliştirilmiştir.
          </div>
        </footer>
      </main>

    </div>
  );
}

// ==========================================
// 5. YAN SAYFA MOCK BİLEŞENLERİ (MODULE PREVIEWS)
// ==========================================
function TalepAIMock() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Cpu size={20} className="text-indigo-400" /> TALEP AI Klinik Asistan</h3>
      <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl min-h-[300px] flex flex-col justify-between">
        <div className="text-xs font-mono text-indigo-400 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
          [Sistem Durumu]: Bağlam Duyarlı (Context-Aware) Doçent Yapay Zekâ Motoru Aktif. Sorgu Bekleniyor...
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Semptom veya kimyasal ajan girin..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-200" disabled />
          <button className="px-6 py-3 bg-indigo-600 rounded-xl text-xs font-bold text-white opacity-50 cursor-not-allowed">Gönder</button>
        </div>
      </div>
    </div>
  );
}

function ChemicalsMock() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Database size={20} className="text-indigo-400" /> Toksikolojik Veri Tabanı</h3>
      <p className="text-xs text-slate-500">IARC, WHO ve CDC endeksli endüstriyel toksik kimyasal kütüphanesi.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 font-bold">
              <th className="p-4">Kimyasal Ajan</th>
              <th className="p-4">Sektör / Birim</th>
              <th className="p-4">Hedef Organ Hasarı</th>
              <th className="p-4">IARC Grubu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            <tr><td className="p-4 font-bold text-white">Benzen</td><td className="p-4">Boya / Ayakkabı İmalatı</td><td className="p-4">Kemik İliği / Hematopoetik</td><td className="p-4 text-rose-400 font-bold">Grup 1 (Karsinojen)</td></tr>
            <tr><td className="p-4 font-bold text-white">Kurşun</td><td className="p-4">Akü / Metal Sanayii</td><td className="p-4">Santral Sinir Sistemi / Renal</td><td className="p-4 text-amber-400 font-bold">Grup 2A</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PatientsMock() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users size={20} className="text-indigo-400" /> Epidemiyolojik Sürveyans Takibi</h3>
      <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl text-center text-xs text-slate-500 py-12">
        Birim bazlı maruziyet haritaları ve risk trend analizleri bu alanda yapılandırılmıştır.
      </div>
    </div>
  );
}

// ==========================================
// 6. GLOBAL MERKEZİ ORKESTRASYON (APP COMPONENT)
// ==========================================
export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <StartupLoader onFinished={() => setLoading(false)} />;
  }

  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/ai" element={<TalepAIMock />} />
          <Route path="/chemicals" element={<ChemicalsMock />} />
          <Route path="/patients" element={<PatientsMock />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
  );
}
