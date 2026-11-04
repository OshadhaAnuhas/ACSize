import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { acProfiles } from '../data/acProfiles';
import { ChoiceChips } from '../components/ChoiceChips';
import { RootStackParamList } from '../navigation/routeTypes';
import { colors, radius, spacing } from '../theme';

export function ACLibraryScreen({ route }: { route: { name: string } }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mode = route.name === 'LibrarySelect' ? 'select' : 'browse';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all'|'split'|'portable'>('all');
  const [capacity, setCapacity] = useState<'all'|'9000'|'12000'|'18000'|'24000'>('all');
  const [technology, setTechnology] = useState<'all'|'fixed-speed'|'inverter'|'eco-inverter'|'portable'>('all');
  const [efficiency, setEfficiency] = useState<'all'|'standard'|'efficient'|'high'>('all');
  const filtered = useMemo(() => acProfiles.filter((p) => {
    const q = search.trim().toLowerCase();
    const text = [p.name,p.id,p.category,p.technology,p.description,...p.features].join(' ').toLowerCase();
    return (!q || text.includes(q) || String(p.nominalCapacityBTU).includes(q)) &&
      (category === 'all' || p.category === category) &&
      (capacity === 'all' || p.nominalCapacityBTU === Number(capacity)) &&
      (technology === 'all' || p.technology === technology) &&
      (efficiency === 'all' || p.efficiencyTier === efficiency);
  }), [search,category,capacity,technology,efficiency]);
  const clear = () => { setSearch(''); setCategory('all'); setCapacity('all'); setTechnology('all'); setEfficiency('all'); };
  const clearButton = (label: string) => <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={clear} style={styles.clearButton}><Text style={styles.clear}>{label}</Text></Pressable>;

  return <View style={styles.page}>
    <Text style={styles.title}>AC Library</Text>
    <Text style={styles.sub}>{mode === 'select' ? 'Choose a profile to test in Room Lab.' : 'Fictional profiles, bundled for offline use.'}</Text>
    <TextInput accessibilityLabel="Search AC profiles" value={search} onChangeText={setSearch} placeholder="Search name, capacity or technology" style={styles.search} />
    <ChoiceChips groupLabel="Category" value={category} options={[{value:'all',label:'All'},{value:'split',label:'Split'},{value:'portable',label:'Portable'}]} onChange={setCategory} />
    <ChoiceChips groupLabel="Capacity" value={capacity} options={[{value:'all',label:'All sizes'},{value:'9000',label:'9K'},{value:'12000',label:'12K'},{value:'18000',label:'18K'},{value:'24000',label:'24K'}]} onChange={setCapacity} />
    <ChoiceChips groupLabel="Technology" value={technology} options={[{value:'all',label:'Any tech'},{value:'fixed-speed',label:'Standard'},{value:'inverter',label:'Inverter'},{value:'eco-inverter',label:'Eco'},{value:'portable',label:'Portable'}]} onChange={setTechnology} />
    <ChoiceChips groupLabel="Efficiency" value={efficiency} options={[{value:'all',label:'Any efficiency'},{value:'standard',label:'Standard'},{value:'efficient',label:'Efficient'},{value:'high',label:'High'}]} onChange={setEfficiency} />
    <View style={styles.countRow}><Text accessibilityLiveRegion="polite" style={styles.count}>{filtered.length} of {acProfiles.length} profiles</Text>{clearButton('Clear filters')}</View>
    <FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.name}>No matching AC profiles</Text><Text style={styles.sub}>Try a different search or clear the filters.</Text>{clearButton('Clear Filters')}</View>}
      renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name} details, ${item.nominalCapacityBTU.toLocaleString()} BTU per hour, ${item.category}, ${item.technology}`} style={styles.card} onPress={() => navigation.navigate('ACDetails', { acId: item.id, origin: mode === 'select' ? 'lab' : 'library', mode })}>
        <View style={styles.icon}><Text style={styles.iconText}>{item.category === 'split' ? '❄' : '▣'}</Text></View>
        <View style={styles.cardBody}><Text style={styles.name}>{item.name}</Text><Text style={styles.meta}>{item.nominalCapacityBTU.toLocaleString()} BTU/h · {item.category}</Text><Text style={styles.meta}>{item.technology} · {item.efficiencyTier}</Text></View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>} />
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  title: { fontSize: 28, fontWeight: '800', color: colors.navy },
  sub: { color: colors.muted, marginTop: 5 },
  search: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 14, marginVertical: 12 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { color: colors.tealDark, fontWeight: '700', marginTop: 12 },
  clearButton: { minHeight: 44, justifyContent: 'center' },
  clear: { color: colors.tealDark, fontWeight: '800' },
  list: { paddingVertical: 12, gap: 12, paddingBottom: 30 },
  empty: { padding: 30, alignItems: 'center', gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.paleCyan, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: colors.teal, fontSize: 22 },
  cardBody: { flex: 1, marginLeft: 14, gap: 3 },
  name: { fontWeight: '800', color: colors.navy, fontSize: 16 },
  meta: { color: colors.muted, textTransform: 'capitalize', fontSize: 13 },
  arrow: { fontSize: 28, color: colors.teal },
});
