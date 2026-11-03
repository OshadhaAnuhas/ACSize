import { StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { MainTabParamList, RootStackParamList } from '../navigation/routeTypes';
import { colors, radius, spacing } from '../theme';
type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Saved'>, NativeStackScreenProps<RootStackParamList>>;
export function SavedRoomsScreen({ navigation }: Props) { return <View style={styles.page}><Text style={styles.title}>Saved Rooms</Text><Text style={styles.sub}>Your previous cooling solutions</Text><View style={styles.empty}><Text style={styles.icon}>⌂</Text><Text style={styles.heading}>No saved rooms yet</Text><Text style={styles.sub}>Create an estimate, then save it from the recommendation.</Text><PrimaryButton label="Create Room" onPress={() => navigation.navigate('RoomSetup')} /></View></View>; }
const styles = StyleSheet.create({ page: { flex: 1, padding: spacing.xl, backgroundColor: colors.background }, title: { fontSize: 28, fontWeight: '800', color: colors.navy }, sub: { color: colors.muted, marginTop: 5, textAlign: 'center' }, empty: { marginTop: 60, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line }, icon: { fontSize: 42, color: colors.teal }, heading: { fontSize: 19, fontWeight: '800', color: colors.navy } });
