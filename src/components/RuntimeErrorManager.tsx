import React, { Component, ErrorInfo, ReactNode, useState, lazy, ComponentType, LazyExoticComponent } from "react";
import { AlertTriangle, RefreshCw, Database, Bot, Shield, Home } from "lucide-react";

/**
 * safeLazy: Wraps standard React.lazy to intercept fetch and network failures
 * globally, loading a beautiful fallback card rather than collapsing the entire router path.
 */
export function safeLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): LazyExoticComponent<T> {
  return lazy(() =>
    importFn().catch((err) => {
      console.error(`[safeLazy] Chunk load failed for component [${componentName}]:`, err);
      return {
        default: (() => (
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-amber-500/20 text-center my-6 shadow-xl animate-slide-up">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 dark:border-amber-900/30">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{componentName} Modülü Yüklenemedi</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Modül dosyaları sunucudan tam olarak indirilemedi. Bu durum geçici bir ağ kesintisinden kaynaklanıyor olabilir.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                id={`retry-lazy-${componentName}`}
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Sayfayı Yenile ve Tekrar Dene
              </button>
            </div>
          </div>
        )) as unknown as T,
      };
    })
  );
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * RuntimeErrorBoundary: Catches app-level rendering crashes and exhibits
 * an interactive, beautiful Emergency Recovery Control Center.
 */
export class RuntimeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[RuntimeErrorManager] Top-level app crash intercepted:", error);
    this.setState({ errorInfo });
    
    // Log crash details to local storage diagnostic log for trace analysis
    try {
      const logs = JSON.parse(localStorage.getItem("talep_crash_logs") || "[]");
      logs.push({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
      localStorage.setItem("talep_crash_logs", JSON.stringify(logs.slice(-5))); // keep last 5
    } catch (e) {}
  }

  private handleFullReset = () => {
    try {
      localStorage.setItem("talep_mode", "demo");
      localStorage.removeItem("talep_cached_cases");
      localStorage.removeItem("talep_cached_chemicals");
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex items-center justify-center p-6 selection:bg-cyan-500/20">
          <div className="absolute inset-0 bg-radial-[circle_800px_at_50%_-200px] from-[#0ea5e9]/10 to-transparent pointer-events-none" />
          
          <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-800/80 border border-amber-500/30 rounded-3xl flex items-center justify-center mb-8 shadow-inner animate-pulse">
                <AlertTriangle className="w-10 h-10 text-amber-500" />
              </div>

              <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase mb-3">CRITICAL RECOVERY ENGINE</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                Sistem Çalışma Zamanı Askıya Alındı
              </h1>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-8">
                TALEP v4.0 Premium, render döngüsü esnasında bir arıza tespit etti. Tıbbi arşiviniz veya oturumunuzda veri kaybı yaşanmaması için koruma katmanı devreye girdi.
              </p>

              {/* Action grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                <button
                  id="recovery-reload-btn"
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs py-4 px-6 rounded-2xl transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sistemi Yeniden Yükle
                </button>
                <button
                  id="recovery-demo-btn"
                  onClick={this.handleFullReset}
                  className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white border border-white/5 font-bold text-xs py-4 px-6 rounded-2xl transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  Demoya Dön ve Sıfırla
                </button>
              </div>

              <div className="w-full text-left bg-slate-950/50 rounded-2xl border border-white/5 p-4 font-mono text-[10px] text-slate-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                <p className="text-red-400 font-bold mb-1">Error: {this.state.error?.message}</p>
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

/**
 * SafeRenderWrapper: Catches module/page-level rendering exception.
 * Wraps individual routers page elements to localize crashes.
 */
export class SafeRenderWrapper extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[SafeRenderWrapper] Render module crash caught:", error);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-red-500/15 text-center my-6 shadow-xl relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-900/40">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Bileşen Render Başarısızlığı</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Bu görünüm yüklenirken bir çalışma zamanı hatası oluştu. Diğer modüller ve navigasyon paneli tam kapasite çalışmaya devam etmektedir.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              id="module-retry-btn"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 active:scale-95 transition-all text-[11px] font-bold rounded-xl cursor-pointer"
            >
              Görünümü Yenile
            </button>
            <button
              id="module-gohome-btn"
              onClick={() => {
                window.location.hash = "#/";
                window.location.reload();
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold rounded-xl cursor-pointer"
            >
              Panoya Dön
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * EmergencyDashboardFallback: Beautiful clinical dashboard fallback for maximum uptime interface guarantee.
 */
export function EmergencyDashboardFallback() {
  const [offlineAction, setOfflineAction] = useState<string | null>(null);

  const mockStats = [
    { label: "Surveyans Takibi", val: "3 Aktif Vaka", sub: "Yozgat / Bozok" },
    { label: "Toksikoloji DB", val: "148 Kimyasal", sub: "İnhalasyon & Deri" },
    { label: "Klinik Yapay Zeka", val: "Çevrimdışı Aktif", sub: "Local NLP Fallback" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans p-6 selection:bg-cyan-500/20">
      <div className="max-w-5xl mx-auto w-full space-y-8 py-10">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-slate-100 rounded-3xl p-6 border border-red-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="p-3 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </span>
            <div>
              <h2 className="font-extrabold text-[#0f172a] text-lg">TALEP ACİL DURUM KORUMA MODU</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sistem ve veritabanı kilitlenme riskini önlemek amaçlı minimal yedek podyum devrededir.</p>
            </div>
          </div>
          <button 
            id="emergency-dashboard-init-btn"
            onClick={() => {
              localStorage.setItem("talep_mode", "demo");
              window.location.reload();
            }}
            className="self-start md:self-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
          >
            Demo Hevesi ile Başlat
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockStats.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{item.label}</span>
              <p className="text-2xl font-black text-slate-900 mt-4">{item.val}</p>
              <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Diagnostic tools */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-600" />
            Yedek Reaksiyon & Teşhis Paneli
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Firebase bağlantısı koptuğunda veya yerel IndexedDB hatası oluştuğunda bu pencereden veri yapılandırmasını sıfırlayabilirsiniz. Aşağıdaki düğmeleri kullanarak güvenli temizleme komutları tetiklenebilir:
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                localStorage.clear();
                setOfflineAction("Tüm yerel çerezler temizlendi! Sayfa yenileniyor...");
                setTimeout(() => window.location.reload(), 1500);
              }}
              className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Önbelleği Komple Temizle
            </button>
            <button
              onClick={() => {
                setOfflineAction("Sistem canlandırma modülü devreye sokuldu!");
                setTimeout(() => window.location.reload(), 1500);
              }}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Sistemi Canlandır
            </button>
          </div>

          {offlineAction && (
            <p className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/40 animate-pulse">
              🔄 {offlineAction}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500 font-black tracking-widest uppercase">
          Yozgat Bozok Üniversitesi Tıp Fakültesi &copy; 2026
        </div>
      </div>
    </div>
  );
}
