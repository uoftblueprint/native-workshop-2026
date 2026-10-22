import * as SecureStore from 'expo-secure-store';
import type { Light } from './lightApi';

const STORAGE_KEY = 'mobile-lab.light';

export async function loadSavedLight(): Promise<Light | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isLight(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveLight(light: Light) {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(light));
}

export async function clearSavedLight() {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}

function isLight(value: unknown): value is Light {
  if (!value || typeof value !== 'object') return false;

  const light = value as Partial<Light>;
  return typeof light.id === 'string' && light.id.length > 0 && typeof light.name === 'string' && typeof light.isOn === 'boolean';
}
