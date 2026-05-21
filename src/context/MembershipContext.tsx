import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export type MembershipTier = 'lite' | 'premium';

export interface MembershipState {
  tier: MembershipTier;
  trialActive: boolean;
  trialExpiresAt: string | null; // ISO string
  trialTimeLeftMs: number;
  rewardedAdUnlocksToday: number; // max 3
  lastAdUnlockDate: string | null; // YYYY-MM-DD
  aiUsageToday: number;
  lastAiUsageDate: string | null; // YYYY-MM-DD
  pdfUsageToday: number;
  lastPdfUsageDate: string | null; // YYYY-MM-DD
}

interface MembershipContextType {
  tier: MembershipTier;
  trialActive: boolean;
  trialTimeLeftMs: number;
  trialDaysLeft: number;
  rewardedAdUnlocksRemaining: number;
  aiUsageRemaining: number;
  pdfUsageRemaining: number;
  upgradeToPremium: (paymentMethod: 'stripe' | 'google_play') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  startThreeDayTrial: () => Promise<void>;
  watchRewardedAd: () => Promise<boolean>;
  incrementAiUsage: () => Promise<boolean>;
  incrementPdfUsage: () => Promise<boolean>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  checkFeatureAccess: (feature: 'advanced_ai' | 'long_memory' | 'unlimited_literature' | 'full_pdf_reports' | 'advanced_epidemiology') => {
    allowed: boolean;
    reason?: string;
  };
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

const LITE_DAILY_AI_LIMIT = 5;
const LITE_DAILY_PDF_LIMIT = 3;

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, userProfile } = useAuth();
  const { mode, showToast } = useSettings();

  const [state, setState] = useState<MembershipState>({
    tier: 'lite',
    trialActive: false,
    trialExpiresAt: null,
    trialTimeLeftMs: 0,
    rewardedAdUnlocksToday: 0,
    lastAdUnlockDate: null,
    aiUsageToday: 0,
    lastAiUsageDate: null,
    pdfUsageToday: 0,
    lastPdfUsageDate: null,
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load from localStorage or Firestore based on current application session
  useEffect(() => {
    let active = true;

    async function loadData() {
      const todayStr = new Date().toISOString().split('T')[0];

      if (mode === 'demo' || !currentUser) {
        // Look up in localStorage
        const stored = localStorage.getItem(`talep_membership_${currentUser?.uid || 'guest'}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as MembershipState;
            // Check daily reset
            const updated = { ...parsed };
            if (updated.lastAdUnlockDate !== todayStr) {
              updated.rewardedAdUnlocksToday = 0;
              updated.lastAdUnlockDate = todayStr;
            }
            if (updated.lastAiUsageDate !== todayStr) {
              updated.aiUsageToday = 0;
              updated.lastAiUsageDate = todayStr;
            }
            if (updated.lastPdfUsageDate !== todayStr) {
              updated.pdfUsageToday = 0;
              updated.lastPdfUsageDate = todayStr;
            }

            // Expiry check for 3-day trial details
            if (updated.trialActive && updated.trialExpiresAt) {
              const expires = new Date(updated.trialExpiresAt).getTime();
              const now = Date.now();
              if (now >= expires) {
                updated.trialActive = false;
                updated.tier = 'lite';
                updated.trialTimeLeftMs = 0;
              } else {
                updated.trialTimeLeftMs = expires - now;
              }
            }

            if (active) setState(updated);
            return;
          } catch (e) {
            console.error('Error loading membership state', e);
          }
        }

        // Initialize default empty
        const defaultState: MembershipState = {
          tier: 'lite',
          trialActive: false,
          trialExpiresAt: null,
          trialTimeLeftMs: 0,
          rewardedAdUnlocksToday: 0,
          lastAdUnlockDate: todayStr,
          aiUsageToday: 0,
          lastAiUsageDate: todayStr,
          pdfUsageToday: 0,
          lastPdfUsageDate: todayStr,
        };
        if (active) setState(defaultState);
        localStorage.setItem(`talep_membership_${currentUser?.uid || 'guest'}`, JSON.stringify(defaultState));
      } else {
        // Firebase sync mode
        try {
          const userSubDocRef = doc(db, 'subscriptions', currentUser.uid);
          const docSnap = await getDoc(userSubDocRef);

          let dbState: Partial<MembershipState> = {};
          if (docSnap.exists()) {
            dbState = docSnap.data() as Partial<MembershipState>;
          }

          const defaultState: MembershipState = {
            tier: (dbState.tier as MembershipTier) || 'lite',
            trialActive: dbState.trialActive || false,
            trialExpiresAt: dbState.trialExpiresAt || null,
            trialTimeLeftMs: 0,
            rewardedAdUnlocksToday: dbState.rewardedAdUnlocksToday || 0,
            lastAdUnlockDate: dbState.lastAdUnlockDate || todayStr,
            aiUsageToday: dbState.aiUsageToday || 0,
            lastAiUsageDate: dbState.lastAiUsageDate || todayStr,
            pdfUsageToday: dbState.pdfUsageToday || 0,
            lastPdfUsageDate: dbState.lastPdfUsageDate || todayStr,
          };

          // Daily reset checks
          if (defaultState.lastAdUnlockDate !== todayStr) {
            defaultState.rewardedAdUnlocksToday = 0;
            defaultState.lastAdUnlockDate = todayStr;
          }
          if (defaultState.lastAiUsageDate !== todayStr) {
            defaultState.aiUsageToday = 0;
            defaultState.lastAiUsageDate = todayStr;
          }
          if (defaultState.lastPdfUsageDate !== todayStr) {
            defaultState.pdfUsageToday = 0;
            defaultState.lastPdfUsageDate = todayStr;
          }

          // Check Trial Expiry
          if (defaultState.trialActive && defaultState.trialExpiresAt) {
            const expires = new Date(defaultState.trialExpiresAt).getTime();
            const now = Date.now();
            if (now >= expires) {
              defaultState.trialActive = false;
              defaultState.tier = 'lite';
              defaultState.trialTimeLeftMs = 0;
            } else {
              defaultState.trialTimeLeftMs = expires - now;
            }
          }

          if (active) setState(defaultState);

          // Update backend if reset was needed
          if (docSnap.exists()) {
            await updateDoc(userSubDocRef, {
              rewardedAdUnlocksToday: defaultState.rewardedAdUnlocksToday,
              lastAdUnlockDate: defaultState.lastAdUnlockDate,
              aiUsageToday: defaultState.aiUsageToday,
              lastAiUsageDate: defaultState.lastAiUsageDate,
              pdfUsageToday: defaultState.pdfUsageToday,
              lastPdfUsageDate: defaultState.lastPdfUsageDate,
              trialActive: defaultState.trialActive,
              tier: defaultState.tier
            });
          } else {
            await setDoc(userSubDocRef, {
              ...defaultState,
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.warn('Membership Sync Error, falling back gracefully to local persistence.', err);
          // Standard local fallback on network/permission issues
          const stored = localStorage.getItem(`talep_membership_${currentUser.uid}`);
          if (stored) {
            try {
              const parsed = JSON.parse(stored) as MembershipState;
              if (active) setState(parsed);
            } catch (e) {}
          }
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [currentUser, mode]);

  // Periodic Countdown updates
  useEffect(() => {
    if (!state.trialActive || !state.trialExpiresAt) return;

    const interval = setInterval(() => {
      const expires = new Date(state.trialExpiresAt!).getTime();
      const now = Date.now();
      const diff = expires - now;

      if (diff <= 0) {
        // Downgrade user automatically
        const downgraded: MembershipState = {
          ...state,
          trialActive: false,
          tier: 'lite',
          trialTimeLeftMs: 0
        };
        setState(downgraded);
        saveState(downgraded);
        showToast('3 günlük ücretsiz deneme süreniz doldu, hesabınız LITE plana düşürüldü.');
        clearInterval(interval);
      } else {
        setState(prev => ({
          ...prev,
          trialTimeLeftMs: diff
        }));
      }
    }, 10000); // update every 10s is sufficient

    return () => clearInterval(interval);
  }, [state.trialActive, state.trialExpiresAt]);

  // Helper to persist state
  const saveState = async (updated: MembershipState) => {
    const uid = currentUser?.uid || 'guest';
    localStorage.setItem(`talep_membership_${uid}`, JSON.stringify(updated));

    if (mode === 'firebase' && currentUser) {
      try {
        const userSubDocRef = doc(db, 'subscriptions', currentUser.uid);
        await setDoc(userSubDocRef, {
          tier: updated.tier,
          trialActive: updated.trialActive,
          trialExpiresAt: updated.trialExpiresAt,
          rewardedAdUnlocksToday: updated.rewardedAdUnlocksToday,
          lastAdUnlockDate: updated.lastAdUnlockDate,
          aiUsageToday: updated.aiUsageToday,
          lastAiUsageDate: updated.lastAiUsageDate,
          pdfUsageToday: updated.pdfUsageToday,
          lastPdfUsageDate: updated.lastPdfUsageDate,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Could not save subscription to Firestore:', err);
      }
    }
  };

  const upgradeToPremium = async (paymentMethod: 'stripe' | 'google_play') => {
    const upgradedState: MembershipState = {
      ...state,
      tier: 'premium',
      trialActive: false, // End any trial once paid
    };
    setState(upgradedState);
    await saveState(upgradedState);
    showToast(`Premium Üyelik aktif edildi! (${paymentMethod === 'stripe' ? 'Stripe Gateway' : 'Google Play Billing'})`);
  };

  const cancelSubscription = async () => {
    const downgradedState: MembershipState = {
      ...state,
      tier: 'lite',
    };
    setState(downgradedState);
    await saveState(downgradedState);
    showToast('Aboneliğiniz sonlandırıldı. LITE hizmet paketine geçiş yapıldı.');
  };

  const startThreeDayTrial = async () => {
    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(now + threeDaysMs).toISOString();

    const updated: MembershipState = {
      ...state,
      tier: 'premium',
      trialActive: true,
      trialExpiresAt: expiresAt,
      trialTimeLeftMs: threeDaysMs
    };
    setState(updated);
    await saveState(updated);
    showToast('3 Günlük Ücretsiz PREMIUM Deneme Süreniz Başladı!');
  };

  const watchRewardedAd = async (): Promise<boolean> => {
    if (state.rewardedAdUnlocksToday >= 3) {
      showToast('Günlük maksimum reklamlı analiz limitine (3/3) ulaştınız.');
      return false;
    }

    // Simulate watching ad
    return new Promise((resolve) => {
      showToast('Reklam yükleniyor (Simüle Ediliyor)...');
      setTimeout(async () => {
        const updated: MembershipState = {
          ...state,
          rewardedAdUnlocksToday: state.rewardedAdUnlocksToday + 1,
          lastAdUnlockDate: new Date().toISOString().split('T')[0]
        };
        setState(updated);
        await saveState(updated);
        showToast('Reklam başarıyla izlendi! +1 Premium Analiz hakkı eklendi.');
        resolve(true);
      }, 2500);
    });
  };

  const incrementAiUsage = async (): Promise<boolean> => {
    if (state.tier === 'premium') return true;

    // Lite limits check
    const todayStr = new Date().toISOString().split('T')[0];
    let dailyUsage = state.aiUsageToday;
    if (state.lastAiUsageDate !== todayStr) {
      dailyUsage = 0;
    }

    // Evaluate ad-unlocked allowance
    const adUnlocksToday = state.rewardedAdUnlocksToday;
    const allowedLimit = LITE_DAILY_AI_LIMIT + adUnlocksToday;

    if (dailyUsage >= allowedLimit) {
      showToast('Günlük ücretsiz AI analiz limitinize ulaştınız. Reklam izleyebilir veya Premium pakete yükseltebilirsiniz.');
      setShowUpgradeModal(true);
      return false;
    }

    const updated: MembershipState = {
      ...state,
      aiUsageToday: dailyUsage + 1,
      lastAiUsageDate: todayStr
    };
    setState(updated);
    await saveState(updated);
    return true;
  };

  const incrementPdfUsage = async (): Promise<boolean> => {
    if (state.tier === 'premium') return true;

    const todayStr = new Date().toISOString().split('T')[0];
    let dailyUsage = state.pdfUsageToday;
    if (state.lastPdfUsageDate !== todayStr) {
      dailyUsage = 0;
    }

    if (dailyUsage >= LITE_DAILY_PDF_LIMIT) {
      showToast('Günlük PDF rapor dışa aktarma limitine (3/3) ulaştınız.');
      setShowUpgradeModal(true);
      return false;
    }

    const updated: MembershipState = {
      ...state,
      pdfUsageToday: dailyUsage + 1,
      lastPdfUsageDate: todayStr
    };
    setState(updated);
    await saveState(updated);
    return true;
  };

  const checkFeatureAccess = (feature: 'advanced_ai' | 'long_memory' | 'unlimited_literature' | 'full_pdf_reports' | 'advanced_epidemiology') => {
    if (state.tier === 'premium') {
      return { allowed: true };
    }

    switch (feature) {
      case 'advanced_ai':
        return { 
          allowed: false, 
          reason: 'Basit Akıl Yürütme Sınırı: LITE kullanıcıları için temel analiz katmanı açıktır.' 
        };
      case 'long_memory':
        return { 
          allowed: false, 
          reason: 'Akıllı Hafıza Logları: Bellek persistansı sadece PREMIUM üyeler içindir.' 
        };
      case 'unlimited_literature':
        return { 
          allowed: false, 
          reason: 'Kısıtlı Bilimsel Erişim: LITE kullanıcıları sadece kısıtlı tıp makalelerini inceleyebilir.' 
        };
      case 'full_pdf_reports':
        return { 
          allowed: false, 
          reason: 'Rapor Filigran Kilidi: Detaylı akademik/hastane şemaları için Premium gereklidir.' 
        };
      case 'advanced_epidemiology':
        return { 
          allowed: false, 
          reason: 'Epidemiyolojik Analiz Sınırı: Detaylı maruziyet grafikleri Premium aboneliği ile açılır.' 
        };
      default:
        return { allowed: true };
    }
  };

  const trialTimeLeftMs = state.trialTimeLeftMs;
  const trialDaysLeft = Math.ceil(trialTimeLeftMs / (24 * 60 * 60 * 1000));
  const rewardedAdUnlocksRemaining = Math.max(0, 3 - state.rewardedAdUnlocksToday);
  const aiUsageRemaining = Math.max(0, (LITE_DAILY_AI_LIMIT + state.rewardedAdUnlocksToday) - state.aiUsageToday);
  const pdfUsageRemaining = Math.max(0, LITE_DAILY_PDF_LIMIT - state.pdfUsageToday);

  return (
    <MembershipContext.Provider value={{
      tier: state.tier,
      trialActive: state.trialActive,
      trialTimeLeftMs,
      trialDaysLeft,
      rewardedAdUnlocksRemaining,
      aiUsageRemaining,
      pdfUsageRemaining,
      upgradeToPremium,
      cancelSubscription,
      startThreeDayTrial,
      watchRewardedAd,
      incrementAiUsage,
      incrementPdfUsage,
      showUpgradeModal,
      setShowUpgradeModal,
      checkFeatureAccess
    }}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
}
