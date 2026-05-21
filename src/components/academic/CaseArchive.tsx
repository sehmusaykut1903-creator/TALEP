import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Users, 
  Layers, 
  Scale, 
  ShieldAlert, 
  BookOpen, 
  Activity, 
  FileSpreadsheet, 
  ChevronRight,
  Info 
} from 'lucide-react';

interface PatientCase {
  id: string;
  name: string;
  ageSex: string;
  sector: string;
  unit: string;
  exposureDuration: string;
  symptoms: string[];
  biomarkers: {
    name: string;
    value: string;
    status: 'Normal' | 'Yüksek' | 'Kritik';
  }[];
  severity: 'Açık_Tehlike' | 'Ciddi' | 'Orta';
  imagingNotes: string;
  clinicalDiscussion: string;
  treatmentHistory: string;
  outcome: 'Şifa_Taburcu' | 'İş_Değişikliği_Takip' | 'Tedavi_Sürüyor';
}

const patientArchive: PatientCase[] = [
  {
    id: "vaka-01",
    name: "Seyfi B. (Anonymized)",
    ageSex: "42, Erkek",
    sector: "Akümülatör İmalatı",
    unit: "Izgara Eritme / Kurşun Döküm",
    exposureDuration: "8 Yıl",
    symptoms: ["Kronik Kabızlık", "Bilek Düşmesi (Hafif)", "Burton Çizgileri", "Genel Halsizlik", "Bilişsel Yavaşlama"],
    biomarkers: [
      { name: "Kan Kurşun Seviyesi (BLL)", value: "64 µg/dL", status: 'Kritik' },
      { name: "Çinko Protoporfirin (ZPP)", value: "120 µg/dL", status: 'Kritik' },
      { name: "Hemoglobin", value: "9.5 g/dL", status: 'Yüksek' }
    ],
    severity: "Açık_Tehlike",
    imagingNotes: "Direkt batın grafisinde kurşun koliğine eşlik eden intestinal obstrüksiyona benzer spazm görünümü; akciğer grafisi normal.",
    clinicalDiscussion: "Prof. Dr. Vugar Ali Türksoy Değerlendirmesi: Bll > 50 µg/dL tespitiyle acil tıbbi uzaklaştırma verilmiştir. Süksimer (DMSA) bazlı oral şelasyon tedavisine başlandı. ALAD enzim inhibisyon hızı genetik takipli kontrol planına alındı.",
    treatmentHistory: "Ağızdan DMSA 10 mg/kg günde 3 defa 5 gün, ardından 14 gün boyunca günde 2 defa. İş yeri çalışma alanı denetlendi.",
    outcome: "İş_Değişikliği_Takip"
  },
  {
    id: "vaka-02",
    name: "Metin K. (Anonymized)",
    ageSex: "29, Erkek",
    sector: "Deri / Ayakkabı Grubu",
    unit: "Solventli Yapıştırma / Bant Hattı",
    exposureDuration: "3 Yıl",
    symptoms: ["Eldiven-Çorap Tarzı Uyuşma", "Sensörimotor Polinöropati", "İntansiyonel Ataksi", "Baş Ağrıları"],
    biomarkers: [
      { name: "İdrar 2,5-Heksandion", value: "3.2 mg/L", status: 'Kritik' },
      { name: "ALT/AST Karaciğer", value: "82 / 94 U/L", status: 'Yüksek' },
      { name: "Lökosit (WBC)", value: "4.1 x 10³/µL", status: 'Normal' }
    ],
    severity: "Ciddi",
    imagingNotes: "Elektromiyografi (EMG) sonucunda distal aksonal sensorimotor polinöropati teyit edilmiştir. Ek ekstremite MR bulgusunda patoloji saptanmadı.",
    clinicalDiscussion: "Çalışma ortamındaki havalandırma yetersizliği sonucu oluşan n-Hekzan toksikasyonu. B vitamin kompleksleri ve antioksidan lipoik asit protokolü açılmış, solvent teması kesin olarak durdurulmuştur.",
    treatmentHistory: "Haftalık fizik tedavi entegrasyonu, Alpha Lipoic Acid 600mg, iş sahası iyileştirmesi.",
    outcome: "Şifa_Taburcu"
  },
  {
    id: "vaka-03",
    name: "Meltem Y. (Anonymized)",
    ageSex: "35, Kadın",
    sector: "Tarım / Sera Girişimi",
    unit: "Kimyasal Pestisit Püskürtme",
    exposureDuration: "4 Ay (Akut Kriz)",
    symptoms: ["Aşırı Salivasyon (Muzdarip)", "Miyozis", "Aşırı Bronkore", "Kas Fasikülasyonları", "Bulantı/Kusma"],
    biomarkers: [
      { name: "Psödokolinesteraz (PChE)", value: "1850 U/L", status: 'Kritik' },
      { name: "Eritrosit AChE", value: "%35 Baskı", status: 'Kritik' },
      { name: "Kan Gazı pH", value: "7.32 (Hafif Asidoz)", status: 'Yüksek' }
    ],
    severity: "Açık_Tehlike",
    imagingNotes: "Bilgisayarlı Göğüs Tomografisi (Sanal Akciğer): Yoğun bronkoreye bağlı infiltrasyon, pulmoner sekresyon kümülasyonu saptandı.",
    clinicalDiscussion: "Organofosfat SLUDGE krizi saptanan vaka yoğun bakıma alınmıştır. Acil atropinizasyon yapılmış, kolinesteraz reaktivasyonu amacıyla pralidoksim infüzyonu titrasyonla verilmiştir.",
    treatmentHistory: "Yoğun Bakım: IV Atropin 2mg her 10 dakikada bir, 30 mg/kg Pralidoxime infüzyonu. Tam dermal dekontaminasyon sağlandı.",
    outcome: "Tedavi_Sürüyor"
  }
];

