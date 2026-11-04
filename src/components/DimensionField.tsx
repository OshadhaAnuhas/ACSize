import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '../theme';
import { UnitSystem } from '../types/room';
import { displayDimension } from '../utils/units';
import { parseDimensionInput } from '../utils/dimensionInput';

export function DimensionField({ label, meters, unit, onChange, error }: { label: string; meters: number; unit: UnitSystem; onChange: (meters: number) => void; error?: string }) {
  const [text, setText] = useState(() => String(displayDimension(meters, unit)));
  const edit = (next: string) => {
    setText(next);
    onChange(parseDimensionInput(next, unit));
  };
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={`${label} in ${unit === 'metric' ? 'metres' : 'feet'}`} value={text} onChangeText={edit} onBlur={() => { if (Number.isFinite(meters)) setText(String(displayDimension(meters, unit))); }} keyboardType="decimal-pad" style={[styles.input, error && styles.invalid]} maxLength={8} /><Text style={styles.error}>{error ?? ' '}</Text></View>;
}
const styles = StyleSheet.create({ field: { flex: 1, gap: 4 }, label: { color: colors.navy, fontWeight: '700' }, input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, minHeight: 48, paddingHorizontal: 10, color: colors.navy }, invalid: { borderColor: colors.danger }, error: { color: colors.danger, fontSize: 11, minHeight: 14 } });
