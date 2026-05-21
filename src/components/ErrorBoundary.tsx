import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Layers, Copy, Check } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[TALEP Recovery Mode] Component Crash Intercepted:", error, errorInfo);
    this.setState({ errorInfo });
    try {
      localStorage.setItem("talep_last_crash", JSON.stringify({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack
      }));
    } catch (e) {}
  }

  private handleReset = () => {
    try {
      localStorage.setItem("talep_mode", "demo");
      localStorage.removeItem("talep_cached_cases");
    } catch (e) {}
    window.location.reload();
  };

  private handleCopy = () => {
    const { error, errorInfo } = this.state;
    const log = `ERROR: ${error?.message}\nSTACK: ${error?.stack}\nCOMP_STACK: ${errorInfo?.componentStack}`;
    navigator.clipboard.writeText(log).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }).catch(() => {});
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex items-center justify-center p-6 selection:bg-cyan-500/20 antialiased font-sans">
          <div className="absolute inset-0 bg-radial-[circle_800px_at_50%_-200px] from-rose-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="w-full max-w-xl bg-slate-950/70 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-950/30 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>

              <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase mb-2">TALEP RECOVERY SERVICE</span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                TALEP Arıza Güvenliği Aktif
              </h1>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
                Yürütme katmanında beklenmeyen bir çalışma zamanı hatası oluştu. Klinik platform ve veritabanı kilitlenmesini önlemek için acil durum arayüzü kuruldu.
              </p>

              {/* Action grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                <button
                  id="recovery-reset-button"
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sistemi Yeniden Başlat
                </button>
                <button
                  id="recovery-copy-button"
                  onClick={this.handleCopy}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white border border-white/5 font-bold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      Günlük Kopyalandı
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 text-slate-400" />
                      Arıza Kodu Kopyala
                    </>
                  )}
                </button>
              </div>

              <div className="w-full text-left bg-slate-950/90 rounded-xl border border-white/5 p-4 font-mono text-[9px] text-slate-450 max-h-32 overflow-y-auto whitespace-pre-wrap">
                <p className="text-rose-400 font-bold mb-1">Crashed Component Error: {this.state.error?.message}</p>
                <p className="opacity-70 leading-relaxed">{this.state.error?.stack}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
