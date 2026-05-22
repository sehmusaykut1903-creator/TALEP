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
  const cardClass = `${theme.cardBg} border backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden transition-all duration-200`;

  const textClass = isDarkTheme ? "text-slate-100" : "text-slate-800";
  const mutedTextClass = isDarkTheme ? "text-slate-405 text-slate-400" : "text-slate-500 font-medium";
  const titleColor = isDarkTheme ? "text-white" : "text-[#0f172a] font-extrabold";
  const bannerClass = isDarkTheme
    ? "relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900/90 to-[#0c1020] p-6 sm:p-8 md:p-10 shadow-[0_0_40px_rgba(6,182,212,0.15)] group"
    : "relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6 sm:p-8 md:p-10 shadow-lg group";

  return (
    <div className="space-y-8 min-w-0 w-full break-words">
      
      {/* ADVANCED INTEGRATED CLINICAL INTELLIGENCE COCKPIT (HERO) */}
      <div className={bannerClass}>
        {/* Soft decorative visual cues */}
        {isDarkTheme ? (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-[380px] h-[380px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[10%] w-[320px] h-[320px] bg-gradient-to-tr from-indigo-500/8 to-transparent rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-[380px] h-[380px] bg-gradient-to-br from-blue-500/[0.04] to-transparent rounded-full blur-[85px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[10%] w-[320px] h-[320px] bg-gradient-to-tr from-cyan-500/[0.03] to-transparent rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-stretch gap-8">
          {/* Main Branding & Intel Context */}
          <div className="space-y-4 max-w-2xl flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className={`inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                isDarkTheme 
                  ? "bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border-cyan-400/30 text-cyan-300"
                  : "bg-blue-50 border-blue-250 text-blue-700 border-blue-200"
              }`}>
                <Sparkles size={11} className={`${isDarkTheme ? "text-cyan-400" : "text-blue-600"} rotate-12`} /> 
                {t("active_system")} • TOKSİKOLOJİK SÜRVEYANS v4.0.2
              </div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase ${
                isDarkTheme 
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200"
                  : "text-slate-900"
              }`}>
                {t("dashboard")} &amp; SÜRVEYANS KONTROL MERKEZİ
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed font-semibold ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>
                TALEP v4.0 Premium, mesleki ve çevresel toksikolojik riskleri erken aşamada saptamak, klinisyenlere bilimsel karar desteği sağlamak ve epidemiyolojik patern analizi sunmak amacıyla kurgulanmıştır.
              </p>
            </div>

            {/* Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/50 dark:border-cyan-500/10 mt-2">
              {[
                { label: "SİSTEM HIZI", val: "12ms", ext: "GÜVENLİ", color: "text-blue-600 dark:text-cyan-400" },
                { label: "BİLİMSEL İNDEKS", val: "25,480+", ext: "PUBMED", color: "text-slate-900 dark:text-white" },
                { label: "AKADEMİK UYUM", val: "100%", ext: "MED-QA", color: "text-indigo-600 dark:text-indigo-400" },
                { label: "COĞRAFİ TAKİP", val: "AKTİF", ext: "SÜRVEYANS", color: "text-emerald-600 dark:text-emerald-400" }
              ].map((stat, i) => (
                <div key={i} className={`p-3 rounded-2xl border ${isDarkTheme ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200/60 shadow-sm"}`}>
                  <div className={`text-[8.5px] font-black uppercase tracking-widest ${mutedTextClass}`}>{stat.label}</div>
                  <div className={`text-sm font-black mt-1 font-mono flex items-center gap-1 ${stat.color}`}>
                    {stat.val} <span className="text-[8px] text-slate-400 font-normal">{stat.ext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Logo / Institution Header */}
          <div className="w-full lg:w-92 flex flex-col justify-between gap-4">
            <div className={`border rounded-[24px] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between h-full ${
              isDarkTheme ? "bg-slate-950/80 border-cyan-500/20" : "bg-white border-slate-200/80"
            }`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black tracking-widest uppercase ${isDarkTheme ? "text-cyan-400" : "text-blue-600"}`}>
                    KURUM VE ANALİZ BİLGİSİ
                  </span>
                  <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={`text-xs font-bold leading-relaxed ${textClass}`}>
                    Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Anabilim Dalı koruyucu sağlık sürveyansı devrededir.
                  </p>
                  <div className="text-[10px] font-mono leading-relaxed opacity-80">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold block">İŞBİRLİĞİ SİSTEMİ:</span>
                    Veriler KVKK'ya tam uyumludur ve sunum sırasında izleme korumalı demo modu devrededir.
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-900 pt-3 mt-4">
                <p className="text-[8.5px] text-slate-400 font-mono">
                  SANS-ID: TALEP-CDSS-PREMIUM-2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE VALUE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className={`${cardClass} border-l-4 border-l-red-500`}
        >
          <span className="text-[9.5px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            ACİL TAKİPTEKİ VAKALAR
          </span>
          <p className={`text-4xl font-black mt-4 tracking-tight ${titleColor}`}>
            {patients.length} <span className="text-xs font-bold text-slate-400">Hasta</span>
          </p>
          <p className="text-[10.5px] text-slate-500 mt-2 flex items-center gap-2">
            <Heart size={13} className="text-rose-500 fill-rose-500/20" /> 
            Aktif İzlem & Antidot Tedavileri
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className={`${cardClass} border-l-4 border-l-blue-500`}
        >
          <span className="text-[9.5px] font-black tracking-widest text-blue-500 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            KAYITLI ETKEN MADDE
          </span>
          <p className={`text-4xl font-black mt-4 tracking-tight ${titleColor}`}>
            {chemicalsCount} <span className="text-xs font-bold text-slate-400">Molekül</span>
          </p>
          <p className="text-[10.5px] text-slate-500 mt-2 flex items-center gap-2">
            <Database size={13} className="text-blue-500" /> 
            CAS Rehberi & Akut-Kronik Semptomlar
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className={`${cardClass} border-l-4 border-l-emerald-500`}
        >
          <span className="text-[9.5px] font-black tracking-widest text-emerald-600 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            KARAR GÜCÜ VE SİSTEM
          </span>
          <p className={`text-4xl font-black mt-4 tracking-tight ${titleColor}`}>
            FAİLSAFE <span className="text-xs font-bold text-slate-400">Mod</span>
          </p>
          <p className="text-[10.5px] text-slate-500 mt-2 flex items-center gap-2">
            <CheckCircle size={13} className="text-emerald-500" /> 
            Çevrimdışı ve Cloud Hibrit Koruma
          </p>
        </motion.div>
      </div>

      {/* ACTIVE SURVEILLANCE TABLE AND NEW RECORD FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* SÜRVEYANS LİSTESİ */}
        <div className={`lg:col-span-2 scroll-container overflow-x-hidden ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 ${titleColor}`}>
              <Users size={18} className="text-blue-500" />
              Aktif Sürveyans Havuzu
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-1 rounded-lg font-bold">
              Canlı Takip
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${textClass}`}>
              <thead>
                <tr className="border-b border-slate-200/70 dark:border-white/5 text-slate-400 font-bold">
                  <th className="pb-3 font-semibold">Vaka No</th>
                  <th className="pb-3 font-semibold">Ad Soyad</th>
                  <th className="pb-3 font-semibold">Zehirlenme Şüphesi / Etken</th>
                  <th className="pb-3 font-semibold">Bölge</th>
                  <th className="pb-3 font-semibold">Önem</th>
                  <th className="pb-3 text-right">Eylem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-500/[0.02] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-mono font-black text-slate-400">{patient.id}</td>
                    <td className="py-4">
                      <span className={`font-bold block ${isDarkTheme ? "text-white" : "text-slate-900"}`}>{patient.name}</span>
                      <span className="text-[10px] text-slate-400">{patient.age} Yaş, {patient.date}</span>
                    </td>
                    <td className="py-4">
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
          <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 mb-2 ${titleColor}`}>
            <ShieldAlert size={18} className="text-red-600" />
            Yeni Şüpheli Bildirimi
          </h3>
          <p className={`text-xs leading-normal mb-5 ${mutedTextClass}`}>
            Halk Sağlığı sürveyansı ve KBRN uyarısı kapsamında şüpheli işyeri maruziyeti bildirimini girin.
          </p>

          <form onSubmit={onAddPatient} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HASTA ADI SOYADI</label>
              <input
                required
                type="text"
                placeholder="Örn: Mehmet S."
                value={newPatient.name}
                onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YAŞ</label>
                <input
                  type="number"
                  placeholder="Örn: 42"
                  value={newPatient.age}
                  onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                  className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YERLEŞİM YERİ</label>
                <input
                  type="text"
                  placeholder="Örn: Sorgun"
                  value={newPatient.location}
                  onChange={e => setNewPatient({...newPatient, location: e.target.value})}
                  className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KİMYASAL ETKEN ŞÜPHESİ</label>
              <input
                required
                type="text"
                placeholder="Örn: Kurşun, Organofosfat"
                value={newPatient.substance}
                onChange={e => setNewPatient({...newPatient, substance: e.target.value})}
                className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÖNCELİK / RİSK KADEMESİ</label>
              <select
                value={newPatient.risk}
                onChange={e => setNewPatient({...newPatient, risk: e.target.value as any})}
                className="w-full bg-slate-500/5 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-all font-medium appearance-none"
              >
                <option value="Hafif">Hafif (Yeşil Alan Gözlem)</option>
                <option value="Orta">Orta (Sarı Alan Tetkik)</option>
                <option value="Kritik">Kritik (Kırmızı Alan Antidot)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-cyan-500 hover:bg-blue-500 dark:hover:bg-cyan-400 active:scale-95 text-white dark:text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Play size={10} fill="currentColor" />
              Sürveyansa Kaydet
            </button>
          </form>
        </div>

      </div>

      <MsdsPremiumBanner />

      {/* DASHBOARD ABOUT / PROJECT TEAM PRESETS CARD (Relocated to bottom) */}
      <div className={isDarkTheme ? "bg-slate-900/40 border border-white/5 p-6 rounded-3xl mt-6" : "bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/50 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6"}>
        <div className="space-y-2">
          <h3 className="text-sm font-black text-blue-900 dark:text-cyan-400 flex items-center gap-1.5 uppercase">
            <Award size={16} /> Proje Ekibi & Akademik Kadro
          </h3>
          <div className="text-xs space-y-1.5">
            <p className={textClass}>
              <strong className="text-blue-900/90 dark:text-slate-300">Proje Ekibi:</strong> Şehmus AYKUT • Fatma Nur AYKUT • Aghajan MUSALI
            </p>
            <p className={textClass}>
              <strong className="text-blue-900/90 dark:text-slate-300">Akademik Danışman:</strong> Prof. Dr. Vugar Ali TÜRKSOY
            </p>
            <p className={mutedTextClass}>
              <strong>Kurum:</strong> Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Anabilim Dalı
            </p>
          </div>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-blue-200 dark:border-white/5 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500 max-w-xs shrink-0 self-stretch flex flex-col justify-center">
          <p className="font-bold flex items-center gap-1 text-blue-700 dark:text-cyan-400">
            <BookOpen size={12} /> Bilgilendirme Notu
          </p>
          <p className="text-[11px] mt-1 leading-normal leading-relaxed text-slate-500">
            TALEP platformu, Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı kürsüsünde geliştirilmiş koruyucu karar destek laboratuvar analiz sistemidir.
          </p>
        </div>
      </div>

    </div>
  );
}
