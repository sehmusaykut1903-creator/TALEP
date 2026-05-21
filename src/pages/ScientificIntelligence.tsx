import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  AlertTriangle, 
  Users, 
  ShieldCheck, 
  Database, 
  Activity, 
  Trash2, 
  Download, 
  Send,
  Lock,
  Search,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Flame,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  BookMarked,
  Layers,
  Heart
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { scientificDatabase, ScientificToxin } from '../data/scientificDatabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface ScientificIntelligenceProps {
  defaultTab?: string;
}

export default function ScientificIntelligence({ defaultTab = 'literature' }: ScientificIntelligenceProps) {
  const { theme, t, showToast } = useSettings();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedToxin, setSelectedToxin] = useState<ScientificToxin>(scientificDatabase[0]);
  const [dbSearch, setDbSearch] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLog, setAiLog] = useState<{ role: 'user' | 'ai'; text: string; time: string }[]>([
    {
      role: 'ai',
      text: "TALEP Akademik AI Araştırma Asistanı aktif. Prof. Dr. Vugar Ali Türksoy bilimsel metodolojisi çerçevesinde literatür, PubMed referansları ve mesleki klinik epidemiyoloji verilerini analiz etmeye hazırım.",
      time: "Şimdi"
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // For Odds Ratio Calculator state
  const [exposedSick, setExposedSick] = useState(42);
  const [exposedHealthy, setExposedHealthy] = useState(15);
  const [unexposedSick, setUnexposedSick] = useState(12);
  const [unexposedHealthy, setUnexposedHealthy] = useState(85);

  const oddsRatio = ((exposedSick * unexposedHealthy) / (exposedHealthy * unexposedSick)).toFixed(2);
  const relativeRisk = (((exposedSick / (exposedSick + exposedHealthy)) / (unexposedSick / (unexposedSick + unexposedHealthy)))).toFixed(2);

  // Mock cases in archive with detailed reports data
  const [archivedCases, setArchivedCases] = useState([
    {
      id: "case-011",
      name: "Sabri Y.",
      sector: "Akü / Metal",
      unit: "Döküm / Kurşun Eritme",
      risk: "Yüksek",
      bloodLead: "45 µg/dL",
      symptoms: ["Hafif Tremor", "Karın Ağrısı", "Baş Ağrısı"],
      date: "2026-05-18",
      doctor: "F. N. Aykut",
      status: "Raporlandı",
      qrCode: "TALEP-V2-011-VERIFIED"
    },
    {
      id: "case-012",
      name: "Tarkan K.",
      sector: "Boya / Kimya",
      unit: " Solvent Karıştırma Tankları",
      risk: "Yüksek",
      bloodLead: "Maks",
      symptoms: ["Dermal İrritasyon", "Ataksi", "Narkoz"],
      date: "2026-05-19",
      doctor: "Şehmus Aykut",
      status: "Takipte",
      qrCode: "TALEP-V2-012-VERIFIED"
    },
    {
      id: "case-013",
      name: "Leyla M.",
      sector: "Tarım",
      unit: "Sera İlaçlama",
      risk: "Kritik",
      cholinesterase: "3400 U/L",
      symptoms: ["Miyozis", "Bronkore", "Bulanık Görme"],
      date: "2026-05-20",
      doctor: "Aghajan Musalı",
      status: "Yoğun Bakım Antidot",
      qrCode: "TALEP-V2-013-VERIFIED"
    }
  ]);

  // Handle scientific AI Assistant messages
  const handleAiSend = () => {
    if (!aiPrompt.trim()) return;
    const userPrompt = aiPrompt;
    setAiLog(p => [...p, { role: 'user', text: userPrompt, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setAiPrompt('');
    setIsAiLoading(true);

    setTimeout(() => {
      let aiText = `Girdiğiniz "${userPrompt}" sorgusu için veritabanı analiz edildi. `;
      const matched = scientificDatabase.find(tox => tox.name.toLowerCase().includes(userPrompt.toLowerCase()) || tox.sectors.some(s => s.toLowerCase().includes(userPrompt.toLowerCase())));

      if (matched) {
        aiText += `Prof. Dr. Vugar Ali Türksoy'un literatür eşlemelerine göre, ${matched.name} (CAS: ${matched.cas}) toksik maddesinin ${matched.sectors.join(', ')} sektörlerinde yoğun risk oluşturduğu bildirilmiştir. Klinik kılavuza göre hedef organlar: ${matched.targetOrgans.join(', ')}. Önerilen biyotakip yöntemi: ${matched.biologicalBiomarkers.map(b => `${b.marker} (${b.specimen})`).join(' ve ')}.`;
      } else {
        aiText += "Genel mesleki toksikoloji modeline göre; organik solventler, anilin grubu türevleri ve kurşun maruziyetlerinde erken tanı için tam kan sayımı, biyokimya biyobelirteçleri ve periyodik SFT takipleri kritik öneme sahiptir. Lütfen tarama parametrelerini optimize edin veya spesifik bir toksik ajan sorgulayın (örn: 'Kurşun' veya 'Benzen').";
      }

      setAiLog(p => [...p, { role: 'ai', text: aiText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsAiLoading(false);
    }, 1200);
  };

  const filteredToxins = scientificDatabase.filter(tox => 
    tox.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
    tox.cas.includes(dbSearch) ||
    tox.sectors.some(s => s.toLowerCase().includes(dbSearch.toLowerCase()))
  );

  // Interactive PDF Report simulation loader
  const handleDownloadReport = (cas: any) => {
    showToast(`${cas.name} için klinik onaylı, QR kodlu PDF raporu başarıyla hazırlandı ve indirildi.`);
  };

  // Timeline epidemiology chart mock data
  const epidemiologicData = [
    { year: '2021', benzen: 12, kurshun: 35, organofosfat: 45 },
    { year: '2022', benzen: 19, kurshun: 29, organofosfat: 55 },
    { year: '2023', benzen: 15, kurshun: 42, organofosfat: 38 },
    { year: '2024', benzen: 28, kurshun: 31, organofosfat: 62 },
    { year: '2025', benzen: 34, kurshun: 22, organofosfat: 70 },
    { year: '2026', benzen: 41, kurshun: 18, organofosfat: 82 },
  ];

  return (
    <div className="space-y-8 flex flex-col min-h-screen">
      {/* VUGAR ALI TURKSOY HEADER CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
         <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                  <Award className="text-amber-400 shrink-0" size={24} />
                  <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase">PROF. DR. VUGAR ALI TÜRKSOY AKADEMİK KATMANI</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-black tracking-tighter">TOKSİKOLOJİ AKADEMİK İSTİHBARAT SİSTEMİ</h1>
               <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                  İş sağlığı, epidemiyolojik trendler, maruziyet risk modellemeleri ve literatür tabanlı karar destek motoru.
               </p>
            </div>
            
            <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center shrink-0">
               <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Platform Modu</div>
               <div className="text-lg font-black text-white mt-1">Klinik & Akademik</div>
               <div className="text-[9px] text-slate-400 italic mt-0.5">TALEP v3.0 Premium</div>
            </div>
         </div>
      </div>

      {/* HORIZONTAL TAB CONTROL */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
         {[
           { id: 'literature', label: 'Yerleşik Literatür', icon: BookOpen },
           { id: 'epidemiology', label: 'Epidemiyolojik Karar', icon: TrendingUp },
           { id: 'exposure_db', label: 'Kimyasal Toksin Veritabanı', icon: Database },
           { id: 'case_archive', label: 'Vaka Arşivi & QR Onaylı Raporlar', icon: FileText },
           { id: 'ai_research', label: 'Akademik AI Asistan', icon: Sparkles },
           { id: 'emergency', label: 'Acil Toksikoloji Kılavuzu', icon: Flame }
         ].map(tab => {
           const Icon = tab.icon;
           const isSelected = activeTab === tab.id;
           return (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); }}
               className={`flex items-center gap-2 px-6 py-4.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 duration-200 ${
                 isSelected 
                   ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/15 scale-[1.02]' 
                   : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/50'
               }`}
             >
               <Icon size={16} />
               {tab.label}
             </button>
           );
         })}
      </div>

      {/* CORE TAB PAGES CONTENT */}
      <div className="flex-1">
         <AnimatePresence mode="wait">
            
            {/* TAB LITERATUR */}
            {activeTab === 'literature' && (
              <motion.div
                key="literature"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5">
                      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                         <BookMarked size={20} className="text-slate-700" />
                         Entegre Klinik Literatür & PubMed Makaleleri
                      </h3>
                      <div className="space-y-6">
                         {scientificDatabase.map((tox) => (
                           <div key={tox.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                              <div className="flex justify-between items-center">
                                 <h4 className="font-bold text-slate-800 text-sm">{tox.name} (CAS {tox.cas}) Literatür Verisi</h4>
                                 <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg">Grup 1 Karsinojen</span>
                              </div>
                              <div className="space-y-2">
                                 {tox.academicReferences.map((ref, idx) => (
                                   <div key={idx} className="bg-white border border-slate-150 p-4 rounded-xl flex justify-between items-start gap-4">
                                      <div className="space-y-1">
                                         <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{ref.citation}"</p>
                                         <div className="flex gap-2">
                                            <span className="text-[9px] font-black uppercase text-indigo-500 px-1.5 py-0.5 bg-indigo-50 rounded-md">Ajans: {ref.agency}</span>
                                            {ref.pubmedId && <span className="text-[9px] font-black uppercase text-slate-400">PubMed: {ref.pubmedId}</span>}
                                         </div>
                                      </div>
                                      <button className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0">
                                         Aç <ExternalLink size={10} />
                                      </button>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white rounded-[2.5rem] p-8 border border-indigo-950 shadow-xl">
                      <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-4">AKADEMİK DANIŞMANLIK NOTLARI</h3>
                      <p className="text-xs font-medium leading-relaxed opacity-90 italic">
                         "Mesleki kimyasal maruziyetler akut klinik tablolardan ziyade sessizce ilerleyen kronik hematopoetik ve nörotoksik hasarlarla seyreder. Bu prototip, sanayi tesislerimizdeki işçilerimizin erken tanı ve profil takiplerini kolaylaştırmak amacıyla dizayn edilmiştir."
                      </p>
                      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-indigo-800">
                         <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center text-sm font-black">VT</div>
                         <div>
                            <p className="text-xs font-black">Prof. Dr. Vugar Ali Türksoy</p>
                            <p className="text-[10px] opacity-60 font-bold">Toksikoloji ve Halk Sağlığı ABD Başkanı</p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* TAB EPIDEMIOLOGY */}
            {activeTab === 'epidemiology' && (
              <motion.div
                key="epidemiology"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5 space-y-6">
                      <div className="flex justify-between items-center">
                         <div>
                            <h3 className="text-lg font-black text-slate-900 leading-none">Aylık Sektörel Maruziyet ve Toksik Vaka Trendleri</h3>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Bileşik zaman serisi analizi.</p>
                         </div>
                      </div>
                      
                      <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={epidemiologicData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} />
                               <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                               <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                               <Tooltip />
                               <Legend />
                               <Line type="monotone" dataKey="benzen" stroke="#3b82f6" strokeWidth={3} name="Solventler / Benzen" />
                               <Line type="monotone" dataKey="kurshun" stroke="#ef4444" strokeWidth={3} name="Ağır Metaller / Kurşun" />
                               <Line type="monotone" dataKey="organofosfat" stroke="#10b981" strokeWidth={3} name="Pestisit Maruziyeti" />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5 space-y-6">
                      <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest leading-none">Kümülatif Risk Odakları</h3>
                      
                      <div className="h-60 w-full flex items-center justify-center">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                              { subject: 'Hematotoksisite', A: 120, B: 110, fullMark: 150 },
                              { subject: 'Nörotoksisite', A: 98, B: 130, fullMark: 150 },
                              { subject: 'Hepatotoksisite', A: 86, B: 130, fullMark: 150 },
                              { subject: 'Nefrotoksisite', A: 99, B: 100, fullMark: 150 },
                              { subject: 'Pulmoner Hasar', A: 85, B: 90, fullMark: 150 },
                              { subject: 'Dermal Hasar', A: 65, B: 85, fullMark: 150 },
                            ]}>
                               <PolarGrid stroke="#f1f5f9" />
                               <PolarAngleAxis dataKey="subject" fontSize={9} fontWeight="bold" tick={{ fill: '#475569' }} />
                               <PolarRadiusAxis angle={30} domain={[0, 150]} fontSize={8} />
                               <Radar name="Solventler" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                               <Radar name="Ağır Metaller" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                               <Legend />
                            </RadarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>

                {/* ODDS RATIO CALCULATOR FOR EPIDEMIOLOGY */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 border border-indigo-950 shadow-2xl space-y-6">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <Sliders className="text-blue-400" size={18} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Epidemiyolojik Karar Destek Aracı</span>
                      </div>
                      <h3 className="text-xl font-black">Halk Sağlığı Odds Oranı (Odds Ratio) & Rölatif Risk Hesaplayıcı</h3>
                      <p className="text-xs opacity-75 leading-relaxed max-w-xl">
                         Vaka kohortlarına göre maruz kalanlar ve maruz kalmayanların hastalık oranlarını karşılaştırarak istatistiksel ilişki katsayılarını hesaplayın.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Maruz Kalan / Hasta</label>
                         <input 
                           type="number"
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 outline-none font-bold font-mono text-white text-sm"
                           value={exposedSick}
                           onChange={e => setExposedSick(Number(e.target.value))}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Maruz Kalan / Sağlıklı</label>
                         <input 
                           type="number"
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 outline-none font-bold font-mono text-white text-sm"
                           value={exposedHealthy}
                           onChange={e => setExposedHealthy(Number(e.target.value))}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Maruz Kalmayan / Hasta</label>
                         <input 
                           type="number"
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 outline-none font-bold font-mono text-white text-sm"
                           value={unexposedSick}
                           onChange={e => setUnexposedSick(Number(e.target.value))}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Maruz Kalmayan / Sağlıklı</label>
                         <input 
                           type="number"
                           className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 outline-none font-bold font-mono text-white text-sm"
                           value={unexposedHealthy}
                           onChange={e => setUnexposedHealthy(Number(e.target.value))}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                      <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center">
                         <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-300">İlişki Gücü (Odds Ratio - OR)</p>
                            <p className="text-2xl font-black mt-1 font-mono">{oddsRatio}</p>
                         </div>
                         <div className="text-right text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                            {Number(oddsRatio) > 1 
                              ? `Maruziyet saptanan grupta hastalık görülme riski ${oddsRatio} kat daha fazladır. İstatistiksel güçlü pozitif korelasyon.`
                              : "Anlamlı pozitif korelasyon bulunamadı."
                            }
                         </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center">
                         <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-300">Rölatif Risk Katsayısı (RR)</p>
                            <p className="text-2xl font-black mt-1 font-mono">{relativeRisk}</p>
                         </div>
                         <div className="text-right text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                            Mesleki koruma modellerinin periyodik olarak optimize edilmesi önerilir (RR katsayısı testidir).
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* TAB EXPOSURE_DB */}
            {activeTab === 'exposure_db' && (
              <motion.div
                key="exposure_db"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-8"
              >
                {/* Left side: filter list */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/60 shadow-xl shadow-slate-200/5 space-y-6 lg:h-[650px] overflow-y-auto">
                   <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="Maddelerde ara..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-400 text-xs font-bold"
                        value={dbSearch}
                        onChange={e => setDbSearch(e.target.value)}
                      />
                   </div>
                   
                   <div className="space-y-2">
                      {filteredToxins.map((tox) => (
                        <button
                          key={tox.id}
                          onClick={() => setSelectedToxin(tox)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-bold font-sans flex items-center justify-between group ${
                            selectedToxin.id === tox.id 
                              ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                             <p className="truncate font-black">{tox.name}</p>
                             <p className={`text-[9px] font-medium mt-0.5 ${selectedToxin.id === tox.id ? 'text-slate-400' : 'text-slate-400'}`}>CAS: {tox.cas}</p>
                          </div>
                          <ChevronRight size={14} className={`translate-x-0 transition-transform group-hover:translate-x-1 ${selectedToxin.id === tox.id ? 'text-white' : 'text-slate-300'}`} />
                        </button>
                      ))}
                      {filteredToxins.length === 0 && (
                        <div className="py-12 text-center text-xs text-slate-400 italic">BULGU YOK</div>
                      )}
                   </div>
                </div>

                {/* Right side: detail card */}
                {selectedToxin && (
                  <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5 space-y-8 overflow-y-auto lg:h-[650px] scrollbar-hide">
                     <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-6 gap-4">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              {selectedToxin.chemicalFormula && <span className="px-2.5 py-1 bg-blue-50 text-blue-600 font-mono text-[10px] font-black rounded-lg">{selectedToxin.chemicalFormula}</span>}
                              <span className="text-xs font-bold text-slate-400">CAS: {selectedToxin.cas}</span>
                           </div>
                           <h3 className="text-2xl font-black text-slate-900">{selectedToxin.name} Akademik Dosyası</h3>
                           <p className="text-[10px] text-rose-500 font-black tracking-widest uppercase">{selectedToxin.iarcClassification}</p>
                        </div>
                        <button 
                          onClick={() => handleDownloadReport(selectedToxin)}
                          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black shrink-0 active:scale-95 duration-200"
                        >
                           <Download size={14} /> FDS & Rapor İndir
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">OSHA PEL (Limiti)</p>
                           <p className="text-xs font-bold text-slate-700 font-mono">{selectedToxin.oshaPel}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">NIOSH REL (Limiti)</p>
                           <p className="text-xs font-bold text-slate-700 font-mono">{selectedToxin.nioshRel}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Risk Dağılım Sektörleri</p>
                           <p className="text-xs font-black text-slate-700 truncate">{selectedToxin.sectors.join(', ')}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Önerilen Biyobelirteçler (Biomarkers)</h4>
                           <div className="space-y-2">
                              {selectedToxin.biologicalBiomarkers.map((b, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                                   <div>
                                      <p className="font-black text-slate-700">{b.marker}</p>
                                      <p className="text-[9px] text-slate-400 font-medium">{b.specimen} Orneği</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="font-bold text-slate-600 font-mono text-[11px]">{b.exposureLimit}</p>
                                      <p className="text-[9px] text-slate-300 font-medium">Sınır Limit</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Klinik Önlem & Protokol Kılavuzları</h4>
                           <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksiyon Adımları</p>
                              <ul className="space-y-2 text-xs font-medium leading-relaxed opacity-90">
                                 {selectedToxin.clinicalRecommendations.map((r, i) => (
                                   <li key={i} className="flex gap-2 items-start">
                                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                                      {r}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB CASE_ARCHIVE */}
            {activeTab === 'case_archive' && (
              <motion.div
                key="case_archive"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5 space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
                      <div>
                         <h3 className="text-lg font-black text-slate-900 leading-none">Vaka Karar Arşivi & QR Kodlu Tıbbi Rapor Merkezi</h3>
                         <p className="text-xs text-slate-400 mt-1 font-medium">Raporlar sistem üzerinden hekim imzalı ve QR doğrulama bağlantılı şekilde şifrelenir.</p>
                      </div>
                      <button 
                        onClick={() => {
                          showToast("Vaka arşivi senkronizasyonu tamamlandı.");
                        }}
                        className="p-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center gap-2 active:scale-95 duration-200"
                      >
                         <RefreshCw size={14} /> Arşivi Yenile
                      </button>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans border-collapse">
                         <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                               <th className="pb-3 text-center">QR NO</th>
                               <th className="pb-3">Halk Sağlığı / Çalışan</th>
                               <th className="pb-3">Sektör / Birim</th>
                               <th className="pb-3">Bulgular / Semptom</th>
                               <th className="pb-3">Sorumlu Hekim</th>
                               <th className="pb-3">Derecelendirme</th>
                               <th className="pb-3 text-right">Eylem</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 text-xs">
                            {archivedCases.map((cs) => (
                              <tr key={cs.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="py-4 text-center">
                                    <div className="inline-block p-1.5 bg-slate-100 font-mono font-bold rounded-lg text-slate-500 scale-90">
                                       {cs.qrCode}
                                    </div>
                                 </td>
                                 <td className="py-4 font-black text-slate-800">{cs.name}</td>
                                 <td className="py-4">
                                    <p className="font-bold text-slate-700">{cs.sector}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{cs.unit}</p>
                                 </td>
                                 <td className="py-4">
                                    <div className="flex flex-wrap gap-1">
                                       {cs.symptoms.map((s, idx) => (
                                         <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">{s}</span>
                                       ))}
                                    </div>
                                 </td>
                                 <td className="py-4 font-bold text-slate-500">{cs.doctor}</td>
                                 <td className="py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                      cs.risk === 'Kritik' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>{cs.risk}</span>
                                 </td>
                                 <td className="py-4 text-right">
                                    <button 
                                      onClick={() => handleDownloadReport({ name: cs.name })}
                                      className="p-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black flex items-center gap-1.5 float-right active:scale-95 duration-200"
                                    >
                                       <Download size={12} /> İndir
                                    </button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              </motion.div>
            )}

            {/* TAB AI_RESEARCH */}
            {activeTab === 'ai_research' && (
              <motion.div
                key="ai_research"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-8"
              >
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5 flex flex-col h-[550px] overflow-hidden">
                   <div className="border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-base font-black text-slate-900 leading-none">TALEP Akademik AI Araştırma Konsolu</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">Grounding & Literatür veri beslemeli mesleki yapay zeka destek hücresi.</p>
                   </div>
                   
                   {/* Messages box */}
                   <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-hide">
                      {aiLog.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`p-4 rounded-3xl max-w-[85%] leading-relaxed ${
                             msg.role === 'user' 
                               ? 'bg-slate-900 text-white text-xs font-bold' 
                               : 'bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100'
                           }`}>
                              <p className="text-[9px] opacity-40 uppercase font-black tracking-widest mb-1.5">{msg.role === 'user' ? 'SORGU' : 'AKADEMİK ANALİZ'}</p>
                              <p className="leading-relaxed">{msg.text}</p>
                              <p className="text-[8px] opacity-30 mt-2 text-right">{msg.time}</p>
                           </div>
                        </div>
                      ))}
                      {isAiLoading && (
                        <div className="flex gap-2 items-center text-slate-400 text-[10px] font-black uppercase tracking-widest p-4">
                           <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin shrink-0" />
                           LİTERATÜR KANITLARI ENTEGRE EDİLİYOR...
                        </div>
                      )}
                   </div>

                   {/* Input box */}
                   <div className="flex gap-3 border-t border-slate-100 pt-3">
                      <input 
                        type="text" 
                        placeholder="PubMed literatür, antikor takipleri, veya kurşun şelasyon kriterleri hakkında sorun..."
                        className="w-full bg-slate-50 border border-slate-155 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                      />
                      <button 
                        onClick={handleAiSend}
                        className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl active:scale-90 transition-transform shrink-0"
                      >
                         <Send size={16} />
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HEDEFLENEN ARAŞTIRMA SORGULARI</h4>
                      <div className="space-y-2">
                         {[
                           "Kurşun maruziyeti ZPP limitleri",
                           "Benzen t,t-Mukonik Asit testi",
                           "SFT normal-restriktif obstrüktif"
                         ].map((q, idx) => (
                           <button 
                             key={idx}
                             onClick={() => setAiPrompt(q)}
                             className="w-full text-left p-3 bg-white hover:bg-slate-900 hover:text-white rounded-xl border border-slate-150 text-xs font-bold transition-all text-slate-600 truncate"
                           >
                              {q}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* TAB EMERGENCY */}
            {activeTab === 'emergency' && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-rose-50 border border-rose-250 p-6 md:p-8 rounded-[2.5rem] flex gap-4 items-start shadow-xl shadow-rose-500/5">
                      <div className="p-3 bg-rose-500 rounded-2xl text-white shrink-0 shadow-lg shadow-rose-500/20">
                         <Flame size={24} className="animate-pulse" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-xl font-black text-rose-800 tracking-tight leading-none">HASTANELER İÇİN ACİL TOKSİKOLOJİK MÜDAHALE PROSEDÜRLERİ</h3>
                         <p className="text-xs text-rose-700 leading-relaxed font-semibold">
                            Ciddi mesleki akut maruziyet saptandığında izlenmesi gereken zorunlu dekontaminasyon ve antidot şelasyon tedavi algoritmaları aşağıda listelenmiştir. Bu protokoller Prof. Dr. Vugar Ali Türksoy'un toksikoloji kürsüsü verilerince doğrulanmıştır.
                         </p>
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-xl shadow-slate-200/5 space-y-6">
                      <h3 className="text-base font-black text-slate-900">Antidot & Dekontaminasyon Protokol Listesi</h3>
                      
                      <div className="space-y-4">
                         {[
                           {
                             agent: "Organofosfat (SLUDGE Kriz)",
                             treatment: "Derhal atropinizasyon başlatın (atropin sülfat 1-2 mg IV). Bronş sekresyonları azalana kadar her 5-15 dakikada bir tekrarlayın. Beraberinde Pralidoksim (2-PAM) verin (30 mg/kg IV infüzyon). Hastayı dezenfekte edin.",
                             risk: "Hayati Tehlike"
                           },
                           {
                             agent: "Ağır Metal / Kurşun (PbB > 50 µg/dL)",
                             treatment: "Şelasyon tedavisi endikedir. Süksimer (DMSA) 10 mg/kg p.o. günde 3 defa 5 gün boyunca, ardından günde 2 defa 14 gün. Şiddetli ensefalopatide CaNa2EDTA ile kombine edin.",
                             risk: "Organ Hasarı"
                           },
                           {
                             agent: "Benzen & Solvent İnhalasyonu (Akut)",
                             treatment: "Hastayı derhal açık havaya çıkarın, solunum yollarını temiz tutun. %100 oksijen desteği verin. Epinefrin kullanımından kaçının (kardiyak hassaslaşma nedeniyle ventriküler fibrilasyon riski).",
                             risk: "MSS Baskılanması"
                           }
                         ].map((em, idx) => (
                           <div key={idx} className="p-5 rounded-2xl border-2 border-slate-100 hover:border-rose-100 transition-colors space-y-3">
                              <div className="flex justify-between items-center bg-slate-50 -m-5 px-5 py-3 rounded-t-2xl border-b border-slate-150">
                                 <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">{em.agent}</h4>
                                 <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black rounded-lg uppercase tracking-widest">{em.risk}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 leading-relaxed pt-2">{em.treatment}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 border border-slate-800 shadow-xl space-y-6 text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
                         <AlertTriangle size={32} />
                      </div>
                      <div className="space-y-2">
                         <h4 className="font-bold text-sm">HAYATİ TOKSİKOLOJİ NUMARALARI</h4>
                         <p className="text-xs text-slate-400 font-medium">Ulusal Zehir Danışma Merkezi (UZEM) Acil Destek Hattı</p>
                         <p className="text-4xl font-black text-rose-500 font-mono tracking-tighter">114</p>
                      </div>
                      <p className="text-[10px] opacity-40 leading-relaxed italic">Acil servis vakalarında laboratuvar ve klinik koordine edilerek doğrudan sevk başlatılmalıdır.</p>
                   </div>
                </div>
              </motion.div>
            )}

         </AnimatePresence>
      </div>
    </div>
  );
}
