import { createStackNavigator } from '@react-navigation/stack';
import { VillageStackParamList } from './types/navigationTypes';

import VillageListScreen from '../screens/village/VillageListScreen';
import VillageFormScreen from '../screens/village/VillageFormScreen';

const Stack = createStackNavigator<VillageStackParamList>();

export default function VillageNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VillageList" component={VillageListScreen} />
      <Stack.Screen name="VillageForm" component={VillageFormScreen} />
    </Stack.Navigator>
  );
}