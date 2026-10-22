import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScreenHeader } from '../components/ScreenHeader';
import { WorkshopButton } from '../components/WorkshopButton';
import { GlassCard } from '../components/GlassCard';
import { captureReceipt, type ReceiptCamera } from '../features/receipt-scanner/captureReceipt';
import {
  mockAnalyzeReceipt,
  type ReceiptResult,
} from '../features/receipt-scanner/mockAnalyzeReceipt';
import { notUsedYet } from '../features/notUsedYet';

export default function ReceiptScannerScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRequestPermission() {
    setError(null);
    try {
      // TODO RECEIPT 1
      // Ask for camera access.
      //
      // Hints:
      // - requestPermission comes from useCameraPermissions.
      // - Call it. You do not need to store the result yourself.
      // - The screen already chooses what to show from permission.
      //
      // Delete the next line when you call requestPermission.
      notUsedYet(requestPermission);
      throw new Error('TODO RECEIPT 1 has not been implemented yet.');
    } catch (caught) {
      setError(readableError(caught, 'We could not ask for camera access. Try again.'));
    }
  }

  async function onCapture() {
    setError(null);
    setBusy(true);
    try {
      // TODO RECEIPT 3
      // Take the photo, show it, then show the mocked receipt.
      //
      // Hints:
      // - cameraFromRef(cameraRef) gives you the camera, or null if it is not ready.
      // - captureReceipt returns a uri. setPhotoUri shows that photo.
      // - mockAnalyzeReceipt takes the uri and returns the merchant and total. Save it with setReceipt.
      //
      // Delete the next line when you use these.
      notUsedYet(cameraFromRef, cameraRef, captureReceipt, mockAnalyzeReceipt, setPhotoUri, setReceipt);
      throw new Error('TODO RECEIPT 3 has not been implemented yet.');
    } catch (caught) {
      setError(readableError(caught, 'Could not scan that receipt. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  function onScanAgain() {
    setPhotoUri(null);
    setReceipt(null);
    setError(null);
    setCameraReady(false);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.column}>
        <ScreenHeader
          title="Receipt Scanner"
          subtitle="We're mocking the OCR part today so we can focus on the camera."
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {permission === null ? (
            <View style={styles.block}>
              <Text style={styles.blockBody}>Checking camera access...</Text>
            </View>
          ) : null}

          {permission && !permission.granted ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Camera permission needed</Text>
              <Text style={styles.blockBody}>We need camera access to scan a receipt.</Text>
              {!permission.canAskAgain ? (
                <Text style={styles.blockBody}>
                  If the prompt does not appear, allow the camera for Expo Go in Settings.
                </Text>
              ) : null}
              <WorkshopButton label="Allow Camera" onPress={() => void onRequestPermission()} />
            </View>
          ) : null}

          {permission?.granted && !photoUri ? (
            <View style={styles.cameraBlock}>
              <View style={styles.preview}>
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing="back"
                  onCameraReady={() => setCameraReady(true)}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Capture receipt"
                disabled={!cameraReady || busy}
                onPress={() => void onCapture()}
                style={[styles.shutter, (!cameraReady || busy) && styles.shutterDisabled]}
              >
                <View style={styles.shutterInner} />
              </Pressable>
            </View>
          ) : null}

          {photoUri ? (
            <View style={styles.resultBlock}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              {receipt ? (
                <GlassCard style={styles.resultCard}>
                  <Text style={styles.found}>Receipt found</Text>
                  <Text style={styles.label}>Merchant</Text>
                  <Text style={styles.value}>{receipt.merchant}</Text>
                  <Text style={styles.label}>Total</Text>
                  <Text style={styles.value}>{formatTotal(receipt.total)}</Text>
                  <Text style={styles.mockNote}>Sample reading. The photo is real, the text is mocked.</Text>
                </GlassCard>
              ) : (
                <View style={styles.reading}>
                  <ActivityIndicator color="#1C1C1E" />
                  <Text style={styles.blockBody}>Reading receipt...</Text>
                </View>
              )}
              <WorkshopButton label="Scan Again" onPress={onScanAgain} disabled={busy && !receipt} />
            </View>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </View>
    </View>
  );
}

function cameraFromRef(ref: { current: CameraView | null }): ReceiptCamera | null {
  const camera = ref.current;
  if (!camera) return null;

  return {
    takePictureAsync: (options) => camera.takePictureAsync(options),
  };
}

function formatTotal(total: number) {
  return `$${total.toFixed(2)}`;
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  block: {
    gap: 14,
    paddingTop: 12,
  },
  blockTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  blockBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#3A3A3C',
  },
  cameraBlock: {
    gap: 22,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 420,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#111113',
  },
  camera: {
    flex: 1,
  },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: {
    opacity: 0.35,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C1C1E',
  },
  resultBlock: {
    gap: 16,
  },
  photo: {
    width: '100%',
    height: 280,
    borderRadius: 28,
    backgroundColor: '#111113',
  },
  resultCard: {
    padding: 20,
    gap: 4,
  },
  found: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#6B6B70',
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  mockNote: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B70',
  },
  reading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  error: {
    fontSize: 15,
    lineHeight: 21,
    color: '#9B3A2F',
  },
});