export default function CaseArchive() {
  const [activeCase, setActiveCase] = useState<PatientCase>(patientArchive[0]);
  const [searchWord, setSearchWord] = useState('');
  
  // Side-by-Side Comparison Engine States
  const [compCaseAId, setCompCaseAId] = useState<string>(patientArchive[0].id);
  const [compCaseBId, setCompCaseBId] = useState<string>(patientArchive[1].id);

  const filterCases = patientArchive.filter(cs => 
    cs.name.toLowerCase().includes(searchWord.toLowerCase()) || 
    cs.sector.toLowerCase().includes(searchWord.toLowerCase()) ||
    cs.severity.toLowerCase().includes(searchWord.toLowerCase())
  );

  const compareA = patientArchive.find(c => c.id === compCaseAId) || patientArchive[0];
  const compareB = patientArchive.find(c => c.id === compCaseBId) || patientArchive[1];

  return (
    <div className="space-y-8">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-[2.2rem] p-8 border border-rose-955 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl opacity-35 animate-pulse" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-rose-400" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-rose-400 uppercase font-mono">VAKA DOKTRİNİ VE ARŞİV</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Anetolog ve Klinik Toksikoloji Vaka Arşivi</h2>
          <p className="text-xs text-rose-200 max-w-2xl leading-relaxed">
            Hekim onaylı, QR kodlu klinik doğrulamalarla desteklenen klinisyen vaka kayıtları, laboratuvar seyrileri ve tedavi protokolü karşılaştırma hücresi.
          </p>
        </div>
      </div>

      {/* COMPARISON ENGINE BLOCK (SIDE BY SIDE COMPARISON) */}
      <div className="bg-white rounded-[2.3rem] p-6 border border-slate-200/50 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
          <div>
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-mono">Klinik Karar Araştırmaları</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Etkileşimli İkili Vaka Karşılaştırma Laboratuvarı</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-55 p-1 rounded-2xl border border-slate-200">
              <select 
                className="bg-transparent text-[10.5px] font-black text-slate-600 outline-none px-2.5 py-1.5 cursor-pointer max-w-[150px]"
                value={compCaseAId}
                onChange={e => setCompCaseAId(e.target.value)}
              >
                {patientArchive.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[0]}</option>)}
              </select>
              <span className="text-xs text-slate-400 font-bold px-1">vs</span>
              <select 
                className="bg-transparent text-[10.5px] font-black text-slate-600 outline-none px-2.5 py-1.5 cursor-pointer max-w-[150px]"
                value={compCaseBId}
                onChange={e => setCompCaseBId(e.target.value)}
              >
                {patientArchive.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[0]}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COMPARISON DOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient A */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9.5px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">VAKA GRUBU - A</span>
                <h4 className="font-black text-base text-slate-800 mt-1">{compareA.name}</h4>
                <p className="text-[10px] text-slate-400">{compareA.ageSex} | {compareA.sector}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                compareA.severity === 'Açık_Tehlike' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
              }`}>{compareA.severity}</span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Birim / Maruz Sene:</span>
                <span className="font-bold text-slate-700">{compareA.unit} ({compareA.exposureDuration})</span>
              </div>
              
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Önemli Biyobelirteçler & Değer:</span>
                {compareA.biomarkers.map((b, i) => (
                  <div key={i} className="flex justify-between font-medium">
                    <span className="text-slate-600">{b.name}</span>
                    <span className={`font-mono font-bold ${b.status === 'Kritik' ? 'text-red-600' : 'text-slate-600'}`}>{b.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Klinik Önlemler / Müdahale:</span>
                <p className="text-[11px] font-semibold text-slate-600 leading-relaxed italic bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/40">
                  {compareA.treatmentHistory}
                </p>
              </div>
            </div>
          </div>

          {/* Patient B */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9.5px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase">VAKA GRUBU - B</span>
                <h4 className="font-black text-base text-slate-800 mt-1">{compareB.name}</h4>
                <p className="text-[10px] text-slate-400">{compareB.ageSex} | {compareB.sector}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                compareB.severity === 'Açık_Tehlike' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
              }`}>{compareB.severity}</span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Birim / Maruz Sene:</span>
                <span className="font-bold text-slate-700">{compareB.unit} ({compareB.exposureDuration})</span>
              </div>
              
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Önemli Biyobelirteçler & Değer:</span>
                {compareB.biomarkers.map((b, i) => (
                  <div key={i} className="flex justify-between font-medium">
                    <span className="text-slate-600">{b.name}</span>
                    <span className={`font-mono font-bold ${b.status === 'Kritik' ? 'text-red-600' : 'text-slate-600'}`}>{b.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Klinik Önlemler / Müdahale:</span>
                <p className="text-[11px] font-semibold text-slate-600 leading-relaxed italic bg-rose-50/50 p-3 rounded-2xl border border-rose-100/40">
                  {compareB.treatmentHistory}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND INDIVIDUAL CASE SHEET STREAMS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left selector */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2.2rem] border border-slate-200/50 flex flex-col h-[500px]">
          <div className="relative shrink-0 pb-4">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Vaka veya Sektör ara..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-bold outline-none"
              value={searchWord}
              onChange={e => setSearchWord(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide">
            {filterCases.map((cs) => (
              <button 
                key={cs.id}
                onClick={() => setActiveCase(cs)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-bold flex flex-col ${
                  activeCase.id === cs.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between w-full items-start">
                  <span className="truncate max-w-[120px] font-black">{cs.name}</span>
                  <span className={`text-[8.5px] font-black uppercase ${activeCase.id === cs.id ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {cs.id}
                  </span>
                </div>
                <span className={`text-[10px] mt-0.5 font-semibold ${activeCase.id === cs.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {cs.sector}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Individual case sheet */}
        {activeCase && (
          <div className="lg:col-span-3 bg-white p-8 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-6 h-[500px] overflow-y-auto scrollbar-hide">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase">AKTİF SEÇİM</span>
                  <span className="text-xs font-mono font-bold text-slate-400">Verifikasyon No: TALEP-HOSP-{activeCase.id}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1 uppercase">{activeCase.name} Klinik Dosyası</h3>
                <p className="text-xs text-slate-500 font-bold">Demografik Veriler: {activeCase.ageSex} | Sektör: {activeCase.sector}</p>
              </div>

              <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-center shrink-0">
                <span className="text-[8.5px] font-black text-indigo-700 uppercase tracking-widest block font-mono">Tedavi Sonucu</span>
                <span className="text-xs font-bold text-indigo-800 uppercase font-sans mt-0.5 block">{activeCase.outcome.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-black uppercase">Maruz Kalınan Birim</span>
                <p className="text-slate-800 text-sm font-black mt-1 leading-none">{activeCase.unit}</p>
                <span className="text-[10.5px] text-slate-500 block">Süre: {activeCase.exposureDuration}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                <span className="text-[9px] text-slate-400 font-black uppercase">Aktif Semptom Kompleksi</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeCase.symptoms.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white text-slate-700 rounded-lg text-[10.5px] border border-slate-150 font-bold">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Imaging & radiology block with negative-contrast visual */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Tıbbi Görüntüleme & Sanal Radyoloji Raporu</span>
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[8.5px] font-black text-rose-500 uppercase tracking-wider blink">EK RAPOR PANELİ</div>
                <p className="text-xs leading-relaxed font-mono opacity-90">{activeCase.imagingNotes}</p>
              </div>
            </div>

            {/* Academic clinically validated discussion notes */}
            <div className="p-5 bg-indigo-50/60 border border-indigo-100/30 rounded-2xl flex gap-3 text-xs leading-relaxed font-medium">
              <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9.5px] font-black text-indigo-700 block uppercase mb-1">Klinik Doğrulama & Laboratuvar Görüşmeleri</span>
                <p className="text-slate-700 italic font-semibold">{activeCase.clinicalDiscussion}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
