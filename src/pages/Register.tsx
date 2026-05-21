import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Stethoscope,
  FlaskConical,
  Eye as SeeIcon,
  Crown
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { theme } = useSettings();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('physician');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setErrorMsg(null);
    try {
      await register(email, password, fullName, role);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt esnasında bir sorun oluştu.');
    }
  };

  const roleCardConfig = [
    { id: 'physician' as UserRole, icon: Stethoscope, label: 'Uzman Hekim', desc: 'Vaka takipleri, maruziyet risk hesapları ve klinik teşhis.' },
    { id: 'laboratory' as UserRole, icon: FlaskConical, label: 'Laboratuvar', desc: 'Biyobelirteçler, laboratuvar verileri ve test analiz girişleri.' },
    { id: 'observer' as UserRole, icon: SeeIcon, label: 'Gözlemci', desc: 'İş sağlığı ve güvenliği izleme, istatistikler ve raporlama.' },
    { id: 'admin' as UserRole, icon: Crown, label: 'Yönetici', desc: 'Sistem geneli tam yönetim yetkisi ve yetkilendirme denetimleri.' },
  ];

  return (
    <div className="min-h-[100vh] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-2xl border border-slate-200/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            className="w-14 h-14 flex items-center justify-center text-white rounded-[1rem] mb-4 shadow-xl"
            style={{ backgroundColor: theme.primary }}
          >
            <ShieldCheck size={28} />
          </motion.div>
          
          <h2 className="text-3xl font-black text-brand-navy tracking-tight leading-tight">
            Klinik Kayıt Olun
          </h2>
          <p className="text-sm text-brand-navy/60 font-medium mt-2">
            TALEP Mesleki Toksikoloji platformunda klinik hesabınızı oluşturun
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/50 mb-2">Ad Soyad</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Ahmet Yılmaz"
                  className="w-full bg-white/60 border border-brand-navy/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-brand-blue/30 focus:bg-white transition-all card-shadow text-brand-navy font-medium text-sm"
                />
              </div>
            </div>

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
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/50 mb-2">Güvenli Şifre</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/50 mb-3">Sözleşmeli Rol Yetkisi</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleCardConfig.map((item) => {
                const IconComp = item.icon;
                const isSelected = role === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 select-none ${
                      isSelected 
                        ? 'border-brand-blue bg-brand-blue/5 shadow-md scale-[1.01]' 
                        : 'border-brand-navy/5 bg-white/50 hover:bg-white/90'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      isSelected ? 'bg-brand-blue text-white' : 'bg-slate-100 text-brand-navy/50'
                    }`} style={isSelected ? { backgroundColor: theme.primary } : {}}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-brand-navy">{item.label}</p>
                      <p className="text-[10px] text-brand-navy/60 font-medium leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white py-4 rounded-2xl font-black hover:bg-brand-navy transition-all shadow-lg shadow-brand-blue/20 cursor-pointer disabled:opacity-50 mt-4"
            style={{ backgroundColor: theme.primary }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Klinik Hesabı Tamamla</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-6 mt-4 border-t border-brand-navy/5">
          <p className="text-xs text-brand-navy/50 font-medium">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/login" className="text-brand-blue hover:underline font-bold">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
