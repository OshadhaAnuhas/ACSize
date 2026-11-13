import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChoiceArtwork } from './ChoiceArtwork';
import { colors, radius, spacing } from '../theme';
import { Airflow } from '../types/room';

const options: { value: Airflow; label: string }[] = [
  { value: 'still', label: 'Still' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'strong', label: 'Strong' },
];

export function AirflowChoice({ value, onChange }: { value: Airflow; onChange: (value: Airflow) => void }) {
  return <View style={styles.group}><Text style={styles.label}>Airflow</Text><View style={styles.row}>{options.map(option => <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={`Airflow: ${option.label}`} accessibilityState={{ selected: value === option.value }} onPress={() => onChange(option.value)} style={[styles.card, value === option.value && styles.selected]}>
    <ChoiceArtwork kind={`airflow-${option.value}`} width={54} height={40} />
    <Text style={[styles.text, value === option.value && styles.selectedText]}>{option.label}</Text>
  </Pressable>)}</View></View>;
}

const styles = StyleSheet.create({ group: { gap: spacing.sm }, label: { color: colors.navy, fontWeight: '800' }, row: { flexDirection: 'row', gap: spacing.sm }, card: { flex: 1, minHeight: 86, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, selected: { backgroundColor: colors.paleBlue, borderColor: colors.blue }, text: { color: colors.slate, fontWeight: '700' }, selectedText: { color: colors.blueDark, fontWeight: '900' } });
