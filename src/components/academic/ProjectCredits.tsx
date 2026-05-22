import React from 'react';
import { Award, Users, GraduationCap, MapPin, Code } from 'lucide-react';

interface ProjectCreditsProps {
  variant?: 'card' | 'panel' | 'simple';
  className?: string;
}

export const ProjectCredits: React.FC<ProjectCreditsProps> = ({ variant = 'card', className = '' }) => {
  if (variant === 'simple') {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto" />
        <div className="space-y-2 text-slate-500">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">PROJE EKİBİ</p>
          <p className="text-xs font-bold text-slate-800">Şehmus AYKUT • Fatma Nur AYKUT • Aghajan MUSALI</p>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Yozgat Bozok Üniversitesi Tıp Fakültesi</p>
          <p className="text-[9px] text-slate-400">Halk Sağlığı Anabilim Dalı</p>
        </div>
        <div className="text-[10px] text-slate-400">
          <span className="font-semibold text-slate-500">Danışman:</span> Prof. Dr. Vugar Ali TÜRKSOY
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden group rounded-[2.5rem] transition-all duration-300 ${
      variant === 'panel' 
        ? 'bg-slate-900 text-white p-8 md:p-10 border border-slate-800 shadow-2xl' 
        : 'bg-white p-8 md:p-10 border border-slate-200/80 shadow-2xl shadow-slate-200/40'
    } ${className}`}>
      
      {/* Background Decorative Bio-Molecular Grid */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${variant === 'panel' ? 'bg-white/10 text-cyan-400' : 'bg-cyan-50 text-cyan-500'}`}>
          <GraduationCap size={20} />
        </div>
        <h4 className={`text-xs font-black uppercase tracking-[0.25em] ${variant === 'panel' ? 'text-slate-300' : 'text-slate-500'}`}>
          Akademik Proje & Teşekkür Raporu
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className={`p-5 rounded-2xl md:col-span-2 ${variant === 'panel' ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100/50'}`}>
          <div className="flex items-center gap-2 mb-3 text-cyan-500">
            <Users size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">PROJE EKİBİ (TEAM ARCHITECTURE)</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Şehmus AYKUT */}
            <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-black text-slate-900 dark:text-white">Şehmus AYKUT</p>
              <p className="text-[10px] text-cyan-600 font-bold mt-1 uppercase tracking-wider">Ana Geliştirici & Sistem Mimarı</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">AI & Klinik Karar Destek Geliştiricisi</p>
            </div>
            {/* Fatma Nur AYKUT */}
            <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-black text-slate-900 dark:text-white">Fatma Nur AYKUT</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-wider">Klinik Koordinasyon</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Kullanıcı Deneyimi, Akademik Süreçler & Sağlık Organizasyonu</p>
            </div>
            {/* Aghajan MUSALI */}
            <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-black text-slate-900 dark:text-white">Aghajan MUSALI</p>
              <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-wider">Araştırma & Geliştirme</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Klinik Veri & Literatür Entegrasyonu, Akademik Destek</p>
            </div>
          </div>
        </div>

        <div className={`col-span-1 md:col-span-1 p-5 rounded-2xl ${variant === 'panel' ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100/50'}`}>
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <Award size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">AKADEMİK DANIŞMAN</span>
          </div>
          <p className={`text-sm font-black ${variant === 'panel' ? 'text-white' : 'text-slate-800'}`}>Prof. Dr. Vugar Ali TÜRKSOY</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-2.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[8px] font-black border border-amber-500/20">DANIŞMAN HOCA</span>
            <span className="text-[9px] text-slate-400">Halk Sağlığı & Toksikoloji Danışmanı</span>
          </div>
        </div>

        <div className={`col-span-1 md:col-span-1 p-5 rounded-2xl ${variant === 'panel' ? 'bg-slate-950/40 border border-white/5' : 'bg-slate-50/50 border border-slate-100'} flex flex-col justify-between`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${variant === 'panel' ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KURUM & ANABİLİM DALI</p>
              <p className={`text-xs font-black ${variant === 'panel' ? 'text-white' : 'text-slate-800'} mt-1`}>
                Yozgat Bozok Üniversitesi Tıp Fakültesi
              </p>
              <p className="text-[10px] text-slate-400 font-bold font-sans tracking-wide mt-1">
                Halk Sağlığı Anabilim Dalı
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCredits;
