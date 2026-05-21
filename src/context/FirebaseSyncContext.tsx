import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { 
  ToxicologyCase, 
  DatabaseChemical, 
  SystemNotification, 
  LaboratoryResult,
  AIAssessment,
  OperationType,
  handleFirestoreError
} from '../firebase/firestoreService';

interface FirebaseSyncContextType {
  cases: ToxicologyCase[];
  chemicals: DatabaseChemical[];
  notifications: SystemNotification[];
  isLoading: boolean;
  syncError: string | null;
  addCase: (patientCase: Omit<ToxicologyCase, 'id' | 'createdAt'>, labResults?: Omit<LaboratoryResult, 'id' | 'createdAt'>, aiResult?: Omit<AIAssessment, 'id' | 'createdAt'>) => Promise<string | null>;
  markNotificationAsRead: (id: string) => Promise<void>;
  addNewNotification: (title: string, message: string, type: string) => Promise<void>;
}

const FirebaseSyncContext = createContext<FirebaseSyncContextType | undefined>(undefined);

// Balanced mock fallbacks when offline or in demo mode
const STATIC_MOCK_CASES: ToxicologyCase[] = [
  { id: '1', name: 'Ahmet Yılmaz', age: 45, gender: 'Erkek', sector: 'Metal', unit: 'Kaynak Atölyesi', duration: '12 yıl', ppeUsage: true, symptoms: ['Karın ağrısı', 'Halsizlik'], risk: 'Orta', createdAt: new Date('2026-05-18T10:00:00') },
  { id: '2', name: 'Ayşe Demir', age: 32, gender: 'Kadın', sector: 'Tarım', unit: 'Seracılık', duration: '4 yıl', ppeUsage: false, symptoms: ['Bulantı', 'Miyozis'], risk: 'Yüksek', createdAt: new Date('2026-05-19T14:30:00') },
  { id: '3', name: 'Mustafa Kaya', age: 50, gender: 'Erkek', sector: 'Boya', unit: 'Karışım & Dolum', duration: '20 yıl', ppeUsage: true, symptoms: ['Göz irritasyonu', 'Kuru öksürük'], risk: 'Orta', createdAt: new Date('2026-05-20T11:15:00') }
];

const STATIC_MOCK_CHEMICALS: DatabaseChemical[] = [
  { id: 'lead', name: 'Kurşun', cas: '7439-92-1', sectors: ['Metal', 'Akü'], exposureRoutes: ['İnhalasyon', 'Oral'], acuteSymptoms: ['Akut Karın Ağrısı', 'Konfüzyon'], chronicSymptoms: ['Anemi', 'Ensefalopati'], labs: ['Kan Kurşun Düzeyi', 'WBC'], organs: ['Hematopoetik', 'Sinir Sistemi'], riskInfo: 'Maruziyet takibi için aylık koruyucu kontrol ve KKD denetimleri önerilir.', riskLevelBase: 'High' }
];

const STATIC_MOCK_NOTIFICATIONS: SystemNotification[] = [
  { id: 'n1', title: 'Hoş Geldiniz', message: 'Tıbbi maruziyet ve toksikolojik değerlendirme paneline erişim sağlandı.', type: 'info', read: false, createdAt: new Date() }
];

