import React, { useEffect, useState } from 'react';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import InputField from '@/components/common/InputField';
import PrimaryButton from '@/components/common/PrimaryButton';
import ToastMessage from '@/components/common/ToastMessage';
import { useMe, useUpdateProfile } from '@/features/user/hooks';
import { RootStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { useLoadingStore } from '@/store/loadingStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { data: me, isLoading, isError, refetch } = useMe();
  const updateProfile = useUpdateProfile();
  const setCharacterName = useAppState((s) => s.setCharacterName);
  const { startLoading, stopLoading } = useLoadingStore();
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // me 데이터가 로드되면 닉네임 초기화
  useEffect(() => {
    if (me?.nickname) {
      setNickname(me.nickname);
    }
  }, [me]);

  // 토스트 메시지 자동 숨김
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 닉네임 유효성 검사
  const validateNickname = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setNicknameError('닉네임을 입력해주세요.');
      return false;
    }
    if (trimmed.length < 1 || trimmed.length > 20) {
      setNicknameError('닉네임은 1~20자 사이로 입력해주세요.');
      return false;
    }
    // 공백만 입력된 경우 체크
    if (trimmed.length !== value.length || value !== trimmed) {
      setNicknameError('닉네임은 앞뒤 공백 없이 입력해주세요.');
      return false;
    }
    setNicknameError('');
    return true;
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    // 실시간 유효성 검사는 하지 않고, 저장 시에만 검사
    if (nicknameError) {
      setNicknameError('');
    }
  };

  const handleSave = async () => {
    // 유효성 검사
    if (!validateNickname(nickname)) {
      return;
    }

    // 변경 사항이 없으면 저장하지 않음
    if (me?.nickname === nickname.trim()) {
      setToastMessage('변경된 내용이 없습니다.');
      setToastType('info');
      return;
    }

    try {
      const updatedNickname = nickname.trim();
      await updateProfile.mutateAsync({ nickname: updatedNickname });
      // HomeScreen의 characterName도 동기화
      setCharacterName(updatedNickname);
      setToastMessage('프로필이 수정되었습니다.');
      setToastType('success');
    } catch (error) {
      console.error('[ProfileScreen] 프로필 수정 실패:', error);
      setToastMessage('프로필 수정에 실패했습니다. 다시 시도해주세요.');
      setToastType('error');
    }
  };

  const hasChanges = me?.nickname !== nickname.trim();
  const isSaveDisabled =
    updateProfile.isPending ||
    !hasChanges ||
    nickname.trim().length === 0 ||
    nickname.trim().length > 20;

  // React Query의 isLoading을 전역 로딩과 연동
  useEffect(() => {
    if (isLoading) {
      startLoading('프로필 정보를 불러오는 중...');
    } else {
      stopLoading();
    }
  }, [isLoading, startLoading, stopLoading]);

  // 로딩 상태 (전역 로딩이 표시되므로 로컬 로딩 UI 제거)
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <AppHeader
            title="프로필 및 계정"
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
          />
        </View>
      </View>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <AppHeader
            title="프로필 및 계정"
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>프로필 정보를 불러오지 못했습니다.</Text>
          <PrimaryButton label="재시도" onPress={() => refetch()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader
          title="프로필 및 계정"
          onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이메일</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{me?.email || ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>닉네임</Text>
          <InputField
            value={nickname}
            onChangeText={handleNicknameChange}
            placeholder="닉네임을 입력하세요"
            errorText={nicknameError}
            helperText="1~20자 사이로 입력해주세요"
            label=""
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={updateProfile.isPending ? '저장 중...' : '저장'}
            onPress={handleSave}
            disabled={isSaveDisabled}
          />
        </View>
      </ScrollView>

      {/* 토스트 메시지 */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <ToastMessage message={toastMessage} type={toastType} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing.xl,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  readOnlyField: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  readOnlyText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  toastContainer: {
    bottom: spacing.xxl,
    left: spacing.xl,
    position: 'absolute',
    right: spacing.xl,
  },
});
