/**
 * 루트 네비게이션 참조 관리
 *
 * App.tsx에서 생성된 NavigationContainerRef를 전역적으로 접근할 수 있도록 합니다.
 * 이를 통해 하위 화면에서도 루트 네비게이터에 안전하게 액션을 디스패치할 수 있습니다.
 */

import { NavigationContainerRef } from '@react-navigation/native';

import { RootStackParamList } from './types';

/**
 * 루트 네비게이션 컨테이너 참조
 * App.tsx에서 초기화됩니다.
 */
let rootNavigationRef: NavigationContainerRef<RootStackParamList> | null = null;

/**
 * 루트 네비게이션 참조를 설정합니다.
 * App.tsx에서 호출됩니다.
 */
export const setRootNavigationRef = (ref: NavigationContainerRef<RootStackParamList> | null) => {
  rootNavigationRef = ref;
};

/**
 * 루트 네비게이션 참조를 가져옵니다.
 * 하위 화면에서 루트 네비게이터에 액션을 디스패치할 때 사용합니다.
 */
export const getRootNavigationRef = (): NavigationContainerRef<RootStackParamList> | null => {
  return rootNavigationRef;
};

/**
 * 루트 네비게이션이 준비되었는지 확인합니다.
 */
export const isRootNavigationReady = (): boolean => {
  return rootNavigationRef?.isReady() ?? false;
};
