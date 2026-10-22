import * as SecureStore from 'expo-secure-store';
import { clearSavedLight, loadSavedLight, saveLight } from './savedLight';
import type { Light } from './lightApi';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const store = SecureStore as jest.Mocked<typeof SecureStore>;

const lamp: Light = { id: 'light-1', name: 'Bedroom Lamp', isOn: false };

beforeEach(() => {
  store.getItemAsync.mockReset();
  store.setItemAsync.mockReset();
  store.deleteItemAsync.mockReset();
});

describe('savedLight', () => {
  it('saves and loads one light', async () => {
    store.getItemAsync.mockResolvedValue(JSON.stringify(lamp));

    await saveLight(lamp);
    const loaded = await loadSavedLight();

    expect(store.setItemAsync).toHaveBeenCalledWith('mobile-lab.light', JSON.stringify(lamp));
    expect(loaded).toEqual(lamp);
  });

  it('returns null when nothing is saved', async () => {
    store.getItemAsync.mockResolvedValue(null);
    expect(await loadSavedLight()).toBeNull();
  });

  it('returns null when the saved value is not a light', async () => {
    store.getItemAsync.mockResolvedValue('{"name":"no id"}');
    expect(await loadSavedLight()).toBeNull();
  });

  it('clears the saved light', async () => {
    await clearSavedLight();
    expect(store.deleteItemAsync).toHaveBeenCalledWith('mobile-lab.light');
  });
});
