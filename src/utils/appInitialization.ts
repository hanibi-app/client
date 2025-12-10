/**
 * 앱 초기화 유틸 함수
 * 앱 시작 시 토큰 갱신 및 페어링 갱신을 처리합니다.
 */

import { devicesApi } from '@/api/devicesApi';
import { getPairedDevice, setPairedDevice } from '@/services/storage/deviceStorage';
import { restoreTokensFromStorage, useAuthStore } from '@/store/authStore';

/**
 * 앱 시작 시 토큰 갱신 및 페어링 갱신을 수행합니다.
 * 1. 토큰 복원
 * 2. 토큰 갱신 시도
 * 3. 토큰 갱신 성공 시 로컬에 저장된 페어링 기기 정보로 페어링 갱신
 */
export async function initializeApp(): Promise<{
  tokenRefreshed: boolean;
  pairingRefreshed: boolean;
}> {
  let tokenRefreshed = false;
  let pairingRefreshed = false;

  try {
    // 1. 토큰 복원
    await restoreTokensFromStorage();

    const authStore = useAuthStore.getState();
    if (!authStore.refreshToken) {
      return { tokenRefreshed: false, pairingRefreshed: false };
    }

    // 2. 토큰 갱신 시도
    try {
      await authStore.refreshAccessToken();
      tokenRefreshed = true;
    } catch (error) {
      console.warn('[appInitialization] 토큰 갱신 실패:', error);
      return { tokenRefreshed: false, pairingRefreshed: false };
    }

    // 3. 페어링 갱신 시도 (이미 서버에 등록되어 있는지 확인 후에만)
    try {
      const pairedDevice = await getPairedDevice();
      if (pairedDevice && pairedDevice.deviceId) {
        // 먼저 서버에서 기기 목록을 조회하여 이미 등록되어 있는지 확인
        const devices = await devicesApi.getDevices();
        const existingDevice = devices.find((d) => d.deviceId === pairedDevice.deviceId);

        // 이미 서버에 등록되어 있으면 페어링 시도하지 않음
        if (existingDevice) {
          console.log('[appInitialization] 기기가 이미 서버에 등록되어 있습니다. 페어링을 건너뜁니다.');
          // 로컬 저장소 동기화 상태만 업데이트
          await setPairedDevice({
            deviceId: existingDevice.deviceId,
            deviceName: existingDevice.deviceName,
            apiSynced: true,
            syncedAt: new Date().toISOString(),
          });
          pairingRefreshed = true;
        } else {
          // 서버에 등록되어 있지 않으면 페어링 시도 (한 번만)
          console.log('[appInitialization] 서버에 기기가 없어 페어링을 시도합니다.');
          const device = await devicesApi.pairDevice({
            deviceId: pairedDevice.deviceId,
            deviceName: pairedDevice.deviceName,
          });

          // 페어링 성공 시 로컬 저장소 업데이트
          await setPairedDevice({
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            apiSynced: true,
            syncedAt: new Date().toISOString(),
          });

          pairingRefreshed = true;
        }
      }
    } catch (error) {
      console.warn('[appInitialization] 페어링 갱신 실패:', error);
      // 페어링 갱신 실패는 치명적이지 않으므로 계속 진행
    }

    return { tokenRefreshed, pairingRefreshed };
  } catch (error) {
    console.error('[appInitialization] 앱 초기화 실패:', error);
    return { tokenRefreshed: false, pairingRefreshed: false };
  }
}
