import React, { useState } from 'react';

import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/theme/light';
import { HomeStackScreenProps } from '@/types/navigation';

const tokens = lightTheme;

type CameraScreenProps = HomeStackScreenProps<'CameraScreen'>;

export default function CameraScreen({ route, navigation: _navigation }: CameraScreenProps) {
  const [isConnected, setIsConnected] = useState(route.params?.connected || false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const handleConnectCamera = async () => {
    // TODO: 실제 카메라 연결 로직 구현
    try {
      // 시뮬레이션: 카메라 연결 시도
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      Alert.alert('연결 성공', 'CCTV가 성공적으로 연결되었습니다.');
    } catch (error) {
      Alert.alert('연결 실패', 'CCTV 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  const handleStartStream = () => {
    // TODO: 실제 스트림 시작 로직 구현
    setIsStreaming(true);
    Alert.alert('스트림 시작', '실시간 영상 스트림이 시작되었습니다.');
  };
  
  const handleStopStream = () => {
    // TODO: 실제 스트림 중지 로직 구현
    setIsStreaming(false);
    Alert.alert('스트림 중지', '실시간 영상 스트림이 중지되었습니다.');
  };
  
  const handleRefresh = () => {
    // TODO: 실제 새로고침 로직 구현
    Alert.alert('새로고침', '영상이 새로고침되었습니다.');
  };
  
  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.disconnectedContainer}>
          <Text style={styles.disconnectedIcon}>📹</Text>
          <Text style={styles.disconnectedTitle}>CCTV가 연결되지 않았습니다</Text>
          <Text style={styles.disconnectedDescription}>
            사료 상태를 확인하려면 CCTV를 연결해주세요.
          </Text>
          
          <Pressable style={styles.connectButton} onPress={handleConnectCamera}>
            <Text style={styles.connectButtonText}>CCTV 연결하기</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.connectedContainer}>
        <View style={styles.cameraPreview}>
          {isStreaming ? (
            <View style={styles.streamingContainer}>
              <Text style={styles.streamingText}>실시간 스트림 중...</Text>
              {/* TODO: 실제 스트림 영상 표시 */}
              <View style={styles.placeholderVideo}>
                <Text style={styles.placeholderText}>📹 실시간 영상</Text>
              </View>
            </View>
          ) : (
            <View style={styles.staticContainer}>
              <Text style={styles.staticText}>사료 상태 확인</Text>
              {/* TODO: 실제 정적 이미지 표시 */}
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📷 사료 상태 이미지</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          <Pressable
            style={[styles.controlButton, styles.primaryButton]}
            onPress={isStreaming ? handleStopStream : handleStartStream}
          >
            <Text style={styles.controlButtonText}>
              {isStreaming ? '스트림 중지' : '스트림 시작'}
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleRefresh}
          >
            <Text style={styles.controlButtonText}>새로고침</Text>
          </Pressable>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>연결 정보</Text>
          <Text style={styles.infoText}>상태: {isStreaming ? '스트리밍 중' : '대기 중'}</Text>
          <Text style={styles.infoText}>해상도: 1920x1080</Text>
          <Text style={styles.infoText}>프레임레이트: 30fps</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraPreview: {
    backgroundColor: tokens.surface.overlay,
    borderRadius: 12,
    flex: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  connectButton: {
    backgroundColor: tokens.brand.primary,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  connectButtonText: {
    color: tokens.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    backgroundColor: tokens.surface.background,
    flex: 1,
  },
  controlButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
  },
  controlButtonText: {
    color: tokens.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  disconnectedContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  disconnectedDescription: {
    color: tokens.text.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  disconnectedIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  disconnectedTitle: {
    color: tokens.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: tokens.surface.card,
    borderRadius: 8,
    padding: 16,
  },
  infoText: {
    color: tokens.text.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  infoTitle: {
    color: tokens.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderImage: {
    alignItems: 'center',
    backgroundColor: tokens.surface.overlay,
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    width: '80%',
  },
  placeholderText: {
    color: tokens.text.inverse,
    fontSize: 16,
  },
  placeholderVideo: {
    alignItems: 'center',
    backgroundColor: tokens.surface.overlay,
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    width: '80%',
  },
  primaryButton: {
    backgroundColor: tokens.brand.primary,
  },
  secondaryButton: {
    backgroundColor: tokens.text.muted,
  },
  staticContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  staticText: {
    color: tokens.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  streamingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  streamingText: {
    color: tokens.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
