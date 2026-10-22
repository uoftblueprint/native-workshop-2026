import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { WorkshopButton } from '../components/WorkshopButton';
import { isLightboxConfigured } from '../config/workshop';
import { createLight, deleteLight, setLightPower, triggerDisco, type Light } from '../features/lights/lightApi';
import { clearSavedLight, loadSavedLight, saveLight } from '../features/lights/savedLight';
import { isShake } from '../features/lights/shake';
import { notUsedYet } from '../features/notUsedYet';

export default function LightsScreen() {
  const [name, setName] = useState('');
  const [light, setLight] = useState<Light | null>(null);
  const [remembered, setRemembered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [sensorNote, setSensorNote] = useState<string | null>(null);
  const coolingDown = useRef(false);

  const beginCooldown = useCallback(() => {
    coolingDown.current = true;
    setTimeout(() => {
      coolingDown.current = false;
    }, 1600);
  }, []);

  const onDisco = useCallback(async () => {
    if (!light) return;

    try {
      await triggerDisco(light.id);
      setNote('Disco sent');
      setTimeout(() => setNote(null), 1600);
    } catch (caught) {
      setError(readableError(caught, "Can't reach the workshop server. Check your connection and try again."));
    }
  }, [light]);

  useEffect(() => {
    let active = true;

    loadSavedLight()
      .then((saved) => {
        if (!active) return;
        if (saved) setLight(saved);
      })
      .finally(() => {
        if (active) setRemembered(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!light) return;

    let subscription: { remove: () => void } | null = null;
    let active = true;

    async function start() {
      try {
        const permission = await Accelerometer.requestPermissionsAsync();
        if (!active) return;

        if (!permission.granted) {
          setSensorNote('Motion permission needed before shake can start disco mode.');
          return;
        }

        const available = await Accelerometer.isAvailableAsync();
        if (!active) return;

        if (!available) {
          setSensorNote('Shake needs a physical phone with a motion sensor.');
          return;
        }

        Accelerometer.setUpdateInterval(80);

        subscription = Accelerometer.addListener((reading) => {
          if (coolingDown.current) return;

          // TODO LIGHTS 4
          // When the phone shakes, tap once and start disco mode.
          //
          // Hints:
          // - isShake takes reading.x, reading.y, and reading.z.
          // - Haptics.impactAsync plays one tap.
          // - Call onDisco(), then beginCooldown() so one shake does not fire many times.
          //
          // Delete the next line when you use these.
          notUsedYet(reading, isShake, Haptics, onDisco, beginCooldown);
        });
      } catch {
        if (active) {
          setSensorNote('Shake needs a physical phone with a motion sensor.');
        }
      }
    }

    void start();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, [light, onDisco, beginCooldown]);

  async function onCreate() {
    if (light) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Give your light a name first.');
      return;
    }

    setBusy(true);
    setError(null);
    let created: Light;
    try {
      created = await createLight(trimmed);
    } catch (caught) {
      setError(readableError(caught, "Can't reach the workshop server. Check your connection and try again."));
      setBusy(false);
      return;
    }

    setLight(created);
    setName('');
    try {
      await saveLight(created);
    } catch {
      setError('The light was added, but this phone could not remember it.');
    } finally {
      setBusy(false);
    }
  }

  async function onToggle() {
    if (!light) return;

    setBusy(true);
    setError(null);
    let updated: Light;
    try {
      updated = await setLightPower(light.id, !light.isOn);
    } catch (caught) {
      setError(readableError(caught, "Can't reach the workshop server. Check your connection and try again."));
      setBusy(false);
      return;
    }

    setLight(updated);
    try {
      await saveLight(updated);
    } catch {
      setError('The light changed, but this phone could not remember it.');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!light) return;

    setBusy(true);
    setError(null);
    try {
      await deleteLight(light.id);
    } catch (caught) {
      setError(readableError(caught, "Can't reach the workshop server. Check your connection and try again."));
      setBusy(false);
      return;
    }

    setLight(null);
    try {
      await clearSavedLight();
    } catch {
      setError('The light was removed, but this phone could not forget it.');
    } finally {
      setBusy(false);
    }
  }

  if (!isLightboxConfigured()) {
    return (
      <View style={styles.screen}>
        <View style={styles.column}>
          <ScreenHeader title="Lightbox" />
          <View style={styles.message}>
            <Text style={styles.messageTitle}>{"Lightbox isn't configured yet"}</Text>
            <Text style={styles.messageBody}>Ask your workshop instructor for help.</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <ScreenHeader
          title="Lightbox"
          subtitle="This phone keeps one light. Leave and come back, and it is still here."
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!remembered ? (
              <Text style={styles.hint}>Looking for your light...</Text>
            ) : light ? (
              <GlassCard style={styles.card}>
                <Text style={styles.lightName}>{light.name}</Text>
                <View style={[styles.lamp, light.isOn ? styles.lampOn : styles.lampOff]} />
                <Text style={styles.power}>{light.isOn ? 'ON' : 'OFF'}</Text>
                <WorkshopButton
                  label={light.isOn ? 'TURN OFF' : 'TURN ON'}
                  onPress={() => void onToggle()}
                  disabled={busy}
                />
                <Text style={styles.hint}>Shake your phone for disco mode</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove light"
                  disabled={busy}
                  onPress={() => void onDelete()}
                  style={styles.remove}
                >
                  <Text style={styles.removeLabel}>Remove light</Text>
                </Pressable>
                {sensorNote ? <Text style={styles.note}>{sensorNote}</Text> : null}
                {note ? <Text style={styles.note}>{note}</Text> : null}
              </GlassCard>
            ) : (
              <GlassCard style={styles.card}>
                <Text style={styles.kicker}>Your Light</Text>
                <Text style={styles.prompt}>Name your light</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Bedroom Lamp"
                  placeholderTextColor="#8E8E93"
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  editable={!busy}
                  onSubmitEditing={() => void onCreate()}
                />
                <WorkshopButton
                  label={busy ? 'Adding...' : 'Add Light'}
                  onPress={() => void onCreate()}
                  disabled={busy}
                />
              </GlassCard>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

function readableError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.includes('has not been implemented yet')) {
    return error.message;
  }
  return fallback;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    padding: 22,
    gap: 14,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: '#3A3A3C',
  },
  prompt: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#1C1C1E',
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.72)',
    fontSize: 17,
    color: '#1C1C1E',
  },
  lightName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#1C1C1E',
  },
  lamp: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignSelf: 'flex-start',
  },
  lampOff: {
    backgroundColor: '#D1D1D6',
  },
  lampOn: {
    backgroundColor: '#FFD60A',
    shadowColor: '#FFD60A',
    shadowOpacity: 0.8,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  power: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#1C1C1E',
  },
  hint: {
    fontSize: 16,
    lineHeight: 22,
    color: '#3A3A3C',
  },
  remove: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  removeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9B3A2F',
  },
  note: {
    fontSize: 15,
    lineHeight: 21,
    color: '#5E6470',
  },
  message: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  messageBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#3A3A3C',
  },
  error: {
    fontSize: 15,
    lineHeight: 21,
    color: '#9B3A2F',
  },
});
