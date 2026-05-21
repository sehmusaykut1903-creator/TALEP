import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  AlertTriangle, 
  Activity, 
  Clock, 
  RotateCcw, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  PhoneCall, 
  Calculator,
  ShieldCheck
} from 'lucide-react';

export default function EmergencyToxicology() {
  const [activeSeverity, setActiveSeverity] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Anion & Osmolar Gap Calculator States
  const [na, setNa] = useState<number>(140);
  const [cl, setCl] = useState<number>(104);
  const [hco3, setHco3] = useState<number>(24);
  const [glucose, setGlucose] = useState<number>(90);
  const [bun, setBun] = useState<number>(14);
  const [measuredOsm, setMeasuredOsm] = useState<number>(295);

  // Nomogram States
  const [hoursPostIngestion, setHoursPostIngestion] = useState<number>(6);
  const [paracetamolLevel, setParacetamolLevel] = useState<number>(120);

  // Response Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(p => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setElapsedSeconds(0);
  };

  // Calculations for Gap Calculator
  const anionGapVal = na - (cl + hco3);
  
  // Calculated Osmolality = 2*Na + Glucose/18 + BUN/2.8
  const calculatedOsm = 2 * na + (glucose / 18) + (bun / 2.8);
  const osmolarGapVal = measuredOsm - calculatedOsm;

  // Rumack Matthew Nomogram calculation
  // Nomogram treatment line is at: C = 150 * e^(-0.12 * (t - 4)) at t >= 4
  const checkNomogramTreatment = () => {
    if (hoursPostIngestion < 4) {
      return { rec: "Bekleyin ve 4. saatte serum örneği ölçümü yapın", risk: "Tayin Edilemez (< 4 saat)" };
    }
    const treatmentThreshold = 150 * Math.exp(-0.12 * (hoursPostIngestion - 4));
    
    if (paracetamolLevel >= treatmentThreshold) {
      return { rec: "DERHAL N-Asetilsistein (NAC) protokolüne başlayın (150 mg/kg IV in 60 min, ardından sürdürün)", risk: "YÜKSEK HEPATOTOKSİK RİSK (Tedavi Gereklidir)" };
    } else {
      return { rec: "NAC protokolü endike değildir. Karaciğer enzimlerini periyodik olarak her 12 saatte bir izleyin.", risk: "DÜŞÜK RİSK (İzlem)" };
    }
  };

  const nomogramSummary = checkNomogramTreatment();

  return (
    <div className="space-y-6">
      {/* HEADER HERO WARNING */}
      <div className="bg-gradient-to-r from-red-950 via-rose-955 to-slate-900 text-white rounded-[2.2rem] p-8 border border-red-900/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl opacity-35 animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="text-red-400" size={18} />
              <span className="text-[10px] font-black tracking-[0.25em] text-red-400 uppercase font-mono">KRİTİK ACİL TOKSİKOLOJİ</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Acil Müdahale ve Antidot Hücresi</h2>
            <p className="text-xs text-rose-200 max-w-2xl leading-relaxed">
              Zenginleştirilmiş SLUDGE muskarinik kriz algoritmaları, dezenfeksiyon protokolleri ve yoğun bakım sevk çizelgeleri için klinisyen asistanı.
            </p>
          </div>

          {/* Response rolling timer */}
          <div className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
            <div className="text-[8.5px] uppercase font-black text-rose-300 tracking-wider">Acil Müdahale Kronometre</div>
            <p className="text-2xl font-black font-mono mt-1 text-red-400 font-bold">{formatTime(elapsedSeconds)}</p>
            <button 
              onClick={handleResetTimer}
              className="mt-1 text-[8px] font-black uppercase text-slate-400 hover:text-white transition-colors flex items-center gap-1 justify-center mx-auto"
            >
              <RotateCcw size={10} /> Sıfırla
            </button>
          </div>
        </div>
      </div>

      {/* EMERGENCY TRIAGE CHOICES WITH DETAILS */}
      <div className="bg-white rounded-[2.3rem] p-8 border border-slate-200/50 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <span className="text-[9.5px] font-black text-rose-600 uppercase tracking-widest font-mono">Triyaj Doğrulamaları</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Triyaj Renk Derecelendirmeleri ve Acil Protokol Şemaları</h3>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'RED', label: 'RED / HAYATİ TOKSİSİTE', color: 'bg-red-500' },
              { id: 'YELLOW', label: 'YELLOW / CİDDİ MARUZİYET', color: 'bg-amber-500' },
              { id: 'GREEN', label: 'GREEN / STABİL İZLEM', color: 'bg-emerald-500' }
            ].map((btn) => (
              <button 
                key={btn.id}
                onClick={() => setActiveSeverity(btn.id as any)}
                className={`p-2 px-4 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  activeSeverity === btn.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                {btn.label.split(' / ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Severity descriptive text */}
        <AnimatePresence mode="wait">
          {activeSeverity === 'RED' && (
            <motion.div 
              key="red"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs"
            >
              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                <span className="text-[8.5px] font-mono font-black text-red-700 uppercase">AKUT PARAMETRE</span>
                <h4 className="font-black text-red-900 text-sm">Organofosfat SLUDGE Krizi</h4>
                <p className="leading-relaxed font-semibold text-red-800">
                  Derhal atropin sülfat 1-2 mg IV yapılmalı, salgı kontrolü sağlanana dek her 5 dakikada bir tekrarlanmalıdır. Pralidoksim (2-PAM) IV 30 mg/kg yükleme infüzyonunu geciktirmeyin.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                <span className="text-[8.5px] font-mono font-black text-red-700 uppercase">SOLUNUM HATLARI</span>
                <h4 className="font-black text-red-900 text-sm">Benzen & Solvent İnhalasyonu</h4>
                <p className="leading-relaxed font-semibold text-red-800">
                  Epileptik veya kardiyak katekolamin duyarlılığı saptandığında havayolunu %100 O₂ ile açık tutun. Epinefrin verilmesinden kaçının (ventriküler fibrilasyon tehlikesi).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2">
                <span className="text-[8.5px] font-mono font-black text-red-400 uppercase">ZORUNLU DEKONTAMİNASYON</span>
                <h4 className="font-black text-sm">Dermal & Göz Temizliği</h4>
                <p className="leading-relaxed font-medium text-slate-300">
                  Hastanın giysilerini tamamen kesin, cildini bol sabunlu suyla 15 dakika boyunca yıkayın. Göz teması varsa izotonik sodyum klorür ile sürekli irrigasyon başlatın.
                </p>
              </div>
            </motion.div>
          )}

          {activeSeverity === 'YELLOW' && (
            <motion.div 
              key="yellow"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs"
            >
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                <span className="text-[8.5px] font-mono font-black text-amber-700 uppercase">ORTA-AĞIR TOKSİSİTE</span>
                <h4 className="font-black text-amber-900 text-sm">Ağır Metal / Kurşun Seviyesi BLL &gt; 50 µg/dL</h4>
                <p className="leading-relaxed font-semibold text-amber-800">
                  Hastaya şelasyon tedavisi amacıyla ağızdan Süksimer (DMSA) 10 mg/kg dozunda tedavi başlayın. Karaciğer ve renal klirens üre değerleri laboratuvar takibine alınmalıdır.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                <span className="text-[8.5px] font-mono font-black text-amber-700 uppercase">IZLEM VE TRANSFER</span>
                <h4 className="font-black text-amber-900 text-sm">Yoğun Bakım Sevk Kriterleri</h4>
                <p className="leading-relaxed font-semibold text-amber-800">
                  Serum psödokolinesteraz seviyesi &lt; 2000 U/L olan solunum yetmezliği adayları, veya derin asidoz seyri (pH &lt; 7.2) izlenen hastalar gecikmeden sevk edilmelidir.
                </p>
              </div>
            </motion.div>
          )}

          {activeSeverity === 'GREEN' && (
            <motion.div 
              key="green"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs flex gap-4 items-start"
            >
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <h4 className="font-black text-emerald-950 text-sm">Düşük Tehlikeli / Stabil Takipler</h4>
                <p className="leading-relaxed font-semibold text-emerald-800">
                  Genel hemogram bulguları, SFT hacim ölçüleri ve idrar metabolitleri normal referans bantta olan çalışan grubu. 3 ayda bir rutin periyodik poliklinik taramaları yeterlidir.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EMERGENCY CALCULATORS HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CALCULATOR 1: ANION & OSMOLAR GAP CALCULATOR */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-[2.3rem] p-8 border border-slate-805 shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <Calculator size={15} />
              <span className="text-[8.5px] font-black uppercase tracking-widest font-mono">Anyon ve Osmolar Gap Teşhis Aracı</span>
            </div>
            <h3 className="text-md font-black">Toksik Alkol & Anyon Gap Hesaplayıcı</h3>
            <p className="text-[10px] text-slate-300">
              Methanol, Ethylene Glycol veya Salisilat zehirlenmelerini saptamak amacıyla hastanın anyon açığını ve ölçülen/hesaplanan osmolalite farkını anında bulun.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black tracking-wider text-slate-400">Na+ (mEq/L)</label>
              <input 
                type="number" 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 font-bold font-mono text-center outline-none"
                value={na}
                onChange={e => setNa(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black tracking-wider text-slate-400">Cl- (mEq/L)</label>
              <input 
                type="number" 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 font-bold font-mono text-center outline-none"
                value={cl}
                onChange={e => setCl(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black tracking-wider text-slate-400">HCO3- (mEq/L)</label>
              <input 
                type="number" 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 font-bold font-mono text-center outline-none"
                value={hco3}
                onChange={e => setHco3(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black tracking-wider text-slate-400">Glukoz (mg/dL)</label>
              <input 
                type="number" 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 font-bold font-mono text-center outline-none"
                value={glucose}
                onChange={e => setGlucose(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black tracking-wider text-slate-400">BUN (mg/dL)</label>
              <input 
                type="number" 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 font-bold font-mono text-center outline-none"
                value={bun}
                onChange={e => setBun(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black tracking-wider text-slate-400">Ölçülen Osmolalite</label>
              <input 
                type="number" 
                className="w-full bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 font-bold font-mono text-center outline-none"
                value={measuredOsm}
                onChange={e => setMeasuredOsm(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl">
              <span className="text-[8px] font-black text-indigo-300 uppercase block">HESAPLANAN ANYON GAPI</span>
              <p className="text-xl font-black font-mono text-rose-450 mt-1">{anionGapVal} mEq/L</p>
              <span className="text-[8px] text-slate-400 block mt-0.5">Normal Referans: 8 - 12</span>
            </div>
            
            <div className="bg-white/5 p-3 rounded-2xl">
              <span className="text-[8px] font-black text-indigo-300 uppercase block">HESAPLANAN OSMOLAR GAP</span>
              <p className="text-xl font-black font-mono text-indigo-300 mt-1">{osmolarGapVal.toFixed(1)} mOsm/kg</p>
              <span className="text-[8px] text-slate-400 block mt-0.5">Normal Referans: &lt; 10</span>
            </div>
          </div>

          {osmolarGapVal > 15 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10.5px] font-semibold text-red-300 flex gap-2">
              <AlertTriangle className="text-red-400 shrink-0" size={12} />
              <p>ÖNEMLİ İKAZ: Osmolar gap 15'ten büyüktür. Toksik alkol (Metanol / Etilen Glikol) zehirlenmesi olasılığı aşırı düzeydedir!</p>
            </div>
          )}
        </div>

        {/* CALCULATOR 2: RUMACK-MATTHEW NOMOGRAM SIMULATOR */}
        <div className="bg-white rounded-[2.3rem] p-8 border border-slate-200/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-500">
              <Calculator size={15} />
              <span className="text-[8.5px] font-black uppercase tracking-widest font-mono">Karaciğer Toksisite Risk Değerlendirmesi</span>
            </div>
            <h3 className="text-md font-black text-slate-900">Rumack-Matthew Nomogram Simülatörü</h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Akut parasetamol (asetaminofen) alımlarında karaciğer yetmezliği risk düzeyi ve IV N-Asetilsistein (NAC) protokol endikasyonunu hesaplayın.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Alım Sonrası Geçen Süre (Saat)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono font-bold text-center outline-none focus:border-rose-400"
                value={hoursPostIngestion}
                onChange={e => setHoursPostIngestion(Math.max(1, Number(e.target.value)))}
                min="1"
                max="24"
              />
            </div>
            
            <div className="space-y-1 text-xs">
              <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Plazma Parasetamol Seviyesi (µg/mL)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono font-bold text-center outline-none focus:border-rose-400"
                value={paracetamolLevel}
                onChange={e => setParacetamolLevel(Math.max(0, Number(e.target.value)))}
                min="0"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-205">
              <span className="font-extrabold text-slate-400 uppercase text-[9px]">Saptanan Risk Düzeyi</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                nomogramSummary.risk.includes("YÜKSEK") ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-white'
              }`}>
                {nomogramSummary.risk}
              </span>
            </div>
            <p className="pt-2.5 font-semibold text-slate-600 leading-relaxed font-sans italic">
              Tedavi Direktifi: <span className="font-extrabold text-slate-800">{nomogramSummary.rec}</span>
            </p>
          </div>

          <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-2xl text-[10px] text-red-800 font-semibold leading-relaxed">
            Not: Nomogram ölçümleri alımlardan en az 4 saat sonra anlamlıdır. Alım anı tam bilinmiyorsa doğrudan klinik konsültasyon ve ampirik tedavi endikedir.
          </div>
        </div>

      </div>

      {/* EMERGENCY SERVICES QUICK CODES */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-[2.2rem] text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-red-500">
            <PhoneCall size={24} className="animate-bounce" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase">Zehir Danışma Telefon Hattı</h4>
            <p className="text-xs text-slate-400">Ulusal Zehir Danışma Merkezi (UZEM) Acil Çağrı Koordinasyonu</p>
          </div>
        </div>
        
        <p className="text-4xl font-black text-rose-500 font-mono tracking-tighter">114</p>
      </div>
    </div>
  );
}
