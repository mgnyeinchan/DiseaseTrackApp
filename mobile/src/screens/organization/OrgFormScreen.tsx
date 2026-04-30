import React, { useState } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title,
  Divider
} from 'react-native-paper';

import {
  createOrg,
  updateOrg
} from '../../services/orgApi';

export default function OrgFormScreen({ route, navigation }: any) {

  const org = route.params?.org;

  // 🔥 form state
  const [code, setCode] = useState(org?.org_code || '');
  const [name, setName] = useState(org?.org_name || '');

  // 🔥 error state
  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');

  // 🔥 loading
  const [loading, setLoading] = useState(false);

  // 🔥 validation
  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Organization code is required');
      valid = false;
    } else setCodeError('');

    if (!name.trim()) {
      setNameError('Organization name is required');
      valid = false;
    } else setNameError('');

    return valid;
  };

  // 🔥 save (create + update)
  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        org_code: code,
        org_name: name
      };

      if (org) {
        await updateOrg(org.org_id, payload);
      } else {
        await createOrg(payload);
      }

      Alert.alert(
        'Success',
        org ? 'Updated successfully' : 'Created successfully'
      );

      navigation.goBack();

    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      {/* 🔥 Title */}
      <Title style={{ marginBottom: 20 }}>
        {org ? 'Edit Organization' : 'Create Organization'}
      </Title>

      {/* 🔹 Form Section */}
      <View style={{ marginBottom: 20 }}>

        <TextInput
          label="Organization Code *"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            if (codeError) setCodeError('');
          }}
          mode="outlined"
          style={{ marginBottom: 5 }}
          error={!!codeError}
        />
        <HelperText type="error" visible={!!codeError}>
          {codeError}
        </HelperText>

        <TextInput
          label="Organization Name *"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError('');
          }}
          mode="outlined"
          style={{ marginBottom: 5 }}
          error={!!nameError}
        />
        <HelperText type="error" visible={!!nameError}>
          {nameError}
        </HelperText>

      </View>

      <Divider style={{ marginVertical: 10 }} />

      {/* 🔥 Save Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 10 }}
      >
        {org ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}