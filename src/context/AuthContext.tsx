import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useSettings } from './SettingsContext';

export type UserRole = 'admin' | 'physician' | 'laboratory' | 'observer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  title?: string;
  institution?: string;
  department?: string;
  orcid?: string;
  phone?: string;
  city?: string;
  createdAt?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  startOfflineMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local Storage keys for persistence in Demo mode
const DEMO_USER_KEY = 'talep_demo_auth_user';
const DEMO_PROFILE_KEY = 'talep_demo_auth_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { mode, setMode, showToast, setProfile } = useSettings();
  
  const mockUid = 'demo-guest-uid';
  const mockUser = {
    uid: mockUid,
    email: 'guest@talep.org',
    displayName: 'Dr. Şehmus Aykut',
    emailVerified: true
  } as any;

  const mockProfile: UserProfile = {
    uid: mockUid,
    email: 'guest@talep.org',
    displayName: 'Dr. Şehmus Aykut',
    role: 'physician',
    institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
    department: 'Halk Sağlığı Anabilim Dalı',
    city: 'Yozgat, Turkey'
  };

  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockProfile);
  const [role, setRole] = useState<UserRole | null>('physician');
  const [loading, setLoading] = useState<boolean>(false);

  // Fallback / Offline Mod Activator
  const startOfflineMode = () => {
    localStorage.setItem('talep_mode', 'demo');
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(mockProfile));

    setCurrentUser(mockUser);
    setUserProfile(mockProfile);
    setRole('physician');
    
    setProfile({
      fullName: mockProfile.displayName,
      email: mockProfile.email,
      institution: mockProfile.institution,
      department: mockProfile.department,
      city: mockProfile.city
    });

    setMode('demo');
    setLoading(false);
  };

  // Initialize Auth listeners & persistence support - immediate bypass
  useEffect(() => {
    try {
      localStorage.setItem('talep_mode', 'demo');
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(mockProfile));
    } catch (e) {}

    setProfile({
      fullName: mockProfile.displayName,
      email: mockProfile.email,
      institution: mockProfile.institution,
      department: mockProfile.department,
      city: mockProfile.city
    });

    setMode('demo');
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (mode === 'demo') {
        // Mock demo authentication flow
        const mockUid = 'demo-uid-' + Math.random().toString(36).substring(2, 9);
        const mockUser = {
          uid: mockUid,
          email,
          displayName: 'Şehmus Aykut (Demo)',
          emailVerified: true
        } as any;

        const mockProfile: UserProfile = {
          uid: mockUid,
          email,
          displayName: 'Şehmus Aykut (Demo)',
          role: 'admin',
          institution: 'Yozgat Bozok Üniversitesi',
          department: 'Halk Sağlığı',
          city: 'Yozgat, Turkey'
        };

        setCurrentUser(mockUser);
        setUserProfile(mockProfile);
        setRole('admin');
        
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(mockProfile));

        setProfile({
          fullName: mockProfile.displayName,
          email: mockProfile.email,
          institution: mockProfile.institution,
          department: mockProfile.department,
          city: mockProfile.city
        });

        showToast('Demo oturumu başarıyla açıldı.');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      showToast('Oturum başarıyla açıldı.');
    } catch (error: any) {
      console.error('Login error:', error);
      let errMsg = 'Oturum açılamadı. Lütfen e-posta ve şifrenizi kontrol edin.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errMsg = 'Hatalı e-posta adresi veya şifre girdiniz.';
      } else if (error.code === 'auth/too-many-requests') {
        errMsg = 'Çok fazla başarısız deneme yaptınız. Lütfen daha sonra tekrar deneyin.';
      }
      showToast(errMsg);
      setLoading(false);
      throw error;
    }
  };

  // Register state handler
  const register = async (email: string, password: string, displayName: string, preferredRole: UserRole) => {
    setLoading(true);
    try {
      if (mode === 'demo') {
        const mockUid = 'demo-uid-' + Math.random().toString(36).substring(2, 9);
        const mockUser = {
          uid: mockUid,
          email,
          displayName,
          emailVerified: true
        } as any;

        const mockProfile: UserProfile = {
          uid: mockUid,
          email,
          displayName,
          role: preferredRole,
          institution: 'Yozgat Bozok Üniversitesi',
          department: 'Halk Sağlığı',
          city: 'Yozgat, Turkey'
        };

        setCurrentUser(mockUser);
        setUserProfile(mockProfile);
        setRole(preferredRole);

        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(mockProfile));

        setProfile({
          fullName: mockProfile.displayName,
          email: mockProfile.email,
          institution: mockProfile.institution,
          department: mockProfile.department,
          city: mockProfile.city
        });

        showToast('Demo hesabı oluşturuldu ve oturum açıldı.');
        setLoading(false);
        return;
      }

      // Step 1: Firebase Auth user creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Save metadata to Firestore users collection
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email,
        displayName,
        role: preferredRole,
        institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
        department: 'Halk Sağlığı Anabilim Dalı',
        city: 'Yozgat, Turkey',
        createdAt: serverTimestamp()
      });

      showToast('Klinik hesap başarıyla oluşturuldu.');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errMsg = 'Hesap oluşturulamadı. Şebeke veya sunucu hatası oluştu.';
      if (error.code === 'auth/email-already-in-use') {
        errMsg = 'Bu e-posta adresi zaten kullanımda.';
      } else if (error.code === 'auth/weak-password') {
        errMsg = 'Şifre çok zayıf. En az 6 karakterli bir şifre seçmelisiniz.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Lütfen geçerli bir e-posta adresi yazın.';
      }
      showToast(errMsg);
      setLoading(false);
      throw error;
    }
  };

  // Logout state handler
  const logout = async () => {
    setLoading(true);
    try {
      if (mode === 'demo') {
        localStorage.removeItem(DEMO_USER_KEY);
        localStorage.removeItem(DEMO_PROFILE_KEY);
        setCurrentUser(null);
        setUserProfile(null);
        setRole(null);
        showToast('Demo oturumu sonlandırıldı.');
        setLoading(false);
        return;
      }

      await firebaseSignOut(auth);
      showToast('Oturum kapatıldı.');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Oturum kapatılırken bir hata oluştu.');
    }
    setLoading(false);
  };

  // Password Reset handler
  const resetPassword = async (email: string) => {
    try {
      if (mode === 'demo') {
        showToast('Şifre sıfırlama e-postası gönderildi (Demo Mod).');
        return;
      }
      await sendPasswordResetEmail(auth, email);
      showToast('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (error: any) {
      console.error('Reset password error:', error);
      let errMsg = 'Hata oluştu. Lütfen e-posta adresinizi doğrulayın.';
      if (error.code === 'auth/user-not-found') {
        errMsg = 'Söz konusu e-posta adresine kayıtlı kullanıcı bulunamadı.';
      }
      showToast(errMsg);
      throw error;
    }
  };

  // popup-based Google provider Auth
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (mode === 'demo') {
        showToast('Google ile Giriş demo ortamda taklit edildi.');
        await login('demo@google.com', 'dummyPassword');
        return;
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user record if they are logging in for the first time
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email || '',
          displayName: user.displayName || 'Google Kullanıcısı',
          role: 'observer',
          institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
          department: 'Halk Sağlığı Anabilim Dalı',
          city: 'Yozgat, Turkey',
          createdAt: serverTimestamp()
        });
      }
      showToast('Google ile Giriş başarılı.');
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      showToast('Google ile oturum açılamadı. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  // Direct profile parameters syncing & persistence
  const updateProfileData = async (data: Partial<UserProfile>) => {
    try {
      if (mode === 'demo') {
        if (!userProfile) return;
        const updated = { ...userProfile, ...data };
        setUserProfile(updated);
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updated));
        
        setProfile({
          fullName: updated.displayName,
          email: updated.email,
          institution: updated.institution,
          department: updated.department,
          city: updated.city
        });
        showToast('Profil başarıyla güncellendi.');
        return;
      }

      if (!currentUser) throw new Error('Oturum açık değil.');
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      if (userProfile) {
        const fullProf = { ...userProfile, ...data };
        setUserProfile(fullProf);
        setProfile({
          fullName: fullProf.displayName,
          email: fullProf.email,
          institution: fullProf.institution,
          department: fullProf.department,
          city: fullProf.city
        });
      }
      showToast('Hesap bilgileri başarıyla Firestore üzerinde kaydedildi.');
    } catch (err) {
      console.error('Store profile details failure:', err);
      showToast('Hata: Profil kaydedilemedi.');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      role,
      loading,
      login,
      register,
      logout,
      resetPassword,
      loginWithGoogle,
      updateProfileData,
      startOfflineMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
