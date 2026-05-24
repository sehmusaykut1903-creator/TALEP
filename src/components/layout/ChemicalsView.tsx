import React, { useState } from "react";
import { Database, Search, ShieldAlert, HeartPulse, Stethoscope, Droplet, FileText, ChevronRight, Activity, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../../context/SettingsContext";
import { MsdsPremiumBanner } from "../MsdsPremiumBanner";
import { ScientificToxin } from "../../data/scientificDatabase";

interface ChemicalsViewProps {
  chemicalsData: ScientificToxin[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  classFilter: string;
  setClassFilter: (filter: string) => void;
  filteredChemicals: ScientificToxin[];
}

export default function ChemicalsView({
  searchQuery,
  setSearchQuery,
  classFilter,
  setClassFilter,
  filteredChemicals
}: ChemicalsViewProps) {
  const { theme } = useSettings();
  const isDarkTheme = theme.isDark;
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Light/Dark classes
  const cardClass = `${theme.cardBg} border backdrop-blur-2xl rounded-[28px] relative overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]`;

  const titleColor = isDarkTheme ? "text-white" : "text-[#0f172a] font-extrabold";
  const textClass = isDarkTheme ? "text-slate-200" : "text-slate-800";
  const mutedTextClass = isDarkTheme ? "text-slate-400" : "text-slate-500 font-medium";

  // Category mapping
  const activeCategories = [
    "Tümü", 
    "Ağır Metal", 
    "Metaloid",
    "Pestisit", 
    "Organofosfat", 
    "Solvent", 
    "Gaz", 
    "Korozif",
    "Karsinojen",
    "Endokrin",
    "Mesleki",
    "Su/Kanalizasyon",
    "Gıda",
    "Nörotoksin",
    "Hepatotoksin",
    "Nefrotoksin",
    "İlaç", 
    "Maden", 
    "Cilt", 
    "Kimyasal Savaş"
  ];
  
  const getRiskColor = (classification: string) => {
    if (classification.includes("Grup 1")) return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    if (classification.includes("Grup 2")) return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    if (classification.includes("Grup 3")) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  };

  return (
    <div className={`space-y-8`}>
      
      <div className={`${cardClass} p-8`}>
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h3 className={`text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 ${titleColor}`}>
              <Database size={24} className="text-blue-500 dark:text-cyan-400" />
              Genişletilmiş Toksikolojik Triage Veritabanı
            </h3>
            <p className={`text-[13px] leading-relaxed mt-2 max-w-3xl ${mutedTextClass}`}>
              Vugar Ali Türksoy hoca standartlarına uygun tasarlanmış; mesleki toksinler, ağır metaller, pestisitler ve epidemiyolojik maruziyet kaynaklarının tam detaylı klinik referans kütüphanesi.
            </p>
          </div>

          {/* Class filters */}
          <div className="flex gap-2 flex-wrap">
            {activeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setClassFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
                  classFilter === cat 
                    ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 border-blue-600 dark:border-cyan-500 font-black shadow-sm" 
                    : "bg-slate-500/5 dark:bg-slate-900 text-slate-600 dark:text-slate-450 border-slate-200 dark:border-white/5 hover:border-blue-500 dark:hover:border-cyan-500/30 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compound Search Input */}
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Etken adı, formül veya CAS Numarası arayın... (Örn: Paration, 56-38-2, Siyanür)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-semibold"
          />
        </div>
      </div>

      {/* Dynamic Grid of Chemicals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChemicals.map(chem => (
          <div 
            key={chem.id} 
            className={`${cardClass} flex flex-col group cursor-pointer hover:border-blue-500/30 dark:hover:border-cyan-500/30`}
            onClick={() => setExpandedId(expandedId === chem.id ? null : chem.id)}
          >
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9.5px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-450 font-bold font-mono">
                      CAS: {chem.cas}
                    </span>
                    {chem.chemicalFormula && (
                      <span className="text-[9.5px] bg-blue-500/5 dark:bg-cyan-950/30 border border-blue-500/10 dark:border-cyan-500/10 px-2.5 py-1 rounded-md text-blue-600 dark:text-cyan-400 font-bold font-mono">
                        {chem.chemicalFormula}
                      </span>
                    )}
                  </div>
                  <h4 className={`text-lg font-black mt-1 tracking-tight ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{chem.name}</h4>
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 text-right max-w-[120px] ${getRiskColor(chem.iarcClassification)}`}>
                  {chem.iarcClassification.split(' ')[0]} {chem.iarcClassification.split(' ')[1]}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {chem.sectors.map((sec, idx) => (
                  <span key={idx} className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                    {sec}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                 <div className="space-y-1">
                   <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={10} /> OSHA PEL</p>
                   <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{chem.oshaPel}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ShieldAlert size={10} /> NIOSH REL</p>
                   <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{chem.nioshRel}</p>
                 </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === chem.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-slate-100 dark:border-white/5"
                >
                  <div className="p-6 md:p-8 pt-0 mt-6 space-y-6">
                    
                    {/* Klinik Yaklaşım */}
                    <div className="space-y-3">
                      <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                        <HeartPulse size={12} /> Akut Klinik Tablo
                      </h5>
                      <ul className="space-y-1.5">
                        {chem.acuteEffects.map((ef, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-red-500/50">
                            {ef}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                        <Activity size={12} /> Kronik Maruziyet & Komplikasyonlar
                      </h5>
                      <ul className="space-y-1.5">
                        {chem.chronicEffects.map((ef, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-orange-500/50">
                            {ef}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Biyolojik İzlem */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                      <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-3">
                        <Droplet size={12} /> Biyobelirteçler & Kritik Eşikler
                      </h5>
                      <div className="space-y-2">
                        {chem.biologicalBiomarkers.map((bio, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] p-2 rounded bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent">
                            <span className="font-bold text-slate-700 dark:text-slate-200">{bio.marker} <span className="text-slate-400 font-normal">({bio.specimen})</span></span>
                            <span className="font-mono font-bold text-red-500 text-right">{bio.exposureLimit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                     {/* Reçete ve Öneriler */}
                     <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-500/10">
                      <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
                        <Stethoscope size={12} /> Acil/Poliklinik Yönetimi
                      </h5>
                      <ul className="space-y-2">
                        {chem.clinicalRecommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs leading-relaxed text-slate-700 dark:text-emerald-100/70 border-l-2 border-emerald-500/30 pl-2.5">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Referanslar */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Akademik Literatür</h5>
                      {chem.academicReferences.map((ref, idx) => (
                        <div key={idx} className="text-[10px] text-slate-500 flex items-start gap-1.5">
                          <BookOpen size={10} className="mt-0.5 shrink-0" /> 
                          <p>
                            {ref.citation} <span className="font-bold text-slate-400">[{ref.agency}]</span>
                            {ref.pubmedId && <span className="ml-1 text-blue-500">PMID: {ref.pubmedId}</span>}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expander Footer */}
            {!expandedId || expandedId !== chem.id ? (
              <div className="bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 p-3 flex justify-center mt-auto">
                <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1">Klinik Protokolleri Genişlet <ChevronRight size={12}/></span>
              </div>
            ) : (
               <div className="bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-500/10 p-3 flex justify-center mt-auto">
                 <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1">Paneli Daralt</span>
               </div>
            )}
          </div>
        ))}

        {filteredChemicals.length === 0 && (
          <div className="md:col-span-2 text-center p-12 bg-slate-500/5 dark:bg-slate-950/40 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-slate-500 text-xs mt-4">
            Arama motorumuzda buna uygun bir eşleşme bulunamadı. Lütfen filtre veya anahtar kelimeyi revize edin.
          </div>
        )}
      </div>

      <MsdsPremiumBanner className="mt-8" />

    </div>
  );
}
