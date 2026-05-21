import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  ClipboardList,
  Target,
  Zap,
  PlusCircle,
  FileText,
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  User,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { useFirebaseSync } from '../context/FirebaseSyncContext';
import { updates } from '../data/updates';
import { generateTalepAIResponse } from '../services/talepAiService';
import { TalepLogo } from '../components/TalepLogo';
import { ProjectCredits } from '../components/academic/ProjectCredits';

export default function Dashboard() {
  const { t, theme, profile } = useSettings();
  const { cases } = useFirebaseSync();

  // Dynamic calculations from the synchronized Firestore/Offline state
  const totalPatients = cases.length;
  const highRiskCount = cases.filter(c => {
    const r = c.risk?.toLowerCase() || '';
    return r === 'high' || r === 'yüksek';
  }).length;

  const stats = [
    { label: t('patients'), value: totalPatients.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t('active_system'), value: '856', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: t('high') + ' ' + t('risk_level'), value: highRiskCount.toString(), icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: t('exposure_detection'), value: '128', icon: Target, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const sectorData = [
    { name: 'Metal', value: 45 },
    { name: 'Boya', value: 35 },
    { name: 'Tarım', value: 30 },
    { name: 'Hekzan', value: 25 },
    { name: 'Diğer', value: 15 },
  ];

  const riskData = [
    { name: t('low'), value: 65 },
    { name: t('medium'), value: 25 },
    { name: t('high'), value: 10 },
  ];

  const COLORS = [theme.primary, theme.secondary, theme.accent, '#ef4444', '#f59e0b'];  const quickActions = [
    { label: 'Yeni Vaka', icon: PlusCircle, color: 'bg-slate-900 text-white', to: '/assessment' },
    { 
      label: 'Demo Doldur', 
      icon: Zap, 
      color: 'bg-blue-600 text-white', 
      to: '/assessment',
      state: { 
        demo: true,
        data: {
          name: 'Demo Hasta (Serkan K.)',
          sector: 'Boya / Kimya',
          unit: 'Karışım & Dolum',
          symptoms: ['Baş Ağrısı', 'Halsizlik', 'Titreme'],
          labResults: { alt: '85', ast: '72', cholinesterase: '', bloodLead: '', urineArsenic: '', wbc: '11.5', sft: 'normal', xray: 'irritation' }
        }
      }
    },
    { label: 'Son Raporu Aç', icon: FileText, color: 'bg-white text-slate-900 border border-slate-200', to: '/patients' },
  ];

  const [aiQuery, setAiQuery] = React.useState('');
  const [aiResponse, setAiResponse] = React.useState<string | null>(null);

  const handleAiAsk = (predefined?: string) => {
    const query = predefined || aiQuery;
    if (!query) return;
    const response = generateTalepAIResponse(query);
    setAiResponse(typeof response === 'string' ? response : response.summary);
    setAiQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-page space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <TalepLogo size="lg" variant="glass" />
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">TALEP Klinik Paneli</h2>
            <p className="text-[10px] font-black tracking-wider text-cyan-600 uppercase mt-1">Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu</p>
            <p className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Mesleki Kimyasal Maruziyetlere Yönelik Klinik Karar Destek Sistemi</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('project_info')}</p>
             <p className="text-sm font-bold text-slate-900">{profile.fullName}</p>
             <p className="text-xs text-slate-500 font-medium">{profile.title}</p>
          </div>
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-slate-900 border-2 border-slate-50 shadow-xl overflow-hidden">
             {profile.avatarType === 'custom' && profile.avatarImage ? (
               <img src={profile.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
             ) : profile.avatarType === 'initials' ? (
               <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-lg font-black">
                 {profile.fullName ? (profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)) : 'ŞA'}
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                 <User size={32} />
               </div>
             )}
          </div>
        </div>
      </header>
 
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {quickActions.map((action, i) => (
           <Link key={i} to={action.to || '#'} state={action.state}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-[2rem] flex items-center gap-4 border border-slate-100 shadow-xl shadow-slate-200/10 ${action.color}`}
              >
                <div className="p-3 bg-white/20 rounded-xl">
                  <action.icon size={24} />
                </div>
                <span className="font-black tracking-tight uppercase text-xs">{action.label}</span>
              </motion.div>
           </Link>
         ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/10 hover:translate-y-[-4px] transition-all group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Chart */}
          <div className="bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('sectoral_distribution')}</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">{t('density_map')}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20">{t('monthly')}</button>
                <button className="px-5 py-2.5 bg-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100">{t('yearly')}</button>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[14, 14, 6, 6]} barSize={54}>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Smart Suggestion Card */}
          <div className="p-8 bg-blue-900 rounded-[3rem] text-white shadow-2xl shadow-blue-900/30 flex items-center justify-between group overflow-hidden relative">
             <Target size={140} className="absolute -right-10 -bottom-10 text-white opacity-5 rotate-12 group-hover:rotate-0 transition-all duration-700" />
             <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Zap size={18} className="text-blue-300" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Akıllı Öneri Engine</span>
                </div>
                <p className="text-xl font-bold leading-tight mb-2">Metal sektöründe n-hekzan maruziyet riski yükseliyor.</p>
                <p className="text-xs text-blue-200/60 leading-relaxed font-medium">Birim bazlı koruyucu ekipman denetimlerini %20 oranında sıkılaştırmanız önerilir.</p>
             </div>
             <button className="relative z-10 w-14 h-14 bg-white text-blue-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-white/20 transition-all hover:scale-110 active:scale-95">
                <ArrowUpRight size={28} />
             </button>
          </div>

          {/* Risk Distribution List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/10">
                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Kritik Riskli Sektörler</h3>
                <div className="space-y-4">
                  {sectorData.slice(0, 3).map((item, i) => (
                    <div key={item.name} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs" style={{ backgroundColor: COLORS[i] + '15', color: COLORS[i] }}>
                        {item.value}%
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                           <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: COLORS[i] }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20 flex flex-col justify-between">
                <div>
                   <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Son Raporlar</h3>
                   <p className="text-xs text-slate-500 font-medium mb-6">En son tamamlanan vaka analizleri</p>
                </div>
                <div className="space-y-3">
                   {cases.slice(0, 3).map((vaka, i) => (
                      <Link 
                        key={vaka.id || i} 
                        to="/patients"
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item"
                      >
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-white group-hover/item:text-brand-blue transition-colors">{vaka.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">{vaka.sector} • {vaka.risk} Risk</span>
                         </div>
                         <ArrowUpRight size={14} className="text-slate-500 group-hover/item:text-white transition-all transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                      </Link>
                   ))}
                   {cases.length === 0 && (
                      <p className="text-xs text-slate-500 font-medium italic py-2">Henüz kayıtlı rapor bulunmuyor.</p>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 space-y-8">
          {/* TALEP AI Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden">
             <div className="p-8 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-slate-900 text-white rounded-xl">
                      <Bot size={18} />
                   </div>
                   <h3 className="font-black text-slate-900 uppercase tracking-tight">TALEP AI</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">Akıllı toksikoloji karar destek asistanı</p>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hızlı Sorular</p>
                   <div className="flex flex-wrap gap-2">
                      {[
                        'Bu vaka için risk nedir?',
                        'Hangi kimyasal olası?',
                        'Hangi testler önerilir?'
                      ].map((q, i) => (
                         <button 
                           key={i} 
                           onClick={() => handleAiAsk(q)}
                           className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 transition-all hover:scale-105 active:scale-95"
                         >
                           {q}
                         </button>
                      ))}
                   </div>
                </div>

                {aiResponse && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl relative"
                   >
                      <button onClick={() => setAiResponse(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"><X size={14} /></button>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-brand-blue text-white rounded-lg flex-shrink-0 flex items-center justify-center border border-white shadow-sm"><Sparkles size={12}/></div>
                        <p className="text-xs font-medium text-slate-700 leading-relaxed italic">{aiResponse}</p>
                      </div>
                   </motion.div>
                )}

                <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                   <input 
                     value={aiQuery}
                     onChange={(e) => setAiQuery(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleAiAsk()}
                     type="text" 
                     placeholder="Sorunuzu buraya yazın..." 
                     className="flex-1 bg-transparent px-3 py-2 text-xs font-medium outline-none" 
                   />
                   <button 
                     onClick={() => handleAiAsk()}
                     className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                   >
                      <Send size={16} />
                   </button>
                </div>
             </div>
          </div>

          {/* Latest Updates Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/10 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                   <h3 className="font-black text-slate-900 uppercase tracking-tight">Son Gelişmeler</h3>
                   <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">PLATFORM GÜNCELLEMELERİ</p>
                </div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                   <TrendingUp size={18} />
                </div>
             </div>
             <div className="p-8 space-y-6">
                {updates.map((update, i) => (
                   <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="mt-1 flex-shrink-0">
                         <div className={`w-1.5 h-1.5 rounded-full mt-2 ${update.tag === 'Yeni' ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none mb-1">{update.title}</p>
                         <p className="text-[10px] text-slate-500 font-medium leading-relaxed tracking-tight">{update.description}</p>
                      </div>
                   </div>
                ))}
             </div>
             <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
                   Tümünü Gör
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Elegant academic project credits section */}
      <ProjectCredits variant="card" className="w-full mt-10 bg-white/40" />
    </motion.div>
  );
}
