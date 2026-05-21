import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  TrendingUp, 
  Database, 
  FileText, 
  Sparkles, 
  Flame,
  Award,
  Layers,
  Heart
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

// Import the restructured premium sub-modules
import LiteratureIntelligence from '../components/academic/LiteratureIntelligence';
import OccupationalEpidemiology from '../components/academic/OccupationalEpidemiology';
import ExposureDatabase from '../components/academic/ExposureDatabase';
import CaseArchive from '../components/academic/CaseArchive';
import AIResearchAssistant from '../components/academic/AIResearchAssistant';
import EmergencyToxicology from '../components/academic/EmergencyToxicology';

interface ScientificIntelligenceProps {
  defaultTab?: string;
}

export default function ScientificIntelligence({ defaultTab = 'literature' }: ScientificIntelligenceProps) {
  const { theme, t } = useSettings();
  
  // Sync tab with route default tab prop
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="space-y-8 flex flex-col min-h-screen pb-12">
      
      {/* PROFESSIONAL BRANDING HEADER SEAL */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
         <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
               <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                     <Award className="text-amber-400 shrink-0" size={18} />
                     <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase font-mono">
                        Prof. Dr. Vugar Ali Türksoy Akademik Katmanı
                     </span>
                  </div>
                  {/* MAIN DEVELOPER SUBTITLE CREDITS */}
                  <div className="text-[10px] font-mono tracking-[0.12em] text-indigo-300 font-bold uppercase pl-5 mt-1 space-y-0.5">
                     <p>Proje Ekibi: Şehmus AYKUT • Fatma Nur AYKUT • Aghajan MUSALI</p>
                     <p className="text-[8px] text-slate-400 font-sans tracking-wide">Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Anabilim Dalı</p>
                  </div>
               </div>
               
               <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase font-sans">
                  Bilimsel İstihbarat & Toksikoloji Akademik Platformu
               </h1>
               <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                  İşçi sağlığı sürveyansı, çok-kriterli epidemiyolojik katsayı kütüphaneleri ve acil şelasyon algoritma konsolu.
               </p>
            </div>
            
            <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center shrink-0">
               <div className="text-[9px] text-indigo-300 font-black uppercase tracking-widest font-mono">Platform Seviyesi</div>
               <div className="text-md font-black text-white mt-1 uppercase">Klinik Akademik Araştırma</div>
               <div className="text-[9px] text-slate-400 italic mt-0.5">TALEP v4.0 Premium</div>
            </div>
         </div>
      </div>

      {/* CORE HORIZONTAL NAVIGATION BAR */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
         {[
           { id: 'literature', label: 'LİTERATÜR İSTİHBARATI', icon: BookOpen },
           { id: 'epidemiology', label: 'MESLEKİ EPİDEMİYOLOJİ', icon: TrendingUp },
           { id: 'exposure_db', label: 'MARUZİYET VERİTABANI', icon: Database },
           { id: 'case_archive', label: 'VAKA ARŞİV SİSTEMİ', icon: FileText },
           { id: 'ai_research', label: 'AI ARAŞTIRMA ASİSTANI', icon: Sparkles },
           { id: 'emergency', label: 'ACİL TOKSİKOLOJİ MODU', icon: Flame }
         ].map(tab => {
           const Icon = tab.icon;
           const isSelected = activeTab === tab.id;
           return (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id); }}
               className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 duration-200 ${
                 isSelected 
                   ? 'bg-slate-900 text-white shadow-xl shadow-slate-905/15 scale-[1.02]' 
                   : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/40'
               }`}
             >
               <Icon size={14} />
               {tab.label}
             </button>
           );
         })}
      </div>

      {/* RENDER DYNAMIC INDEPENDENT SCREEN CONTEXT WITH ADVANCED TRANSITIONS */}
      <div className="flex-1">
         <AnimatePresence mode="wait">
            <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -15 }}
               transition={{ duration: 0.25, ease: 'easeOut' }}
            >
               {activeTab === 'literature' && <LiteratureIntelligence />}
               {activeTab === 'epidemiology' && <OccupationalEpidemiology />}
               {activeTab === 'exposure_db' && <ExposureDatabase />}
               {activeTab === 'case_archive' && <CaseArchive />}
               {activeTab === 'ai_research' && <AIResearchAssistant />}
               {activeTab === 'emergency' && <EmergencyToxicology />}
            </motion.div>
         </AnimatePresence>
      </div>
      
    </div>
  );
}
