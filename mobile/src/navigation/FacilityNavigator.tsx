import { createStackNavigator } from '@react-navigation/stack';
import { FacilityStackParamList } from './types/navigationTypes';

import FacilityListScreen from '../screens/facility/FacilityListScreen';
import FacilityFormScreen from '../screens/facility/FacilityFormScreen';

const Stack = createStackNavigator<FacilityStackParamList>();

export default function FacilityNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="FacilityList"
        component={FacilityListScreen}
      />

      <Stack.Screen
        name="FacilityForm"
        component={FacilityFormScreen}
      />
    </Stack.Navigator>
  );
}