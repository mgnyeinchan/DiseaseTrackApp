import { createStackNavigator } from '@react-navigation/stack';

import DiseaseListScreen from '../screens/disease/DiseaseListScreen';
import DiseaseFormScreen from '../screens/disease/DiseaseFormScreen';

const Stack = createStackNavigator();

export default function DiseaseNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiseaseList" component={DiseaseListScreen} />
      <Stack.Screen name="DiseaseForm" component={DiseaseFormScreen} />
    </Stack.Navigator>
  );
}