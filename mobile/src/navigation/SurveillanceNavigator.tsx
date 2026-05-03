import { createStackNavigator } from '@react-navigation/stack';

import SurveillanceListScreen from '../screens/surveillance/SurveillanceListScreen';
import SurveillanceFormScreen from '../screens/surveillance/SurveillanceFormScreen';

const Stack = createStackNavigator();

export default function SurveillanceNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SurveillanceList"
        component={SurveillanceListScreen}
      />
      <Stack.Screen
        name="SurveillanceForm"
        component={SurveillanceFormScreen}
      />
    </Stack.Navigator>
  );
}