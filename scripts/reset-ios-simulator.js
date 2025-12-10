#!/usr/bin/env node

/**
 * iOS 시뮬레이터 재설정 스크립트
 *
 * 문제가 있는 시뮬레이터를 삭제하고 재생성합니다.
 * 사용법: node scripts/reset-ios-simulator.js [시뮬레이터 이름 또는 UDID]
 */

const { execSync } = require('child_process');

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing: ${command}`);
    throw error;
  }
}

function getAllSimulators() {
  try {
    const output = execSync('xcrun simctl list devices --json', { encoding: 'utf-8' });
    const data = JSON.parse(output);
    return data.devices;
  } catch (error) {
    console.error('시뮬레이터 목록을 가져올 수 없습니다.');
    process.exit(1);
  }
}

function findSimulator(query) {
  const devices = getAllSimulators();
  const allDevices = Object.values(devices).flat();

  // UDID로 검색
  if (query && query.length === 36 && query.includes('-')) {
    const device = allDevices.find((d) => d.udid === query);
    if (device) return device;
  }

  // 이름으로 검색
  if (query) {
    const device = allDevices.find((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    if (device) return device;
  }

  return null;
}

function deleteSimulator(udid) {
  console.log(`\n시뮬레이터 삭제 중: ${udid}`);
  try {
    exec(`xcrun simctl delete ${udid}`);
    console.log('✓ 시뮬레이터가 삭제되었습니다.');
  } catch (error) {
    console.error('시뮬레이터 삭제 실패:', error.message);
  }
}

function createSimulator(deviceType, runtime, name) {
  console.log(`\n새 시뮬레이터 생성 중: ${name}`);
  try {
    const output = execSync(`xcrun simctl create "${name}" "${deviceType}" "${runtime}"`, {
      encoding: 'utf-8',
    });
    const udid = output.trim();
    console.log(`✓ 시뮬레이터가 생성되었습니다: ${udid}`);
    return udid;
  } catch (error) {
    console.error('시뮬레이터 생성 실패:', error.message);
    return null;
  }
}

function listAvailableDevices() {
  console.log('\n사용 가능한 디바이스 타입:');
  try {
    exec('xcrun simctl list devicetypes | head -20');
  } catch (error) {
    console.error('디바이스 타입 목록을 가져올 수 없습니다.');
  }
}

function listAvailableRuntimes() {
  console.log('\n사용 가능한 런타임:');
  try {
    exec('xcrun simctl list runtimes | grep iOS');
  } catch (error) {
    console.error('런타임 목록을 가져올 수 없습니다.');
  }
}

function main() {
  const args = process.argv.slice(2);
  const query = args[0];

  console.log('iOS 시뮬레이터 재설정 도구\n');

  if (!query) {
    console.log('사용법: node scripts/reset-ios-simulator.js [시뮬레이터 이름 또는 UDID]');
    console.log('\n예시:');
    console.log('  node scripts/reset-ios-simulator.js "iPhone SE"');
    console.log('  node scripts/reset-ios-simulator.js "iPhone 15 Pro"');
    console.log('\n모든 시뮬레이터 목록 보기:');
    exec('xcrun simctl list devices');
    return;
  }

  // 시뮬레이터 찾기
  const simulator = findSimulator(query);

  if (!simulator) {
    console.error(`\n시뮬레이터를 찾을 수 없습니다: ${query}`);
    console.log('\n사용 가능한 시뮬레이터 목록:');
    exec('xcrun simctl list devices');
    process.exit(1);
  }

  console.log(`\n찾은 시뮬레이터:`);
  console.log(`  이름: ${simulator.name}`);
  console.log(`  UDID: ${simulator.udid}`);
  console.log(`  상태: ${simulator.state}`);

  // 실행 중인 시뮬레이터 종료
  if (simulator.state === 'Booted') {
    console.log('\n실행 중인 시뮬레이터를 종료합니다...');
    exec(`xcrun simctl shutdown ${simulator.udid}`);
  }

  // 시뮬레이터 삭제
  deleteSimulator(simulator.udid);

  // 새 시뮬레이터 생성
  const deviceType = simulator.deviceTypeIdentifier || 'iPhone 15';
  const runtime = simulator.runtimeIdentifier || 'iOS-18-0';

  console.log(`\n새 시뮬레이터를 생성하려면 다음 명령을 사용하세요:`);
  console.log(`  xcrun simctl create "${simulator.name}" "${deviceType}" "${runtime}"`);
  console.log(`\n또는 Xcode에서 직접 생성할 수 있습니다.`);
}

main();
