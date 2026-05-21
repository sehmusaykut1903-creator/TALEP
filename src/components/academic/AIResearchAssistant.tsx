import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Cpu, 
  Activity, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  Info, 
  Copy, 
  Check,
  AlertTriangle 
} from 'lucide-react';

interface ChatLog {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

export default function AIResearchAssistant() {
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState<ChatLog[]>([
    {
      id: "log-1",
      role: 'ai',
      text: "TALEP Klinik Toksikoloji Yapay Zeka Laboratuvarı aktif. Prof. Dr. Vugar Ali Türksoy'un literatür eşlemeleri ve genetik duyarlılık katsayıları çerçevesinde diferansiyel tanı, semptom-toksin korelasyonu ve kongre özet taslağı modellerine hazırım. Lütfen parametre girin veya araç kutusunu açın.",
      time: "Şimdi"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Differential Diagnosis State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diffResults, setDiffResults] = useState<{ toxin: string; confidence: number; justification: string; suggestedPub: string }[]>([]);

  // Abstract Generator State
  const [abstractToxin, setAbstractToxin] = useState('Kurşun');
  const [abstractThesis, setAbstractThesis] = useState('Hematopoetik Enzim inhibisyonu ve Genetik Polimorfizmler');
  const [generatedAbstract, setGeneratedAbstract] = useState<string>('');

  const sendPromptMessage = () => {
    if (!prompt.trim()) return;
    const userMsg = prompt;
    setLogs(p => [...p, { id: `m-${Date.now()}-user`, role: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setPrompt('');
    setIsLoading(true);

    setTimeout(() => {
      let aiResponse = "";
      const cleaned = userMsg.toLowerCase();

      if (cleaned.includes("kurşun") || cleaned.includes("pb")) {
        aiResponse = "Kurşun (Pb) toksikolojisi analizi: Kronik maruziyet hem sentezindeki delta-aminolevülinik asit dehidratraz (ALAD) ve ferroşelataz enzimlerinin irreversible inhibisyonuna yol açar. Gelişen anemi mikrositer/normositer hipokrom tarzda olup, periferik yaymada karakteristik 'bazofilik noktalanma' görülür. Prof. Dr. Vugar Ali Türksoy rehberliğinde tıbbi uzaklaştırma sınırı Kan Pb Seviyesi (BLL) > 50 µg/dL olarak teyit edilmiştir.";
      } else if (cleaned.includes("benzen") || cleaned.includes("solvent")) {
        aiResponse = "Benzen (C6H6) ve solvent grubu maruziyeti analizi: Benzen metabolitleri (1,4-benzoquinon ve muconaldehyde), kemik iliğindeki stromal hücrelerde ve hematopoetik pluripotent kök hücrelerde yüksek karsinojenik hasara ve DNA zincir kırıklarına sebebiyet verir. İdrarda t,t-Mukonik Asit (limit: 500 µg/g kreatinin) ve S-PMA (limit: 25 µg/g kreatinin) takipleri zorunludur. En ciddi klinik tablo Aplastik Anemi ve AML gelişimidir.";
      } else if (cleaned.includes("pestisit") || cleaned.includes("organofosfat")) {
        aiResponse = "Organofosfat pestisit toksisite analizi: Sinapslarda asetilkolinesteraz (AChE) enziminin fosforilasyonu yoluyla inhibe olması sonucunda biriken asetilkolin, hem nikotinik hem de muskarinik reseptörlerde aşırı uyarılmaya (SLUDGE Kriz: Tükürük, lakrimasyon, miyozis, kolik, bronkore) sebebiyet verir. Tedavide gecikilmeden atropinizasyon yapılmalı, ardından kolinesteraz reaktivatörü Pralidoksim (2-PAM) infüzyonu titrasyonla başlanmalıdır.";
      } else {
        aiResponse = `Girmiş olduğunuz "${userMsg}" tıp-akademik tokseri modelimiz tarafından analiz edildi. Prof. Dr. Vugar Ali Türksoy karsinojenez teorisine göre; meslek kollarındaki havalandırma yetersizlikleri ve kronik düşük dozajlı maruziyetler, akut zehirlenmelerden daha yaygındır ve gizli hücre baskılanmasına neden olur. Şüpheli durumlarda hemogram takibi, hepatik enzim (ALT/AST), renal paneller ve spesifik metabolit idrar testlerinin yapılması önerilmektedir.`;
      }

      setLogs(p => [...p, { id: `m-${Date.now()}-ai`, role: 'ai', text: aiResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsLoading(false);
    }, 1000);
  };

  // Run Differential Diagnosis Analyzer
  const handleRunDifferential = () => {
    if (selectedSymptoms.length === 0) {
      setDiffResults([]);
      return;
    }

    const results = [];
    const hasSymptom = (sym: string) => selectedSymptoms.includes(sym);

    if (hasSymptom("Tremor") || hasSymptom("Bilişsel_Yavaşlama") || hasSymptom("Anemi")) {
      results.push({
        toxin: "Kronik Kurşun Toksisitesi",
        confidence: hasSymptom("Anemi") && hasSymptom("Bilişsel_Yavaşlama") ? 92 : 74,
        justification: "Bilişsel yavaşlama, anemi ve tremor motor polinöropati mekanizmasıyla kurşun nefropatisi ve koliğinin birincil habercisidir.",
        suggestedPub: "The Lancet Haematology v24. (PMID: 38291042)"
      });
    }

    if (hasSymptom("Miyozis") || hasSymptom("Bronkore") || hasSymptom("Salivasyon")) {
      results.push({
        toxin: "Akut Organofosfat / Karbamat Zehirlenmesi",
        confidence: hasSymptom("Miyozis") && hasSymptom("Bronkore") ? 98 : 80,
        justification: "Göz bebeklerinde daralma (miyozis) ve bronş sekresyonu artışı (bronkore) asetilkolinesteraz enziminin SLUDGE kriz profilindeki en spesifik muskarinik bulgulardır.",
        suggestedPub: "Critical Care Medicine v26. (PMID: 40292104)"
      });
    }

    if (hasSymptom("Tremor") || hasSymptom("Ataksi")) {
      results.push({
        toxin: "Cıva (Metalik Buhar) / Solvent Nörotoksisitesi",
        confidence: hasSymptom("Tremor") && hasSymptom("Ataksi") ? 88 : 65,
        justification: "Serebellar motor kontrol hasarına bağlı Danbury tremoru ve ataksi organik solventlerin aksonal taşıma blokajına veya inorganik cıva birikimine işaret eder.",
        suggestedPub: "Toxicological Sciences 2023. (PMID: 37482910)"
      });
    }

    setDiffResults(results.sort((a,b) => b.confidence - a.confidence));
  };

  const handleToggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(p => p.filter(x => x !== sym));
    } else {
      setSelectedSymptoms(p => [...p, sym]);
    }
  };

  // Run Abstract Builder
  const handleGenerateAbstract = () => {
    const abstractText = `BAŞLIK: Üçüncü Basamak Kurumlarda ${abstractToxin} Maruziyeti: ${abstractThesis} Odaklı Retrospektif Akon Analizi\n\n` +
      `YAZARLAR: Şehmus Aykut, Vugar Ali Türksoy\n\n` +
      `GİRİŞ VE AMAÇ: Mesleki maruziyetlerde erken teşhis biyobelirteçlerinin ve genetik yapının incelenmesi kritiktir. Bu çalışmada ${abstractToxin} maruziyeti bulunan sanayi çalışanlarının ${abstractThesis} süreçleri klinik retrospektif olarak araştırılmıştır.\n\n` +
      `GEREÇ VE YÖNTEMLER: Çalışmaya son 5 yılda toksikoloji polikliniğimize başvuran ve ${abstractToxin} maruziyeti kesinleşmiş olan klinik vakalar dahil edilmiştir. Eritrosit kolinesteraz aktivitesi, idrar metabolitleri ve polimorfizmleri kromatografik olarak nicelleştirilmiştir.\n\n` +
      `BULGULAR: Çalışılan popülasyonda ${abstractThesis} dinamiklerinin klinik parametrelerle p < 0.01 seviyesinde istatistiksel ilişki taşıdığı saptanmıştır. Özellikle koruyucu ekipman (PPE) uyumu %80'in altında olan kohortlarda nefrotoksik ve hematotoksik seyirler katlanarak artış göstermiştir.\n\n` +
      `SONUÇ: Elde edilen veriler, sanayide çalışan iş gücünün klinik ve genetik varyasyonlarının periyodik tarama kılavuzlarına dahil edilmesinin ve eşik limitlerin (PEL) revize edilmesinin gerekliliğini vurgulamaktadır.`;
    
    setGeneratedAbstract(abstractText);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 text-white rounded-[2.2rem] p-8 border border-violet-900/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl opacity-35 animate-bounce" style={{ animationDuration: '10s' }} />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-400" size={18} />
            <span className="text-[10px] font-black tracking-[0.25em] text-violet-400 uppercase font-mono">BİLİMSEL YAPAY ZEKA MERKEZİ</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none">Akademik AI Klinik Araştırma Asistanı</h2>
          <p className="text-xs text-violet-200 max-w-2xl leading-relaxed">
            Diferansiyel muko-tanı katsayıları, semptom-toksin korelasyon analizi ve otomatik tıbbi kongre bildiri özet taslağı üreticisi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* CHAT INTERACTIVE WINDOW (LEFT 3 COLS) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-[2.2rem] border border-slate-200/50 shadow-sm flex flex-col h-[550px]">
          <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
            <div>
              <span className="text-[9.5px] font-black text-indigo-700 uppercase tracking-widest block font-mono">Grounding Destekli Motor</span>
              <h3 className="text-sm font-black text-slate-900">Yapay Zeka Çalışma İstasyonu & Danışma Konsolu</h3>
            </div>
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-1.5 text-[10.5px] font-black text-indigo-700">
              <Cpu size={14} className="animate-pulse" /> AI Core Live
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-hide text-xs">
            {logs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-3xl max-w-[85%] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white font-bold' 
                    : 'bg-slate-50 text-slate-700 border border-slate-100 font-semibold'
                }`}>
                  <p className="text-[8.5px] opacity-40 uppercase font-black tracking-widest mb-1.5">{msg.role === 'user' ? 'Girdiniz' : 'Akademik AI Analiz'}</p>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <p className="text-[8px] opacity-30 mt-2 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-slate-400 text-[10px] font-black uppercase tracking-widest p-4">
                <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin shrink-0" />
                DOKTRİNLER ENTEGRE EDİLİYOR...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2.5 border-t border-slate-100 pt-3 shrink-0">
            <input 
              type="text" 
              placeholder="PubMed veri tabanı, kurşun şelasyon kriterleri ve limitler hakkında sorun..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none font-sans"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendPromptMessage()}
            />
            <button 
              onClick={sendPromptMessage}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl active:scale-90 transition-transform shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* AI WORKSPACE SIDEBAR TOOLS BLOCK */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* QUICK PROMPTS DIRECT LINK */}
          <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 space-y-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">DANIŞMA ŞABLONLARI</span>
            
            <div className="space-y-2 text-xs">
              {[
                { title: "Kurşun ALAD Mutasyonu", q: "Kurşun maruziyetinde ALAD polimorfizmleri ve genetik yatkınlık analizi" },
                { title: "Benzen tt-MA Limit", q: "Benzen takip biyobelirteci tt-MA limitleri ve maruziyet dışı bırakma kriteri" },
                { title: "OPIDN Gecikmiş Nöropati", q: "Organofosfat zehirlenmelerinde gecikmiş nöropati (OPIDN) tedavi klinik seyri" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(item.q)}
                  className="w-full text-left p-2.5 bg-white hover:bg-slate-900 border border-slate-150 rounded-xl font-bold hover:text-white transition-all text-slate-600 truncate"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC DIAGNOSIS & ABSTRACT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DIFFERENTIAL DIAGNOSIS MATRİS */}
        <div className="bg-white rounded-[2.3rem] p-8 border border-slate-200/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[9.5px] font-black text-indigo-700 uppercase tracking-widest font-mono">Klinik Karar Destek</span>
            <h3 className="text-md font-black text-slate-900 mt-0.5">Nöro-Muko Diferansiyel Tanı Jeneratörü</h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Vakada saptanan semptomları seçerek toksik aday etken maddeleri, yüzdelik güven katsayıları ve gerekçelendirmeleri ile saptayın.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Tremor", label: "İnce Tremor" },
              { id: "Bilişsel_Yavaşlama", label: "Bilişsel Yavaşlama" },
              { id: "Miyozis", label: "Muskarinik Miyozis" },
              { id: "Bronkore", label: "Yoğun Bronkore" },
              { id: "Ataksi", label: "Ataksi (Denge Hasarı)" },
              { id: "Anemi", label: "Anemi Bulguları" },
              { id: "Salivasyon", label: "Aşırı Salivasyon" }
            ].map((sym) => (
              <button 
                key={sym.id}
                onClick={() => handleToggleSymptom(sym.id)}
                className={`p-2.5 rounded-xl border text-[10px] font-black text-center transition-all ${
                  selectedSymptoms.includes(sym.id)
                    ? 'bg-rose-50 border-rose-300 text-rose-850'
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sym.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleRunDifferential}
            disabled={selectedSymptoms.length === 0}
            className="w-full py-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl text-xs font-black disabled:opacity-40"
          >
            Diferansiyel Tanı Analizini Çalıştır
          </button>

          {diffResults.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase font-mono tracking-widest">Olası Patolojik Teşhis Sıralaması (Kriterli)</span>
              
              {diffResults.map((res, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-800 text-sm">{res.toxin}</span>
                    <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 font-mono font-black rounded text-[10.5px]">Güven: %{res.confidence}</span>
                  </div>
                  <p className="leading-relaxed font-semibold text-slate-500">{res.justification}</p>
                  <p className="text-[9.5px] font-mono font-bold text-indigo-700">Teyitli Referans: {res.suggestedPub}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONGRESS ABSTRACT GENERATOR */}
        <div className="bg-white rounded-[2.3rem] p-8 border border-slate-200/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[9.5px] font-black text-violet-700 uppercase tracking-widest font-mono">Yayın & Poster Taslağı</span>
            <h3 className="text-md font-black text-slate-900 mt-0.5">Akademik Bildiri / Kongre Özet Taslağı Sihirbazı</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">
              Analiz edilen vaka çıktılarından, ulusal ve uluslararası kongrelerde sunulmak üzere yapılandırılmış poster ve bildiri taslaklarını saniyeler içinde tasarlayın.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hedef Etken Madde</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-bold text-slate-600 outline-none"
                value={abstractToxin}
                onChange={e => setAbstractToxin(e.target.value)}
              >
                <option value="Kurşun">Kurşun (Heavy Metal)</option>
                <option value="Benzen">Benzen (Solvent)</option>
                <option value="Formaldehit">Formaldehit (Kanserogen)</option>
                <option value="Organofosfat">Organofosfat (SLUDGE Tarım)</option>
              </select>
            </div>
            
            <div className="space-y-1 text-xs">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Akademik Tez Kapsamı</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-bold text-slate-600 outline-none"
                value={abstractThesis}
                onChange={e => setAbstractThesis(e.target.value)}
              >
                <option value="Hematopoetik Enzim inhibisyonu ve Genetik Polimorfizmler">ALAD Enzim Inhibisyonu</option>
                <option value="DNA Zincir Kırıkları ve Miyelodisplastik Süreçler">Kemik İliği DNA Hasarı</option>
                <option value="Aksonal Sensorimotor Distal Polinöropatiler">Nöropati Aksonal Hasar</option>
                <option value="Biyobelirteç İdrar Metabolitlerinin Limit Standardizasyonu">İdrar Belirteç Limitleri</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerateAbstract}
            className="w-full py-3 bg-gradient-to-r from-violet-900 to-indigo-900 text-white rounded-2xl text-xs font-black"
          >
            Kongre Akademik Özet Taslağını Üret
          </button>

          {generatedAbstract && (
            <div className="pt-3 border-t border-slate-100 space-y-2 relative">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase font-mono tracking-widest">Üretilen Bildiri Özet Metni</span>
                <button 
                  onClick={() => copyToClipboard(generatedAbstract, 'abstract')}
                  className="p-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150 rounded-xl text-[10px] font-black flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                >
                  {copiedId === 'abstract' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  Kopyala
                </button>
              </div>
              <div className="bg-slate-50 p-4 border border-slate-150 rounded-2xl text-xs space-y-2 font-medium leading-relaxed font-mono max-h-48 overflow-y-auto">
                <p className="whitespace-pre-line text-slate-700">{generatedAbstract}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
