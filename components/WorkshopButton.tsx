import { Pressable, StyleSheet, Text } from 'react-native';

type WorkshopButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function WorkshopButton({ label, onPress, disabled }: WorkshopButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
