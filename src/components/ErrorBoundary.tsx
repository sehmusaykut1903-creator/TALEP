import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, ChevronDown, ChevronUp, Copy, Check, Database } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDiagnostics: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDiagnostics: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught component error captured by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDiagnostics: false,
      copied: false,
    });
    window.location.reload();
  };

  private handleForceDemo = () => {
    localStorage.setItem('talep_mode', 'demo');
    localStorage.removeItem('talep_cached_cases');
    localStorage.removeItem('talep_cached_chemicals');
    localStorage.removeItem('talep_cached_notifications');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  private handleCopyDiagnostics = () => {
    const { error, errorInfo } = this.state;
    const diagnosticText = `Error: ${error?.message}\nStack: ${error?.stack}\nComponent Stack: ${errorInfo?.componentStack}`;
    
    navigator.clipboard.writeText(diagnosticText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }).catch(err => {
      console.error("Unable to copy diagnostics", err);
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 selection:bg-brand-blue/30 selection:text-brand-navy">
          <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-brand-navy/10 rounded-2xl shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            
            {/* Ambient subtle color grids */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 border border-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
              </div>

              <h1 className="text-2xl font-bold text-brand-navy tracking-tight mb-2">
                Klinik Sistem Oturumu Kesintiye Uğradı
              </h1>
              <p className="text-sm text-brand-navy/60 max-w-md mb-8">
                TALEP v4.0 akıllı yürütme katmanında beklenmeyen bir bileşen çalışma hatası saptandı. 
                Tıbbi verileriniz ve aktif oturumunuz güvendedir.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-8">
                <button
                  id="error-reset-btn"
                  onClick={this.handleReset}
                  className="flex items-center gap-2 bg-brand-navy text-white hover:bg-brand-navy/90 active:scale-95 transition-all px-5 py-2.5 rounded-xl font-medium text-xs shadow-md shadow-brand-navy/20 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sistemi Yeniden Başlat
                </button>

                <button
                  id="error-force-demo-btn"
                  onClick={this.handleForceDemo}
                  className="flex items-center gap-2 bg-cyan-600 text-white hover:bg-cyan-700 active:scale-95 transition-all px-5 py-2.5 rounded-xl font-medium text-xs shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  Çevrimdışı Acil Durum Modu
                </button>

                <button
                  id="error-copy-btn"
                  onClick={this.handleCopyDiagnostics}
                  className="flex items-center gap-2 border border-brand-navy/10 hover:bg-brand-navy/5 px-5 py-2.5 rounded-xl font-medium text-xs text-brand-navy transition-all cursor-pointer"
                >
                  {this.state.copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Arıza Günlüğü Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Hata Günlüğünü Kopyala
                    </>
                  )}
                </button>
              </div>

              {/* Collapsed Diagnostic Panel */}
              <div className="w-full border border-brand-navy/5 bg-brand-navy/5 rounded-xl text-left overflow-hidden">
                <button
                  id="error-diagnostics-toggle"
                  onClick={() => this.setState(prev => ({ showDiagnostics: !prev.showDiagnostics }))}
                  className="w-full flex items-center justify-between px-4 py-3 text-brand-navy/70 text-xs font-semibold hover:bg-brand-navy/10 transition-colors cursor-pointer"
                >
                  <span>Teknik Teşhis & Raporlama Bilgisi</span>
                  {this.state.showDiagnostics ? (
                    <ChevronUp className="w-4 h-4 text-brand-navy/50" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-brand-navy/50" />
                  )}
                </button>

                {this.state.showDiagnostics && (
                  <div className="p-4 border-t border-brand-navy/5 font-mono text-[10px] leading-relaxed text-brand-navy/80 select-all overflow-x-auto max-h-48 whitespace-pre-wrap">
                    <p className="font-bold text-red-600 mb-1">
                      [Fatal Component Error]: {this.state.error?.message || "Unknown Error"}
                    </p>
                    <p className="opacity-80">
                      {this.state.error?.stack || "No error stack available"}
                    </p>
                    {this.state.errorInfo?.componentStack && (
                      <p className="opacity-60 mt-2">
                        {this.state.errorInfo.componentStack}
                      </p>
                    )}
                  </div>
                )}
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
