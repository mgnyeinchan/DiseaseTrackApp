import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import AuthProvider from './src/context/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-get-random-values';
import { decode as atob } from 'base-64';

global.atob = atob;
export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}