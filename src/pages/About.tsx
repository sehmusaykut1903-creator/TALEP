import React from "react";
import { 
  Building2, 
  Users, 
  BookOpen, 
  Info, 
  Award, 
  Activity, 
  ShieldAlert, 
  FileText,
  BadgeAlert,
  Fingerprint
} from "lucide-react";
import { motion } from "motion/react";
import { useSettings } from "../context/SettingsContext";

export default function About() {
  const { language, theme } = useSettings();
  const isTr = language === "tr";
  const isDark = theme.isDark;

  // Light/Dark classes
  const containerBg = `${theme.cardBg} border ${isDark ? "text-slate-100" : "text-slate-800"} p-6 sm:p-8 space-y-8 rounded-[32px] max-w-6xl mx-auto mt-6 mb-12 shadow-2xl transition-all duration-200`;

  const cardClass = `${theme.cardBg} border p-6 rounded-3xl relative overflow-hidden space-y-4 transition-all duration-200`;

  const titleColor = isDark ? "text-white" : "text-[#0f172a] font-black";
  const mutedTextClass = isDark ? "text-slate-450" : "text-slate-500 font-medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`max-w-full overflow-x-hidden ${containerBg}`}
    >
      
      {/* SECTION HEADER: E-DEVLET / REPUBLIC OF TURKEY OFFICIAL PORTAL STYLING */}
      <header className={`border-b-4 ${theme.cardBg} border-b-[#22d3ee]/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-200`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-red-50 text-red-600"}`}>
            <Building2 size={32} />
          </div>
          <div>
            <span className={`text-[10px] font-black tracking-widest uppercase block ${isDark ? "text-cyan-400" : "text-red-600 font-extrabold"}`}>
              {isTr ? "RESMİ AKADEMİK PORTAL KÜNYESİ" : "OFFICIAL ACADEMIC PORTAL"}
            </span>
            <h1 className={`text-2xl font-black ${titleColor}`}>
              {isTr ? "TALEP HAKKINDA" : "ABOUT TALEP"}
            </h1>
            <p className={`text-xs mt-0.5 ${mutedTextClass}`}>
              {isTr ? "Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu" : "Toxicological Intelligent Laboratory Matching Platform"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">SÜRÜM / VERSION</p>
            <p className={`text-sm font-black font-mono ${isDark ? "text-cyan-400" : "text-blue-700"}`}>v4.0 Premium</p>
            <p className="text-[10px] text-slate-400">Yozgat, 2026</p>
          </div>
        </div>
      </header>

      {/* THREE BENTO CARDS OF PURPOSE & ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* A) PROJENİN AMACI */}
        <div className={cardClass}>
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-cyan-400 border-b border-slate-100 dark:border-white/5 pb-2.5">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-tight">
              {isTr ? "A) PROJENİN AMACI" : "A) PROJECT PURPOSE"}
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {isTr ? (
              "TALEP, mesleki ve çevresel kimyasal maruziyetlerin erken tanınmasını desteklemek, toksikolojik verileri klinik semptomlar ve laboratuvar bulgularıyla eşleştirmek, sağlık profesyonellerine bilimsel karar desteği sunmak amacıyla geliştirilmiş yapay zekâ destekli bir klinik karar destek ve bilimsel analiz platformudur."
            ) : (
              "TALEP is an artificial intelligence-supported clinical decision support and scientific analysis platform designed to support the early recognition of occupational and environmental chemical exposures, matching toxicological data with clinical symptoms and laboratory findings."
            )}
          </p>
        </div>

        {/* B) PROBLEM */}
        <div className={cardClass}>
          <div className="flex items-center gap-2.5 text-red-500 border-b border-slate-100 dark:border-white/5 pb-2.5">
            <BadgeAlert size={18} />
            <h3 className="text-sm font-black uppercase tracking-tight">
              {isTr ? "B) PROBLEM" : "B) THE PROBLEM"}
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {isTr ? (
              "Mesleki kimyasal maruziyetler çoğu zaman non-spesifik semptomlarla seyreder ve klinik değerlendirme süreçlerinde meslek öyküsü, maruziyet süresi, sektör bilgisi ve biyobelirteçler yeterince bütüncül şekilde değerlendirilemeyebilir. Bu durum erken tanıyı, koruyucu müdahaleyi ve epidemiyolojik izlem süreçlerini zorlaştırabilir."
            ) : (
              "Occupational chemical exposures often present with non-specific symptoms, and occupational history, duration of exposure, industry info, and biomarkers may not be evaluated holistically. This hampers early diagnosis, preventive interventions, and epidemiological tracking."
            )}
          </p>
        </div>

        {/* C) ÇALIŞMA PRENSİBİ */}
        <div className={cardClass}>
          <div className="flex items-center gap-2.5 text-emerald-500 border-b border-slate-100 dark:border-white/5 pb-2.5">
            <Activity size={18} />
            <h3 className="text-sm font-black uppercase tracking-tight">
              {isTr ? "C) ÇALIŞMA PRENSİBİ" : "C) WORKING PRINCIPLE"}
            </h3>
          </div>
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-1.5">
            <p>{isTr ? "TALEP sistemi;" : "The TALEP system integrates:"}</p>
            <ul className="list-disc pl-4 space-y-1">
              {isTr ? (
                <>
                  <li>Sektör ve Çalışma birimi</li>
                  <li>Kimyasal ajan riskleri</li>
                  <li>Klinik semptomlar ve laboratuvar parametreleri</li>
                  <li>Literatür verisi ve epidemiyolojik risk profili</li>
                </>
              ) : (
                <>
                  <li>Industry & working unit</li>
                  <li>Chemical agent risks</li>
                  <li>Clinical symptoms and lab parameters</li>
                  <li>Literature data and epidemiological profile</li>
                </>
              )}
            </ul>
            <p>{isTr ? "bilgilerini birlikte değerlendirerek klinik karar desteği sağlar." : "together to offer rapid clinical decisions."}</p>
          </div>
        </div>

      </div>

      {/* D) SİSTEM MANTIĞI */}
      <div className={cardClass}>
        <div className="flex items-center gap-2.5 text-purple-600 dark:text-[#a855f7] border-b border-slate-105 dark:border-white/5 pb-2.5">
          <Fingerprint size={18} />
          <h3 className="text-sm font-black uppercase tracking-tight">
            {isTr ? "D) SİSTEM MANTIĞI VE ALTYAPI" : "D) SYSTEM LOGIC & ARCHITECTURE"}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            { 
              trTitle: "MSDS Veri Modeli", 
              enTitle: "MSDS/SDS Profiles", 
              trDesc: "Tabansal toksik ajan veri entegrasyonu", 
              enDesc: "Database-backed toxic agent safety profiling" 
            },
            { 
              trTitle: "Kural Tabanlı Eşleştirme", 
              enTitle: "Rule-Based Matching", 
              trDesc: "Semptom ve laboratuvar korelasyonu", 
              enDesc: "Matching of symptoms and diagnostic parameters" 
            },
            { 
              trTitle: "Yapay Zeka Destekli Yorum", 
              enTitle: "AI Interpretation", 
              trDesc: "Klinik karar ve literatür istihbaratı", 
              enDesc: "Clinical decisions and literature crawling" 
            },
            { 
              trTitle: "Mimarisi", 
              enTitle: "Cloud Integration", 
              trDesc: "Güvenli yerel ve Firebase veri saklama", 
              enDesc: "Secure local storage & Firebase synchronisations" 
            }
          ].map((logic, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-200/60"}`}>
              <h4 className="text-xs font-black text-slate-800 dark:text-white">{isTr ? logic.trTitle : logic.enTitle}</h4>
              <p className="text-[10px] mt-1 text-slate-500 leading-normal">{isTr ? logic.trDesc : logic.enDesc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* E, F, G) PROJE EKİBİ & GÖREV DAĞILIMI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-0">
        
        {/* E & F) PROJECT TEAM & TASK ALLOCATIONS */}
        <div className={cardClass}>
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-cyan-400 border-b border-slate-100 dark:border-white/5 pb-2.5">
            <Users size={18} />
            <h3 className="text-sm font-black uppercase tracking-tight">
              {isTr ? "E & F) PROJE EKİBİ VE GÖREV DAĞILIMI" : "E & F) PROJECT TEAM & ALLOCATIONS"}
            </h3>
          </div>
          
          <div className="space-y-4 pt-1">
            
            {/* Şehmus Aykut */}
            <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/40 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-slate-900 dark:text-white">Şehmus AYKUT</span>
                <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/15 px-2 py-0.5 rounded font-black font-mono">ANA GELİŞTİRİCİ / LEAD DEV</span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                {isTr ? (
                  "Ana geliştirici, sistem mimarı, yapay zekâ ve klinik karar destek altyapısı geliştiricisi, toksikoloji platform tasarımı."
                ) : (
                  "Lead developer, system architect, developer of AI and clinical decision support framework, toxicology interface designer."
                )}
              </p>
            </div>

            {/* Fatma Nur Aykut */}
            <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/40 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-slate-900 dark:text-white">Fatma Nur AYKUT</span>
                <span className="text-[9px] bg-indigo-550 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded font-black font-mono">KLİNİK DESTEK / CLINICIAN</span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                {isTr ? (
                  "Klinik süreç desteği, kullanıcı deneyimi ve akademik süreç katkısı, sağlık süreçleri organizasyonu."
                ) : (
                  "Clinical workflow assessment, user experience, academic coordination, healthcare organization contributions."
                )}
              </p>
            </div>

            {/* Aghajan Musalı */}
            <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/40 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-slate-900 dark:text-white">Aghajan MUSALI</span>
                <span className="text-[9px] bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded font-black font-mono font-bold">ARAŞTIRMA &amp; AR-GE / CO-RESEARCHER</span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                {isTr ? (
                  "Araştırma geliştirme, klinik veri ve literatür entegrasyonu, akademik destek ve vaka modelleme."
                ) : (
                  "Research and development, clinical parameters integration, literary search and case modeling."
                )}
              </p>
            </div>

            {/* Prof. Dr. Vugar Ali Türksoy */}
            <div className={`p-4 rounded-2xl border-2 ${isDark ? "border-cyan-500/20 bg-cyan-950/5" : "border-red-100 bg-red-50/50"}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-slate-900 dark:text-white">Prof. Dr. Vugar Ali TÜRKSOY</span>
                <span className="text-[9px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/15 px-2 py-0.5 rounded font-black font-mono">AKADEMİK DANIŞMAN / ACADEMIC ADVISOR</span>
              </div>
              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1.5 space-y-1 leading-normal">
                <p>
                  <strong>{isTr ? "Kurum:" : "Department:"}</strong> Yozgat Bozok Üniversitesi Tıp Fakültesi, Halk Sağlığı Anabilim Dalı
                </p>
                <p>
                  {isTr ? (
                    "Akademik danışman, halk sağlığı ve toksikoloji danışmanlığı, mesleki maruziyet, epidemiyoloji ve koruyucu sağlık yaklaşımı."
                  ) : (
                    "Academic supervisor modeling, public health and toxicology advising, occupational medicine and epidemiology."
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* G) YAZILIM NOTU */}
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="flex items-center gap-2.5 text-amber-500 border-b border-slate-100 dark:border-white/5 pb-2.5">
              <ShieldAlert size={18} />
              <h3 className="text-sm font-black uppercase tracking-tight">
                {isTr ? "G) YAZILIM NOTU VE SORUMLULUK" : "G) ACADEMIC SOFTWARE DISCLAIMER"}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {isTr ? (
                "TALEP v4.0 Premium, prototip/ileri MVP aşamasında geliştirilmiş akademik ve teknolojik bir platformdur. Klinik kullanım için validasyon, etik değerlendirme, veri güvenliği, mevzuat uyumu ve saha testleri gereklidir. Sistem, hekim kararının yerine geçmez; bilimsel karar destek ve analiz aracı olarak tasarlanmıştır."
              ) : (
                "TALEP v4.0 Premium is an academic technological platform created at a prototype/MVP level. For clinical runtime use, strict regulatory validations, ethics appraisals, and medical audits are necessary. The platform serves as scientific decision advice and does not substitute professional medical expert opinion."
              )}
            </p>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2.5 text-slate-400 border-b border-slate-100 dark:border-white/5 pb-2.5">
              <FileText size={18} />
              <h3 className="text-sm font-black uppercase tracking-tight">
                {isTr ? "H) BİLGE KONGRE VE KURUM" : "H) HOST INSTITUTION"}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isTr ? (
                "TALEP v4.0 platformunun tıbbi kuramsal altyapısı Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Anabilim Dalı bilimsel standartlarına dayanmaktadır."
              ) : (
                "The scientific core of the TALEP platform complies with the occupational health standards of Yozgat Bozok University, Faculty of Medicine."
              )}
            </p>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-[11px] text-slate-500">
              {isTr ? "Telif Hakkı © 2026 • Şehmus Aykut." : "Copyright © 2026 • Şehmus Aykut."}
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
