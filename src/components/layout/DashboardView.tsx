import React from "react";
import { 
  Users, 
  Activity, 
  Building, 
  Sparkles, 
  Database, 
  Heart, 
  CheckCircle, 
  ShieldAlert, 
  Play,
  Award,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import { useSettings } from "../../context/SettingsContext";
import { MsdsPremiumBanner } from "../MsdsPremiumBanner";

interface Patient {
  id: string;
  name: string;
  age: number;
  substance: string;
  location: string;
  risk: "Hafif" | "Orta" | "Kritik";
  status: string;
  date: string;
}

interface DashboardViewProps {
  patients: Patient[];
  onAddPatient: (e: React.FormEvent) => void;
  onDeletePatient: (id: string) => void;
  newPatient: { name: string; age: string; substance: string; location: string; risk: "Hafif" | "Orta" | "Kritik" };
  setNewPatient: (patient: any) => void;
  chemicalsCount: number;
}

export default function DashboardView({
  patients,
  onAddPatient,
  onDeletePatient,
  newPatient,
  setNewPatient,
  chemicalsCount
}: DashboardViewProps) {
  const { theme, t } = useSettings();
  const isDarkTheme = theme.isDark;

  // Card & Text Styles based on theme mode
  const cardClass = `${theme.cardBg} border backdrop-blur-2xl rounded-[28px] p-8 relative overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]`;

  const textClass = isDarkTheme ? "text-slate-100" : "text-slate-800";
  const mutedTextClass = isDarkTheme ? "text-slate-400" : "text-slate-500 font-medium";
  const titleColor = isDarkTheme ? "text-white" : "text-[#0f172a] font-extrabold";
  const bannerClass = isDarkTheme
    ? "relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-[#09090b] p-8 sm:p-10 shadow-2xl group"
    : "relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group";

  return (
    <div className="space-y-10 min-w-0 w-full break-words">
      
      {/* ADVANCED INTEGRATED CLINICAL INTELLIGENCE COCKPIT (HERO) */}
      <div className={bannerClass}>
        {/* Soft decorative visual cues */}
        {isDarkTheme ? (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-[380px] h-[380px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-cyan-900/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[10%] w-[320px] h-[320px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-blue-900/5 to-transparent rounded-full blur-[90px] pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-[380px] h-[380px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50/20 to-transparent rounded-full blur-[85px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[10%] w-[320px] h-[320px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-100/40 via-slate-50/20 to-transparent rounded-full blur-[90px] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-stretch gap-10">
          {/* Main Branding & Intel Context */}
          <div className="space-y-5 max-w-3xl flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2.5 border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isDarkTheme 
                  ? "bg-cyan-950/30 border-cyan-800/50 text-cyan-300"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <Sparkles size={12} className={`${isDarkTheme ? "text-cyan-400" : "text-blue-500"}`} /> 
                {t("active_system")} • TOKSİKOLOJİK SÜRVEYANS v4.0.2
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] ${
                isDarkTheme 
                  ? "text-white"
                  : "text-slate-900"
              }`}>
                Dashboard &amp; <br className="hidden sm:block" />Sürveyans Kontrol Merkezi
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-medium ${isDarkTheme ? "text-slate-400" : "text-slate-500"}`}>
                TALEP v4.0 Premium, mesleki ve çevresel toksikolojik riskleri erken aşamada saptamak, klinisyenlere bilimsel karar desteği sağlamak ve epidemiyolojik patern analizi sunmak amacıyla kurgulanmıştır.
              </p>
            </div>

            {/* Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/50 dark:border-white/5 mt-4">
              {[
                { label: "SİSTEM HIZI", val: "12ms", ext: "GÜVENLİ", color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
                { label: "BİLİMSEL İNDEKS", val: "25k+", ext: "PUBMED", color: "text-slate-900 dark:text-white", dot: "bg-slate-400" },
                { label: "AKADEMİK UYUM", val: "100%", ext: "MED-QA", color: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
                { label: "COĞRAFİ TAKİP", val: "AKTİF", ext: "SÜRVEYANS", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500 animate-pulse" }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${isDarkTheme ? "bg-slate-900/30 border-white/5" : "bg-slate-50/50 border-slate-100"}`}>
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${mutedTextClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                    {stat.label}
                  </div>
                  <div className={`text-xl font-black mt-2 tracking-tight flex items-baseline gap-1.5 ${stat.color}`}>
                    {stat.val} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.ext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Logo / Institution Header */}
          <div className="w-full xl:w-96 flex flex-col justify-between gap-5">
            <div className={`border rounded-[28px] p-8 relative overflow-hidden flex flex-col justify-between h-full transition-all duration-300 ${
              isDarkTheme ? "bg-[#18181b] border-[#27272a] shadow-lg" : "bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            }`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkTheme ? "text-cyan-500" : "text-blue-600"}`}>
                    KURUM BİLGİSİ
                  </span>
                  <div className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className={`text-sm font-bold leading-relaxed ${textClass}`}>
                    Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Anabilim Dalı koruyucu sağlık sürveyansı devrededir.
                  </p>
                  <div className="text-[11px] leading-relaxed opacity-80 pt-2 border-t border-black/5 dark:border-white/5 text-slate-500 dark:text-slate-400 font-medium">
                    <strong className={`${isDarkTheme ? "text-slate-300" : "text-slate-700"} block mb-1`}>KVKK DEMO MODU AKTİF</strong>
                    Klinik veriler simüle edilmiş olup sunum sırasında izleme korumalı demo modu ile çalışmaktadır.
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-6">
                <p className="text-[10px] text-slate-400 font-mono font-medium tracking-wide">
                  SANS-ID: TALEP-CDSS-PREMIUM-2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE VALUE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <motion.div 
          whileHover={{ y: -6 }}
          className={`${cardClass} border-t-4 border-t-transparent hover:border-t-red-500 transition-colors`}
        >
          <span className="text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            ACİL TAKİP VAKALARI
          </span>
          <p className={`text-5xl font-black mt-6 tracking-tight ${titleColor}`}>
            {patients.length} <span className="text-sm font-bold text-slate-400">Hasta</span>
          </p>
          <p className="text-[12px] text-slate-500 mt-3 flex items-center gap-2 font-medium">
            <Heart size={14} className="text-rose-500 fill-rose-500/20" /> 
            Aktif İzlem & Antidot Tedavileri
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -6 }}
          className={`${cardClass} border-t-4 border-t-transparent hover:border-t-blue-500 transition-colors`}
        >
          <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            KAYITLI ETKEN MADDE
          </span>
          <p className={`text-5xl font-black mt-6 tracking-tight ${titleColor}`}>
            {chemicalsCount} <span className="text-sm font-bold text-slate-400">Molekül</span>
          </p>
          <p className="text-[12px] text-slate-500 mt-3 flex items-center gap-2 font-medium">
            <Database size={14} className="text-blue-500" /> 
            CAS Rehberi & Akut-Kronik Semptomlar
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -6 }}
          className={`${cardClass} border-t-4 border-t-transparent hover:border-t-emerald-500 transition-colors`}
        >
          <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            KARAR GÜCÜ VE SİSTEM
          </span>
          <p className={`text-5xl font-black mt-6 tracking-tight ${titleColor}`}>
            FAİLSAFE <span className="text-sm font-bold text-slate-400">Mod</span>
          </p>
          <p className="text-[12px] text-slate-500 mt-3 flex items-center gap-2 font-medium">
            <CheckCircle size={14} className="text-emerald-500" /> 
            Çevrimdışı ve Cloud Hibrit Koruma
          </p>
        </motion.div>
      </div>

      {/* ACTIVE SURVEILLANCE TABLE AND NEW RECORD FORM */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-10 items-start">
        
        {/* SÜRVEYANS LİSTESİ */}
        <div className={`xl:col-span-2 scroll-container overflow-x-hidden ${cardClass}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 ${titleColor}`}>
              <Users size={24} className="text-blue-500" />
              Aktif Sürveyans Havuzu
            </h3>
            <span className="text-[11px] bg-blue-500/10 text-blue-600 border border-blue-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Canlı Takip
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-[13px] ${textClass}`}>
              <thead>
                <tr className="border-b-2 border-slate-100 dark:border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-4 font-black">Vaka No</th>
                  <th className="pb-4 font-black">Ad Soyad</th>
                  <th className="pb-4 font-black">Zehirlenme Şüphesi / Etken</th>
                  <th className="pb-4 font-black">Bölge</th>
                  <th className="pb-4 font-black">Önem</th>
                  <th className="pb-4 text-right font-black">Eylem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 font-mono font-black text-slate-400">{patient.id}</td>
                    <td className="py-5">
                      <span className={`font-bold block text-sm ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{patient.name}</span>
                      <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">{patient.age} Yaş, {patient.date}</span>
                    </td>
                    <td className="py-5">
                      <span className="text-cyan-500 dark:text-cyan-400 font-semibold">{patient.substance}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{patient.status}</p>
                    </td>
                    <td className="py-4 text-slate-500 font-medium">{patient.location}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                        patient.risk === "Kritik" 
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" 
                          : patient.risk === "Orta"
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                          : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                      }`}>
                        {patient.risk}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => onDeletePatient(patient.id)}
                        className="p-1 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-bold transition-all border border-red-500/20 cursor-pointer"
                      >
                        Arşivle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* YENİ ŞÜPHELİ BİLDİRİMİ */}
        <div className={cardClass}>
          <h3 className={`text-xl font-black tracking-tight flex items-center gap-2 mb-2 ${titleColor}`}>
            <ShieldAlert size={20} className="text-red-500" />
            Yeni Şüpheli Bildirimi
          </h3>
          <p className={`text-[13px] leading-relaxed mb-6 font-medium ${mutedTextClass}`}>
            Halk Sağlığı sürveyansı ve KBRN uyarısı kapsamında şüpheli işyeri maruziyeti bildirimini girin.
          </p>

          <form onSubmit={onAddPatient} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">HASTA ADI SOYADI</label>
              <input
                required
                type="text"
                placeholder="Örn: Mehmet S."
                value={newPatient.name}
                onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                className={`w-full ${isDarkTheme ? "bg-black/20 border-white/10 text-white focus:border-cyan-500" : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"} border rounded-[14px] px-4 py-3.5 text-[13px] focus:outline-none transition-all font-semibold shadow-sm placeholder:text-slate-400`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">YAŞ</label>
                <input
                  type="number"
                  placeholder="Örn: 42"
                  value={newPatient.age}
                  onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                  className={`w-full ${isDarkTheme ? "bg-black/20 border-white/10 text-white focus:border-cyan-500" : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"} border rounded-[14px] px-4 py-3.5 text-[13px] focus:outline-none transition-all font-semibold shadow-sm placeholder:text-slate-400`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">YERLEŞİM YERİ</label>
                <input
                  type="text"
                  placeholder="Örn: Sorgun"
                  value={newPatient.location}
                  onChange={e => setNewPatient({...newPatient, location: e.target.value})}
                  className={`w-full ${isDarkTheme ? "bg-black/20 border-white/10 text-white focus:border-cyan-500" : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"} border rounded-[14px] px-4 py-3.5 text-[13px] focus:outline-none transition-all font-semibold shadow-sm placeholder:text-slate-400`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">KİMYASAL ETKEN ŞÜPHESİ</label>
              <input
                required
                type="text"
                placeholder="Örn: Kurşun, Organofosfat"
                value={newPatient.substance}
                onChange={e => setNewPatient({...newPatient, substance: e.target.value})}
                className={`w-full ${isDarkTheme ? "bg-black/20 border-white/10 text-white focus:border-cyan-500" : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"} border rounded-[14px] px-4 py-3.5 text-[13px] focus:outline-none transition-all font-semibold shadow-sm placeholder:text-slate-400`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">ÖNCELİK / RİSK KADEMESİ</label>
              <select
                value={newPatient.risk}
                onChange={e => setNewPatient({...newPatient, risk: e.target.value as any})}
                className={`w-full ${isDarkTheme ? "bg-black/20 border-white/10 text-white focus:border-cyan-500" : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"} border rounded-[14px] px-4 py-3.5 text-[13px] focus:outline-none transition-all font-semibold shadow-sm appearance-none cursor-pointer`}
              >
                <option value="Hafif">Hafif (Yeşil Alan Gözlem)</option>
                <option value="Orta">Orta (Sarı Alan Tetkik)</option>
                <option value="Kritik">Kritik (Kırmızı Alan Antidot)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 active:scale-[0.98] text-white dark:text-slate-950 font-black text-[13px] py-4 rounded-[14px] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Play size={12} fill="currentColor" />
              Sürveyansa Kaydet
            </button>
          </form>
        </div>

      </div>

      <MsdsPremiumBanner />

    </div>
  );
}
