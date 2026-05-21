import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Sliders, 
  Map, 
  Activity, 
  BarChart, 
  ShieldAlert, 
  Calendar, 
  RefreshCw, 
  SlidersHorizontal,
  Info,
  Brain,
  Bell,
  UserCheck,
  Zap,
  Flame,
  Gauge
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  BarChart as RechartsBarChart, 
  Bar 
} from 'recharts';

interface Cluster {
  id: string;
  region: string;
  industry: string;
  activeChem: string;
  monitoredStaff: number;
  incidentCases: number;
  concentrationPpm: number;
  criticalLimit: number;
  status: 'Stabil' | 'İzleme_Gerekli' | 'Tehlike_Kapsamı';
  relativeRisk: number;
}

const localClusters: Cluster[] = [
  { id: "cl-1", region: "Tuzla Boya & Reçine Bölgesi", industry: "Kimya / Solvent Karışımı", activeChem: "Benzen / Toluen", monitoredStaff: 1250, incidentCases: 48, concentrationPpm: 12.4, criticalLimit: 5.0, status: 'Tehlike_Kapsamı', relativeRisk: 3.42 },
  { id: "cl-2", region: "Dilovası Havzası Hub", industry: "Metal Eritme / Galvaniz", activeChem: "Kurşun (Toz / Duman)", monitoredStaff: 890, incidentCases: 22, concentrationPpm: 8.1, criticalLimit: 10.0, status: 'İzleme_Gerekli', relativeRisk: 1.95 },
  { id: "cl-3", region: "Aliağa Rafinerileri", industry: "Petrokimya Sektörü", activeChem: "Benzen", monitoredStaff: 1800, incidentCases: 14, concentrationPpm: 2.1, criticalLimit: 1.0, status: 'Stabil', relativeRisk: 1.10 },
  { id: "cl-4", region: "Gaziantep Tekstil Sahası", industry: "Sterilizasyon & Boyama", activeChem: "Formaldehit", monitoredStaff: 1400, incidentCases: 37, concentrationPpm: 4.8, criticalLimit: 2.0, status: 'Tehlike_Kapsamı', relativeRisk: 2.80 },
  { id: "cl-5", region: "Polatlı Tarım Bölgesi", industry: "Sera İlaçlamaları", activeChem: "Organofosfat Pestisit", monitoredStaff: 600, incidentCases: 41, concentrationPpm: 65.0, criticalLimit: 50.0, status: 'Tehlike_Kapsamı', relativeRisk: 4.15 }
];

const trendTimelineData = [
  { week: 'W1', benzen: 4.2, lead: 12.5, organo: 28.0 },
  { week: 'W2', benzen: 5.8, lead: 11.2, organo: 32.5 },
  { week: 'W3', benzen: 8.1, lead: 14.8, organo: 41.0 },
  { week: 'W4', benzen: 12.0, lead: 10.1, organo: 48.5 },
  { week: 'W5', benzen: 11.4, lead: 9.5, organo: 52.0 },
  { week: 'W6', benzen: 15.6, lead: 12.0, organo: 68.4 }
];

