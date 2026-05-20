import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical, ShieldCheck, Microscope } from 'lucide-react';

export default function Splash({ onFinish }: { onFinish: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-brand-navy flex flex-col items-center justify-center z-[100] text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-brand-blue rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-blue/40 relative z-10">
          <FlaskConical size={48} className="text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-brand-blue blur-3xl -z-10"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center px-6"
      >
        <h1 className="text-5xl font-bold tracking-tighter mb-2">TALEP</h1>
        <p className="text-brand-blue font-medium text-lg mb-8 uppercase tracking-widest text-[14px]">
          v2.0.4 Premium Edition
        </p>
        
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck size={20} className="text-brand-green shrink-0" />
            <p className="text-xs opacity-80 leading-snug">
              Mesleki Kimyasal Maruziyetlere Yönelik Klinik Karar Destek Sistemi
            </p>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 text-center space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Proje Ekibi</p>
          <div className="space-y-1">
             <p className="text-xs font-semibold opacity-80">Şehmus AYKUT</p>
             <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Aghajan MUSALI & Fatma Nur AYKUT</p>
          </div>
        </div>
        
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Kurum</p>
          <p className="text-xs font-medium opacity-60 px-8">
            Yozgat Bozok Üniversitesi Tıp Fakültesi<br/>
            Halk Sağlığı Anabilim Dalı
          </p>
          <p className="text-[10px] opacity-30 mt-2 font-mono">Danışman: Prof. Dr. Vugar Ali TÜRKSOY</p>
        </div>
      </div>
    </div>
  );
}
