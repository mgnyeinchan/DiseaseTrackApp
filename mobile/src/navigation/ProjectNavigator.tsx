import { createStackNavigator } from '@react-navigation/stack';
import { ProjectStackParamList } from './types/navigationTypes';

import ProjectListScreen from '../screens/project/ProjectListScreen';
import ProjectFormScreen from '../screens/project/ProjectFormScreen';

const Stack = createStackNavigator<ProjectStackParamList>(); // 👈 MUST

export default function ProjectNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectList" component={ProjectListScreen} />
      <Stack.Screen name="ProjectForm" component={ProjectFormScreen} />
    </Stack.Navigator>
  );
}