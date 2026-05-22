import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical, Search, Target, Info, ExternalLink, Microscope, ShieldAlert, Activity } from 'lucide-react';
import { chemicals } from '../data/toxicology';
import { useSettings } from '../context/SettingsContext';

export default function Chemicals() {
  const { t, theme } = useSettings();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = chemicals.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sectors.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="library-page space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t('library')}</h2>
          <p className="text-slate-650 mt-2 font-semibold">TALEP v4.0 Premium • Uluslararası Akredite MSDS ve Kimyasal Güvenlik Veritabanı</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Kimyasal, CAS, sektor veya belirti ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue/20 transition-all shadow-xl shadow-slate-200/20 font-medium"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map((chemical) => (
          <motion.div 
            key={chemical.id} 
            layout
            className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-2xl shadow-slate-200/10 group hover:shadow-brand-blue/10 transition-all overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <FlaskConical size={180} />
            </div>

            <div className="flex items-start justify-between mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center group-hover:bg-brand-blue transition-all shadow-xl shadow-slate-900/10">
                  <FlaskConical size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{chemical.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">CAS: {chemical.cas}</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-xl border ${
                      chemical.riskLevelBase === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>{t(chemical.riskLevelBase?.toLowerCase() || 'medium')} Risk</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Target size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Hedef Organ</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                   {chemical.organs.map(o => <span key={o} className="text-xs font-bold text-slate-600">{o}</span>)}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Activity size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Giriş Yolu</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                   {chemical.exposureRoutes?.map(r => <span key={r} className="text-xs font-bold text-slate-600">{r}</span>)}
                </div>
              </div>
              <div className="space-y-3 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <Microscope size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Biyolojik İzlem</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                   {chemical.labs.map(l => <span key={l} className="text-xs font-bold text-slate-600">{l}</span>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">AKUT BULGULAR</p>
                 <div className="flex flex-wrap gap-2">
                    {chemical.acuteSymptoms.map(s => <span key={s} className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">{s}</span>)}
                 </div>
               </div>
               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">KRONİK ETKİLER</p>
                 <div className="flex flex-wrap gap-2">
                    {chemical.chronicSymptoms.map(s => <span key={s} className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold text-slate-500 shadow-sm">{s}</span>)}
                 </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] relative z-10">
               <div className="flex items-center gap-3 mb-3">
                  <ShieldAlert size={18} className="text-cyan-400" />
                  <p className="text-[10px] font-black text-[#06b6d4] uppercase tracking-widest">🛡️ MSDS Güvenlik Protokolü & Klinik Önlemler</p>
               </div>
               <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                 "{chemical.riskInfo}"
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
