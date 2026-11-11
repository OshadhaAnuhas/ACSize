import { StyleSheet, View } from 'react-native';
import { ChoiceArtwork } from './ChoiceArtwork';

export function OccupantIllustration({ count }: { count: number }) {
  const visible = Math.min(5, Math.max(1, count));
  return <View style={styles.group} accessible={false}>
    {Array.from({ length: visible }, (_, index) => <View key={index} style={index > 0 && styles.overlap}><ChoiceArtwork kind="person" width={37} height={85} /></View>)}
  </View>;
}

const styles = StyleSheet.create({
  group: { width: 105, height: 92, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  overlap: { marginLeft: -20 },
});
