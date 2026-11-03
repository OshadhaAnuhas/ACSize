import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
export function ChoiceChips<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  return <View style={styles.row}>{options.map((option) => <Pressable key={option.value} onPress={() => onChange(option.value)} style={[styles.chip, value === option.value && styles.selected]}><Text style={[styles.text, value === option.value && styles.selectedText]}>{option.label}</Text></Pressable>)}</View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, chip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface }, selected: { borderColor: colors.teal, backgroundColor: colors.mint }, text: { color: colors.slate, fontWeight: '600' }, selectedText: { color: colors.tealDark, fontWeight: '800' } });
