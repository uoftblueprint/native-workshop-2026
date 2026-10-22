import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';
import { LabIcon } from './LabIcon';

type BentoCardProps = {
  kicker: string;
  sentence: string;
  icon: 'level' | 'receipt' | 'light';
  onPress: () => void;
  large?: boolean;
};

export function BentoCard({ kicker, sentence, icon, onPress, large }: BentoCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${kicker}. ${sentence}`}
      onPress={onPress}
      style={({ pressed }) => [
        large ? styles.large : styles.small,
        pressed && styles.pressed,
      ]}
    >
      <GlassCard style={[styles.card, large ? styles.cardLarge : styles.cardSmall]}>
        <View style={styles.top}>
          <Text style={styles.kicker}>{kicker}</Text>
          <LabIcon name={icon} />
        </View>
        <Text style={[styles.sentence, large ? styles.sentenceLarge : styles.sentenceSmall]}>
          {sentence}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  large: {
    width: '100%',
  },
  small: {
    flex: 1,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  card: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  cardLarge: {
    minHeight: 228,
  },
  cardSmall: {
    minHeight: 176,
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  kicker: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: '#3A3A3C',
  },
  sentence: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  sentenceLarge: {
    fontSize: 28,
    lineHeight: 34,
    maxWidth: 240,
  },
  sentenceSmall: {
    fontSize: 20,
    lineHeight: 26,
  },
});
