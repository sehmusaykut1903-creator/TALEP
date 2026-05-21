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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local Storage keys for persistence in Demo mode
const DEMO_USER_KEY = 'talep_demo_auth_user';
const DEMO_PROFILE_KEY = 'talep_demo_auth_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { mode, showToast, setProfile } = useSettings();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Auth listeners & persistence support
  useEffect(() => {
    if (mode === 'demo') {
      // In Demo mode, fetch mock auth profile from localStorage if offline
      const savedUser = localStorage.getItem(DEMO_USER_KEY);
      const savedProfile = localStorage.getItem(DEMO_PROFILE_KEY);
      
      if (savedUser && savedProfile) {
        try {
          setCurrentUser(JSON.parse(savedUser) as any);
          const parsedProfile = JSON.parse(savedProfile) as UserProfile;
          setUserProfile(parsedProfile);
          setRole(parsedProfile.role);
          setProfile({
            fullName: parsedProfile.displayName,
            email: parsedProfile.email,
            institution: parsedProfile.institution || 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
            department: parsedProfile.department || 'Halk Sağlığı Anabilim Dalı',
            city: parsedProfile.city || 'Yozgat, Turkey'
          });
        } catch (e) {
          console.warn('Could not parse persisted static offline demo state.', e);
        }
      } else {
        // Set standard guest observer mode
        setCurrentUser(null);
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
      return;
    }

    // Firebase mode active subscription
    setLoading(true);
    console.log('[TALEP DEBUG] Initializing Firebase Auth and Services...');
    
    // Failsafe timeout to prevent infinite loader if auth listener or Firestore profile fetching hangs
    const failsafeTimeout = setTimeout(() => {
      setLoading((currLoading) => {
        if (currLoading) {
          console.warn('[TALEP DEBUG] Failsafe Auth Timeout triggered (2.0s). Forcing loading screen resolution for smooth startup.');
          return false;
        }
        return currLoading;
      });
    }, 2000);
    
    // Set Persistence explicitly to local
    setPersistence(auth, browserLocalPersistence)
      .catch((err) => console.warn('Persistence config issue:', err));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[TALEP DEBUG] Firebase Auth listener resolved. User state:', user ? `Logged In (${user.email})` : 'Guest / Observer');
      
      if (user) {
        setCurrentUser(user);
        
        // Caching Optimization: Try loading cached user profile from localStorage first
        const cacheKey = `talep_profile_cache_${user.uid}`;
        try {
          const cachedProfile = localStorage.getItem(cacheKey);
          if (cachedProfile) {
            const parsed = JSON.parse(cachedProfile) as UserProfile;
            setUserProfile(parsed);
            setRole(parsed.role);
            setProfile({
              fullName: parsed.displayName,
              email: parsed.email,
              institution: parsed.institution || 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
              department: parsed.department || 'Halk Sağlığı Anabilim Dalı',
              city: parsed.city || 'Yozgat, Turkey'
            });
            // Resolve visual loading gate early
            console.log('[TALEP DEBUG] Loaded user profile from local cache successfully.');
            setLoading(false);
            clearTimeout(failsafeTimeout);
          }
        } catch (e) {}

        try {
          // Fetch the user's role and database info safely with a 1.5s timeout
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await Promise.race([
            getDoc(userDocRef),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Firestore user profile fetch timeout')), 1500))
          ]);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as Omit<UserProfile, 'uid'>;
            const fullProfile: UserProfile = {
              uid: user.uid,
              ...data
            };
            setUserProfile(fullProfile);
            setRole(fullProfile.role);
            setProfile({
              fullName: fullProfile.displayName,
              email: fullProfile.email,
              institution: fullProfile.institution || 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
              department: fullProfile.department || 'Halk Sağlığı Anabilim Dalı',
              city: fullProfile.city || 'Yozgat, Turkey'
            });
            try {
              localStorage.setItem(cacheKey, JSON.stringify(fullProfile));
            } catch (e) {}
            console.log('[TALEP DEBUG] User profile successfully fetched from Firestore and cached locally.');
          } else {
            // Profile entry doesn't exist yet, construct a placeholder entry safely
            const placeholder: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Klinik Kullanıcı',
              role: 'observer',
              institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
              department: 'Halk Sağlığı Anabilim Dalı',
              city: 'Yozgat, Turkey',
              createdAt: new Date()
            };
            
            // Try saving placeholder
            try {
              await setDoc(userDocRef, {
                email: placeholder.email,
                displayName: placeholder.displayName,
                role: placeholder.role,
                institution: placeholder.institution,
                department: placeholder.department,
                city: placeholder.city,
                createdAt: serverTimestamp()
              });
            } catch (err) {
              console.warn('Could not save user profile document to Firestore due to rule boundaries.', err);
            }
            
            setUserProfile(placeholder);
            setRole(placeholder.role);
            setProfile({
              fullName: placeholder.displayName,
              email: placeholder.email,
              institution: placeholder.institution,
              department: placeholder.department,
              city: placeholder.city
            });
            console.log('[TALEP DEBUG] No profile document found in Firestore, created fallback profile placeholder.');
          }
        } catch (error) {
          console.warn('Could not retrieve Firestore user profile, using authenticated user metadata fallback.', error);
          // Fallback user details
          const fallback: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Klinik Kullanıcı',
            role: 'observer'
          };
          setUserProfile(fallback);
          setRole('observer');
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setRole(null);
        console.log('[TALEP DEBUG] Cleared user session details (Guest mode).');
      }
      setLoading(false);
      clearTimeout(failsafeTimeout);
      console.log('[TALEP DEBUG] Startup sequence complete. Releasing loading screen gate.');
    }, (error) => {
      console.error('Firebase Auth listener error: ', error);
      showToast('Bağlantı Hatası: Güvenli oturum doğrulanamadı.');
      setLoading(false);
      clearTimeout(failsafeTimeout);
    });

    return () => {
      clearTimeout(failsafeTimeout);
      unsubscribe();
    };
  }, [mode]);

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
      updateProfileData
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
