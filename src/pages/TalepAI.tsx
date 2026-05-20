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
  Save
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { generateTalepAIResponse, AiContext, StructuredAiResponse } from '../services/talepAiService';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text?: string;
  structured?: StructuredAiResponse;
  timestamp: Date;
}

export default function TalepAI() {
  const { theme, t } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "TALEP AI AKTİF. Sektör, semptom ve laboratuvar verilerine göre toksikolojik risk analizi hazır. Klinik değerlendirme için veri girişi bekleniyor.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponseSummary, setLastResponseSummary] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(`session-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  const [recentAnalyses] = useState([
    { title: "Solvent Maruziyeti", date: "2 saat önce", risk: "Yüksek" },
    { title: "SFT Değerlendirmesi", date: "Dün", risk: "Orta" },
  ]);

  // Mock context for demo
  const [context, setContext] = useState<AiContext>({
    sector: "Boya / Kimya",
    unit: "Üretim Hattı - Solvent Tankları",
    symptoms: ["Laboratuvar: ALT Yüksekliği", "Klinik: Hafif Tremor"],
    riskLevel: 'medium'
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    
    setError(null);
    const userMsg: Message = {
      id: `u-${Date.now()}-${sessionId}`,
      type: 'user',
      text: textToSend,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      try {
        // Simulating random error for demonstration if needed, 
        // but generally we want to catch actual service failures
        if (Math.random() < 0.05) { // 5% chance to fail for demo purposes
           throw new Error("AI servis bağlantısı geçici olarak kesildi. Lütfen tekrar deneyin.");
        }

        let response = generateTalepAIResponse(textToSend, context);
        
        // Anti-repeat logic
        if (typeof response !== 'string' && response.summary === lastResponseSummary) {
          // Try to get another one if it's the same summary
          response = generateTalepAIResponse(textToSend + " variation", context);
        }

        const aiMsg: Message = {
          id: `ai-${Date.now()}-${sessionId}`,
          type: 'ai',
          timestamp: new Date(),
        };

        if (typeof response === 'string') {
          aiMsg.text = response;
        } else {
          aiMsg.structured = response;
          setLastResponseSummary(response.summary);
        }

        setMessages(prev => [...prev, aiMsg]);
        setError(null);
      } catch (err) {
        console.error("Talep AI Error:", err);
        setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
        
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          type: 'ai',
          text: err instanceof Error ? err.message : "Analiz motoru şu an yanıt veremiyor. Sistem yöneticisine bildirildi.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 500); 
  };


  const quickActions = [
    { label: "Solvent Analizi", icon: FlaskConical, query: "Solvent maruziyet analizi başlat" },
    { label: "Ağır Metal Analizi", icon: Activity, query: "Ağır metal riski değerlendir" },
    { label: "SFT Yorumu", icon: Zap, query: "SFT sonuçlarını yorumla" },
    { label: "ALT/AST Değerlendir", icon: Brain, query: "Karaciğer enzimlerini analiz et" },
    { label: "İş Kazası Riski", icon: AlertTriangle, query: "İş kazası risk faktörleri" },
    { label: "PPE Uygunluğu", icon: ShieldCheck, query: "KKE ekipman kontrolü" },
    { label: "MSDS Özeti", icon: ClipboardList, query: "MSDS verilerini özetle" },
    { label: "Klinik Öneri Oluştur", icon: CheckCircle2, query: "Klinik yönetim önerisi oluştur" },
  ];

  const renderAiMessage = (msg: Message) => {
    if (msg.structured) {
      const res = msg.structured;
      return (
        <div className="space-y-4 max-w-full">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 mb-1">
             <Info size={12} />
             KLİNİK ANALİZ RAPORU
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-2xl shadow-slate-200/50">
             <div className="flex justify-between items-start mb-5">
                <div>
                   <h4 className="text-sm md:text-base font-black text-slate-900 leading-tight pr-4">{res.summary}</h4>
                   <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Klinik Analiz Bulgusu</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  res.riskLevel === 'Kritik' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30' :
                  res.riskLevel === 'Yüksek' ? 'bg-orange-500 text-white' :
                  res.riskLevel === 'Orta-Yüksek' ? 'bg-amber-500 text-white' :
                  res.riskLevel === 'Orta' ? 'bg-blue-500 text-white' :
                  'bg-emerald-500 text-white'
                }`}>
                  {res.riskLevel} RİSK
                </div>
             </div>

             {res.alert && (
               <div className="mb-5 p-4 bg-rose-50/80 backdrop-blur-sm border border-rose-100 rounded-2xl flex gap-3 items-start">
                  <div className="p-1.5 bg-rose-500 rounded-lg text-white">
                    <AlertTriangle size={14} />
                  </div>
                  <p className="text-xs font-bold text-rose-700 leading-relaxed">{res.alert}</p>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      Olası Etkenler
                   </p>
                   <ul className="space-y-2">
                      {res.factors.map((f, i) => (
                        <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                           <div className="w-1 h-1 rounded-full bg-slate-300" />
                           {f}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                      Önerilen İncelemeler
                   </p>
                   <ul className="space-y-2">
                      {res.recommendations.map((r, i) => (
                        <li key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                           <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                           <span className="leading-snug">{r}</span>
                        </li>
                      ))}
                   </ul>
                </div>
             </div>

             <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                   <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg text-[10px] font-bold text-slate-600">
                      <FileText size={14} />
                      Raporla
                   </button>
                   <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg text-[10px] font-bold text-slate-600">
                      <Save size={14} />
                      Kaydet
                   </button>
                </div>
                <p className="text-[10px] font-black italic text-slate-300">CDSSv3.0.4</p>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap">
        {msg.text}
      </div>
    );
  };

  return (
    <div className="talep-ai-page talep-ai-mobile flex flex-col lg:flex-row min-h-dvh lg:h-[calc(100vh-140px)] gap-6 lg:gap-8 lg:overflow-hidden pt-[env(safe-area-inset-top)] overflow-y-auto lg:overflow-y-visible">
      {/* Left Chat Area (Main) */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 rounded-[2.5rem] lg:rounded-[3rem] p-1 border border-white shadow-inner lg:overflow-hidden">
        {/* Header - Clinical Breadcrumbs (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-4 p-6 border-b border-white/50">
           <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg relative">
              <Sparkles size={18} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-lg font-black text-slate-900 tracking-tight">TALEP AI</h2>
                 <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-lg uppercase tracking-widest">v3.2 CDSS ENGINE</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Activity size={10} /> Aktif Tarama Modu
                 </div>
                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Stethoscope size={10} /> Klinik Karar Destek
                 </div>
              </div>
           </div>
        </div>

        {/* Chat Area */}
        <div className="talep-ai-messages flex-1 p-4 md:p-10 space-y-6 md:space-y-8 lg:overflow-y-auto scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                    msg.type === 'ai' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'
                  }`}>
                    {msg.type === 'ai' ? <Sparkles size={16} /> : <User size={16} />}
                  </div>
                  <div className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-3xl shadow-sm leading-relaxed relative break-words overflow-hidden ${
                    msg.type === 'ai' 
                      ? msg.id.startsWith('err-') 
                        ? 'bg-rose-50 border border-rose-100 text-rose-800'
                        : 'bg-white/70 backdrop-blur-md text-slate-800 border border-white' 
                      : 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                  }`}
                  style={msg.type === 'user' ? { borderTopRightRadius: '4px' } : { borderTopLeftRadius: '4px' }}
                  >
                    {msg.id.startsWith('err-') && (
                      <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-rose-500 mb-2 uppercase">
                        <AlertTriangle size={12} />
                        Sistem Hatası
                      </div>
                    )}
                    <div className={msg.type === 'ai' ? 'text-[13px] md:text-sm font-semibold' : 'text-[13px] md:text-sm font-medium'}>
                      {renderAiMessage(msg)}
                    </div>
                    {msg.id.startsWith('err-') && (
                      <button 
                        onClick={() => {
                          // Find last user message to retry
                          const userMessages = messages.filter(m => m.type === 'user');
                          if (userMessages.length > 0) {
                            handleSend(userMessages[userMessages.length - 1].text);
                          }
                        }}
                        className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 active:scale-95"
                      >
                        Yeniden Dene
                      </button>
                    )}
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
                    <Sparkles size={16} />
                 </div>
                 <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-3 items-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" />
                      <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analiz hazırlanıyor...</span>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input & Quick Actions Panel */}
        <div className="p-4 md:p-8 bg-white/60 backdrop-blur-2xl border-t border-white/50 sticky bottom-0 z-30 lg:relative">
          {/* Quick Actions Grid / Carousel */}
          <div className="mb-4 md:mb-6">
             <div className="flex items-center gap-2 mb-3">
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">HIZLI ANALİZ MODÜLLERİ</p>
                <div className="flex-1 h-px bg-slate-100 shadow-sm" />
             </div>
             <div className="quick-actions-carousel flex lg:grid lg:grid-cols-4 gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory px-1 -mx-1">
                {quickActions.map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(action.query)}
                    className="quick-action-card flex-shrink-0 lg:flex-shrink flex items-center gap-3 p-4 lg:p-3 bg-white hover:bg-slate-900 rounded-2xl border border-slate-100 transition-all active:scale-95 shadow-sm hover:shadow-xl hover:shadow-slate-900/10 min-w-[200px] lg:min-w-0 snap-start"
                  >
                    <div className="p-2 lg:p-1.5 bg-slate-50 rounded-xl group-hover:bg-white/10 transition-colors">
                       <action.icon size={16} className="text-slate-500 group-hover:text-white lg:size-[12px]" />
                    </div>
                    <span className="text-[10px] md:text-[10px] font-black uppercase tracking-tight text-slate-600 group-hover:text-white whitespace-nowrap">{action.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="flex gap-3 md:gap-4 items-center">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Veri girişi..."
                className="w-full bg-white border-2 border-slate-50 rounded-2xl md:rounded-[2rem] px-5 md:px-8 py-3.5 md:py-5 text-sm font-bold shadow-2xl shadow-slate-200/20 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-slate-900 placeholder:text-slate-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300">
                 <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">ENTER İLE GÖNDER</span>
              </div>
            </div>
            <button 
              onClick={() => handleSend()}
              className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/30 active:scale-90 transition-all hover:bg-slate-800 group shrink-0"
            >
              <Send size={24} className="md:size-[28px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Context & Quick Cards) - Desktop Only */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/10 relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">SON ANALİZLER</h3>
           <div className="space-y-3 mb-8">
              {recentAnalyses.map((ana, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                   <div>
                      <p className="text-xs font-bold text-slate-700">{ana.title}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{ana.date}</p>
                   </div>
                   <div className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
                      ana.risk === 'Yüksek' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                   }`}>
                      {ana.risk.toUpperCase()}
                   </div>
                </div>
              ))}
           </div>

           <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">BAĞLAM ÖZETİ</h3>
           <div className="space-y-4">
              {[
                { label: 'Aktif Sektör', value: context.sector, color: 'text-blue-500', icon: FlaskConical },
                { label: 'Çalışma Birimi', value: context.unit, color: 'text-slate-400', icon: ClipboardList },
                { label: 'Risk Düzeyi', value: 'Orta-Yüksek', color: 'text-amber-500', icon: AlertTriangle, badge: true },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-white hover:border-slate-100 transition-colors">
                   <div className="flex items-center gap-2 mb-1.5">
                      <item.icon size={10} className={item.color} />
                      <p className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">{item.value}</p>
                      {item.badge && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                   </div>
                </div>
              ))}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-white">
                 <p className={`text-[9px] font-black uppercase tracking-widest text-rose-500 mb-2`}>ELEŞTİREL BULGULAR</p>
                 <div className="flex flex-wrap gap-1.5">
                    {context.symptoms?.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">{s}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/30 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
           <h3 className="text-xs font-black opacity-40 uppercase tracking-widest mb-6 relative z-10">ANALİZ ARAÇLARI</h3>
           <div className="space-y-3 relative z-10">
              {[
                { label: 'Klinik Özet Raporu', icon: ChevronRight },
                { label: 'Vaka Karşılaştırma', icon: ChevronRight },
                { label: 'Literatür Taraması', icon: ChevronRight },
                { label: 'MSDS Detaylarını Al', icon: ChevronRight }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group">
                   <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                   <item.icon size={12} className="text-slate-600 group-hover:text-white transition-colors translate-x-0 group-hover:translate-x-1" />
                </button>
              ))}
           </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white flex flex-col gap-4 shadow-xl shadow-blue-600/30">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <p className="text-sm font-black tracking-tight leading-tight">Antalya Kongresi</p>
                 <p className="text-[9px] opacity-60 font-black uppercase tracking-widest">CDSS ENGINE v3.2</p>
              </div>
           </div>
           <p className="text-[10px] font-medium opacity-80 leading-relaxed italic">"Klinik karar destek verileri tıbbi tavsiye yerine geçmez, uzman hekim görüşü esastır."</p>
        </div>
      </div>
    </div>
  );
}
