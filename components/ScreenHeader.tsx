import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.back}>Back</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  back: {
    fontSize: 17,
    color: '#007AFF',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#5E6470',
  },
});
