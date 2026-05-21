import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  User,
  Sparkles, 
  Brain, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle,
  ClipboardList,
  Stethoscope,
  FlaskConical,
  Zap,
  CheckCircle2,
  Info,
  FileText,
  Save,
  BarChart2,
  TrendingUp,
  Sliders,
  Award,
  Database,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { 
  generateScientificReasoning, 
  saveAiChatMemory, 
  getAiChatHistory, 
  StructuredAiResponse,
  AiContext 
} from '../services/talepAiService';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  LineChart, 
  Line, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  CartesianGrid,
  Legend
} from 'recharts';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text?: string;
  structured?: StructuredAiResponse;
  timestamp: Date;
  modeUsed?: string;
}

export default function TalepAI() {
  const { theme, t } = useSettings();
  const { currentUser } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "TALEP v4.0 Bilimsel Muhakeme ve Karar Destek Sistemi aktif. Semptom, endüstriyel sektör, laboratuvar tahlilleri ve maruziyet sürelerine dayalı literatür ve toksikogenetik analizler hazır. Lütfen analiz edilmek istenen vaka parametrelerini veya sorularınızı girin.",
      timestamp: new Date(),
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Response Mode Selection
  const [selectedMode, setSelectedMode] = useState<'clinical' | 'academic' | 'emergency' | 'surveillance' | 'research'>('clinical');
  const [sessionId, setSessionId] = useState('');
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [advancedAi, setAdvancedAi] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Demographics / Static context state to inform AI reasoning
  const [context, setContext] = useState<AiContext>({
    sector: "Metal & Akü Geri Dönüşüm",
    unit: "Dökümhane & Kurşun Eritme Kazanı",
    symptoms: ["Bilişsel Yavaşlama", "Mikrositer Anemi Beyaz Değişimi", "El Titremesi (İnce Tremor)"],
    riskLevel: 'high'
  });

  const [activeTab, setActiveTab] = useState<Record<string, 'text' | 'probability' | 'progression' | 'riskRadar'>>({});

  useEffect(() => {
    setSessionId(`sess-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Fetch Firestore histories for persistent memories
  const loadHistory = async () => {
    if (currentUser?.uid) {
      setHistoryLoading(true);
      try {
        const hist = await getAiChatHistory(currentUser.uid);
        setHistoryList(hist);
      } catch (e) {
        console.error("Failed to load AI history:", e);
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    setError(null);
    const userId = currentUser ? currentUser.uid : "fallback-anonymous-user";

    const userMsg: Message = {
      id: `u-${Date.now()}-${sessionId}`,
      type: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateScientificReasoning(
        textToSend,
        context,
        selectedMode,
        messages.slice(-6).map(m => ({
          type: m.type,
          text: m.text,
          response: m.structured
        })),
        advancedAi
      );

      const aiMsg: Message = {
        id: `ai-${Date.now()}-${sessionId}`,
        type: 'ai',
        structured: response,
        timestamp: new Date(),
        modeUsed: selectedMode
      };

      setMessages(prev => [...prev, aiMsg]);

      // Automatically persist to Firebase Firestore for session memory
      if (currentUser?.uid) {
        await saveAiChatMemory(currentUser.uid, sessionId, selectedMode, textToSend, response);
        // Reload list to synchronize with dashboard sidebar
        loadHistory();
      }

    } catch (err: any) {
      console.error("AI Core routing failure:", err);
      setError(err?.message || "Hizmete erişilemedi.");
      
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        type: 'ai',
        text: "Toksikoloji motorundan geçerli bir analiz paketi alınamadı. Lütfen API bağlantınızı kontrol edin veya internet hattınızı yineleyin.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Restore historical memory record when clicked on the sidebar list
  const handleRestoreHistory = (historyItem: any) => {
    if (!historyItem?.response) return;
    
    const userMsg: Message = {
      id: `u-restored-${Date.now()}`,
      type: 'user',
      text: historyItem.question || "Kayıtlı Analiz Sürveyansı",
      timestamp: new Date()
    };

    const aiMsg: Message = {
      id: `ai-restored-${Date.now()}`,
      type: 'ai',
      structured: historyItem.response,
      timestamp: new Date(),
      modeUsed: historyItem.mode || 'clinical'
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const quickActions = [
    { label: "Kurşun Zehirlenmesi", query: "Vaka: Kan Kurşun Seviyesi (BLL) > 40 µg/dL, mikrositer anemi, karın koliği takibi", icon: FlaskConical },
    { label: "Benzen & AML Riski", query: "Boya işçisinde lökopeni (WBC 3.2), idrar tt-MA yükselişi, IARC Grup 1 yorumu", icon: Activity },
    { label: "Organofosfat Kriz", query: "Tarım işçisinde muskarinik miyozis, yoğun salivasyon (SLUDGE kriliş) acil yaklaşım", icon: Zap },
    { label: "ALAD Mutasyonu Araştır", query: "Kurşun duyarılılığında ALAD2 gen polimorfizmleri ve toksikodinamik katsayılar", icon: Brain },
    { label: "Nöro-Solvent İzlem", query: "Ayakkabı yapıştırıcı hattında el titremesi (tremor) ve aksonal nöropati analizi", icon: Sliders },
    { label: "Karaciğer Enzimi", query: "Karmatik solvent maruziyeti olan boyacıda ALT/AST transaminaz seviyeleri", icon: Stethoscope },
  ];

  const renderVisualsAndReports = (res: StructuredAiResponse, msgId: string) => {
    if (res.isCasual) {
      return (
        <div className="prose prose-slate max-w-none text-slate-800 text-xs md:text-sm leading-relaxed p-4 bg-slate-50 border border-slate-100/50 rounded-2xl animate-fade-in whitespace-pre-wrap">
          <p className="font-semibold text-slate-700">{res.rawText}</p>
        </div>
      );
    }

    const currentTab = activeTab[msgId] || 'text';

    const setMsgTab = (tabValue: 'text' | 'probability' | 'progression' | 'riskRadar') => {
      setActiveTab(prev => ({ ...prev, [msgId]: tabValue }));
    };

    return (
      <div className="space-y-4 max-w-full">
        {/* PREMIUM HORIZONTAL SUB-NAV FOR CHARTS AND REPORT TEXT */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide shrink-0 mb-4 border border-slate-200/50">
          <button 
            onClick={() => setMsgTab('text')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'text' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={13} /> Analiz Raporu
          </button>
          <button 
            onClick={() => setMsgTab('probability')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'probability' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 size={13} /> Etken Olasılık Dağılımı ({res.probabilityGraph?.length || 0})
          </button>
          <button 
            onClick={() => setMsgTab('progression')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'progression' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp size={13} /> Biyobelirteç İlerlemesi (Line)
          </button>
          <button 
            onClick={() => setMsgTab('riskRadar')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'riskRadar' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain size={13} /> Sistemsel Risk Radarı
          </button>
        </div>

        {/* COMPONENT BODY */}
        <div className="min-h-[220px]">
          {currentTab === 'text' && (
            <div className="space-y-4">
              {/* MAIN MARKDOWN CONTAINER WITH WHITESPACE LOGIC */}
              <div className="text-xs md:text-[13.5px] text-slate-800 leading-relaxed font-semibold whitespace-pre-wrap font-sans dark-report-layer">
                {res.rawText}
              </div>

              {/* OUTCOMES SUMMARY / BIOMARKERS ASSESSMENT */}
              {res.biomarkerInterpretation && (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mt-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 block mb-1">Moleküler & Biyokimyasal Yorum</span>
                  <p className="text-xs text-indigo-900 leading-relaxed font-black font-sans">{res.biomarkerInterpretation}</p>
                </div>
              )}

              {/* DYNAMIC METRICS BENTO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                
                {/* 1. SEVERITY SLIDER METER */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2">Maruziyet Derecesi</span>
                  <div className="relative pt-1">
                    <div className="flex mb-1 items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Seviye İndeksi</span>
                      <span className="text-xs font-mono font-black text-rose-600">% {res.exposureSeverity}</span>
                    </div>
                    <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-200">
                      <div 
                        style={{ width: `${res.exposureSeverity}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          res.exposureSeverity > 75 ? 'bg-rose-500' :
                          res.exposureSeverity > 45 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONFIDENCE SCORE CIRCLE */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Teşhis Güven</span>
                    <span className="text-md font-black text-slate-800 font-mono">% {res.confidenceScore}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center text-xs font-black text-indigo-700">
                    {res.confidenceScore}
                  </div>
                </div>

                {/* 3. EVIDENCE LEVEL BADGE */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Kanıtsal Derece</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Award className="text-amber-500" size={16} />
                    <span className="text-xs font-black text-slate-800">{res.evidenceLevel || 'Level Ia'}</span>
                  </div>
                </div>

                {/* 4. CARCINOGENICITY BADGE */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl sm:col-span-2 md:col-span-1">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">IARC Karsinojen Sınıfı</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-red-50 text-red-700 text-[11px] font-black rounded-lg border border-red-100">
                    {res.carcinogenicityGroup || 'Grup Sınıflandırılmamış'}
                  </span>
                </div>

                {/* 5. TARGET ORGANS TARGETED CHIPS */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl sm:col-span-2">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2">Hedef Toksisite Organları</span>
                  <div className="flex flex-wrap gap-1.5">
                    {res.targetOrgans?.map((org, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-200/50 border border-slate-250 rounded-xl text-[10px] font-black text-slate-700">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* MEDICAL REMEDIAL PROTOCOLS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Tavsiye Tahlil / Tetkikler</span>
                  <ul className="space-y-1.5">
                    {res.recommendedNextTests?.map((test, i) => (
                      <li key={i} className="text-xs text-slate-700 font-bold flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Endüstriyel KKE Tedbirleri</span>
                  <ul className="space-y-1.5">
                    {res.ppeRecommendations?.map((ppe, i) => (
                      <li key={i} className="text-xs text-slate-700 font-bold flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5 shrink-0">•</span>
                        <span>{ppe}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">Mesleki Sürveyans & Takip</span>
                  <ul className="space-y-1.5">
                    {res.surveillanceSuggestions?.map((srv, i) => (
                      <li key={i} className="text-xs text-slate-700 font-bold flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* OCUPATIONAL RISK HEATMAP EXPLAINED */}
              {res.riskHeatmap && res.riskHeatmap.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-3 font-mono">Faktör Seviyeli Mesleki Sağlık Isı Matrisi</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {res.riskHeatmap.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border text-center transition-all ${
                          item.riskPercent > 75 ? 'bg-red-50 border-red-200 text-red-900' :
                          item.riskPercent > 50 ? 'bg-amber-50 border-amber-250 text-amber-900' :
                          'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <span className="text-[14.5px] font-black font-mono block">% {item.riskPercent}</span>
                        <span className="text-[8.5px] font-black uppercase tracking-wider block mt-1">{item.field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'probability' && res.probabilityGraph && (
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={res.probabilityGraph} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontStyle="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} unit="%" />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px' }}
                  />
                  <Bar dataKey="probability" name="Causative Agent %" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider text-center mt-2">
                Bilimsel veri ve korelasyon olasılık dağılım matrisi.
              </p>
            </div>
          )}

          {currentTab === 'progression' && res.biomarkerProgression && (
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={res.biomarkerProgression} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={9} fontStyle="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="value" name="Vaka Ölçümleri (Biyobelirteç)" stroke="#dc2626" strokeWidth={3.5} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  <Line type="step" dataKey="limit" name="Yasal Sınır Limiti (OEL/OEP)" stroke="#16a34a" strokeDasharray="5 5" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider text-center mt-2">
                Maruziyet seyrindeki kritik biyokimyasal aşınma eğrisi.
              </p>
            </div>
          )}

          {currentTab === 'riskRadar' && res.riskRadar && (
            <div className="h-[240px] flex justify-center items-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={res.riskRadar}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={8} />
                  <Radar name="Systemic Risk" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="talep-ai-page flex flex-col lg:flex-row min-h-dvh lg:h-[calc(100vh-140px)] gap-6 lg:gap-8 lg:overflow-hidden pt-[env(safe-area-inset-top)] overflow-y-auto lg:overflow-y-visible">
      
      {/* 2. Side Panel FOR PAST ANALYSES (AI persistent memories) */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 space-y-6 overflow-y-auto pr-1 scrollbar-hide">
        
        {/* RECENT RECORDS BOX CONVERTED TO A TRUE PERSISTED LIST */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200/50 shadow-sm relative overflow-hidden flex flex-col h-[320px]">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">AKADEMİK HAFIZA TAKİBİ</h3>
              <button 
                onClick={loadHistory} 
                className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded-lg"
                title="Hafızayı Yenile"
              >
                <RefreshCw size={12} className={historyLoading ? "animate-spin" : ""} />
              </button>
           </div>

           {historyLoading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                <RefreshCw size={14} className="animate-spin text-slate-300" /> Hafıza yükleniyor...
             </div>
           ) : historyList.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-3 text-slate-400">
                <FolderLock size={20} className="text-slate-300 mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Geçmiş Bulgu Yok</p>
                <p className="text-[9px] opacity-70 mt-1">Giriş yapıp ilk analiz paketinizi kayıt altına alın.</p>
             </div>
           ) : (
             <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-hide">
                {historyList.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleRestoreHistory(item)}
                    className="w-full text-left p-3 bg-slate-50/50 hover:bg-slate-900 border border-slate-150 rounded-xl hover:text-white transition-all duration-200 cursor-pointer text-xs space-y-1 block group relative"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-extrabold text-slate-800 group-hover:text-white truncate max-w-[130px]" title={item.question}>
                        {item.question}
                      </p>
                      <span className="text-[8px] font-mono font-black uppercase text-indigo-500 bg-indigo-50 px-1 py-0.5 rounded group-hover:bg-white/10 group-hover:text-indigo-200 shrink-0">
                        {item.mode || 'clinical'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[8.5px] text-slate-400 font-bold">
                      <span>{item.response?.riskLevel} Risk</span>
                      <span className="font-mono text-[8px] opacity-70">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "Mevcut"}
                      </span>
                    </div>
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* CLINICAL METRICS BENTO IN THE SIDEBAR */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200/50 shadow-sm space-y-4">
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">ÇALIŞMA BAĞLAMI</h3>
           
           <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                 <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Sektör / Çalışma Segmenti</span>
                 <p className="text-xs font-extrabold text-slate-800 block">{context.sector}</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                 <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Sürveyans Hücresi</span>
                 <p className="text-xs font-extrabold text-slate-800 block">{context.unit}</p>
              </div>
              <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                 <span className="text-[8.5px] font-black uppercase tracking-widest text-rose-500 block mb-1.5">Mevcut Analiz Belirtileri</span>
                 <div className="flex flex-wrap gap-1">
                    {context.symptoms?.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-600">
                        {s}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* CAVEAT LEGIT SEAL */}
        <div className="p-6 bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900/40 rounded-[2rem] text-white">
          <p className="text-[10px] opacity-70 font-semibold leading-relaxed italic">
            "TALEP v4.0 CDSS bir kromatografi ve biyoanalitik karar destek aracıdır. Elde edilen tüm veriler nitelikli tıbbi konsültasyon esasında değerlendirilmelidir."
          </p>
        </div>

      </div>

      {/* 3. Main Chat Screen Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 rounded-[2rem] lg:rounded-[3rem] p-1.5 border border-white shadow-inner lg:overflow-hidden relative">
         
         {/* MODE SELECTION CONTROL LINE BAR */}
         <div className="grid grid-cols-5 gap-1.5 p-3 rounded-[2.2rem] bg-white border border-slate-200/40 shadow-sm mx-3 mt-3 relative z-20 overflow-x-auto scrollbar-hide shrink-0">
           {[
             { id: 'clinical', label: 'KLİNİK', sub: 'YOL / TANI', icon: Stethoscope },
             { id: 'academic', label: 'AKADEMİK', sub: 'GENETİK', icon: Brain },
             { id: 'emergency', label: 'ACİL', sub: 'ŞELASYON', icon: Zap },
             { id: 'surveillance', label: 'SÜRVEYANS', sub: 'TAKİP/LİMİT', icon: ClipboardList },
             { id: 'research', label: 'YAZI / TEZ', sub: 'BİLDİRİ', icon: FileText }
           ].map(m => {
             const Icon = m.icon;
             const isSelected = selectedMode === m.id;
             return (
               <button
                 key={m.id}
                 onClick={() => setSelectedMode(m.id as any)}
                 className={`flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all duration-200 whitespace-nowrap active:scale-95 ${
                   isSelected 
                     ? 'bg-slate-900 text-white shadow-lg font-black' 
                     : 'bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold border border-slate-100'
                 }`}
               >
                 <Icon size={14} className={isSelected ? 'text-amber-400' : 'text-slate-400'} />
                 <span className="text-[9.5px] uppercase tracking-wider block mt-1 leading-none">{m.label}</span>
                 <span className="text-[7px] block opacity-40 uppercase font-mono tracking-widest mt-0.5">{m.sub}</span>
               </button>
             );
           })}
         </div>

         {/* HYBRID CORE SELECTOR BANNER */}
         <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-white border-b border-slate-100 shrink-0 gap-2 mx-3 mt-2 rounded-[1.5rem] shadow-sm">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500 shrink-0" />
             <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
               Hibrid AI Kontrolü:
             </span>
             <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest border ${
               advancedAi 
                 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                 : 'bg-emerald-50 text-emerald-700 border-emerald-250'
             }`}>
               {advancedAi ? "Gelişmiş Yapay Zeka (Gemini AI)" : "Yerel Bilimsel Veritabanı (Karar Destek)"}
             </span>
           </div>
           
           <label className="relative inline-flex items-center cursor-pointer select-none">
             <input 
               type="checkbox" 
               checked={advancedAi}
               onChange={(e) => setAdvancedAi(e.target.checked)}
               className="sr-only peer" 
             />
             <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
             <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
               Gelişmiş Analiz Motoru (Gemini) Aktif
             </span>
           </label>
         </div>

         {/* Chat Message Scrollable Wall */}
         <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 lg:overflow-y-auto scrollbar-hide">
           <AnimatePresence>
             {messages.map((msg) => (
               <motion.div
                 key={msg.id}
                 initial={{ opacity: 0, y: 15, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                     msg.type === 'ai' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'
                   }`}>
                     {msg.type === 'ai' ? <Brain size={16} /> : <User size={16} />}
                   </div>
                   <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl shadow-sm leading-relaxed relative break-words overflow-hidden ${
                     msg.type === 'ai' 
                       ? msg.id.startsWith('err-') 
                         ? 'bg-rose-50 border border-rose-100 text-rose-800 font-bold'
                         : 'bg-white text-slate-800 border border-slate-200/60' 
                       : 'bg-slate-950 text-white shadow-xl shadow-slate-900/10 font-bold'
                   }`}
                   style={msg.type === 'user' ? { borderTopRightRadius: '4px' } : { borderTopLeftRadius: '4px' }}
                   >
                     {msg.type === 'ai' && msg.modeUsed && (
                       <div className="flex items-center gap-1 text-[8.5px] font-black tracking-widest text-indigo-600 uppercase mb-3 font-mono">
                         <Info size={10} />
                         Aktif Model: {msg.modeUsed.toUpperCase()} MODU
                       </div>
                     )}
                     
                     <div className="text-[13px] md:text-sm font-semibold">
                       {msg.structured ? renderVisualsAndReports(msg.structured, msg.id) : (
                         <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                       )}
                     </div>

                     <div className={`text-[9px] opacity-40 mt-3 font-black uppercase tracking-widest ${msg.type === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
             {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                     <Brain size={16} className="animate-pulse" />
                  </div>
                  <div className="p-4 bg-slate-100/50 border border-slate-150 rounded-2xl flex gap-3 items-center">
                     <span className="w-3.5 h-3.5 border-2 border-indigo-650 border-t-slate-900 rounded-full animate-spin shrink-0" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                       Prof. Dr. Vugar Ali Türksoy Akademik Laboratuvarı Muhakeme Yapıyor...
                     </span>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           <div ref={chatEndRef} />
         </div>

         {/* Bottom Control Send Section */}
         <div className="p-4 md:p-6 bg-white border-t border-slate-150 sticky bottom-0 z-10 rounded-b-[2rem] lg:rounded-b-[3rem]">
           
           {/* Slider Actions Chips Carousel */}
           <div className="mb-4">
              <div className="flex lg:grid lg:grid-cols-6 gap-2 overflow-x-auto lg:overflow-x-visible pb-2.5 lg:pb-0 scrollbar-hide snap-x">
                 {quickActions.map((action, i) => (
                   <button 
                     key={i}
                     onClick={() => handleSend(action.query)}
                     className="flex-shrink-0 lg:flex-shrink flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl border border-slate-150 transition-all active:scale-95 text-slate-600 truncate snap-start min-w-[155px] lg:min-w-0 font-extrabold text-[10px] uppercase cursor-pointer"
                   >
                     <span>{action.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex gap-3 items-center">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               placeholder={`"${selectedMode.toUpperCase()}" modeline vaka semptomu, laboratuvar verisi, toksik etken veya soru girin...`}
               className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-xs font-bold outline-none ring-0 placeholder:text-slate-300"
             />
             <button 
               onClick={() => handleSend()}
               disabled={isTyping}
               className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 hover:bg-slate-800 transition-all shrink-0 cursor-pointer disabled:opacity-50"
             >
               <Send size={18} />
             </button>
           </div>
         </div>

      </div>
    </div>
  );
}
