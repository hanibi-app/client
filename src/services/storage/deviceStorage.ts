import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_STORAGE_KEY = '@hanibi:paired_device';

export type PairedDevice = {
  deviceId: string;
  deviceName: string;
  apiSynced?: boolean;
  syncedAt?: string;
};

export async function getPairedDevice(): Promise<PairedDevice | null> {
  try {
    const value = await AsyncStorage.getItem(DEVICE_STORAGE_KEY);
    if (value) {
      return JSON.parse(value) as PairedDevice;
    }
    return null;
  } catch (error) {
    console.error('[deviceStorage] 기기 정보 불러오기 실패:', error);
    return null;
  }
}

export async function setPairedDevice(device: PairedDevice): Promise<void> {
  try {
    await AsyncStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(device));
    console.log('[deviceStorage] 기기 정보 저장 성공:', device);
  } catch (error) {
    console.error('[deviceStorage] 기기 정보 저장 실패:', error);
    throw error;
  }
}

export async function clearPairedDevice(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEVICE_STORAGE_KEY);
    console.log('[deviceStorage] 기기 정보 삭제 성공');
  } catch (error) {
    console.error('[deviceStorage] 기기 정보 삭제 실패:', error);
  }
}
