import { createStackNavigator } from '@react-navigation/stack';

import OrgListScreen from '../screens/organization/OrgListScreen';
import OrgFormScreen from '../screens/organization/OrgFormScreen';

export type OrgStackParamList = {
  OrgList: undefined;
  OrgForm: { org?: any };
};

const Stack = createStackNavigator<OrgStackParamList>();

export default function OrgNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrgList" component={OrgListScreen} />
      <Stack.Screen name="OrgForm" component={OrgFormScreen} />
    </Stack.Navigator>
  );
}