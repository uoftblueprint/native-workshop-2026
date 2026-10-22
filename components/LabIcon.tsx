import { StyleSheet, View } from 'react-native';

type LabIconName = 'level' | 'receipt' | 'light';

export function LabIcon({ name }: { name: LabIconName }) {
  if (name === 'level') {
    return (
      <View style={styles.level}>
        <View style={styles.levelLine} />
      </View>
    );
  }

  if (name === 'receipt') {
    return (
      <View style={styles.camera}>
        <View style={styles.lens} />
      </View>
    );
  }

  return (
    <View style={styles.bulbWrap}>
      <View style={styles.bulb} />
      <View style={styles.base} />
    </View>
  );
}

const ink = '#1C1C1E';

const styles = StyleSheet.create({
  level: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLine: {
    width: 16,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: ink,
  },
  camera: {
    width: 36,
    height: 26,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: ink,
  },
  bulbWrap: {
    width: 28,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: ink,
  },
  base: {
    width: 8,
    height: 4,
    marginTop: 2,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: ink,
  },
});
