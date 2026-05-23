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
  Sparkles
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

  const categories = [
    { id: 'profile', title: t('profile'), icon: User },
    { id: 'membership', title: 'Üyelik & Premium Lisans', icon: Sparkles },
    { id: 'language', title: t('language'), icon: Globe },
    { id: 'theme', title: t('theme'), icon: Palette },
    { id: 'accessibility', title: t('accessibility'), icon: Accessibility },
    { id: 'reports', title: t('report_settings'), icon: FileText },
    { id: 'security', title: t('security'), icon: ShieldCheck },
    { id: 'sync', title: t('system_mode'), icon: Database },
    { id: 'presentation', title: t('presentation_mode'), icon: Terminal },
    { id: 'about', title: t('about'), icon: Info },
  ];
  
  // Mobile states
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null);

  // Desktop states
  const [desktopActiveCategory, setDesktopActiveCategory] = useState('profile');

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
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
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('language')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${
                  language === lang.code ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg shadow-brand-blue/5' : 'border-slate-50 bg-slate-50/50 hover:border-slate-100'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-bold text-base">{lang.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {catId === 'theme' && (
        <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('theme')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(themes).map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={`flex flex-col gap-4 p-6 rounded-[2.5rem] border-2 transition-all group ${
                  theme.id === t.id ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                }`}
              >
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.primary }} />
                  <div className="w-8 h-8 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.secondary }} />
                  <div className="w-8 h-8 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.accent }} />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">{t.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {catId === 'accessibility' && (
        <motion.div key="accessibility" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('accessibility')}</h3>
          <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-8">
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
                   className={`w-14 h-8 rounded-full p-1 transition-all ${accessibility[item.id as keyof typeof accessibility] ? 'bg-brand-blue' : 'bg-slate-300'}`}
                 >
                   <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-sm ${accessibility[item.id as keyof typeof accessibility] ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
               </div>
             ))}
          </div>
        </motion.div>
      )}

      {catId === 'security' && (
        <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('security')}</h3>
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
                     className={`w-12 h-7 rounded-full p-1 transition-all ${options[item.id as keyof typeof options] ? 'bg-brand-blue' : 'bg-slate-300'}`}
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
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('system_mode')}</h3>
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
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {catId === 'presentation' && (
        <motion.div key="presentation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('presentation_mode')}</h3>
          <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100">
             <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100"><Terminal size={28}/></div>
                <div>
                   <p className="font-black text-lg text-slate-900 leading-none mb-1">{t('presentation_mode')}</p>
                   <p className="text-xs text-slate-500 font-bold">{t('presentation_mode_info')}</p>
                </div>
             </div>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <p className="font-bold text-slate-900 tracking-tight">Sunum Modunu Aktive Et</p>
                   <button onClick={() => setOption('presentationMode', !options.presentationMode)} className={`w-12 h-7 rounded-full p-1 transition-all ${options.presentationMode ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${options.presentationMode ? 'translate-x-5' : 'translate-x-0'}`} />
                   </button>
                </div>
                <div className="flex items-center justify-between">
                   <p className="font-bold text-slate-900 tracking-tight">Antalya Kongre Etiketi Göster</p>
                   <div className="w-12 h-7 rounded-full bg-emerald-500 p-1"><div className="w-5 h-5 bg-white rounded-full translate-x-5 shadow-sm" /></div>
                </div>
                <div className="flex items-center justify-between">
                   <p className="font-bold text-slate-900 tracking-tight">Demo Verilerini Zenginleştir</p>
                   <div className="w-12 h-7 rounded-full bg-emerald-500 p-1"><div className="w-5 h-5 bg-white rounded-full translate-x-5 shadow-sm" /></div>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {catId === 'reports' && (
        <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('report_settings')}</h3>
           <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'short', title: t('short_report'), desc: 'Sadece temel risk ve öneriler.' },
                { id: 'standard', title: t('standard_report'), desc: 'Vaka, laboratuvar ve analiz özeti.' },
                { id: 'detailed', title: t('academic_report'), desc: 'Tüm bulgular ve akademik referanslar.' }
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setOption('reportType', type.id as any)}
                  className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${options.reportType === type.id ? 'border-brand-blue bg-blue-50/50' : 'border-slate-50 hover:border-slate-200'}`}
                >
                  <div className="text-left">
                     <p className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">{type.title}</p>
                     <p className="text-xs text-slate-500 font-bold">{type.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${options.reportType === type.id ? 'border-brand-blue bg-brand-blue' : 'border-slate-200'}`}>
                    {options.reportType === type.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
           </div>
        </motion.div>
      )}

      {catId === 'about' && (
        <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
          <div className="flex items-center gap-6">
            <TalepLogo size="lg" variant="glass" />
            <div>
              <h3 className="text-4xl font-black text-slate-900 mb-1 leading-none tracking-tighter">TALEP</h3>
              <p className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.2em]">{t('version')}</p>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('purpose_title')}</h4>
               <p className="text-sm font-medium text-slate-600 leading-relaxed uppercase tracking-wide opacity-80">
                  “Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu: Mesleki Kimyasal Maruziyetlere Yönelik Klinik Karar Destek Sistemi”
               </p>
               <p className="text-sm font-medium text-slate-600 leading-relaxed">{t('purpose_text')}</p>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('problem_title')}</h4>
               <p className="text-sm font-medium text-slate-600 leading-relaxed">{t('problem_text')}</p>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('value_title')}</h4>
               <p className="text-sm font-medium text-slate-600 leading-relaxed">{t('value_text')}</p>
            </div>

            <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
               <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-4">{t('ai_title')}</h4>
               <p className="text-sm font-bold leading-relaxed">{t('ai_text')}</p>
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-100">
               
            </div>

            <div className="text-center opacity-35 pt-4">
               <p className="text-[11px] font-black tracking-widest">{t('copyright')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="settings-page w-full max-w-7xl mx-auto min-h-screen md:min-h-0">
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-6 h-[700px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white/50 backdrop-blur-3xl border border-white/60 rounded-[3rem] p-8 flex flex-col gap-2 overflow-y-auto shadow-2xl shadow-slate-200/20">
          <h2 className="text-2xl font-black px-4 mb-8 tracking-tight">{t('settings')}</h2>
          <div className="space-y-1.5 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setDesktopActiveCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all font-bold group ${
                  desktopActiveCategory === cat.id 
                    ? 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/30' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-xl hover:shadow-slate-200/50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${desktopActiveCategory === cat.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'}`}>
                  <cat.icon size={20} />
                </div>
                <span className="text-[15px]">{cat.title}</span>
                {desktopActiveCategory !== cat.id && <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-slate-300" />}
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-100/85">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
                <LogOut size={20} />
              </div>
              <span className="text-[15px]">Oturumu Kapat</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-12 overflow-y-auto shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)]">
          {renderContent(desktopActiveCategory)}
        </div>
      </div>

      {/* Mobile Layout - iOS Style */}
      <div className="md:hidden flex flex-col min-h-screen -mx-5 -mt-5 px-5 pt-8 pb-32">
        <AnimatePresence mode="wait">
          {!mobileActiveCategory ? (
            <motion.div 
              key="mobile-main" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h1 className="text-4xl font-black text-slate-900 px-2 tracking-tight">{t('settings')}</h1>
              
              <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 overflow-hidden shadow-2xl shadow-slate-900/5 divide-y divide-slate-100">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setMobileActiveCategory(cat.id);
                      window.scrollTo(0, 0);
                    }}
                    className="w-full flex items-center gap-4 p-5 active:bg-slate-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-slate-100/80 rounded-2xl flex items-center justify-center text-slate-600 border border-white ring-4 ring-slate-50/50">
                      <cat.icon size={24} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg text-slate-900">{cat.title}</span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5">{cat.id === 'general' ? 'Sistem' : 'Konfigürasyon'}</span>
                    </div>
                    <ChevronRight size={20} className="ml-auto text-slate-300" />
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-5 active:bg-rose-50 transition-colors group text-rose-500 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-white ring-4 ring-rose-50/10">
                    <LogOut size={24} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg text-rose-600">Oturumu Kapat</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5">Güvenli Oturum Çıkışı</span>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-rose-300" />
                </button>
              </div>

              {/* Version Info */}
              <div className="text-center p-10 opacity-30">
                <p className="text-xs font-black tracking-[0.3em] uppercase">TALEP {t('version')}</p>
                <p className="text-[10px] mt-2">© 2026 AI Medical Intelligence</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="mobile-detail" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileActiveCategory(null)}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-lg shadow-brand-blue/10 border border-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                    {categories.find(c => c.id === mobileActiveCategory)?.title}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{t('settings')}</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 p-6 shadow-2xl shadow-slate-900/5">
                {renderContent(mobileActiveCategory)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
