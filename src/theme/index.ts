import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useProfile } from '../context/ProfileContext';

export const colors = {
  background: '#F8FAFC', surface: '#FFFFFF', navy: '#0F172A', slate: '#475569', muted: '#64748B',
  line: '#E2E8F0', teal: '#0D9488', tealDark: '#0F766E', mint: '#E5F7F8', cyan: '#38BDF8',
  paleCyan: '#E0F2FE', blue: '#2563EB', blueDark: '#1D4ED8', paleBlue: '#EFF6FF',
  amber: '#F59E0B', amberDark: '#92400E', paleAmber: '#FEF3C7', danger: '#DC2626', success: '#15803D',
} as const;
export type ColorPalette = { [K in keyof typeof colors]: string };
export const darkColors: ColorPalette = {
  background: '#0B1220', surface: '#172033', navy: '#F8FAFC', slate: '#CBD5E1', muted: '#A7B5C9',
  line: '#334155', teal: '#2DD4BF', tealDark: '#5EEAD4', mint: '#143D3A', cyan: '#38BDF8',
  paleCyan: '#12334A', blue: '#60A5FA', blueDark: '#93C5FD', paleBlue: '#172C4A',
  amber: '#FBBF24', amberDark: '#FCD34D', paleAmber: '#3D2C15', danger: '#F87171', success: '#4ADE80',
};
const darkByLight = new Map(Object.keys(colors).map((key) => [colors[key as keyof typeof colors].toLowerCase(), darkColors[key as keyof ColorPalette]]));

export function useThemeColors(): ColorPalette {
  return useProfile().dark ? darkColors : colors;
}

/** Restyles existing light StyleSheet entries without changing layout measurements. */
export function useThemedStyles<T extends Record<string, object>>(baseStyles: T): T {
  const dark = useProfile().dark;
  return useMemo(() => {
    if (!dark) return baseStyles;
    return Object.fromEntries(Object.entries(baseStyles).map(([name, style]) => {
      const flat = StyleSheet.flatten(style) as Record<string, unknown>;
      const themed = Object.fromEntries(Object.entries(flat).map(([property, value]) => {
        if (typeof value !== 'string' || !/color|fill|stroke/i.test(property)) return [property, value];
        const original = value.toLowerCase();
        if ((property === 'color' || property === 'tintColor') && (original === '#fff' || original === '#ffffff')) return [property, value];
        if (property === 'backgroundColor' && original === colors.tealDark.toLowerCase()) return [property, '#115E59'];
        return [property, darkByLight.get(original) ?? value];
      }));
      return [name, themed];
    })) as T;
  }, [baseStyles, dark]);
}
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const typeScale = { caption: 12, body: 15, section: 19, title: 28, display: 30 } as const;
export const elevation = { card: { shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 } } as const;
