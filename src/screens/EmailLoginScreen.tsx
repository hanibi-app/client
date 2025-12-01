/**
 * 이메일 로그인 화면
 * 이메일과 비밀번호를 입력받아 로그인을 처리합니다.
 */

import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import InputField from '@/components/common/InputField';
import PrimaryButton from '@/components/common/PrimaryButton';
import { ROOT_ROUTES } from '@/constants/routes';
import { useLogin } from '@/features/auth/hooks';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type EmailLoginScreenProps = NativeStackScreenProps<RootStackParamList, 'EmailLogin'>;

export default function EmailLoginScreen({ navigation }: EmailLoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loginMutation = useLogin();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    if (loginMutation.isPending) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      // 로그인 성공 시 NotificationRequest 화면으로 이동
      // 약간의 지연을 두어 상태 업데이트가 완료되도록 함
      setTimeout(() => {
        try {
          navigation.navigate(ROOT_ROUTES.NOTIFICATION_REQUEST);
        } catch (navError) {
          console.error('[EmailLoginScreen] 네비게이션 에러:', navError);
          Alert.alert('오류', '화면 이동 중 오류가 발생했습니다.');
        }
      }, 100);
    } catch (error: unknown) {
      console.error('[EmailLoginScreen] 로그인 실패:', error);
      const errorMessage =
        error instanceof Error ? error.message : '로그인에 실패했습니다. 다시 시도해주세요.';
      Alert.alert('로그인 실패', errorMessage);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <AppHeader title="로그인" onBack={handleBack} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.subtitle}>이메일과 비밀번호를 입력해주세요</Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="이메일"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                placeholder="이메일을 입력해주세요"
                keyboardType="email-address"
                errorText={emailError}
                testID="email-login-email-input"
              />

              <View style={styles.inputSpacing} />

              <InputField
                label="비밀번호"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="비밀번호를 입력해주세요"
                isPassword
                errorText={passwordError}
                testID="email-login-password-input"
              />
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                label={loginMutation.isPending ? '로그인 중...' : '로그인하기'}
                onPress={handleLogin}
                disabled={loginMutation.isPending}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing.xl,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  form: {
    marginTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerContainer: {
    backgroundColor: colors.background,
  },
  inputSpacing: {
    height: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
