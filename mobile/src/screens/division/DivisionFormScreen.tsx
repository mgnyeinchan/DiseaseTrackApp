import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title
} from 'react-native-paper';

import {
  createDivision,
  updateDivision
} from '../../services/divisionApi';

export default function DivisionFormScreen({ route, navigation }: any) {

  const division = route.params?.division;

  const [code, setCode] = useState(division?.div_code || '');
  const [name, setName] = useState(division?.div_name || '');
  const [nameMM, setNameMM] = useState(division?.div_namemm || '');

  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');

  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Code is required');
      valid = false;
    } else setCodeError('');

    if (!name.trim()) {
      setNameError('Name is required');
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
        div_code: code,
        div_name: name,
        div_namemm: nameMM
      };

      if (division) {
        await updateDivision(division.div_id, payload);
      } else {
        await createDivision(payload);
      }

      Alert.alert('Success', 'Saved successfully');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      <Title>{division ? 'Edit Division' : 'Create Division'}</Title>

      <TextInput
        label="Code *"
        value={code}
        onChangeText={(t) => {
          setCode(t);
          if (codeError) setCodeError('');
        }}
        error={!!codeError}
      />
      <HelperText type="error" visible={!!codeError}>{codeError}</HelperText>

      <TextInput
        label="Name *"
        value={name}
        onChangeText={(t) => {
          setName(t);
          if (nameError) setNameError('');
        }}
        error={!!nameError}
      />
      <HelperText type="error" visible={!!nameError}>{nameError}</HelperText>

      <TextInput
        label="Name (MM)"
        value={nameMM}
        onChangeText={setNameMM}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {division ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}