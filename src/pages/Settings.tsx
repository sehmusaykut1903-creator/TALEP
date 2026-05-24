import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Palette, 
  Accessibility, 
  Bell, 
  ShieldCheck, 
  Database, 
  Info,
  ChevronRight,
  ChevronLeft,
  User,
  Layout,
  Terminal,
  FileText,
  Activity,
  Target,
  Upload,
  RotateCcw,
  Camera,
  Trash2,
  Stethoscope,
  FlaskConical,
  Shield,
  LogOut,
  Sparkles,
  CloudOff,
  Code,
  Building,
  AlertTriangle,
  CloudUpload,
  Monitor
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { themes, ThemeId } from '../themes/themes';
import { Language } from '../i18n/translations';
import { TalepLogo } from '../components/TalepLogo';

import SubscriptionPanel from '../components/premium/SubscriptionPanel';

export default function Settings() {
  const { 
    language, setLanguage, 
    theme, setTheme, 
    accessibility, setAccessibility, 
    mode, setMode,
    options, setOption,
    profile, setProfile, resetProfile,
    t 
  } = useSettings();

  const { role, logout, updateProfileData, userProfile } = useAuth();

  const [tempProfile, setTempProfile] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
      await logout();
    }
  };

  const categoryGroups = [
    {
      title: 'GENEL',
      items: [
        { id: 'system', title: 'Sistem', icon: Terminal },
        { id: 'theme', title: 'Tema Merkezi', icon: Palette },
        { id: 'language', title: 'Dil ve Bölge', icon: Globe },
        { id: 'accessibility', title: t('accessibility') || 'Erişilebilirlik', icon: Accessibility },
      ]
    },
    {
      title: 'KULLANICI & KİMLİK',
      items: [
        { id: 'profile', title: 'Profil', icon: User },
        { id: 'enterprise', title: 'Kurumsal Kimlik', icon: Building },
        { id: 'membership', title: 'Roller ve Yetkiler', icon: Shield },
        { id: 'security', title: 'Güvenlik', icon: ShieldCheck },
      ]
    },
    {
      title: 'AKADEMİK KATMAN',
      items: [
        { id: 'literature', title: 'Literatür Taraması', icon: FileText },
        { id: 'epidemiology', title: 'Mesleki Epidemiyoloji', icon: Activity },
        { id: 'ai', title: 'AI Araştırma Asistanı', icon: Sparkles },
        { id: 'clinical_ai', title: 'Akademik Klinik AI', icon: Target },
        { id: 'reports', title: t('report_settings') || 'Raporlama Merkezi', icon: FileText },
        { id: 'case_archive', title: 'Vaka Arşiv Sistemi', icon: Database },
        { id: 'exposure', title: 'Maruziyet Veritabanı', icon: FlaskConical },
        { id: 'emergency', title: 'Acil Toksikoloji', icon: AlertTriangle },
      ]
    },
    {
      title: 'VERİ & SENKRONİZASYON',
      items: [
        { id: 'sync', title: 'Firebase Durumu', icon: Database },
        { id: 'firestore', title: 'Firestore Sync', icon: CloudUpload },
        { id: 'backup', title: 'Veri Yedekleme', icon: Upload },
        { id: 'offline', title: 'Offline Mod', icon: CloudOff },
        { id: 'pdf_archive', title: 'PDF/Rapor Arşivi', icon: FileText },
      ]
    },
    {
      title: 'SİSTEM',
      items: [
        { id: 'performance', title: 'Performans Modu', icon: Activity },
        { id: 'low_power', title: 'Düşük Güç Modu', icon: RotateCcw },
        { id: 'tablet', title: 'Tablet Optimizasyonu', icon: Monitor },
        { id: 'network', title: 'Ağ Durumu', icon: Globe },
        { id: 'notifications', title: 'Bildirimler', icon: Bell },
        { id: 'presentation', title: t('presentation_mode') || 'Sunum Modu', icon: Monitor },
      ]
    }
  ];
  
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null);
  const [desktopActiveCategory, setDesktopActiveCategory] = useState('profile');

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'az', name: 'Azərbaycanca', flag: '🇦🇿' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleClearData = () => {
    if (confirm('Tüm demo verileri temizlenecektir. Emin misiniz?')) {
      localStorage.removeItem('talep_reports');
      localStorage.removeItem('talep_cases');
      window.location.reload();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Görsel boyutu 1MB\'dan küçük olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ 
          ...tempProfile, 
          avatarImage: reader.result as string, 
          avatarType: 'custom' 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = (catId: string) => (
    <AnimatePresence mode="wait">
      {catId === 'profile' && (
        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('profile')}</h3>
            <div className="flex gap-3">
               <button 
                onClick={() => {
                  resetProfile();
                  setTempProfile(profile);
                }}
                className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                title="Varsayılana Döndür"
               >
                 <RotateCcw size={18} />
               </button>
               <button 
                onClick={async () => {
                  setProfile(tempProfile);
                  if (updateProfileData) {
                    await updateProfileData({
                      displayName: tempProfile.fullName,
                      title: tempProfile.title,
                      institution: tempProfile.institution,
                      department: tempProfile.department,
                      orcid: tempProfile.orcid,
                      phone: tempProfile.phone,
                      city: tempProfile.city,
                      email: tempProfile.email
                    });
                  }
                }}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all cursor-pointer"
               >
                 {t('save')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Preview & Avatar */}
            <div className="lg:col-span-5 space-y-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ÖNİZLEME</p>
               <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16 opacity-50" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                     <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-slate-50 shadow-xl overflow-hidden mb-6 flex items-center justify-center relative group">
                        {tempProfile.avatarType === 'custom' && tempProfile.avatarImage ? (
                          <img src={tempProfile.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                        ) : tempProfile.avatarType === 'initials' ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-2xl font-black italic">
                            {tempProfile.fullName ? (tempProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)) : 'ŞA'}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                             {tempProfile.presetAvatar === 'medical' ? <Stethoscope size={40} /> : 
                              tempProfile.presetAvatar === 'science' ? <FlaskConical size={40} /> :
                              <User size={40} />}
                          </div>
                        )}
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                        >
                           <Camera size={24} />
                        </button>
                     </div>
                     <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{tempProfile.fullName}</h4>
                     <p className="text-sm font-bold text-slate-500 mb-4">{tempProfile.title}</p>
                     
                     {role && (
                       <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 ${
                         role === 'admin' ? 'bg-amber-100/70 text-amber-800 border border-amber-200' :
                         role === 'physician' ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200' :
                         role === 'laboratory' ? 'bg-blue-100/70 text-blue-800 border border-blue-200' :
                         'bg-slate-100/70 text-slate-800 border border-slate-200'
                       }`}>
                         🔑 {
                           role === 'admin' ? 'Yönetici (Admin)' :
                           role === 'physician' ? 'Uzman Hekim (Physician)' :
                           role === 'laboratory' ? 'Laboratuvar Analisti' :
                           'İzleyici (Observer)'
                         }
                       </span>
                     )}
                     <div className="space-y-1 opacity-70">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tempProfile.institution}</p>
                        <p className="text-xs font-medium text-slate-400">ORCID: {tempProfile.orcid}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">AVATAR SEÇİMİ</p>
                  <div className="grid grid-cols-4 gap-3">
                     <button 
                       onClick={() => setTempProfile({ ...tempProfile, avatarType: 'initials' })}
                       className={`h-14 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${tempProfile.avatarType === 'initials' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-50 bg-white text-slate-300'}`}
                     >
                       {tempProfile.fullName ? (tempProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)) : 'ŞA'}
                     </button>
                     {[
                       { id: 'medical', icon: Stethoscope },
                       { id: 'science', icon: FlaskConical },
                       { id: 'user', icon: User }
                     ].map(preset => (
                       <button 
                        key={preset.id}
                        onClick={() => setTempProfile({ ...tempProfile, avatarType: 'preset', presetAvatar: preset.id })}
                        className={`h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${tempProfile.avatarType === 'preset' && tempProfile.presetAvatar === preset.id ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-50 bg-white text-slate-300'}`}
                       >
                         <preset.icon size={20} />
                       </button>
                     ))}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                    >
                      <Upload size={14} /> Görsel Yükle
                    </button>
                    {(tempProfile.avatarImage || tempProfile.avatarType !== 'initials') && (
                      <button 
                        onClick={() => setTempProfile({ ...tempProfile, avatarType: 'initials', avatarImage: '' })}
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
               </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7 space-y-8">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">KİMLİK BİLGİLERİ</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                    <input 
                      type="text" 
                      value={tempProfile.fullName}
                      onChange={(e) => setTempProfile({...tempProfile, fullName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unvan / Rol</label>
                    <input 
                      type="text" 
                      value={tempProfile.title}
                      onChange={(e) => setTempProfile({...tempProfile, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kurum</label>
                    <input 
                      type="text" 
                      value={tempProfile.institution}
                      onChange={(e) => setTempProfile({...tempProfile, institution: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anabilim Dalı</label>
                    <input 
                      type="text" 
                      value={tempProfile.department}
                      onChange={(e) => setTempProfile({...tempProfile, department: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ORCID</label>
                    <input 
                      type="text" 
                      value={tempProfile.orcid}
                      onChange={(e) => setTempProfile({...tempProfile, orcid: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şehir / Ülke</label>
                    <input 
                      type="text" 
                      value={tempProfile.city}
                      onChange={(e) => setTempProfile({...tempProfile, city: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-posta</label>
                    <input 
                      type="email" 
                      placeholder="ornek@mail.com"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                    <input 
                      type="text" 
                      placeholder="+90"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}

      {catId === 'membership' && (
        <motion.div key="membership" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">ÜYELİK REHBERİ & LİSANS DETAYLARI</h3>
          </div>
          <SubscriptionPanel />
        </motion.div>
      )}

      {catId === 'language' && (
        <motion.div key="language" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Dil ve Bölge (Language)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                  language === lang.code ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-xl shadow-blue-500/10 scale-105' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-4xl drop-shadow-sm">{lang.flag}</span>
                <span className="font-bold text-slate-800">{lang.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {catId === 'theme' && (
        <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tema Merkezi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {id: 'edevlet', name: 'E-Devlet Premium', p: '#1e3a8a', s: '#3b82f6', a: '#2563eb'},
              {id: 'medical_glass', name: 'Medical Glass', p: '#0891b2', s: '#06b6d4', a: '#22d3ee'},
              {id: 'emerald_ai', name: 'Emerald AI', p: '#059669', s: '#10b981', a: '#34d399'},
              {id: 'titanium', name: 'Titanium Silver', p: '#475569', s: '#94a3b8', a: '#cbd5e1'},
              {id: 'dark_clinical', name: 'Dark Clinical', p: '#0ea5e9', s: '#38bdf8', a: '#7dd3fc', dark: true},
              {id: 'graphite_pro', name: 'Graphite Pro', p: '#334155', s: '#64748b', a: '#94a3b8', dark: true},
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={`flex flex-col gap-4 p-6 rounded-[2.5rem] border-2 transition-all group relative overflow-hidden ${
                  theme.id === t.id ? 'border-blue-500 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-50' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                {theme.id === t.id && <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-12 -mt-12" />}
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: t.p }} />
                  <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: t.s }} />
                  <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: t.a }} />
                </div>
                <div className="flex flex-col text-left">
                   <span className="font-black text-sm uppercase tracking-widest text-slate-800">{t.name}</span>
                   {t.dark && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Koyu Görünüm</span>}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {catId === 'accessibility' && (
        <motion.div key="accessibility" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('accessibility')}</h3>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
             {[
               { id: 'largeText', label: t('large_text'), info: t('large_text_info') },
               { id: 'boldText', label: t('bold_text'), info: t('bold_text_info') },
               { id: 'highContrast', label: t('high_contrast'), info: t('high_contrast_info') },
               { id: 'reducedMotion', label: t('reduced_motion'), info: t('reduced_motion_info') }
             ].map(item => (
               <div key={item.id} className="flex items-center justify-between">
                 <div>
                   <p className="font-bold text-lg text-slate-900 leading-none mb-1">{item.label}</p>
                   <p className="text-sm text-slate-500 font-medium">{item.info}</p>
                 </div>
                 <button 
                   onClick={() => setAccessibility({ [item.id]: !accessibility[item.id as keyof typeof accessibility] })}
                   className={`w-14 h-8 rounded-full p-1 transition-all ${accessibility[item.id as keyof typeof accessibility] ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-200'}`}
                 >
                   <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${accessibility[item.id as keyof typeof accessibility] ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
               </div>
             ))}
          </div>
        </motion.div>
      )}

      {catId === 'security' && (
        <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Güvenlik ve İzinler</h3>
          <div className="grid grid-cols-1 gap-4">
             <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{t('security_kvkk_title')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t('security_kvkk_desc')}</p>
             </div>
             <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">{t('security_clinical_title')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t('security_clinical_desc')}</p>
             </div>
             
             <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 mt-4">
               {[
                 { id: 'hidePatientName', label: t('hide_patient_name') },
                 { id: 'storeLocalData', label: t('store_local_data') },
                 { id: 'includeClinicalWarning', label: t('add_clinical_warning') },
                 { id: 'includeKvkkNote', label: t('add_kvkk_note') }
               ].map(item => (
                 <div key={item.id} className="flex items-center justify-between">
                   <p className="font-bold text-slate-900 leading-none">{item.label}</p>
                   <button 
                     onClick={() => setOption(item.id as any, !options[item.id as keyof typeof options])}
                     className={`w-12 h-7 rounded-full p-1 transition-all ${options[item.id as keyof typeof options] ? 'bg-blue-600' : 'bg-slate-300'}`}
                   >
                     <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${options[item.id as keyof typeof options] ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                 </div>
               ))}
               
               <button 
                onClick={handleClearData}
                className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all mt-4"
               >
                 {t('clear_data')}
               </button>
             </div>
          </div>
        </motion.div>
      )}

      {catId === 'sync' && (
        <motion.div key="sync" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Firebase Durumu</h3>
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative">
             <Database size={100} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
             <div className="relative z-10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">SİSTEM ANALİZİ</p>
                <div className="flex bg-white/5 p-1.5 rounded-2xl gap-1 mb-8">
                   <button onClick={() => setMode('demo')} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${mode === 'demo' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}>{t('demo_mode')}</button>
                   <button onClick={() => setMode('firebase')} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${mode === 'firebase' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}>{t('firebase_mode')}</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-400">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span className="text-xs font-medium">Bireysel ve Yerel Güvenli Veri Yapısı</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span className="text-xs font-medium">Uçtan Uca Şifreleme</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <Database size={20} className="text-blue-400" />
                    <span className="text-xs font-medium">Son Senkronizasyon: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {catId === 'offline' && (
         <motion.div key="offline" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Offline Mod & Ön Bellek</h3>
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/50 rounded-full blur-xl -translate-y-16 translate-x-16" />
             <div className="relative z-10 space-y-6">
                <p className="text-sm font-bold text-slate-500 leading-relaxed">Bağlantı olmadığında bile rapor üretmeye devam etmek için sistem önbelleği kullanır.</p>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div>
                     <p className="font-black text-slate-900 tracking-tight">Önbellek Alanı</p>
                     <p className="text-xs font-bold text-emerald-600 mt-1">45 MB kullanılıyor (Maks. 500 MB)</p>
                   </div>
                   <button className="bg-white border border-slate-200 text-rose-500 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm">Temizle</button>
                </div>
             </div>
           </div>
         </motion.div>
      )}

      {catId === 'notifications' && (
        <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bildirim Ayarları</h3>
           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-slate-900">Push Bildirimleri</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">Acil durumlarda anında uyarı al.</p>
                </div>
                <div className={`w-14 h-8 rounded-full p-1 transition-all cursor-pointer ${options.notifications ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-200'}`} onClick={() => setOption('notifications', !options.notifications)}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${options.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-slate-900">Cihaz İçi Sesli Uyarılar</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">Kritik hasta analizleri sırasında ses çal.</p>
                </div>
                <div className="w-14 h-8 rounded-full bg-slate-200 p-1"><div className="w-6 h-6 bg-white rounded-full transition-transform translate-x-0" /></div>
              </div>
           </div>
        </motion.div>
      )}

      {catId === 'ai' && (
        <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Araştırma Asistanı</h3>
           <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
             <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                  <div>
                    <h4 className="font-black tracking-tight text-lg drop-shadow-md">Akıllı Yanıt Stili</h4>
                    <p className="text-xs font-bold opacity-70 mt-1 leading-relaxed max-w-[200px]">AI asistanının ürettiği değerlendirmelerin klinik tonunu konfigüre edin.</p>
                  </div>
                  <select className="bg-[#1e293b]/80 px-4 py-3 rounded-2xl text-sm border border-white/20 outline-none font-bold shadow-inner min-w-[200px]" aria-label="AI Yanıt Stili">
                    <option className="text-slate-900">Akademik & Resmi</option>
                    <option className="text-slate-900">Klinik & Öz (Tavsiye Edilen)</option>
                    <option className="text-slate-900">Açıklayıcı & Eğitimsel</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-2">
                   <div>
                     <p className="font-bold">Önerge Motoru</p>
                     <p className="text-[10px] uppercase font-black tracking-widest text-blue-300 mt-1">SÜREKLİ AKTİF</p>
                   </div>
                   <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)]">OPTIMIZE EDILDI</div>
                </div>
             </div>
           </div>
        </motion.div>
      )}

      {['system', 'developer', 'enterprise', 'emergency', 'backup', 'literature', 'epidemiology', 'clinical_ai', 'case_archive', 'exposure', 'firestore', 'pdf_archive', 'performance', 'low_power', 'tablet', 'network', 'quick_access'].includes(catId) && (
         <motion.div key={catId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex flex-col items-center justify-center min-h-[400px]">
             <ShieldCheck size={80} className="text-slate-200 mb-2 drop-shadow-sm" />
             <h3 className="text-2xl font-black text-slate-800 tracking-tight text-center">Premium Modül Konfigürasyonu</h3>
             <p className="text-slate-500 text-center text-sm font-bold bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 max-w-sm">Bu alan, Premium Kurumsal yapıda lisans modelinize özel erişebileceğiniz aktif bileşenleri listeler.</p>
         </motion.div>
      )}

      {catId === 'presentation' && (
        <motion.div key="presentation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('presentation_mode') || 'Sunum Modu'}</h3>
          <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100">
             <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100"><Monitor size={28}/></div>
                <div>
                   <p className="font-black text-lg text-slate-900 leading-none mb-1">{t('presentation_mode') || 'Sunum Modu'}</p>
                   <p className="text-xs text-slate-500 font-bold">{t('presentation_mode_info')}</p>
                </div>
             </div>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <p className="font-bold text-slate-900 tracking-tight">Sunum Modunu Aktive Et</p>
                   <button onClick={() => setOption('presentationMode', !options.presentationMode)} className={`w-12 h-7 rounded-full p-1 transition-all ${options.presentationMode ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${options.presentationMode ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                </div>
                <div className="flex items-center justify-between">
                   <p className="font-bold text-slate-900 tracking-tight">Antalya Kongre Etiketi Göster</p>
                   <div className="w-12 h-7 rounded-full bg-blue-600 p-1"><div className="w-5 h-5 bg-white rounded-full translate-x-5 shadow-sm" /></div>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {catId === 'reports' && (
        <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Raporlama Merkezi</h3>
           <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'short', title: t('short_report') || 'Kısa Rapor', desc: 'Sadece temel risk ve öneriler.' },
                { id: 'standard', title: t('standard_report') || 'Standart Rapor', desc: 'Vaka, laboratuvar ve analiz özeti.' },
                { id: 'detailed', title: t('academic_report') || 'Akademik Rapor', desc: 'Tüm bulgular ve akademik referanslar.' }
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setOption('reportType', type.id as any)}
                  className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${options.reportType === type.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-50 hover:border-slate-200'}`}
                >
                  <div className="text-left">
                     <p className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">{type.title}</p>
                     <p className="text-xs text-slate-500 font-bold">{type.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${options.reportType === type.id ? 'border-blue-500 bg-blue-500' : 'border-slate-200'}`}>
                    {options.reportType === type.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="settings-page w-full max-w-7xl mx-auto min-h-screen md:min-h-0">
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-6 h-[720px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-[340px] shrink-0 bg-white/70 backdrop-blur-3xl border border-slate-200/60 rounded-[3rem] py-8 flex flex-col gap-2 overflow-y-auto shadow-2xl shadow-slate-200/20 custom-scrollbar relative">
          <h2 className="text-2xl font-black px-8 mb-6 tracking-tight text-slate-900 drop-shadow-sm">{t('settings') || 'Ayarlar'}</h2>
          
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-20 custom-scrollbar">
            {categoryGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <p className="px-4 py-2 text-[10px] uppercase font-black tracking-widest text-slate-400">{group.title}</p>
                {group.items.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setDesktopActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-bold group relative overflow-hidden ${
                      desktopActiveCategory === cat.id 
                        ? 'bg-white shadow-[0_4px_20px_rgba(37,99,235,0.06)] border border-blue-100 text-slate-900' 
                        : 'text-slate-500 hover:bg-white/50 border border-transparent hover:text-slate-800'
                    }`}
                  >
                    {/* Modern Active Indicator Line */}
                    {desktopActiveCategory === cat.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                    
                    <div className={`p-2 rounded-xl transition-all ${
                      desktopActiveCategory === cat.id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <cat.icon size={18} />
                    </div>
                    <span className="text-[14px] truncate">{cat.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-[1.25rem] transition-all font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 group border border-transparent hover:border-rose-100"
            >
              <LogOut size={18} />
              <span className="text-[14px]">Oturumu Kapat</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/80 backdrop-blur-3xl border border-slate-200/60 rounded-[3rem] p-10 overflow-y-auto shadow-[0_32px_64px_-16px_rgba(15,23,42,0.05)] custom-scrollbar">
          {renderContent(desktopActiveCategory)}
        </div>
      </div>

      {/* Mobile Layout - iOS Style */}
      <div className="md:hidden flex flex-col min-h-screen -mx-5 -mt-5 px-5 pt-8 pb-32 bg-slate-50">
        <AnimatePresence mode="wait">
          {!mobileActiveCategory ? (
            <motion.div 
              key="mobile-main" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-black text-slate-900 px-2 tracking-tight">{t('settings') || 'Ayarlar'}</h1>
              
              <div className="space-y-6">
                {categoryGroups.map((group) => (
                  <div key={group.title} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm shadow-slate-100/50">
                    <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{group.title}</p>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {group.items.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setMobileActiveCategory(cat.id);
                            window.scrollTo(0, 0);
                          }}
                          className="w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100">
                              <cat.icon size={18} />
                            </div>
                            <span className="font-bold text-slate-800 text-sm">{cat.title}</span>
                          </div>
                          <ChevronRight size={18} className="text-slate-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl font-black text-rose-500 bg-white border border-rose-100 active:scale-95 transition-transform shadow-sm"
              >
                <LogOut size={20} />
                Güvenli Çıkış Yap
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 bg-white min-h-screen -mx-5 px-5 pt-6 pb-32"
            >
              <button 
                onClick={() => setMobileActiveCategory(null)}
                className="flex items-center gap-2 text-blue-600 font-bold p-2 -ml-2 active:bg-blue-50 rounded-xl transition-colors w-fit"
              >
                <ChevronLeft size={24} />
                <span>Ayarlara Dön</span>
              </button>
              <div className="pb-10">
                {renderContent(mobileActiveCategory)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
