import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Activity, 
  Database, 
  Bot, 
  Settings, 
  Menu, 
  X, 
  FileText, 
  Sparkles, 
  Building, 
  BookOpen, 
  Flame,
  Info,
  Users,
  TrendingUp,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Existing Components and Pages
import TalepLogo from "./components/TalepLogo";
import TalepAI from "./pages/TalepAI";
import SettingsPanel from "./components/SettingsPanel";
import LiteratureIntelligence from "./components/academic/LiteratureIntelligence";
import OccupationalEpidemiology from "./components/academic/OccupationalEpidemiology";
import AIResearchAssistant from "./components/academic/AIResearchAssistant";
import { PDFReportHub } from "./components/academic/PDFReportHub";
import CaseArchive from "./components/academic/CaseArchive";
import ExposureDatabase from "./components/academic/ExposureDatabase";
import EmergencyToxicology from "./components/academic/EmergencyToxicology";

// Modular Extracted Views
import DashboardView from "./components/layout/DashboardView";
import ChemicalsView from "./components/layout/ChemicalsView";
import About from "./pages/About";
import Splash from "./pages/Splash";
import { useSettings } from "./context/SettingsContext";

// Types
interface Chemical {
  id: string;
  cas: string;
  name: string;
  class: "İnhalasyon" | "Ağır Metal" | "Organofosfat" | "İlaç Etken Maddesi" | "Deri/Korozif";
  limit: string;
  triage: string;
  antidote: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  substance: string;
  location: string;
  risk: "Hafif" | "Orta" | "Kritik";
  status: string;
  date: string;
}

