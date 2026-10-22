import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function liquidGlassSupported() {
  if (Platform.OS !== 'ios') return false;

  try {
    return isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

export function GlassCard({ children, style }: GlassCardProps) {
  if (liquidGlassSupported()) {
    return (
      <GlassView glassEffectStyle="regular" isInteractive style={[styles.glass, style]}>
        {children}
      </GlassView>
    );
  }

  return <View style={[styles.fallback, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    overflow: 'hidden',
  },
  fallback: {
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#1C1C1E',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
});