export default function OccupationalEpidemiology() {
  // OR/RR Calculator States
  const [expSick, setExpSick] = useState<number>(42);
  const [expHealthy, setExpHealthy] = useState<number>(18);
  const [unexpSick, setUnexpSick] = useState<number>(10);
  const [unexpHealthy, setUnexpHealthy] = useState<number>(130);

  // Hazard Spread simulator States
  const [ambientPpm, setAmbientPpm] = useState<number>(5.0);
  const [ppeUsagePercent, setPpeUsagePercent] = useState<number>(75);

  const calculateOR_RR = () => {
    const totalExposed = expSick + expHealthy;
    const totalUnexposed = unexpSick + unexpHealthy;

    const orVal = expHealthy * unexpSick === 0 ? 0 : (expSick * unexpHealthy) / (expHealthy * unexpSick);
    const rrVal = totalExposed === 0 || totalUnexposed === 0 || unexpSick === 0 
      ? 0 
      : (expSick / totalExposed) / (unexpSick / totalUnexposed);

    // Standard Error for ln(OR) and 95% CI
    let ciLowerOr = 0;
    let ciUpperOr = 0;
    if (expSick > 0 && expHealthy > 0 && unexpSick > 0 && unexpHealthy > 0) {
      const seLnOr = Math.sqrt(1/expSick + 1/expHealthy + 1/unexpSick + 1/unexpHealthy);
      const lnOr = Math.log(orVal);
      ciLowerOr = Math.exp(lnOr - 1.96 * seLnOr);
      ciUpperOr = Math.exp(lnOr + 1.96 * seLnOr);
    }

    // Rough Simulated P-value based on simple Chi-square approximation
    const n = totalExposed + totalUnexposed;
    const row1Total = expSick + unexpSick;
    const row2Total = expHealthy + unexpHealthy;
    const expRow1Col1 = (totalExposed * row1Total) / n;
    const expRow1Col2 = (totalExposed * row2Total) / n;
    const expRow2Col1 = (totalUnexposed * row1Total) / n;
    const expRow2Col2 = (totalUnexposed * row2Total) / n;

    let chiSq = 0;
    if (expRow1Col1 > 0 && expRow1Col2 > 0 && expRow2Col1 > 0 && expRow2Col2 > 0) {
      chiSq = Math.pow(Math.abs(expSick - expRow1Col1) - 0.5, 2) / expRow1Col1 +
              Math.pow(Math.abs(expHealthy - expRow1Col2) - 0.5, 2) / expRow1Col2 +
              Math.pow(Math.abs(unexpSick - expRow2Col1) - 0.5, 2) / expRow2Col1 +
              Math.pow(Math.abs(unexpHealthy - expRow2Col2) - 0.5, 2) / expRow2Col2;
    }

    let pValStr = "p > 0.05";
    if (chiSq > 10.83) pValStr = "p < 0.001 (Yüksek Anlamlı)";
    else if (chiSq > 6.63) pValStr = "p < 0.01 (Çok Anlamlı)";
    else if (chiSq > 3.84) pValStr = "p < 0.05 (Anlamlı)";

    return {
      oddsRatio: orVal.toFixed(2),
      relativeRisk: rrVal.toFixed(2),
      ci: `[${ciLowerOr.toFixed(2)} - ${ciUpperOr.toFixed(2)}]`,
      pVal: pValStr,
      strength: orVal > 3.0 ? "Güçlü Klinik İlişki" : orVal > 1.5 ? "Orta Derece Klinik İlişki" : "Zayıf veya İhmal Edilebilir"
    };
  };

  const econResults = calculateOR_RR();

  // Simulated population tracking calculation
  const getProjections = () => {
    // Risk increments based on exposure ppm and lack of PPE
    const baseToxRate = (ambientPpm / 10) * (1 - ppeUsagePercent / 100);
    const monCount = 5000;
    const projected6M = Math.round(monCount * baseToxRate * 1.5);
    const projected12M = Math.round(monCount * baseToxRate * 3.8);
    const projected24M = Math.round(monCount * baseToxRate * 7.4);

    return {6: projected6M, 12: projected12M, 24: projected24M};
  };

  const projections = getProjections();

  // Dynamic epidemiology recommendations from AI Core
  const getAiEpidemiologyReport = () => {
    if (ambientPpm > 15 && ppeUsagePercent < 60) {
      return {
        warning: "KRİTİK MARUZİYET ALARMI",
        message: "Aşırı yüksek gaz sızıntısı ve yetersiz koruma nedeniyle akut nörotoksik veya miyelodisplastik salgın tehlikesi. İvedi olarak saha havalandırma debisini artırın ve vardiyaları yarıya indirin.",
        color: "text-rose-600 bg-rose-50 border-rose-200"
      };
    } else if (ambientPpm > 8 || ppeUsagePercent < 80) {
      return {
        warning: "MODERAT RİSK REJİMİ",
        message: "Genotoksik birikim tavan eşiğe yaklaşıyor. Periyodik idrar tt-MA veya kazein takipleri 3 aylık periyotlara çekilmeli, rotasyonel çalışma takvimi devreye alınmalıdır.",
        color: "text-amber-700 bg-amber-50 border-amber-200"
      };
    } else {
      return {
        warning: "STABİL VE GÜVENLİ REGÜLASYON",
        message: "Halk sağlığı limitleri güvenli aralıkta. Mevcut koruyucu önlemler ve yıllık sağlık taramaları (biyobelirteç sürveyansı) mevcut düzende kesintisiz sürdürülebilir.",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200"
      };
    }
  };

  const aiReport = getAiEpidemiologyReport();

  return (
    <div className="space-y-8">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2.2rem] p-8 border border-indigo-800/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-400 animate-pulse" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-indigo-400 uppercase font-mono">EPİDEMİYOLOJİK BİLGİ VE ANALİTİK SİSTEMİ</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Halk Sağlığı ve Mesleki Epidemiyoloji İzleme Platformu</h2>
          <p className="text-xs text-slate-350 max-w-3xl leading-relaxed">
            Hastalık sıklıkları, kohort katsayıları, Odds Oranı (OR) hesaplayıcıları, sektörel toksitite dağılımları ve coğrafi kümelenme modellerinden oluşan gelişmiş epidemiyoloji konsolu.
          </p>
        </div>
      </div>

      {/* TOP CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend graph */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-[9px] font-black text-[#0ea5e9] uppercase tracking-widest font-mono">Surveillance Sinyalleri</span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">Haftalık Sektörel İnsidans Trendleri (6 Haftalık İzlem)</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[9.5px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
              <Calendar size={12} /> Canlı Veri Akışı
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                <Tooltip contentStyle={{ borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="benzen" stroke="#3b82f6" strokeWidth={3} name="Solventler (% Hücre İnhibisyonu)" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="lead" stroke="#f43f5e" strokeWidth={3} name="Ağır Metal (BLL μg/dL Ortalama)" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="organo" stroke="#10b981" strokeWidth={3} name="Pestisit (Psödokolinesteraz Baskı)" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Radar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-mono font-bold">Kümülatif Risklilik</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Sektörel Toksisite Profil Analizi</h3>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                { subject: 'Hematotoks.', A: 120, B: 30 },
                { subject: 'Nörotoks.', A: 90, B: 110 },
                { subject: 'Hepatotoks.', A: 70, B: 120 },
                { subject: 'Nefrotoks.', A: 85, B: 100 },
                { subject: 'Dermal Hasar', A: 40, B: 90 },
              ]}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" fontSize={9} fontWeight="bold" tick={{ fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} fontSize={8} />
                <Radar name="Kimyasal Boyalar" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Sanayi Gazları" dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CLUSTERING FACTORY MAP / SURVEILLANCE STATUS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <span className="text-[9px] font-black text-teal-700 uppercase tracking-widest font-mono">Coğrafi Epidemiyoloji Takip Matrisi</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Aktif Coğrafi Toksikoloji Kümelenme ve Akıllı Alarm Merkezleri</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl uppercase">
            <Bell size={11} /> 3 Aktif Kritik Bölge
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                <th className="pb-3">Kümelenme Bölgesi / Hub</th>
                <th className="pb-3">Sektör / Endüstriyel İşkolu</th>
                <th className="pb-3">Etkin Toksik Ajan</th>
                <th className="pb-3 text-center">İzlenen Çalışan</th>
                <th className="pb-3 text-center">Ortalama Maruziyet (Ppm)</th>
                <th className="pb-3 text-center">Klinik Rölatif Risk (RR)</th>
                <th className="pb-3 text-right">Mevcut Alarm Seviyesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {localClusters.map((cl) => (
                <tr key={cl.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-black text-slate-800 flex items-center gap-2">
                    <Map size={13} className="text-[#0ea5e9] shrink-0" />
                    {cl.region}
                  </td>
                  <td className="py-3">{cl.industry}</td>
                  <td className="py-3 font-mono font-bold text-[#4f46e5]">{cl.activeChem}</td>
                  <td className="py-3 text-center font-bold font-mono text-slate-600">{cl.monitoredStaff}</td>
                  <td className="py-3 text-center font-mono">
                    <span className={cl.concentrationPpm > cl.criticalLimit ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                      {cl.concentrationPpm} / {cl.criticalLimit} ppm
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-slate-800 bg-slate-50/50">{cl.relativeRisk}x</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      cl.status === 'Tehlike_Kapsamı' ? 'bg-red-500 text-white shadow-sm shadow-red-500/10' :
                      cl.status === 'İzleme_Gerekli' ? 'bg-amber-500 text-white shadow-sm' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {cl.status === 'Tehlike_Kapsamı' ? 'KRİTİK ALARM' : cl.status === 'İzleme_Gerekli' ? 'ŞÜPHELİ TAKİP' : 'DURUM STABİL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALCULATORS HUB (OR/RR CALCULATOR + SPREAD SIMULATION + AI FORECASTING) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SCIENTIFIC ODDS RATIO CALCULATOR */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-[2.3rem] p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest font-mono">Epidemiyolojik Karar Destek Aracı</span>
            <h3 className="text-md font-black">2x2 Klinik Kohort Odds Oranı (OR) & Rölatif Risk (RR) Analizör</h3>
            <p className="text-[10px] text-slate-300">
              Periyodik klinik takip veya tarama alt gruplarının maruziyet-hastalık bağıntısını istatistiksel analizle doğrulayın.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="text-[8.5px] font-black text-indigo-200 uppercase tracking-widest block mb-1">Maruz Kalan / Hasta Vaka</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono focus:border-indigo-400 outline-none text-white text-center"
                value={expSick}
                onChange={e => setExpSick(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="text-[8.5px] font-black text-indigo-200 uppercase tracking-widest block mb-1">Maruz Kalan / Sağlıklı</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono focus:border-indigo-400 outline-none text-white text-center"
                value={expHealthy}
                onChange={e => setExpHealthy(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="text-[8.5px] font-black text-indigo-200 uppercase tracking-widest block mb-1">Kontrol Grubu / Hasta</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono focus:border-indigo-400 outline-none text-white text-center"
                value={unexpSick}
                onChange={e => setUnexpSick(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="text-[8.5px] font-black text-indigo-200 uppercase tracking-widest block mb-1">Kontrol Grubu / Sağlıklı</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono focus:border-indigo-400 outline-none text-white text-center"
                value={unexpHealthy}
                onChange={e => setUnexpHealthy(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 p-3 rounded-2xl flex flex-col justify-between border border-white/5">
              <span className="text-[8.5px] font-black text-indigo-300 uppercase font-mono">Odds Oranı (OR) & 95% CI</span>
              <p className="text-xl font-black font-mono mt-1 text-emerald-400">{econResults.oddsRatio}</p>
              <span className="text-[8.5px] text-slate-400 font-extrabold mt-0.5 font-mono">{econResults.ci}</span>
            </div>
            
            <div className="bg-white/5 p-3 rounded-2xl flex flex-col justify-between border border-white/5">
              <span className="text-[8.5px] font-black text-indigo-300 uppercase font-mono">Rölatif Risk (RR) & Güven Seviyesi</span>
              <p className="text-xl font-black font-mono mt-1 text-cyan-400">{econResults.relativeRisk}x</p>
              <span className="text-[8.5px] text-slate-400 font-bold mt-0.5">{econResults.pVal}</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-center text-[10px] text-slate-350">
            <Info size={14} className="text-indigo-400 shrink-0" />
            <p>
              Yorum Değerlendirmesi: <span className="font-extrabold text-white">{econResults.strength}</span>. Bulgular karsinojenez gelişim teorisinde istatistiksel geçerlilik taşımaktadır.
            </p>
          </div>
        </div>

        {/* HAZARD SPREAD SIMULATION with integrated AI forecasting engine */}
        <div className="bg-white rounded-[2.3rem] p-8 border border-slate-100 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="space-y-1 mb-5">
              <span className="text-[9px] font-black text-rose-700 uppercase tracking-widest font-mono">Dinamik Simülasyon Paneli</span>
              <h3 className="text-md font-black text-slate-900 mt-0.5">Etkileşimli Maruziyet Yayılım & Projeksiyon Simülatörü</h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Saha gaz yoğunluğu ve kişisel koruyucu ekipman (PPE) penetrasyon parametrelerine göre vaka sayısının teorik projeksiyon eğrilerini analiz edin.
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Ortam Gaz Konsantrasyonu (Ortalama)</span>
                  <span className="font-mono text-rose-600 font-bold">{ambientPpm} ppm</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="25.0"
                  step="0.5"
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                  value={ambientPpm}
                  onChange={e => setAmbientPpm(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Koruyucu Ekipman (PPE) Uyum Katsayısı</span>
                  <span className="font-mono text-emerald-600 font-bold">{ppeUsagePercent}%</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                  value={ppeUsagePercent}
                  onChange={e => setPpeUsagePercent(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Results graph preview representation */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <span className="text-[8.5px] font-black text-slate-400 uppercase font-mono">6 Ay Sonra</span>
                <p className="text-xl font-black font-mono text-slate-800 mt-1">+{projections[6]}</p>
                <span className="text-[8.5px] text-rose-500 font-bold block mt-0.5">Potansiyel Vaka</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-center ring-1 ring-rose-300">
                <span className="text-[8.5px] font-black text-slate-400 uppercase font-mono">12 Ay Sonra</span>
                <p className="text-xl font-black font-mono text-rose-700 mt-1">+{projections[12]}</p>
                <span className="text-[8.5px] text-rose-500 font-bold block mt-0.5">Potansiyel Vaka</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <span className="text-[8.5px] font-black text-slate-400 uppercase font-mono">24 Ay Sonra</span>
                <p className="text-xl font-black font-mono text-slate-800 mt-1">+{projections[24]}</p>
                <span className="text-[8.5px] text-rose-500 font-bold block mt-0.5">Potansiyel Vaka</span>
              </div>
            </div>
          </div>
          
          {/* AI Core Proactive Advice Section */}
          <div className={`p-4 border rounded-2xl flex gap-2.5 text-[10px] font-semibold leading-relaxed transition-colors duration-300 mt-4 ${aiReport.color}`}>
            <Brain size={16} className="shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-black uppercase tracking-wider block mb-0.5">AI EPİDEMİYOLOJİ ASİSTANI - {aiReport.warning}</span>
              <p>{aiReport.message}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
