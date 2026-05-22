import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): Partial<State> {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[TALEP Safely Intercepted Error]:", error, errorInfo);
    // Auto-recovery attempt in 3 seconds to ensure client continuity
    setTimeout(() => {
      this.handleReset();
    }, 3000);
  }

  private handleReset = () => {
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
          <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <h1 className="text-base font-bold text-white tracking-tight">
              Sistem yeniden başlatılıyor...
            </h1>
            <p className="text-xs text-slate-400 leading-normal">
              Klinik veri katmanı ve güvenli oturum yapısı sıfırlanarak geri yükleniyor. Lütfen birkaç saniye bekleyin.
            </p>
            <button
              onClick={this.handleReset}
              className="text-[10px] font-black tracking-widest text-cyan-400 hover:text-cyan-300 uppercase underline cursor-pointer"
            >
              Şimdi Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
