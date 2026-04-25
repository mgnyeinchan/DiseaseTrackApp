import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import API from '../../services/api';

export default function AddCaseScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleAdd = async () => {
    await API.post('/api/cases', { name, age });
    navigation.goBack();
  };

  return (
    <View>
      <TextInput placeholder="Name" onChangeText={setName} />
      <TextInput placeholder="Age" onChangeText={setAge} />
      <Button title="Save" onPress={handleAdd} />
    </View>
  );
}