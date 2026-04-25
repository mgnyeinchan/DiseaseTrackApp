import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SummaryDashboardScreen from '../screens/dashboard/SummaryDashboardScreen';
import DetailDashboardScreen from '../screens/dashboard/DetailDashboardScreen';

const Stack = createStackNavigator();

export default function DashboardNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SummaryDashboard"
        component={SummaryDashboardScreen}
        options={{ title: 'Summary Dashboard' }}
      />

      <Stack.Screen
        name="DetailDashboard"
        component={DetailDashboardScreen}
        options={{ title: 'Detail Dashboard' }}
      />
    </Stack.Navigator>
  );
}