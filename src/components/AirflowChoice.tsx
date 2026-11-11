import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, spacing } from '../theme';
import { Airflow } from '../types/room';

const options: { value: Airflow; label: string; lines: number }[] = [
  { value: 'still', label: 'Still', lines: 0 },
  { value: 'gentle', label: 'Gentle', lines: 2 },
  { value: 'strong', label: 'Strong', lines: 3 },
];

export function AirflowChoice({ value, onChange }: { value: Airflow; onChange: (value: Airflow) => void }) {
  return <View style={styles.group}><Text style={styles.label}>Airflow</Text><View style={styles.row}>{options.map(option => <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={`Airflow: ${option.label}`} accessibilityState={{ selected: value === option.value }} onPress={() => onChange(option.value)} style={[styles.card, value === option.value && styles.selected]}>
    <Svg width={54} height={40} viewBox="0 0 54 40" accessibilityElementsHidden>{option.lines === 0 ? <Path d="M15 20h24" stroke={colors.muted} strokeWidth="2" strokeLinecap="round" /> : Array.from({ length: option.lines }, (_, index) => <Path key={index} d={`M5 ${10 + index * 10} Q18 ${3 + index * 10} 29 ${10 + index * 10} T50 ${10 + index * 10}`} stroke={option.value === 'strong' ? colors.blue : colors.teal} strokeWidth="2.8" strokeLinecap="round" fill="none" />)}</Svg>
    <Text style={[styles.text, value === option.value && styles.selectedText]}>{option.label}</Text>
  </Pressable>)}</View></View>;
}

const styles = StyleSheet.create({ group: { gap: spacing.sm }, label: { color: colors.navy, fontWeight: '800' }, row: { flexDirection: 'row', gap: spacing.sm }, card: { flex: 1, minHeight: 86, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, selected: { backgroundColor: colors.paleBlue, borderColor: colors.blue }, text: { color: colors.slate, fontWeight: '700' }, selectedText: { color: colors.blueDark, fontWeight: '900' } });
