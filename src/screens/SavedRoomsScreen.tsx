import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useRoom } from '../context/RoomContext';
import { findACProfile } from '../data/acProfiles';
import { MainTabParamList, RootStackParamList } from '../navigation/routeTypes';
import { colors, radius, spacing } from '../theme';
import { SavedRoomRecord } from '../types/room';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Saved'>, NativeStackScreenProps<RootStackParamList>>;
export function SavedRoomsScreen({ navigation }: Props) {
  const room = useRoom();
  const open = (record: SavedRoomRecord, edit = false) => {
    const missingSelectedAC = room.loadSaved(record);
    if (edit) navigation.navigate('RoomSetup', { edit: true });
    else navigation.navigate('Recommendation');
    if (missingSelectedAC) Alert.alert('AC profile unavailable', 'Your room was opened, but its previously selected AC is no longer in the local catalogue. You can select another AC in Room Lab. The saved record has not changed.');
  };
  const remove = (id: string) => Alert.alert('Delete room?', 'This local copy cannot be recovered.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => room.deleteSaved(id).catch(() => Alert.alert('Delete failed', 'The room was not removed.')) },
  ]);
  return <View style={styles.page}>
    <Text style={styles.title}>Saved Rooms</Text><Text style={styles.sub}>Your previous cooling solutions · {room.savedRooms.length}</Text>
    {room.storageWarning && <Text style={styles.warning}>{room.storageWarning}</Text>}
    <FlatList data={room.savedRooms} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.icon}>⌂</Text><Text style={styles.heading}>No saved rooms yet</Text><Text style={styles.sub}>Create an estimate, then save it from the recommendation.</Text><PrimaryButton label="Create Room" onPress={() => { room.startNewRoom(); navigation.navigate('RoomSetup'); }} /></View>}
      renderItem={({ item }) => <View style={styles.card}>
        <Text style={styles.heading}>{item.name}</Text><Text style={styles.sub}>{item.roomType} · {(item.lengthM * item.widthM).toFixed(1)} m²</Text>
        <Text style={styles.value}>{item.lastEstimatedBTU.toLocaleString()} BTU/h · {findACProfile(item.lastRecommendedACId)?.name ?? 'Recalculate on open'}</Text>
        <Text style={styles.date}>Updated {new Date(item.updatedAt).toLocaleDateString()}</Text>
        <View style={styles.row}><Pressable accessibilityRole="button" onPress={() => open(item)}><Text style={styles.action}>Open</Text></Pressable><Pressable accessibilityRole="button" onPress={() => open(item, true)}><Text style={styles.action}>Edit</Text></Pressable><Pressable accessibilityRole="button" onPress={() => remove(item.id)}><Text style={[styles.action, { color: colors.danger }]}>Delete</Text></Pressable></View>
      </View>} />
  </View>;
}
const styles = StyleSheet.create({ page: { flex: 1, padding: spacing.xl, backgroundColor: colors.background }, title: { fontSize: 28, fontWeight: '800', color: colors.navy }, sub: { color: colors.muted, marginTop: 5 }, warning: { color: colors.amber, marginTop: 10 }, list: { paddingVertical: 16, gap: 12, flexGrow: 1 }, empty: { marginTop: 45, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line }, icon: { fontSize: 42, color: colors.teal }, heading: { fontSize: 18, fontWeight: '800', color: colors.navy }, card: { padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 6 }, value: { color: colors.tealDark, fontWeight: '700' }, date: { fontSize: 12, color: colors.muted }, row: { flexDirection: 'row', gap: 22, marginTop: 8 }, action: { color: colors.tealDark, fontWeight: '800', paddingVertical: 8 } });
