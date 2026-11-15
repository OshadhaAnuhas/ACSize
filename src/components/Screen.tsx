import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, useThemedStyles } from '../theme';
export function Screen({ children, contentStyle }: PropsWithChildren<{ contentStyle?: ViewStyle }>) {
  const styles = useThemedStyles(baseStyles);
  return <SafeAreaView edges={['bottom']} style={styles.safe}><ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled">{children}</ScrollView></SafeAreaView>;
}
const baseStyles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.xl, gap: spacing.lg, flexGrow: 1 } });
