import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  HelpCircle,
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const { theme } = useSettings();
  
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Lütfen e-posta adresinizi yazın.');
      return;
    }
    setErrorMsg(null);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Şifre sıfırlama talebi başarısız oldu.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/40 flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-slate-900">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-100/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white border border-slate-200/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
        
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            <span>Giriş Sayfasına Dön</span>
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-14 h-14 flex items-center justify-center text-white rounded-2xl mb-4 shadow-lg shadow-cyan-600/15"
            style={{ backgroundColor: theme.primary }}
          >
            <HelpCircle size={26} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Şifre Sıfırlama
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-3">
            E-posta adresinizi girerek kurtarma bağlantısı talep edin.
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

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-emerald-50/10 border border-emerald-100 rounded-3xl text-center space-y-4"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">Güvenli Talep Gönderildi</h4>
              <p className="text-xs text-emerald-700 font-semibold leading-relaxed mt-2 mx-auto max-w-sm">
                E-posta gelen kutunuzu kontrol edin. Şifre yenileme bağlantısı <b>{email}</b> adresine iletilmiştir.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-705 transition-colors"
              >
                Giriş Ekranına Dön
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Kurumsal E-Posta</label>
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
                <span>Bağlantı Talep Et</span>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
