import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';
import { ThemeId, themes, Theme } from '../themes/themes';
import { motion, AnimatePresence } from 'motion/react';

export interface Profile {
  fullName: string;
  title: string;
  institution: string;
  department: string;
  project: string;
  orcid: string;
  email: string;
  phone: string;
  city: string;
  avatarType: 'initials' | 'preset' | 'custom';
  avatarInitials: string;
  avatarImage: string; // base64
  presetAvatar: string;
}

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (themeId: ThemeId) => void;
  accessibility: {
    largeText: boolean;
    boldText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    reducedTransparency: boolean;
    compactMode: boolean;
    cardDensity: 'low' | 'normal' | 'high';
    useSystemTheme: boolean;
    animationQuality: 'low' | 'normal' | 'high';
  };
  setAccessibility: (settings: Partial<SettingsContextType['accessibility']>) => void;
  mode: 'demo' | 'firebase';
  setMode: (mode: 'demo' | 'firebase') => void;
  options: {
    darkMode: 'light' | 'dark' | 'auto';
    reportType: 'short' | 'standard' | 'detailed';
    alertSensitivity: 'low' | 'normal' | 'high';
    notifications: boolean;
    suggestionEngine: boolean;
    presentationMode: boolean;
    hidePatientName: boolean;
    storeLocalData: boolean;
    includeClinicalWarning: boolean;
    includeKvkkNote: boolean;
  };
  setOption: <K extends keyof SettingsContextType['options']>(key: K, value: SettingsContextType['options'][K]) => void;
  profile: Profile;
  setProfile: (profile: Partial<Profile>) => void;
  resetProfile: () => void;
  t: (key: string) => string;
  isRTL: boolean;
  showToast: (msg: string) => void;
}

