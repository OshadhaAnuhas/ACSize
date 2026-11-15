import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChoiceChips } from '../components/ChoiceChips';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useProfile } from '../context/ProfileContext';
import { colors, radius, spacing, typeScale, useThemedStyles, useThemeColors } from '../theme';
import { ThemeMode } from '../types/profile';
import { UnitSystem } from '../types/room';

export function ProfileScreen() {
  const { profile, ready } = useProfile();
  if (!ready) return <Screen><Text>Loading local preferences…</Text></Screen>;
  return <ProfileEditor key={JSON.stringify(profile)} />;
}

function ProfileEditor() {
  const styles = useThemedStyles(baseStyles);
  const themeColors = useThemeColors();
  const { profile, preferences, ready, saveProfile, deleteProfile } = useProfile();
  const [name, setName] = useState(profile?.name ?? '');
  const [unit, setUnit] = useState<UnitSystem>(preferences.preferredUnit);
  const [rate, setRate] = useState(String(preferences.electricityRateLKRPerKWh));
  const [themeMode, setThemeMode] = useState<ThemeMode>(preferences.themeMode);
  const [busy, setBusy] = useState(false);
  const validRate = Number(rate) >= 10 && Number(rate) <= 80 && Number.isFinite(Number(rate));
  const save = async () => {
    if (!name.trim() || !validRate || busy) return;
    setBusy(true);
    try {
      await saveProfile({ schemaVersion: 1, name: name.trim(), preferredUnit: unit, electricityRateLKRPerKWh: Number(rate), themeMode });
      Alert.alert('Profile saved', 'Your preferences are stored on this device.');
    } catch { Alert.alert('Save failed', 'Your previous profile is unchanged. Try again.'); }
    finally { setBusy(false); }
  };
  const remove = () => Alert.alert('Delete local profile?', 'This resets your preferences. Saved rooms will remain on this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete profile', style: 'destructive', onPress: async () => {
      try { await deleteProfile(); Alert.alert('Profile deleted', 'Saved rooms were kept.'); }
      catch { Alert.alert('Delete failed', 'Your profile is unchanged. Try again.'); }
    } },
  ]);
  return <Screen>
    <Text style={styles.eyebrow}>STORED ON THIS DEVICE</Text>
    <Text style={styles.title}>Profile</Text>
    <Text style={styles.intro}>Choose defaults for new room estimates and how ACSize looks. No account or internet connection is needed.</Text>
    {!ready && <Text style={styles.intro}>Loading local preferences…</Text>}
    <View style={styles.card}>
      <Text style={styles.heading}>{profile ? 'Edit local profile' : 'Create local profile'}</Text>
      <Text style={styles.label}>Your name</Text>
      <TextInput accessibilityLabel="Profile name" value={name} onChangeText={setName} maxLength={40} placeholder="Enter a name" placeholderTextColor={themeColors.muted} style={styles.input} />
      {!name.trim() && <Text style={styles.helper}>Enter a name to save the profile.</Text>}
      <Text style={styles.label}>Default dimension units</Text>
      <ChoiceChips groupLabel="Default dimension units" value={unit} options={[{ value: 'metric', label: 'Metres' }, { value: 'imperial', label: 'Feet' }]} onChange={setUnit} />
      <Text style={styles.label}>Illustrative electricity rate (Rs./kWh)</Text>
      <TextInput accessibilityLabel="Default electricity rate in rupees per kilowatt hour" value={rate} onChangeText={setRate} keyboardType="decimal-pad" maxLength={5} style={styles.input} />
      {!validRate && <Text style={styles.error}>Enter a rate from Rs.10 to Rs.80.</Text>}
      <Text style={styles.label}>Appearance</Text>
      <ChoiceChips groupLabel="Appearance" value={themeMode} options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} onChange={setThemeMode} />
      <PrimaryButton label={busy ? 'Saving…' : profile ? 'Save Changes' : 'Create Profile'} disabled={!ready || !name.trim() || !validRate || busy} onPress={() => void save()} />
      {profile && <PrimaryButton label="Delete Local Profile" variant="outline" disabled={busy} onPress={remove} />}
    </View>
    <Text style={styles.intro}>These defaults apply when you start a new room. Existing saved rooms keep their own units and rate. Anyone using this device can open this local profile.</Text>
  </Screen>;
}

const baseStyles = StyleSheet.create({
  eyebrow: { color: colors.blueDark, fontSize: typeScale.caption, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.navy, fontSize: typeScale.title, fontWeight: '800' },
  intro: { color: colors.slate, lineHeight: 21 },
  card: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, gap: 12 },
  heading: { color: colors.navy, fontSize: typeScale.section, fontWeight: '800' },
  label: { color: colors.navy, fontWeight: '700' },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: 12, backgroundColor: colors.surface, color: colors.navy },
  helper: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger, fontSize: 12 },
});
