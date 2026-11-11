import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { acProfiles } from '../data/acProfiles';
import { ChoiceArtwork } from '../components/ChoiceArtwork';
import { useRoom } from '../context/RoomContext';
import { ChoiceChips } from '../components/ChoiceChips';
import { RootStackParamList } from '../navigation/routeTypes';
import { filterACProfiles } from '../services/acLibraryFilter';
import { colors, elevation, radius, spacing, typeScale } from '../theme';

export function ACLibraryScreen({ route }: { route: { name: string } }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const room = useRoom();
  const mode = route.name === 'LibrarySelect' ? 'select' : 'browse';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all'|'split'|'portable'>('all');
  const [capacity, setCapacity] = useState<'all'|'9000'|'12000'|'18000'|'24000'>('all');
  const [technology, setTechnology] = useState<'all'|'fixed-speed'|'inverter'|'eco-inverter'|'portable'>('all');
  const [efficiency, setEfficiency] = useState<'all'|'standard'|'efficient'|'high'>('all');
  const filtered = useMemo(() => filterACProfiles(acProfiles, { search, category, capacity, technology, efficiency }), [search,category,capacity,technology,efficiency]);
  const clear = () => { setSearch(''); setCategory('all'); setCapacity('all'); setTechnology('all'); setEfficiency('all'); };
  const clearButton = (label: string) => <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={clear} style={styles.clearButton}><Text style={styles.clear}>{label}</Text></Pressable>;
  const selectForLab = (id: string) => { room.setScenario((current) => current ? { ...current, selectedACId: id } : current); navigation.goBack(); };

  return <View style={styles.page}>
    <FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<View style={styles.filters}>
        <Text style={styles.eyebrow}>{mode === 'select' ? 'ROOM LAB / SELECT AN AC' : 'EXPLORE EQUIPMENT'}</Text><Text style={styles.title}>AC Library</Text>
        <Text style={styles.sub}>{mode === 'select' ? 'Choose a profile to test in Room Lab.' : 'Fictional profiles, bundled for offline use.'}</Text>
        <TextInput accessibilityLabel="Search AC profiles" value={search} onChangeText={setSearch} placeholder="Search name, capacity or technology" style={styles.search} />
        <ChoiceChips groupLabel="Category" value={category} options={[{value:'all',label:'All'},{value:'split',label:'Split'},{value:'portable',label:'Portable'}]} onChange={setCategory} />
        <ChoiceChips groupLabel="Capacity" value={capacity} options={[{value:'all',label:'All sizes'},{value:'9000',label:'9K'},{value:'12000',label:'12K'},{value:'18000',label:'18K'},{value:'24000',label:'24K'}]} onChange={setCapacity} />
        <ChoiceChips groupLabel="Technology" value={technology} options={[{value:'all',label:'Any tech'},{value:'fixed-speed',label:'Standard'},{value:'inverter',label:'Inverter'},{value:'eco-inverter',label:'Eco'},{value:'portable',label:'Portable'}]} onChange={setTechnology} />
        <ChoiceChips groupLabel="Efficiency" value={efficiency} options={[{value:'all',label:'Any efficiency'},{value:'standard',label:'Standard'},{value:'efficient',label:'Efficient'},{value:'high',label:'High'}]} onChange={setEfficiency} />
        <View style={styles.countRow}><Text accessibilityLiveRegion="polite" style={styles.count}>{filtered.length} of {acProfiles.length} profiles</Text>{clearButton('Clear filters')}</View>
      </View>}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptySymbol}>⌕</Text><Text style={styles.name}>No matching AC profiles</Text><Text style={styles.sub}>Try a different search or clear the filters.</Text>{clearButton('Clear Filters')}</View>}
      renderItem={({ item }) => <View style={styles.card}><Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name} details, ${item.nominalCapacityBTU.toLocaleString()} BTU per hour, ${item.category}, ${item.technology}`} style={styles.cardMain} onPress={() => navigation.navigate('ACDetails', { acId: item.id, origin: mode === 'select' ? 'lab' : 'library', mode })}>
        <ChoiceArtwork kind={item.category === 'portable' ? 'ac-portable' : 'ac-split'} width={64} height={58} />
        <View style={styles.cardBody}><Text style={styles.name}>{item.name}</Text><Text style={styles.capacity}>{item.nominalCapacityBTU.toLocaleString()} BTU/h</Text><Text style={styles.meta}>{item.category} · {item.technology} · {item.efficiencyTier}</Text></View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>{mode === 'select' && <Pressable accessibilityRole="button" accessibilityLabel={`Use ${item.name} in Room Lab`} onPress={() => selectForLab(item.id)} style={styles.selectButton}><Text style={styles.selectText}>{room.scenario?.selectedACId === item.id ? 'Selected for testing ✓' : 'Use in Room Lab'}</Text></Pressable>}</View>} />
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  filters: { paddingTop: spacing.lg, gap: spacing.sm },
  eyebrow: { color: colors.blueDark, fontSize: typeScale.caption, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: typeScale.title, fontWeight: '800', color: colors.navy },
  sub: { color: colors.muted, marginTop: 5 },
  search: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.blue, backgroundColor: colors.paleBlue, paddingHorizontal: 14, marginVertical: 12, color: colors.navy },
  countRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' },
  count: { color: colors.blueDark, fontWeight: '700', marginTop: 12 },
  clearButton: { minHeight: 44, justifyContent: 'center' },
  clear: { color: colors.tealDark, fontWeight: '800' },
  list: { paddingVertical: 12, gap: 12, paddingBottom: 30 },
  empty: { padding: 30, alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  emptySymbol: { color: colors.tealDark, fontSize: 38 },
  card: { padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, gap: 10, ...elevation.card },
  cardMain: { minHeight: 64, flexDirection: 'row', alignItems: 'center' },
  selectButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm, backgroundColor: colors.paleBlue, borderWidth: 1, borderColor: colors.blue },
  selectText: { color: colors.blueDark, fontWeight: '800' },
  cardBody: { flex: 1, marginLeft: 14, gap: 3 },
  name: { fontWeight: '800', color: colors.navy, fontSize: 16 },
  capacity: { color: colors.tealDark, fontWeight: '800', fontSize: 15 },
  meta: { color: colors.muted, textTransform: 'capitalize', fontSize: 13 },
  arrow: { fontSize: 28, color: colors.teal },
});
