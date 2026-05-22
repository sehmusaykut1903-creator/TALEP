import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { MsdsPremiumBanner } from "../components/MsdsPremiumBanner";
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
  FolderLock,
  Clock,
  Briefcase,
  Layers,
  HeartPulse,
  ChevronDown,
  ChevronUp
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

// Extended Context Interface for the Premium Redesign
interface PremiumAiContext extends AiContext {
  exposureDuration?: string;
  doseTracking?: string;
  analyticalMethod?: string;
  biomarkersDetailed?: string;
  decisionSupportOverride?: string;
  clinicalRecommendationsOverride?: string;
}

export default function TalepAI() {
  const { theme, t } = useSettings();
  const { currentUser } = useAuth();
  const isDark = theme.isDark;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "TALEP Klinik Yapay Zeka platformuna hoş geldiniz. Sol paneldeki 'Vaka Monitörü' parametrelerini (Biyogöstergeler, maruziyet süreleri, dozaj ve analitik metotlar) dilediğiniz gibi güncelleyebilir, ardından motora analiz sorularınızı yöneltebilirsiniz.",
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
  const [advancedAi, setAdvancedAi] = useState<boolean>(true); // Default to true.
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Expanded demographic and state-aware context
  const [context, setContext] = useState<PremiumAiContext>({
    sector: "Akü ve Metal Eritme",
    unit: "Döküm / Hammadde İşleme",
    symptoms: ["Bilişsel Yavaşlama", "Mikrositer Anemi", "El Titremesi"],
    riskLevel: 'high',
    exposureDuration: "4.5 Yıl (Kümülatif)",
    doseTracking: "BLL: 42 µg/dL, ZPP Yüksek",
    analyticalMethod: "ICP-MS (Kütle Spektrometresi)",
    biomarkersDetailed: "Kan Kurşun Seviyesi (>40), İdrarda Ala ve Koproporfirin yükselmesi.",
    decisionSupportOverride: "Orta-Yüksek kurşun toksisitesi saptandı. Periferik sinir iletimi etkilenebilir.",
    clinicalRecommendationsOverride: "1. Şelasyon başlanmalı. 2. Maruziyet ortamından uzaklaştırılmalı. 3. Aylık kan tahlili takibi yapılmalı."
  });

  const [activeTab, setActiveTab] = useState<Record<string, 'text' | 'probability' | 'progression' | 'riskRadar'>>({});
  const [editContextPanelOpen, setEditContextPanelOpen] = useState(true);

  useEffect(() => {
    setSessionId(`sess-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

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
      // Feed full custom context (including exposure duration, biomarkers, dose metrics) 
      // into clinical reasoning pipeline
      const fullContextStr = `
        [Vaka Parametre Kataloğu]
        Sektör: ${context.sector}
        Birim: ${context.unit}
        Maruziyet Süresi: ${context.exposureDuration}
        Biyogöstergeler: ${context.biomarkersDetailed}
        Doz Takibi: ${context.doseTracking}
        Analitik Metot: ${context.analyticalMethod}
        Mevcut Semptomlar: ${context.symptoms?.join(', ')}
        Karar Destek Çıktısı: ${context.decisionSupportOverride}
        Klinik Öneriler: ${context.clinicalRecommendationsOverride}
      `;

      const response = await generateScientificReasoning(
        `${textToSend}\n\n[Mevcut Vaka Konsept Bilgileri]:\n${fullContextStr}`,
        context,
        selectedMode,
        messages.slice(-4).map(m => ({
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

      if (currentUser?.uid) {
        await saveAiChatMemory(currentUser.uid, sessionId, selectedMode, textToSend, response);
        loadHistory();
      }

    } catch (err: any) {
      console.error("Clinical AI pipeline error:", err);
      setError(err?.message || "Servise erişilemedi.");
      
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        type: 'ai',
        text: "Toksikoloji motorundan geçerli bir analiz paketi alınamadı. Lütfen internet bağlantınızı kontrol edin.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

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
    { label: "Kurşun Zehirlenmesi", query: "BLL > 40 µg/dL ICP-MS maruziyet riski ve şelasyon dozajını yorumla", icon: FlaskConical },
    { label: "Benzen Akut Lösemi", query: "Boya işçisinde lökopeni (WBC 3.2), idrar tt-MA yüksekliği, IARC Grup 1 takibi", icon: Activity },
    { label: "Organofosfat Kriz", query: "Yoğun salivasyon, miyozis acil antropatizasyonu ve antidote yönetimi", icon: Zap },
    { label: "Nöro-Solvent Hasarı", query: "Yapıştırıcı hattında el titremesi (tremor) ve aksonal polinöropati izlemi", icon: Sliders },
  ];

  const renderVisualsAndReports = (res: StructuredAiResponse, msgId: string) => {
    if (res.isCasual) {
      return (
        <div className="prose prose-invert max-w-none text-slate-200 text-xs md:text-sm leading-relaxed p-4 bg-slate-900/60 border border-white/5 rounded-2xl animate-fade-in markdown-body">
          <Markdown>{res.rawText}</Markdown>
        </div>
      );
    }

    const currentTab = activeTab[msgId] || 'text';

    const setMsgTab = (tabValue: 'text' | 'probability' | 'progression' | 'riskRadar') => {
      setActiveTab(prev => ({ ...prev, [msgId]: tabValue }));
    };

    return (
      <div className="space-y-4 max-w-full">
        {/* Horizontal Navigation Control for analytical packages */}
        <div className="flex gap-2 bg-slate-950/80 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide shrink-0 mb-4 border border-white/5">
          <button 
            onClick={() => setMsgTab('text')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'text' ? 'bg-cyan-500/15 border border-cyan-405 border-cyan-404/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={13} /> Analiz Raporu
          </button>
          <button 
            onClick={() => setMsgTab('probability')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'probability' ? 'bg-cyan-500/15 border border-cyan-404/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 size={13} /> Olasılık Dağılımı
          </button>
          <button 
            onClick={() => setMsgTab('progression')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'progression' ? 'bg-cyan-500/15 border border-cyan-404/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={13} /> Biyobelirteç İlerleme Akışı
          </button>
          <button 
            onClick={() => setMsgTab('riskRadar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'riskRadar' ? 'bg-cyan-500/15 border border-cyan-404/30 text-cyan-400 font-extrabold shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain size={13} /> Risk Radarı
          </button>
        </div>

        {/* Content Views */}
        <div className="min-h-[220px]">
          {currentTab === 'text' && (
            <div className="space-y-4 text-slate-100">
              <div className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl markdown-body text-xs leading-relaxed font-semibold">
                <Markdown>{res.rawText}</Markdown>
              </div>

              {/* Dynamic decision recommendations grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle2 size={11} /> KILAVUZ HASTALIK ÖNERİLERİ
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1 pl-3 list-disc">
                    {res.surveillanceSuggestions?.map((s, idx) => (
                      <li key={idx} className="font-semibold">{s}</li>
                    )) || <li>Bulgu bulunamadı.</li>}
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Award size={11} /> TAVSİYE EDİLEN EK ANALİTLER
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {res.recommendedNextTests?.map((t, idx) => (
                      <span key={idx} className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-[9px] font-bold uppercase border border-amber-550/10">{t}</span>
                    )) || <span className="text-xs text-slate-400">Öneri bulunamadı.</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'probability' && (
            <div className="h-64 bg-slate-900/40 p-4 border border-white/5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block font-mono">EN OLASI TOKSİK SENDROM DIZILIMI</span>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={res.probabilityGraph || []}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <ChartTooltip contentStyle={{ fontSize: 11, background: '#0f172a', border: 'none', borderRadius: 12, color: '#fff' }} />
                  <Bar dataKey="probability" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {currentTab === 'progression' && (
            <div className="h-64 bg-slate-900/40 p-4 border border-white/5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block font-mono">BİYOBELİRTEÇ KÜMÜLATİF EŞİK GRAFİĞİ</span>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={res.biomarkerProgression || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="period" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <ChartTooltip contentStyle={{ fontSize: 11, background: '#0f172a', border: 'none', borderRadius: 12, color: '#fff' }} />
                  <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5} name="Saptanan Değer" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" name="Eşik Limit (Threshold)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {currentTab === 'riskRadar' && (
            <div className="h-64 bg-slate-900/40 p-4 border border-white/5 rounded-2xl flex flex-col items-center justify-between">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block font-mono self-start">ORGAN HASAR RİSK KATSAYILARI (RADAR)</span>
              <div className="w-full h-[80%] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={res.riskRadar || []}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" stroke="#888888" fontSize={9} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" fontSize={8} />
                    <Radar name="Etki Yüzdesi" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0 overflow-hidden select-none">
      
      {/* 1. Left Sidebar: Scientific History Queries */}
      <div className={`hidden lg:flex w-64 flex-col shrink-0 rounded-[32px] p-5 border transition-all duration-200 ${theme.cardBg}`}>
        <h3 className={`text-[11px] font-black tracking-widest uppercase mb-3 px-1 ${
          isDark ? "text-cyan-400" : "text-blue-600"
        }`}>
          SORGU HAFIZASI
        </h3>
        {historyLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className={`w-5 h-5 border-2 rounded-full animate-spin ${
              isDark ? "border-cyan-500 border-t-transparent" : "border-blue-600 border-t-transparent"
            }`} />
          </div>
        ) : historyList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles size={24} className="opacity-20 mb-2 animate-pulse" />
            <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider block">KAYIT BULUNAMADI</span>
          </div>
        ) : (
          <div className="flex-1 space-y-2.5 overflow-y-auto scrollbar-hide pr-1">
            {historyList.map((item) => (
              <button
                key={item.id}
                onClick={() => handleRestoreHistory(item)}
                className={`w-full text-left p-3 rounded-2xl border transition-all duration-250 cursor-pointer ${
                  isDark 
                    ? "bg-slate-900/40 hover:bg-slate-900 border-white/5 hover:border-cyan-500/20 text-slate-300" 
                    : "bg-slate-50 hover:bg-slate-100 hover:shadow-md border-slate-200 hover:border-blue-300 text-slate-705 text-slate-750 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono border ${
                    isDark 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/15" 
                      : "bg-blue-50 text-blue-600 border-blue-200"
                  }`}>
                    {item.mode ? item.mode.toUpperCase() : 'KLİNİK'}
                  </span>
                  <span className="text-[8px] opacity-40 font-mono">
                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-[10.5px] font-bold line-clamp-2 leading-snug">
                  {item.question}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Middle Column: Case Context Monitor - INTERACTIVE AND EDITABLE FOR REDESIGN */}
      <div className={`w-full lg:w-80 flex flex-col shrink-0 rounded-[32px] p-5 border overflow-y-auto scrollbar-thin transition-all duration-200 ${theme.cardBg}`}>
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <HeartPulse size={15} className="text-cyan-400 animate-pulse" />
            <h3 className={`text-[11px] font-black tracking-widest uppercase ${isDark ? "text-cyan-400" : "text-blue-600"}`}>
              VAKA MONİTÖRÜ v4
            </h3>
          </div>
          <button 
            onClick={() => setEditContextPanelOpen(!editContextPanelOpen)}
            className="text-[10px] font-black uppercase text-cyan-400 hover:underline"
          >
            {editContextPanelOpen ? "PANELİ DARALT" : "PARAMETRELERİ DÜZENLE"}
          </button>
        </div>

        <div className="space-y-4">
          
          <AnimatePresence>
            {editContextPanelOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3.5"
              >
                {/* 1. Sektörel Maruziyet & Birim */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-[#64748b] block font-mono">Endüstriyel Sektör</span>
                    <input 
                      type="text"
                      value={context.sector}
                      onChange={(e) => setContext({ ...context, sector: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-[#64748b] block font-mono">Birim & Görev</span>
                    <input 
                      type="text"
                      value={context.unit}
                      onChange={(e) => setContext({ ...context, unit: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* 2. Maruziyet Süresi */}
                <div className="space-y-1">
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-cyan-400 block font-mono">Maruziyet Süresi (Exposure Duration)</span>
                  <input 
                    type="text"
                    value={context.exposureDuration}
                    onChange={(e) => setContext({ ...context, exposureDuration: e.target.value })}
                    placeholder="Örn: 5 Yıl kümülatif"
                    className="w-full px-3 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 3. Doz Takibi */}
                <div className="space-y-1">
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-amber-400 block font-mono">Doz Takibi / Dozajlama Analizi</span>
                  <input 
                    type="text"
                    value={context.doseTracking}
                    onChange={(e) => setContext({ ...context, doseTracking: e.target.value })}
                    placeholder="Kan, idrar veya inhalasyon dozu"
                    className="w-full px-3 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 4. Analitik Metot Seçimi */}
                <div className="space-y-1">
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-violet-400 block font-mono">Analitik Metot Seçimi</span>
                  <select
                    value={context.analyticalMethod}
                    onChange={(e) => setContext({ ...context, analyticalMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="ICP-MS (İndüktif Eşleşmiş Plazma Kütle Spektrometresi)">ICP-MS (Metaller)</option>
                    <option value="HPLC (Yüksek Performanslı Sıvı Kromatografisi)">HPLC (Solventler / Metabolit)</option>
                    <option value="GC-MS (Gaz Kromatografisi Kütle Spektrometresi)">GC-MS (Gazlar ve VOC)</option>
                    <option value="AAS (Atomik Absorpsiyon Spektroskopisi)">AAS (Temel Toksik Metal)</option>
                  </select>
                </div>

                {/* 5. Biyogöstergeler */}
                <div className="space-y-1">
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-blue-400 block font-mono">Biyogösterge Bulguları (Biomarkers)</span>
                  <textarea 
                    rows={2}
                    value={context.biomarkersDetailed}
                    onChange={(e) => setContext({ ...context, biomarkersDetailed: e.target.value })}
                    placeholder="Kan kurşun biyobelirteçleri, kromatografik idrar asit mutasyonları..."
                    className="w-full px-3 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500 scrollbar-hide resize-none"
                  />
                </div>

                {/* Semptomlar */}
                <div className="space-y-1">
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-[#64748b] block font-mono">Girilen Değerlendirme Semptomları</span>
                  <input 
                    type="text"
                    value={context.symptoms?.join(', ')}
                    onChange={(e) => setContext({ ...context, symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Semptomları virgülle ayırarak yazın..."
                    className="w-full px-3 py-2 bg-slate-900/60 dark:bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Karar Destek Çıktısı Segment */}
          <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl space-y-2">
            <span className="text-[8.5px] font-black uppercase tracking-widest text-[#0ea5e9] block font-mono">Karar Destek Çıktısı</span>
            <span className="text-[9px] bg-red-500/10 text-rose-450 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 uppercase font-black font-mono">KRİTİK TOKSİKOLOG RAPOR DIZILIMI</span>
            <textarea 
              rows={2}
              value={context.decisionSupportOverride}
              onChange={(e) => setContext({ ...context, decisionSupportOverride: e.target.value })}
              className="w-full bg-transparent border-0 text-[11px] font-semibold text-slate-350 leading-relaxed outline-none p-0 focus:ring-0 resize-none"
            />
          </div>

          {/* 6. Klinik Öneriler Segment */}
          <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl space-y-1.5">
            <span className="text-[8.5px] font-black uppercase tracking-widest text-[#10b981] block font-mono">Otomatik Klinik Öneriler</span>
            <textarea 
              rows={3}
              value={context.clinicalRecommendationsOverride}
              onChange={(e) => setContext({ ...context, clinicalRecommendationsOverride: e.target.value })}
              className="w-full bg-transparent border-0 text-[11px] font-semibold text-slate-300 leading-relaxed outline-none p-0 focus:ring-0 resize-none"
            />
          </div>

          {/* Luminous Caveat */}
          <div className="p-4 bg-[#0a101f] border border-cyan-500/10 rounded-[22px]">
            <p className="text-[8.5px] opacity-75 font-semibold leading-relaxed italic text-slate-400">
              "TALEP Klinik AI, kümülatif maruziyet dozlarını ve hücresel biyobelirteç tahlillerini kromatografi algoritmalarıyla süzerek kararlar üretir."
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Chat Screen Area */}
      <div className={`flex-1 flex flex-col min-w-0 rounded-[32px] p-2.5 border relative backdrop-blur-3xl h-full transition-all duration-200 ${theme.cardBg}`}>
         
         <MsdsPremiumBanner className="m-3 mb-0" />
         
         {/* MODE SELECTION CONTROL LINE BAR */}
         <div className={`grid grid-cols-5 gap-1.5 p-2 rounded-2xl border shadow-sm mx-3 mt-3 relative z-20 overflow-x-auto scrollbar-hide shrink-0 ${
           isDark ? "bg-slate-950/60 border-white/5" : "bg-slate-50 border-slate-200"
         }`}>
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
                     ? isDark
                       ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-405/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-black' 
                       : 'bg-blue-50 border border-blue-200 text-blue-600 font-extrabold shadow-sm'
                     : isDark
                       ? 'bg-slate-900/30 hover:bg-slate-900 text-slate-400 font-bold border border-transparent'
                       : 'bg-transparent hover:bg-slate-100 text-slate-500 border-transparent font-medium'
                 }`}
               >
                 <Icon size={14} className={isSelected ? 'text-cyan-400 animate-pulse' : isDark ? 'text-slate-400' : 'text-slate-500'} />
                 <span className="text-[9px] font-black uppercase tracking-wider block mt-1 leading-none">{m.label}</span>
                 <span className="text-[7px] block opacity-40 uppercase font-mono tracking-widest mt-0.5">{m.sub}</span>
               </button>
             );
           })}
         </div>

         {/* HYBRID CORE SELECTOR BANNER */}
         <div className={`flex flex-col sm:flex-row justify-between items-center px-4 py-2 border shrink-0 gap-2 mx-3 mt-2 rounded-2xl shadow-sm ${
           isDark ? "bg-slate-900/20 border-white/5" : "bg-slate-50 border-slate-200/50"
         }`}>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full animate-ping bg-emerald-400 shrink-0" />
             <span className={`text-[9.5px] font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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
             <span className={`ml-2 text-[9px] font-black uppercase tracking-wider ${isDark ? "text-slate-305 text-slate-300" : "text-slate-600"}`}>
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
                     msg.type === 'ai' 
                       ? isDark 
                         ? 'bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/20 text-cyan-400' 
                         : 'bg-emerald-50 border border-emerald-250 text-emerald-600' 
                       : isDark 
                         ? 'bg-slate-900 border border-white/10 text-slate-400' 
                         : 'bg-slate-100 border border-slate-200 text-slate-600'
                   }`}>
                     {msg.type === 'ai' ? <Brain size={14} className="animate-pulse" /> : <User size={14} />}
                   </div>
                   <div className={`p-4 rounded-2xl leading-relaxed relative break-words overflow-hidden ${
                     msg.type === 'ai' 
                       ? msg.id.startsWith('err-') 
                         ? 'bg-rose-950/30 border border-rose-500/10 text-rose-400 font-bold'
                         : isDark 
                           ? 'bg-slate-900/40 text-slate-200 border-none shadow-none' 
                           : 'bg-slate-50 text-slate-800 border-none shadow-none' 
                       : isDark 
                         ? 'bg-[#212121] text-[#ececec] border-none font-semibold shadow-none'
                         : 'bg-[#f4f4f4] text-[#0f172a] border-none font-semibold shadow-none'
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
                         <div className="leading-relaxed markdown-body">
                            <Markdown>{msg.text || ''}</Markdown>
                         </div>
                       )}
                     </div>

                     <div className={`text-[8.5px] opacity-45 mt-3 font-black uppercase tracking-widest font-mono text-right ${msg.type === 'user' ? 'text-slate-350' : 'text-slate-400'}`}>
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
             {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                    isDark ? "bg-slate-900 border-cyan-500/10 text-cyan-400" : "bg-emerald-50 border-emerald-250 text-emerald-600"
                  }`}>
                     <Brain size={14} className="animate-spin" />
                  </div>
                  <div className={`p-3.5 border rounded-xl flex gap-3 items-center ${
                    isDark ? "bg-slate-900/40 border-white/5" : "bg-slate-50 border-slate-200/80 shadow-sm"
                  }`}>
                     <span className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin shrink-0 ${
                       isDark ? "border-cyan-400" : "border-emerald-600"
                     }`} />
                     <span className={`text-[10px] font-black uppercase tracking-widest font-mono animate-pulse ${
                       isDark ? "text-cyan-400" : "text-emerald-700"
                     }`}>
                       TALEP COGNITIVE CORE ANALYZING...
                     </span>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           <div ref={chatEndRef} />
         </div>

         {/* Bottom Control Send Section */}
         <div className={`p-3 border-t sticky bottom-0 z-10 rounded-b-[24px] ${
           isDark ? "bg-slate-950/60 border-white/5" : "bg-white border-slate-100"
         }`}>
           
           {/* Slider Actions Chips Carousel */}
           <div className="mb-3.5">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x">
                 {quickActions.map((action, i) => (
                   <button 
                     key={i}
                     onClick={() => handleSend(action.query)}
                     className={`flex-shrink-0 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all active:scale-95 snap-start min-w-[155px] font-black text-[9.5px] uppercase cursor-pointer ${
                       isDark 
                         ? "bg-slate-900 hover:bg-cyan-500/10 hover:border-cyan-400/25 border-white/5 text-slate-300" 
                         : "bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border-slate-200 text-slate-700 shadow-sm"
                     }`}
                   >
                     <span>{action.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className={`flex gap-2.5 items-center border rounded-2xl p-1.5 focus-within:border-cyan-500/30 transition-all ${
             isDark ? "bg-slate-900 border-white/5" : "bg-slate-50 border-slate-200/80 shadow-inner"
           }`}>
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               placeholder={`"${selectedMode.toUpperCase()}" motoruna toksikolojik parametre girin...`}
               className={`flex-1 bg-transparent px-4 py-2.5 text-xs font-bold outline-none ${
                 isDark ? "text-white placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"
               }`}
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
