import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[TALEP Safely Intercepted Error]:", error, errorInfo);
    this.setState({ 
      errorInfo: errorInfo.componentStack || null 
    });

    // Check sessionStorage to prevent infinite automatic reload loop
    try {
      const now = Date.now();
      const lastReloadStr = sessionStorage.getItem("talep_last_auto_reload");
      const lastReload = lastReloadStr ? parseInt(lastReloadStr, 10) : 0;
      
      // If we haven't auto-reloaded in the last 15 seconds, we can try one graceful auto-recovery
      if (now - lastReload > 15000) {
        sessionStorage.setItem("talep_last_auto_reload", String(now));
        console.warn("[ErrorBoundary] Initiating one-shot automatic recovery...");
        setTimeout(() => {
          this.handleReset();
        }, 1500);
      }
    } catch (e) {
      console.error("ErrorBoundary sessionStorage check failed:", e);
    }
  }

  private handleReset = () => {
    try {
      localStorage.removeItem("talep_cached_cases");
      localStorage.removeItem("talep_cached_chemicals");
      localStorage.setItem("talep_mode", "demo");
    } catch (e) {}
    window.location.reload();
  };

  private handleCleanSlate = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#070b13] text-[#e2e8f0] flex flex-col items-center justify-center p-6 select-none antialiased font-sans">
          <div className="absolute inset-0 bg-radial-[circle_400px_at_50%_30%] from-cyan-500/10 to-transparent pointer-events-none" />
          
          <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Klinik Arayüz Duraklatıldı
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                TALEP v4.0 çekirdek bellek yüklenirken veya veritabanı eşleştirilirken beklenmeyen bir durum saptandı.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl text-[10px] text-red-400/90 font-mono text-left max-h-24 overflow-y-auto border border-red-500/10 select-text">
                <span className="font-bold">Hata Sınıfı:</span> {this.state.error.name || "RuntimeError"}<br/>
                <span className="font-bold">Detay:</span> {this.state.error.message || "Bilinmeyen çalışma zamanı hatası."}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-lg active:scale-98"
              >
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>Modülleri Yenile & Geri Yükle</span>
              </button>

              <button
                onClick={this.handleCleanSlate}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                Tüm Önbelleği Sıfırla
              </button>
            </div>

            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
              PROTECTED BY TALEP CDSS SAFE SHIELD
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
