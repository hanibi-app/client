# 🎨 한니비 3D 캐릭터 - 빠른 시작 가이드

## ✅ 구현 완료!

feat/8-character 브랜치에 3D 한니비 캐릭터가 성공적으로 구현되었습니다.

## 🚀 실행 방법

### 1. 개발 서버 시작

```bash
npm start
```

### 2. 앱 실행

Expo Go 앱을 사용하거나, 시뮬레이터에서 실행:

```bash
# iOS
npm run ios

# Android  
npm run android

# Web (테스트용)
npm run web
```

### 3. TabOne 화면 확인

앱을 실행하면 **Tab One** 화면에서 3D 한니비 캐릭터를 볼 수 있습니다!

## 🎯 구현 내용

### ✨ 새로 추가된 파일

1. **`src/components/common/HanibiCharacter3D.tsx`**
   - Three.js 기반 3D 캐릭터 컴포넌트
   - 물방울 모양의 귀여운 디자인
   - 부드러운 애니메이션 (회전, 호흡, 상하 움직임)
   - 레벨별 색상 변경 (low/medium/high)

2. **`docs/HANIBI_CHARACTER_3D.md`**
   - 3D 캐릭터 상세 문서
   - 디자인 철학, 기술 스택, 사용법 등

3. **`src/screens/TabOneScreen.tsx` (수정)**
   - 3D 캐릭터를 표시하는 데모 화면
   - 레벨 변경 버튼으로 상태 테스트 가능

### 📦 설치된 패키지

```json
{
  "expo-gl": "최신 버전",
  "three": "^0.160.0",
  "expo-three": "최신 버전"
}
```

### 🔧 수정된 설정

- **`app.json`**: `web.output`을 `"static"`에서 `"single"`로 변경
  - React Native 앱에 맞게 설정 최적화
  - expo-router 불필요

## 🎨 캐릭터 특징

### 디자인
- **모양**: 물방울 형태 (온습도와 연관)
- **표정**: 큰 눈, 미소, 볼터치
- **색상**: 환경 상태에 따라 변화

### 상태별 색상
- 🟦 **Low (쾌적)**: 파란색 - 시원하고 쾌적한 환경
- 🟧 **Medium (보통)**: 주황색 - 보통 환경
- 🟥 **High (주의)**: 빨간색 - 주의가 필요한 환경

### 애니메이션
- ↻ 좌우 회전
- ↕ 상하 움직임 (떠있는 효과)
- 🫁 호흡 효과 (크기 변화)

## 🎮 사용 예시

```tsx
import HanibiCharacter3D from '@/components/common/HanibiCharacter3D';

function MyScreen() {
  return (
    <HanibiCharacter3D 
      level="medium"      // 'low' | 'medium' | 'high'
      animated={true}     // 애니메이션 활성화
      size={300}          // 크기 (픽셀)
    />
  );
}
```

## 📱 테스트 방법

### TabOne 화면에서 테스트
1. 앱 실행 후 **Tab One** 선택
2. 3D 한니비 캐릭터 확인
3. 버튼으로 레벨 변경 (쾌적/보통/주의)
4. 색상 변화와 애니메이션 확인

### 기능 체크리스트
- [x] 3D 캐릭터가 정상적으로 렌더링됨
- [x] 레벨 변경 시 색상이 즉시 변경됨
- [x] 애니메이션이 부드럽게 작동함
- [x] iOS/Android 모두 지원
- [x] TypeScript 타입 안정성 확보

## 🔍 다음 단계

### 즉시 가능
- [ ] 다른 화면에 3D 캐릭터 추가
- [ ] 실제 온습도 데이터와 연동
- [ ] 터치 인터랙션 추가

### 향후 계획
- [ ] 다양한 표정 추가 (슬픔, 기쁨, 놀람)
- [ ] 파티클 이펙트 (물방울)
- [ ] AR 모드 지원
- [ ] 3D 모델 파일(.glb) 로딩

## 📚 참고 문서

- [상세 가이드](./docs/HANIBI_CHARACTER_3D.md)
- [Three.js 문서](https://threejs.org/docs/)
- [Expo GL](https://docs.expo.dev/versions/latest/sdk/gl-view/)

## 🎉 완료!

이제 한니비 캐릭터가 앱에서 살아 움직입니다! 🎊

---

**브랜치**: `feat/8-character`  
**제작일**: 2025-11-03

