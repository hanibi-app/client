import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import { SettingsStackScreenProps } from '@/types/navigation';

type SettingsEtcScreenProps = SettingsStackScreenProps<'SettingsEtc'>;

export default function SettingsEtcScreen({ navigation }: SettingsEtcScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>기타</Text>
          <Text style={styles.subtitle}>
            앱 정보, 버전, 문의하기 등
          </Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>ℹ️</Text>
          <Text style={styles.placeholderTitle}>기타 설정</Text>
          <Text style={styles.placeholderDescription}>
            앱 정보, 버전, 문의하기, 개인정보 처리방침 등을 확인할 수 있습니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  placeholder: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  placeholderDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
