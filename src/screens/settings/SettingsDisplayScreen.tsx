import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import { SettingsStackScreenProps } from '@/types/navigation';

type SettingsDisplayScreenProps = SettingsStackScreenProps<'SettingsDisplay'>;

export default function SettingsDisplayScreen({
  navigation: _navigation,
}: SettingsDisplayScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>대시보드 표시</Text>
          <Text style={styles.subtitle}>화면에 표시할 지표를 선택하세요.</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📊</Text>
          <Text style={styles.placeholderTitle}>대시보드 표시 설정</Text>
          <Text style={styles.placeholderDescription}>
            온도, 습도, 금속, VOC 지표의 표시 여부를 설정할 수 있습니다.
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
