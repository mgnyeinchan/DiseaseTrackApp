import { createStackNavigator } from '@react-navigation/stack';

import CasebaseListScreen from '../screens/casebase/CasebaseListScreen';
import CasebaseFormScreen from '../screens/casebase/CasebaseFormScreen';

const Stack = createStackNavigator();

export default function CasebaseNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* 📄 List */}
      <Stack.Screen 
        name="CasebaseList" 
        component={CasebaseListScreen} 
      />

      {/* 📝 Form (Create / Edit) */}
      <Stack.Screen 
        name="CasebaseForm" 
        component={CasebaseFormScreen} 
      />

    </Stack.Navigator>
  );
}