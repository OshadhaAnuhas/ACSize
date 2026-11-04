import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChoiceChips } from '../components/ChoiceChips';
import { DimensionField } from '../components/DimensionField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useRoom } from '../context/RoomContext';
import { RootStackParamList } from '../navigation/routeTypes';
import { colors, radius, spacing } from '../theme';
import { ROOM_NAMES, RoomDraft, RoomType } from '../types/room';
import { validateRoom } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'RoomSetup'>;
const roomOptions: { value: RoomType; label: string }[] = [{ value: 'bedroom', label: 'Bedroom' }, { value: 'living', label: 'Living room' }, { value: 'office', label: 'Small office' }];
export function RoomSetupScreen({ navigation }: Props) {
  const { draft, setDraft } = useRoom();
  const [step, setStep] = useState(1);
  const [attempted, setAttempted] = useState(false);
  const errors = validateRoom(draft);
  const update = <K extends keyof RoomDraft>(key: K, value: RoomDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const next = () => {
    setAttempted(true);
    if (step === 1 && (errors.name || errors.lengthM || errors.widthM || errors.heightM)) return;
    if (step === 3 && Object.keys(errors).length) return;
    setAttempted(false);
    if (step < 3) setStep(step + 1); else navigation.navigate('Recommendation');
  };
  const area = draft.lengthM * draft.widthM;
  const shownArea = Number.isFinite(area) ? (draft.preferredUnit === 'metric' ? area : area / (0.3048 ** 2)).toFixed(1) : '—';
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><Screen>
    <Text style={styles.progress}>STEP {step} OF 3</Text><View style={styles.segments}>{[1, 2, 3].map((n) => <View key={n} style={[styles.segment, n <= step && styles.on]} />)}</View>
    {step === 1 && <><Text style={styles.title}>Let’s start with your space</Text>
      <ChoiceChips value={draft.roomType} options={roomOptions} onChange={(roomType) => setDraft((current) => ({ ...current, roomType, name: Object.values(ROOM_NAMES).includes(current.name) ? ROOM_NAMES[roomType] : current.name }))} />
      <View><Text style={styles.label}>Room name</Text><TextInput accessibilityLabel="Room name" value={draft.name} onChangeText={(name) => update('name', name)} maxLength={60} style={styles.nameInput} />{attempted && errors.name && <Text style={styles.error}>{errors.name}</Text>}</View>
      <ChoiceChips value={draft.preferredUnit} options={[{ value: 'metric', label: 'Metres' }, { value: 'imperial', label: 'Feet' }]} onChange={(unit) => update('preferredUnit', unit)} />
      <View style={styles.dimensions}>{(['lengthM', 'widthM', 'heightM'] as const).map((key) => <DimensionField key={`${key}-${draft.preferredUnit}`} label={key === 'lengthM' ? 'Length' : key === 'widthM' ? 'Width' : 'Height'} meters={draft[key]} unit={draft.preferredUnit} onChange={(value) => update(key, value)} error={attempted ? errors[key] : undefined} />)}</View>
      <View style={styles.summary}><Text style={styles.value}>{shownArea} {draft.preferredUnit === 'metric' ? 'm²' : 'ft²'}</Text><Text>Calculated floor area</Text></View></>}
    {step === 2 && <><Text style={styles.title}>Describe the room conditions</Text><Text style={styles.label}>Occupants: {draft.occupants}</Text><View style={styles.row}><PrimaryButton label="−" onPress={() => update('occupants', Math.max(1, draft.occupants - 1))} variant="outline" /><PrimaryButton label="＋" onPress={() => update('occupants', Math.min(10, draft.occupants + 1))} variant="outline" /></View>
      <Text style={styles.label}>Sunlight</Text><ChoiceChips value={draft.sunlight} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} onChange={(v) => update('sunlight', v)} />
      <Text style={styles.label}>Windows</Text><ChoiceChips value={draft.windowCategory} options={[{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }]} onChange={(v) => update('windowCategory', v)} />
      <Text style={styles.label}>Roof & ceiling</Text><ChoiceChips value={draft.roofConfiguration} options={[{ value: 'withCeiling', label: 'Sheet/tile + ceiling' }, { value: 'concreteSlab', label: 'Concrete slab' }, { value: 'noCeiling', label: 'No ceiling' }, { value: 'floorAbove', label: 'Floor above' }]} onChange={(v) => update('roofConfiguration', v)} /></>}
    {step === 3 && <><Text style={styles.title}>What matters most to you?</Text><Text style={styles.label}>Installation</Text><ChoiceChips value={draft.installationPreference} options={[{ value: 'either', label: 'No preference' }, { value: 'split', label: 'Permanent split' }, { value: 'portable', label: 'Portable' }]} onChange={(v) => update('installationPreference', v)} />
      <Text style={styles.label}>Daily use: {draft.dailyUsageHours} hours</Text><View style={styles.row}><PrimaryButton label="−" onPress={() => update('dailyUsageHours', Math.max(1, draft.dailyUsageHours - 1))} variant="outline" /><PrimaryButton label="＋" onPress={() => update('dailyUsageHours', Math.min(16, draft.dailyUsageHours + 1))} variant="outline" /></View>
      <Text style={styles.label}>Main priority</Text><ChoiceChips value={draft.selectionPriority} options={[{ value: 'budget', label: 'Lower cost' }, { value: 'balanced', label: 'Balanced' }, { value: 'energy', label: 'Lower electricity' }]} onChange={(v) => update('selectionPriority', v)} /></>}
    <View style={styles.actions}>{step > 1 && <PrimaryButton label="Back" variant="outline" onPress={() => setStep(step - 1)} />}<PrimaryButton label={step === 3 ? 'Find My AC' : 'Continue'} onPress={next} /></View>
  </Screen></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ progress: { color: colors.tealDark, fontWeight: '800' }, segments: { flexDirection: 'row', gap: 6 }, segment: { flex: 1, height: 5, backgroundColor: colors.line, borderRadius: 5 }, on: { backgroundColor: colors.teal }, title: { fontSize: 26, fontWeight: '800', color: colors.navy }, label: { color: colors.navy, fontWeight: '700' }, nameInput: { minHeight: 48, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: 12, marginTop: 6 }, dimensions: { flexDirection: 'row', gap: 8 }, summary: { padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.paleCyan }, value: { fontSize: 21, fontWeight: '800', color: colors.navy }, row: { flexDirection: 'row', justifyContent: 'space-around' }, actions: { gap: 10, marginTop: 12 }, error: { color: colors.danger } });
