import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChoiceChips } from '../components/ChoiceChips';
import { DimensionField } from '../components/DimensionField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useRoom } from '../context/RoomContext';
import { findACProfile } from '../data/acProfiles';
import { RootStackParamList } from '../navigation/routeTypes';
import { calculateComfort } from '../services/comfortCalculator';
import { estimateCooling } from '../services/coolingEstimator';
import { calculateEnergy } from '../services/energyCalculator';
import { getSuitability, recommendAC } from '../services/recommendationEngine';
import { colors, radius, spacing } from '../theme';
import { RoomLabScenario } from '../types/room';
import { validateRoom } from '../utils/validation';

type Section = 'room' | 'ac' | 'energy' | 'comfort';
type Props = NativeStackScreenProps<RootStackParamList, 'RoomLab'>;
function Accordion({ id, title, open, onToggle, children }: PropsWithChildren<{ id: Section; title: string; open: Section; onToggle: (id: Section) => void }>) {
  return <View style={styles.card}><Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ expanded: open === id }} style={styles.accordionToggle} onPress={() => onToggle(id)}><Text style={styles.heading}>{title}  {open === id ? '⌃' : '⌄'}</Text></Pressable>{open === id && <View style={styles.content}>{children}</View>}</View>;
}
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
  const toggle = (id: Section) => setOpen(id);
  return <Screen>
    <Text style={styles.title}>{scenario.name}</Text><Text style={styles.sub}>Temporary educational scenario</Text>
    <View style={styles.art}><Text style={styles.artText}>☀  ▱  ❄  ≋</Text></View>
    <View style={styles.metrics}><View style={styles.metric}><Text style={styles.value}>{estimate ? estimate.estimatedBTUh.toLocaleString() : '—'}</Text><Text style={styles.tiny}>BTU/h needed</Text></View><View style={styles.metric}><Text style={styles.value}>{selected?.name ?? 'No match'}</Text><Text style={styles.tiny}>tested AC</Text></View><View style={styles.metric}><Text style={styles.value}>{energy ? `Rs.${energy.monthlyAdditionalEnergyCostLKR.toFixed(0)}` : '—'}</Text><Text style={styles.tiny}>monthly cost</Text></View></View>
    <Accordion id="room" title="Room Conditions" open={open} onToggle={toggle}>
      <ChoiceChips groupLabel="Dimension units" value={scenario.preferredUnit} options={[{ value: 'metric', label: 'Metres' }, { value: 'imperial', label: 'Feet' }]} onChange={(preferredUnit) => update({ preferredUnit })} />
      <View style={styles.dimensions}>{(['lengthM', 'widthM', 'heightM'] as const).map((key) => <DimensionField key={`${key}-${scenario.preferredUnit}-${resetVersion}`} label={key === 'lengthM' ? 'Length' : key === 'widthM' ? 'Width' : 'Height'} meters={scenario[key]} unit={scenario.preferredUnit} onChange={(value) => update({ [key]: value })} error={errors[key]} />)}</View>
      <Text style={styles.label}>Occupants: {scenario.occupants}</Text><Adjuster label="occupants" atMin={scenario.occupants<=1} atMax={scenario.occupants>=10} decrease={() => update({ occupants: Math.max(1, scenario.occupants - 1) })} increase={() => update({ occupants: Math.min(10, scenario.occupants + 1) })} />
      <Text style={styles.label}>Sunlight</Text><ChoiceChips groupLabel="Sunlight" value={scenario.sunlight} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} onChange={(sunlight) => update({ sunlight })} />
      <Text style={styles.label}>Windows</Text><ChoiceChips groupLabel="Windows" value={scenario.windowCategory} options={[{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }]} onChange={(windowCategory) => update({ windowCategory })} />
      <Text style={styles.label}>Roof & ceiling</Text><ChoiceChips groupLabel="Roof and ceiling" value={scenario.roofConfiguration} options={[{ value: 'floorAbove', label: 'Floor above' }, { value: 'withCeiling', label: 'With ceiling' }, { value: 'concreteSlab', label: 'Concrete slab' }, { value: 'noCeiling', label: 'No ceiling' }]} onChange={(roofConfiguration) => update({ roofConfiguration })} />
    </Accordion>
    <Accordion id="ac" title="AC Selection" open={open} onToggle={toggle}>
      <Text style={styles.sub}>Automatic: {recommended?.name ?? 'No suitable match'}{`\n`}Selected for testing: {selected?.name ?? 'None'}</Text>
      {selected && estimate && <Text style={styles.status}>{getSuitability(selected, estimate.estimatedBTUh) === 'below' ? 'Below Estimated Requirement' : getSuitability(selected, estimate.estimatedBTUh) === 'higher' ? 'Higher Than Estimated Need' : 'Meets Estimated Requirement'}</Text>}
      <PrimaryButton label="Browse AC Library" onPress={() => navigation.navigate('LibrarySelect')} />
      {recommended && <PrimaryButton label="Use Recommended AC" variant="outline" onPress={() => update({ selectedACId: null })} />}
    </Accordion>
    <Accordion id="energy" title="Energy & Cost" open={open} onToggle={toggle}>
      <Text style={styles.label}>Daily use: {scenario.dailyUsageHours} hours</Text><Adjuster label="daily use hours" atMin={scenario.dailyUsageHours<=1} atMax={scenario.dailyUsageHours>=16} decrease={() => update({ dailyUsageHours: Math.max(1, scenario.dailyUsageHours - 1) })} increase={() => update({ dailyUsageHours: Math.min(16, scenario.dailyUsageHours + 1) })} />
      <Text style={styles.label}>Illustrative rate: Rs.{scenario.electricityRateLKRPerKWh}/kWh</Text><Adjuster label="illustrative electricity rate by 5 rupees" minus="−5" plus="＋5" atMin={scenario.electricityRateLKRPerKWh<=10} atMax={scenario.electricityRateLKRPerKWh>=80} decrease={() => update({ electricityRateLKRPerKWh: Math.max(10, scenario.electricityRateLKRPerKWh - 5) })} increase={() => update({ electricityRateLKRPerKWh: Math.min(80, scenario.electricityRateLKRPerKWh + 5) })} />
      <Text style={styles.sub}>{energy?.monthlyKWh.toFixed(1) ?? '—'} kWh/month · 30 days · 0.65 average-use multiplier</Text>
    </Accordion>
    <Accordion id="comfort" title="Comfort Explorer" open={open} onToggle={toggle}>
      <Text style={styles.value}>{comfort.label}</Text><Text style={styles.sub}>{comfort.explanation}</Text>
      <Text style={styles.label}>Hypothetical temperature: {scenario.comfort.temperatureC}°C</Text><Adjuster label="hypothetical temperature" atMin={scenario.comfort.temperatureC<=20} atMax={scenario.comfort.temperatureC>=34} decrease={() => update({ comfort: { ...scenario.comfort, temperatureC: Math.max(20, scenario.comfort.temperatureC - 1) } })} increase={() => update({ comfort: { ...scenario.comfort, temperatureC: Math.min(34, scenario.comfort.temperatureC + 1) } })} />
      <Text style={styles.label}>Relative humidity: {scenario.comfort.humidityPercent}%</Text><Adjuster label="relative humidity by 5 percent" minus="−5%" plus="＋5%" atMin={scenario.comfort.humidityPercent<=30} atMax={scenario.comfort.humidityPercent>=90} decrease={() => update({ comfort: { ...scenario.comfort, humidityPercent: Math.max(30, scenario.comfort.humidityPercent - 5) } })} increase={() => update({ comfort: { ...scenario.comfort, humidityPercent: Math.min(90, scenario.comfort.humidityPercent + 5) } })} />
      <ChoiceChips groupLabel="Airflow" value={scenario.comfort.airflow} options={[{ value: 'still', label: 'Still' }, { value: 'gentle', label: 'Gentle' }, { value: 'strong', label: 'Strong' }]} onChange={(airflow) => update({ comfort: { ...scenario.comfort, airflow } })} />
      <Text style={styles.tiny}>Educational visual only; it does not predict measured temperature or change cooling demand.</Text>
    </Accordion>
    {!valid && <Text accessibilityRole="alert" style={styles.error}>Correct room dimensions before applying this scenario.</Text>}
    <PrimaryButton label="Apply Changes" disabled={!valid} onPress={() => { room.applyLab(); navigation.replace('Recommendation'); }} />
    <PrimaryButton label="Reset to Entry" variant="outline" onPress={() => { room.resetLab(); setResetVersion((version) => version + 1); }} />
  </Screen>;
}
const styles = StyleSheet.create({ title: { fontSize: 27, fontWeight: '800', color: colors.navy }, sub: { color: colors.muted, lineHeight: 20 }, art: { height: 100, borderRadius: radius.md, backgroundColor: colors.paleCyan, alignItems: 'center', justifyContent: 'center' }, artText: { fontSize: 30, color: colors.teal }, metrics: { flexDirection: 'row', gap: 6 }, metric: { flex: 1 }, value: { fontSize: 16, fontWeight: '800', color: colors.navy }, tiny: { fontSize: 11, color: colors.muted }, card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.line }, accordionToggle: { minHeight: 44, justifyContent: 'center' }, heading: { fontSize: 17, fontWeight: '800', color: colors.navy }, content: { gap: 12, marginTop: 14 }, label: { fontWeight: '700', color: colors.navy }, row: { flexDirection: 'row', gap: 10 }, dimensions: { flexDirection: 'row', gap: 8 }, control: { minHeight: 44, padding: 12, minWidth: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint, borderRadius: radius.sm }, controlDisabled: { opacity: 0.5 }, status: { color: colors.tealDark, fontWeight: '800' }, error: { color: colors.danger, fontWeight: '700' } });
