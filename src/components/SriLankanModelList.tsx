import { Image, StyleSheet, Text, View } from 'react-native';
import { findACProfile } from '../data/acProfiles';
import { getSriLankanModels, modelResearchDate } from '../data/sriLankanModels';
import { colors, radius, spacing, useThemedStyles } from '../theme';

const splitImage = require('../../assets/ac-split-catalogue.jpg');
const portableImage = require('../../assets/ac-portable-catalogue.jpg');

export function SriLankanModelList({ profileId, compact = false }: { profileId: string | null | undefined; compact?: boolean }) {
  const styles = useThemedStyles(baseStyles);
  const profile = findACProfile(profileId);
  const models = getSriLankanModels(profileId);
  if (!profile || models.length === 0) return null;
  return <View style={styles.section}>
    <Text style={styles.heading}>Local model options for {profile.name}</Text>
    <Text style={styles.intro}>Models listed in Sri Lanka in this nominal class. Stock and prices may change.</Text>
    {models.map((item) => <View key={item.id} style={[styles.model, compact && styles.compactModel]}>
      <Image source={profile.category === 'portable' ? portableImage : splitImage} style={compact ? styles.compactImage : styles.image} resizeMode="contain" accessibilityLabel={`Illustrative ${profile.category} air conditioner`} />
      <View style={styles.copy}>
        <Text style={styles.name}>{item.brand} {item.model}</Text>
        <Text style={styles.spec}>{item.listedCapacityBTU.toLocaleString()} BTU/h listed · {item.detail}</Text>
        {!compact && <Text style={styles.source}>Source: {item.source}</Text>}
        {item.caution && <Text style={styles.caution}>{item.caution}</Text>}
      </View>
    </View>)}
    <Text style={styles.footnote}>Listings checked {modelResearchDate}. Shared images illustrate AC type; actual model appearance varies. Real models do not inherit ACSize’s illustrative energy or price figures. “Eco” is an ACSize comparison tier, not a product certification.</Text>
  </View>;
}

const baseStyles = StyleSheet.create({
  section: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, gap: 8 },
  heading: { color: colors.navy, fontWeight: '800', fontSize: 16 },
  intro: { color: colors.slate, fontSize: 12, lineHeight: 17 },
  model: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 8, backgroundColor: colors.paleBlue, borderRadius: radius.sm },
  compactModel: { padding: 6 },
  image: { width: 88, height: 66, borderRadius: radius.sm },
  compactImage: { width: 72, height: 52, borderRadius: radius.sm },
  copy: { flex: 1, gap: 2 },
  name: { color: colors.navy, fontWeight: '800', fontSize: 13 },
  spec: { color: colors.slate, fontSize: 11, lineHeight: 15 },
  source: { color: colors.blueDark, fontSize: 10 },
  caution: { color: colors.amberDark, fontSize: 10, lineHeight: 14 },
  footnote: { color: colors.muted, fontSize: 10, lineHeight: 15 },
});
