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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { to: '/', icon: Home, label: t('dashboard') },
    { to: '/assessment', icon: PlusCircle, label: t('assessment') },
    { to: '/ai', icon: Bot, label: t('talep_ai') },
    { to: '/patients', icon: FileText, label: t('patients') },
    { to: '/chemicals', icon: FlaskConical, label: t('library') },
    { to: '/settings', icon: SettingsIcon, label: t('settings') },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden font-sans" style={{ backgroundColor: theme.background }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white/50 backdrop-blur-xl border-r border-slate-200/50 sticky top-0 h-screen z-40 overflow-y-auto shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 flex items-center justify-center text-white rounded-[1rem] shadow-2xl" style={{ backgroundColor: theme.primary, boxShadow: `0 15px 35px -5px ${theme.primary}50` }}>
              <Activity size={26} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter leading-none">TALEP</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t('version')}</p>
            </div>
          </div>

          <div className="mb-8 p-1 bg-slate-100/50 rounded-2xl flex">
             <div className="flex-1 flex items-center gap-2 px-4 py-2 text-slate-400">
               <Search size={16} />
               <input type="text" placeholder={t('fast_search')} className="bg-transparent border-none outline-none text-xs w-full" />
             </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
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

          <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-100">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{t('profile').toUpperCase()}</p>
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
            <div className="w-9 h-9 flex items-center justify-center text-white rounded-xl shadow-lg" style={{ backgroundColor: theme.primary }}>
              <FlaskConical size={20} />
            </div>
            <span className="font-black text-xl tracking-tight">TALEP</span>
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
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
    </div>
  );
}
