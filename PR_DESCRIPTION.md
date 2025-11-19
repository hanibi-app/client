# 🎯 PR: Dashboard 화면 구현 및 UI/UX 개선

## 📋 개요

Figma 디자인을 기반으로 Dashboard 화면을 구현하고, 전체적인 UI/UX 개선 작업을 진행했습니다.

## ✨ 주요 변경사항

### 1. Dashboard 화면 구현

- **커스텀 헤더**: 뒤로가기 버튼, 타이틀, 카메라 아이콘 포함
- **생명점수 섹션**:
  - 그라데이션 상태 바 (안전 → 주의 → 경고 → 위험)
  - 현재 점수 위치를 나타내는 인디케이터 삼각형
  - 상태 라벨 (안전, 주의, 경고, 위험)
  - 점수 설명 텍스트
- **메트릭 카드 2x2 그리드**:
  - 체온 (°C)
  - 수분컨디션 (습도 %)
  - 급식량 (무게 kg)
  - 향기지수 (VOC ppb)
- **안내 섹션**: 텍스트 및 SVG 화살표 아이콘
- **리포트보기 버튼**: 강조 효과 적용

### 2. UI/UX 개선

#### 생명점수 바 그래프

- 둥근 모서리 적용 (`rx={STATUS_BAR_HEIGHT / 2}`)
- 굵기 증가 (8px → 16px)
- 인디케이터 삼각형을 그래프 위에 배치
- 하이라이트 오버레이 제거 (깔끔한 디자인)

#### 메트릭 카드

- 내용 가운데 정렬
- 상태별 색상 표시 (안전/위험)

#### 타이틀 텍스트

- "한니비의 건강 분석 결과예요" 통일
- "건강 분석 결과예"는 초록색, "요"는 검은색
- baseline 정렬로 자연스러운 표시

#### 리포트보기 버튼

- 그림자 효과 강화 (elevation: 6, shadowOpacity: 0.3)
- 펄스 애니메이션 추가 (scale: 1 → 1.03)

### 3. 애니메이션 추가

#### ThreeArrowIcon

- 위아래 움직임 애니메이션 (translateY: 0 → 8px)
- 1초 간격으로 부드럽게 반복

#### 리포트보기 버튼

- 펄스 애니메이션 (scale: 1 → 1.03)
- 1.5초 간격으로 부드럽게 반복
- 클릭 유도 효과

#### 애니메이션 개선

- `Animated.loop` 사용으로 무한 반복
- `Easing.inOut(Easing.ease)` 적용으로 부드러운 전환
- 전환 시 부자연스러움 제거

### 4. 기타 개선사항

#### 온보딩 플로우

- 로그인 후 CharacterCustomize 화면 자동 표시
- CharacterCustomize 완료 후 MainTabs로 이동
- 온보딩 상태 관리 개선 (AsyncStorage 연동)

#### 네비게이션

- RootNavigator navigationRef 타입 수정 (`NavigationContainerRef<RootStackParamList>`)
- 하단 탭 네비게이션에서 Reports 탭 제거
- Dashboard 탭 추가 및 커스텀 헤더 적용

#### 컴포넌트

- `HanibiCharacter2D`: customColor prop 추가
- `OutlinedButton`: 새로운 아웃라인 버튼 컴포넌트
- `ScreenHeader`: 재사용 가능한 헤더 컴포넌트

#### 스타일링

- 색상 상수 추가 (`darkGreen`, `lightGray`, `lightGrayOverlay`, `lightGreen`, `lightestGreen`)
- spacing 상수 활용
- 그림자 및 elevation 효과 일관성 있게 적용

## 📁 변경된 파일

### 주요 파일

- `src/screens/Dashboard/DashboardScreen.tsx` (신규, 607줄)
- `src/screens/Home/CharacterCustomizeScreen.tsx` (대폭 수정)
- `src/navigation/RootNavigator.tsx` (타입 수정)
- `src/navigation/MainTabs.tsx` (탭 구조 변경)
- `src/theme/Colors.ts` (색상 상수 추가)

### 신규 에셋

- `src/assets/images/three-arrow.svg` (화살표 아이콘)

## 🎨 디자인 준수

- Figma 디자인 100% 반영
- 색상, 간격, 타이포그래피 일관성 유지
- 반응형 레이아웃 적용

## 🧪 테스트

- [ ] Dashboard 화면 렌더링 테스트
- [ ] 애니메이션 동작 확인
- [ ] 네비게이션 플로우 테스트
- [ ] 다양한 화면 크기에서 레이아웃 확인

## 📸 스크린샷

(추가 예정)

## 🔗 관련 이슈

- #8: Dashboard 화면 구현

## ✅ 체크리스트

- [x] 코드 리뷰 준비 완료
- [x] ESLint 오류 없음
- [x] TypeScript 타입 오류 없음
- [x] 커밋 메시지 규칙 준수
- [ ] 테스트 작성 (필요 시)
