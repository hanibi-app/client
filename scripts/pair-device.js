#!/usr/bin/env node

/**
 * 샘플 계정에 기기를 페어링하는 스크립트
 *
 * 사용법:
 *   node scripts/pair-device.js [API_BASE_URL]
 *
 * 예시:
 *   node scripts/pair-device.js http://localhost:3000
 *   또는 환경 변수 사용:
 *   EXPO_PUBLIC_HANIBI_API_BASE_URL=http://localhost:3000 node scripts/pair-device.js
 */

const axios = require('axios');

// 샘플 계정 정보
const SAMPLE_EMAIL = 'hnb@hnb.ac.kr';
const SAMPLE_PASSWORD = 'hnb1234%';

// 페어링할 기기 정보
const DEVICE_ID = 'HANIBI-ESP32-001';
const DEVICE_NAME = '주방 음식물 처리기';

// API base URL 가져오기 (명령줄 인자 또는 환경 변수)
const API_BASE_URL = process.argv[2] || process.env.EXPO_PUBLIC_HANIBI_API_BASE_URL || '';

if (!API_BASE_URL) {
  console.error('❌ API base URL이 필요합니다.');
  console.error('사용법: node scripts/pair-device.js [API_BASE_URL]');
  console.error('예시: node scripts/pair-device.js http://localhost:3000');
  process.exit(1);
}

async function pairDevice() {
  try {
    console.log('🔐 샘플 계정으로 로그인 중...');
    console.log(`   이메일: ${SAMPLE_EMAIL}`);

    // 1. 로그인
    const loginResponse = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email: SAMPLE_EMAIL,
      password: SAMPLE_PASSWORD,
    });

    if (!loginResponse.data.success || !loginResponse.data.data) {
      throw new Error('로그인 응답 형식이 올바르지 않습니다.');
    }

    const { tokens } = loginResponse.data.data;
    if (!tokens?.accessToken) {
      throw new Error('액세스 토큰을 받지 못했습니다.');
    }

    const accessToken = tokens.accessToken;
    console.log('✅ 로그인 성공!');

    // 2. 현재 계정의 기기 목록 확인
    console.log('\n📋 현재 계정의 기기 목록 확인 중...');
    const devicesResponse = await axios.get(`${API_BASE_URL}/api/v1/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let existingDevice = null;
    if (devicesResponse.data.success && devicesResponse.data.data) {
      const devices = devicesResponse.data.data;
      console.log(`   현재 ${devices.length}개의 기기가 페어링되어 있습니다:`);
      devices.forEach((d, index) => {
        console.log(`   ${index + 1}. ${d.deviceName} (${d.deviceId})`);
        if (d.deviceId === DEVICE_ID) {
          existingDevice = d;
        }
      });
    }

    // 이미 이 계정에 등록되어 있는지 확인
    if (existingDevice) {
      console.log(`\n✅ 기기 "${DEVICE_ID}"가 이미 이 계정에 페어링되어 있습니다!`);
      console.log('\n📋 기기 정보:');
      console.log(`   ID: ${existingDevice.id || 'N/A'}`);
      console.log(`   기기 ID: ${existingDevice.deviceId}`);
      console.log(`   기기 이름: ${existingDevice.deviceName}`);
      console.log(`   연결 상태: ${existingDevice.connectionStatus || 'N/A'}`);
      console.log(`   기기 상태: ${existingDevice.deviceStatus || 'N/A'}`);
      return;
    }

    // 3. 기기 페어링 시도
    console.log('\n📱 기기 페어링 중...');
    console.log(`   기기 ID: ${DEVICE_ID}`);
    console.log(`   기기 이름: ${DEVICE_NAME}`);

    try {
      const pairResponse = await axios.post(
        `${API_BASE_URL}/api/v1/devices/pair`,
        {
          deviceId: DEVICE_ID,
          deviceName: DEVICE_NAME,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!pairResponse.data.success) {
        throw new Error('페어링 응답 형식이 올바르지 않습니다.');
      }

      const device = pairResponse.data.data;
      console.log('✅ 기기 페어링 성공!');
      console.log('\n📋 페어링된 기기 정보:');
      console.log(`   ID: ${device.id || 'N/A'}`);
      console.log(`   기기 ID: ${device.deviceId}`);
      console.log(`   기기 이름: ${device.deviceName}`);
      console.log(`   연결 상태: ${device.connectionStatus || 'N/A'}`);
      console.log(`   기기 상태: ${device.deviceStatus || 'N/A'}`);
    } catch (pairError) {
      if (pairError.response?.status === 409) {
        console.error('\n⚠️  기기가 이미 다른 사용자에게 등록되어 있습니다.');
        console.error('   이 경우 백엔드 관리자 권한이 필요하거나,');
        console.error('   백엔드에서 직접 기기 소유권을 변경해야 합니다.');
        console.error('\n   해결 방법:');
        console.error('   1. 백엔드 데이터베이스에서 직접 기기 소유권 변경');
        console.error('   2. 또는 관리자 API를 통해 기기 소유권 변경');
        throw pairError;
      }
      throw pairError;
    }

    // 4. 최종 기기 목록 확인
    console.log('\n📋 최종 기기 목록 확인 중...');
    const finalDevicesResponse = await axios.get(`${API_BASE_URL}/api/v1/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (finalDevicesResponse.data.success && finalDevicesResponse.data.data) {
      const devices = finalDevicesResponse.data.data;
      console.log(`✅ 총 ${devices.length}개의 기기가 페어링되어 있습니다:`);
      devices.forEach((d, index) => {
        console.log(`   ${index + 1}. ${d.deviceName} (${d.deviceId})`);
      });
    }

    console.log('\n🎉 완료!');
  } catch (error) {
    console.error('\n❌ 오류 발생:');
    if (error.response) {
      console.error(`   상태 코드: ${error.response.status}`);
      console.error(`   응답 데이터:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('   요청이 전송되었지만 응답을 받지 못했습니다.');
      console.error('   API base URL을 확인해주세요:', API_BASE_URL);
    } else {
      console.error(`   오류 메시지: ${error.message}`);
    }
    process.exit(1);
  }
}

// 스크립트 실행
pairDevice();
