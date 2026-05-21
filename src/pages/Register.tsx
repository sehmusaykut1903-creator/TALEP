import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
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
import { TalepLogo } from '../components/TalepLogo';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/40 flex items-center justify-center p-4 xl:p-8 selection:bg-cyan-500/30 selection:text-slate-900">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-100/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white border border-slate-200/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10"
      >
        {/* Luminous dynamic glow decorations */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="mb-4"
          >
            <TalepLogo size="lg" variant="glass" />
          </motion.div>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase font-sans">
            Klinik Kayıt Olun
          </h2>
          <div className="mt-2.5">
            <p className="text-[10px] font-black tracking-widest text-[#0ea5e9] uppercase">
              Toksikolojik Akıllı Laboratuvar Eşleştirme Platformu
            </p>
            <p className="text-[9px] text-slate-500 font-medium mt-1 leading-normal max-w-md mx-auto">
              Mesleki Kimyasal Maruziyetlere Yönelik Klinik Karar Destek Sistemi
            </p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Ad Soyad</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Ahmet Yılmaz"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500/40 focus:bg-white transition-all text-slate-900 font-medium text-xs"
                />
              </div>
            </div>

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
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Güvenli Şifre</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5">Sözleşmeli Rol Yetkisi</label>
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
                        ? 'border-cyan-500 bg-cyan-50/20 shadow-sm scale-[1.01]' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`} style={isSelected ? { backgroundColor: theme.primary } : {}}>
                      <IconComp size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">{item.desc}</p>
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
            className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-cyan-600/15 cursor-pointer disabled:opacity-50 mt-2"
            style={{ backgroundColor: theme.primary }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Klinik Hesabı Tamamla</span>
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-6 mt-6 border-t border-slate-100">
          <p className="text-xs text-slate-550 font-medium">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/login" className="text-[#0ea5e9] hover:underline font-black uppercase tracking-wider text-[11px]">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
