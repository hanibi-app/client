import React from 'react';

import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/theme';
import { AuthStackScreenProps } from '@/types/navigation';

type LoginScreenProps = AuthStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setSignedIn, setUser } = useAuthStore();
  const { tokens } = useTheme();

  const handleKakaoLogin = async () => {
    // TODO: 카카오 로그인 구현
    console.log('카카오 로그인 시도');
    
    // 더미 로그인 성공 처리
    setUser({
      id: 'user-001',
      name: '한니비 사용자',
      email: 'user@hanibi.com',
      profileImage: undefined,
    });
    setSignedIn(true);
    
    // 온보딩으로 이동
    navigation.navigate('OnboardingAlertRequest');
  };

  const dynamicStyles = StyleSheet.create({
    characterName: {
      color: tokens.brand.primary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    kakaoButton: {
      // eslint-disable-next-line react-native/no-color-literals
      backgroundColor: '#FEE500', // 카카오 공식 브랜드 색상
      borderRadius: 12,
      marginBottom: 20,
      paddingVertical: 16,
    },
    kakaoButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      color: tokens.text.muted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    termsText: {
      color: tokens.text.muted,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },
    title: {
      color: tokens.text.primary,
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={dynamicStyles.title}>지금부터 음식물 쓰레기 고민 STOP!</Text>
          <Text style={dynamicStyles.subtitle}>한니비와 함께 스마트하게 관리하세요</Text>
        </View>
        
        <View style={styles.characterContainer}>
          <Text style={styles.character}>🤖</Text>
          <Text style={dynamicStyles.characterName}>한니비</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable style={dynamicStyles.kakaoButton} onPress={handleKakaoLogin}>
            <Text style={dynamicStyles.kakaoButtonText}>카카오로 시작하기</Text>
          </Pressable>
          
          <Text style={dynamicStyles.termsText}>
            로그인 시 개인정보 처리방침 및 이용약관에 동의하게 됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 40,
  },
  character: {
    fontSize: 120,
    marginBottom: 16,
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
});
