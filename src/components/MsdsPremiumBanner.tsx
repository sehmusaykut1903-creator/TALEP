import React from "react";
import { ShieldCheck } from "lucide-react";

export const MsdsPremiumBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3.5 p-3.5 rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-emerald-500/25 shadow-lg shadow-emerald-950/10 relative overflow-hidden group select-none ${className}`}>
      {/* Decorative emerald laser glow */}
      <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent blur-md group-hover:w-1/2 transition-all duration-300" />
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-[inherit]" />
      
      <div className="flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shrink-0 shadow-lg shadow-emerald-500/10 animate-pulse">
        <ShieldCheck size={18} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-black tracking-[0.25em] text-emerald-400 font-mono uppercase leading-none">
            MSDS LABORATUVAR UYUMLULUĞU
          </span>
          <span className="text-[7.5px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase border border-emerald-400/20">
            %100 GÜVENLİ
          </span>
        </div>
        <p className="text-[9px] text-slate-300 leading-snug mt-1 font-semibold">
          Klinik analizler, kimyasal bileşen veritabanı ve laboratuvar eşleştirmeleri Uluslararası Malzeme Güvenlik Bilgi Formu (MSDS) kriterleriyle tam akreditedir.
        </p>
      </div>
    </div>
  );
};
export default MsdsPremiumBanner;
