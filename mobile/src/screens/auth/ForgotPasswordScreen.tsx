import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button, Text, Snackbar } from 'react-native-paper';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const handleRequest = () => {
    setMessage('Request sent to admin');
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        placeholder="Enter Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Button mode="contained" onPress={handleRequest}>
        Send Request
      </Button>

      <Button onPress={() => navigation.goBack()}>
        Back
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