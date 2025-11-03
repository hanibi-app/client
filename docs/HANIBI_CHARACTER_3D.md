# 한니비 3D 캐릭터 구현 가이드

## 🎨 개요

한니비(Hanibi)는 온습도 모니터링 앱의 마스코트 캐릭터입니다. Three.js와 Expo GL을 활용하여 React Native에서 3D로 구현되었습니다.

## ✨ 캐릭터 디자인

### 외형
- **모양**: 물방울 형태의 귀여운 캐릭터
- **얼굴**: 둥근 눈, 미소 짓는 입, 볼터치
- **색상**: 환경 상태(low/medium/high)에 따라 변화

### 색상 체계

| 상태 | 색상 | 의미 |
|------|------|------|
| **Low** | 파란색 (#60a5fa) | 쾌적한 환경 😊 |
| **Medium** | 주황색 (#f59e0b) | 보통 환경 😐 |
| **High** | 빨간색 (#ef4444) | 주의 필요 😰 |

## 🎬 애니메이션

한니비는 다음과 같은 부드러운 애니메이션을 제공합니다:

1. **회전 애니메이션**: 좌우로 부드럽게 회전
2. **호흡 효과**: 크기가 미세하게 변화 (살아있는 느낌)
3. **상하 움직임**: 공중에 떠있는 듯한 효과

## 🛠 기술 스택

### 의존성 패키지
```json
{
  "expo-gl": "^latest",
  "three": "^0.160.0",
  "expo-three": "^latest"
}
```

### 구현 기술
- **Three.js**: 3D 그래픽 렌더링
- **Expo GL**: React Native에서 WebGL 컨텍스트 제공
- **React Native Animated API**: 부드러운 애니메이션

## 📦 컴포넌트 사용법

### 기본 사용

```tsx
import HanibiCharacter3D from '@/components/common/HanibiCharacter3D';

function MyScreen() {
  return (
    <HanibiCharacter3D 
      level="medium"
      animated={true}
      size={300}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `'low' \| 'medium' \| 'high'` | `'medium'` | 환경 상태 레벨 |
| `animated` | `boolean` | `true` | 애니메이션 활성화 여부 |
| `size` | `number` | `200` | 캐릭터 크기 (px) |
| `testID` | `string` | `'hanibi-character-3d'` | 테스트 ID |

## 🎯 3D 모델 상세

### 구성 요소

```typescript
createHanibiCharacter(color: string): THREE.Group {
  // 1. 메인 바디 (물방울 모양)
  - SphereGeometry를 변형하여 물방울 형태 생성
  - Phong Material로 빛 반사 효과 추가
  
  // 2. 눈 (좌우)
  - 검은색 구체 2개
  - 흰색 하이라이트로 생동감 추가
  
  // 3. 미소
  - QuadraticBezierCurve3로 곡선 생성
  - Line으로 렌더링
  
  // 4. 볼터치 (좌우)
  - 반투명 분홍색 구체
  - 귀여움 강조
}
```

### 조명 설정

```typescript
// 주변광 (Ambient Light)
- 밝기: 0.6
- 전체적으로 고른 조명 제공

// 방향광 (Directional Light)
- 밝기: 0.8
- 위치: (5, 10, 7.5)
- 입체감 강조
```

## 🎨 디자인 철학

1. **친근함**: 물방울 모양으로 부드럽고 친근한 이미지
2. **직관성**: 색상으로 즉시 상태 파악 가능
3. **생동감**: 애니메이션으로 살아있는 느낌 전달
4. **간결함**: 복잡하지 않은 디자인으로 성능 최적화

## 🚀 향후 개선 사항

### 단기
- [ ] 다양한 표정 추가 (슬픔, 기쁨, 놀람 등)
- [ ] 터치 인터랙션 (클릭 시 반응)
- [ ] 파티클 이펙트 (물방울 효과)

### 중기
- [ ] 3D 모델 파일(.glb/.gltf) 로딩 지원
- [ ] 캐릭터 커스터마이징 (색상, 액세서리)
- [ ] 음성 효과 추가

### 장기
- [ ] AR 모드 지원 (카메라로 실제 환경에 배치)
- [ ] 여러 캐릭터 추가 (한니비 친구들)
- [ ] 애니메이션 라이브러리 확장

## 🧪 테스트

### 수동 테스트 체크리스트

- [ ] 3D 캐릭터가 정상적으로 렌더링되는가?
- [ ] 레벨 변경 시 색상이 즉시 변경되는가?
- [ ] 애니메이션이 부드럽게 작동하는가?
- [ ] 다양한 화면 크기에서 정상 작동하는가?
- [ ] 메모리 누수가 없는가? (장시간 실행)

### 성능 고려사항

- **타겟 FPS**: 60fps
- **폴리곤 수**: ~2,000 polygons (최적화됨)
- **텍스처**: 프로시저럴 생성 (메모리 효율)
- **애니메이션**: requestAnimationFrame 활용

## 📱 플랫폼 지원

| 플랫폼 | 지원 | 비고 |
|--------|------|------|
| iOS | ✅ | 완벽 지원 |
| Android | ✅ | 완벽 지원 |
| Web | ⚠️ | Expo GL 제약 있음 |

## 🎓 학습 자료

- [Three.js 공식 문서](https://threejs.org/docs/)
- [Expo GL 가이드](https://docs.expo.dev/versions/latest/sdk/gl-view/)
- [React Native 3D 튜토리얼](https://docs.expo.dev/develop/user-interface/three-js/)

## 📄 라이선스

MIT License - 자유롭게 사용 가능

---

**제작**: Hanibi Development Team  
**버전**: 1.0.0  
**최종 수정**: 2025-11-03

