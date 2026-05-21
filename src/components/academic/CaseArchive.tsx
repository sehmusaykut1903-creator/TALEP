import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Info,
  Calendar,
  AlertTriangle,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { PDFReportHub } from './PDFReportHub';

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
    symptoms: ["Kronik Kabızlık (Kurşun Koliği)", "Bilek Düşmesi (Distal Motor Nöropati)", "Burton Çizgileri", "Genel Halsizlik", "Bilişsel Yavaşlama"],
    biomarkers: [
      { name: "Kan Kurşun Seviyesi (BLL)", value: "64 µg/dL", status: 'Kritik' },
      { name: "Çinko Protoporfirin (ZPP)", value: "120 µg/dL", status: 'Kritik' },
      { name: "Hemoglobin (Hb)", value: "9.5 g/dL", status: 'Kritik' }
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
      { name: "ALT/AST Karaciğer Enzimi", value: "82 / 94 U/L", status: 'Yüksek' },
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
  },
  {
    id: "vaka-04",
    name: "Ahmet T. (Anonymized)",
    ageSex: "51, Erkek",
    sector: "Petrokimya Rafinerisi",
    unit: "Tank Temizleme & Bakım",
    exposureDuration: "12 Yıl",
    symptoms: ["Halsizlik", "Uçucu Diş Eti Kanamaları", "Peteşi ve Purpura", "Kilo Kaybı", "Tekrarlayan Ateş"],
    biomarkers: [
      { name: "Lökosit (WBC) Sayımı", value: "2.1 x 10³/µL", status: 'Kritik' },
      { name: "Trombosit (PLT) Sayımı", value: "45 x 10³/µL", status: 'Kritik' },
      { name: "İdrar s-Fenilmercaptürik Asit", value: "85 µg/g kreatinin", status: 'Kritik' }
    ],
    severity: "Açık_Tehlike",
    imagingNotes: "Kemik iliği aspirasyonu ve biyopsisinde hiposellülerite ve myelodisplastik değişiklikler (MDS - Benzen maruziyeti ilişkili) saptanmıştır.",
    clinicalDiscussion: "Benzen maruziyetine bağlı gelişen Myelodisplastik Sendrom (MDS) tablosu. Çalışanın maruziyeti kesin olarak durdurulmuş, hematoloji kliniğine sevk edilerek kemik iliği nakli adayı olarak izleme alınmıştır.",
    treatmentHistory: "Tam kan transfüzyonları ve sitokin stimülasyon tedavisi. İşyeri benzen sızıntı denetimi başlatılmıştır.",
    outcome: "İş_Değişikliği_Takip"
  },
  {
    id: "vaka-05",
    name: "Kemal R. (Anonymized)",
    ageSex: "38, Erkek",
    sector: "Metal Kaplama (Galvaniz)",
    unit: "Asit Banyoları & Kromaj",
    exposureDuration: "5 Yıl",
    symptoms: ["Burun Septum Perforasyonu (Yara)", "Kronik Rinit", "Temas Dermatiti", "Kuru Öksürük"],
    biomarkers: [
      { name: "İdrar Toplam Krom", value: "42 µg/g kreatinin", status: 'Kritik' },
      { name: "Eritrosit İçi Krom", value: "2.8 µg/L", status: 'Kritik' },
      { name: "Serum IgE", value: "280 IU/mL", status: 'Yüksek' }
    ],
    severity: "Ciddi",
    imagingNotes: "Burun endoskopisinde septumda 1.2 cm çapında perforasyon; akciğer grafisinde hafif hiler lenfadenopati tespiti.",
    clinicalDiscussion: "Krom-VI duman solunmasına bağlı gelişen aşındırıcı burun perforasyonu ve alerjik alveolit tablosu. Metal kaplama banyosunda lokal aspirasyon sisteminin bozulduğu teyit edilmiştir.",
    treatmentHistory: "Lokal nazal nemlendiriciler ve kortikosteroidli merhemler; kroma maruz kalan birimden uzaklaştırma.",
    outcome: "İş_Değişikliği_Takip"
  },
  {
    id: "vaka-06",
    name: "Zeynep U. (Anonymized)",
    ageSex: "45, Kadın",
    sector: "Tekstil ve Konfeksiyon",
    unit: "Kumaş Terbiye & Pres",
    exposureDuration: "9 Yıl",
    symptoms: ["Egzersiz Dispnesi", "Hışıltılı Solunum (Wheezing)", "Gözlerde Yanma ve Lakrimasyon", "Kuru Mukozalar"],
    biomarkers: [
      { name: "SFT FEV1/FVC Katsayısı", value: "%64 (Obstrüktif)", status: 'Kritik' },
      { name: "İdrar Format Analizi", value: "65 mg/L", status: 'Yüksek' },
      { name: "Reversibilite Testi SFT", value: "+%15 İyileşme", status: 'Normal' }
    ],
    severity: "Orta",
    imagingNotes: "HRCT Akciğer Tomografisi: Bronşiyal duvarlarda kalınlaşma ve hava hapsi bulguları saptanmıştır.",
    clinicalDiscussion: "Tekstil pres dumanında açığa çıkan formaldehit gazına bağlı gelişen Mesleki Astım tablosu. Çalışma odasındaki nem ve sıcaklık regülasyonunun formaldehit salınımını tetiklediği belirlenmiştir.",
    treatmentHistory: "İnhaler kortikosteroid ve bronkodilatör tedavisi; maske kullanım standardının iyileştirilmesi.",
    outcome: "Şifa_Taburcu"
  },
  {
    id: "vaka-07",
    name: "Süleyman D. (Anonymized)",
    ageSex: "58, Erkek",
    sector: "Pil ve Akü Geri Dönüşüm",
    unit: "Plastik Kılıf Ayıklama",
    exposureDuration: "14 Yıl",
    symptoms: ["Şiddetli Kemik Ağrıları (Bel/Kalça)", "Yürüme Güçlüğü", "Proteinüri ve Hematüri", "Kronik Yorgunluk"],
    biomarkers: [
      { name: "İdrar Kadmiyum Seviyesi", value: "11.2 µg/g kreatinin", status: 'Kritik' },
      { name: "İdrar Beta-2-Mikroglobulin", value: "1550 µg/g kreatinin", status: 'Kritik' },
      { name: "Serum Kreatinin", value: "1.9 mg/dL", status: 'Kritik' }
    ],
    severity: "Açık_Tehlike",
    imagingNotes: "DEXA Kemik Taraması: T-skoru -3.4 (Şiddetli Osteoporoz/Osteomalazi). Pelvis grafisinde patolojik psödokırık hatları (Itai-Itai sendromu).",
    clinicalDiscussion: "Kronik Kadmiyum nefrotoksisitesine bağlı gelişen Fanconi benzeri proksimal tübül hasarı ve renal osteomalazi tablosu.",
    treatmentHistory: "Kalsitriol (Aktif D-Vit), Kalsiyum replasmanı, fosfat bağlayıcılar; böbrek koruyucu tıbbi tedavi.",
    outcome: "Tedavi_Sürüyor"
  },
  {
    id: "vaka-08",
    name: "Ayhan S. (Anonymized)",
    ageSex: "33, Erkek",
    sector: "Diş Hekimliği Kliniği",
    unit: "Manuel Amalgam Dolgu Hazırlığı",
    exposureDuration: "4 Yıl",
    symptoms: ["İntansiyonel El Tremoru", "Anksiyete ve Aşırı Sinirlilik (Erethism)", "Metalik Tat Hissi", "Uykusuzluk"],
    biomarkers: [
      { name: "İdrar Cıva Seviyesi", value: "32 µg/g kreatinin", status: 'Kritik' },
      { name: "Kan Cıva Düzeyi", value: "18 µg/L", status: 'Kritik' },
      { name: "Serum Albümin", value: "4.1 g/dL", status: 'Normal' }
    ],
    severity: "Ciddi",
    imagingNotes: "Kranial MRG: Normal beyin morfolojisi; EEG'de hafif yaygın teta yavaşlaması bulgusu saptandı.",
    clinicalDiscussion: "Dental cıva buharının inhalasyonu ile gelişen cıva nörotoksisitesi (erethism ve cıva tremoru). Klinikte maskeli amalgam kapsüllerine geçilmiş ve aktif karbon filtre montajlanmıştır.",
    treatmentHistory: "Oral Penisilamin şelasyonu 250 mg günde 4 defa 10 gün. Nörolojik motor rehabilitasyon desteği.",
    outcome: "Şifa_Taburcu"
  },
  {
    id: "vaka-09",
    name: "Cemil G. (Anonymized)",
    ageSex: "47, Erkek",
    sector: "Geri Dönüşüm ve Gemi Söküm",
    unit: "Asetilen Meşalesi ile Kesim",
    exposureDuration: "11 Yıl",
    symptoms: ["Kuru Öksürük", "Göğüste Sıkışma", "Egzersiz Sırasında Hızlı Soluk Nefes Durumu", "Parmaklarda Çomaklaşma"],
    biomarkers: [
      { name: "DLCO Solunum Difüzyonu", value: "%55 (Düşük)", status: 'Kritik' },
      { name: "Serum SMRP (Mesothelin)", value: "2.1 nM", status: 'Yüksek' },
      { name: "FVC Akciğer Kapasitesi", value: "%61", status: 'Kritik' }
    ],
    severity: "Açık_Tehlike",
    imagingNotes: "Yüksek çözünürlüklü göğüs tomografisi (HRCT): Plevral plaklar, diyafragmatik kalsifikasyonlar ve bazal bölgelerde retiküler infiltrasyon (Asbestosis).",
    clinicalDiscussion: "Eski yalıtımlı buhar borularının kontrolsüz kesilmesiyle oluşan asbest lif inhalasyonu ve asbestozis tablosu. Mezotelyoma saptanmamıştır fakat risk yüksektir.",
    treatmentHistory: "Oksijen desteği, anti-inflamatuar tedavi, aşılama programları (pnömokok/influenza), koruyucu solunum eğitimleri.",
    outcome: "Tedavi_Sürüyor"
  },
  {
    id: "vaka-10",
    name: "Tuncay V. (Anonymized)",
    ageSex: "31, Erkek",
    sector: "Oto Sanayi ve Boya",
    unit: "Sentetik Tiner Pres & Karışım",
    exposureDuration: "6 Yıl",
    symptoms: ["Çift Taraflı İşitme Kaybı", "Başağrıları", "Karaciğer Bölgesinde Hassasiyet", "Baş Dönmesi"],
    biomarkers: [
      { name: "İdrar Hipürik Asit", value: "2.1 g/g kreatinin", status: 'Kritik' },
      { name: "High-Frequency Odyogram", value: "4000 Hz'de 45 dB kayıp", status: 'Kritik' },
      { name: "ALT Enzimi", value: "110 U/L", status: 'Yüksek' }
    ],
    severity: "Ciddi",
    imagingNotes: "Abdominal Doppler Ultrasonografi: Derece 2 hepatosteatoz (Karaciğer yağlanması - solvent maruziyeti ile ilişkili toksik hepatit bulgusu).",
    clinicalDiscussion: "Otolog toluen toksikasyonunun gürültü ile sinerjik birleşmesiyle indüklenen mesleki sensorinöral işitme kaybı ve hepatotoksisite.",
    treatmentHistory: "Gürültü ve solvent maruziyeti durdurulmuş, karaciğer koruyucu diyet ve silimarin takviyesi başlanmıştır.",
    outcome: "İş_Değişikliği_Takip"
  }
];

