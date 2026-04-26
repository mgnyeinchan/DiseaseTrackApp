import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CaseListScreen from '../screens/Caseload/CaseListScreen';
import AddCaseScreen from '../screens/Caseload/AddCaseScreen';
import EditCaseScreen from '../screens/Caseload/EditCaseScreen';
import HeaderLeft from './components/HeaderLeft';
import HeaderRight from './components/HeaderRight';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProjectSetupScreen from '../screens/setup/ProjectSetupScreen';
import OrgSetupScreen from '../screens/setup/OrgSetupScreen';
import DivisionSetupScreen from '../screens/setup/DivisionSetupScreen';
import TownshipSetupScreen from '../screens/setup/TownshipSetupScreen';
import VillageSetupScreen from '../screens/setup/VillageSetupScreen';
import ClinicSetupScreen from '../screens/setup/ClinicSetupScreen';
import ProjectNavigator from './ProjectNavigator';
import OrgNavigator from './OrgNavigator';
import DivisionNavigator from './DivisionNavigator';
import TownshipNavigator from './TownshipNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Stack.Screen name="CaseList" component={CaseListScreen} />
      <Stack.Screen name="AddCase" component={AddCaseScreen} />
      <Stack.Screen name="EditCase" component={EditCaseScreen} />
      
      <Stack.Screen name="Dashboard" component={DashboardScreen} />

      <Stack.Screen name="Projects" component={ProjectNavigator} />
      <Stack.Screen name="Org" component={OrgNavigator} />
      <Stack.Screen name="Division" component={DivisionNavigator} />
      <Stack.Screen name="Township" component={TownshipNavigator} />
      <Stack.Screen name="Village" component={VillageSetupScreen} />
      <Stack.Screen name="Clinic" component={ClinicSetupScreen} />
    </Stack.Navigator>
  );
}