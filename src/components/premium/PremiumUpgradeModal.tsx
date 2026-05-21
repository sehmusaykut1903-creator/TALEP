import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import SubscriptionPanel from './SubscriptionPanel';

export default function PremiumUpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal } = useMembership();

  if (!showUpgradeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Close Header Bar */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-all active:scale-90"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 md:p-10 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-[10px] font-black uppercase tracking-wider font-mono">
                <Sparkles size={11} className="animate-spin" /> TALEP PREMIUM LİSANSI
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-2">PROFESYONEL AKILLI KATMANA GEÇİN</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">Sınırsız vaka analizi, WHO/IARC onaylı raporlama araçları ve akademik kütüphanenin tamamına erişim.</p>
            </div>

            <SubscriptionPanel isModal onClose={() => setShowUpgradeModal(false)} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
