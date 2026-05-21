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
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-2xl border border-slate-200/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl -z-10" />
        
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy/60 hover:text-brand-navy transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            <span>Giriş Sayfasına Dön</span>
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-14 h-14 flex items-center justify-center text-white rounded-[1rem] mb-4 shadow-xl"
            style={{ backgroundColor: theme.primary }}
          >
            <HelpCircle size={28} />
          </div>
          
          <h2 className="text-2xl font-black text-brand-navy tracking-tight leading-none">
            Şifre Sıfırlama
          </h2>
          <p className="text-sm text-brand-navy/60 font-medium mt-3">
            E-posta adresinizi girerek kurtarma bağlantısı talep edin
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
            className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-4"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">Güvenli Talep Gönderildi</h4>
              <p className="text-xs text-emerald-700 font-medium leading-relaxed mt-2 mx-auto max-w-sm">
                E-posta gelen kutunuzu (ve spam klasörünü) kontrol edin. Şifre yenileme bağlantısı <b>{email}</b> adresine iletilmiştir.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Giriş Paylaşımlarına Git
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/50 mb-2">Kurumsal E-Posta</label>
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

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center bg-brand-blue text-white py-4 rounded-2xl font-black hover:bg-brand-navy transition-all shadow-lg shadow-brand-blue/20 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: theme.primary }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
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
