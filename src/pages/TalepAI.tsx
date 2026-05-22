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
  const [advancedAi, setAdvancedAi] = useState<boolean>(true); // Default to true for the premium experience!
  
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
        <div className="prose prose-invert max-w-none text-slate-200 text-xs md:text-sm leading-relaxed p-4 bg-slate-900/60 border border-white/5 rounded-2xl animate-fade-in whitespace-pre-wrap font-sans">
          <p className="font-semibold text-slate-100">{res.rawText}</p>
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
        <div className="flex gap-2 bg-slate-950/80 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide shrink-0 mb-4 border border-white/5">
          <button 
            onClick={() => setMsgTab('text')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'text' ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={13} /> Analiz Raporu
          </button>
          <button 
            onClick={() => setMsgTab('probability')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'probability' ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 size={13} /> Olasılık Dağılımı ({res.probabilityGraph?.length || 0})
          </button>
          <button 
            onClick={() => setMsgTab('progression')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'progression' ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={13} /> Biyobelirteç İlerlemesi
          </button>
          <button 
            onClick={() => setMsgTab('riskRadar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'riskRadar' ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain size={13} /> Risk Radarı
          </button>
        </div>

        {/* COMPONENT BODY */}
        <div className="min-h-[220px]">
          {currentTab === 'text' && (
            <div className="space-y-4 text-slate-100">
              {/* MAIN MARKDOWN CONTAINER WITH WHITESPACE LOGIC */}
              <div className="text-xs md:text-[13.5px] text-slate-200 leading-relaxed font-semibold whitespace-pre-wrap font-sans dark-report-layer">
                {res.rawText}
              </div>

              {/* OUTCOMES SUMMARY / BIOMARKERS ASSESSMENT */}
              {res.biomarkerInterpretation && (
                <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-2xl p-4 mt-4 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block mb-1 flex items-center gap-1.5">
                    <Activity size={12} className="text-cyan-400" />
                    Moleküler & Biyokimyasal Yorum
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-black font-sans">{res.biomarkerInterpretation}</p>
                </div>
              )}

              {/* DYNAMIC METRICS BENTO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                
                {/* 1. SEVERITY SLIDER METER */}
                <div className="bg-slate-950/45 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-2">Maruziyet Derecesi</span>
                  <div className="relative pt-1">
                    <div className="flex mb-1 items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">Seviye İndeksi</span>
                      <span className="text-xs font-mono font-black text-rose-450 text-rose-450 text-rose-400">% {res.exposureSeverity}</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-900 border border-white/5">
                      <div 
                        style={{ width: `${res.exposureSeverity}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          res.exposureSeverity > 75 ? 'bg-rose-500 shadow-[0_0_12px_#ef4444]' :
                          res.exposureSeverity > 45 ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' :
                          'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONFIDENCE SCORE CIRCLE */}
                <div className="bg-slate-950/45 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-1">Teşhis Güven</span>
                    <span className="text-md font-black text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">% {res.confidenceScore}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-cyan-950/35 border-2 border-cyan-400 flex items-center justify-center text-xs font-black text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    {res.confidenceScore}
                  </div>
                </div>

                {/* 3. EVIDENCE LEVEL BADGE */}
                <div className="bg-slate-950/45 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-1">Kanıtsal Derece</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Award className="text-amber-400" size={16} />
                    <span className="text-xs font-black text-slate-200">{res.evidenceLevel || 'Level Ia'}</span>
                  </div>
                </div>

                {/* 4. CARCINOGENICITY BADGE */}
                <div className="bg-slate-950/45 border border-white/5 p-4 rounded-2xl sm:col-span-2 md:col-span-1">
                  <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-1">IARC Karsinojen Sınıfı</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-rose-500/10 text-rose-450 text-rose-400 text-[11px] font-black rounded-lg border border-rose-500/20">
                    {res.carcinogenicityGroup || 'Grup Sınıflandırılmamış'}
                  </span>
                </div>

                {/* 5. TARGET ORGANS TARGETED CHIPS */}
                <div className="bg-slate-950/45 border border-white/5 p-4 rounded-2xl sm:col-span-2">
                  <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-2">Hedef Toksisite Organları</span>
                  <div className="flex flex-wrap gap-1.5">
                    {res.targetOrgans?.map((org, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-900 border border-white/5 rounded-xl text-[10px] font-black text-slate-300 hover:text-cyan-300 hover:border-cyan-500/20 transition-all select-none">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* MEDICAL REMEDIAL PROTOCOLS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl hover:border-cyan-500/10 transition-colors">
                  <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1.5 text-cyan-400">
                    <ClipboardList size={12} /> Tavsiye Tahliller
                  </span>
                  <ul className="space-y-1.5">
                    {res.recommendedNextTests?.map((test, i) => (
                      <li key={i} className="text-xs text-slate-300 font-bold flex items-start gap-1.5">
                        <span className="text-cyan-455 text-cyan-400 mt-0.5 shrink-0">•</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl hover:border-indigo-500/10 transition-colors">
                  <span className="text-[9.5px] font-black text-slate-455 text-indigo-400 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1.5">
                    <ShieldCheck size={12} /> KKE Tedbirleri
                  </span>
                  <ul className="space-y-1.5">
                    {res.ppeRecommendations?.map((ppe, i) => (
                      <li key={i} className="text-xs text-slate-300 font-bold flex items-start gap-1.5">
                        <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                        <span>{ppe}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl hover:border-amber-500/10 transition-colors">
                  <span className="text-[9.5px] font-black text-amber-455 text-amber-400 uppercase tracking-widest block mb-2 font-mono flex items-center gap-1.5">
                    <Activity size={12} /> Sürveyans &amp; Takip
                  </span>
                  <ul className="space-y-1.5">
                    {res.surveillanceSuggestions?.map((srv, i) => (
                      <li key={i} className="text-xs text-slate-300 font-bold flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* OCUPATIONAL RISK HEATMAP EXPLAINED */}
              {res.riskHeatmap && res.riskHeatmap.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block mb-3 font-mono">Faktör Seviyeli Mesleki Sağlık Isı Matrisi</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {res.riskHeatmap.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border text-center transition-all ${
                          item.riskPercent > 75 ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.05)]' :
                          item.riskPercent > 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontStyle="bold" />
                  <YAxis stroke="#64748b" fontSize={9} unit="%" />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#020617', color: '#fff', fontSize: '10px' }}
                  />
                  <Bar dataKey="probability" name="Causative Agent %" fill="#06b6d4" radius={[6, 6, 0, 0]} className="drop-shadow-[0_0_8px_#06b6d4]" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center mt-2 font-mono flex items-center justify-center gap-1.5">
                <Database size={11} className="text-cyan-400" /> Kromatografi ve Biyoanalitik Olasılık Dağılım Matrisi
              </p>
            </div>
          )}

          {currentTab === 'progression' && res.biomarkerProgression && (
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={res.biomarkerProgression} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={9} fontStyle="bold" />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#020617', color: '#fff', fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="value" name="Vaka Ölçümü" stroke="#ef4444" strokeWidth={3.5} dot={{ r: 5, fill: '#ef4444' }} activeDot={{ r: 8 }} />
                  <Line type="step" dataKey="limit" name="Yasal Sınır Limiti (OEL)" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-center mt-2 font-mono flex items-center justify-center gap-1.5">
                <TrendingUp size={11} className="text-red-405 text-red-400" /> Biyobelirteç Kritik Aşınma Seviye Eğrisi
              </p>
            </div>
          )}

          {currentTab === 'riskRadar' && res.riskRadar && (
            <div className="h-[240px] flex justify-center items-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={res.riskRadar}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={8} />
                  <Radar name="Systemic Risk" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="talep-ai-page flex flex-col lg:flex-row lg:h-[calc(100vh-160px)] gap-6 lg:gap-8 overflow-visible select-none pb-24 md:pb-0">
      
      {/* 2. Side Panel FOR PAST ANALYSES (AI persistent memories) */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 space-y-6 overflow-y-auto pr-1 scrollbar-hide">
        
        {/* RECENT RECORDS BOX CONVERTED TO A TRUE PERSISTED LIST */}
        <div className="bg-slate-950/40 border border-white/5 rounded-[24px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col h-[320px] backdrop-blur-3xl">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Brain size={12} className="animate-pulse" />
                AKADEMİK HAFIZA
              </h3>
              <button 
                onClick={loadHistory} 
                className="text-cyan-405 text-cyan-400 hover:text-cyan-300 transition-colors p-1.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10 cursor-pointer"
                title="Hafızayı Yenile"
              >
                <RefreshCw size={12} className={historyLoading ? "animate-spin" : ""} />
              </button>
           </div>

           {historyLoading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                <RefreshCw size={14} className="animate-spin text-cyan-400" /> Hafıza yükleniyor...
             </div>
           ) : historyList.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-3 text-slate-400">
                <FolderLock size={20} className="text-slate-500 mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-350">Mevcut Kayıt Yok</p>
                <p className="text-[9px] opacity-70 mt-1">İlk analiz paketinizi Firebase veritabanına kaydedin.</p>
             </div>
           ) : (
             <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-hide">
                 {historyList.map((item, i) => (
                   <button
                     key={i}
                     onClick={() => handleRestoreHistory(item)}
                     className="w-full text-left p-3.5 bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-cyan-500/30 rounded-xl hover:text-white transition-all duration-200 cursor-pointer text-xs space-y-1 block group relative shadow-md"
                   >
                     <div className="flex justify-between items-start">
                       <p className="font-extrabold text-slate-250 group-hover:text-cyan-300 truncate max-w-[130px]" title={item.question}>
                         {item.question}
                       </p>
                       <span className="text-[8px] font-mono font-black uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1 py-0.5 rounded shrink-0">
                         {item.mode || 'clinical'}
                       </span>
                     </div>
                     <div className="flex justify-between items-center text-[8.5px] text-slate-400 font-bold">
                       <span>{item.response?.riskLevel?.toUpperCase()} Risk</span>
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
        <div className="bg-slate-950/40 border border-white/5 rounded-[24px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] space-y-4 backdrop-blur-3xl">
           <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
             <Stethoscope size={12} className="text-indigo-400" />
             KLİNİK DURUM BAĞLAMI
           </h3>
           
           <div className="space-y-3">
              <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl">
                 <span className="text-[8.5px] font-black uppercase tracking-widest text-[#64748b] block mb-0.5">Sektör / Çalışma Segmenti</span>
                 <p className="text-xs font-extrabold text-slate-200 block">{context.sector}</p>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl">
                 <span className="text-[8.5px] font-black uppercase tracking-widest text-[#64748b] block mb-0.5">Sürveyans Hücresi</span>
                 <p className="text-xs font-extrabold text-slate-200 block">{context.unit}</p>
              </div>
              <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl">
                 <span className="text-[8.5px] font-black uppercase tracking-widest text-rose-455 text-rose-400 block mb-1.5">Semptom / Göstergeler</span>
                 <div className="flex flex-wrap gap-1">
                    {context.symptoms?.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-950/80 border border-white/5 rounded text-[8.5px] font-bold text-slate-300">
                        {s}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* CAVEAT LEGIT SEAL */}
        <div className="p-5 bg-gradient-to-br from-[#0c1020] to-slate-950 border border-cyan-500/10 rounded-[24px] text-white">
          <p className="text-[10px] opacity-75 font-semibold leading-relaxed italic text-slate-400">
            "TALEP v4.0 CDSS bir kromatografi ve biyoanalitik karar destek aracıdır. Elde edilen tüm veriler nitelikli tıbbi konsültasyon esasında değerlendirilmelidir."
          </p>
        </div>

      </div>

      {/* 3. Main Chat Screen Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40 rounded-[32px] p-2.5 border border-white/5 shadow-inner relative backdrop-blur-3xl h-full">
         
         {/* MODE SELECTION CONTROL LINE BAR */}
         <div className="grid grid-cols-5 gap-1.5 p-2 rounded-2xl bg-slate-950/60 border border-white/5 shadow-md mx-3 mt-3 relative z-20 overflow-x-auto scrollbar-hide shrink-0">
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
                 onClick={() => { setSelectedMode(m.id as any); }}
                 className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-200 whitespace-nowrap active:scale-95 ${
                   isSelected 
                     ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-405/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-black' 
                     : 'bg-slate-900/30 hover:bg-slate-900 text-slate-400 font-bold border border-transparent'
                 }`}
               >
                 <Icon size={14} className={isSelected ? 'text-cyan-400 animate-pulse' : 'text-slate-400'} />
                 <span className="text-[9px] font-black uppercase tracking-wider block mt-1 leading-none">{m.label}</span>
                 <span className="text-[7px] block opacity-40 uppercase font-mono tracking-widest mt-0.5">{m.sub}</span>
               </button>
             );
           })}
         </div>

         {/* HYBRID CORE SELECTOR BANNER */}
         <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-slate-900/20 border border-white/5 shrink-0 gap-2 mx-3 mt-2 rounded-2xl shadow-sm">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full animate-ping bg-emerald-400 shrink-0" />
             <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">
               Hibrid AI Motoru:
             </span>
             <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
               advancedAi 
                 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                 : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
             }`}>
               {advancedAi ? "Gelişmiş Yapay Zeka (Gemini AI)" : "Yerel Bilimsel Karar Destek"}
             </span>
           </div>
           
           <label className="relative inline-flex items-center cursor-pointer select-none">
             <input 
               type="checkbox" 
               checked={advancedAi}
               onChange={(e) => setAdvancedAi(e.target.checked)}
               className="sr-only peer" 
             />
             <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500"></div>
             <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-slate-300">
               Yüksek Doğruluk Aktif (Gemini)
             </span>
           </label>
         </div>

         {/* Chat Message Scrollable Wall */}
         <div className="flex-1 p-3 md:p-6 space-y-6 overflow-y-auto scrollbar-hide">
           <AnimatePresence>
             {messages.map((msg) => (
               <motion.div
                 key={msg.id}
                 initial={{ opacity: 0, y: 15, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`flex gap-3 max-w-[95%] md:max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                     msg.type === 'ai' ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/20 text-cyan-405 text-cyan-400' : 'bg-slate-900 border border-white/10 text-slate-400'
                   }`}>
                     {msg.type === 'ai' ? <Brain size={14} className="animate-pulse" /> : <User size={14} />}
                   </div>
                   <div className={`p-4 rounded-2xl shadow-md leading-relaxed relative break-words overflow-hidden ${
                     msg.type === 'ai' 
                       ? msg.id.startsWith('err-') 
                         ? 'bg-rose-950/30 border border-rose-500/20 text-rose-400 font-bold'
                         : 'bg-slate-900/60 text-slate-150 border border-white/5' 
                       : 'bg-gradient-to-tr from-cyan-600/35 to-indigo-600/35 border border-cyan-400/30 text-white shadow-xl shadow-cyan-950/10 font-bold'
                   }`}
                   style={msg.type === 'user' ? { borderTopRightRadius: '3px' } : { borderTopLeftRadius: '3px' }}
                   >
                     {msg.type === 'ai' && msg.modeUsed && (
                       <div className="flex items-center gap-1.5 text-[8.5px] font-black tracking-widest text-cyan-400 uppercase mb-3 font-mono">
                         <Sparkles size={10} className="text-cyan-400 animate-spin" />
                         MODEL ANALİZ PAKETİ: {msg.modeUsed.toUpperCase()} MODU
                       </div>
                     )}
                     
                     <div className="text-[13px] md:text-[13.5px] font-semibold">
                       {msg.structured ? renderVisualsAndReports(msg.structured, msg.id) : (
                         <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                       )}
                     </div>

                     <div className={`text-[8.5px] opacity-45 mt-3 font-black uppercase tracking-widest font-mono text-right ${msg.type === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
             {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 border border-cyan-500/10">
                     <Brain size={14} className="animate-spin" />
                  </div>
                  <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl flex gap-3 items-center">
                     <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                     <span className="text-[9.5px] font-black text-cyan-400 uppercase tracking-widest font-mono animate-pulse">
                       TALEP JARVIS COGNITIVE CORE ANALYZING...
                     </span>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           <div ref={chatEndRef} />
         </div>

         {/* Bottom Control Send Section */}
         <div className="p-3 bg-slate-950/60 border-t border-white/5 sticky bottom-0 z-10 rounded-b-[24px]">
           
           {/* Slider Actions Chips Carousel */}
           <div className="mb-3.5">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x">
                 {quickActions.map((action, i) => (
                   <button 
                     key={i}
                     onClick={() => handleSend(action.query)}
                     className="flex-shrink-0 flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-905 bg-slate-900 hover:bg-cyan-500/10 hover:border-cyan-400/25 rounded-xl border border-white/5 transition-all text-slate-300 active:scale-95 snap-start min-w-[155px] font-black text-[9.5px] uppercase cursor-pointer"
                   >
                     <span>{action.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex gap-2.5 items-center bg-slate-900 border border-white/5 rounded-2xl p-1.5 focus-within:border-cyan-500/30 transition-all">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               placeholder={`"${selectedMode.toUpperCase()}" motoruna toksikolojik parametre girin...`}
               className="flex-1 bg-transparent px-4 py-2.5 text-xs font-bold outline-none text-white placeholder:text-slate-500"
             />
             <button 
               onClick={() => handleSend()}
               disabled={isTyping}
               className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 rounded-xl flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all shrink-0 cursor-pointer disabled:opacity-50"
             >
               <Send size={15} />
             </button>
           </div>
         </div>

      </div>
    </div>
  );
}
