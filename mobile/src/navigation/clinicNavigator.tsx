import { createStackNavigator } from '@react-navigation/stack';

import ClinicListScreen from '../screens/clinic/ClinicListScreen';
import ClinicFormScreen from '../screens/clinic/ClinicFormScreen';

const Stack = createStackNavigator();

export default function ClinicNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClinicList" component={ClinicListScreen} />
      <Stack.Screen name="ClinicForm" component={ClinicFormScreen} />
    </Stack.Navigator>
  );
}