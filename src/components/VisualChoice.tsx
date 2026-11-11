import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChoiceArtwork, ArtworkKind } from './ChoiceArtwork';
import { colors, radius, spacing } from '../theme';

type Accent = 'teal' | 'blue' | 'amber';
const accentColors = {
  teal: { border: colors.teal, fill: colors.mint, text: colors.tealDark },
  blue: { border: colors.blue, fill: colors.paleBlue, text: colors.blueDark },
  amber: { border: colors.amber, fill: colors.paleAmber, text: colors.amberDark },
};

export function VisualChoice<T extends string>({ value, options, onChange, label, accent = 'teal' }: {
  value: T;
  options: readonly { value: T; label: string; artwork: ArtworkKind | readonly ArtworkKind[] }[];
  onChange: (value: T) => void;
  label: string;
  accent?: Accent;
}) {
  const palette = accentColors[accent];
  return <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.options}>{options.map(option => {
      const selected = value === option.value;
      const artwork = Array.isArray(option.artwork) ? option.artwork : [option.artwork];
      return <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={`${label}: ${option.label}`} accessibilityState={{ selected }} onPress={() => onChange(option.value)} style={[styles.option, options.length === 4 && styles.twoColumnOption, selected && { borderColor: palette.border, backgroundColor: palette.fill }]}>
        <View style={styles.artwork}>{artwork.map((kind, index) => <ChoiceArtwork key={index} kind={kind as ArtworkKind} width={artwork.length > 1 ? 48 : 88} height={70} />)}</View>
        <Text style={[styles.optionText, selected && { color: palette.text, fontWeight: '800' }]}>{option.label}</Text>
      </Pressable>;
    })}</View>
  </View>;
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm }, label: { color: colors.navy, fontWeight: '800' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: { flexGrow: 1, flexBasis: 94, minHeight: 112, alignItems: 'center', justifyContent: 'center', gap: 3, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  twoColumnOption: { flexBasis: '44%' },
  artwork: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  optionText: { textAlign: 'center', color: colors.slate, fontSize: 12, fontWeight: '600' },
});
