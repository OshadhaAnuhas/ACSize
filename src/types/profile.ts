import { UnitSystem } from './room';

export type ThemeMode = 'system' | 'light' | 'dark';
export interface LocalProfile {
  schemaVersion: 1;
  name: string;
  preferredUnit: UnitSystem;
  electricityRateLKRPerKWh: number;
  themeMode: ThemeMode;
}

export const defaultProfilePreferences = {
  preferredUnit: 'metric' as UnitSystem,
  electricityRateLKRPerKWh: 40,
  themeMode: 'system' as ThemeMode,
};

export function decodeLocalProfile(raw: string | null): LocalProfile | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const profile = value as Record<string, unknown>;
    if (profile.schemaVersion !== 1 || typeof profile.name !== 'string' || !profile.name.trim() || profile.name.trim().length > 40) return null;
    if (profile.preferredUnit !== 'metric' && profile.preferredUnit !== 'imperial') return null;
    if (typeof profile.electricityRateLKRPerKWh !== 'number' || !Number.isFinite(profile.electricityRateLKRPerKWh) || profile.electricityRateLKRPerKWh < 10 || profile.electricityRateLKRPerKWh > 80) return null;
    if (profile.themeMode !== 'system' && profile.themeMode !== 'light' && profile.themeMode !== 'dark') return null;
    return profile as unknown as LocalProfile;
  } catch { return null; }
}
