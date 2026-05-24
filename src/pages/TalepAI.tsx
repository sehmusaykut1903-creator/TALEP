import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import {
  generateScientificReasoning,
  saveAiChatMemory,
  StructuredAiResponse,
} from "../services/talepAiService";
import { Stethoscope } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text?: string;
  structured?: StructuredAiResponse;
  timestamp: Date;
  isStreaming?: boolean;
}

export default function TalepAI() {
  const { theme, t } = useSettings();
  const { currentUser } = useAuth();
  const isDark = theme.isDark;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(`sess-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Otomatik aşağı kaydırma (Smart Scroll)
  useEffect(() => {
    if (!messagesEndRef.current) return;
    const scrollContainer = messagesEndRef.current.closest('main');
    if (scrollContainer) {
      // Sadece en alta yakınsak (son 200px) otomatik kaydır, kullanıcının scrollunu kilitleme
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 200;
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      } else if (!messages.some(m => m.isStreaming)) {
        // Yeni bir tam mesaj eklendiğinde (streaming bittiğinde veya yeni başladığında)
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    } else {
       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const getSafeTranslation = (key: string, fallback: string) => {
    const val = t(key);
    return (val && val !== key) ? val : fallback;
  };

  // Hızlı Prompt Önerileri (Yatay Scroll Carousel)
  const suggestionPills = [
    { id: "1", text: "💥 " + getSafeTranslation("lead_toxicity", "Kurşun toksisitesi nedir?") },
    { id: "2", text: "🧪 " + getSafeTranslation("arsenic_exposure", "Arsenik maruziyeti nasıl anlaşılır?") },
    { id: "3", text: "💊 " + getSafeTranslation("organophosphate_antidote", "Organofosfat zehirlenmesinde antidot nedir?") },
    { id: "4", text: "🏭 " + getSafeTranslation("occupational_risk", "Mesleki toksik risk analizi yap") },
    { id: "5", text: "📋 " + getSafeTranslation("clinical_summary", "Klinik vaka özeti oluştur") },
    { id: "6", text: "🔬 " + getSafeTranslation("benzene_leukemia", "Benzen maruziyeti ve lösemi ilişkisi nedir?") },
  ];

  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || inputValue;
    if (!textToSend.trim() || isLoading) return;

    setInputValue("");
    setIsLoading(true);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // 2. MEVCUT ÇALIŞAN GEMINI BACKEND API BAĞLANTISI (Bozmadan)
      const mockContext = {
        sector: "Genel Değerlendirme",
        unit: "Klinik Kabul",
      };

      const response = await generateScientificReasoning(
        textToSend,
        mockContext,
        "clinical",
        messages.slice(-4).map((m) => ({
          type: m.sender,
          text: m.text,
          response: m.structured,
        })),
        true // advanced reasoning enabled
      );

      const aiMsgBase: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        timestamp: new Date(),
        isStreaming: true,
      };

      // Ensure the message object has a structured field initially empty (if not casual)
      // If casual, we can use structured too to keep it unified, but with empty text first.
      const isCasualRes = response.isCasual;
      const fullText = response.rawText || "";

      // Add empty message to queue
      setMessages((prev) => [
        ...prev,
        {
          ...aiMsgBase,
          structured: { ...response, rawText: "" },
          text: isCasualRes ? "" : undefined,
        },
      ]);
      
      setIsLoading(false); // Enable input while streaming (or keep disabled if preferred, we'll let them scroll)

      // Simulate streaming
      let streamedText = "";
      // To ensure reasonable speed for long texts
      const chunkSize = fullText.length > 500 ? 3 : 1; 
      for (let i = 0; i < fullText.length; i += chunkSize) {
        streamedText += fullText.slice(i, i + chunkSize);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgBase.id
              ? {
                  ...m,
                  structured: { ...response, rawText: streamedText },
                  text: isCasualRes ? streamedText : m.text,
                }
              : m
          )
        );
        await new Promise((r) => setTimeout(r, 15));
      }

      // Streaming finished
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgBase.id
            ? { ...m, isStreaming: false, structured: response, text: isCasualRes ? response.rawText : m.text }
            : m
        )
      );

      if (currentUser?.uid) {
        await saveAiChatMemory(currentUser.uid, sessionId, "clinical", textToSend, response);
      }
    } catch (err: any) {
      console.error("Mesaj gönderim hatası:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "Toksikoloji motorundan geçerli bir analiz alınamadı. Lütfen internet bağlantınızı kontrol edin.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-[#070b19] transition-colors duration-300 relative overflow-hidden">
      {/* 1. SADE CHATGPT TARZI HEADER BADGE */}
      <header className="w-full px-4 md:px-8 py-4 bg-white/90 dark:bg-[#0d1527]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base font-black shadow-md shadow-indigo-600/15">
            🤖
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-tight text-[#0f172a] dark:text-white flex items-center gap-2">
              TALEP AI
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-full border border-emerald-500/20 flex items-center gap-1 select-none whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                GEMINI CLINICAL AI
              </span>
            </h1>
          </div>
        </div>
        <button
          onClick={() => setMessages([])}
          className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-[#1e293b] dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all select-none whitespace-nowrap"
        >
          ➕ {t("new_chat") || "Yeni Sohbet"}
        </button>
      </header>

      {/* 2. CHAT ALANI (Tablet/PC'de Ortalanmış Mükemmel ChatGPT Düzeni) */}
      <main 
        className="flex-1 w-full overflow-y-auto px-4 md:px-6 pt-6"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        <div className="w-full max-w-[880px] mx-auto min-h-full flex flex-col justify-end">
          {messages.length === 0 ? (
            // Karşılama Ekranı
            <div className="flex flex-col items-center justify-center text-center px-4 animate-fadeIn my-auto pb-64">
              <div className="text-4xl mb-4 select-none">🧬</div>
              <h2 className="text-xl font-black text-[#0f172a] dark:text-white mb-2">
                {getSafeTranslation("welcome_message", "TALEP AI Klinik Danışmanlık Paneli")}
              </h2>
              <p className="text-sm font-semibold text-[#334155] dark:text-slate-400 max-w-md leading-relaxed">
                Vugar hocanın sürveyans matrisleri ve klinik toksikoloji rehberleri doğrultusunda vakalarınızı analiz edebilirsiniz.
              </p>
            </div>
          ) : (
            // Mesaj Akışı
            <div className="space-y-6 w-full">
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const isAI = msg.sender === "ai";
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex w-full ${isAI ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[92%] md:max-w-[85%] rounded-2xl px-5 py-4 shadow-sm border ${
                          isAI
                            ? "bg-white dark:bg-[#0d1527] border-slate-200 dark:border-slate-800/80 text-[#0f172a] dark:text-slate-100"
                            : "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5 select-none">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider ${
                              isAI ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-200"
                            }`}
                          >
                            {isAI ? "🤖 TALEP CLINICAL AI" : "👤 KLİNİSYEN"}
                          </span>
                        </div>
                        {/* Tıbbi Format ve Markdown Desteği İçin İçerik */}
                        <div className="text-sm md:text-[15px] leading-relaxed font-medium break-words prose dark:prose-invert max-w-none text-[#0f172a] dark:text-slate-100 prose-p:text-[#0f172a] dark:prose-p:text-slate-200 prose-headings:text-[#0f172a] dark:prose-headings:text-white prose-strong:text-[#0f172a] dark:prose-strong:text-white prose-li:text-[#0f172a] dark:prose-li:text-slate-200">
                          {isAI && msg.structured ? (
                            <div className="space-y-4">
                              <Markdown>{messageStyleOverride(msg.structured.rawText || "")}</Markdown>
                              {msg.isStreaming && !msg.structured.rawText && (
                                <div className="text-slate-400 italic">TALEP AI yazıyor...</div>
                              )}
                              {msg.structured.surveillanceSuggestions &&
                                msg.structured.surveillanceSuggestions.length > 0 && (
                                  <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 not-prose">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                      <Stethoscope size={16} className="text-indigo-600 dark:text-indigo-400" /> Klinik
                                      Öneriler
                                    </h4>
                                    <ul className="text-sm space-y-2 text-[#475569] dark:text-slate-300 ml-1">
                                      {msg.structured.surveillanceSuggestions.map((s, i) => (
                                        <li key={i} className="flex gap-2.5 items-start">
                                          <span className="text-indigo-500 mt-0.5">•</span>
                                          <span className="leading-relaxed">{s}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800/80 rounded-2xl px-5 py-4 text-xs font-semibold text-[#475569] dark:text-slate-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <span className="ml-2">Analiz ediliyor...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-[230px] w-full flex-shrink-0" />
            </div>
          )}
        </div>
      </main>

      {/* 3. STICKY BOTTOM INPUT AREA (Alt Navbar Üstüne Çakışmayan Koruma Kalkanı) */}
      <div className="fixed md:absolute bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-[#070b19] dark:via-[#070b19]/95 dark:to-transparent px-4 pb-2 md:pb-6 pt-10 z-[70] pointer-events-none">
        <div className="max-w-[760px] mx-auto space-y-3 pointer-events-auto">
          {/* YATAY SCROLL PROMPT CHIPS CAROUSEL */}
          {messages.length === 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide select-none">
              {suggestionPills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => handleSendMessage(undefined, pill.text.substring(3))}
                  className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#1e293b] dark:text-slate-300 rounded-xl transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                  {pill.text}
                </button>
              ))}
            </div>
          )}

          {/* CHAT INPUT MATRIX */}
          <form
            onSubmit={handleSendMessage}
            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-[28px] p-2 flex items-center gap-2 shadow-lg shadow-slate-200/40 dark:shadow-none focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getSafeTranslation("type_message_placeholder", "Mesaj yazın...")}
              className="flex-1 bg-transparent border-none outline-none pl-4 pr-2 py-2 text-[15px] md:text-base text-[#0f172a] dark:text-white placeholder-[#64748b] dark:placeholder-slate-400 font-semibold"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
                inputValue.trim() && !isLoading
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>

          <p className="text-[10px] md:text-[10.5px] text-center font-semibold text-[#475569] dark:text-slate-500 select-none pb-1 md:pb-2">
             TALEP AI v4.0 Premium • Medikal Karar Destek Sistemi
          </p>
        </div>
      </div>
    </div>
  );
}

// Utility to ensure Markdown text renders nicely in prose class
function messageStyleOverride(text: string) {
  return text;
}