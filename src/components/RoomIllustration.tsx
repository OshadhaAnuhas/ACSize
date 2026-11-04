import { Image, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

export function RoomIllustration({ compact = false }: { compact?: boolean }) {
  return <View accessible={false} style={[styles.frame, compact && styles.compact]}>
    <Image source={require('../../assets/room-cooling-3d.jpg')} resizeMode="cover" style={styles.image} accessibilityIgnoresInvertColors />
  </View>;
}

const styles = StyleSheet.create({
  frame: { height: 184, overflow: 'hidden', borderRadius: radius.md, backgroundColor: colors.navy },
  compact: { height: 126 },
  image: { width: '100%', height: '100%' },
});
