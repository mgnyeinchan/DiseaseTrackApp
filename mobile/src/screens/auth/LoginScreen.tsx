import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button, Text, Snackbar } from 'react-native-paper';
import API from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const { login } = useContext(AuthContext);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/api/auth/login', {
        username,
        password,
      });

      const token = res.data.token;
      await AsyncStorage.setItem('token', token);

      await login(token);

    } catch (err: any) {
      if (err.response) {
        showMessage(err.response.data.message);
      } else {
        showMessage('Server error');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disease Surveillance</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>

      <Button onPress={() => navigation.navigate('Register')}>
        Create Account
      </Button>

      <Button onPress={() => navigation.navigate('Forgot')}>
        Forgot Password?
      </Button>

      {/* 🔥 Snackbar */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
});