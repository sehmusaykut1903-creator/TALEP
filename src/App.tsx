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
  Building
} from "lucide-react";
import TalepLogo from "./components/TalepLogo";

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
  const [activeTab, setActiveTab] = useState<"pano" | "chemicals" | "ai" | "settings">("pano");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState({
    displayName: "Dr. Şehmus Aykut",
    role: "Halk Sağlığı ve Toksikoloji Uzmanı",
    institution: "Yozgat Bozok Üniversitesi Tıp Fakültesi",
    department: "Halk Sağlığı Anabilim Dalı"
  });

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
    <div className="min-h-screen bg-[#070b13] text-[#e2e8f0] flex flex-col md:flex-row antialiased font-sans selection:bg-cyan-500/20">
      
      {/* Absolute Ambient Background Lights for Hospital ICU Aesthetics */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <TalepLogo size="sm" variant="glass" />
          <div>
            <span className="text-xs font-black tracking-widest text-[#0ea5e9] uppercase">TALEP CLISS</span>
            <p className="text-[8px] text-slate-400 uppercase font-bold">2026 ŞEHMUS AYKUT</p>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 transition-all text-cyan-400"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* LEFT SIDEBAR (Desktop / Collapsed Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-950/90 md:bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:sticky md:top-0 md:h-screen shrink-0
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
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => { setActiveTab("pano"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === "pano" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity size={16} />
              Sürveyans / Pano
            </button>
            <button
              onClick={() => { setActiveTab("chemicals"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === "chemicals" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Database size={16} />
              Toksikoloji DB
            </button>
            <button
              onClick={() => { setActiveTab("ai"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === "ai" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bot size={16} />
              TALEP Klinik AI
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all pointer-events-auto cursor-pointer ${
                activeTab === "settings" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings size={16} />
              Sistem Tanımları
            </button>
          </nav>
        </div>

        {/* Sidebar Footer and Branding */}
        <div className="pt-6 border-t border-white/5 text-center md:text-left space-y-1.5">
          <p className="text-[10px] font-bold text-[#06b6d4] leading-normal uppercase">
            Yozgat Bozok Üniversitesi
          </p>
          <p className="text-[8.5px] font-bold text-slate-500 leading-normal">
            Halk Sağlığı Tıp Fakültesi &copy; 2026
          </p>
          <p className="text-[7.5px] font-black text-rose-500 leading-none">
            EMERGENCY STABLE MODE ACTIVE
          </p>
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
        
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
              GÜVENLİ MOCK PORT: AKTİF
            </span>
          </div>
        </div>

        {/* ----------------- TAB 1: PANO / SURVEYANS ----------------- */}
        {activeTab === "pano" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Micro stats cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500" />
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">ACİL TAKİPTEKİ VAKALAR</span>
                <p className="text-3xl font-black text-white mt-3">{patients.length} Hasta</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Heart size={12} className="text-rose-500" /> Atropin & Hiperbarik Protokolleri
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">KAYITLI KİMYASAL ETKEN</span>
                <p className="text-3xl font-black text-white mt-3">{chemicalsData.length} Molekül</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Database size={12} className="text-cyan-500 animate-pulse" /> Antidot ve CAS İndeksleme
                </p>
              </div>

              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-400" />
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">YAPAY ZEKA LOKAL SAĞLIK</span>
                <p className="text-3xl font-black text-white mt-3">Maksimum</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <CheckCircle size={12} className="text-teal-400" /> Çevrimdışı Failsafe Aktif
                </p>
              </div>
            </div>

            {/* Patients management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Surveillance Case Table */}
              <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[32px] p-6 space-y-6">
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
              <div className="bg-slate-900/60 border border-white/5 rounded-[32px] p-6 space-y-6">
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
                    <Play size={12} fill="currentColor" />
                    Sürveyansa Kaydet
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- TAB 2: TOKSİKOLOJİ DB ----------------- */}
        {activeTab === "chemicals" && (
          <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        : "bg-slate-900 text-slate-400 border-white/5 hover:border-white/15"
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
                className="w-full bg-slate-950/80 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            {/* Interactive Grid Table of chemicals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChemicals.map(chem => (
                <div key={chem.id} className="bg-slate-950/50 rounded-2xl p-5 border border-white/5 space-y-4 hover:border-cyan-500/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-slate-900 border border-white/5 px-2.5 py-1 rounded-md text-slate-400 font-bold font-mono">
                        CAS NO: {chem.cas}
                      </span>
                      <h4 className="text-sm font-black text-white mt-2 tracking-tight">{chem.name}</h4>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-505/10 text-cyan-400 border border-cyan-500/20">
                      {chem.class}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <p className="text-xs">
                      <strong className="text-slate-400">Yasal Limitler:</strong>{" "}
                      <span className="text-[#0ea5e9] font-mono font-medium">{chem.limit}</span>
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-rose-400 block mb-1">Klinik Bulgular & Triage:</strong> 
                      {chem.triage}
                    </p>
                    <p className="text-xs text-slate-300 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/10">
                      <strong className="text-cyan-400 block mb-0.5">Önerilen Antidot Takvimi:</strong> 
                      {chem.antidote}
                    </p>
                  </div>
                </div>
              ))}

              {filteredChemicals.length === 0 && (
                <div className="md:col-span-2 text-center p-12 bg-slate-950/40 border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                  Arama kriterlerinize uyan kayıt bulunamadı. Lütfen filtreleri veya anahtar kelimeyi değiştirin.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: KLINIK YAPAY ZEKA ----------------- */}
        {activeTab === "ai" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in animate-slide-up">
            
            {/* AI Playground Chatbox */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col h-[520px] justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 animate-pulse">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">TALEP Klinik Karar Karar Destek AI</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Halk Sağlığı & Toksikoloji İletişim Asistanı</p>
                  </div>
                </div>
                <span className="text-[9px] bg-slate-950 border border-white/5 text-slate-400 px-2.5 py-1 rounded-lg font-bold">
                  v4.0 L-NLP ACTIVE
                </span>
              </div>

              {/* Chat flow */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {aiMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === "doctor" ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className={`
                      p-4 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-wrap
                      ${msg.sender === "doctor" 
                        ? "bg-cyan-500 text-slate-950 rounded-br-none" 
                        : "bg-slate-950/90 text-slate-350 border border-white/5 rounded-bl-none"}
                    `}>
                      {msg.text}
                    </div>
                    <span className="text-[8.5px] text-slate-500 mt-1 select-none font-medium">{msg.time}</span>
                  </div>
                ))}

                {aiLoading && (
                  <div className="flex items-center gap-2 text-slate-450 text-[10px] font-bold py-2 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    Toksikolojik veriler ve vaka kütüphanesi taranıyor...
                  </div>
                )}
              </div>

              {/* Input section */}
              <form onSubmit={handleSendAiQuery} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Hastanın bulgularını veya maruz kalınan maddeyi buraya yazın..."
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
                <button
                  id="send-query-ai-btn"
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>

            {/* Guidelines & Quick Prompt Presets */}
            <div className="bg-slate-900/60 border border-white/5 rounded-[32px] p-6 space-y-6">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Hızlı Klinik Sorgular</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aşağıdaki butonlara tıklayarak doğrudan kütüphane analizlerini simüle edebilir veya ilgili zehirlenme senaryolarını test edebilirsiniz.
              </p>

              <div className="space-y-2">
                <button
                  id="preset-organofosfat"
                  onClick={() => handleAiPreset("Organofosfat (Tarım İlacı)")}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/20 text-xs text-slate-330 hover:text-white transition-all pointer-events-auto cursor-pointer flex items-center justify-between"
                >
                  <span>Organofosfat Maruziyeti</span>
                  <ChevronRight size={12} className="text-cyan-400" />
                </button>
                <button
                  id="preset-karbonmonoksit"
                  onClick={() => handleAiPreset("Karbonmonoksit (CO Gazı)")}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/20 text-xs text-slate-330 hover:text-white transition-all pointer-events-auto cursor-pointer flex items-center justify-between"
                >
                  <span>Karbonmonoksit Tedavisi</span>
                  <ChevronRight size={12} className="text-cyan-400" />
                </button>
                <button
                  id="preset-parasetamol"
                  onClick={() => handleAiPreset("Parasetamol (Aşırı Doz)")}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/20 text-xs text-slate-330 hover:text-white transition-all pointer-events-auto cursor-pointer flex items-center justify-between"
                >
                  <span>Aşırı Doz Parasetamol Alımı</span>
                  <ChevronRight size={12} className="text-cyan-400" />
                </button>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-xs text-slate-400 leading-relaxed">
                <span className="font-extrabold text-amber-400 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                  <AlertTriangle size={12} /> Hekim Sorumluluk Feragatnamesi
                </span>
                TALEP Klinik AI, halk sağlığı verilerini referans alan bir tıbbi algoritmik rehberdir. Uygulayıcı hekimin teşhis, nihai karar ve lokal protokollerinin yerini alamaz.
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB 4: SISTEM TANIMLARI ----------------- */}
        {activeTab === "settings" && (
          <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8 space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Settings size={18} className="text-[#0ea5e9]" />
                Sistemsel Stabilizasyon ve Arşiv Yapılandırması
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kriter ve entegrasyon ayarlarını, veritabanı senkronizasyon protokollerini yönetin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-widest text-[#0ea5e9] uppercase">AKTİF KULLANICI BİLGİSİ</span>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                    <User size={16} className="text-cyan-400" />
                    <div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widestblock">YETKİLİ HEKİM</span>
                      <p className="text-xs font-bold text-white mt-0.5">{sessionUser.displayName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                    <Building size={16} className="text-cyan-400" />
                    <div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widestblock">KURUM VE BÖLÜM</span>
                      <p className="text-xs font-bold text-white mt-0.5">{sessionUser.institution}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase">ACİL KORUMA & KÜTÜPHANE RESET</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  İstemci tarafında biriken önbellek veya IndexedDB tıkanıklıklarında aşağıdaki sıfırlama mekanizmasını kullanarak uygulamayı güvenli modda açabilirsiniz.
                </p>

                <div className="pt-2">
                  <button
                    id="reset-globals-storage"
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      alert("Önbellek başarıyla temizlendi! Sayfa yeniden yüklenecektir.");
                      window.location.reload();
                    }}
                    className="px-5 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md"
                  >
                    Tüm Önbelleği Sıfırla ve Yenile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
