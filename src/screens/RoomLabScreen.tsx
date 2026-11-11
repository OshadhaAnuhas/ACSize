import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChoiceChips } from '../components/ChoiceChips';
import { AirflowChoice } from '../components/AirflowChoice';
import { DimensionField } from '../components/DimensionField';
import { PrimaryButton } from '../components/PrimaryButton';
import { RoomIllustration } from '../components/RoomIllustration';
import { DailyUseArc } from '../components/DailyUseArc';
import { OccupantIllustration } from '../components/OccupantIllustration';
import { VisualChoice } from '../components/VisualChoice';
import { Screen } from '../components/Screen';
import { useRoom } from '../context/RoomContext';
import { findACProfile } from '../data/acProfiles';
import { roofOptions, sunOptions, windowOptions } from '../data/visualOptions';
import { RootStackParamList } from '../navigation/routeTypes';
import { calculateComfort } from '../services/comfortCalculator';
import { estimateCooling } from '../services/coolingEstimator';
import { calculateEnergy } from '../services/energyCalculator';
import { getSuitability, recommendAC } from '../services/recommendationEngine';
import { colors, elevation, radius, spacing, typeScale } from '../theme';
import { RoomLabScenario } from '../types/room';
import { validateRoom } from '../utils/validation';

type Section = 'room' | 'ac' | 'energy' | 'comfort';
type Props = NativeStackScreenProps<RootStackParamList, 'RoomLab'>;
const tabs: { id: Section; label: string }[] = [{ id: 'room', label: 'Room' }, { id: 'ac', label: 'AC' }, { id: 'energy', label: 'Energy' }, { id: 'comfort', label: 'Comfort' }];
function Adjuster({ label, decrease, increase, atMin, atMax, minus = '−', plus = '＋' }: { label: string; decrease: () => void; increase: () => void; atMin: boolean; atMax: boolean; minus?: string; plus?: string }) {
  return <View style={styles.row}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${label}`} accessibilityState={{ disabled: atMin }} disabled={atMin} style={[styles.control, atMin && styles.controlDisabled]} onPress={decrease}><Text>{minus}</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} accessibilityState={{ disabled: atMax }} disabled={atMax} style={[styles.control, atMax && styles.controlDisabled]} onPress={increase}><Text>{plus}</Text></Pressable>
  </View>;
}
export function RoomLabScreen({ navigation, route }: Props) {
  const room = useRoom();
  const [open, setOpen] = useState<Section>('room');
  const [resetVersion, setResetVersion] = useState(0);
  const allowDiscard = useRef(false);
  const labInitialized = useRef(false);
  const initialSelectedACId = route.params?.initialSelectedACId;
  useEffect(() => {
    if (labInitialized.current) return;
    labInitialized.current = true;
    room.beginLab(initialSelectedACId);
  }, [room, initialSelectedACId]);
  useEffect(() => navigation.addListener('beforeRemove', (event) => {
    if (allowDiscard.current || !room.labChanged || !['GO_BACK', 'POP', 'POP_TO_TOP'].includes(event.data.action.type)) return;
    event.preventDefault();
    Alert.alert('Discard changes?', 'Leave Room Lab without applying this scenario?', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => { allowDiscard.current = true; navigation.dispatch(event.data.action); } },
    ]);
  }), [navigation, room.labChanged]);
  const scenario = room.scenario;
  if (!scenario) return <Screen><Text>Preparing Room Lab…</Text></Screen>;
  const update = (values: Partial<RoomLabScenario>) => room.setScenario((current) => current ? { ...current, ...values } : current);
  const errors = validateRoom(scenario);
  const valid = !Object.keys(errors).length;
  const estimate = valid ? estimateCooling(scenario) : null;
  const recommended = estimate ? recommendAC(estimate.estimatedBTUh, scenario.installationPreference, scenario.selectionPriority).recommended : null;
  const selected = findACProfile(scenario.selectedACId) ?? recommended;
  const energy = selected ? calculateEnergy(selected.illustrativeInputPowerKW, scenario.dailyUsageHours, scenario.electricityRateLKRPerKWh) : null;
  const comfort = calculateComfort(scenario.comfort.temperatureC, scenario.comfort.humidityPercent, scenario.comfort.airflow);
  return <Screen key={open}>
    <Text style={styles.eyebrow}>ROOM LAB / LIVE SCENARIO</Text><Text style={styles.title}>{scenario.name}</Text><Text style={styles.sub}>Change one condition at a time and compare the result. Changes stay temporary until applied.</Text>
    <RoomIllustration compact roomType={scenario.roomType} dimensions={scenario} conditions={scenario} acLabel={selected?.name ?? 'No match'} airflow={scenario.comfort.airflow} />
    <View style={styles.comfortStrip}><View style={styles.comfortChip}><Text style={styles.comfortChipLabel}>HYPOTHETICAL TEMP</Text><Text style={styles.comfortChipValue}>{scenario.comfort.temperatureC}°C</Text></View><View style={[styles.comfortChip, styles.humidityChip]}><Text style={styles.comfortChipLabel}>HYPOTHETICAL RH</Text><Text style={styles.comfortChipValue}>{scenario.comfort.humidityPercent}%</Text></View></View>
    <View style={styles.metrics}><View style={[styles.metric, styles.metricCooling]}><Text style={styles.tiny}>COOLING DEMAND</Text><Text style={styles.value}>{estimate ? estimate.estimatedBTUh.toLocaleString() : '—'}</Text><Text style={styles.metricUnit}>BTU/h needed</Text></View><View style={[styles.metric, styles.metricAC]}><Text style={styles.tiny}>TESTED AC</Text><Text style={styles.value}>{selected?.name ?? 'No match'}</Text></View><View style={[styles.metric, styles.metricCost]}><Text style={styles.tiny}>MONTHLY COST</Text><Text style={styles.value}>{energy ? `Rs.${energy.monthlyAdditionalEnergyCostLKR.toFixed(0)}` : '—'}</Text><Text style={styles.metricUnit}>illustrative</Text></View></View>
    <View style={styles.tabs} accessibilityRole="tablist">{tabs.map(tab => <Pressable key={tab.id} accessibilityRole="tab" accessibilityLabel={`${tab.label} tab`} accessibilityState={{ selected: open === tab.id }} onPress={() => setOpen(tab.id)} style={[styles.tab, open === tab.id && styles.activeTab]}><Text style={[styles.tabText, open === tab.id && styles.activeTabText]}>{tab.label}</Text></Pressable>)}</View>
    {open === 'room' && <View style={styles.card}><Text style={styles.heading}>Room Conditions</Text><View style={styles.content}>
      <VisualChoice label="Room type" value={scenario.roomType} options={[{ value: 'bedroom', label: 'Bedroom', artwork: 'room-bedroom' }, { value: 'living', label: 'Living room', artwork: 'room-living' }, { value: 'office', label: 'Small office', artwork: 'room-office' }]} onChange={(roomType) => update({ roomType })} />
      <ChoiceChips groupLabel="Dimension units" value={scenario.preferredUnit} options={[{ value: 'metric', label: 'Metres' }, { value: 'imperial', label: 'Feet' }]} onChange={(preferredUnit) => update({ preferredUnit })} />
      <View style={styles.dimensions}>{(['lengthM', 'widthM', 'heightM'] as const).map((key) => <DimensionField key={`${key}-${scenario.preferredUnit}-${resetVersion}`} label={key === 'lengthM' ? 'Length' : key === 'widthM' ? 'Width' : 'Height'} meters={scenario[key]} unit={scenario.preferredUnit} onChange={(value) => update({ [key]: value })} error={errors[key]} />)}</View>
      <View style={styles.occupantCard}><View style={styles.occupantCopy}><Text style={styles.label}>People using this room</Text><Text style={styles.occupantValue}>{scenario.occupants} {scenario.occupants === 1 ? 'person' : 'people'}</Text><Adjuster label="occupants" atMin={scenario.occupants<=1} atMax={scenario.occupants>=10} decrease={() => update({ occupants: Math.max(1, scenario.occupants - 1) })} increase={() => update({ occupants: Math.min(10, scenario.occupants + 1) })} /></View><OccupantIllustration count={scenario.occupants} /></View>
      <VisualChoice label="Sunlight" accent="amber" value={scenario.sunlight} options={sunOptions} onChange={(sunlight) => update({ sunlight })} />
      <VisualChoice label="Windows" accent="blue" value={scenario.windowCategory} options={windowOptions} onChange={(windowCategory) => update({ windowCategory })} />
      <VisualChoice label="Roof & ceiling" value={scenario.roofConfiguration} options={roofOptions} onChange={(roofConfiguration) => update({ roofConfiguration })} />
    </View></View>}
    {open === 'ac' && <View style={styles.card}><Text style={styles.heading}>AC Selection</Text><View style={styles.content}>
      <Text style={styles.sub}>Automatic: {recommended?.name ?? 'No suitable match'}{`\n`}Selected for testing: {selected?.name ?? 'None'}</Text>
      {selected && estimate && <Text style={styles.status}>{getSuitability(selected, estimate.estimatedBTUh) === 'below' ? 'Below Estimated Requirement' : getSuitability(selected, estimate.estimatedBTUh) === 'higher' ? 'Higher Than Estimated Need' : 'Meets Estimated Requirement'}</Text>}
      <PrimaryButton label="Browse AC Library" onPress={() => navigation.navigate('LibrarySelect')} />
      {recommended && <PrimaryButton label="Use Recommended AC" variant="outline" onPress={() => update({ selectedACId: null })} />}
    </View></View>}
    {open === 'energy' && <View style={styles.card}><Text style={styles.heading}>Energy & Cost</Text><View style={styles.content}>
      <DailyUseArc hours={scenario.dailyUsageHours} onChange={(hours) => update({ dailyUsageHours: hours })} />
      <Text style={styles.label}>Illustrative rate: Rs.{scenario.electricityRateLKRPerKWh}/kWh</Text><Adjuster label="illustrative electricity rate by 5 rupees" minus="−5" plus="＋5" atMin={scenario.electricityRateLKRPerKWh<=10} atMax={scenario.electricityRateLKRPerKWh>=80} decrease={() => update({ electricityRateLKRPerKWh: Math.max(10, scenario.electricityRateLKRPerKWh - 5) })} increase={() => update({ electricityRateLKRPerKWh: Math.min(80, scenario.electricityRateLKRPerKWh + 5) })} />
      <Text style={styles.sub}>{energy?.monthlyKWh.toFixed(1) ?? '—'} kWh/month · 30 days · 0.65 average-use multiplier</Text>
    </View></View>}
    {open === 'comfort' && <View style={styles.card}><Text style={styles.heading}>Comfort Explorer</Text><View style={styles.content}>
      <Text style={styles.value}>{comfort.label}</Text><Text style={styles.sub}>{comfort.explanation}</Text><Text style={styles.airflowFeedback}>Airflow set to {scenario.comfort.airflow}. {scenario.comfort.airflow === 'still' ? 'No illustrative breeze is shown.' : scenario.comfort.airflow === 'gentle' ? 'A light illustrative breeze is shown.' : 'The strongest illustrative breeze is shown.'}</Text>
      <Text style={styles.label}>Hypothetical temperature: {scenario.comfort.temperatureC}°C</Text><Adjuster label="hypothetical temperature" atMin={scenario.comfort.temperatureC<=20} atMax={scenario.comfort.temperatureC>=34} decrease={() => update({ comfort: { ...scenario.comfort, temperatureC: Math.max(20, scenario.comfort.temperatureC - 1) } })} increase={() => update({ comfort: { ...scenario.comfort, temperatureC: Math.min(34, scenario.comfort.temperatureC + 1) } })} />
      <Text style={styles.label}>Relative humidity: {scenario.comfort.humidityPercent}%</Text><Adjuster label="relative humidity by 5 percent" minus="−5%" plus="＋5%" atMin={scenario.comfort.humidityPercent<=30} atMax={scenario.comfort.humidityPercent>=90} decrease={() => update({ comfort: { ...scenario.comfort, humidityPercent: Math.max(30, scenario.comfort.humidityPercent - 5) } })} increase={() => update({ comfort: { ...scenario.comfort, humidityPercent: Math.min(90, scenario.comfort.humidityPercent + 5) } })} />
      <AirflowChoice value={scenario.comfort.airflow} onChange={(airflow) => update({ comfort: { ...scenario.comfort, airflow } })} />
      <Text style={styles.tiny}>Educational visual only; it does not predict measured temperature or change cooling demand.</Text>
    </View></View>}
    {!valid && <Text accessibilityRole="alert" style={styles.error}>Correct room dimensions before applying this scenario.</Text>}
    <PrimaryButton label="Apply Changes" disabled={!valid} onPress={() => { room.applyLab(); navigation.replace('Recommendation'); }} />
    <PrimaryButton label="Reset to Entry" variant="outline" onPress={() => { room.resetLab(); setResetVersion((version) => version + 1); }} />
  </Screen>;
}
const styles = StyleSheet.create({
  eyebrow: { color: colors.blueDark, fontSize: typeScale.caption, fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: typeScale.title, fontWeight: '800', color: colors.navy },
  sub: { color: colors.muted, lineHeight: 20 },
  comfortStrip: { flexDirection: 'row', gap: 8 },
  comfortChip: { flex: 1, backgroundColor: colors.paleBlue, borderRadius: radius.md, padding: spacing.md, gap: 3 },
  humidityChip: { backgroundColor: colors.paleAmber },
  comfortChipLabel: { color: colors.slate, fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  comfortChipValue: { color: colors.navy, fontSize: 20, fontWeight: '900' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metric: { flexGrow: 1, flexBasis: 100, minHeight: 96, justifyContent: 'center', padding: spacing.md, borderRadius: radius.md, gap: 4 },
  metricCooling: { backgroundColor: colors.paleBlue }, metricAC: { backgroundColor: colors.mint }, metricCost: { backgroundColor: colors.paleAmber },
  value: { fontSize: 16, fontWeight: '800', color: colors.navy },
  tiny: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, color: colors.tealDark },
  metricUnit: { fontSize: 12, color: colors.muted },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.line, ...elevation.card },
  tabs: { flexDirection: 'row', borderRadius: radius.md, backgroundColor: colors.paleBlue, padding: 4, gap: 2 },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
  activeTab: { backgroundColor: colors.blueDark },
  tabText: { color: colors.blueDark, fontSize: 12, fontWeight: '800' },
  activeTabText: { color: colors.surface },
  heading: { fontSize: 17, fontWeight: '800', color: colors.navy },
  content: { gap: 12, marginTop: 14 },
  label: { fontWeight: '700', color: colors.navy },
  row: { flexDirection: 'row', gap: 10 },
  dimensions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  occupantCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.paleBlue, borderRadius: radius.md, padding: spacing.md },
  occupantCopy: { flex: 1, gap: 6 }, occupantValue: { color: colors.blueDark, fontSize: 22, fontWeight: '900' },
  occupantImage: { width: 82, height: 82 },
  control: { minHeight: 44, padding: 12, minWidth: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.sm, borderColor: colors.blue, borderWidth: 1 },
  controlDisabled: { opacity: 0.5 },
  status: { color: colors.tealDark, fontWeight: '800' },
  airflowFeedback: { color: colors.blueDark, backgroundColor: colors.paleBlue, borderRadius: radius.sm, padding: spacing.md, lineHeight: 20 },
  error: { color: colors.danger, fontWeight: '700' },
});
