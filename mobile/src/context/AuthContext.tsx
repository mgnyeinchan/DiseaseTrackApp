import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    const check = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const decoded: any = jwtDecode(token);

        setUser({
          id: decoded.id,
          role: decoded.role,
          username: decoded.username
        });

        setIsLoggedIn(true);

      } catch (err) {
        console.log('Invalid token → clear');
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token);

    const decoded: any = jwtDecode(token);

    setUser({
      id: decoded.id,
      role: decoded.role,
      username: decoded.username
    });

    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null); 
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}