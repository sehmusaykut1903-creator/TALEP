import { useSettings, Profile } from '../context/SettingsContext';

/**
 * useProfile Hook
 * Manages profile state and actions, syncing with SettingsContext
 */
export function useProfile() {
  const { profile, setProfile, resetProfile } = useSettings();

  /**
   * updateProfile
   * Updates partial profile fields and persists to localStorage via context
   */
  const updateProfile = (partialProfile: Partial<Profile>) => {
    setProfile(partialProfile);
  };

  /**
   * uploadAvatar
   * Handles file upload, converts to base64, and updates profile
   */
  const uploadAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Basic validation: 1MB limit
      if (file.size > 1024 * 1024) {
        reject(new Error('Görsel boyutu 1MB\'dan küçük olmalıdır.'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile({
          avatarImage: base64,
          avatarType: 'custom'
        });
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('Görsel okunurken bir hata oluştu.'));
      };
      reader.readAsDataURL(file);
    });
  };

  return {
    profile,
    updateProfile,
    resetProfile,
    uploadAvatar
  };
}
