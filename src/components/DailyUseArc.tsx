import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, spacing } from '../theme';

function mixColor(first: string, second: string, amount: number) {
  const channel = (start: number) => Math.round(parseInt(first.slice(start, start + 2), 16) * (1 - amount) + parseInt(second.slice(start, start + 2), 16) * amount).toString(16).padStart(2, '0');
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

function arc(progress: number) {
  const steps = Math.max(1, Math.round(48 * progress));
  return Array.from({ length: steps + 1 }, (_, index) => {
    const position = index / 48;
    const x = 12 + 296 * position;
    const y = 65 - 44 * Math.sin(Math.PI * position);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export function DailyUseArc({ hours, onChange }: { hours: number; onChange: (hours: number) => void }) {
  const color = hours <= 8 ? mixColor(colors.blue, colors.teal, (hours - 1) / 7) : mixColor(colors.teal, colors.amber, (hours - 8) / 8);
  return <View style={styles.card}>
    <Text style={styles.heading}>Daily use</Text>
    <View style={styles.arcArea} accessibilityLabel={`Daily AC use ${hours} hours per day`}>
      <Svg width="100%" height={85} viewBox="0 0 320 85" accessibilityElementsHidden>
        <Path d={arc(1)} stroke={colors.line} strokeWidth={12} strokeLinecap="round" fill="none" />
        <Path d={arc(hours / 16)} stroke={color} strokeWidth={12} strokeLinecap="round" fill="none" />
      </Svg>
      <View style={styles.readout}><Text style={[styles.hours, { color }]}>{hours} h</Text><Text style={styles.perDay}>per day</Text></View>
    </View>
    <View style={styles.controls}>
      <Pressable accessibilityRole="button" accessibilityLabel="Decrease daily use by one hour" accessibilityState={{ disabled: hours <= 1 }} disabled={hours <= 1} onPress={() => onChange(Math.max(1, hours - 1))} style={[styles.control, hours <= 1 && styles.disabled]}><Text style={styles.controlText}>−</Text></Pressable>
      <Text style={styles.range}>1–16 hours</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Increase daily use by one hour" accessibilityState={{ disabled: hours >= 16 }} disabled={hours >= 16} onPress={() => onChange(Math.min(16, hours + 1))} style={[styles.control, hours >= 16 && styles.disabled]}><Text style={styles.controlText}>＋</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paleBlue, borderRadius: radius.md, padding: spacing.lg, gap: 3 },
  heading: { color: colors.navy, fontWeight: '800' },
  arcArea: { height: 87, alignItems: 'center', justifyContent: 'center' },
  readout: { position: 'absolute', bottom: 4, alignItems: 'center' },
  hours: { fontSize: 25, fontWeight: '900' }, perDay: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  control: { minWidth: 50, minHeight: 48, backgroundColor: colors.surface, borderColor: colors.blue, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  controlText: { color: colors.blueDark, fontSize: 22, fontWeight: '800' },
  disabled: { opacity: 0.45 }, range: { color: colors.muted, fontSize: 12 },
});
