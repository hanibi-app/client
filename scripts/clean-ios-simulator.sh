#!/bin/bash

# iOS 시뮬레이터 정리 스크립트
# 모든 시뮬레이터를 종료하고 캐시를 정리합니다.

echo "🧹 iOS 시뮬레이터 정리 중..."

# 모든 실행 중인 시뮬레이터 종료
echo "📱 실행 중인 시뮬레이터 종료 중..."
xcrun simctl shutdown all 2>/dev/null || true

# 모든 시뮬레이터 지우기 (데이터 삭제)
echo "🗑️  시뮬레이터 데이터 삭제 중..."
xcrun simctl erase all

# DerivedData 정리 (선택사항)
echo "📦 Xcode DerivedData 정리 중..."
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true

# Expo 캐시 정리
echo "🔄 Expo 캐시 정리 중..."
npx expo start --clear

echo "✅ 정리 완료!"