export default function App() {
  const { theme, t, language } = useSettings();
  const isTr = language === "tr";
  const isDarkTheme = theme.isDark;

  // Navigation: state-based tab layout for flawless performance on static servers/GitHub Pages
  const [activeTab, setActiveTab] = useState<"pano" | "chemicals" | "ai" | "literature" | "epidemiology" | "reports" | "airesearch" | "cases" | "exposure" | "emergency" | "settings" | "about">("pano");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [academicMenuOpen, setAcademicMenuOpen] = useState(false);

  // Demographics
  const [sessionUser, setSessionUser] = useState({
    displayName: "Dr. Şehmus Aykut",
    role: "Halk Sağlığı ve Toksikoloji Uzmanı",
    institution: "Yozgat Bozok Üniversitesi Tıp Fakültesi",
    department: "Halk Sağlığı Anabilim Dalı"
  });

  // Removed automatic timeout to allow the premium onboarding Splash screen with "Platforma Gir" button to act as the gateway

  // Shared Patients State
  const [patients, setPatients] = useState<Patient[]>([
    { id: "V-101", name: "Ahmet Y.", age: 42, substance: "Tarım İlacı (Organofosfat)", location: "Yozgat / Sorgun", risk: "Kritik", status: "Yatış Verildi - Atropin İnfüzyon", date: "Bugün 18:22" },
    { id: "V-102", name: "Zeynep T.", age: 29, substance: "Karbonmonoksit (Soba Zehirlenmesi)", location: "Yozgat / Akdağmadeni", risk: "Orta", status: "Hiperbarik Oksijen Başlandı", date: "Bugün 15:40" },
    { id: "V-103", name: "Murat K.", age: 52, substance: "Ağır Metal (Kurşun Maruziyeti)", location: "Yozgat / Sarıkaya", risk: "Hafif", status: "Poliklinik Takip, Kelasyon Planlandı", date: "Dün 11:15" },
    { id: "V-104", name: "Elif B.", age: 34, substance: "Parasetamol Toksisitesi (Aşırı Doz)", location: "Yozgat / Merkez", risk: "Kritik", status: "Güvenli İzlem - NAC İnfüzyonu", date: "Dün 09:30" }
  ]);

  const [newPatient, setNewPatient] = useState({ name: "", age: "", substance: "", location: "", risk: "Orta" as "Hafif" | "Orta" | "Kritik" });
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("Tümü");

  const chemicalsData: Chemical[] = [
    { id: "C-01", cas: "56-38-2", name: "Paration (Organofosfat Antikolinesteraz)", class: "Organofosfat", limit: "TWA 0.1 mg/m³", triage: "Kolinerjik Sendrom: Aşırı sekresyon, miyozis, bradikardi. Acil havayolu emniyeti alın.", antidote: "Atropin Sülfat + Pralidoksim (2-PAM)" },
    { id: "C-02", cas: "630-08-0", name: "Karbonmonoksit (CO Gazı)", class: "İnhalasyon", limit: "TWA 25 ppm / STEL 50 ppm", triage: "Karboksihemoglobinem: Baş ağrısı, konfüzyon, kiraz kırmızısı mukozalar.", antidote: "%100 Normobarik Oksijen / Gerekirse Hiperbarik Oksijen" },
    { id: "C-03", cas: "7439-92-1", name: "Kurşun (İnorganik Toz/Duman)", class: "Ağır Metal", limit: "TWA 0.05 mg/m³ (Kan seviyesi >40 µg/dL)", triage: "Plumbizm: Karın ağrısı, mikrositer anemi, periferik nöropati (düşük el).", antidote: "Kalsiyum Disodyum EDTA / DMSA" },
    { id: "C-04", cas: "103-90-2", name: "Parasetamol (Asetaminofen)", class: "İlaç Etken Maddesi", limit: "Günlük Maksimum 4g Dozu Aşımı", triage: "Hepatotoksisite riski. 4. ve 16. saat plazma düzeylerini Rumack-Matthew nomogramına göre değerlendirin.", antidote: "N-Asetilsistein (NAC) Protokolü" },
    { id: "C-05", cas: "7664-39-3", name: "Hidroflorik Asit (HF Reaksiyon)", class: "Deri/Korozif", limit: "Ceiling 3 ppm", triage: "Derin doku erozyonu ve hipokalsemi. Dokularda şiddetli kalsiyum fiksasyonu.", antidote: "Kalsiyum Glukonat %2.5 Jel veya Subkutan Enjeksiyon" },
    { id: "C-06", cas: "115-29-7", name: "Endosülfan (Organoklorlu Pestisit)", class: "Organofosfat", limit: "TWA 0.1 mg/m³ (Deri)", triage: "SSS stimülasyonu, dirençli jeneralize konvülsiyonlar.", antidote: "Semptomatik / Benzodiyazepinler (Spesifik antidotu yoktur)" }
  ];

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.substance) return;

    const patientToAdd: Patient = {
      id: `V-${100 + patients.length + 1}`,
      name: newPatient.name,
      age: parseInt(newPatient.age) || 35,
      substance: newPatient.substance,
      location: newPatient.location || "Yozgat / Merkez",
      risk: newPatient.risk,
      status: "Takip Başlatıldı - İlk Değerlendirme",
      date: "Şimdi"
    };

    setPatients([patientToAdd, ...patients]);
    setNewPatient({ name: "", age: "", substance: "", location: "", risk: "Orta" });
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  const filteredChemicals = chemicalsData.filter(chem => {
    const matchesSearch = chem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chem.cas.includes(searchQuery);
    const matchesClass = classFilter === "Tümü" || chem.class === classFilter;
    return matchesSearch && matchesClass;
  });

  // Base dynamic theme classes
  const mainShellClass = `h-screen h-[100dvh] md:h-screen w-full flex flex-col md:flex-row antialiased select-none font-sans overflow-hidden transition-all duration-250 ${
    isDarkTheme ? "text-[#cbd5e1]" : "text-slate-800"
  }`;

  const sidebarBg = `${theme.sidebarBg} font-sans border-r shadow-2xl transition-all duration-250`;

  return (
    <div className={mainShellClass} style={{ backgroundColor: theme.background }}>
      
      {/* Cinematic Soft Ambient Background Lights (Subtle, Apple-like, No heavy neon flickering) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute inset-0 ${isDarkTheme ? "bg-[#04060b] bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.03),transparent_45%)]" : "bg-slate-50/10"}`} />
        {!isDarkTheme && <div className="absolute inset-0 bg-radial-gradient from-blue-500/[0.02] via-[#f0f9ff]/5 to-transparent pointer-events-none" />}
      </div>

      {/* Startup Screen Animation (Premium Apple-level Splash Screen) */}
      <AnimatePresence>
        {loadingScreen && (
          <Splash onFinish={() => setLoadingScreen(false)} />
        )}
      </AnimatePresence>

      {/* MOBILE TOP NAVIGATION BAR */}
      <header className={`md:hidden flex items-center justify-between p-4 border-b z-40 sticky top-0 ${
        isDarkTheme ? "bg-slate-950/90 border-white/5 text-white" : "bg-[#0f172a] text-white border-slate-100/10 shadow-sm"
      }`}>
        <div className="flex items-center gap-2.5">
          <TalepLogo size="sm" variant="glass" />
          <div>
            <span className="text-xs font-black tracking-widest text-cyan-400 dark:text-cyan-300">TALEP OS</span>
            <p className="text-[8px] text-slate-400 font-bold uppercase">Yozgat Bozok Üniversitesi</p>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* MOBILE BACKDROP OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION PANEL (Desktop & Mobile Drawer in harmony) */}
      <aside className={`
        fixed inset-y-0 left-0 z-45 w-[80dvw] sm:w-[320px] md:w-64 lg:w-72 p-5 ${sidebarBg} flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:sticky md:top-0 md:h-screen shrink-0 overflow-y-auto
      `}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
            <TalepLogo size="md" variant={isDarkTheme ? "glass" : "light"} />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-[0.25em] text-[#06b6d4] uppercase block leading-none" style={{ color: theme.secondary }}>
                TALEP
              </span>
              <span className="text-[6.5px] text-slate-500 dark:text-slate-400 font-extrabold tracking-[0.03em] uppercase leading-tight mt-1 max-w-[155px]">
                Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu
              </span>
            </div>
          </div>

          {/* Clinician short bio */}
          <div className="bg-slate-550/10 dark:bg-white/[0.03] p-3 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center font-black text-xs shrink-0" style={{ color: theme.secondary, borderColor: theme.secondary + '40' }}>
              ŞA
            </div>
            <div className="overflow-hidden">
              <span className="text-[11px] font-black text-slate-800 dark:text-white block truncate">{sessionUser.displayName}</span>
              <span className="text-[8.5px] text-slate-500 dark:text-slate-400 block truncate leading-none mt-0.5">{sessionUser.department}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[8px] font-black tracking-[0.2em] pl-2 block mb-1" style={{ color: theme.secondary }}>KLİNİK MODÜLLER</span>
              <nav className="space-y-1">
                {[
                  { id: "pano", label: "Sürveyans / Pano", icon: Activity },
                  { id: "chemicals", label: "Toksikoloji DB", icon: Database },
                  { id: "ai", label: "TALEP Klinik AI", icon: Bot },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${
                        isActive 
                          ? "shadow-md font-extrabold" 
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                      style={isActive ? { backgroundColor: theme.secondary, color: theme.isDark ? '#020617' : '#ffffff' } : {}}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="text-[8px] font-black tracking-[0.2em] pl-2 block mb-1" style={{ color: theme.secondary }}>AKADEMİK KATMAN</span>
              <nav className="space-y-0.5 pr-1">
                {[
                  { id: "literature", label: "Literatür Taraması", icon: BookOpen },
                  { id: "epidemiology", label: "Mesleki Epidemioloji", icon: TrendingUp },
                  { id: "airesearch", label: "AI Araştırma Asistanı", icon: Sparkles },
                  { id: "reports", label: "Raporlama Merkezi", icon: FileText },
                  { id: "cases", label: "Vaka Arşiv Sistemi", icon: Users },
                  { id: "exposure", label: "Maruziyet Veritabanı", icon: Database },
                  { id: "emergency", label: "Acil Toksikoloji", icon: Flame },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${
                        isActive 
                          ? "shadow-md font-extrabold" 
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                      style={isActive ? { backgroundColor: theme.secondary, color: theme.isDark ? '#020617' : '#ffffff' } : {}}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="text-[8px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-2 block mb-1">DİĞER</span>
              <nav className="space-y-1">
                {[
                  { id: "settings", label: "Sistem Ayarları", icon: Settings },
                  { id: "about", label: isTr ? "Hakkında" : "About", icon: Info },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${
                        isActive 
                          ? "shadow-md font-extrabold" 
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                      style={isActive ? { backgroundColor: theme.secondary, color: theme.isDark ? '#020617' : '#ffffff' } : {}}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Institutional Footer */}
        <div className="pt-4 mt-6 border-t border-white/5 text-[9px] text-slate-400 space-y-0.5">
          <p className="font-bold text-blue-400 dark:text-cyan-400 uppercase">Yozgat Bozok Üniversitesi</p>
          <p>Tıp Fakültesi Halk Sağlığı Anabilim Dalı</p>
        </div>
      </aside>

      {/* CORE CONTENT LAYOUT WRAPPER (Independent scrolling on Desktop and Mobile) */}
      <div className="flex-1 h-full md:h-screen flex flex-col justify-between relative z-10 overflow-hidden">
        
        <main className="p-4 sm:p-6 md:p-8 flex-1 space-y-6 max-w-full overflow-x-hidden overflow-y-auto pb-[140px] md:pb-16 flex flex-col min-h-0">
          
          {/* ACTIVE VIEW MANAGER (DYNAMICS) */}
          <div className="min-h-0 w-full flex-1">
            {activeTab === "pano" && (
              <DashboardView 
                patients={patients} 
                onAddPatient={handleAddPatient} 
                onDeletePatient={handleDeletePatient} 
                newPatient={newPatient} 
                setNewPatient={setNewPatient} 
                chemicalsCount={chemicalsData.length} 
              />
            )}
            
            {activeTab === "chemicals" && (
              <ChemicalsView 
                chemicalsData={chemicalsData} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                classFilter={classFilter} 
                setClassFilter={setClassFilter} 
                filteredChemicals={filteredChemicals} 
              />
            )}

            {activeTab === "ai" && <TalepAI />}
            {activeTab === "settings" && <SettingsPanel sessionUser={sessionUser} setSessionUser={setSessionUser} />}
            {activeTab === "literature" && <LiteratureIntelligence />}
            {activeTab === "epidemiology" && <OccupationalEpidemiology />}
            {activeTab === "airesearch" && <AIResearchAssistant />}
            {activeTab === "reports" && <PDFReportHub />}
            {activeTab === "cases" && <CaseArchive />}
            {activeTab === "exposure" && <ExposureDatabase />}
            {activeTab === "emergency" && <EmergencyToxicology />}
            {activeTab === "about" && <About />}
          </div>



        </main>

      </div>

      {/* ================= MOBILE PREMIUM FLOATING NAVIGATION DOCK (Apple-style / Stable) ================= */}
      {createPortal(
        <div className={`md:hidden mobile-nav-dock border backdrop-blur-3xl rounded-[28px] p-2.5 shadow-xl select-none transition-all duration-200 ${theme.cardBg} border-black/10 dark:border-white/10`}>
          
          {/* Dynamic Academic Popup Panel inside Dock */}
          <AnimatePresence>
            {academicMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-[95%] border rounded-[20px] p-2.5 shadow-2xl z-50 space-y-1 transition-all duration-200 ${theme.cardBg} border-black/10 dark:border-white/10`}
              >
                {[
                  { id: "epidemiology", label: "Mesleki Epidemiyoloji", icon: TrendingUp },
                  { id: "airesearch", label: "AI Tez / Analizi", icon: Sparkles },
                  { id: "cases", label: "Vaka Arşivi", icon: Users },
                  { id: "exposure", label: "Maruziyet Rejimi", icon: Database },
                  { id: "emergency", label: "Acil Toksikoloji", icon: Flame },
                ].map(sub => {
                  const isSubActive = activeTab === sub.id;
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveTab(sub.id as any);
                        setAcademicMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                        isSubActive ? "bg-blue-600 text-white" : "hover:bg-white/5 text-slate-300"
                      }`}
                    >
                      <SubIcon size={14} />
                      {sub.label}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Dock Menu Items */}
          <div className="flex items-center justify-around w-full">
            {[
              { id: "pano", label: "Pano", icon: Activity },
              { id: "chemicals", label: "Toksik", icon: Database },
              { id: "ai", label: "TALEP AI", icon: Bot },
              { id: "academic", label: "Akademik", icon: Sparkles, action: () => setAcademicMenuOpen(!academicMenuOpen) },
              { id: "settings", label: "Ayarlar", icon: Settings }
            ].map(dock => {
              const DockIcon = dock.icon;
              const isDockActive = activeTab === dock.id || (dock.id === "academic" && ["epidemiology", "airesearch", "cases", "exposure", "emergency"].includes(activeTab));
              return (
                <button
                  key={dock.id}
                  onClick={dock.action ? dock.action : () => { setActiveTab(dock.id as any); setAcademicMenuOpen(false); }}
                  className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all relative cursor-pointer min-w-[44px] ${
                    isDockActive ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-250"
                  }`}
                >
                  <DockIcon size={16} />
                  <span className="text-[7.5px] mt-0.5 font-bold tracking-tight uppercase">{dock.label}</span>
                </button>
              )
            })}
          </div>

        </div>,
        document.body
      )}

    </div>
  );
}
