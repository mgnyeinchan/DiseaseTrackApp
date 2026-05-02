import { createStackNavigator } from '@react-navigation/stack';

import WeeklyReportListScreen from '../screens/weeklyreport/WeeklyReportListScreen';
import WeeklyReportFormScreen from '../screens/weeklyreport/WeeklyReportFormScreen';

const Stack = createStackNavigator();

export default function WeeklyReportNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="WeeklyReportList"
        component={WeeklyReportListScreen}
      />
      <Stack.Screen
        name="WeeklyReportForm"
        component={WeeklyReportFormScreen}
      />
    </Stack.Navigator>
  );
}