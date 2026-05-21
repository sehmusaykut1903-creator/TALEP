import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldAlert, 
  Chrome, 
  Eye, 
  EyeOff,
  HelpCircle,
  Activity,
  Brain,
  BookOpen,
  Award,
  GraduationCap,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { TalepLogo } from '../components/TalepLogo';
import { ProjectCredits } from '../components/academic/ProjectCredits';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading } = useAuth();
  const { theme } = useSettings();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setErrorMsg(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg(null);
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setErrorMsg('Google ile oturum açılamadı.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/40 flex items-center justify-center p-4 xl:p-8 selection:bg-cyan-500/30 selection:text-slate-900">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-100/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container: Split Landing Showcase + Form Card */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT PANE: Premium Medical AI Startup Tech Showcase & Dynamic Landing Page */}
        <div className="lg:col-span-7 flex flex-col justify-between py-6 lg:py-10 space-y-8">
          
          {/* Tagline & Luminous Logo Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TalepLogo size="lg" variant="glass" />
              <div>
                <span className="text-[10px] font-black tracking-[0.25em] text-cyan-600 uppercase font-mono bg-cyan-50 border border-cyan-150 py-1 px-3 rounded-full">v4.0 OFFICIAL RELEASE</span>
                <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-none mt-1.5 uppercase font-sans">
                  TALEP <span className="text-cyan-600">PREMIUM</span>
                </h1>
              </div>
            </div>
            
            <p className="text-adaptive-lg font-bold text-slate-800 tracking-tight max-w-xl">
              Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu ile Mesleki Sürveyans ve Yoğun Biyomonitörizasyonda Yeni Çağ.
            </p>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Prof. Dr. Vugar Ali Türksoy rehberliğinde Yozgat Bozok Üniversitesi Tıp Fakültesi Halk Sağlığı Anabilim Dalı bünyesinde geliştirilen, IARC, ATSDR ve OSHA standartlarına tam uyumlu klinik karar destek asistanı.
            </p>
          </div>

          {/* Core Feature Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Feature 1 */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-500 shrink-0">
                <Brain size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase">Context-Aware AI Analiz</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Etken maddeye göre otomatik mod seçimi (Casual, Klinik, Akademik, Acil, Literatür).</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-500 shrink-0">
                <Layers size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase">Level Ia Kanıt Bildirisi</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Uluslararası hakemli tıp literatüründe {20}+ ana toksik profil ve veri bankası.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-500 shrink-0">
                <Activity size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase">Periyodik Biyomonitörizasyon</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Hastane, laboratuvar ve epidemiolojik şablonlarda kromatografi ve biyobelirteç izlemi.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-500 shrink-0">
                <Zap size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase">Acil Dekontaminasyon Modeli</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Kritik durumlarda şelasyon tedavi algoritmaları ve anlık koruyucu hekimlik yönergeleri.</p>
              </div>
            </div>

          </div>

          {/* Quick Platform Metrics Live Ticker */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 bg-slate-200/45 px-5 py-3 rounded-2xl border border-slate-300/30 w-fit">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> HIPAA / KVKK Uyumlu Güvenlik</span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500" /> Gelişmiş Biyobelirteç Kütüphanesi</span>
          </div>

        </div>

        {/* RIGHT PANE: Slick Interactive Secure Login Form */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full bg-white border border-slate-200/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            {/* Ambient subtle glow lights inside form card */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase">KLİNİK GİRİŞ KONSOLU</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Lütfen yetkili hekim / araştırmacı oturum bilgilerinizi giriniz.</p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-semibold"
              >
                <ShieldAlert size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">E-Posta Adresi</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="isim@kurum.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500/40 focus:bg-white transition-all text-slate-900 font-medium text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Şifre</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-[10px] text-[#0ea5e9] hover:underline font-bold transition-colors flex items-center gap-0.5"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-11 outline-none focus:border-cyan-500/40 focus:bg-white transition-all text-slate-900 font-medium text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-cyan-600/15 cursor-pointer disabled:opacity-50 mt-2"
                style={{ backgroundColor: theme.primary }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sisteme Güvenli Giriş Yap</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold">
                <span className="px-3 bg-white text-slate-400 uppercase tracking-widest">veya</span>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 py-3 rounded-2xl font-bold text-xs text-slate-700 shadow-sm transition-all cursor-pointer"
              >
                <Chrome size={15} className="text-red-500" />
                <span>Google ile Güvenli Giriş</span>
              </motion.button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  Hesabınız yok mu?{' '}
                  <Link to="/register" className="text-[#0ea5e9] hover:underline font-black uppercase tracking-wider text-[11px]">
                    Kayıt Olun
                  </Link>
                </p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>

      {/* FOOTER: Fixed Academic Affiliation Credits & Team Names */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-200/40 pt-4 gap-3 pointer-events-none">
        <div>
          TALEP v4.0 PREMIUM • Yozgat Bozok Üniversitesi Tıp Fakültesi
        </div>
        <div className="flex gap-4">
          <span>Şehmus AYKUT</span>
          <span>Fatma Nur AYKUT</span>
          <span>Aghajan MUSALI</span>
        </div>
      </div>

    </div>
  );
}
