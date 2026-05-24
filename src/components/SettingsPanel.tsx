import React, { useState, useMemo } from "react";
import { 
  Sliders, 
  Palette, 
  Sparkles, 
  Search, 
  Check, 
  RotateCcw,
  Languages,
  Eye,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Save,
  Bell,
  HardDrive
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { ThemeId, themes } from "../themes/themes";
import { Language } from "../i18n/translations";
import { MsdsPremiumBanner } from "./MsdsPremiumBanner";
import { motion, AnimatePresence } from "motion/react";

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

type SettingCategory = "general" | "accessibility" | "appearance" | "clinical_ai" | "security" | "preferences";

export default function SettingsPanel({ sessionUser, setSessionUser }: SettingsPanelProps) {
  const {
    language,
    setLanguage,
    setTheme,
    theme: activeTheme,
    accessibility,
    setAccessibility,
    options,
    setOption,
    showToast
  } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingCategory>("general");
  const [currMobileTab, setCurrMobileTab] = useState<SettingCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);

  const categories = [
    { id: "general", label: "Genel Sistem / Kimlik", icon: Sliders, gradient: "from-blue-500 to-sky-450" },
    { id: "accessibility", label: "Erişilebilirlik", icon: Eye, gradient: "from-amber-500 to-orange-450" },
    { id: "appearance", label: "Görünüm & Temalar", icon: Palette, gradient: "from-pink-500 to-rose-455" },
    { id: "clinical_ai", label: "Akademik Klinik AI", icon: Sparkles, gradient: "from-violet-500 to-purple-455" },
    { id: "security", label: "Veri Emniyeti & KVKK", icon: ShieldCheck, gradient: "from-emerald-505 to-teal-455" },
    { id: "preferences", label: "Gelişmiş Tercihler", icon: UserCog, gradient: "from-indigo-500 to-blue-500" }
  ] as const;

  // Search filter
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const activeLangObj = useMemo(() => {
    return [
      { id: "tr", name: "Türkçe", flag: "🇹🇷" },
      { id: "en", name: "English", flag: "🇬🇧" },
      { id: "ru", name: "Русский", flag: "🇷🇺" },
      { id: "az", name: "Azərbaycanca", flag: "🇦🇿" },
      { id: "ar", name: "العربية", flag: "🇸🇦" },
      { id: "de", name: "Deutsch", flag: "🇩🇪" },
      { id: "fr", name: "Français", flag: "🇫🇷" },
      { id: "es", name: "Español", flag: "🇪🇸" }
    ].find(l => l.id === language) || { id: "tr", name: "Türkçe", flag: "🇹🇷" };
  }, [language]);

  const handleResetCachedDB = () => {
    localStorage.clear();
    sessionStorage.clear();
    showToast("Sistem veri tabanı ve önbellek başarıyla temizlendi, yeniden başlatılıyor...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const currentThemeId = activeTheme.id;

  // Reusable sub-view panel renderer
  const renderContentPane = (tabId: SettingCategory) => {
    switch (tabId) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1 text-slate-900 dark:text-white">Klinik Kimlik & Sertifikasyon</h3>
              <p className="text-xs text-slate-400">Sistem raporlarında ve çıkış belgelerinde gösterilen resmi mühür ve hekim parametreleri.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-405 text-slate-450 dark:text-slate-400 block font-mono">Hekim Adı Soyadı</label>
                <input 
                  type="text"
                  value={sessionUser.displayName}
                  onChange={(e) => setSessionUser(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3.5 py-3 h-11 bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400 block font-mono">Uzmanlık Rolü</label>
                <input 
                  type="text"
                  value={sessionUser.role}
                  onChange={(e) => setSessionUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3.5 py-3 h-11 bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400 block font-mono">Kurum / Hastane</label>
                <input 
                  type="text"
                  value={sessionUser.institution}
                  onChange={(e) => setSessionUser(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-3.5 py-3 h-11 bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400 block font-mono">Tıbbi Birim</label>
                <input 
                  type="text"
                  value={sessionUser.department}
                  onChange={(e) => setSessionUser(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3.5 py-3 h-11 bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Language Selector with Dropdown (clicking reveals choices) */}
            <div className="border-t border-slate-100 dark:border-white/5 pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Languages size={15} className="text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dil Seçimi (Language Schemes)</h4>
              </div>
              <p className="text-xs text-slate-405 dark:text-slate-400">
                Uygulama dilini seçin. Türkçe varsayılandır, tıklayarak dilediğiniz dili anında aktif edebilirsiniz.
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="w-full sm:w-72 px-4 py-3 bg-white/50 backdrop-blur-md dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[1.25rem] text-[13px] font-black text-slate-800 dark:text-white flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-white/5 hover:border-blue-500/30 transition-all shadow-sm group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl leading-none origin-center group-hover:scale-110 transition-transform">{activeLangObj.flag}</span>
                    <span className="tracking-tight">{activeLangObj.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-black tracking-widest uppercase shadow-sm">AKTİF</span>
                    <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? "rotate-90" : ""}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div 
                       initial={{ opacity: 0, height: 0, marginTop: 0 }}
                       animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                       exit={{ opacity: 0, height: 0, marginTop: 0 }}
                       className="overflow-hidden w-full sm:w-72"
                    >
                      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.25rem] shadow-xl divide-y divide-slate-100/80 dark:divide-white/5 overflow-y-auto max-h-[300px] custom-scrollbar">
                        {[
                          { id: "tr", name: "Türkçe", flag: "🇹🇷" },
                          { id: "en", name: "English", flag: "🇬🇧" },
                          { id: "ru", name: "Русский", flag: "🇷🇺" },
                          { id: "az", name: "Azərbaycanca", flag: "🇦🇿" },
                          { id: "ar", name: "العربية", flag: "🇸🇦" },
                          { id: "de", name: "Deutsch", flag: "🇩🇪" },
                          { id: "fr", name: "Français", flag: "🇫🇷" },
                          { id: "es", name: "Español", flag: "🇪🇸" }
                        ].map(lang => (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => {
                              setLanguage(lang.id as Language);
                              setTimeout(() => setIsLangOpen(false), 200);
                            }}
                            className={`w-full text-left px-4 py-3.5 text-[14px] font-bold transition-all flex items-center justify-between cursor-pointer group ${
                              language === lang.id
                                ? "bg-blue-500/5 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-[inset_2px_0_0_#3b82f6]"
                                : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/5"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="text-xl leading-none scale-95 group-hover:scale-110 transition-transform">{lang.flag}</span>
                              <span className={language === lang.id ? "tracking-tight" : "font-medium"}>{lang.name}</span>
                            </span>
                            {language === lang.id && <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <MsdsPremiumBanner className="mt-4" />
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1 text-slate-900 dark:text-white">Gelişmiş Erişilebilirlik & Yardımcılar</h3>
              <p className="text-xs text-slate-400">Daha rahat, berrak, az yorucu ve yüksek kontrastlı bir tıbbi operasyon alanı yapılandırın.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/10 pt-4">
              {/* Büyük Metin */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Büyük Metin</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Okumayı kolaylaştırmak için yazıları büyütür.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.largeText}
                  onChange={(e) => setAccessibility({ largeText: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>

              {/* Kalın Metin (boldText) */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Kalın Metin</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Konturları artırarak metinleri belirgin kılar.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.boldText}
                  onChange={(e) => setAccessibility({ boldText: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>

              {/* Hareketi Azalt */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Hareketi Azalt</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Tüm sayfa geçiş ve hover animasyonlarını durdurur.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.reducedMotion}
                  onChange={(e) => setAccessibility({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>

              {/* Yüksek Kontrast */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Yüksek Kontrast</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Zeminler arası renk ve ton ayrımını maksimize eder.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => setAccessibility({ highContrast: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>

              {/* Şeffaflık Azalt */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Şeffaflığı Azalt</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Göz yoran derin cam (acrylic/blur) yansımalarını kapatır.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.reducedTransparency || false}
                  onChange={(e) => setAccessibility({ reducedTransparency: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>

              {/* Kompakt Mod */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Kompakt Mod</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Tüm boşluk ve dolguları sıkar, ekrana daha çok veri sığdırır.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.compactMode || false}
                  onChange={(e) => setAccessibility({ compactMode: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>

              {/* Sistem Temasını Kullan */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Sistem Temasını Kullan</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Cihazın açık/koyu mod ayarlarını otomatik olarak eşleştirir.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={accessibility.useSystemTheme || false}
                  onChange={(e) => setAccessibility({ useSystemTheme: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                />
              </div>
            </div>

            {/* Density Selector */}
            <div className="border-t border-slate-100 dark:border-white/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Kart Yoğunluğu Sürveyansı</span>
                <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200/45 dark:border-white/10">
                  {["low", "normal", "high"].map((dens) => (
                    <button
                      key={dens}
                      onClick={() => setAccessibility({ cardDensity: dens as any })}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                        accessibility.cardDensity === dens
                          ? "bg-blue-600 dark:bg-cyan-500/20 text-white dark:text-cyan-350 shadow-md"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {dens === "low" ? "Geniş" : dens === "normal" ? "Normal" : "Sıkışık"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Animasyon Kalite Düzeyi</span>
                <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200/45 dark:border-white/10">
                  {["low", "normal", "high"].map((qual) => (
                    <button
                      key={qual}
                      onClick={() => setAccessibility({ animationQuality: qual as any })}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                        accessibility.animationQuality === qual
                          ? "bg-blue-600 dark:bg-cyan-500/20 text-white dark:text-cyan-350 shadow-md"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {qual === "low" ? "Güç Tasarrufu" : qual === "normal" ? "Standart" : "Yüksek Kare"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1 text-slate-900 dark:text-white">Premium Tema & Görünüm Kataloğu</h3>
              <p className="text-xs text-slate-400">Tek tıkla, sayfa yenilemeden değişen 7 özel tasarlanmış akademik klinik renk şeması (Ana Tema Beyaz).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-slate-100 dark:border-white/10 pt-4">
              {[
                { id: "ivory", name: "Ivory Clinical (Açık Beyaz)", type: "Light Theme", desc: "Zarif, pürüzsüz, Apple Health tasarımlı tıbbi beyaz arayüz." },
                { id: "graphite", name: "Graphite Government (Gri)", type: "Light Theme", desc: "Klasik, resmi ve diplomatik kurumsal gri ve yeşil kamu tonları." },
                { id: "obsidian", name: "Obsidian Core (Siyah)", type: "Dark Theme", desc: "Kömür karası asistan tonlarıyla saf akılcı yapay zeka deneyimi." },
                { id: "navy", name: "Navy Intelligence (Lacivert)", type: "Dark Theme", desc: "Akademik derin analiz odaları için koyu asil derin lacivert tonlar." },
                { id: "crimson", name: "Crimson Emergency (Kırmızı)", type: "Dark Theme", desc: "Kırmızı tonları taşıyan acil servis ve yüksek kontrast acil tıp teması." },
                { id: "emerald", name: "Emerald Toxicology (Yeşil)", type: "Dark Theme", desc: "Kimyasal maruziyet ve toksikolojik laboratuvar alarm tonları." },
                { id: "sapphire", name: "Sapphire Medical (Mavi)", type: "Dark Theme", desc: "Güven verici ve temiz tıbbi derin safir mavisi medikal tasarımı." }
              ].map(th => {
                const isActive = currentThemeId === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id as ThemeId)}
                    className={`group text-left p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between h-42 ${
                      isActive 
                        ? "bg-slate-50 dark:bg-cyan-500/10 border-blue-600 dark:border-cyan-400/50 shadow-lg shadow-cyan-950/10" 
                        : "bg-slate-50/40 dark:bg-[#070b14] border-slate-200/80 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-black uppercase tracking-tight">
                          {th.type}
                        </span>
                        {isActive && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />}
                      </div>
                      <h4 className="text-xs font-black mt-2 text-slate-900 dark:text-white group-hover:text-blue-605 dark:group-hover:text-cyan-400 transition-colors">
                        {th.name}
                      </h4>
                      <p className="text-[9px] text-slate-405 dark:text-slate-400 leading-normal mt-1 border-t border-dashed border-slate-200 dark:border-white/5 pt-1">
                        {th.desc}
                      </p>
                    </div>

                    {/* Accent Color indicators */}
                    <div className="flex gap-1.5 items-center mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: themes[th.id as ThemeId]?.primary }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: themes[th.id as ThemeId]?.secondary }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: themes[th.id as ThemeId]?.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "clinical_ai":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1 text-slate-900 dark:text-white">TALEP Klinik Bilimsel Muhakeme Ayarları</h3>
              <p className="text-xs text-slate-400">Yapay Zeka karar destek katmanlarının öncelik, duyarlılık ve metodolojisini ayarlayın.</p>
            </div>

            <div className="border-t border-slate-100 dark:border-white/10 pt-4 space-y-4">
              <div className="p-4 bg-violet-500/[0.04] border border-violet-500/10 rounded-2xl flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-violet-600/10 text-violet-505">
                  <Sparkles size={16} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Sorumlu Sürveyans Rehberi</span>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Klinik Yapay Zeka botumuz, Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Bölümü, Prof. Dr. Vugar Ali Türksoy rehberliğinde oluşturulmuş akademik algoritmaları esas alır.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Muhakeme Seviyesi</label>
                  <select 
                    value={options.reportType}
                    onChange={(e) => setOption("reportType", e.target.value as any)}
                    className="w-full px-3.5 h-11 bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500"
                  >
                    <option value="short">Hızlı Triage Analizi</option>
                    <option value="standard">Kapsamlı Semptom & Sektör Eşleşmesi</option>
                    <option value="detailed">Akademik Literatür & Tez Çıktısı</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Duyarlılık Eşiği (Alarm Sensitivity)</label>
                  <select 
                    value={options.alertSensitivity}
                    onChange={(e) => setOption("alertSensitivity", e.target.value as any)}
                    className="w-full px-3.5 h-11 bg-slate-50 dark:bg-[#040812] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-cyan-500"
                  >
                    <option value="low">Düşük (Sadece kritik zehirlenmelerde uyar)</option>
                    <option value="normal">Normal (Kombine sendromik uyarılar)</option>
                    <option value="high">Yüksek (Hafif subklinik maruziyet kuşkuları)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1 text-slate-900 dark:text-white">Veri Emniyeti, Maskeleme & KVKK</h3>
              <p className="text-xs text-slate-400">Veri tabanı güvenliği, şifreli lokal önbellek ve hasta hakları gizlilik protokolleri.</p>
            </div>

            <div className="border-t border-slate-100 dark:border-white/10 pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">Hasta Adını Maskele</span>
                    <span className="text-[10px] text-slate-405 dark:text-slate-400 block">KVKK gereğince PDF ve ekrandaki verileri "Ahmet Y." formatında anonimleştirir.</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={options.hidePatientName}
                    onChange={(e) => setOption("hidePatientName", e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">KVKK Bilgilendirmesini Rapora Ekle</span>
                    <span className="text-[10px] text-slate-405 dark:text-slate-400 block">Tüm rapor çıktılarının altına yasal KVKK koruma cümleleri basar.</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={options.includeKvkkNote}
                    onChange={(e) => setOption("includeKvkkNote", e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#0e1629]/50 border border-cyan-500/10 rounded-xl">
                  <div className="space-y-0.5 max-w-[85%]">
                    <span className="text-xs font-semibold text-cyan-400 block">Sorumluluk Şerhi & Onamı</span>
                    <span className="text-[9px] text-slate-300 block leading-normal pt-0.5">
                      TALEP akıllı klinik karar destek sistemidir. Raporlarda ve çıktılarda hekimin nihai teşhis ve sorumluluğu yasal olarak hatırlatılacaktır.
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={options.includeClinicalWarning}
                    onChange={(e) => setOption("includeClinicalWarning", e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-400 accent-cyan-405 scale-110 shrink-0"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl flex gap-3.5 items-start">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Lock size={15} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Standardized Secure Database</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Tüm vaka dosyalarınız ve kromatografik biyobelirteçleriniz tarayıcınızın güvenli lokal indeksli IndexedDB katmanında şifreli olarak barındırılır. Sunucu tarafına hiçbir hassas hasta adı veya T.C. Kimlik verisi gönderilmemektedir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1 text-slate-900 dark:text-white">Gelişmiş Sistem Tercihleri</h3>
              <p className="text-xs text-slate-400">Bildirimler, veri saklama koşulları, öneri motoru ve mahremiyet gibi uygulamanın diğer çalışma prensipleri.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/10 pt-4">
              {/* Sistem Bildirimleri */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><Bell size={14} className="text-indigo-500" /> Sistem Bildirimleri</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block leading-normal pt-1">
                    Maruziyet raporu tamamlandığında bildirim panellerini uyarır.
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={options.notifications}
                  onChange={(e) => setOption("notifications", e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110 shrink-0"
                />
              </div>

              {/* Akıllı Öneri Motoru */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><Sparkles size={14} className="text-cyan-500" /> Yapay Zeka Önerileri</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block leading-normal pt-1">
                    Girdiğiniz tanı ve laboratuvar değerlerine proaktif çözümler önerir.
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={options.suggestionEngine}
                  onChange={(e) => setOption("suggestionEngine", e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110 shrink-0"
                />
              </div>

              {/* Yerel Depolamada Tut */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><HardDrive size={14} className="text-emerald-500" /> Kalıcı Yerel Veri (LocalData)</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block leading-normal pt-1">
                    Ziyaretler arasındaki tüm ayarları makinenizde hatırlar.
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={options.storeLocalData}
                  onChange={(e) => setOption("storeLocalData", e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110 shrink-0"
                />
              </div>

              {/* Hasta Mahremiyeti Modu */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-[#070b14]/40 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <div className="space-y-0.5 max-w-[80%]">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2"><ShieldCheck size={14} className="text-rose-500" /> İsmi Maskele (Hipotez)</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-400 block leading-normal pt-1">
                    Tüm klinik ekranlarda hasta ismi yerine "***" yer tutucusu kullan.
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={options.hidePatientName}
                  onChange={(e) => setOption("hidePatientName", e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 scale-110 shrink-0"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full font-sans antialiased text-slate-850 dark:text-slate-100 max-w-6xl mx-auto space-y-6">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 border border-white/5 rounded-3xl gap-4 shadow-xl shadow-slate-900/10 relative overflow-hidden">
        {/* Soft layout background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-sky-500/15 text-cyan-450 text-cyan-400 border border-cyan-400/20 px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase font-mono">
              YÖNETİM KONSOLU
            </span>
            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-400/20 px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase font-mono">
              PREMIUM CDSS OS
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Sistem Tercihleri</h2>
          <p className="text-xs text-slate-400 font-medium">
            Sistem parametrelerini, dil şemalarını, erişilebilirlik yardımcılarını ve hekim kimliğinizi yapılandırın.
          </p>
        </div>

        <button 
          type="button"
          onClick={handleResetCachedDB}
          className="relative z-10 flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <RotateCcw size={13} />
          Önbelleği Sıfırla
        </button>
      </div>

      {/* DESKTOP LAYOUT (>= md) */}
      <div className="hidden md:flex gap-6 items-stretch min-h-[520px]">
        {/* Sidebar categories pane */}
        <div className="w-64 shrink-0 flex flex-col space-y-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Ayarlarda hızlı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-white/5 rounded-2xl text-xs outline-none focus:border-cyan-550 focus:border-cyan-500 transition-all font-bold placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 p-2.5 rounded-2xl flex flex-col space-y-1.5 backdrop-blur-xl">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full text-left px-3.5 py-3.5 rounded-[14px] text-[13px] font-bold transition-all relative flex items-center gap-3.5 cursor-pointer ${
                    isSelected 
                      ? "bg-white dark:bg-[#18181b] text-slate-800 dark:text-white border border-slate-200/80 dark:border-[#27272a] shadow-[0_4px_15px_rgb(0,0,0,0.05)] dark:shadow-[0_4px_15px_rgba(6,182,212,0.1)]" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800 border border-transparent hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-cyan-500 rounded-l-[14px]" />
                  )}
                  <div className={`p-1.5 rounded-[10px] ${isSelected ? "text-blue-500 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-500/10" : "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800"}`}>
                    <Icon size={16} />
                  </div>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="bg-slate-50/50 dark:bg-[#070b14]/60 p-4 border border-slate-250/20 dark:border-white/5 rounded-2xl text-[10px] space-y-1.5 text-slate-500 dark:text-slate-400">
            <span className="font-black text-slate-705 dark:text-slate-300 block border-b border-dashed border-slate-200 dark:border-white/5 pb-1 uppercase tracking-tight">Klinik Sunucu Durumu</span>
            <div className="flex justify-between font-mono">
              <span>Grup Karsinojen:</span>
              <span className="text-emerald-500 font-black">IARC OK</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Sinyal Gecikmesi:</span>
              <span className="text-cyan-400 font-black">9 MS</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Geliştirme:</span>
              <span className="text-blue-500 dark:text-cyan-300 font-black">ŞEHMUS AYKUT</span>
            </div>
          </div>
        </div>

        {/* Desktop Details pane */}
        <div className="flex-1 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-white/5 p-8 rounded-[32px] shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            {renderContentPane(activeTab)}
          </div>
        </div>
      </div>

      {/* MOBILE PREMIUM NATIVE CONTAINER (< md) */}
      <div className="md:hidden flex flex-col space-y-4">
        {currMobileTab === null ? (
          /* Categories View List - Apple Style */
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Ayarlarda hızlı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-white/5 rounded-2xl text-xs outline-none focus:border-cyan-550 focus:border-cyan-500 transition-all font-bold placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-white"
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="bg-white/80 dark:bg-[#0c101d]/65 backdrop-blur-2xl border border-slate-200/50 dark:border-white/5 p-3 rounded-3xl shrink-0 flex flex-col space-y-1.5 shadow-xl">
              <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-black tracking-widest uppercase block px-2.5 pb-1 pt-0.5">TERCİH KATALOGLARI</span>
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCurrMobileTab(cat.id);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left p-3.5 bg-slate-50/50 dark:bg-[#040812]/40 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl border border-slate-205/30 dark:border-white/5 text-xs font-black text-slate-800 dark:text-white flex items-center justify-between cursor-pointer transition-all active:scale-[0.985]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-400">
                        <Icon size={16} />
                      </div>
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50/50 dark:bg-[#070b14]/60 p-4 border border-slate-250/20 dark:border-white/5 rounded-2xl text-[10px] space-y-1.5 text-slate-500 dark:text-slate-400 shadow-sm">
              <span className="font-black text-slate-705 dark:text-slate-300 block border-b border-dashed border-slate-200 dark:border-white/5 pb-1 uppercase tracking-tight">Klinik Sunucu Durumu</span>
              <div className="flex justify-between font-mono">
                <span>Grup Karsinojen:</span>
                <span className="text-emerald-500 font-black">IARC OK</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Sinyal Gecikmesi:</span>
                <span className="text-cyan-400 font-black">9 MS</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Geliştirme:</span>
                <span className="text-blue-500 dark:text-cyan-300 font-black">ŞEHMUS AYKUT</span>
              </div>
            </div>
          </div>
        ) : (
          /* Sub-panel Details View on Mobile */
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setCurrMobileTab(null);
                setIsLangOpen(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-250 dark:border-white/10 text-slate-800 dark:text-white rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
            >
              <ChevronLeft size={14} />
              Geri (Ayarlar Menüsü)
            </button>

            <div className="bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-white/5 p-6 rounded-[28px] shadow-sm">
              <span className="text-[10px] text-cyan-500 dark:text-cyan-450 font-mono font-black tracking-widest uppercase block mb-3 pl-1">
                {categories.find(c => c.id === currMobileTab)?.label}
              </span>
              {renderContentPane(currMobileTab)}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
