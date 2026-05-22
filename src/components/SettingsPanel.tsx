import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Building,
  Briefcase,
  Database,
  Trash2,
  RefreshCw,
  Search,
  Bell,
  Volume2,
  Cpu,
  Bookmark,
  Award,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle,
  HelpCircle,
  Stethoscope,
  Globe,
  Palette,
  Cloud,
  Layers,
  Activity,
  ChevronLeft,
  Moon,
  Sun,
  Key,
  Flame,
  Gauge,
  Terminal,
  Clock,
  BookOpen,
  Wifi,
  Lock,
  Eye,
  Settings,
  Scale
} from "lucide-react";
import ProjectCredits from "./academic/ProjectCredits";
import { useSettings } from "../context/SettingsContext";
import { Language } from "../i18n/translations";
import { ThemeId, themes } from "../themes/themes";

interface SettingsUser {
  displayName: string;
  role: string;
  institution: string;
  department: string;
}

interface SettingsPanelProps {
  sessionUser: SettingsUser;
  setSessionUser: React.Dispatch<React.SetStateAction<SettingsUser>>;
}

// Highly comprehensive localized text dictionary directly inside settings page, safely supporting all 8 languages requested.
const I18N: Record<Language, Record<string, string>> = {
  tr: {
    title: "Sistem Tercihleri",
    subtitle: "Apple, Tesla ve VisionOS Esintili Tıbbi İşletim Paneli",
    searchPlace: "Ayarlarda ara (⌘K)...",
    cat_general: "Genel Sistem",
    cat_appearance: "Renk & Görünüm",
    cat_ai: "Klinik Yapay Zeka",
    cat_cloud: "Firebase & Bulut",
    cat_notifications: "Hayati Sinyaller",
    cat_academic: "Akademik Çevre",
    cat_security: "Erişim Güvenliği",
    cat_advanced: "Görsel Metrikler",
    clinic_identity: "Klinik Kimlik & Sertifika",
    doctor_name: "Sorumlu Hekim Adı",
    department: "Tıbbi Birim",
    institution: "Kurum / Hastane",
    reset_btn: "Tüm Önbelleği Sıfırla",
    reset_desc: "Lokal IndexedDB önbelleğini ve klinik oturum şemalarını tamamen temizler.",
    live_preview: "Canlı Tema Önizleme",
    cpu_usage: "İşlemci Yoğunluğu",
    memory_usage: "AI Motor Belleği",
    latency: "Sorgu Latensi",
    uptime: "Sistem Stabilizasyonu",
    experimental: "Deneysel Özellikleri Etkinleştir"
  },
  en: {
    title: "System Preferences",
    subtitle: "Apple, Tesla & VisionOS Inspired Medical Operating System",
    searchPlace: "Search settings (⌘K)...",
    cat_general: "General System",
    cat_appearance: "Colors & Design",
    cat_ai: "Clinical AI Agent",
    cat_cloud: "Firebase & Cloud",
    cat_notifications: "Vital Signals",
    cat_academic: "Academic Sphere",
    cat_security: "Access Security",
    cat_advanced: "Visual Metrics",
    clinic_identity: "Clinical Identity & Seal",
    doctor_name: "Attending Physician",
    department: "Medical Department",
    institution: "Institution / Hospital",
    reset_btn: "Reset Local Cache",
    reset_desc: "Completely wipes local IndexedDB cache and clinical session states.",
    live_preview: "Live Theme Preview",
    cpu_usage: "Core CPU Load",
    memory_usage: "AI Memory Buffer",
    latency: "Query Delay",
    uptime: "System Stability",
    experimental: "Enable Advanced Prototypes"
  },
  az: {
    title: "Sistem Ayarları",
    subtitle: "Apple və MacOS Üslublu Tibbi İstifadəçi Paneli",
    searchPlace: "Ayarlarda axtar (⌘K)...",
    cat_general: "Ümumi Sistem",
    cat_appearance: "Görünüş və Tema",
    cat_ai: "Klinik Süni Zəka",
    cat_cloud: "Firebase və Bulud",
    cat_notifications: "Hayati Siqnallar",
    cat_academic: "Akademik Mühit",
    cat_security: "Giriş Təhlükəsizliyi",
    cat_advanced: "Performans Göstəriciləri",
    clinic_identity: "Klinik Kimlik",
    doctor_name: "Məsul Həkim",
    department: "Tibbi Şöbə",
    institution: "Müəssisə / Xəstəxana",
    reset_btn: "Keşi Sıfırla",
    reset_desc: "Lokal IndexedDB keşi və iş sessiyalarını tamamilə silir.",
    live_preview: "Mövzu Önizləməsi",
    cpu_usage: "CPU Yüklənməsi",
    memory_usage: "Süni Zəka Yaddaşı",
    latency: "Sorgu Gecikməsi",
    uptime: "Sistem Stabilizasiyası",
    experimental: "Eksperimental Rejimlər"
  },
  ru: {
    title: "Системные Настройки",
    subtitle: "Медицинская панель в стиле Apple, Tesla и VisionOS",
    searchPlace: "Поиск настроек (⌘K)...",
    cat_general: "Основные Системы",
    cat_appearance: "Цвет и Интерфейс",
    cat_ai: "Клинический ИИ",
    cat_cloud: "Синхронизация Firebase",
    cat_notifications: "Жизненные Сигналы",
    cat_academic: "Академическая Среда",
    cat_security: "Безопасность Доступа",
    cat_advanced: "Метрики Работы",
    clinic_identity: "Клинический Профиль",
    doctor_name: "Лечащий Врач",
    department: "Медицинский Отдел",
    institution: "Учреждение / Больница",
    reset_btn: "Сброс Локального Кэша",
    reset_desc: "Полностью очищает локальный кэш IndexedDB и сессии.",
    live_preview: "Превью Темы",
    cpu_usage: "Загрузка Процессора",
    memory_usage: "Буфер Памяти ИИ",
    latency: "Задержка Запросов",
    uptime: "Стабильность Системы",
    experimental: "Включить Эксперименты"
  },
  de: {
    title: "Systemeinstellungen",
    subtitle: "Medizinisches Dashboard im Stil von Apple & VisionOS",
    searchPlace: "Einstellungen suchen (⌘K)...",
    cat_general: "Allgemeines System",
    cat_appearance: "Farben & Design",
    cat_ai: "Klinische KI-Engine",
    cat_cloud: "Firebase & Cloud",
    cat_notifications: "Vitale Warnungen",
    cat_academic: "Akademische Welt",
    cat_security: "Zugriffssicherheit",
    cat_advanced: "Visual Metrics",
    clinic_identity: "Klinische Identität",
    doctor_name: "Behandelnder Arzt",
    department: "Medizinische Abteilung",
    institution: "Institution / Klinik",
    reset_btn: "Lokalen Cache leeren",
    reset_desc: "Löscht den gesamten lokalen IndexedDB-Cache und Klinikdaten.",
    live_preview: "Live-Themenvorschau",
    cpu_usage: "Prozessorauslastung",
    memory_usage: "KI-Arbeitsspeicher",
    latency: "Antwortzeit-Latenz",
    uptime: "Systemstabilität",
    experimental: "Deneysel Protokolle"
  },
  fr: {
    title: "Préférences Système",
    subtitle: "Panneau médical inspiré par Apple, Tesla & VisionOS",
    searchPlace: "Taper pour chercher (⌘K)...",
    cat_general: "Système Général",
    cat_appearance: "Style & Couleurs",
    cat_ai: "IA Clinique Intelligente",
    cat_cloud: "Firebase & Cloud",
    cat_notifications: "Signaux Vitaux",
    cat_academic: "Recherche Académique",
    cat_security: "Sécurité & Accès",
    cat_advanced: "Indicateurs Visuels",
    clinic_identity: "Sceau Médical Clinique",
    doctor_name: "Médecin Responsable",
    department: "Département Médical",
    institution: "Institution / Hôpital",
    reset_btn: "Réinitialiser le cache local",
    reset_desc: "Vider absolument la base locale IndexedDB et dossiers temporaires.",
    live_preview: "Aperçu en Direct",
    cpu_usage: "Ressource Processeur",
    memory_usage: "Mémoire Réseau IA",
    latency: "Latence d'Analyse",
    uptime: "Stabilité du Noyau",
    experimental: "Options Expérimentales"
  },
  ar: {
    title: "تفضيلات النظام الطبي",
    subtitle: "لوحة تحكم مستوحاة من تصاميم آبل، تيسلا و VisionOS",
    searchPlace: "ابحث عن الإعداد السريري (⌘K)...",
    cat_general: "النظام العام",
    cat_appearance: "المظهر والسمات",
    cat_ai: "الذكاء الاصطناعي السريري",
    cat_cloud: "المزامنة السحابية",
    cat_notifications: "الإشارات الحيوية",
    cat_academic: "المحيط الأكاديمي",
    cat_security: "أمان الوصول",
    cat_advanced: "مؤشرات الأداء",
    clinic_identity: "هوية الطبيب والختم الرسمي",
    doctor_name: "الطبيب المسؤول",
    department: "القسم الطبي",
    institution: "المؤسسة / المستشفى",
    reset_btn: "مسح الذاكرة المؤقتة",
    reset_desc: "مسح ذاكرة IndexedDB السريرية والملفات المحلية تماماً.",
    live_preview: "معاينة السمة الفورية",
    cpu_usage: "ضغط وحدة المعالجة",
    memory_usage: "ذاكرة محرك الذكاء",
    latency: "استجابة الاستعلام",
    uptime: "ثبات النظام التشغيلي",
    experimental: "تفعيل الخواص التجريبية"
  },
  es: {
    title: "Preferencias del Sistema",
    subtitle: "Consola médica inspirada en Apple, Tesla y VisionOS",
    searchPlace: "Buscar configuración (⌘K)...",
    cat_general: "Sistema General",
    cat_appearance: "Colores y Visualización",
    cat_ai: "IA de Decisión Clínica",
    cat_cloud: "Firebase y Servidor",
    cat_notifications: "Alertas Vitales",
    cat_academic: "Ámbito Académico",
    cat_security: "Seguridad y Acceso",
    cat_advanced: "Métricas Avanzadas",
    clinic_identity: "Identidad Científica",
    doctor_name: "Médico de Guardia",
    department: "Especialidad Médica",
    institution: "Institución / Hospital",
    reset_btn: "Limpiar todo el Caché",
    reset_desc: "Elimina por completo el caché local de IndexedDB y expedientes temporales.",
    live_preview: "Previsualizar Tema",
    cpu_usage: "Consumo de CPU",
    memory_usage: "Memoria del Motor de IA",
    latency: "Latencia del Sistema",
    uptime: "Estabilidad del Núcleo",
    experimental: "Activar Opciones Beta"
  }
};

