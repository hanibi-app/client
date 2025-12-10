/**
 * Intent Preset 정의
 * 각 Intent에 대한 기본 설정과 메타데이터를 정의합니다.
 */

import { ChatIntent, IntentPreset } from '@/types/chat';

/**
 * Intent Preset 카테고리 라벨
 */
export const CATEGORY_LABEL: Record<IntentPreset['category'], string> = {
  STATUS: '상태',
  SENSOR: '센서',
  HISTORY: '이력',
  REPORT: '리포트',
  SYSTEM: '시스템',
  HELP: '도움말',
};

/**
 * Intent Preset 배열
 * 카테고리별로 그룹화된 Intent 버튼 설정입니다.
 */
export const INTENT_PRESETS: IntentPreset[] = [
  {
    intent: 'STATUS_QUERY',
    label: '현재 상태',
    description: '기기 전체 상태 요약',
    defaultContent: '현재 기기 상태 알려줘',
    category: 'STATUS',
    icon: 'info-outline',
    buildMetadata: () => ({ intent: 'STATUS_QUERY' }),
  },
  {
    intent: 'TEMPERATURE_QUERY',
    label: '온도',
    description: '현재 내부 온도',
    defaultContent: '현재 온도가 몇 도야?',
    category: 'SENSOR',
    icon: 'thermostat',
    buildMetadata: () => ({ intent: 'TEMPERATURE_QUERY' }),
  },
  {
    intent: 'HUMIDITY_QUERY',
    label: '습도',
    description: '현재 내부 습도',
    defaultContent: '습도 알려줘',
    category: 'SENSOR',
    icon: 'water-drop',
    buildMetadata: () => ({ intent: 'HUMIDITY_QUERY' }),
  },
  {
    intent: 'WEIGHT_QUERY',
    label: '무게',
    description: '현재 무게 측정값',
    defaultContent: '현재 무게가 얼마야?',
    category: 'SENSOR',
    icon: 'scale',
    buildMetadata: () => ({ intent: 'WEIGHT_QUERY' }),
  },
  {
    intent: 'GAS_QUERY',
    label: '가스',
    description: '현재 가스 농도',
    defaultContent: '가스 농도 알려줘',
    category: 'SENSOR',
    icon: 'air',
    buildMetadata: () => ({ intent: 'GAS_QUERY' }),
  },
  {
    intent: 'PROCESSING_STATUS_QUERY',
    label: '처리 상태',
    description: '현재 처리 진행 상황',
    defaultContent: '처리 상태 알려줘',
    category: 'STATUS',
    icon: 'hourglass-empty',
    buildMetadata: () => ({ intent: 'PROCESSING_STATUS_QUERY' }),
  },
  {
    intent: 'HISTORY_QUERY',
    label: '오늘 처리량',
    description: '오늘 처리한 양',
    defaultContent: '오늘 처리한 양 알려줘',
    category: 'HISTORY',
    icon: 'today',
    buildMetadata: () => ({
      intent: 'HISTORY_QUERY',
      period: 'TODAY',
    }),
  },
  {
    intent: 'HISTORY_QUERY',
    label: '지난 주 데이터',
    description: '지난 주 온도와 습도',
    defaultContent: '지난 주 온도와 습도 데이터 보여줘',
    category: 'HISTORY',
    icon: 'calendar-view-week',
    buildMetadata: () => ({
      intent: 'HISTORY_QUERY',
      context: {
        period: 'WEEKLY',
        sensors: ['temperature', 'humidity'],
      },
    }),
  },
  {
    intent: 'REPORT_QUERY',
    label: '주간 리포트',
    description: '이번 주 리포트',
    defaultContent: '이번 주 리포트 보여줘',
    category: 'REPORT',
    icon: 'assessment',
    buildMetadata: () => ({
      intent: 'REPORT_QUERY',
      period: 'WEEKLY',
    }),
  },
  {
    intent: 'ECO_SCORE_QUERY',
    label: '에코 스코어',
    description: '내 환경경 점수',
    defaultContent: '내 환경경 점수 알려줘',
    category: 'REPORT',
    icon: 'eco',
    buildMetadata: () => ({ intent: 'ECO_SCORE_QUERY' }),
  },
  {
    intent: 'RANKING_QUERY',
    label: '랭킹',
    description: '이번 주 랭킹',
    defaultContent: '이번 주 랭킹 보여줘',
    category: 'REPORT',
    icon: 'emoji-events',
    buildMetadata: () => ({ intent: 'RANKING_QUERY' }),
  },
  {
    intent: 'HELP_QUERY',
    label: '도움말',
    description: '사용법 안내',
    defaultContent: '사용법 알려줘',
    category: 'HELP',
    icon: 'help-outline',
    buildMetadata: () => ({ intent: 'HELP_QUERY' }),
  },
];

/**
 * 카테고리별로 그룹화된 Intent Presets
 */
export const getPresetsByCategory = (category: IntentPreset['category']): IntentPreset[] => {
  return INTENT_PRESETS.filter((preset) => preset.category === category);
};

/**
 * Intent로 Preset 찾기
 */
export const getPresetByIntent = (intent: ChatIntent): IntentPreset | undefined => {
  return INTENT_PRESETS.find((preset) => preset.intent === intent);
};
