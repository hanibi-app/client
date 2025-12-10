/**
 * 홈 화면 메시지 템플릿
 * 센서 데이터(온도, 습도, 무게, VOC)에 따른 다양한 메시지를 제공합니다.
 */

import React from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { SensorStatus } from '@/features/dashboard/utils/healthScore';
import {
  getGasStatus,
  getHumidityStatus,
  getTemperatureStatus,
} from '@/features/dashboard/utils/healthScore';

/**
 * 센서 데이터 타입
 */
export interface SensorData {
  temperature: number | null;
  humidity: number | null;
  weight: number | null;
  gas: number | null;
}

/**
 * 메시지 템플릿 타입
 */
export interface MessageTemplate {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
}

/**
 * 온도 관련 메시지 템플릿
 */
const TEMPERATURE_MESSAGES: Record<SensorStatus, MessageTemplate[]> = {
  SAFE: [
    {
      title: '온도가 적당해요! 😊',
      description: '현재 온도가 쾌적한 상태예요',
      icon: 'ac-unit',
      iconColor: '#4CAF50',
    },
    {
      title: '시원한 온도네요! ❄️',
      description: '온도가 적절하게 유지되고 있어요',
      icon: 'ac-unit',
      iconColor: '#2196F3',
    },
    {
      title: '온도 상태가 좋아요! 👍',
      description: '현재 온도는 정상 범위예요',
      icon: 'thermostat',
      iconColor: '#4CAF50',
    },
  ],
  CAUTION: [
    {
      title: '온도가 조금 높아요 🌡️',
      description: '온도를 확인해주세요',
      icon: 'thermostat',
      iconColor: '#FFA726',
    },
    {
      title: '온도가 올라가고 있어요',
      description: '온도 모니터링이 필요해요',
      icon: 'trending-up',
      iconColor: '#FFA726',
    },
    {
      title: '온도 주의가 필요해요',
      description: '온도가 적정 범위를 벗어났어요',
      icon: 'warning',
      iconColor: '#FFA726',
    },
  ],
  WARNING: [
    {
      title: '너무 더워서 힘들어요 😩',
      description: '온도가 너무 높아요! 확인이 필요해요',
      icon: 'local-fire-department',
      iconColor: '#FF6B35',
    },
    {
      title: '온도가 위험 수준이에요! 🔥',
      description: '온도를 즉시 확인해주세요',
      icon: 'local-fire-department',
      iconColor: '#ED5B5B',
    },
    {
      title: '온도가 비정상적으로 높아요',
      description: '긴급 조치가 필요할 수 있어요',
      icon: 'error',
      iconColor: '#ED5B5B',
    },
    {
      title: '온도가 계속 올라가고 있어요',
      description: '온도 한 번만 확인해 주세요!',
      icon: 'trending-up',
      iconColor: '#FF6B35',
    },
  ],
};

/**
 * 습도 관련 메시지 템플릿
 */
const HUMIDITY_MESSAGES: Record<SensorStatus, MessageTemplate[]> = {
  SAFE: [
    {
      title: '습도가 적당해요! 💧',
      description: '현재 습도는 정상 범위예요',
      icon: 'water-drop',
      iconColor: '#4CAF50',
    },
    {
      title: '습도 상태가 좋아요',
      description: '적절한 습도가 유지되고 있어요',
      icon: 'opacity',
      iconColor: '#2196F3',
    },
  ],
  CAUTION: [
    {
      title: '습도가 조금 높아요',
      description: '습도 모니터링이 필요해요',
      icon: 'opacity',
      iconColor: '#FFA726',
    },
    {
      title: '습도 주의가 필요해요',
      description: '습도가 적정 범위를 벗어났어요',
      icon: 'warning',
      iconColor: '#FFA726',
    },
  ],
  WARNING: [
    {
      title: '습도가 너무 높아요! 💦',
      description: '습도 확인이 필요해요',
      icon: 'water-drop',
      iconColor: '#FF6B35',
    },
    {
      title: '습도가 위험 수준이에요',
      description: '습도를 즉시 확인해주세요',
      icon: 'error',
      iconColor: '#ED5B5B',
    },
  ],
};

/**
 * 무게 관련 메시지 템플릿
 */
const WEIGHT_MESSAGES: Record<string, MessageTemplate[]> = {
  EMPTY: [
    {
      title: '비어있어요 🍽️',
      description: '음식물을 투입할 준비가 되었어요',
      icon: 'restaurant',
      iconColor: '#4CAF50',
    },
    {
      title: '투입 대기 중이에요',
      description: '음식물을 넣어주세요',
      icon: 'add-circle',
      iconColor: '#2196F3',
    },
  ],
  LIGHT: [
    {
      title: '가벼운 무게예요',
      description: '적은 양의 음식물이 있어요',
      icon: 'restaurant',
      iconColor: '#4CAF50',
    },
  ],
  MEDIUM: [
    {
      title: '적당한 무게예요',
      description: '무게가 정상 범위예요',
      icon: 'scale',
      iconColor: '#4CAF50',
    },
  ],
  HEAVY: [
    {
      title: '무게가 많이 쌓였어요! ⚖️',
      description: '처리가 필요할 수 있어요',
      icon: 'scale',
      iconColor: '#FFA726',
    },
    {
      title: '무게가 많이 늘었어요',
      description: '무게를 확인해주세요',
      icon: 'warning',
      iconColor: '#FFA726',
    },
  ],
  CRITICAL: [
    {
      title: '무게가 너무 많이 쌓였어요!',
      description: '즉시 처리가 필요해요',
      icon: 'error',
      iconColor: '#ED5B5B',
    },
  ],
};

