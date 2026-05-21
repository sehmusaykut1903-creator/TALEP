import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Activity, 
  ShieldAlert, 
  LockOpen, 
  Chrome, 
  Eye, 
  EyeOff,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading } = useAuth();
  const { theme, showToast } = useSettings();
  
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
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-2xl border border-slate-200/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Abstract animated gradient orbs for luxury background touch */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl -z-10 animate-pulse duration-4000" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl -z-10 animate-pulse duration-3000" />

        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 flex items-center justify-center text-white rounded-[1.2rem] mb-4 shadow-xl"
            style={{ backgroundColor: theme.primary, boxShadow: `0 15px 35px -5px ${theme.primary}50` }}
          >
            <Activity size={32} className="animate-pulse" />
          </motion.div>
          
          <h2 className="text-3xl font-black text-brand-navy tracking-tight leading-tight">
            TALEP Giriş
          </h2>
          <p className="text-sm text-brand-navy/60 font-medium mt-2">
            Mesleki Toksikoloji & Tıbbi Maruziyet Değerlendirme Sistemi
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/50 mb-2">E-Posta Adresi</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="isim@kurum.com"
                className="w-full bg-white/60 border border-brand-navy/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-brand-blue/30 focus:bg-white transition-all card-shadow text-brand-navy font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/50">Şifre</label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-brand-blue hover:text-brand-navy font-bold transition-colors flex items-center gap-1"
              >
                <HelpCircle size={12} />
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-white/60 border border-brand-navy/10 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-brand-blue/30 focus:bg-white transition-all card-shadow text-brand-navy font-medium text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white py-4 rounded-2xl font-black hover:bg-brand-navy transition-all shadow-lg shadow-brand-blue/20 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: theme.primary }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sisteme Giriş Yap</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-navy/5" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-slate-50 text-brand-navy/40 font-bold uppercase tracking-wider">veya</span>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-brand-navy/10 hover:bg-slate-50 py-3.5 rounded-2xl font-bold text-sm text-brand-navy shadow-sm transition-all cursor-pointer"
          >
            <Chrome size={18} className="text-red-500" />
            <span>Google ile Güvenli Giriş</span>
          </motion.button>

          <div className="text-center pt-4">
            <p className="text-xs text-brand-navy/50 font-medium">
              Henüz bir hesabınız yok mu?{' '}
              <Link to="/register" className="text-brand-blue hover:underline font-bold">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
