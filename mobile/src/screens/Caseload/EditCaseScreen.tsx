import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import API from '../../services/api';

export default function EditCaseScreen({ route, navigation }: any) {
  const { item } = route.params;

  const [name, setName] = useState(item.name);
  const [age, setAge] = useState(String(item.age));

  const handleUpdate = async () => {
    await API.put(`/api/cases/${item.id}`, {
      name,
      age: Number(age),
    });
    navigation.goBack();
  };

  return (
    <View>
      <TextInput value={name} onChangeText={setName} />

      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}