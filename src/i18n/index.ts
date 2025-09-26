/**
 * 국제화 (i18n) 설정
 *
 * 이 파일은 앱의 다국어 지원을 관리합니다.
 */

// 지원 언어
export const SUPPORTED_LANGUAGES = ['ko', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// 기본 언어
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko';

// 번역 리소스
export const translations = {
  ko: {
    welcome: {
      title: '지금부터 음식물 쓰레기 고민 STOP!',
      subtitle: '한니비와 함께 음식물 쓰레기 고민 해결해 봐요',
      startWithKakao: '카카오로 시작하기',
      customizeCharacter: '캐릭터 꾸미기',
      dashboard: '대시보드',
    },
    common: {
      confirm: '확인',
      cancel: '취소',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      back: '뒤로',
      next: '다음',
      previous: '이전',
    },
  },
  en: {
    welcome: {
      title: 'Stop worrying about food waste now!',
      subtitle: 'Solve your food waste worries with Hanibi',
      startWithKakao: 'Start with Kakao',
      customizeCharacter: 'Customize Character',
      dashboard: 'Dashboard',
    },
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
  },
} as const;

// 번역 함수
export const t = (key: string, language: SupportedLanguage = DEFAULT_LANGUAGE): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

// 언어 변경 함수
export const changeLanguage = (language: SupportedLanguage): void => {
  // TODO: 언어 변경 로직 구현
  console.log(`Language changed to: ${language}`);
};
