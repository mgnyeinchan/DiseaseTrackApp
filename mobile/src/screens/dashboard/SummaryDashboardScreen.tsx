import React from 'react';
import { View, Text } from 'react-native';

export default function SummaryDashboardScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Summary Dashboard</Text>

      {/* Example */}
      <Text>Total Cases: 120</Text>
      <Text>This Week: 15</Text>
    </View>
  );
}