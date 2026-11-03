import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';
export function PrimaryButton({ label, onPress, variant = 'solid' }: { label: string; onPress: () => void; variant?: 'solid' | 'outline' }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.base, variant === 'outline' && styles.outline, pressed && styles.pressed]}><Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }, outline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.teal }, pressed: { opacity: 0.78 }, text: { color: '#FFF', fontSize: 16, fontWeight: '700' }, outlineText: { color: colors.tealDark } });
