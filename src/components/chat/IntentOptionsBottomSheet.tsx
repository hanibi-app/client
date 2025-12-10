/**
 * Intent Options Bottom Sheet 컴포넌트
 * HISTORY_QUERY, REPORT_QUERY 등 옵션이 필요한 Intent를 위한 옵션 선택 모달입니다.
 */

import React, { useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { ChatIntentMetadata, IntentPreset } from '@/types/chat';

export interface IntentOptionsBottomSheetProps {
  visible: boolean;
  preset: IntentPreset | null;
  onConfirm: (metadata: ChatIntentMetadata, content: string) => void;
  onClose: () => void;
}

type PeriodOption = 'TODAY' | 'WEEKLY' | 'MONTHLY';
type SensorOption = 'temperature' | 'humidity' | 'weight' | 'gas';

/**
 * Intent Options Bottom Sheet 컴포넌트
 */
export default function IntentOptionsBottomSheet({
  visible,
  preset,
  onConfirm,
  onClose,
}: IntentOptionsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('WEEKLY');
  const [selectedSensors, setSelectedSensors] = useState<SensorOption[]>(['temperature', 'humidity']);

  if (!preset) {
    return null;
  }

  const isHistoryQuery = preset.intent === 'HISTORY_QUERY';
  const isReportQuery = preset.intent === 'REPORT_QUERY';

  const handleConfirm = () => {
    let metadata: ChatIntentMetadata = {
      intent: preset.intent,
    };

    let content = preset.defaultContent;

    if (isHistoryQuery) {
      metadata = {
        intent: 'HISTORY_QUERY',
        period: selectedPeriod,
        context: {
          period: selectedPeriod,
          sensors: selectedSensors,
        },
      };

      // 센서 이름 한글 변환
      const sensorLabels: Record<SensorOption, string> = {
        temperature: '온도',
        humidity: '습도',
        weight: '무게',
        gas: '가스',
      };

      const sensorText = selectedSensors.map((s) => sensorLabels[s]).join(', ');
      const periodText =
        selectedPeriod === 'TODAY'
          ? '오늘'
          : selectedPeriod === 'WEEKLY'
            ? '지난 주'
            : '이번 달';

      content = `${periodText} ${sensorText} 데이터 보여줘`;
    } else if (isReportQuery) {
      metadata = {
        intent: 'REPORT_QUERY',
        period: selectedPeriod,
      };

      const periodText =
        selectedPeriod === 'TODAY'
          ? '오늘'
          : selectedPeriod === 'WEEKLY'
            ? '이번 주'
            : '이번 달';

      content = `${periodText} 리포트 보여줘`;
    }

    onConfirm(metadata, content);
    onClose();
  };

  const toggleSensor = (sensor: SensorOption) => {
    setSelectedSensors((prev) =>
      prev.includes(sensor) ? prev.filter((s) => s !== sensor) : [...prev, sensor],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      statusBarTranslucent={true}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.sheet}
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>{preset.label}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={[
              styles.contentContainer,
              { paddingBottom: Math.max(insets.bottom + spacing.xl, spacing.xxl) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* 기간 선택 (HISTORY_QUERY, REPORT_QUERY) */}
            {(isHistoryQuery || isReportQuery) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>기간 선택</Text>
                <View style={styles.optionRow}>
                  {(['TODAY', 'WEEKLY', 'MONTHLY'] as PeriodOption[]).map((period) => {
                    const isSelected = selectedPeriod === period;
                    const periodLabel =
                      period === 'TODAY' ? '오늘' : period === 'WEEKLY' ? '이번 주' : '이번 달';

                    return (
                      <Pressable
                        key={period}
                        onPress={() => setSelectedPeriod(period)}
                        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {periodLabel}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 센서 선택 (HISTORY_QUERY만) */}
            {isHistoryQuery && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>센서 선택</Text>
                <View style={styles.sensorGrid}>
                  {(
                    [
                      { key: 'temperature', label: '온도', icon: 'thermostat' },
                      { key: 'humidity', label: '습도', icon: 'water-drop' },
                      { key: 'weight', label: '무게', icon: 'scale' },
                      { key: 'gas', label: '가스', icon: 'air' },
                    ] as const
                  ).map((sensor) => {
                    const isSelected = selectedSensors.includes(sensor.key);
                    return (
                      <Pressable
                        key={sensor.key}
                        onPress={() => toggleSensor(sensor.key)}
                        style={[
                          styles.sensorButton,
                          isSelected && styles.sensorButtonSelected,
                        ]}
                      >
                        <MaterialIcons
                          name={sensor.icon as React.ComponentProps<typeof MaterialIcons>['name']}
                          size={20}
                          color={isSelected ? colors.white : colors.primary}
                        />
                        <Text
                          style={[
                            styles.sensorText,
                            isSelected && styles.sensorTextSelected,
                          ]}
                        >
                          {sensor.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 확인 버튼 */}
            <View style={styles.buttonContainer}>
              <Pressable onPress={handleConfirm} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>이 설정으로 요청하기</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    paddingTop: spacing.lg,
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  content: {
    maxHeight: '70%',
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  optionButton: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.white,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  sensorButton: {
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  sensorButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sensorText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  sensorTextSelected: {
    color: colors.white,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
