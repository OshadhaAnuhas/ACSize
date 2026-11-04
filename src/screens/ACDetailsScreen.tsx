import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useRoom } from '../context/RoomContext';
import { findACProfile } from '../data/acProfiles';
import { RootStackParamList } from '../navigation/routeTypes';
import { colors, elevation, radius, spacing, typeScale } from '../theme';

export function ACDetailsScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ACDetails'>) {
  const profile = findACProfile(route.params.acId);
  const room = useRoom();
  if (!profile) return <Screen><Text style={styles.title}>Profile unavailable</Text><Text>The requested local record is missing.</Text><PrimaryButton label="Go Back" onPress={navigation.goBack} /></Screen>;
  const choose = () => {
    if (route.params.origin === 'lab') {
      room.setScenario((current) => current ? { ...current, selectedACId: profile.id } : current);
      navigation.pop(2);
      return;
    }
    room.beginLab(profile.id);
    navigation.navigate('RoomLab', { initialSelectedACId: profile.id });
  };
  return <Screen>
    <Text style={styles.eyebrow}>AC PROFILE</Text><Text style={styles.title}>{profile.name}</Text><Text style={styles.badge}>{profile.category} · {profile.efficiencyTier}</Text>
    <View style={styles.hero}><Text style={styles.heroLabel}>NOMINAL COOLING CAPACITY</Text><Text style={styles.capacity}>{profile.nominalCapacityBTU.toLocaleString()} BTU/h</Text><Text style={styles.heroBody}>{profile.coolingCapacityKW.toFixed(2)} kW cooling</Text>{profile.category === 'portable' && <Text style={styles.warning}>{profile.comparisonCapacityBTU.toLocaleString()} BTU/h illustrative comparison capacity</Text>}<View style={styles.heroRule} /><Text style={styles.heroBody}>{profile.illustrativeInputPowerKW.toFixed(2)} kW electrical input · {profile.purchaseCostTier}</Text></View>
    <Text style={styles.body}>{profile.description}</Text>
    <View style={styles.card}><Text style={styles.heading}>Features</Text>{profile.features.map((item) => <Text key={item} style={styles.body}>• {item}</Text>)}</View>
    <View style={styles.card}><Text style={styles.heading}>Recommended use</Text><Text style={styles.body}>{profile.recommendedUse}</Text><Text style={styles.heading}>Installation</Text><Text style={styles.body}>{profile.installationNotes}</Text></View>
    <View style={styles.card}><Text style={styles.heading}>Limitations</Text>{profile.limitations.map((item) => <Text key={item} style={styles.body}>• {item}</Text>)}</View>
    <PrimaryButton label={route.params.origin === 'library' ? 'Back to Library' : route.params.origin === 'lab' ? 'Use This AC' : 'Explore This AC in Room Lab'} onPress={route.params.origin === 'library' ? navigation.goBack : choose} />
  </Screen>;
}
const styles = StyleSheet.create({ eyebrow: { color: colors.tealDark, fontSize: typeScale.caption, fontWeight: '800', letterSpacing: 1 }, title: { fontSize: typeScale.title, fontWeight: '800', color: colors.navy }, badge: { color: colors.tealDark, textTransform: 'capitalize', fontWeight: '800' }, hero: { padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.tealDark, gap: 7, ...elevation.card }, heroLabel: { color: '#CCFBF1', fontSize: typeScale.caption, fontWeight: '800', letterSpacing: 1 }, capacity: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' }, heroBody: { color: '#FFFFFF', lineHeight: 21 }, heroRule: { height: 1, backgroundColor: '#5EEAD4', marginVertical: 5 }, body: { color: colors.slate, lineHeight: 21 }, warning: { color: colors.paleAmber, fontWeight: '700' }, card: { padding: spacing.xl, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 8, ...elevation.card }, heading: { fontSize: typeScale.section, fontWeight: '800', color: colors.navy } });
