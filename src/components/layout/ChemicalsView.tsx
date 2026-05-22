import React from "react";
import { Database, Search } from "lucide-react";
import { motion } from "motion/react";
import { useSettings } from "../../context/SettingsContext";

interface Chemical {
  id: string;
  cas: string;
  name: string;
  class: "İnhalasyon" | "Ağır Metal" | "Organofosfat" | "İlaç Etken Maddesi" | "Deri/Korozif";
  limit: string;
  triage: string;
  antidote: string;
}

interface ChemicalsViewProps {
  chemicalsData: Chemical[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  classFilter: string;
  setClassFilter: (filter: string) => void;
  filteredChemicals: Chemical[];
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

  // Light/Dark classes
  const cardClass = isDarkTheme
    ? "bg-slate-900/60 border border-white/10 rounded-[24px] p-6 relative overflow-hidden"
    : "bg-white border border-slate-200/80 shadow-md rounded-[24px] p-6 relative overflow-hidden";

  const titleColor = isDarkTheme ? "text-white" : "text-[#0f172a] font-extrabold";
  const textClass = isDarkTheme ? "text-slate-200" : "text-slate-800";
  const mutedTextClass = isDarkTheme ? "text-slate-400" : "text-slate-500 font-medium";

  return (
    <div className={`backdrop-blur-xl ${isDarkTheme ? 'bg-[#0f172a]/40 border border-cyan-500/10' : 'bg-slate-50/50 border border-slate-250'} rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xl`}>
      
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 ${titleColor}`}>
            <Database size={18} className="text-blue-600 dark:text-cyan-400" />
            Global Toksikolojik Etken Kütüphanesi
          </h3>
          <p className={`text-xs mt-1 ${mutedTextClass}`}>
            Mesleki ve çevresel maruziyete yol açan molekülleri CAS Numarası, Yasal Limitleri ve Triage prensipleri doğrultusunda saniyeler içinde tarayın.
          </p>
        </div>

        {/* Class filters */}
        <div className="flex gap-1.5 flex-wrap">
          {["Tümü", "Organofosfat", "İnhalasyon", "Ağır Metal", "İlaç Etken Maddesi", "Deri/Korozif"].map(cat => (
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
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Etken veya CAS No arayın... (Örn: Paration, 56-38-2, Parasetamol)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-semibold"
        />
      </div>

      {/* Dynamic Grid of Chemicals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChemicals.map(chem => (
          <div 
            key={chem.id} 
            className={`${cardClass} flex flex-col justify-between`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9.5px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-md text-slate-500 dark:text-slate-450 font-bold font-mono">
                    CAS NO: {chem.cas}
                  </span>
                  <h4 className={`text-sm font-black mt-2.5 tracking-tight ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{chem.name}</h4>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/15 dark:border-cyan-500/20 shrink-0">
                  {chem.class}
                </span>
              </div>

              <div className="space-y-3.5 border-t border-slate-100 dark:border-white/5 pt-3.5">
                <p className="text-xs">
                  <strong className="text-slate-450 dark:text-slate-400">Önerilen Sınır Değerler:</strong>{" "}
                  <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold leading-normal">{chem.limit}</span>
                </p>
                <p className={`text-xs leading-relaxed ${textClass}`}>
                  <strong className="text-red-500 block mb-1">Akut Bulgular & Triage:</strong> 
                  {chem.triage}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5">
              <div className="text-xs text-slate-800 dark:text-slate-200 bg-blue-500/[0.03] dark:bg-cyan-950/25 p-3 rounded-xl border border-blue-100 dark:border-cyan-500/10">
                <strong className="text-blue-700 dark:text-cyan-400 block mb-1">Akılcı / Antidot Tedavi Önerisi:</strong> 
                {chem.antidote}
              </div>
            </div>
          </div>
        ))}

        {filteredChemicals.length === 0 && (
          <div className="md:col-span-2 text-center p-12 bg-slate-500/5 dark:bg-slate-950/40 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-slate-500 text-xs">
            Arama motorumuzda buna uygun bir eşleşme bulunamadı. Lütfen filtre veya anahtar kelimeyi revize edin.
          </div>
        )}
      </div>

    </div>
  );
}
