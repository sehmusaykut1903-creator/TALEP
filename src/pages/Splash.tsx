import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  GraduationCap, 
  Sparkles, 
  Building, 
  ArrowRight,
  ShieldAlert,
  Users,
  Feather
} from 'lucide-react';
import { TalepLogo } from '../components/TalepLogo';
import { useSettings } from '../context/SettingsContext';

export default function Splash({ onFinish }: { onFinish: () => void }) {
  const { theme } = useSettings();
  const isDark = theme.isDark;

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-[9999] px-4 overflow-y-auto selection:bg-cyan-500/30 font-sans transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Soft Layout Background Ambient Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Subtly reduced bioluminescent glow layers */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-500"
        style={{ 
          top: '15%', 
          left: '20%', 
          backgroundColor: isDark ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.06)' 
        }} 
      />
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-500"
        style={{ 
          bottom: '15%', 
          right: '20%', 
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.04)' 
        }} 
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl flex flex-col items-center text-center relative z-10 space-y-8 py-8 md:py-12"
      >
        {/* Core Presentation Layer */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl px-2">
          {/* Logo with clean drop shadow */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="filter drop-shadow-[0_8px_16px_rgba(14,165,233,0.12)]"
          >
            <TalepLogo size="lg" variant="glass" />
          </motion.div>

          <div className="space-y-2 mt-4">
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-none ${
              isDark 
                ? "bg-gradient-to-r from-slate-100 via-white to-cyan-400" 
                : "bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900"
            } bg-clip-text text-transparent`}>
              TALEP
            </h1>
            
            <p className="text-[11px] md:text-[12px] font-black tracking-[0.25em] text-cyan-500 dark:text-cyan-400 uppercase">
              Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu
            </p>
          </div>

          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent my-1" />

          <p className={`text-xs md:text-sm font-semibold max-w-lg leading-relaxed px-4 ${
            isDark ? "text-slate-300" : "text-slate-650 text-slate-700"
          }`}>
            Yapay zekâ destekli klinik toksikoloji, epidemiyoloji ve akademik karar destek sistemi.
          </p>
        </div>

        {/* Dynamic and Responsive Credentials Billboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-2 px-2">
          {/* Developer & Team Segment */}
          <div className={`p-5 rounded-3xl border text-left flex flex-col justify-between transition-colors duration-350 min-h-36 ${
            isDark 
              ? "bg-slate-900/40 border-slate-800/40 backdrop-blur-md" 
              : "bg-white/70 border-slate-200/70 shadow-sm backdrop-blur-md"
          }`}>
            <div>
              <p className="text-[8.5px] font-black tracking-widest text-cyan-500 dark:text-cyan-400 uppercase mb-3 flex items-center gap-1.5 font-mono">
                <Users size={12} /> GELİŞTİRME & PROJE EKİBİ
              </p>
              
              <div className="space-y-2">
                <div>
                  <span className="text-[9.5px] font-mono font-black tracking-wider block opacity-50 uppercase">Ana Geliştirici</span>
                  <p className={`text-xs font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                    Şehmus AYKUT
                  </p>
                </div>

                <div className="border-t border-dashed border-slate-205 border-slate-200/40 dark:border-white/5 pt-2">
                  <span className="text-[9.5px] font-mono font-black tracking-wider block opacity-50 uppercase">Proje Ekibi</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Fatma Nur AYKUT</span>
                    <span className="text-slate-400 font-mono text-[10px]">•</span>
                    <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Aghajan MUSALI</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[8px] font-semibold text-slate-400 mt-4 uppercase tracking-wider block font-mono">
              FAILSAFE MEDICAL CLOUD OS v4.0 PREMIUM
            </p>
          </div>

          {/* Academic Guidance & Institution Segment */}
          <div className={`p-5 rounded-3xl border text-left flex flex-col justify-between transition-colors duration-350 min-h-36 ${
            isDark 
              ? "bg-slate-900/40 border-slate-800/40 backdrop-blur-md" 
              : "bg-white/70 border-slate-200/70 shadow-sm backdrop-blur-md"
          }`}>
            <div>
              <p className="text-[8.5px] font-black tracking-widest text-emerald-500 dark:text-emerald-400 uppercase mb-3 flex items-center gap-1.5 font-mono">
                <GraduationCap size={12} /> AKADEMİK YAPILANMA
              </p>
              
              <div className="space-y-2">
                <div>
                  <span className="text-[9.5px] font-mono font-black tracking-wider block opacity-50 uppercase">Akademik Danışman</span>
                  <p className={`text-xs font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                    Prof. Dr. Vugar Ali TÜRKSOY
                  </p>
                </div>

                <div className="border-t border-dashed border-slate-200/40 dark:border-white/5 pt-2">
                  <span className="text-[9.5px] font-mono font-black tracking-wider block opacity-50 uppercase">Kurum</span>
                  <p className={`text-xs font-bold leading-tight ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Yozgat Bozok Üniversitesi Tıp Fakültesi
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Halk Sağlığı Anabilim Dalı
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[8px] font-semibold text-emerald-500/80 mt-4 uppercase tracking-wider block font-mono">
              PROFESSOR REHABILITATION MATRIX
            </p>
          </div>
        </div>

        {/* Platform Go Action Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="pt-4 flex flex-col items-center space-y-3 z-20 w-full"
        >
          <button
            type="button"
            onClick={onFinish}
            className="group relative flex items-center justify-center gap-3 px-10 py-4 w-72 bg-blue-600 hover:bg-blue-500 dark:bg-cyan-550 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white rounded-3xl text-sm font-black transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20 active:scale-95 border border-white/10"
          >
            <span>Platforma Gir</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MÜKEMMEL KORUMA & MSDS ENTEGRASYONU AKTİF</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
