import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button, Text, Snackbar } from 'react-native-paper';
import API from '../../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  const handleRegister = async () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      return showMessage('All fields are required');
    }

    if (password !== confirmPassword) {
      return showMessage('Passwords do not match');
    }

    try {
      await API.post('/api/auth/register', {
        username,
        email,
        phone,
        password,
      });

      showMessage('Account created. Wait for admin approval');

      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Register error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button mode="contained" onPress={handleRegister}>
        Register
      </Button>

      <Button onPress={() => navigation.goBack()}>
        Back to Login
      </Button>

      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {message}
      </Snackbar>
    </View>
  );
}

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