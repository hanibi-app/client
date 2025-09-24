/**
 * 한니비 앱 디자인 시스템 - 스페이싱
 * 
 * 이 파일은 앱에서 사용되는 모든 간격과 여백을 정의합니다.
 * 8px 그리드 시스템을 기반으로 일관된 간격을 제공합니다.
 */

// 기본 스페이싱 단위 (8px 그리드 시스템)
export const SpacingUnit = 8;

// 스페이싱 값 정의
export const Spacing = {
  // 기본 간격
  none: 0,
  xs: SpacingUnit * 0.5,      // 4px
  sm: SpacingUnit,             // 8px
  md: SpacingUnit * 1.5,      // 12px
  lg: SpacingUnit * 2,        // 16px
  xl: SpacingUnit * 3,        // 24px
  xxl: SpacingUnit * 4,       // 32px
  xxxl: SpacingUnit * 6,      // 48px
  
  // 특수 간격
  tiny: 2,                     // 2px - 매우 작은 간격
  huge: SpacingUnit * 8,      // 64px - 매우 큰 간격
  massive: SpacingUnit * 12,  // 96px - 거대한 간격
};

// 컴포넌트별 스페이싱
export const ComponentSpacing = {
  // 카드
  card: {
    padding: Spacing.lg,
    margin: Spacing.md,
    borderRadius: Spacing.sm,
    gap: Spacing.md,
  },
  
  // 버튼
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    margin: Spacing.sm,
    borderRadius: Spacing.sm,
  },
  
  // 입력 필드
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    margin: Spacing.sm,
    borderRadius: Spacing.sm,
  },
  
  // 리스트 아이템
  listItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
  },
  
  // 섹션
  section: {
    padding: Spacing.xl,
    margin: Spacing.md,
    gap: Spacing.lg,
  },
  
  // 헤더
  header: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  
  // 푸터
  footer: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
};

// 레이아웃 스페이싱
export const LayoutSpacing = {
  // 화면 여백
  screen: {
    padding: Spacing.lg,
    margin: 0,
  },
  
  // 컨테이너
  container: {
    padding: Spacing.xl,
    margin: Spacing.md,
    maxWidth: 1200, // 웹용 최대 너비
  },
  
  // 그리드
  grid: {
    gap: Spacing.lg,
    columnGap: Spacing.md,
    rowGap: Spacing.lg,
  },
  
  // 플렉스박스
  flex: {
    gap: Spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// 아이콘과 텍스트 간격
export const IconSpacing = {
  // 아이콘과 텍스트 사이
  iconText: Spacing.sm,
  
  // 아이콘들 사이
  iconIcon: Spacing.xs,
  
  // 버튼 내부 아이콘
  buttonIcon: Spacing.sm,
};

// 애니메이션 관련 스페이싱
export const AnimationSpacing = {
  // 페이드 인/아웃
  fade: {
    duration: 300,
    delay: 100,
  },
  
  // 슬라이드
  slide: {
    duration: 250,
    delay: 50,
  },
  
  // 스케일
  scale: {
    duration: 200,
    delay: 0,
  },
};

// 스페이싱 유틸리티 함수
export const SpacingUtils = {
  // 스페이싱 값 계산
  multiply: (base: number, multiplier: number) => base * multiplier,
  
  // 반응형 스페이싱 (화면 크기에 따라 조절)
  responsive: (base: number, scale: number = 1) => base * scale,
  
  // 스페이싱 배열 생성
  createArray: (...values: number[]) => values,
  
  // 조건부 스페이싱
  conditional: (condition: boolean, trueValue: number, falseValue: number = 0) =>
    condition ? trueValue : falseValue,
  
  // 스페이싱 범위 생성
  range: (start: number, end: number, step: number = SpacingUnit) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  },
};

// 스페이싱 상수
export const SpacingConstants = {
  // 최소 터치 영역 (iOS/Android 가이드라인)
  minTouchArea: 44,
  
  // 최소 텍스트 간격
  minTextSpacing: Spacing.xs,
  
  // 최대 카드 너비
  maxCardWidth: 400,
  
  // 최소 버튼 높이
  minButtonHeight: 44,
  
  // 최대 모달 너비
  maxModalWidth: 500,
};

export default Spacing;

