import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  Tv, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  Zap, 
  ChevronRight,
  TrendingUp,
  FileText,
  Database,
  Brain,
  HelpCircle,
  Gift
} from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import { useSettings } from '../../context/SettingsContext';

interface SubscriptionPanelProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function SubscriptionPanel({ isModal = false, onClose }: SubscriptionPanelProps) {
  const { 
    tier, 
    trialActive, 
    trialDaysLeft,
    trialTimeLeftMs,
    rewardedAdUnlocksRemaining,
    aiUsageRemaining,
    pdfUsageRemaining,
    upgradeToPremium,
    cancelSubscription,
    startThreeDayTrial,
    watchRewardedAd,
    setShowUpgradeModal
  } = useMembership();
  
  const { showToast } = useSettings();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [simulatedGateway, setSimulatedGateway] = useState<'stripe' | 'google_play' | null>(null);

  // Format trial countdown cleanly
  const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return 'Süre Doldu';
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours}s ${mins}d ${secs}sn`;
  };

  const handleSimulatedPayment = async (gateway: 'stripe' | 'google_play') => {
    setLoading(true);
    setSimulatedGateway(gateway);
    showToast(`Bağlanıyor: ${gateway === 'stripe' ? 'Stripe Secure' : 'Google Play Billing'}...`);
    
    setTimeout(async () => {
      await upgradeToPremium(gateway);
      setLoading(false);
      setSimulatedGateway(null);
      if (onClose) onClose();
      setShowUpgradeModal(false);
    }, 2000);
  };

  const handleStartTrial = async () => {
    setLoading(true);
    setTimeout(async () => {
      await startThreeDayTrial();
      setLoading(false);
      if (onClose) onClose();
      setShowUpgradeModal(false);
    }, 1500);
  };

  const handleWatchAd = async () => {
    setLoading(true);
    const success = await watchRewardedAd();
    setLoading(false);
    if (success && onClose) {
      // Keep open or let them proceed
    }
  };

  const features = [
    { name: 'Gelişmiş Toksikoloji AI Analizleri', lite: 'Temel (5/gün)', premium: 'Sınırsız (Ultra Mantık)' },
    { name: 'Kapsamlı Literatür İstihbaratı', lite: 'Kısıtlı Görünüm', premium: 'Sınırsız Erişim (Gerçek Zamanlı)' },
    { name: 'Prof. Dr. VTS Akademik Modeli', lite: 'Devre Dışı', premium: 'Aktif Genomik/Epidemiyoloji' },
    { name: 'PDF Detaylı Rapor Raporlama', lite: 'Filigranlı (3/gün)', premium: 'Sınırsız Profesyonel' },
    { name: 'Klinik Karar Hafızası / Cache', lite: 'Her Oturumda Sıfırlanır', premium: 'Kalıcı & Güvenli Firestore' },
    { name: 'Mesleki Epidemiyoloji Grafik Katmanı', lite: 'Statik Gösterge', premium: 'Etkileşimli Moleküler Isı Haritaları' },
    { name: 'Destekleyici Kurumsal Entegrasyonlar', lite: 'Yok', premium: 'Stripe, GP & Sync Desteği' },
    { name: 'Reklamsız Bilimsel Çalışma Sahası', lite: 'Banner / Ödüllü Reklam', premium: 'Kesintisiz Çalışma' },
  ];

  return (
    <div className="bg-slate-50/50 rounded-3xl p-1 md:p-6 text-slate-800">
      
      {/* Top Banner Status */}
      <div className="mb-8 p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2rem] border border-slate-800 relative overflow-hidden shadow-xl max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase font-mono ${
                tier === 'premium' ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-700 text-slate-300'
              }`}>
                {tier === 'premium' ? (trialActive ? 'DENEME SÜRÜMÜ' : 'PREMIUM ÜYE') : 'LITE (ÜCRETSİZ)'}
              </span>
              {trialActive && (
                <span className="flex items-center gap-1 text-xs text-indigo-300 font-bold font-mono">
                  <Clock size={12} /> {formatTimeLeft(trialTimeLeftMs)} kaldı
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">
              {tier === 'premium' ? 'TALEP v4.0 Üstün Yetenekleri Açık' : 'Yüksek Başarımlı Toksikoloji AI Gücünü Açın'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {tier === 'premium' ? 
                'Kurumsal tıp lisansınız etkindir. Sınırsız AI kapasitesi, WHO standartlarında PDF raporlama ve kesintisiz kütüphane erişimine sahipsiniz.' : 
                'Günlük ücretsiz limitlerinizi genişletmek, tıp literaratürünün tamamına erişmek ve gelişmiş akıl yürütme katmanını aktifleştirmek için üyeliğinizi yükseltin.'
              }
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
            {tier === 'lite' && !trialActive && (
              <button
                onClick={handleStartTrial}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 duration-200 flex items-center justify-center gap-2"
              >
                <Gift size={15} /> 3 GÜNÜNÜ ÜCRETSİZ DENE
              </button>
            )}
            {tier === 'premium' && (
              <button
                onClick={() => {
                  cancelSubscription();
                }}
                className="w-full md:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-extrabold uppercase rounded-lg cursor-pointer"
              >
                Aboneliği Sonlandır
              </button>
            )}
          </div>
        </div>
      </div>

      {tier === 'lite' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          
          {/* LITE USAGE STATS CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Mevcut Limitler</span>
                <span className="p-1.5 bg-slate-100 rounded-lg text-slate-500"><AlertCircle size={14} /></span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase">Günlük LITE Kullanım Sayacı</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>AI Analiz Kotası</span>
                    <span>{aiUsageRemaining} Sol</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-blue h-full transition-all duration-500" 
                      style={{ width: `${(aiUsageRemaining / (5 + rewardedAdUnlocksRemaining)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Filigransız PDF Çıktısı</span>
                    <span>{pdfUsageRemaining} Sol</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full transition-all duration-500" 
                      style={{ width: `${(pdfUsageRemaining / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold italic">Gece yarısı (UTC 00:00) itibariyle kotalar otomatik yenilenecektir.</p>
            </div>
          </div>

          {/* REWARDED AD CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-amber-400 text-slate-900 text-[8px] font-mono font-black uppercase rounded-bl-xl tracking-wider">REKLAM DESTEĞİ</div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Lite Unlocks</span>
                <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500"><Tv size={14} /></span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2 uppercase">İzle ve Premium Analizi Kazan</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Abone olmadan da limitlerinizi genişletebilirsiniz! Tek bir tanıtım videosu izleyerek günlük hakkınıza <b>+1 Gelişmiş AI analizi</b> ekleyin.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-3 font-mono">
                <span>Bugün Kalan Unlocks:</span>
                <span className="text-emerald-600">{rewardedAdUnlocksRemaining} / 3</span>
              </div>
              <button
                disabled={rewardedAdUnlocksRemaining <= 0 || loading}
                onClick={handleWatchAd}
                className="w-full py-3 bg-slate-900 border border-slate-800 disabled:bg-slate-100 hover:bg-slate-850 text-white disabled:text-slate-400 rounded-xl text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-2 duration-200"
              >
                <Tv size={14} /> {loading && simulatedGateway === null ? 'YÜKLENİYOR...' : 'DESTEK REKLAMI İZLE'}
              </button>
            </div>
          </div>

          {/* SUBSCRIPTION BILLING TOGGLE & BUY */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between text-slate-800">
            <div>
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  AYLIK
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer relative ${
                    billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  YILLIK
                  <span className="absolute -top-3 -right-2 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-mono text-[7px] font-black rounded-lg uppercase tracking-wider animate-bounce block">
                    %20 TASARRUF
                  </span>
                </button>
              </div>

              <div className="text-center py-2 h-16 flex flex-col justify-center">
                {billingCycle === 'yearly' ? (
                  <>
                    <div className="text-2xl font-black text-slate-900">$50 <span className="text-xs text-slate-500 font-bold font-sans">/ Yıl</span></div>
                    <div className="text-[10px] text-emerald-500 font-extrabold uppercase mt-0.5 font-mono">Ömür Boyu Akıllı Tasarruf Paketleri</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-black text-slate-900">$5 <span className="text-xs text-slate-500 font-bold font-sans">/ Ay</span></div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5 font-mono">Dilediğiniz Zaman İptal Edin</div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <button
                disabled={loading}
                onClick={() => handleSimulatedPayment('stripe')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
              >
                <CreditCard size={13} /> {loading && simulatedGateway === 'stripe' ? 'STRIPE BAĞLANTISI...' : 'STRIPE İLE SATIN AL (\$)'}
              </button>
              <button
                disabled={loading}
                onClick={() => handleSimulatedPayment('google_play')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer duration-200 flex items-center justify-center gap-1.5"
              >
                <Zap size={11} /> {loading && simulatedGateway === 'google_play' ? 'GOOGLE BILLING...' : 'GOOGLE PLAY BILLING'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* CORE COMPARISON TABLE */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm overflow-hidden mb-6">
        <h4 className="text-md font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={16} /> Karşılaştırmalı Lisans Özellikleri
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 pb-2">
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">HİZMET KATMANI</th>
                <th className="py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">LITE (ÜCRETSİZ)</th>
                <th className="py-3 text-[10px] font-black text-amber-500 uppercase tracking-wider">PREMIUM ($5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-700">{feat.name}</td>
                  <td className="py-3.5 text-slate-500 text-[11px] font-medium">{feat.lite}</td>
                  <td className="py-3.5 text-slate-900 font-extrabold text-[11px] flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-500 stroke-[3]" /> {feat.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
