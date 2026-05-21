import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  Activity, 
  FlaskConical, 
  Settings as SettingsIcon,
  Bell,
  Menu,
  X,
  Search,
  ChevronDown,
  FileText,
  Bot,
  User,
  LogOut,
  BookOpen,
  TrendingUp,
  Database,
  Sparkles,
  Flame,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { TalepLogo } from '../TalepLogo';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, active, onClick }: NavItemProps) => {
  const { theme } = useSettings();
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
        active 
          ? 'text-white shadow-xl translate-x-1' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
      style={active ? { backgroundColor: theme.primary, boxShadow: `0 10px 25px -5px ${theme.primary}40` } as React.CSSProperties : {}}
    >
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeNav"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </Link>
  );
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t, theme, isRTL, profile } = useSettings();
  const { role, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const coreNavigation = [
    { to: '/', icon: Home, label: t('dashboard') },
    { to: '/assessment', icon: PlusCircle, label: t('assessment') },
    { to: '/ai', icon: Bot, label: t('talep_ai') },
    { to: '/patients', icon: FileText, label: t('patients') },
    { to: '/chemicals', icon: FlaskConical, label: t('library') },
    { to: '/settings', icon: SettingsIcon, label: t('settings') },
  ];

  const academicNavigation = [
    { to: '/literature', icon: BookOpen, label: t('literature_intelligence') },
    { to: '/epidemiology', icon: TrendingUp, label: t('epidemiology') },
    { to: '/exposure-db', icon: Database, label: t('exposure_db') },
    { to: '/case-archive', icon: FileText, label: t('case_archive') },
    { to: '/ai-research-assistant', icon: Sparkles, label: t('ai_research_assistant') },
    { to: '/emergency-mode', icon: Flame, label: t('emergency_mode') },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden font-sans" style={{ backgroundColor: theme.background }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white/50 backdrop-blur-xl border-r border-slate-200/50 sticky top-0 h-screen z-40 overflow-y-auto shrink-0 scrollbar-hide">
        <div className="p-8">
          <div className="mb-12">
            <TalepLogo size="md" showText={true} showSubtitle={true} variant="glass" />
          </div>

          <div className="mb-8 p-1 bg-slate-100/50 rounded-2xl flex">
             <div className="flex-1 flex items-center gap-2 px-4 py-2 text-slate-400">
                <Search size={16} />
                <input type="text" placeholder={t('fast_search')} className="bg-transparent border-none outline-none text-xs w-full" />
             </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-4">KLİNİK ÇEKİRDEK</p>
              <nav className="space-y-1">
                {coreNavigation.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={IconComp}
                      label={item.label}
                      active={location.pathname === item.to}
                    />
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-4">AKADEMİK KATMAN</p>
              <nav className="space-y-1">
                {academicNavigation.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavItem
                      key={item.to}
                      to={item.to}
                      icon={IconComp}
                      label={item.label}
                      active={location.pathname === item.to}
                    />
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-100">
             <div className="flex justify-between items-center mb-3 text-slate-400">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('profile').toUpperCase()}</p>
               {role && (
                 <span className={`inline-block px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                   role === 'admin' ? 'bg-amber-100/70 text-amber-800' :
                   role === 'physician' ? 'bg-emerald-100/70 text-emerald-800' :
                   role === 'laboratory' ? 'bg-blue-100/70 text-blue-800' :
                   'bg-slate-250/70 text-slate-600'
                 }`}>
                   {role}
                 </span>
               )}
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                   {profile.avatarType === 'custom' && profile.avatarImage ? (
                     <img src={profile.avatarImage} alt="Profile" className="w-full h-full object-cover" />
                   ) : profile.avatarType === 'initials' ? (
                     <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-xs font-black">
                       {profile.fullName ? (profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)) : 'ŞA'}
                     </div>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                       <User size={20} />
                     </div>
                   )}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="font-bold text-sm text-slate-900 truncate">{profile.fullName || 'Şehmus Aykut'}</p>
                   <p className="text-[10px] text-slate-400 font-medium truncate">{profile.title || 'Proje Lideri / Ana Geliştirici'}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
           <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">
                {t('active_system')}
              </span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shrink-0 z-50 pt-[calc(1rem+env(safe-area-inset-top))]">
          <div className="flex items-center gap-4">
            <TalepLogo size="sm" showText={true} showSubtitle={false} variant="glass" />
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-400"><Bell size={22}/></button>
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
               {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
          </div>
        </div>

        {/* Global Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`absolute top-20 ${isRTL ? 'left-10' : 'right-10'} w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 p-6 overflow-hidden`}
            >
               <h4 className="font-bold mb-4">{t('notifications')}</h4>
               <div className="space-y-4">
                  <div className="flex gap-3 p-3 bg-red-50 rounded-2xl border border-red-100">
                     <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                     <p className="text-xs font-medium text-red-700">{t('new_vulnerability_detected')}</p>
                  </div>
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                     <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                     <p className="text-xs font-medium text-blue-700">{t('report_draft_created')}</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-4 md:pt-8 md:px-10 lg:px-14 pb-[130px] md:pb-10 lg:pb-14 scroll-smooth">
          <div className="max-w-7xl mx-auto px-5">
            {children}

            {/* Premium Institutional Footer */}
            <footer className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800 text-center pb-6">
              <p className="text-[10px] font-black tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">TALEP v4.0 PREMIUM</p>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu</p>
              <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-600 mt-1.5">
                “2026 Şehmus Aykut tarafından geliştirilmiştir.”
              </p>
            </footer>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
    </div>
  );
}
