import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';
export function PrimaryButton({ label, onPress, variant = 'solid', disabled = false }: { label: string; onPress: () => void; variant?: 'solid' | 'outline'; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, variant === 'outline' && styles.outline, pressed && styles.pressed, disabled && styles.disabled]}><Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }, outline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.teal }, pressed: { opacity: 0.78 }, disabled: { opacity: 0.55 }, text: { color: '#FFF', fontSize: 16, fontWeight: '700' }, outlineText: { color: colors.tealDark } });
