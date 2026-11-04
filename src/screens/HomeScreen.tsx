import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useRoom } from '../context/RoomContext';
import { MainTabParamList, RootStackParamList } from '../navigation/routeTypes';
import { colors, radius, spacing } from '../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Home'>, NativeStackScreenProps<RootStackParamList>>;
export function HomeScreen({ navigation }: Props) {
  const { startNewRoom, savedRooms, loadSaved } = useRoom();
  const latest = [...savedRooms].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const begin = () => { startNewRoom(); navigation.navigate('RoomSetup'); };
  const continueLatest = () => { if (latest) { loadSaved(latest); navigation.navigate('Recommendation'); } };
  return <Screen>
    <View style={styles.brand}><Text style={styles.logo}>❄</Text><View><Text style={styles.brandName}>ACSize</Text><Text style={styles.muted}>Smart cooling starts here</Text></View><Text accessibilityRole="button" onPress={() => Alert.alert('About ACSize', 'A fully offline educational estimator. Results are approximate and are not professional HVAC advice.')} style={styles.info}>ⓘ</Text></View>
    <View style={styles.hero}><Text style={styles.eyebrow}>YOUR COOLING ASSISTANT</Text><Text style={styles.title}>Find the right AC for your room.</Text><Text style={styles.body}>Estimate cooling needs, discover suitable AC options and explore running costs.</Text><View style={styles.art}><Text style={styles.artText}>▱  ❄  ≋</Text></View><PrimaryButton label="Start New Estimate  →" onPress={begin} /><Text style={styles.caption}>3 simple steps · Works completely offline</Text></View>
    {latest && <Pressable accessibilityRole="button" onPress={continueLatest} style={styles.recent}><Text style={styles.eyebrow}>CONTINUE LAST ROOM</Text><Text style={styles.recentName}>{latest.name}  ›</Text><Text style={styles.muted}>{latest.lastEstimatedBTU.toLocaleString()} BTU/h · Updated {new Date(latest.updatedAt).toLocaleDateString()}</Text></Pressable>}
    <Text style={styles.section}>Quick access</Text><View style={styles.quickRow}><Pressable style={styles.quickCard} onPress={() => navigation.navigate('MainTabs', { screen: 'Library' })}><Text style={styles.recentName}>AC Library</Text><Text style={styles.muted}>Browse 14 profiles</Text></Pressable><Pressable style={styles.quickCard} onPress={() => navigation.navigate('MainTabs', { screen: 'Saved' })}><Text style={styles.recentName}>Saved Rooms</Text><Text style={styles.muted}>Revisit solutions</Text></Pressable></View>
    <View style={styles.tip}><Text style={styles.section}>Cooling tip</Text><Text style={styles.body}>Keep doors and windows closed while the AC runs to reduce avoidable heat entry.</Text></View>
  </Screen>;
}
const styles = StyleSheet.create({ brand: { flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { fontSize: 26, color: colors.teal }, brandName: { fontSize: 22, fontWeight: '800', color: colors.navy }, muted: { color: colors.muted }, info: { marginLeft: 'auto', fontSize: 24, color: colors.slate }, hero: { backgroundColor: colors.mint, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md }, eyebrow: { fontSize: 12, fontWeight: '800', color: colors.tealDark, letterSpacing: 1 }, title: { fontSize: 30, lineHeight: 35, fontWeight: '800', color: colors.navy }, body: { color: colors.slate, fontSize: 15, lineHeight: 22 }, art: { height: 105, backgroundColor: colors.paleCyan, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' }, artText: { fontSize: 34, color: colors.teal }, caption: { textAlign: 'center', color: colors.muted, fontSize: 12 }, section: { fontSize: 19, fontWeight: '800', color: colors.navy }, recent: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderColor: colors.line, borderWidth: 1, gap: 6 }, recentName: { color: colors.navy, fontWeight: '800', fontSize: 16 }, quickRow: { flexDirection: 'row', gap: 12 }, quickCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.line, gap: 8 }, tip: { borderRadius: radius.md, padding: spacing.lg, backgroundColor: colors.paleAmber, gap: 8 } });
