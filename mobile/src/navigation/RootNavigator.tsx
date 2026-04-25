import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import DrawerNavigator from './DrawerNavigator';

export default function RootNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <DrawerNavigator /> : <AuthNavigator />;
}