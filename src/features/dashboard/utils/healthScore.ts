/**
 * 건강 점수 계산 유틸리티
 * 센서 데이터를 기반으로 건강 점수와 상태를 계산합니다.
 *
 * TODO: 임계값/점수 로직은 도메인 담당과 논의 후 조정 필요
 */

/**
 * 센서 상태 타입
 */
export type SensorStatus = 'SAFE' | 'CAUTION' | 'WARNING';

/**
 * 건강 점수 계산 결과
 */
export type HealthScoreResult = {
  score: number; // 0~40
  level: 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL';
};

/**
 * 온도 상태를 계산합니다.
 *
 * @param temp 온도 (°C)
 * @returns 센서 상태
 */
export function getTemperatureStatus(temp: number): SensorStatus {
  // TODO: 임계값/점수 로직은 도메인 담당과 논의 후 조정 필요
  if (temp >= 20 && temp <= 30) {
    return 'SAFE';
  }
  if (temp > 30 && temp <= 35) {
    return 'CAUTION';
  }
  return 'WARNING';
}

/**
 * 습도 상태를 계산합니다.
 *
 * @param humidity 습도 (%)
 * @returns 센서 상태
 */
export function getHumidityStatus(humidity: number): SensorStatus {
  // TODO: 임계값/점수 로직은 도메인 담당과 논의 후 조정 필요
  if (humidity >= 40 && humidity <= 60) {
    return 'SAFE';
  }
  if ((humidity >= 30 && humidity < 40) || (humidity > 60 && humidity <= 70)) {
    return 'CAUTION';
  }
  return 'WARNING';
}

/**
 * 가스(VOC) 상태를 계산합니다.
 *
 * @param gas 가스 값 (ppb)
 * @returns 센서 상태
 */
export function getGasStatus(gas: number): SensorStatus {
  // TODO: 임계값/점수 로직은 도메인 담당과 논의 후 조정 필요
  if (gas >= 0 && gas <= 200) {
    return 'SAFE';
  }
  if (gas > 200 && gas <= 400) {
    return 'CAUTION';
  }
  return 'WARNING';
}

/**
 * 센서 상태에 따른 점수를 계산합니다.
 *
 * @param status 센서 상태
 * @returns 점수 (0~10)
 */
function getStatusScore(status: SensorStatus): number {
  switch (status) {
    case 'SAFE':
      return 10;
    case 'CAUTION':
      return 5;
    case 'WARNING':
      return 0;
    default:
      return 0;
  }
}

/**
 * 건강 점수를 계산합니다.
 * 각 센서별 점수(0~10점)를 합산하여 총점(0~40점)을 구하고,
 * 총점에 따라 건강 상태 레벨을 결정합니다.
 *
 * @param params 센서 데이터
 * @returns 건강 점수 결과
 */
export function calculateHealthScore(params: {
  temperature: number;
  humidity: number;
  weight: number;
  gas: number;
}): HealthScoreResult {
  // TODO: 임계값/점수 로직은 도메인 담당과 논의 후 조정 필요

  const tempStatus = getTemperatureStatus(params.temperature);
  const humidityStatus = getHumidityStatus(params.humidity);
  const gasStatus = getGasStatus(params.gas);

  // 무게는 급식량이 0보다 크면 SAFE, 아니면 WARNING
  const weightStatus: SensorStatus = params.weight > 0 ? 'SAFE' : 'WARNING';

  const tempScore = getStatusScore(tempStatus);
  const humidityScore = getStatusScore(humidityStatus);
  const weightScore = getStatusScore(weightStatus);
  const gasScore = getStatusScore(gasStatus);

  const totalScore = tempScore + humidityScore + weightScore + gasScore;

  // 총점에 따른 레벨 결정
  let level: 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL';
  if (totalScore >= 30) {
    level = 'SAFE';
  } else if (totalScore >= 20) {
    level = 'CAUTION';
  } else if (totalScore >= 10) {
    level = 'WARNING';
  } else {
    level = 'CRITICAL';
  }

  return {
    score: totalScore,
    level,
  };
}
