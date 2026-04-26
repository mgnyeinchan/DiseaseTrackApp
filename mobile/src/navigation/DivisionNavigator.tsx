import { createStackNavigator } from '@react-navigation/stack';

import DivisionListScreen from '../screens/division/DivisionListScreen';
import DivisionFormScreen from '../screens/division/DivisionFormScreen';

export type DivisionStackParamList = {
  DivisionList: undefined;
  DivisionForm: { division?: any };
};

const Stack = createStackNavigator<DivisionStackParamList>();

export default function DivisionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DivisionList"
        component={DivisionListScreen}
      />
      <Stack.Screen
        name="DivisionForm"
        component={DivisionFormScreen}
      />
    </Stack.Navigator>
  );
}