export const defaultProfile: Profile = {
  fullName: "Şehmus Aykut",
  title: "Proje Lideri / Ana Geliştirici",
  institution: "Yozgat Bozok Üniversitesi Tıp Fakültesi",
  department: "Halk Sağlığı Anabilim Dalı",
  project: "TALEP",
  orcid: "0009-0003-4555-7654",
  email: "",
  phone: "",
  city: "Yozgat, Turkey",
  avatarType: "initials",
  avatarInitials: "ŞA",
  avatarImage: "",
  presetAvatar: "bot"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('talep_lang') as Language) || 'tr';
  });

  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    return (localStorage.getItem('talep_theme') as ThemeId) || 'arctic';
  });

  const [accessibility, setAccessibilityState] = useState(() => {
    const saved = localStorage.getItem('talep_accessibility');
    const defaultVal = { 
      largeText: false, 
      boldText: false, 
      highContrast: false, 
      reducedMotion: false,
      reducedTransparency: false,
      compactMode: false,
      cardDensity: 'normal' as 'low' | 'normal' | 'high',
      useSystemTheme: false,
      animationQuality: 'normal' as 'low' | 'normal' | 'high'
    };
    if (!saved) return defaultVal;
    try {
      return { ...defaultVal, ...JSON.parse(saved) };
    } catch {
      return defaultVal;
    }
  });

  const [mode, setModeState] = useState<'demo' | 'firebase'>(() => {
    return (localStorage.getItem('talep_mode') as 'demo' | 'firebase') || 'demo';
  });

  const [options, setOptionsState] = useState<SettingsContextType['options']>(() => {
    const saved = localStorage.getItem('talep_options');
    return saved ? JSON.parse(saved) : {
      darkMode: 'auto',
      reportType: 'standard',
      alertSensitivity: 'normal',
      notifications: true,
      suggestionEngine: true,
      presentationMode: false,
      hidePatientName: false,
      storeLocalData: true,
      includeClinicalWarning: true,
      includeKvkkNote: true
    };
  });

  const [profile, setProfileState] = useState<Profile>(() => {
    const saved = localStorage.getItem('talep_profile');
    if (!saved) return defaultProfile;
    
    try {
      const parsed = JSON.parse(saved);
      if (parsed.role && !parsed.title) {
        parsed.title = parsed.role;
      }
      if (parsed.fullName === "Şehmus Aykut" && (parsed.title === "Halk Sağlığı Uzmanı" || !parsed.title)) {
        parsed.title = defaultProfile.title;
      }
      return { ...defaultProfile, ...parsed };
    } catch (e) {
      return defaultProfile;
    }
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('talep_lang', lang);
    showToast(translations[lang]?.updated || 'Dil güncellendi');
  };

  const setTheme = (id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem('talep_theme', id);
    showToast(t('updated'));
  };

  const setAccessibility = (settings: Partial<SettingsContextType['accessibility']>) => {
    const newVal = { ...accessibility, ...settings };
    setAccessibilityState(newVal);
    localStorage.setItem('talep_accessibility', JSON.stringify(newVal));
    showToast(t('applied'));
  };

  const setMode = (m: 'demo' | 'firebase') => {
    setModeState(m);
    localStorage.setItem('talep_mode', m);
    showToast(t('applied'));
  };

  const setOption = <K extends keyof SettingsContextType['options']>(key: K, value: SettingsContextType['options'][K]) => {
    const newOptions = { ...options, [key]: value };
    setOptionsState(newOptions);
    localStorage.setItem('talep_options', JSON.stringify(newOptions));
    showToast(t('applied'));
  };

  const setProfile = (newProfile: Partial<Profile>) => {
    const updated = { ...profile, ...newProfile };
    setProfileState(updated);
    localStorage.setItem('talep_profile', JSON.stringify(updated));
    showToast(t('saved'));
  }

  const resetProfile = () => {
    setProfileState(defaultProfile);
    localStorage.setItem('talep_profile', JSON.stringify(defaultProfile));
    showToast(t('saved'));
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
       if (result && result[k]) {
          result = result[k];
       } else {
          // Fallback to TR - but strictly only run translations if we exist.
          let trFallback = translations['tr'];
          for (const trK of keys) {
             if (trFallback && trFallback[trK]) {
                trFallback = trFallback[trK];
             } else {
                return key;
             }
          }
          return trFallback;
       }
    }
    return result;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    let activeThemeId = themeId;
    if (accessibility.useSystemTheme) {
      const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeThemeId = wantsDark ? 'midnight' : 'arctic';
    }

    const currentTheme = themes[activeThemeId];
    if (currentTheme) {
      document.documentElement.style.setProperty('--brand-primary', currentTheme.primary);
      document.documentElement.style.setProperty('--brand-secondary', currentTheme.secondary);
      document.documentElement.style.setProperty('--brand-accent', currentTheme.accent);
      document.documentElement.style.setProperty('--brand-bg', currentTheme.background);
      
      if (currentTheme.isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
    
    // Apply contrast and text size classes to body
    document.body.className = `
      ${accessibility.largeText ? 'text-large font-medium' : ''} 
      ${accessibility.boldText ? 'text-bold font-extrabold' : ''}
      ${accessibility.reducedMotion ? 'reduce-motion' : ''}
      ${accessibility.reducedTransparency ? 'reduce-transparency' : ''}
      ${accessibility.compactMode ? 'compact-layout' : ''}
      ${accessibility.highContrast ? 'contrast-125 saturate-125' : 'contrast-100'}
      ${isRTL ? 'dir-rtl' : 'dir-ltr'}
    `;
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [themeId, accessibility, isRTL, language]);

  return (
    <SettingsContext.Provider value={{ 
      language, setLanguage, 
      theme: themes[themeId] || themes['arctic'], setTheme,
      accessibility, setAccessibility,
      mode, setMode,
      options, setOption,
      profile, setProfile, resetProfile,
      t: t,
      isRTL,
      showToast
    }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100000] bg-slate-900/90 text-white px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 font-bold text-sm tracking-tight"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
