import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useRoom } from '../context/RoomContext';
import { findACProfile } from '../data/acProfiles';
import { MainTabParamList, RootStackParamList } from '../navigation/routeTypes';
import { colors, elevation, radius, spacing, typeScale } from '../theme';
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
  const repair = () => Alert.alert('Repair saved rooms?', 'Valid rooms will remain. Damaged entries that cannot be opened will be removed. This cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Repair', onPress: () => room.repairSaved().catch(() => Alert.alert('Repair failed', 'Saved data was not changed. Please try again.')) },
  ]);
  return <View style={styles.page}>
    <Text style={styles.eyebrow}>STORED ON THIS DEVICE</Text><Text style={styles.title}>Saved Rooms</Text><Text style={styles.sub}>Your previous cooling solutions · {room.savedRooms.length}</Text>
    {room.storageStatus==='loading' && <Text style={styles.notice}>Loading saved rooms…</Text>}
    {room.storageStatus==='error' && <View style={styles.recovery}><Text style={styles.warning}>Saved rooms could not be read from this device. Your stored data has not been changed.</Text><Pressable accessibilityRole="button" accessibilityLabel="Try reading saved rooms again" style={styles.recoveryAction} onPress={()=>void room.retrySavedLoad()}><Text style={styles.action}>Try Again</Text></Pressable></View>}
    {room.storageWarning && <View style={styles.recovery}><Text style={styles.warning}>{room.storageWarning}</Text><Pressable accessibilityRole="button" accessibilityLabel="Repair damaged saved rooms" style={styles.recoveryAction} onPress={repair}><Text style={styles.action}>Repair Saved Rooms</Text></Pressable></View>}
    <FlatList data={room.savedRooms} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
      ListEmptyComponent={room.storageStatus==='ready'&&!room.storageWarning?<View style={styles.empty}><Text style={styles.icon}>⌂</Text><Text style={styles.heading}>No saved rooms yet</Text><Text style={styles.sub}>Create an estimate, then save it from the recommendation.</Text><PrimaryButton label="Create Room" onPress={() => { room.startNewRoom(); navigation.navigate('RoomSetup'); }} /></View>:undefined}
      renderItem={({ item }) => <View style={styles.card}>
        <Text style={styles.heading}>{item.name}</Text><Text style={styles.sub}>{item.roomType} · {(item.lengthM * item.widthM).toFixed(1)} m²</Text>
        <View style={styles.result}><Text style={styles.resultLabel}>ESTIMATED DEMAND</Text><Text style={styles.value}>{item.lastEstimatedBTU.toLocaleString()} BTU/h</Text><Text style={styles.sub}>{findACProfile(item.lastRecommendedACId)?.name ?? 'Recalculate on open'}</Text></View>
        <Text style={styles.date}>Updated {new Date(item.updatedAt).toLocaleDateString()}</Text>
        <View style={styles.row}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.name}`} style={styles.roomAction} onPress={() => open(item)}><Text style={styles.action}>Open</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${item.name}`} style={styles.roomAction} onPress={() => open(item, true)}><Text style={styles.action}>Edit</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${item.name}`} style={styles.roomAction} onPress={() => remove(item.id)}><Text style={[styles.action, styles.deleteAction]}>Delete</Text></Pressable>
        </View>
      </View>} />
  </View>;
}
const styles = StyleSheet.create({ page: { flex: 1, padding: spacing.xl, backgroundColor: colors.background }, eyebrow: { color: colors.tealDark, fontSize: typeScale.caption, fontWeight: '800', letterSpacing: 1 }, title: { fontSize: typeScale.title, fontWeight: '800', color: colors.navy }, sub: { color: colors.muted, marginTop: 5 }, notice: { color: colors.muted, marginTop: 12 }, recovery: { marginTop: 12, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.paleAmber, borderLeftWidth: 4, borderLeftColor: colors.amber }, warning: { color: colors.navy, marginBottom: 4 }, recoveryAction: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' }, list: { paddingVertical: 16, gap: 12, flexGrow: 1 }, empty: { marginTop: 45, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line }, icon: { fontSize: 42, color: colors.teal }, heading: { fontSize: typeScale.section, fontWeight: '800', color: colors.navy }, card: { padding: spacing.xl, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 6, ...elevation.card }, result: { backgroundColor: colors.paleCyan, borderRadius: radius.sm, padding: spacing.md, gap: 3, marginTop: 6 }, resultLabel: { color: colors.tealDark, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }, value: { color: colors.navy, fontWeight: '800', fontSize: 20 }, date: { fontSize: 12, color: colors.muted }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }, roomAction: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }, action: { color: colors.tealDark, fontWeight: '800' }, deleteAction: { color: colors.danger } });
