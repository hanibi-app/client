# 개발 가이드

## 📋 커밋 컨벤션

### 형식

```
<type>(#<issueNumber>): <description>
```

### 타입 목록

| 타입       | 설명              | 예시                                |
| ---------- | ----------------- | ----------------------------------- |
| `feat`     | 새로운 기능       | `feat(#4): add user authentication` |
| `fix`      | 버그 수정         | `fix(#5): resolve navigation bug`   |
| `refactor` | 코드 구조 개선    | `refactor(#6): optimize component`  |
| `chore`    | 설정/환경 변경    | `chore(#7): update dependencies`    |
| `docs`     | 문서 수정         | `docs(#8): update README`           |
| `perf`     | 성능 개선         | `perf(#9): optimize rendering`      |
| `test`     | 테스트 추가/수정  | `test(#10): add unit tests`         |
| `ci`       | CI/CD 관련        | `ci(#11): setup GitHub Actions`     |
| `build`    | 빌드 관련         | `build(#12): update webpack config` |
| `revert`   | 변경사항 되돌리기 | `revert(#13): remove feature X`     |

### 규칙

- **이슈 번호 필수**: `#숫자` 형식으로 반드시 포함
- **소문자 사용**: 제목은 소문자로 작성
- **마침표 금지**: 제목 끝에 마침표 사용 금지
- **길이 제한**: 최대 100자

### 예시

```bash
# ✅ 올바른 커밋 메시지
feat(#4): add user authentication
fix(#123): resolve navigation bug
chore(#5): update dependencies

# ❌ 잘못된 커밋 메시지
feat: add feature                    # 이슈 번호 누락
feat(#ABC): add feature             # 잘못된 이슈 번호 형식
Feat(#4): Add Feature               # 대문자 사용
feat(#4): add feature.              # 마침표 사용
```

## 🔧 코드 품질 관리

### ESLint & Prettier

- **자동 검사**: 커밋 전 자동으로 ESLint와 Prettier 실행
- **자동 수정**: ESLint 오류는 자동 수정, Prettier는 자동 포맷팅
- **검사 명령어**:
  ```bash
  npm run lint        # ESLint 검사
  npm run lint:fix     # ESLint 자동 수정
  npm run format       # Prettier 검사
  npm run format:write # Prettier 자동 포맷팅
  ```

### Husky 훅

- **Pre-commit**: 코드 품질 검사 (ESLint + Prettier)
- **Commit-msg**: 커밋 메시지 형식 검증
- **실패 시**: 커밋이 차단되고 수정 요구

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/           # 디자인 시스템 (atoms, molecules)
│   └── common/       # 공용 컴포넌트
├── constants/        # 색상, 상수, enum, 라우트명
├── navigation/       # 네비게이터 (Root, Tabs)
├── screens/         # 화면 단위 컴포넌트
├── services/        # API 클라이언트, SDK 연동
├── store/           # 상태관리
├── theme/           # 테마 토큰/프로바이더
├── types/           # 공용 타입
└── utils/           # 순수 함수, 헬퍼
```

## 🎨 스타일링 가이드

### 테마 토큰 사용

- **색상**: `src/theme/Colors.ts`의 토큰 사용
- **간격**: `src/theme/spacing.ts`의 토큰 사용
- **타이포**: `src/theme/typography.ts`의 토큰 사용

### 컴포넌트 스타일

- **StyleSheet 사용**: 인라인 스타일 금지
- **테마 기반**: 하드코딩된 색상/값 금지
- **접근성**: `accessibilityLabel`, `accessibilityRole` 등 필수

## 🧪 테스트

### 테스트 파일 위치

- `src/components/**/__tests__/ComponentName.test.tsx`
- `src/utils/__tests__/utilName.test.ts`

### 테스트 명령어

```bash
npm test              # 전체 테스트 실행
npm test -- --watch   # 감시 모드
```

## 🚀 개발 워크플로우

1. **브랜치 생성**: `feature/#이슈번호-설명`
2. **개발**: 기능 구현 및 테스트
3. **커밋**: `feat(#이슈번호): 설명` 형식으로 커밋
4. **푸시**: 원격 저장소에 푸시
5. **PR 생성**: Pull Request 생성 및 리뷰
6. **머지**: 승인 후 main 브랜치에 머지

## 📝 추가 리소스

- [공용 컴포넌트 가이드](./src/components/common/README.md)
- [프로젝트 컨벤션](./PROJECT_CONVENTIONS.md)
