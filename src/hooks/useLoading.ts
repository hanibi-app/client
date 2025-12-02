import { useCallback, useState } from 'react';

export interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * 로딩 상태를 관리하는 훅
 * @param initialValue 초기 로딩 상태 (기본값: false)
 * @returns 로딩 상태와 제어 함수들
 *
 * @example
 * ```tsx
 * const { isLoading, startLoading, stopLoading, withLoading } = useLoading();
 *
 * // 수동 제어
 * startLoading();
 * await fetchData();
 * stopLoading();
 *
 * // 자동 제어
 * await withLoading(async () => {
 *   await fetchData();
 * });
 * ```
 */
export function useLoading(initialValue = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(initialValue);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      return await asyncFn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
