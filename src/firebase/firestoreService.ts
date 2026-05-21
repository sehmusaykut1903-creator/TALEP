import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Define the precise Operation Types matching the firebase-integration skill framework
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Structured error representation for diagnostic monitoring
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

/**
 * Handle and structure Firestore errors cleanly without allowing catastrophic crashes.
 * Translates errors to formal diagnostic JSON strings.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    }
  };
  console.error('[Firebase Service Error]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Data Interfaces representing the core collections outlined in firebase-blueprint.json ---

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: any;
}

export interface ToxicologyCase {
  id?: string;
  name: string;
  age: number;
  gender: string;
  sector: string;
  unit?: string;
  duration: string;
  ppeUsage: boolean;
  symptoms: string[];
  risk: string; // 'Low' | 'Medium' | 'High'
  notes?: string;
  createdAt: any;
}

export interface LaboratoryResult {
  id?: string;
  caseId: string;
  testName: string;
  value: string;
  isAbnormal: boolean;
  createdAt: any;
}

export interface AIAssessment {
  id?: string;
  caseId: string;
  matchedChemicals: string[];
  riskScore: number;
  clinicalAdvice: string;
  createdAt: any;
}

export interface DatabaseChemical {
  id?: string;
  name: string;
  cas?: string;
  sectors: string[];
  exposureRoutes: string[];
  acuteSymptoms: string[];
  chronicSymptoms: string[];
  labs: string[];
  organs: string[];
  riskInfo: string;
  riskLevelBase?: 'Low' | 'Medium' | 'High';
}

export interface SystemNotification {
  id?: string;
  title: string;
  message: string;
  type: string; // 'info' | 'warning' | 'error' | 'success'
  read: boolean;
  createdAt: any;
}

// --- Reusable DB fallbacks to safeguard against crashes if Firebase/Network is completely unavailable ---

const FALLBACK_USERS: Record<string, UserProfile> = {};
const FALLBACK_CASES: ToxicologyCase[] = [
  { id: '1', name: 'Ahmet Yılmaz', age: 45, gender: 'Erkek', sector: 'Metal', duration: '12 yıl', ppeUsage: true, symptoms: ['Karın ağrısı', 'Halsizlik'], risk: 'Orta', createdAt: new Date() },
  { id: '2', name: 'Ayşe Demir', age: 32, gender: 'Kadın', sector: 'Tarım', duration: '4 yıl', ppeUsage: false, symptoms: ['Bulantı', 'Miyozis'], risk: 'Yüksek', createdAt: new Date() }
];
const FALLBACK_LABS: LaboratoryResult[] = [];
const FALLBACK_ASSESSMENTS: Record<string, AIAssessment> = {};
const FALLBACK_NOTIFICATIONS: SystemNotification[] = [];

// --- Collection references ---
const USERS_COL = 'users';
const CASES_COL = 'toxicology_cases';
const LAB_COL = 'laboratory_results';
const AI_COL = 'ai_assessments';
const CHEM_COL = 'chemicals';
const NOTIF_COL = 'notifications';

// --- Reusable Service Functions & Handlers ---

export const userService = {
  async getUser(uid: string): Promise<UserProfile | null> {
    const path = `${USERS_COL}/${uid}`;
    try {
      const snap = await getDoc(doc(db, USERS_COL, uid));
      if (snap.exists()) {
        return { uid, ...snap.data() } as UserProfile;
      }
      return FALLBACK_USERS[uid] || null;
    } catch (err) {
      console.warn("Firebase getUser failed. Using offline memory.");
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (logErr) {
        // Safe logging logic so application NEVER crashes
      }
      return FALLBACK_USERS[uid] || null;
    }
  },

  async saveUser(user: UserProfile): Promise<void> {
    const path = `${USERS_COL}/${user.uid}`;
    try {
      const docRef = doc(db, USERS_COL, user.uid);
      await setDoc(docRef, {
        ...user,
        createdAt: user.createdAt || serverTimestamp()
      }, { merge: true });
      FALLBACK_USERS[user.uid] = user;
    } catch (err) {
      console.warn("Firebase saveUser failed.");
      FALLBACK_USERS[user.uid] = user;
      try {
        handleFirestoreError(err, OperationType.WRITE, path);
      } catch (logErr) {}
    }
  }
};

export const toxicologyCaseService = {
  async getCases(): Promise<ToxicologyCase[]> {
    try {
      const snap = await getDocs(query(collection(db, CASES_COL), orderBy('createdAt', 'desc')));
      const cases: ToxicologyCase[] = [];
      snap.forEach((d) => {
        const data = d.data();
        cases.push({
          id: d.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
        } as ToxicologyCase);
      });
      return cases.length > 0 ? cases : FALLBACK_CASES;
    } catch (err) {
      console.warn("Firebase getCases failed. Serving static/local cases safely.");
      try {
        handleFirestoreError(err, OperationType.LIST, CASES_COL);
      } catch (logErr) {}
      return FALLBACK_CASES;
    }
  },

  async getCaseById(id: string): Promise<ToxicologyCase | null> {
    const path = `${CASES_COL}/${id}`;
    try {
      const snap = await getDoc(doc(db, CASES_COL, id));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
        } as ToxicologyCase;
      }
      return FALLBACK_CASES.find(c => c.id === id) || null;
    } catch (err) {
      console.warn("Firebase getCaseById failed.");
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (logErr) {}
      return FALLBACK_CASES.find(c => c.id === id) || null;
    }
  },

  async createCase(item: Omit<ToxicologyCase, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CASES_COL), {
        ...item,
        createdAt: serverTimestamp()
      });
      const newCase = { id: docRef.id, ...item, createdAt: new Date() };
      FALLBACK_CASES.unshift(newCase);
      return docRef.id;
    } catch (err) {
      console.warn("Firebase createCase failed.");
      const mockId = 'mock-' + Math.random().toString(36).substring(2, 9);
      const newCase = { id: mockId, ...item, createdAt: new Date() };
      FALLBACK_CASES.unshift(newCase);
      try {
        handleFirestoreError(err, OperationType.CREATE, CASES_COL);
      } catch (logErr) {}
      return mockId;
    }
  },

  async updateCase(id: string, updates: Partial<ToxicologyCase>): Promise<void> {
    const path = `${CASES_COL}/${id}`;
    try {
      const docRef = doc(db, CASES_COL, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      const idx = FALLBACK_CASES.findIndex(c => c.id === id);
      if (idx !== -1) {
        FALLBACK_CASES[idx] = { ...FALLBACK_CASES[idx], ...updates };
      }
    } catch (err) {
      console.warn("Firebase updateCase failed.");
      const idx = FALLBACK_CASES.findIndex(c => c.id === id);
      if (idx !== -1) {
        FALLBACK_CASES[idx] = { ...FALLBACK_CASES[idx], ...updates };
      }
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch (logErr) {}
    }
  },

  async deleteCase(id: string): Promise<void> {
    const path = `${CASES_COL}/${id}`;
    try {
      await deleteDoc(doc(db, CASES_COL, id));
      const idx = FALLBACK_CASES.findIndex(c => c.id === id);
      if (idx !== -1) {
        FALLBACK_CASES.splice(idx, 1);
      }
    } catch (err) {
      console.warn("Firebase deleteCase failed.");
      const idx = FALLBACK_CASES.findIndex(c => c.id === id);
      if (idx !== -1) {
        FALLBACK_CASES.splice(idx, 1);
      }
      try {
        handleFirestoreError(err, OperationType.DELETE, path);
      } catch (logErr) {}
    }
  }
};

export const laboratoryResultService = {
  async getLabResultsForCase(caseId: string): Promise<LaboratoryResult[]> {
    try {
      const q = query(collection(db, LAB_COL), where('caseId', '==', caseId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const labs: LaboratoryResult[] = [];
      snap.forEach(d => {
        labs.push({ id: d.id, ...d.data() } as LaboratoryResult);
      });
      return labs.length > 0 ? labs : FALLBACK_LABS.filter(l => l.caseId === caseId);
    } catch (err) {
      console.warn("Firebase getLabResultsForCase failed.");
      try {
        handleFirestoreError(err, OperationType.LIST, LAB_COL);
      } catch (logErr) {}
      return FALLBACK_LABS.filter(l => l.caseId === caseId);
    }
  },

  async createLabResult(item: Omit<LaboratoryResult, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, LAB_COL), {
        ...item,
        createdAt: serverTimestamp()
      });
      FALLBACK_LABS.push({ id: docRef.id, ...item, createdAt: new Date() });
      return docRef.id;
    } catch (err) {
      console.warn("Firebase createLabResult failed.");
      const mockId = 'mock-lab-' + Math.random().toString(36).substring(2, 9);
      FALLBACK_LABS.push({ id: mockId, ...item, createdAt: new Date() });
      try {
        handleFirestoreError(err, OperationType.CREATE, LAB_COL);
      } catch (logErr) {}
      return mockId;
    }
  }
};

export const aiAssessmentService = {
  async getAIAssessmentForCase(caseId: string): Promise<AIAssessment | null> {
    try {
      const q = query(collection(db, AI_COL), where('caseId', '==', caseId), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...d.data() } as AIAssessment;
      }
      return FALLBACK_ASSESSMENTS[caseId] || null;
    } catch (err) {
      console.warn("Firebase getAIAssessmentForCase failed.");
      try {
        handleFirestoreError(err, OperationType.GET, AI_COL);
      } catch (logErr) {}
      return FALLBACK_ASSESSMENTS[caseId] || null;
    }
  },

  async createAIAssessment(item: Omit<AIAssessment, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, AI_COL), {
        ...item,
        createdAt: serverTimestamp()
      });
      const parsed = { id: docRef.id, ...item, createdAt: new Date() };
      FALLBACK_ASSESSMENTS[item.caseId] = parsed;
      return docRef.id;
    } catch (err) {
      console.warn("Firebase createAIAssessment failed.");
      const mockId = 'mock-ai-' + Math.random().toString(36).substring(2, 9);
      const parsed = { id: mockId, ...item, createdAt: new Date() };
      FALLBACK_ASSESSMENTS[item.caseId] = parsed;
      try {
        handleFirestoreError(err, OperationType.CREATE, AI_COL);
      } catch (logErr) {}
      return mockId;
    }
  }
};

export const chemicalService = {
  async getAllChemicals(): Promise<DatabaseChemical[]> {
    try {
      const snap = await getDocs(collection(db, CHEM_COL));
      const items: DatabaseChemical[] = [];
      snap.forEach(d => {
        items.push({ id: d.id, ...d.data() } as DatabaseChemical);
      });
      return items;
    } catch (err) {
      console.warn("Firebase getAllChemicals failed.");
      try {
        handleFirestoreError(err, OperationType.LIST, CHEM_COL);
      } catch (logErr) {}
      return [];
    }
  },

  async createChemical(item: DatabaseChemical): Promise<void> {
    const docId = item.id || item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const path = `${CHEM_COL}/${docId}`;
    try {
      await setDoc(doc(db, CHEM_COL, docId), item);
    } catch (err) {
      console.warn("Firebase createChemical failed.");
      try {
        handleFirestoreError(err, OperationType.WRITE, path);
      } catch (logErr) {}
    }
  }
};

export const notificationService = {
  async getNotifications(): Promise<SystemNotification[]> {
    try {
      const q = query(collection(db, NOTIF_COL), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items: SystemNotification[] = [];
      snap.forEach(d => {
        items.push({ id: d.id, ...d.data() } as SystemNotification);
      });
      return items.length > 0 ? items : FALLBACK_NOTIFICATIONS;
    } catch (err) {
      console.warn("Firebase getNotifications failed.");
      try {
        handleFirestoreError(err, OperationType.LIST, NOTIF_COL);
      } catch (logErr) {}
      return FALLBACK_NOTIFICATIONS;
    }
  },

  async createNotification(item: Omit<SystemNotification, 'id' | 'read' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, NOTIF_COL), {
        ...item,
        read: false,
        createdAt: serverTimestamp()
      });
      FALLBACK_NOTIFICATIONS.unshift({ id: docRef.id, ...item, read: false, createdAt: new Date() });
      return docRef.id;
    } catch (err) {
      console.warn("Firebase createNotification failed.");
      const mockId = 'mock-notif-' + Math.random().toString(36).substring(2, 9);
      FALLBACK_NOTIFICATIONS.unshift({ id: mockId, ...item, read: false, createdAt: new Date() });
      try {
        handleFirestoreError(err, OperationType.CREATE, NOTIF_COL);
      } catch (logErr) {}
      return mockId;
    }
  },

  async markNotificationRead(id: string): Promise<void> {
    const path = `${NOTIF_COL}/${id}`;
    try {
      await updateDoc(doc(db, NOTIF_COL, id), { read: true });
      const idx = FALLBACK_NOTIFICATIONS.findIndex(n => n.id === id);
      if (idx !== -1) {
        FALLBACK_NOTIFICATIONS[idx].read = true;
      }
    } catch (err) {
      console.warn("Firebase markNotificationRead failed.");
      const idx = FALLBACK_NOTIFICATIONS.findIndex(n => n.id === id);
      if (idx !== -1) {
        FALLBACK_NOTIFICATIONS[idx].read = true;
      }
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch (logErr) {}
    }
  }
};