/**
 * VOC(가스) 관련 메시지 템플릿
 */
const VOC_MESSAGES: Record<SensorStatus, MessageTemplate[]> = {
  SAFE: [
    {
      title: '공기 상태가 좋아요! 🌬️',
      description: 'VOC 수치가 정상 범위예요',
      icon: 'air',
      iconColor: '#4CAF50',
    },
    {
      title: '향기지수가 안전해요',
      description: '현재 공기질이 양호해요',
      icon: 'spa',
      iconColor: '#4CAF50',
    },
  ],
  CAUTION: [
    {
      title: '공기질 주의가 필요해요',
      description: 'VOC 수치가 조금 높아요',
      icon: 'air',
      iconColor: '#FFA726',
    },
    {
      title: '향기지수를 확인해주세요',
      description: '공기질 모니터링이 필요해요',
      icon: 'warning',
      iconColor: '#FFA726',
    },
  ],
  WARNING: [
    {
      title: '공기질이 나빠졌어요! 😷',
      description: 'VOC 수치가 높아요. 확인이 필요해요',
      icon: 'air',
      iconColor: '#FF6B35',
    },
    {
      title: '향기지수가 위험 수준이에요',
      description: '공기질을 즉시 확인해주세요',
      icon: 'error',
      iconColor: '#ED5B5B',
    },
    {
      title: '냄새가 심해지고 있어요',
      description: 'VOC 수치가 비정상적으로 높아요',
      icon: 'air',
      iconColor: '#ED5B5B',
    },
  ],
};

/**
 * 무게 상태를 판단합니다
 */
function getWeightStatus(weight: number | null): string {
  if (weight === null || weight === undefined || weight <= 0) {
    return 'EMPTY';
  }
  if (weight <= 1000) {
    // 1kg 이하
    return 'LIGHT';
  }
  if (weight <= 2000) {
    // 1~2kg
    return 'MEDIUM';
  }
  if (weight <= 3000) {
    // 2~3kg
    return 'HEAVY';
  }
  // 3kg 이상
  return 'CRITICAL';
}

/**
 * 배열에서 랜덤하게 하나를 선택합니다
 */
function getRandomMessage(messages: MessageTemplate[]): MessageTemplate {
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * 센서 데이터에 따른 메시지를 생성합니다
 * 우선순위: 온도 > 습도 > VOC > 무게
 */
export function generateHomeMessage(sensorData: SensorData | null): MessageTemplate | null {
  if (!sensorData) {
    return null;
  }

  const { temperature, humidity, weight, gas } = sensorData;

  // 온도 우선 (가장 중요)
  if (temperature !== null && temperature !== undefined) {
    const tempStatus = getTemperatureStatus(temperature);
    const messages = TEMPERATURE_MESSAGES[tempStatus];
    if (messages && messages.length > 0) {
      return getRandomMessage(messages);
    }
  }

  // 습도
  if (humidity !== null && humidity !== undefined) {
    const humidityStatus = getHumidityStatus(humidity);
    const messages = HUMIDITY_MESSAGES[humidityStatus];
    if (messages && messages.length > 0) {
      return getRandomMessage(messages);
    }
  }

  // VOC
  if (gas !== null && gas !== undefined) {
    const gasStatus = getGasStatus(gas);
    const messages = VOC_MESSAGES[gasStatus];
    if (messages && messages.length > 0) {
      return getRandomMessage(messages);
    }
  }

  // 무게
  if (weight !== null && weight !== undefined) {
    const weightStatus = getWeightStatus(weight);
    const messages = WEIGHT_MESSAGES[weightStatus];
    if (messages && messages.length > 0) {
      return getRandomMessage(messages);
    }
  }

  return null;
}

/**
 * 특정 센서 타입에 따른 메시지를 생성합니다
 */
export function generateSensorMessage(
  type: 'temperature' | 'humidity' | 'weight' | 'gas',
  value: number | null,
): MessageTemplate | null {
  if (value === null || value === undefined) {
    return null;
  }

  switch (type) {
    case 'temperature': {
      const status = getTemperatureStatus(value);
      const messages = TEMPERATURE_MESSAGES[status];
      return messages && messages.length > 0 ? getRandomMessage(messages) : null;
    }
    case 'humidity': {
      const status = getHumidityStatus(value);
      const messages = HUMIDITY_MESSAGES[status];
      return messages && messages.length > 0 ? getRandomMessage(messages) : null;
    }
    case 'gas': {
      const status = getGasStatus(value);
      const messages = VOC_MESSAGES[status];
      return messages && messages.length > 0 ? getRandomMessage(messages) : null;
    }
    case 'weight': {
      const status = getWeightStatus(value);
      const messages = WEIGHT_MESSAGES[status];
      return messages && messages.length > 0 ? getRandomMessage(messages) : null;
    }
    default:
      return null;
  }
}

/**
 * 모든 메시지 템플릿을 내보냅니다 (테스트/디버깅용)
 */
export const ALL_MESSAGES = {
  temperature: TEMPERATURE_MESSAGES,
  humidity: HUMIDITY_MESSAGES,
  weight: WEIGHT_MESSAGES,
  voc: VOC_MESSAGES,
};
