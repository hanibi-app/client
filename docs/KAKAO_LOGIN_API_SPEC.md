# 카카오 로그인 API 스펙

프론트엔드에서 사용하는 카카오 로그인 API의 백엔드 구현 스펙입니다.

## 개요

카카오 로그인은 두 단계로 진행됩니다:

1. 프론트엔드에서 카카오 인증 코드를 받아옴
2. 백엔드에서 카카오 인증 코드를 액세스 토큰으로 교환하고, 사용자 정보를 가져와서 우리 서비스의 JWT 토큰을 발급

## 필요한 환경 변수

백엔드 `.env` 파일에 다음 변수들이 필요합니다:

```env
# 카카오 앱 설정
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
KAKAO_REDIRECT_URI=hanibi://kakao-login  # 또는 웹의 경우 https://yourdomain.com/kakao/callback

# JWT 토큰 설정 (기존과 동일)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

## API 엔드포인트

### 1. 카카오 인증 코드 → 액세스 토큰 교환

**엔드포인트**: `POST /api/v1/auth/kakao/token`

**요청 본문**:

```json
{
  "code": "카카오에서 받은 인증 코드"
}
```

**성공 응답** (200):

```json
{
  "accessToken": "카카오 액세스 토큰"
}
```

**에러 응답** (400/500):

```json
{
  "message": "에러 메시지"
}
```

**구현 예시** (Node.js/Express):

```javascript
router.post('/kakao/token', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: '인증 코드가 필요합니다.' });
    }

    // 카카오 API를 통해 액세스 토큰 교환
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('카카오 토큰 교환 실패');
    }

    const tokenData = await tokenResponse.json();

    // 카카오 액세스 토큰 반환
    res.json({
      accessToken: tokenData.access_token,
    });
  } catch (error) {
    console.error('카카오 토큰 교환 오류:', error);
    res.status(500).json({ message: '카카오 토큰 교환에 실패했습니다.' });
  }
});
```

### 2. 카카오 로그인 처리

**엔드포인트**: `POST /api/v1/auth/kakao`

**요청 본문**:

```json
{
  "accessToken": "카카오 액세스 토큰"
}
```

**성공 응답** (200):

```json
{
  "accessToken": "우리 서비스의 JWT 액세스 토큰",
  "refreshToken": "우리 서비스의 JWT 리프레시 토큰"
}
```

**에러 응답** (400/401/500):

```json
{
  "message": "에러 메시지"
}
```

**구현 예시** (Node.js/Express):

```javascript
router.post('/kakao', async (req, res) => {
  try {
    const { accessToken: kakaoAccessToken } = req.body;

    if (!kakaoAccessToken) {
      return res.status(400).json({ message: '카카오 액세스 토큰이 필요합니다.' });
    }

    // 카카오 API를 통해 사용자 정보 가져오기
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    if (!userResponse.ok) {
      return res.status(401).json({ message: '카카오 사용자 정보를 가져올 수 없습니다.' });
    }

    const kakaoUser = await userResponse.json();

    // 카카오 사용자 ID
    const kakaoId = kakaoUser.id.toString();
    const email = kakaoUser.kakao_account?.email;
    const nickname = kakaoUser.kakao_account?.profile?.nickname || `카카오${kakaoId.slice(-4)}`;

    // 데이터베이스에서 사용자 찾기 또는 생성
    let user = await User.findOne({ where: { kakaoId } });

    if (!user) {
      // 신규 사용자 생성
      user = await User.create({
        kakaoId,
        email: email || null,
        nickname,
        provider: 'kakao',
      });
    } else {
      // 기존 사용자 정보 업데이트 (선택사항)
      if (email && !user.email) {
        user.email = email;
      }
      if (nickname && user.nickname !== nickname) {
        user.nickname = nickname;
      }
      await user.save();
    }

    // JWT 토큰 생성 (기존 로그인 로직과 동일)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    res.status(500).json({ message: '카카오 로그인에 실패했습니다.' });
  }
});
```

## 카카오 개발자 콘솔 설정

1. **카카오 개발자 콘솔 접속**: https://developers.kakao.com/
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. **앱 설정** → **플랫폼** 설정:
   - **Web 플랫폼**: 사이트 도메인 등록 (예: `http://localhost:3000`)
   - **Android 플랫폼**: 패키지명 등록 (예: `com.hanibi.app`)
   - **iOS 플랫폼**: 번들 ID 등록 (예: `com.hanibi.app`)
4. **제품 설정** → **카카오 로그인** 활성화
5. **카카오 로그인** → **Redirect URI** 등록:
   - `hanibi://kakao-login` (모바일 앱)
   - `https://yourdomain.com/kakao/callback` (웹)
6. **앱 키** 확인:
   - REST API 키 (Client ID)
   - Client Secret

## 데이터베이스 스키마

사용자 테이블에 다음 필드가 필요합니다:

```sql
-- 예시 (PostgreSQL)
ALTER TABLE users ADD COLUMN IF NOT EXISTS kakao_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';
CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id);
```

또는 새로 생성하는 경우:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255), -- 카카오 로그인 사용자는 NULL 가능
  nickname VARCHAR(100) NOT NULL,
  kakao_id VARCHAR(255) UNIQUE,
  provider VARCHAR(50) DEFAULT 'email', -- 'email' 또는 'kakao'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 보안 고려사항

1. **카카오 Client Secret**: 절대 프론트엔드에 노출하지 말고 백엔드에서만 사용
2. **토큰 검증**: 카카오 액세스 토큰을 받은 후 반드시 카카오 API로 검증
3. **에러 처리**: 카카오 API 호출 실패 시 적절한 에러 메시지 반환
4. **Rate Limiting**: 카카오 로그인 API에도 Rate Limiting 적용 권장

## 테스트 방법

1. **카카오 개발자 콘솔에서 테스트 계정 생성**
2. **로컬 환경에서 테스트**:
   - Redirect URI: `http://localhost:3000/kakao/callback` (웹)
   - 또는 앱 스킴: `hanibi://kakao-login` (모바일)
3. **프론트엔드에서 로그인 플로우 테스트**

## 참고 자료

- [카카오 로그인 REST API 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [카카오 사용자 정보 가져오기](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info)
