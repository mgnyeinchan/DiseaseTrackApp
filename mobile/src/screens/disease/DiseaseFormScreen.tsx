import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title
} from 'react-native-paper';

import {
  createDisease,
  updateDisease
} from '../../services/diseaseApi';

export default function DiseaseFormScreen({ route, navigation }: any) {

  const disease = route.params?.disease;

  const [name, setName] = useState(disease?.disease_name || '');
  const [eng, setEng] = useState(disease?.disease_name_eng || '');
  const [mm, setMM] = useState(disease?.disease_name_mm || '');
  const [definition, setDefinition] = useState(disease?.disease_definition || '');

  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Disease name is required');
      valid = false;
    } else setNameError('');

    return valid;
  };

  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        disease_name: name,
        disease_name_eng: eng,
        disease_name_mm: mm,
        disease_definition: definition
      };

      if (disease) {
        await updateDisease(disease.disease_id, payload);
      } else {
        await createDisease(payload);
      }

      Alert.alert('Success', disease ? 'Updated' : 'Created');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      <Title>{disease ? 'Edit Disease' : 'Create Disease'}</Title>

      <TextInput
        label="Disease Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
      />
      <HelperText type="error" visible={!!nameError}>
        {nameError}
      </HelperText>

      <TextInput
        label="English Name"
        value={eng}
        onChangeText={setEng}
        mode="outlined"
      />

      <TextInput
        label="Myanmar Name"
        value={mm}
        onChangeText={setMM}
        mode="outlined"
      />

      <TextInput
        label="Definition"
        value={definition}
        onChangeText={setDefinition}
        mode="outlined"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 10 }}
      >
        {disease ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}