/**
 * useLoading 훅 사용 예시
 *
 * 이 파일은 예시용이며, 실제 프로젝트에서는 삭제해도 됩니다.
 */

import React from 'react';

import { View, StyleSheet } from 'react-native';

import AppButton from '@/components/common/AppButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { useLoading } from './useLoading';

// 예시 1: 기본 사용
export function Example1() {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleFetch = async () => {
    startLoading();
    try {
      // 비동기 작업
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      stopLoading();
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="데이터를 불러오는 중..." />;
  }

  return (
    <View>
      <AppButton label="데이터 불러오기" onPress={handleFetch} />
    </View>
  );
}

// 예시 2: withLoading 사용 (자동 제어)
export function Example2() {
  const { isLoading, withLoading } = useLoading();

  const handleFetch = async () => {
    await withLoading(async () => {
      // 비동기 작업
      await fetch('/api/data');
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="처리 중..." />;
  }

  return (
    <View>
      <AppButton label="데이터 불러오기" onPress={handleFetch} />
    </View>
  );
}

// 예시 3: 전체 화면 오버레이
export function Example3() {
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async () => {
    await withLoading(async () => {
      await submitForm();
    });
  };

  return (
    <View style={styles.container}>
      <AppButton label="제출" onPress={handleSubmit} />

      {/* 전체 화면 로딩 오버레이 */}
      {isLoading && <LoadingSpinner fullScreen message="제출 중입니다..." />}
    </View>
  );
}

// 예시 4: 여러 비동기 작업 관리
export function Example4() {
  const { isLoading, withLoading } = useLoading();

  const handleMultipleOperations = async () => {
    await withLoading(async () => {
      await Promise.all([fetchData1(), fetchData2(), fetchData3()]);
    });
  };

  return (
    <View>
      {isLoading ? (
        <LoadingSpinner message="여러 작업을 처리하는 중..." />
      ) : (
        <AppButton label="모든 데이터 불러오기" onPress={handleMultipleOperations} />
      )}
    </View>
  );
}

// 헬퍼 함수들 (예시용)
async function fetchData1() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function fetchData2() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function fetchData3() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function submitForm() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
