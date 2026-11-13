import { StyleSheet, View } from 'react-native';
import { ChoiceArtwork } from './ChoiceArtwork';

export function OccupantIllustration({ count }: { count: number }) {
  const visible = Math.min(5, Math.max(1, count));
  const size = visible <= 2 ? 48 : visible === 3 ? 38 : 30;
  return <View style={styles.group} accessible={false}>
    {Array.from({ length: visible }, (_, index) => <View key={index} style={index > 0 && styles.overlap}><ChoiceArtwork kind="person" width={size} height={size} /></View>)}
  </View>;
}

const styles = StyleSheet.create({
  group: { width: 105, height: 92, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  overlap: { marginLeft: -12 },
});
