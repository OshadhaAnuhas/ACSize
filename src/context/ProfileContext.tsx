import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { decodeLocalProfile, defaultProfilePreferences, LocalProfile } from '../types/profile';

const STORAGE_KEY = '@acsize/profile/v1';
type ProfileContextValue = {
  profile: LocalProfile | null;
  ready: boolean;
  dark: boolean;
  preferences: Pick<LocalProfile, 'preferredUnit' | 'electricityRateLKRPerKWh' | 'themeMode'>;
  saveProfile: (profile: LocalProfile) => Promise<void>;
  deleteProfile: () => Promise<void>;
};
const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [ready, setReady] = useState(false);
  const systemScheme = useColorScheme();
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => { if (active) setProfile(decodeLocalProfile(raw)); })
      .catch(() => {})
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  const preferences = profile ?? defaultProfilePreferences;
  const dark = preferences.themeMode === 'dark' || (preferences.themeMode === 'system' && systemScheme === 'dark');
  const saveProfile = async (next: LocalProfile) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
  };
  const deleteProfile = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };
  return <ProfileContext.Provider value={{ profile, ready, dark, preferences, saveProfile, deleteProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileProvider');
  return value;
}
