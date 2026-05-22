import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Database, 
  Bot, 
  Settings, 
  Search, 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Trash2, 
  Play, 
  Menu, 
  X, 
  FileText, 
  Send, 
  Sparkles, 
  Calendar,
  AlertTriangle,
  RefreshCw,
  Heart,
  ChevronRight,
  User,
  Building,
  BookOpen,
  Flame,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TalepLogo from "./components/TalepLogo";
import ProjectCredits from "./components/academic/ProjectCredits";
import TalepAI from "./pages/TalepAI";
import SettingsPanel from "./components/SettingsPanel";

// RESTORED ACADEMIC MODULES
import LiteratureIntelligence from "./components/academic/LiteratureIntelligence";
import OccupationalEpidemiology from "./components/academic/OccupationalEpidemiology";
import AIResearchAssistant from "./components/academic/AIResearchAssistant";
import { PDFReportHub } from "./components/academic/PDFReportHub";
import CaseArchive from "./components/academic/CaseArchive";
import ExposureDatabase from "./components/academic/ExposureDatabase";
import EmergencyToxicology from "./components/academic/EmergencyToxicology";

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

interface Aimessage {
  sender: "doctor" | "ai";
  text: string;
  time: string;
}

export default function App() {
  // Navigation & Interactive States (Single page tab system to bypass routing chunk errors)
  const [activeTab, setActiveTab] = useState<"pano" | "chemicals" | "ai" | "literature" | "epidemiology" | "reports" | "airesearch" | "cases" | "exposure" | "emergency" | "settings">("pano");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [academicMenuOpen, setAcademicMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState({
    displayName: "Dr. Şehmus Aykut",
    role: "Halk Sağlığı ve Toksikoloji Uzmanı",
    institution: "Yozgat Bozok Üniversitesi Tıp Fakültesi",
    department: "Halk Sağlığı Anabilim Dalı"
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // State: Patient management
  const [patients, setPatients] = useState<Patient[]>([
    { id: "V-101", name: "Ahmet Y.", age: 42, substance: "Tarım İlacı (Organofosfat)", location: "Yozgat / Sorgun", risk: "Kritik", status: "Yatış Verildi - Atropin İnfüzyon", date: "Bugün 18:22" },
    { id: "V-102", name: "Zeynep T.", age: 29, substance: "Karbonmonoksit (Soba Zehirlenmesi)", location: "Yozgat / Akdağmadeni", risk: "Orta", status: "Hiperbarik Oksijen Başlandı", date: "Bugün 15:40" },
    { id: "V-103", name: "Murat K.", age: 52, substance: "Ağır Metal (Kurşun Maruziyeti)", location: "Yozgat / Sarıkaya", risk: "Hafif", status: "Poliklinik Takip, Kelasyon Planlandı", date: "Dün 11:15" },
    { id: "V-104", name: "Elif B.", age: 34, substance: "Parasetamol Toksisitesi (Aşırı Doz)", location: "Yozgat / Merkez", risk: "Kritik", status: "Güvenli İzlem - NAC İnfüzyonu", date: "Dün 09:30" }
  ]);

  const [newPatient, setNewPatient] = useState({ name: "", age: "", substance: "", location: "", risk: "Orta" as "Hafif" | "Orta" | "Kritik" });

  // State: Toxicology Database Filter
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

  // State: Clinical AI Assistant Workspace
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<Aimessage[]>([
    { sender: "ai", text: "Merhaba, ben TALEP Klinik Karar Destek AI v4.0. Şüpheli semptomları veya kimyasal maruziyet bulgularını girerek hızlı toksikolojik analiz alabilirsiniz.", time: "Şimdi" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-fill test protocols inside AI workspace
  const handleAiPreset = (triggerWord: string) => {
    setAiQuery(`Hasta şüpheli ${triggerWord} maruziyeti ile acile getirildi. Triage ve tedavi protokolü önerisi nedir?`);
  };

  const handleSendAiQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    const userMsg = aiQuery;
    setAiMessages(prev => [...prev, { sender: "doctor", text: userMsg, time: "Şimdi" }]);
    setAiQuery("");
    setAiLoading(true);

    // Dynamic search engine matching to emulate extremely intelligent medical NLP
    setTimeout(() => {
      let response = "Girilen parametreler TALEP Klinik Karar Destek kütüphanesinde incelendi.\n\n";
      const queryLower = userMsg.toLowerCase();

      if (queryLower.includes("organofosfat") || queryLower.includes("tarım") || queryLower.includes("paration")) {
        response += "⚠️ KRİTİK ALARM: ORGANOFOSFAT ZEHİRLENMESİ Saptandı.\n" +
          "1. Havayolu Aşırı Salgılardan Arındırın (Atropinizasyon anahtar hedeftir).\n" +
          "2. Antidot Protokolü: Atropin Sülfat 2-5 mg IV bolus ile başlayın, akciğer sekresyonları durana kadar her 5-10 dakikada bir tekrarlayın.\n" +
          "3. Kolinesteraz Reaktivasyonu: Pralidoksim (2-PAM) 1-2 g IV yükleme, ardından infüzyon.\n" +
          "4. Kontaminasyonu Süratle Engelleyin: Hastanın elbiselerini çıkarın, cildini sabunlu suyla yıkayın.";
      } else if (queryLower.includes("karbonmonoksit") || queryLower.includes("soba") || queryLower.includes("co")) {
        response += "🌬️ CO METABOLİK REAKSİYON İZLEME PROTOKOLÜ:\n" +
          "1. Derhal kaynaktan uzaklaştırıp %100 Oksijen maskesi takın (Yarılanma ömrünü 300 dakikadan 90 dakikaya indirir).\n" +
          "2. Bilinç kaybı, gebelik, ciddi asidoz veya COHb seviyesi >%25 ise en yakın merkezde HİPERBARİK OKSİJEN tedavisini planlayın.\n" +
          "3. EKG ve Kardiyak Troponin takipleri ile iskemiyi ekarte edin.";
      } else if (queryLower.includes("parasetamol") || queryLower.includes("ilaç") || queryLower.includes("asetaminofen")) {
        response += "💊 AKUT PARASETAMOL TOKSİSİTESİ ALGORİTMASI:\n" +
          "1. Alımdan sonraki ilk 4 saatte aktif kömür (1 g/kg) uygulamasını değerlendirin.\n" +
          "2. Alım zamanı tam olarak biliniyorsa, 4. saat plazma düzeyini Rumack-Matthew Nomogramı üzerinde işaretleyin.\n" +
          "3. Toksik aralıkta ise vakit kaybetmeden N-Asetilsistein (NAC) 21 saatlik IV protokolüne başlayın (Yükleme: 150 mg/kg 60 dk içinde).";
      } else {
        response += "📋 Semptomatik Destek Önerisi:\n" +
          "Semptomlar spesifik bir toksidromla birebir eşleşmedi. Öneriler:\n" +
          "- Geniş biyokimya paneli, hemogram, kan gazı analizi ve EKG çekimi.\n" +
          "- Hidrasyonun sağlanması ve vital bulguların (nabız, ritim, saturasyon, pupiller) her 15 dakikada bir yakın takibi.\n" +
          "- Şüphelenilen kimyasalın kokusuna, fiziksel haline göre koruyucu ekipman (KBRN önlemleri) kullanarak dekontaminasyon sağlayın.";
      }

      setAiMessages(prev => [...prev, { sender: "ai", text: response, time: "Şimdi" }]);
      setAiLoading(false);
    }, 1200);
  };

  // State: Patient Creation Failsafe Helper
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

  // Filter chemicals
  const filteredChemicals = chemicalsData.filter(chem => {
    const matchesSearch = chem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          chem.cas.includes(searchQuery);
    const matchesClass = classFilter === "Tümü" || chem.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#070b13] text-[#e2e8f0] flex flex-col md:flex-row antialiased font-sans selection:bg-cyan-500/20">
      
      {/* Premium Cinematic Startup Loader */}
      <AnimatePresence>
        {loadingScreen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#070b13] flex flex-col items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative flex flex-col items-center max-w-md w-full text-center">
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-r-2 border-cyan-400 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="absolute w-16 h-16 border-b-2 border-l-2 border-indigo-500/60 rounded-full"
                />
                <TalepLogo size="md" variant="glass" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">COGNITIVE MEDICAL ENGINE v4.0</span>
                <h2 className="text-xl font-black text-white tracking-tight">TALEP BAŞLATILIYOR</h2>
                <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-2" />
                
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-4 animate-pulse">
                  System diagnostics, local databases & clinician modules loading...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Absolute Ambient Background Lights for Hospital ICU Aesthetics - Animated for High Premium Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#04060b] bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)]" />
        <motion.div 
          animate={{
            x: [0, 40, -25, 0],
            y: [0, -40, 15, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-12 right-20 w-[420px] h-[420px] bg-cyan-500/[0.07] rounded-full blur-[110px]"
        />
        <motion.div 
          animate={{
            x: [0, -30, 25, 0],
            y: [0, 25, -35, 0],
            scale: [1, 0.92, 1.08, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-10 w-[380px] h-[380px] bg-indigo-500/[0.05] rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-30" />
      </div>

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden bg-slate-950/95 border-b border-white/5 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <TalepLogo size="sm" variant="glass" />
          <div>
            <span className="text-xs font-black tracking-widest text-[#0ea5e9] uppercase">TALEP CLISS</span>
            <p className="text-[8px] text-slate-400 uppercase font-bold">2026 ŞEHMUS AYKUT</p>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 transition-all text-cyan-400 cursor-pointer"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay Backdrop with touch close listener */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 cursor-pointer pointer-events-auto transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR (Desktop / Collapsed Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-45 w-[85%] sm:w-72 md:w-72 lg:w-80 bg-gradient-to-b from-slate-950/98 via-slate-950/93 to-slate-950/98 border-r border-cyan-500/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-[4px_0_40px_rgba(6,182,212,0.03)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:sticky md:top-0 md:h-[100dvh] shrink-0
      `}>
        {/* Brand Content */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <TalepLogo size="md" variant="glass" />
            <div>
              <span className="text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
                TALEP v4.0
              </span>
              <p className="text-[9px] text-slate-400 font-black tracking-wider uppercase mt-0.5">PREMIUM CDSS</p>
            </div>
          </div>

          {/* Clinician Profile Short Overview */}
          <div className="bg-slate-900/40 p-4 border border-white/5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
              ŞA
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-extrabold text-white block truncate">{sessionUser.displayName}</span>
              <span className="text-[9.5px] text-slate-400 block truncate leading-none mt-1">{sessionUser.department}</span>
            </div>
          </div>

          {/* Sidebar Nav Buttons */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-none pr-1 space-y-5 pt-4">
            <div>
              <span className="text-[9px] font-black tracking-[0.2em] text-cyan-400 uppercase pl-2 block mb-2 select-none">KLİNİK MODÜLLER</span>
              <nav className="space-y-1">
                <button
                  id="nav-pano"
                  onClick={() => { setActiveTab("pano"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "pano" 
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Activity size={15} />
                  Sürveyans / Pano
                </button>
                <button
                  id="nav-chemicals"
                  onClick={() => { setActiveTab("chemicals"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "chemicals" 
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Database size={15} />
                  Toksikoloji DB
                </button>
                <button
                  id="nav-ai"
                  onClick={() => { setActiveTab("ai"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "ai" 
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Bot size={15} />
                  TALEP Klinik AI
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[9px] font-black tracking-[0.2em] text-[#06b6d4] uppercase pl-2 block mb-2 select-none">AKADEMİK KATMAN</span>
              <nav className="space-y-1">
                <button
                  id="nav-literature"
                  onClick={() => { setActiveTab("literature"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "literature" 
                      ? "bg-[#06b6d4] text-slate-950 shadow-lg shadow-cyan-500/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen size={15} />
                  Literatür İstihbaratı
                </button>
                <button
                  id="nav-epidemiology"
                  onClick={() => { setActiveTab("epidemiology"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "epidemiology" 
                      ? "bg-[#06b6d4] text-slate-950 shadow-lg shadow-[#06b6d4]/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <TrendingUp size={15} />
                  Mesleki Epidemiyoloji
                </button>
                <button
                  id="nav-airesearch"
                  onClick={() => { setActiveTab("airesearch"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "airesearch" 
                      ? "bg-[#06b6d4] text-slate-950 shadow-lg shadow-[#06b6d4]/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles size={15} />
                  AI Araştırma Asistanı
                </button>
                <button
                  id="nav-reports"
                  onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "reports" 
                      ? "bg-[#06b6d4] text-slate-950 shadow-lg shadow-[#06b6d4]/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText size={15} />
                  Raporlama Merkezi
                </button>
                <button
                  id="nav-cases"
                  onClick={() => { setActiveTab("cases"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "cases" 
                      ? "bg-[#06b6d4] text-slate-950 shadow-lg shadow-[#06b6d4]/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Users size={15} />
                  Vaka Arşiv Sistemi
                </button>
                <button
                  id="nav-exposure"
                  onClick={() => { setActiveTab("exposure"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "exposure" 
                      ? "bg-[#06b6d4] text-slate-950 shadow-lg shadow-[#06b6d4]/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Database size={15} />
                  Maruziyet Veritabanı
                </button>
                <button
                  id="nav-emergency"
                  onClick={() => { setActiveTab("emergency"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "emergency" 
                      ? "bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Flame size={15} />
                  Acil Toksikoloji
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase pl-2 block mb-2 select-none">SİSTEM</span>
              <nav className="space-y-1">
                <button
                  id="nav-settings"
                  onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-black text-xs transition-all pointer-events-auto cursor-pointer ${
                    activeTab === "settings" 
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/15" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Settings size={15} />
                  Sistem Tanımları
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer and Branding */}
        <div className="pt-6 border-t border-white/5 text-center md:text-left space-y-1">
          <p className="text-[10px] font-bold text-[#06b6d4] leading-normal uppercase">
            Yozgat Bozok Üniversitesi
          </p>
          <p className="text-[8.5px] font-bold text-slate-500 leading-normal">
            Halk Sağlığı Tıp Fakültesi &copy; 2026
          </p>
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 pb-[calc(110px+env(safe-area-inset-bottom))] md:pb-8 overflow-y-auto overflow-x-hidden min-w-0 w-full space-y-8">
        
        {/* TOP CLÍNICAL HEADER HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/30 p-6 border border-white/5 rounded-3xl backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">AKILLI TIBBİ DESTEK KATMANI</span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Toksikolojik Vaka Takip & Karar Destek Sistemi
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 select-none">
              <Building size={12} className="text-cyan-500" />
              Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Bölümü Arşiv Podyumu
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-2xl border border-white/5 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              GÜVENLİ SİSTEM BAĞLANTISI: AKTİF
            </span>
          </div>
        </div>

        {/* ----------------- TAB 1: PANO / SURVEYANS ----------------- */}
        {activeTab === "pano" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* ADVANCED INTEGRATED CLINICAL INTELLIGENCE COCKPIT (RESTORED ULTRA PREMIUM HERO) */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900/90 to-[#0c1020] p-6 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(6,182,212,0.18)] group">
              {/* Cinematic Particle Lighting & Glowing Orbs */}
              <div className="absolute top-[-20%] right-[-10%] w-[380px] h-[380px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-[4s]" />
              <div className="absolute bottom-[-15%] left-[10%] w-[320px] h-[320px] bg-gradient-to-tr from-indigo-500/8 to-transparent rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-stretch gap-8">
                {/* Main Branding & Intel Context */}
                <div className="space-y-4 max-w-2xl flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-405/30 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase text-cyan-300 tracking-widest animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <Sparkles size={11} className="text-cyan-400 rotate-12" /> TOKSİKOLOJİK YAPAY ZEKA SÜRVEYANSI v4.0.2
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                      KLİNİK KARAR &amp; SÜRVEYANS KONTROL MERKEZİ
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      Bölgesel toksikolojik vaka paternlerini, antidot stok durumlarını ve klinik kimyasal veri tabanını eş zamanlı inceleyip yorumlayan, klinisyen failsafe korumalı lider yapay zeka katmanı.
                    </p>
                  </div>

                  {/* Cinematic Live Stats Ribbon */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-cyan-500/10 mt-2">
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SİSTEM LATENSİ</div>
                      <div className="text-sm font-black text-cyan-400 mt-1 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> 12ms <span className="text-[9px] text-slate-500 font-normal">REALTIME</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AKADEMİK DOĞRULUK</div>
                      <div className="text-sm font-black text-white mt-1 font-mono">
                        99.4% <span className="text-[9px] text-indigo-400 font-bold">MED-QA</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BİLİMSEL İNDEKS</div>
                      <div className="text-sm font-black text-white mt-1 font-mono">
                        25,480+ <span className="text-[9px] text-slate-400">PUBMED</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">COĞRAFİ TAKİP</div>
                      <div className="text-sm font-black text-emerald-405 text-emerald-400 mt-1 font-mono">
                        GLOBAL <span className="text-[8px] text-slate-400 font-normal">SECURE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Holographic AI Status HUD */}
                <div className="w-full lg:w-92 flex flex-col justify-between gap-4">
                  <div className="backdrop-blur-3xl bg-slate-950/80 border border-cyan-500/20 rounded-[24px] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
                    {/* Glowing Accent line */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 via-indigo-500 to-transparent" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9.5px] font-black tracking-widest text-cyan-400 uppercase">TALEP-AI INTEGRAL COGNITION</span>
                        <div className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300">Nöronal Karar Gücü</span>
                          <span className="font-mono text-cyan-400 block drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]">INTELLIGENT: 100%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full" 
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1.5 font-bold"><Database size={12} className="text-cyan-455 text-cyan-450 text-cyan-400" /> CAS CAS DATABASE</span>
                          <span className="font-mono text-slate-300">22 Milyon Sinyal / Sn</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-900 pt-4 mt-6">
                      <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        <span className="text-cyan-400 font-bold block mb-1">■ KRONİK MARUZİYET ALGORİTMALARI:</span>
                        Sanayi kimyasalları ve pestisit zehirlenmelerinde vaka korelasyonu ve antidot rezonans taraması aktif yürütülmektedir.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Micro stats cards grid - Ultra Premium Holographic Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -6, scale: 1.025, borderColor: "rgba(239, 68, 68, 0.35)", boxShadow: "0 20px 40px rgba(239, 68, 68, 0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="backdrop-blur-2xl bg-slate-900/40 border border-red-500/15 rounded-[24px] p-6 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/[0.03] rounded-full blur-2xl pointer-events-none" />
                <span className="text-[9.5px] font-black tracking-widest text-[#ef4444] uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  ACİL TAKİPTEKİ VAKALAR
                </span>
                <p className="text-4xl font-black text-white mt-4 tracking-tight">{patients.length} <span className="text-xs font-semibold text-slate-400">Hasta</span></p>
                <p className="text-[11px] text-slate-300 mt-2.5 flex items-center gap-2 select-none">
                  <Heart size={13} className="text-rose-500 fill-rose-500/20" /> 
                  Atropin, Hiperbarik & Aktif Protokoller
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -6, scale: 1.025, borderColor: "rgba(6, 182, 212, 0.35)", boxShadow: "0 20px 40px rgba(6, 182, 212, 0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="backdrop-blur-2xl bg-slate-900/40 border border-cyan-500/15 rounded-[24px] p-6 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-[#0ea5e9] to-blue-500" />
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/[0.03] rounded-full blur-2xl pointer-events-none" />
                <span className="text-[9.5px] font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  KAYITLI KİMYASAL ETKEN
                </span>
                <p className="text-4xl font-black text-white mt-4 tracking-tight">{chemicalsData.length} <span className="text-xs font-semibold text-slate-400">Molekül</span></p>
                <p className="text-[11px] text-slate-300 mt-2.5 flex items-center gap-2 select-none">
                  <Database size={13} className="text-cyan-400 animate-pulse" /> 
                  Antidot, CAS & Klinik Sınıflandırma
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -6, scale: 1.025, borderColor: "rgba(16, 185, 129, 0.35)", boxShadow: "0 20px 40px rgba(16, 185, 129, 0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="backdrop-blur-2xl bg-slate-900/40 border border-emerald-500/15 rounded-[24px] p-6 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/[0.03] rounded-full blur-2xl pointer-events-none" />
                <span className="text-[9.5px] font-black tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  YAPAY ZEKA LOKAL SAĞLIK
                </span>
                <p className="text-4xl font-black text-white mt-4 tracking-tight">AKTİF <span className="text-xs font-semibold text-emerald-500">Maksimum</span></p>
                <p className="text-[11px] text-slate-300 mt-2.5 flex items-center gap-2 select-none">
                  <CheckCircle size={13} className="text-emerald-400" /> 
                  Çevrimdışı Failsafe Koruma Modu
                </p>
              </motion.div>
            </div>

            {/* Patients management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Surveillance Case Table */}
              <div className="lg:col-span-2 backdrop-blur-xl bg-slate-900/40 border border-cyan-500/10 rounded-[32px] p-6 space-y-6 shadow-[0_0_40px_rgba(0,255,255,0.05)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Users size={18} className="text-[#0ea5e9]" />
                    Aktif Sürveyans Havuzu
                  </h3>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg font-bold">
                    Canlı Takip
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400 font-bold">
                        <th className="pb-3 font-semibold">Vaka No</th>
                        <th className="pb-3 font-semibold">Ad Soyad</th>
                        <th className="pb-3 font-semibold">Zehirlenme Şüphesi / Etken</th>
                        <th className="pb-3 font-semibold">Bölge</th>
                        <th className="pb-3 font-semibold">Önem</th>
                        <th className="pb-3 text-right">Eylemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {patients.map(patient => (
                        <tr key={patient.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 font-mono font-black text-slate-400">{patient.id}</td>
                          <td className="py-4">
                            <span className="font-bold text-white block">{patient.name}</span>
                            <span className="text-[10px] text-slate-400">{patient.age} Yaş, {patient.date}</span>
                          </td>
                          <td className="py-4">
                            <span className="text-cyan-400">{patient.substance}</span>
                            <p className="text-[10px] text-slate-450 truncate max-w-[200px]">{patient.status}</p>
                          </td>
                          <td className="py-4 text-slate-400 font-medium">{patient.location}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                              patient.risk === "Kritik" 
                                ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                : patient.risk === "Orta"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            }`}>
                              {patient.risk}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              id={`delete-btn-${patient.id}`}
                              onClick={() => handleDeletePatient(patient.id)}
                              className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-bold transition-all border border-rose-500/20 cursor-pointer"
                            >
                              Arşivle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Case Form */}
              <div className="backdrop-blur-xl bg-slate-900/40 border border-cyan-500/10 rounded-[32px] p-6 space-y-6 shadow-[0_0_40px_rgba(0,255,255,0.05)]">
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-500" />
                  Yeni Şüpheli Bildirimi
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  İl Sağlık Müdürlüğü veya Acil Servis üzerinden gelen toksikolojik maruziyet bildirimini sisteme girin.
                </p>

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HASTA ADI SOYADI</label>
                    <input
                      required
                      type="text"
                      placeholder="Örn: Mehmet S."
                      value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                      className="w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YAŞ</label>
                      <input
                        type="number"
                        placeholder="Örn: 42"
                        value={newPatient.age}
                        onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                        className="w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YERLEŞİM YERİ</label>
                      <input
                        type="text"
                        placeholder="Örn: Sorgun"
                        value={newPatient.location}
                        onChange={e => setNewPatient({...newPatient, location: e.target.value})}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KİMYASAL ETKEN ŞÜPHESİ</label>
                    <input
                      required
                      type="text"
                      placeholder="Örn: Organofosfat pestisit, kurşun"
                      value={newPatient.substance}
                      onChange={e => setNewPatient({...newPatient, substance: e.target.value})}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KADEME / RİSK</label>
                    <select
                      value={newPatient.risk}
                      onChange={e => setNewPatient({...newPatient, risk: e.target.value as any})}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    >
                      <option value="Hafif">Hafif (Yeşil Alan Takip)</option>
                      <option value="Orta">Orta (Sarı Alan Gözlem)</option>
                      <option value="Kritik">Kritik (Kırmızı Alan Yoğun Bakım)</option>
                    </select>
                  </div>

                  <button
                    id="submit-patient-btn"
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play size={10} fill="currentColor" />
                    Sürveyansa Kaydet
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* ----------------- TAB 2: TOKSİKOLOJİ DB ----------------- */}
        {activeTab === "chemicals" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="backdrop-blur-xl bg-slate-900/40 border border-cyan-500/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(0,255,255,0.05)]"
          >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Database size={18} className="text-[#0ea5e9]" />
                  Global Toksikolojik Etken Kütüphanesi
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Maruziyete sebep olan molekülleri CAS Numarası, Yasal Limitleri ve Triage prensipleri doğrultusunda filtreleyin.
                </p>
              </div>

              {/* Class category filters */}
              <div className="flex gap-1.5 flex-wrap">
                {["Tümü", "Organofosfat", "İnhalasyon", "Ağır Metal", "İlaç Etken Maddesi", "Deri/Korozif"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setClassFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
                      classFilter === cat 
                        ? "bg-cyan-500 text-slate-950 border-cyan-500 font-black" 
                        : "bg-slate-900 text-slate-400 border-white/5 hover:border-cyan-500/20 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Compound Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Kimyasal Adı veya CAS Numarası ile arama yapın... (Örn: 56-38-2 veya parasetamol)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-cyan-500/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            {/* Interactive Grid Table of chemicals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChemicals.map(chem => (
                <motion.div 
                  whileHover={{ scale: 1.01, border: "1px solid rgba(6,182,212,0.3)" }}
                  key={chem.id} 
                  className="bg-slate-950/50 rounded-2xl p-5 border border-white/5 space-y-4 hover:border-cyan-500/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-slate-900 border border-white/5 px-2.5 py-1 rounded-md text-slate-400 font-bold font-mono">
                        CAS NO: {chem.cas}
                      </span>
                      <h4 className="text-sm font-black text-white mt-2 tracking-tight">{chem.name}</h4>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {chem.class}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <p className="text-xs">
                      <strong className="text-slate-400">Yasal Limitler:</strong>{" "}
                      <span className="text-[#0ea5e9] font-mono font-medium">{chem.limit}</span>
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-rose-450 block mb-1">Klinik Bulgular & Triage:</strong> 
                      {chem.triage}
                    </p>
                    <p className="text-xs text-slate-300 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/10">
                      <strong className="text-cyan-400 block mb-0.5">Önerilen Antidot Takvimi:</strong> 
                      {chem.antidote}
                    </p>
                  </div>
                </motion.div>
              ))}

              {filteredChemicals.length === 0 && (
                <div className="md:col-span-2 text-center p-12 bg-slate-950/40 border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                  Arama kriterlerinize uyan kayıt bulunamadı. Lütfen filtreleri veya anahtar kelimeyi değiştirin.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ----------------- TAB 3: KLINIK YAPAY ZEKA ----------------- */}
        {activeTab === "ai" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <TalepAI />
          </motion.div>
        )}

        {/* ----------------- TAB 4: SISTEM TANIMLARI ----------------- */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsPanel sessionUser={sessionUser} setSessionUser={setSessionUser} />
          </motion.div>
        )}

        {/* ----------------- TAB 5: LITERATURE INTELLIGENCE ----------------- */}
        {activeTab === "literature" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LiteratureIntelligence />
          </motion.div>
        )}

        {/* ----------------- TAB 6: EPIDEMIOLOGY INTELLIGENCE ----------------- */}
        {activeTab === "epidemiology" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OccupationalEpidemiology />
          </motion.div>
        )}

        {/* ----------------- TAB 7: AI RESEARCH ASSISTANT ----------------- */}
        {activeTab === "airesearch" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AIResearchAssistant />
          </motion.div>
        )}

        {/* ----------------- TAB 8: REPORTS CENTER ----------------- */}
        {activeTab === "reports" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PDFReportHub />
          </motion.div>
        )}

        {/* ----------------- TAB 9: CASE ARCHIVE ----------------- */}
        {activeTab === "cases" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CaseArchive />
          </motion.div>
        )}

        {/* ----------------- TAB 10: EXPOSURE DATABASE ----------------- */}
        {activeTab === "exposure" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExposureDatabase />
          </motion.div>
        )}

        {/* ----------------- TAB 11: EMERGENCY TOXICOLOGY ----------------- */}
        {activeTab === "emergency" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmergencyToxicology />
          </motion.div>
        )}

      </main>

      {/* MOBILE PREMIUM FLOATING DOCK (Apple Contacts / Apple Health / VisionOS Aesthetic) */}
      <div 
        className="md:hidden fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md bg-slate-950/80 border border-cyan-500/15 backdrop-blur-3xl rounded-[32px] p-2 shadow-[0_0_50px_rgba(6,182,212,0.22)] select-none overflow-visible"
      >
        <AnimatePresence>
          {academicMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[94%] bg-slate-950/95 border border-cyan-500/20 backdrop-blur-3xl rounded-[24px] p-3 shadow-[0_-15px_40px_rgba(6,182,212,0.25)] z-40 space-y-1"
            >
              <div className="text-[9px] font-black text-cyan-400 pl-3 pb-2 border-b border-cyan-500/10 tracking-widest uppercase mb-1.5 flex items-center justify-between">
                <span>AKADEMİK KATMAN SEÇİN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              {[
                { id: "epidemiology", label: "Mesleki Epidemiyoloji", desc: "Coğrafi & sektörel analizler", icon: TrendingUp },
                { id: "airesearch", label: "Yapay Zeka Tez / Analiz", desc: "Tez & literatür çıkarımı", icon: Sparkles },
                { id: "cases", label: "Vaka Arşivi", desc: "Sürveyans vaka kayıtları", icon: Users },
                { id: "exposure", label: "Maruziyet Veritabanı", desc: "Halk sağlığı maruziyetleri", icon: Database },
                { id: "emergency", label: "Acil Toksikoloji", desc: "Zaman-kritik müdahaleler", icon: Flame },
              ].map(sub => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveTab(sub.id as any);
                      setAcademicMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left cursor-pointer ${
                      isSubActive 
                        ? "bg-cyan-500/15 border border-cyan-400/20 text-cyan-400" 
                        : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isSubActive ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-900 text-slate-400"}`}>
                        <SubIcon size={13} />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">{sub.label}</div>
                        <div className="text-[9px] text-slate-400 mt-1 leading-none">{sub.desc}</div>
                      </div>
                    </div>
                    {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-450 animate-pulse bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between w-full relative z-10">
          <button
            onClick={() => { setActiveTab("pano"); setAcademicMenuOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 relative cursor-pointer min-w-[42px] flex-1 ${
              activeTab === "pano" ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity size={15} className={activeTab === "pano" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)]" : "text-slate-400"} />
            <span className="text-[7.5px] mt-1 font-black tracking-tight uppercase whitespace-nowrap">Pano</span>
            {activeTab === "pano" && (
              <motion.div layoutId="dockActiveDot" className="absolute bottom-[-1px] w-4 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab("chemicals"); setAcademicMenuOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 relative cursor-pointer min-w-[42px] flex-1 ${
              activeTab === "chemicals" ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database size={15} className={activeTab === "chemicals" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)]" : "text-slate-400"} />
            <span className="text-[7.5px] mt-1 font-black tracking-tight uppercase whitespace-nowrap">Toksik</span>
            {activeTab === "chemicals" && (
              <motion.div layoutId="dockActiveDot" className="absolute bottom-[-1px] w-4 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab("literature"); setAcademicMenuOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 relative cursor-pointer min-w-[42px] flex-1 ${
              activeTab === "literature" ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen size={15} className={activeTab === "literature" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)]" : "text-slate-400"} />
            <span className="text-[7.5px] mt-1 font-black tracking-tight uppercase whitespace-nowrap">Literatür</span>
            {activeTab === "literature" && (
              <motion.div layoutId="dockActiveDot" className="absolute bottom-[-1px] w-4 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>

          {/* Center Orb (TALEP AI) */}
          <div className="relative flex justify-center items-center px-2 shrink-0">
            <button
              onClick={() => { setActiveTab("ai"); setAcademicMenuOpen(false); }}
              className={`relative flex flex-col items-center justify-center -top-5 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-[0_0_25px_rgba(6,182,212,0.45)] border border-cyan-300/30 cursor-pointer group active:scale-95 transition-transform`}
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse" />
              <Bot size={20} className={`relative z-10 transition-transform duration-300 group-hover:scale-115 ${activeTab === "ai" ? "text-white" : "text-slate-950"}`} />
              <span className="absolute -bottom-6 text-[7.5px] font-black tracking-widest text-[#22d3ee] uppercase whitespace-nowrap drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]">TALEP AI</span>
            </button>
          </div>

          <button
            onClick={() => { setAcademicMenuOpen(!academicMenuOpen); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 relative cursor-pointer min-w-[42px] flex-1 ${
              ["epidemiology", "airesearch", "cases", "exposure", "emergency"].includes(activeTab) || academicMenuOpen ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles size={15} className={["epidemiology", "airesearch", "cases", "exposure", "emergency"].includes(activeTab) || academicMenuOpen ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)] animate-pulse" : "text-slate-400"} />
            <span className="text-[7.5px] mt-1 font-black tracking-tight uppercase whitespace-nowrap">Akademik</span>
            {["epidemiology", "airesearch", "cases", "exposure", "emergency"].includes(activeTab) && (
              <motion.div layoutId="dockActiveDot" className="absolute bottom-[-1px] w-4 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab("reports"); setAcademicMenuOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 relative cursor-pointer min-w-[42px] flex-1 ${
              activeTab === "reports" ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText size={15} className={activeTab === "reports" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)]" : "text-slate-400"} />
            <span className="text-[7.5px] mt-1 font-black tracking-tight uppercase whitespace-nowrap">Raporlar</span>
            {activeTab === "reports" && (
              <motion.div layoutId="dockActiveDot" className="absolute bottom-[-1px] w-4 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab("settings"); setAcademicMenuOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-300 relative cursor-pointer min-w-[42px] flex-1 ${
              activeTab === "settings" ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings size={15} className={activeTab === "settings" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.65)]" : "text-slate-400"} />
            <span className="text-[7.5px] mt-1 font-black tracking-tight uppercase whitespace-nowrap">Ayarlar</span>
            {activeTab === "settings" && (
              <motion.div layoutId="dockActiveDot" className="absolute bottom-[-1px] w-4 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
