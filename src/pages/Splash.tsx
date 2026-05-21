import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, GraduationCap } from 'lucide-react';
import { TalepLogo } from '../components/TalepLogo';

export default function Splash({ onFinish }: { onFinish: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000); // 4 seconds for elegant reading of details
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-around z-[100] text-white overflow-hidden Selection:bg-cyan-500/30">
      
      {/* Bioluminescent floating background blobs */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Decorative fine medical grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      <div className="flex flex-col items-center text-center px-6 relative z-10 w-full max-w-2xl">
        {/* Restored Custom Luminous 3D Flask Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-8"
        >
          <TalepLogo size="xl" variant="glass" />
        </motion.div>

        {/* Strong Scientific Typography Hierarchy */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="space-y-4"
        >
          <div>
            <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent leading-none">
              TALEP
            </h1>
            <p className="text-[12px] font-black tracking-[0.3em] text-cyan-400 uppercase mt-3">
              Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu
            </p>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-6" />

          <p className="text-[13px] text-slate-300 font-medium max-w-xl mx-auto leading-relaxed px-4 scale-95 uppercase tracking-wider opacity-90">
            “Mesleki Kimyasal Maruziyetlere Yönelik Klinik Karar Destek Sistemi Prototipi”
          </p>
        </motion.div>
      </div>

      {/* Structured and Highly Elegant Project Credits Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-full max-w-xl px-8 relative z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 space-y-4 text-center">
          
          <div className="grid grid-cols-2 gap-4 text-left border-b border-white/5 pb-4">
            <div>
              <p className="text-[9px] font-black tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1">
                <GraduationCap size={10} /> PROJE EKİBİ
              </p>
              <p className="text-xs font-bold text-white leading-tight">Şehmus AYKUT</p>
              <p className="text-xs font-bold text-slate-300">Fatma Nur AYKUT</p>
              <p className="text-xs font-bold text-slate-400">Aghajan MUSALI</p>
            </div>
            <div>
              <p className="text-[9px] font-black tracking-widest text-amber-400 uppercase mb-1 flex items-center gap-1">
                <Award size={10} /> DANIŞMAN HOCA
              </p>
              <p className="text-xs font-bold text-white leading-tight">Prof. Dr. Vugar Ali TÜRKSOY</p>
              <p className="text-[10px] text-amber-500/80 font-bold tracking-wider text-[8px] uppercase mt-1">Halk Sağlığı & Toksikoloji Danışmanı</p>
              <p className="text-[8px] text-slate-500 uppercase">Halk Sağlığı Anabilim Dalı</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-medium gap-2 pt-1.5">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Yozgat Bozok Üniversitesi Tıp Fakültesi</span>
            </div>
            <div className="text-[10px] font-mono tracking-wider opacity-60">
              C-DSS CLINICAL LEVEL PROTOTYPE v4.0 PREMIUM
            </div>
          </div>

        </div>
      </motion.div>

    </div>
  );
}