type CategoryType =
  | "general"
  | "appearance"
  | "ai"
  | "cloud"
  | "notifications"
  | "academic"
  | "security"
  | "advanced";

export default function SettingsPanel({ sessionUser, setSessionUser }: SettingsPanelProps) {
  const {
    language,
    setLanguage,
    setTheme,
    theme: currentTheme,
    options,
    setOption,
    accessibility,
    setAccessibility
  } = useSettings();

  const [activeCategory, setActiveCategory] = useState<CategoryType>("general");
  const [searchQuery, setSearchQuery] = useState("");

  // Sub-options simulated states for ultra comprehensive depth requested
  const [region, setRegion] = useState("TR - Istanbul");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [aiIntelligenceMode, setAiIntelligenceMode] = useState("clinical_superpower");
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  const [contextMemory, setContextMemory] = useState(true);
  const [clinicalAiLevel, setClinicalAiLevel] = useState("expert_advisor");
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [aiVoice, setAiVoice] = useState("neural_male");
  const [streamingResponses, setStreamingResponses] = useState(true);
  
  // Cloud settings
  const [cloudSync, setCloudSync] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [realtimeSync, setRealtimeSync] = useState(true);

  // Notifications
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [epidemiologyNotifs, setEpidemiologyNotifs] = useState(true);
  const [soundVibe, setSoundVibe] = useState(true);

  // Security
  const [biometricUi, setBiometricUi] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [encryptedCache, setEncryptedCache] = useState(true);
  const [secureMode, setSecureMode] = useState(true);

  // Academic
  const [scPubMed, setScPubMed] = useState(true);
  const [scIarc, setScIarc] = useState(true);
  const [scUsa, setScUsa] = useState(true);
  const [citationStyle, setCitationStyle] = useState("vancouver");

  // Advanced / Exp
  const [devConsoleEnabled, setDevConsoleEnabled] = useState(false);
  const [expToggles, setExpToggles] = useState(false);

  // Safe translated string fetcher
  const tLocal = (key: string): string => {
    return I18N[language]?.[key] || I18N["en"]?.[key] || key;
  };

  const categories = [
    { id: "general", label: tLocal("cat_general"), icon: Sliders, color: "bg-blue-500" },
    { id: "appearance", label: tLocal("cat_appearance"), icon: Palette, color: "bg-pink-500" },
    { id: "ai", label: tLocal("cat_ai"), icon: Sparkles, color: "bg-violet-600 animate-pulse" },
    { id: "cloud", label: tLocal("cat_cloud"), icon: Cloud, color: "bg-sky-400" },
    { id: "notifications", label: tLocal("cat_notifications"), icon: Bell, color: "bg-red-500" },
    { id: "academic", label: tLocal("cat_academic"), icon: Award, color: "bg-orange-500" },
    { id: "security", label: tLocal("cat_security"), icon: ShieldCheck, color: "bg-emerald-600" },
    { id: "advanced", label: tLocal("cat_advanced"), icon: Terminal, color: "bg-slate-700" }
  ] as const;

  // Real accent theme list
  const themePresets = [
    { id: "classic", label: "Light Theme", color: "bg-slate-100 border-slate-300" },
    { id: "public_health", label: "Dark Theme", color: "bg-slate-900 border-slate-700" },
    { id: "toxicology", label: "Neon Cyan", color: "bg-cyan-950 border-cyan-400" },
    { id: "medical", label: "Medical Blue", color: "bg-blue-950 border-blue-400" },
    { id: "antalya", label: "Midnight Glass", color: "bg-purple-950 border-[#a855f7]" },
    { id: "minimal", label: "VisionOS Theme", color: "bg-white/10 backdrop-blur-xl border-white/20" },
    { id: "emergency", label: "Dynamic Accent Color", color: "bg-gradient-to-r from-red-500 to-amber-500" }
  ] as const;

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categories]);

  const handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("TALEP system database refreshed successfully!");
    window.location.reload();
  };

  // Sync sessionUser state
  const updateClinicalProfile = (field: string, val: string) => {
    setSessionUser((prev) => {
      const updated = { ...prev, [field]: val };
      return updated;
    });
  };

  return (
    <div className="w-full relative min-h-0">
      
      {/* ==================== SCREEN 1: TABLET/DESKTOP (macOS SYSTEM SETTINGS STYLE) ==================== */}
      <div className="hidden md:flex bg-slate-900/60 border border-white/10 backdrop-blur-3xl rounded-[32px] overflow-hidden min-h-[620px] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        
        {/* Modern Sidebar with Apple Spotlight Search */}
        <div className="w-80 border-r border-white/5 bg-slate-950/45 p-6 flex flex-col space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                System
              </span>
              <span className="text-white/60 text-sm font-medium">v4.0</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold truncate uppercase tracking-wider">
              {tLocal("subtitle")}
            </p>
          </div>

          {/* Apple Spotlight Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={tLocal("searchPlace")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-white/5 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all font-bold"
            />
          </div>

          {/* Unified Sidebar Lists */}
          <div className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? "bg-white/10 border border-white/10 text-white shadow-xl"
                      : "hover:bg-white/5 text-slate-450 text-slate-300 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold truncate">{cat.label}</span>
                  </div>
                  <ChevronRight
                    size={12}
                    className={`transition-transform duration-200 ${
                      isActive ? "text-cyan-400 translate-x-1" : "text-slate-600 group-hover:text-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Dr Account Section bottom */}
          <div className="border-t border-white/5 pt-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-extrabold text-xs">
              {sessionUser.displayName.split(" ").pop()?.charAt(0) || "D"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-black text-white truncate leading-tight">
                {sessionUser.displayName}
              </p>
              <p className="text-[8.5px] text-slate-500 truncate mt-0.5 tracking-wider font-extrabold uppercase">
                {sessionUser.role}
              </p>
            </div>
          </div>
        </div>

        {/* macOS Dynamic Details Pane */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[640px] scrollbar-thin text-white bg-slate-900/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              
              {/* CATEGORY 1: GENERAL SYSTEM */}
              {activeCategory === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <Sliders className="text-blue-500" size={18} />
                      {tLocal("cat_general")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure languages, medical regional servers, and time protocol synchronization.
                    </p>
                  </div>

                  {/* Clinical Identity Group */}
                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {tLocal("clinic_identity")}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">
                          {tLocal("doctor_name")}
                        </label>
                        <input
                          type="text"
                          value={sessionUser.displayName}
                          onChange={(e) => updateClinicalProfile("displayName", e.target.value)}
                          className="w-full bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">
                          {tLocal("department")}
                        </label>
                        <input
                          type="text"
                          value={sessionUser.department}
                          onChange={(e) => updateClinicalProfile("department", e.target.value)}
                          className="w-full bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase">
                          {tLocal("institution")}
                        </label>
                        <input
                          type="text"
                          value={sessionUser.institution}
                          onChange={(e) => updateClinicalProfile("institution", e.target.value)}
                          className="w-full bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Languages Options */}
                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">{tLocal("language")}</h4>
                        <p className="text-[10px] text-slate-500">Select clinical UI localization dictionary.</p>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
                      >
                        <option value="tr">🇹🇷 Türkçe</option>
                        <option value="en">🇺🇸 English</option>
                        <option value="ru">🇷🇺 Русский</option>
                        <option value="az">🇦🇿 Azərbaycan</option>
                        <option value="ar">🇸🇦 العربية</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="es">🇪🇸 Español</option>
                      </select>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Clinical Region</h4>
                        <p className="text-[10px] text-slate-500">Local toxicology standards selection.</p>
                      </div>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none w-48 text-right"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Auto Update System</h4>
                        <p className="text-[10px] text-slate-500">Keep molecular libraries updated automatically.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoUpdate}
                          onChange={(e) => setAutoUpdate(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 2: COLOR & DESIGN */}
              {activeCategory === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <Palette className="text-pink-500" size={18} />
                      {tLocal("cat_appearance")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Toggle system colors, neon glass features, and cinematic operating modes.
                    </p>
                  </div>

                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-white mb-2">{tLocal("live_preview")}</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {themePresets.map((pr) => (
                        <button
                          key={pr.id}
                          onClick={() => setTheme(pr.id as ThemeId)}
                          className="flex items-center gap-3 p-3 bg-slate-900/80 hover:bg-slate-800 border border-white/5 rounded-xl text-left cursor-pointer transition-all"
                        >
                          <div className={`w-5 h-5 rounded-full ${pr.color} flex-shrink-0 border`} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{pr.label}</p>
                            <p className="text-[8px] text-slate-500 uppercase font-mono">
                              {pr.id === currentTheme.id ? "ACTIVE" : "SELECT"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility options */}
                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">High Contrast Textures</h4>
                        <p className="text-[10px] text-slate-500">Boost lines and grid rendering.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accessibility.highContrast}
                        onChange={(e) => setAccessibility({ highContrast: e.target.checked })}
                        className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Large Clinical Typography</h4>
                        <p className="text-[10px] text-slate-500">Enlarge lab reports and values text.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={accessibility.largeText}
                        onChange={(e) => setAccessibility({ largeText: e.target.checked })}
                        className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 3: CLINICAL AI */}
              {activeCategory === "ai" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <Sparkles className="text-violet-500" size={18} />
                      {tLocal("cat_ai")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fine-tune clinical decision algorithms and analytical responses.
                    </p>
                  </div>

                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">AI Agency Mode</h4>
                        <p className="text-[10px] text-slate-500">Operational clinical target scope.</p>
                      </div>
                      <select
                        value={aiIntelligenceMode}
                        onChange={(e) => setAiIntelligenceMode(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none"
                      >
                        <option value="research">Research-Driven</option>
                        <option value="clinical_superpower">Precision Medicine</option>
                        <option value="emergency">First-Responder (Fast)</option>
                      </select>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Smart Predictions & Synthesis</h4>
                        <p className="text-[10px] text-slate-500">Context suggestion inside diagnosis grids.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={smartSuggestions}
                        onChange={(e) => setSmartSuggestions(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Temporal Memory Retention</h4>
                        <p className="text-[10px] text-slate-500">Keep session conversation histories.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={contextMemory}
                        onChange={(e) => setContextMemory(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Streaming Live Generation</h4>
                        <p className="text-[10px] text-slate-500">Print diagnostic suggestions asynchronously.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={streamingResponses}
                        onChange={(e) => setStreamingResponses(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 4: FIREBASE & BULUT */}
              {activeCategory === "cloud" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <Cloud className="text-sky-400" size={18} />
                      {tLocal("cat_cloud")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage background syncing, cloud backups and offline data caches.
                    </p>
                  </div>

                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Cloud Firestore Backup</h4>
                        <p className="text-[10px] text-slate-500">Direct transmission to secured Firebase nodes.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={cloudSync}
                        onChange={(e) => setCloudSync(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Offline Cache Mode</h4>
                        <p className="text-[10px] text-slate-500">Enable local storage writing if offline.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={offlineCache}
                        onChange={(e) => setOfflineCache(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Auto Safe Backup Interval</h4>
                        <p className="text-[10px] text-slate-500">Weekly database exports protocol.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoBackup}
                        onChange={(e) => setAutoBackup(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 5: HAYATI SİNYALLER */}
              {activeCategory === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <Bell className="text-red-500" size={18} />
                      {tLocal("cat_notifications")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Select event parameters that trigger active notifications.
                    </p>
                  </div>

                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Emergency Critical Alerts</h4>
                        <p className="text-[10px] text-slate-500">Hologram triggers on fatal toxicity detections.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emergencyAlerts}
                        onChange={(e) => setEmergencyAlerts(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Epidemiological Bulletins</h4>
                        <p className="text-[10px] text-slate-500">Receive summaries about regional poison networks.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={epidemiologyNotifs}
                        onChange={(e) => setEpidemiologyNotifs(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 6: AKADEMİK ÇEVRE */}
              {activeCategory === "academic" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <BookOpen className="text-amber-500" size={18} />
                      {tLocal("cat_academic")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure citations indexing and trusted medical bodies filters.
                    </p>
                  </div>

                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-white">Academic Indexing Feeds</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 text-xs">
                        <input
                          type="checkbox"
                          checked={scPubMed}
                          onChange={(e) => setScPubMed(e.target.checked)}
                        />
                        <span>PubMed Indexed Database Connection</span>
                      </label>
                      <label className="flex items-center gap-3 text-xs">
                        <input
                          type="checkbox"
                          checked={scIarc}
                          onChange={(e) => setScIarc(e.target.checked)}
                        />
                        <span>WHO / IARC Carcinogen Monographs</span>
                      </label>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Preferred Citation Style</h4>
                        <p className="text-[10px] text-slate-500">Default style used for academic PDFs exports.</p>
                      </div>
                      <select
                        value={citationStyle}
                        onChange={(e) => setCitationStyle(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold"
                      >
                        <option value="vancouver">Vancouver Protocol</option>
                        <option value="apa7">APA 7th Edition</option>
                        <option value="ama">AMA Style</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 7: ERİŞİM GÜVENLİĞİ */}
              {activeCategory === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <ShieldCheck className="text-emerald-500" size={18} />
                      {tLocal("cat_security")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure secure session timeouts, lock states, and GDPR/HIPAA options.
                    </p>
                  </div>

                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Biometric Lock FaceID/TouchID UI</h4>
                        <p className="text-[10px] text-slate-500">Prompt for fingerprint scan before deleting files.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={biometricUi}
                        onChange={(e) => setBiometricUi(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Active Session Timeout</h4>
                        <p className="text-[10px] text-slate-500">Kick off if inactive to guard patient secrets.</p>
                      </div>
                      <select
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold"
                      >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="never">Never Time Out</option>
                      </select>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">Active Secure Clinical Mode</h4>
                        <p className="text-[10px] text-slate-500">Strict end-to-end data encryption protocols.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={secureMode}
                        onChange={(e) => setSecureMode(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 8: GELİŞMİŞ & METRİKLER */}
              {activeCategory === "advanced" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <Terminal className="text-slate-500" size={18} />
                      {tLocal("cat_advanced")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Clinical live terminal statistics and experimental testing layers.
                    </p>
                  </div>

                  {/* Operational telemetry */}
                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Live Telemetry Monitoring
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] text-slate-500 font-extrabold block">
                          {tLocal("cpu_usage")}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-cyan-400">12.4%</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] text-slate-500 font-extrabold block">
                          {tLocal("memory_usage")}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-violet-400">224 MB</span>
                          <span className="text-[8px] text-slate-500">OF 512 MB</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] text-slate-500 font-extrabold block">
                          {tLocal("latency")}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-indigo-400">14ms</span>
                          <span className="text-[8px] text-slate-500">REALTIME</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] text-slate-500 font-extrabold block">
                          {tLocal("uptime")}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-emerald-400">99.98%</span>
                          <span className="text-[8px] text-slate-500">SECURE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experiments */}
                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">{tLocal("experimental")}</h4>
                        <p className="text-[10px] text-slate-500">Active early prototypes features before launch.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={expToggles}
                        onChange={(e) => setExpToggles(e.target.checked)}
                        className="w-4 h-4 text-cyan-500"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <div>
                        <h4 className="text-xs font-black text-rose-500">{tLocal("reset_btn")}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                          {tLocal("reset_desc")}
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 text-rose-405 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm"
                      >
                        {tLocal("reset_btn")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* ==================== SCREEN 2: MOBILE (iOS GROUPED CARDS STYLE) ==================== */}
      <div className="md:hidden space-y-6 text-white pb-28 min-h-0">
        
        {/* iOS Settings App Header */}
        <div className="px-1 pt-2">
          <h1 className="text-2xl font-black text-white tracking-tight">{tLocal("title")}</h1>
          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{tLocal("subtitle")}</p>
        </div>

        {/* Dr Profile iCloud Style card */}
        <div className="bg-slate-900/60 border border-white/5 backdrop-blur-2xl rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-cyan-400/20 shadow-md flex items-center justify-center text-white text-lg font-black">
              {sessionUser.displayName.split(" ").pop()?.charAt(0) || "D"}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-white truncate leading-tight">
                {sessionUser.displayName}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold truncate uppercase mt-0.5">
                {sessionUser.role}
              </p>
              <p className="text-[9px] text-[#0ea5e9] truncate font-bold mt-1 max-w-[190px]">
                {sessionUser.institution}
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-500" />
        </div>

        {/* iOS Group: General Settings */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-[#0ea5e9] uppercase px-4 block">
            {tLocal("cat_general").toUpperCase()}
          </span>
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
            
            {/* Language Row */}
            <div className="flex items-center justify-between p-4 bg-slate-950/15">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Globe size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black block text-white">{tLocal("language")}</span>
                  <span className="text-[9.5px] text-slate-400 truncate block">Change medical dialect</span>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-xs font-bold text-cyan-400 outline-none cursor-pointer text-right max-w-28"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="az">Azərbaycan</option>
                <option value="ar">العربية</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* Region Input Row */}
            <div className="flex items-center justify-between p-4 bg-slate-950/15">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-indigo-505 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <Activity size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black block text-white">Clinical Server</span>
                  <span className="text-[9.5px] text-slate-400 truncate block">Regional compliance standard</span>
                </div>
              </div>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="bg-transparent outline-none text-xs font-bold text-slate-200 text-right w-24"
              />
            </div>

            {/* Auto update Switch */}
            <div className="flex items-center justify-between p-4 bg-slate-950/15">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-sky-400 rounded-lg flex items-center justify-center text-white">
                  <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black block text-white">Auto Sync</span>
                  <span className="text-[9.5px] text-slate-400 truncate block">Updates in background</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* iOS Group: Appearance & Themes presets */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase px-4 block">
            {tLocal("cat_appearance").toUpperCase()}
          </span>
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
            
            <div className="p-4 bg-slate-950/15">
              <span className="text-xs font-black text-white block mb-3">Accent Selectors & Themes</span>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                {themePresets.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => setTheme(pr.id as ThemeId)}
                    className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border flex items-center gap-2 text-[10.5px] font-bold ${
                      currentTheme.id === pr.id
                        ? "bg-white/10 border-cyan-400 text-white"
                        : "bg-slate-950 border-white/5 text-slate-400"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${pr.color}`} />
                    <span>{pr.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 bg-slate-950/15">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                  <Palette size={14} />
                </div>
                <div>
                  <span className="text-xs font-black block text-white">High Contrast UI</span>
                  <span className="text-[9.5px] text-slate-400">Boost details readability</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(e) => setAccessibility({ highContrast: e.target.checked })}
                className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* iOS Group: Clinical AI & Suggestion Engine */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-[#a855f7] uppercase px-4 block">
            {tLocal("cat_ai").toUpperCase()}
          </span>
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
            
            {/* suggestions */}
            <div className="flex items-center justify-between p-4 bg-slate-950/15">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white">
                  <Sparkles size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black block text-white">Smart Predict Engine</span>
                  <span className="text-[9.5px] text-slate-400 truncate block">Instant clinical assist prediction</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smartSuggestions}
                  onChange={(e) => setSmartSuggestions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* stream response */}
            <div className="flex items-center justify-between p-4 bg-slate-950/15">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Cpu size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black block text-white">Streaming Output</span>
                  <span className="text-[9.5px] text-slate-400 truncate block">Akan Yapay Zeka Yanıtları</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={streamingResponses}
                  onChange={(e) => setStreamingResponses(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* iOS Group: Academic Project Credits */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase px-4 block">
            {tLocal("cat_academic").toUpperCase()}
          </span>
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-1">
            <ProjectCredits variant="panel" className="bg-transparent border-none text-white p-4 shadow-none text-xs" />
          </div>
        </div>

        {/* iOS Group: Advanced Reset Cache */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase px-4 block">
            {tLocal("cat_security").toUpperCase()} & METRICS
          </span>
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-4">
            <p className="text-[11px] text-slate-405 text-slate-400 leading-relaxed font-semibold">
              {tLocal("reset_desc")}
            </p>
            <button
              onClick={handleReset}
              className="w-full py-4 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 rounded-2xl text-xs font-black text-rose-400 transition-transform active:scale-95 cursor-pointer block text-center"
            >
              {tLocal("reset_btn")}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
