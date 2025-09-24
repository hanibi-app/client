import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CautionStep3Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caution Step 3 Screen</Text>
      <Text style={styles.subtitle}>This will be migrated from app/caution/step3.tsx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
});