export default function CaseArchive() {
  const [activeCase, setActiveCase] = useState<PatientCase>(patientArchive[0]);
  const [searchWord, setSearchWord] = useState('');
  const [isReportHubOpen, setIsReportHubOpen] = useState(false);
  
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
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-[2.2rem] p-8 border border-rose-950 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-rose-400 animate-pulse" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-rose-400 uppercase font-mono">KLİNİK VAKA VERİ MODELİ</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase leading-none">Anabilim Dalı Ham Vaka & Klinik Arşiv Sistemi</h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Hekim onaylı, QR doğrulamalı ve anorimize edilmiş gerçek mesleki toksikoloji vakası, laboratuvar seyrileri ve çapraz karşılaştırma süzgeçleri.
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
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <select 
                className="bg-transparent text-[10.5px] font-black text-slate-600 outline-none px-2.5 py-1.5 cursor-pointer max-w-[200px]"
                value={compCaseAId}
                onChange={e => setCompCaseAId(e.target.value)}
              >
                {patientArchive.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[0]} - {p.sector}</option>)}
              </select>
              <span className="text-xs text-slate-400 font-bold px-1">vs</span>
              <select 
                className="bg-transparent text-[10.5px] font-black text-slate-600 outline-none px-2.5 py-1.5 cursor-pointer max-w-[200px]"
                value={compCaseBId}
                onChange={e => setCompCaseBId(e.target.value)}
              >
                {patientArchive.map(p => <option key={p.id} value={p.id}>{p.name.split(' ')[0]} - {p.sector}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COMPARISON MATRIX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CASE A */}
          <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/60 shadow-inner space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-indigo-650 font-black">VAKA KODU: {compareA.id.toUpperCase()}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                compareA.severity === 'Açık_Tehlike' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              }`}>{compareA.severity.replace('_', ' ')}</span>
            </div>
            
            <h4 className="text-md font-black text-slate-800">{compareA.name} <span className="text-xs text-slate-400">({compareA.ageSex})</span></h4>
            
            <div className="text-[11px] font-semibold text-slate-500 space-y-1">
              <div>Sektör/Unite: <span className="font-extrabold text-slate-700">{compareA.sector} / {compareA.unit}</span></div>
              <div>Temas Süresi: <span className="font-bold text-slate-755">{compareA.exposureDuration}</span></div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Biyobelirteç Değerleri</span>
              <div className="space-y-1.5">
                {compareA.biomarkers.map((b, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded-xl border border-slate-100 flex justify-between items-center text-[11.5px] font-bold">
                    <span className="text-slate-650">{b.name}</span>
                    <span className={`px-2 py-0.5 rounded font-mono ${
                      b.status === 'Kritik' ? 'text-rose-600 bg-rose-50 font-black' : 'text-slate-700 bg-slate-50'
                    }`}>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Klinik Değerlendirme & Konsültasyon</span>
              <p className="text-xs text-slate-650 font-medium bg-white/70 p-3.5 rounded-2xl border border-slate-100 italic leading-relaxed">
                "{compareA.clinicalDiscussion}"
              </p>
            </div>
          </div>

          {/* CASE B */}
          <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/60 shadow-inner space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-indigo-655 font-black">VAKA KODU: {compareB.id.toUpperCase()}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                compareB.severity === 'Açık_Tehlike' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              }`}>{compareB.severity.replace('_', ' ')}</span>
            </div>
            
            <h4 className="text-md font-black text-slate-800">{compareB.name} <span className="text-xs text-slate-400">({compareB.ageSex})</span></h4>
            
            <div className="text-[11px] font-semibold text-slate-500 space-y-1">
              <div>Sektör/Unite: <span className="font-extrabold text-slate-700">{compareB.sector} / {compareB.unit}</span></div>
              <div>Temas Süresi: <span className="font-bold text-slate-755">{compareB.exposureDuration}</span></div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Biyobelirteç Değerleri</span>
              <div className="space-y-1.5">
                {compareB.biomarkers.map((b, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded-xl border border-slate-100 flex justify-between items-center text-[11.5px] font-bold">
                    <span className="text-slate-655">{b.name}</span>
                    <span className={`px-2 py-0.5 rounded font-mono ${
                      b.status === 'Kritik' ? 'text-rose-600 bg-rose-50 font-black' : 'text-slate-700 bg-slate-50'
                    }`}>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Klinik Değerlendirme & Konsültasyon</span>
              <p className="text-xs text-slate-655 font-medium bg-white/70 p-3.5 rounded-2xl border border-slate-100 italic leading-relaxed">
                "{compareB.clinicalDiscussion}"
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SEARCH AND GRID CASE LIST & HISTOLOGY VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIST PATIENT */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2.2rem] border border-slate-200/50 shadow-sm space-y-4 h-[600px] flex flex-col justify-between">
          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Vaka Sorgulama Konsolu</span>
            
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="İsim, endüstri veya duruma göre ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-slate-600 outline-none focus:border-rose-500 transition-colors"
                value={searchWord}
                onChange={e => setSearchWord(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filterCases.map((cs) => (
                <button 
                  key={cs.id}
                  onClick={() => setActiveCase(cs)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-semibold flex items-center justify-between group cursor-pointer ${
                    activeCase.id === cs.id 
                      ? 'bg-gradient-to-r from-rose-950 to-slate-900 border-rose-955 text-white shadow-md' 
                      : 'bg-slate-55 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate flex-1">
                    <p className="font-extrabold text-[#0ea5e9] group-hover:text-rose-300 transition-colors uppercase font-mono tracking-wide text-[9px]">{cs.id.toUpperCase()}</p>
                    <p className="font-black text-sm truncate">{cs.name}</p>
                    <p className={`text-[9.5px] truncate font-medium mt-0.5 ${activeCase.id === cs.id ? 'text-slate-300' : 'text-slate-400'}`}>{cs.sector}</p>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 ${activeCase.id === cs.id ? 'text-white' : 'text-slate-350'}`} />
                </button>
              ))}
              {filterCases.length === 0 && (
                <div className="py-20 text-center text-xs text-slate-400 font-bold italic">UYGUN VAKA KAYDI BULUNAMADI</div>
              )}
            </div>
          </div>
        </div>

        {/* EXTREMELY HIGH DETAIL WORKSTATION FOR ACTIVE PATIENT */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.2rem] border border-slate-200/50 shadow-sm h-[600px] overflow-y-auto space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-[9px] font-black text-rose-700 uppercase tracking-widest font-mono block">Aktif İrtibat Dosyası</span>
              <h3 className="text-lg font-black text-slate-800 uppercase">{activeCase.name}</h3>
              <p className="text-[10px] text-slate-400 font-semibold font-mono">SEKTÖR: {activeCase.sector} &bull; TEMAS SURESI: {activeCase.exposureDuration}</p>
            </div>
            
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => setIsReportHubOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-cyan-500/10"
              >
                <FileText size={12} /> PDF RAPORU AL
              </button>
              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow-sm ${
                activeCase.severity === 'Açık_Tehlike' ? 'bg-rose-500 text-white shadow-rose-500/10' :
                activeCase.severity === 'Ciddi' ? 'bg-amber-500 text-white' :
                'bg-blue-500 text-white'
              }`}>
                {activeCase.severity.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Semptomlar */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Saptanan Giriş Semptomları</span>
            <div className="flex flex-wrap gap-2">
              {activeCase.symptoms.map((sym, idx) => (
                <span key={idx} className="px-3 py-1 bg-rose-500/5 border border-rose-500/10 text-rose-800 text-xs font-black rounded-lg flex items-center gap-1.5">
                  <Stethoscope size={11} className="text-rose-600" />
                  {sym}
                </span>
              ))}
            </div>
          </div>

          {/* Biomarkers Detail Table */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Laboratuar Serum & İdrar Biyobelirteç Karşılaştırmaları</span>
            
            <div className="space-y-2 text-xs">
              {activeCase.biomarkers.map((bio, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{bio.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-900 font-extrabold">{bio.value}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      bio.status === 'Kritik' ? 'bg-rose-500 text-white' :
                      bio.status === 'Yüksek' ? 'bg-amber-400 text-slate-900' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {bio.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Görüntüleme bulguları */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Görüntüleme / Klinik Bulgusal Notları</span>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold leading-relaxed text-slate-700">
              {activeCase.imagingNotes}
            </div>
          </div>

          {/* Klinik Görüş ve Tedavi Tarihçesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4.5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2">
              <span className="text-[9.5px] font-black text-indigo-700 uppercase tracking-widest font-mono block">Genel Konsültasyon Notu</span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                "{activeCase.clinicalDiscussion}"
              </p>
            </div>

            <div className="p-4.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-2">
              <span className="text-[9.5px] font-black text-emerald-700 uppercase tracking-widest font-mono block">Gerçekleşen Klinik Tedavi Protokolü</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {activeCase.treatmentHistory}
              </p>
            </div>
          </div>

          {/* Mevcut Durum */}
          <div className="p-4.5 bg-slate-900 text-white rounded-2xl flex justify-between items-center text-xs font-semibold">
            <span className="font-mono text-slate-400 text-[10px] uppercase font-black">Sürveyans / Taburculuk Durumu</span>
            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
              activeCase.outcome === 'Şifa_Taburcu' ? 'bg-emerald-500 text-white' :
              activeCase.outcome === 'İş_Değişikliği_Takip' ? 'bg-amber-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {activeCase.outcome.replace('_', ' ').replace('_', ' ')}
            </span>
          </div>
        </div>

      </div>

      {isReportHubOpen && (
        <PDFReportHub 
          caseData={{
            ...activeCase,
            biomarkers: activeCase.biomarkers.map(b => ({ name: b.name, value: b.value, status: b.status }))
          }} 
          onClose={() => setIsReportHubOpen(false)} 
        />
      )}
    </div>
  );
}
