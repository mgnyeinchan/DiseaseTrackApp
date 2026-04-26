import { createStackNavigator } from '@react-navigation/stack';
import { TownshipStackParamList } from './types/navigationTypes';

import TownshipListScreen from '../screens/township/TownshipListScreen';
import TownshipFormScreen from '../screens/township/TownshipFormScreen';

const Stack = createStackNavigator<TownshipStackParamList>();

export default function TownshipNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TownshipList" component={TownshipListScreen} />
      <Stack.Screen name="TownshipForm" component={TownshipFormScreen} />
    </Stack.Navigator>
  );
}