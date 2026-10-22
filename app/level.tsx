import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { DeviceMotion } from 'expo-sensors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateLevelDegrees, isLevel } from '../features/level/level';

export default function LevelScreen() {
  const insets = useSafeAreaInsets();
  const [rollRadians, setRollRadians] = useState<number | null>(null);
  const [sensorMessage, setSensorMessage] = useState<string | null>(null);
  const wasLevelRef = useRef(false);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let active = true;

    async function start() {
      try {
        const permission = await DeviceMotion.requestPermissionsAsync();
        if (!active) return;

        if (!permission.granted) {
          setSensorMessage('Motion permission needed. Allow motion access, then reopen this screen.');
          return;
        }

        const available = await DeviceMotion.isAvailableAsync();
        if (!active) return;

        if (!available) {
          setSensorMessage('Motion sensors are not available on this device.');
          return;
        }

        DeviceMotion.setUpdateInterval(100);

        subscription = DeviceMotion.addListener((event) => {
          const gamma = event.rotation?.gamma;
          if (typeof gamma === 'number') {
            setRollRadians(gamma);
          }
        });
      } catch {
        if (active) {
          setSensorMessage('Motion sensors are not available on this device.');
        }
      }
    }

    void start();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (rollRadians === null) return;

    const degrees = calculateLevelDegrees(rollRadians);
    const nowLevel = isLevel(degrees);

    if (nowLevel && !wasLevelRef.current) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    wasLevelRef.current = nowLevel;
  }, [rollRadians]);

  const rawDegrees = rollRadians === null ? null : calculateLevelDegrees(rollRadians);
  const plausible = rawDegrees !== null && Math.abs(rawDegrees) <= 180;
  const level = plausible && rawDegrees !== null && isLevel(rawDegrees);
  const horizonAngle = plausible && rawDegrees !== null ? rawDegrees : 0;
  const background = level ? '#34C759' : '#000000';

  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <StatusBar style="light" />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        hitSlop={12}
        style={[styles.back, { top: insets.top + 8 }]}
      >
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <View style={styles.stage}>
        {sensorMessage ? (
          <Text style={styles.sensorMessage}>{sensorMessage}</Text>
        ) : (
          <View style={styles.tickRow}>
            <View style={styles.tick} />
            <View style={styles.dial}>
              <View style={styles.ring} />
              <View style={[styles.horizon, { transform: [{ rotate: `${horizonAngle}deg` }] }]} />
              <View style={[styles.readout, { backgroundColor: background }]}>
                <Text style={styles.degrees} allowFontScaling={false}>
                  {formatDegrees(rawDegrees)}
                </Text>
              </View>
            </View>
            <View style={styles.tick} />
          </View>
        )}
      </View>

      <Text style={[styles.debug, { marginBottom: insets.bottom + 20 }]}>
        debug {rollRadians === null ? 'waiting' : rollRadians.toFixed(3)}
      </Text>
    </View>
  );
}

function formatDegrees(value: number | null) {
  if (value === null) return '--';
  return `${Math.round(value)}°`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    left: 20,
    zIndex: 2,
  },
  backLabel: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sensorMessage: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  tickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tick: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  dial: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  horizon: {
    position: 'absolute',
    width: 250,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  readout: {
    paddingHorizontal: 12,
    zIndex: 1,
  },
  degrees: {
    color: '#FFFFFF',
    fontSize: 84,
    fontWeight: '200',
    letterSpacing: -2,
  },
  debug: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
});