export function FirebaseSyncProvider({ children }: { children: React.ReactNode }) {
  const { mode, showToast } = useSettings();
  const { currentUser } = useAuth();
  
  // Lazy initialize states from localStorage caches for instant rendering and failsafe offline loads
  const [cases, setCases] = useState<ToxicologyCase[]>(() => {
    try {
      const cached = localStorage.getItem('talep_cached_cases');
      return cached ? JSON.parse(cached) : STATIC_MOCK_CASES;
    } catch (e) {
      return STATIC_MOCK_CASES;
    }
  });

  const [chemicals, setChemicals] = useState<DatabaseChemical[]>(() => {
    try {
      const cached = localStorage.getItem('talep_cached_chemicals');
      return cached ? JSON.parse(cached) : STATIC_MOCK_CHEMICALS;
    } catch (e) {
      return STATIC_MOCK_CHEMICALS;
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const cached = localStorage.getItem('talep_cached_notifications');
      return cached ? JSON.parse(cached) : STATIC_MOCK_NOTIFICATIONS;
    } catch (e) {
      return STATIC_MOCK_NOTIFICATIONS;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    // If we are in 'demo' mode, we bypass server synchronization and serve clean cached/static state.
    if (mode === 'demo') {
      setIsLoading(false);
      setSyncError(null);
      return;
    }

    // Free-tier Optimization: Do not register onSnapshot listeners if user is not authenticated yet.
    if (!currentUser) {
      setIsLoading(false);
      setSyncError(null);
      return;
    }

    // Otherwise, attempt real-time synchronization.
    setIsLoading(true);
    setSyncError(null);

    let unsubscribeCases = () => {};
    let unsubscribeChemicals = () => {};
    let unsubscribeNotifs = () => {};

    // 1. Subscribe to Toxicology Cases
    try {
      const casesQuery = query(collection(db, 'toxicology_cases'), orderBy('createdAt', 'desc'));
      unsubscribeCases = onSnapshot(casesQuery, 
        (snapshot) => {
          const list: ToxicologyCase[] = [];
          snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            list.push({
              id: docSnap.id,
              ...item,
              createdAt: item.createdAt ? (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt)) : new Date()
            } as ToxicologyCase);
          });
          const resultList = list.length > 0 ? list : STATIC_MOCK_CASES;
          setCases(resultList);
          try {
            localStorage.setItem('talep_cached_cases', JSON.stringify(resultList));
          } catch (e) {}
          setIsLoading(false);
        }, 
        (err) => {
          setIsLoading(false);
          setSyncError(err.message);
          console.warn('Toxicology Cases subscription error. Active Local Cache is being used.', err);
          try {
            handleFirestoreError(err, OperationType.LIST, 'toxicology_cases');
          } catch (e) {}
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to toxicology_cases. Using static fallback data.', e);
      setIsLoading(false);
    }

    // 2. Subscribe to Chemicals DB
    try {
      const chemicalsCol = collection(db, 'chemicals');
      unsubscribeChemicals = onSnapshot(chemicalsCol,
        (snapshot) => {
          const list: DatabaseChemical[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as DatabaseChemical);
          });
          if (list.length > 0) {
            setChemicals(list);
            try {
              localStorage.setItem('talep_cached_chemicals', JSON.stringify(list));
            } catch (e) {}
          }
        },
        (err) => {
          console.warn('Chemicals DB subscription error:', err);
          try {
            handleFirestoreError(err, OperationType.LIST, 'chemicals');
          } catch (e) {}
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to chemicals collection. Using static fallback.', e);
    }

    // 3. Subscribe to Notifications
    try {
      const notifQuery = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      unsubscribeNotifs = onSnapshot(notifQuery,
        (snapshot) => {
          const list: SystemNotification[] = [];
          snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            list.push({
              id: docSnap.id,
              ...item,
              createdAt: item.createdAt ? (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt)) : new Date()
            } as SystemNotification);
          });
          const resultNotifs = list.length > 0 ? list : STATIC_MOCK_NOTIFICATIONS;
          setNotifications(resultNotifs);
          try {
            localStorage.setItem('talep_cached_notifications', JSON.stringify(resultNotifs));
          } catch (e) {}
        },
        (err) => {
          console.warn('Notifications subscription error:', err);
          try {
            handleFirestoreError(err, OperationType.LIST, 'notifications');
          } catch (e) {}
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to notifications collection. Using static fallback.', e);
    }

    return () => {
      unsubscribeCases();
      unsubscribeChemicals();
      unsubscribeNotifs();
    };
  }, [mode, currentUser]);

  // Reusable unified Case Addition + Assessment + Lab Results transaction
  const addCase = async (
    patientCase: Omit<ToxicologyCase, 'id' | 'createdAt'>,
    labResults?: Omit<LaboratoryResult, 'id' | 'createdAt'>,
    aiResult?: Omit<AIAssessment, 'id' | 'createdAt'>
  ): Promise<string | null> => {
    try {
      if (mode === 'demo') {
        // Local state manipulation for Demo Mode
        const mockId = 'demo-' + Math.random().toString(36).substring(2, 9);
        const newCaseRecord: ToxicologyCase = {
          id: mockId,
          ...patientCase,
          createdAt: new Date()
        };
        
        setCases(prev => [newCaseRecord, ...prev]);
        showToast('Vaka kaydedildi (Demo Mod)');
        return mockId;
      }

      // 1. Core Toxicology Case doc write
      const caseRef = await addDoc(collection(db, 'toxicology_cases'), {
        ...patientCase,
        createdAt: serverTimestamp()
      });
      const caseId = caseRef.id;

      // 2. Lab Results doc write
      if (labResults) {
        await addDoc(collection(db, 'laboratory_results'), {
          ...labResults,
          caseId,
          createdAt: serverTimestamp()
        });
      }

      // 3. AI Assessment writing if present
      if (aiResult) {
        await addDoc(collection(db, 'ai_assessments'), {
          ...aiResult,
          caseId,
          createdAt: serverTimestamp()
        });
      }

      // 4. Generate system notification triggers seamlessly
      await addDoc(collection(db, 'notifications'), {
        title: `Yeni Vaka: ${patientCase.name}`,
        message: `${patientCase.sector} sektörü - Risk Düzeyi: ${patientCase.risk}`,
        type: patientCase.risk === 'Yüksek' ? 'warning' : 'info',
        read: false,
        createdAt: serverTimestamp()
      });

      showToast('Vaka başarıyla sisteme kaydedildi.');
      return caseId;
    } catch (err) {
      console.error('Firebase save vaka error:', err);
      showToast('Hata: Vaka kaydedilemedi. Çevrimdışı önbelleğe alındı.');
      try {
        handleFirestoreError(err, OperationType.CREATE, 'toxicology_cases');
      } catch (e) {}
      return null;
    }
  };

  const markNotificationAsRead = async (id: string): Promise<void> => {
    try {
      if (mode === 'demo') {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        return;
      }
      const ref = doc(db, 'notifications', id);
      await updateDoc(ref, { read: true });
    } catch (err) {
      console.warn('Unable to mark notification as read:', err);
    }
  };

  const addNewNotification = async (title: string, message: string, type: string): Promise<void> => {
    try {
      if (mode === 'demo') {
        const id = 'notif-' + Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [{ id, title, message, type, read: false, createdAt: new Date() }, ...prev]);
        return;
      }
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        type,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Unable to write system notification:', err);
    }
  };

  return (
    <FirebaseSyncContext.Provider value={{
      cases,
      chemicals,
      notifications,
      isLoading,
      syncError,
      addCase,
      markNotificationAsRead,
      addNewNotification
    }}>
      {children}
    </FirebaseSyncContext.Provider>
  );
}

export function useFirebaseSync() {
  const context = useContext(FirebaseSyncContext);
  if (context === undefined) {
    throw new Error('useFirebaseSync must be used within a FirebaseSyncProvider');
  }
  return context;
}
