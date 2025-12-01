/**
 * 회원가입 화면
 * 이메일, 비밀번호, 닉네임을 입력받아 회원가입을 처리합니다.
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
import { useRegister } from '@/features/auth/hooks';
import { RootStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const registerMutation = useRegister();
  const setCharacterName = useAppState((s) => s.setCharacterName);

  const handleBack = () => {
    navigation.goBack();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // 최소 8자, 영문/숫자/특수문자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // 이메일 검증
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // 비밀번호 검증
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // 닉네임 검증
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      isValid = false;
    } else if (nickname.trim().length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다.');
      isValid = false;
    } else {
      setNicknameError('');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    if (registerMutation.isPending) {
      return;
    }

    try {
      const trimmedNickname = nickname.trim();
      await registerMutation.mutateAsync({
        email: email.trim(),
        password,
        nickname: trimmedNickname,
      });

      // 회원가입 시 입력한 닉네임을 캐릭터 이름으로 설정
      setCharacterName(trimmedNickname);

      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다. 로그인해주세요.', [
        {
          text: '확인',
          onPress: () => navigation.navigate(ROOT_ROUTES.LOGIN),
        },
      ]);
    } catch (error: unknown) {
      console.error('[RegisterScreen] 회원가입 실패:', error);
      const errorMessage =
        error instanceof Error ? error.message : '회원가입에 실패했습니다. 다시 시도해주세요.';
      Alert.alert('회원가입 실패', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <AppHeader title="회원가입" onBack={handleBack} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
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
                testID="register-email-input"
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
                testID="register-password-input"
              />

              <View style={styles.inputSpacing} />

              <InputField
                label="닉네임"
                value={nickname}
                onChangeText={(text) => {
                  setNickname(text);
                  if (nicknameError) setNicknameError('');
                }}
                placeholder="닉네임을 입력해주세요"
                errorText={nicknameError}
                testID="register-nickname-input"
              />

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  label={registerMutation.isPending ? '가입 중...' : '회원가입'}
                  onPress={handleRegister}
                  disabled={registerMutation.isPending}
                />
              </View>

              <View style={styles.loginLinkContainer}>
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate(ROOT_ROUTES.LOGIN)}
                >
                  로그인하기
                </Text>
              </View>
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
    marginTop: spacing.lg,
  },
  headerContainer: {
    backgroundColor: colors.background,
  },
  inputSpacing: {
    height: spacing.md,
  },
  loginLink: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
