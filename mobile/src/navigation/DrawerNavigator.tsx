import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AppNavigator from './AppNavigator';
import CustomDrawer from './CustomDrawer';
import DashboardNavigator from './DashboardNavigator';

import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >

      {/* ✅ Data Entry */}
      <Drawer.Screen
        name="Home"
        component={AppNavigator}
        options={{ title: 'Data Entry' }}
      />

      {/* ✅ Dashboard (role-based) */}
      {(user?.role === 'admin' || user?.role === 'supervisor') && (
        <Drawer.Screen
          name="Dashboard"
          component={DashboardNavigator}
        />
      )}

    </Drawer.Navigator>
  );
}