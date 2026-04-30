import React, { useState, useContext } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title
} from 'react-native-paper';

import {
  createProject,
  updateProject
} from '../../services/projectApi';

import { AuthContext } from '../../context/AuthContext';

import { StackScreenProps } from '@react-navigation/stack';
import { ProjectStackParamList } from '../../navigation/types/navigationTypes';

type Props = StackScreenProps<ProjectStackParamList, 'ProjectForm'>;

export default function ProjectFormScreen({ route, navigation }: Props) {

  const { token } = useContext(AuthContext);

  const project = route.params?.project;

  // 🔥 form state
  const [code, setCode] = useState(project?.project_code || '');
  const [name, setName] = useState(project?.project_name || '');
  const [funder, setFunder] = useState(project?.project_funder || '');

  // 🔥 error state
  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');

  // 🔥 loading state
  const [loading, setLoading] = useState(false);

  // 🔥 validation
  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Project code is required');
      valid = false;
    } else {
      setCodeError('');
    }

    if (!name.trim()) {
      setNameError('Project name is required');
      valid = false;
    } else {
      setNameError('');
    }

    return valid;
  };

  // 🔥 save handler
  const handleSave = async () => {

    // prevent double click
    if (loading) return;

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        project_code: code,
        project_name: name,
        project_funder: funder,
        project_status: 1
      };

      if (project) {
        await updateProject(project.project_id, payload);
      } else {
        await createProject(payload);
      }

      Alert.alert(
        'Success',
        project ? 'Updated successfully' : 'Created successfully'
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
        {project ? 'Edit Project' : 'Create Project'}
      </Title>

      {/* 🔥 Project Code */}
      <TextInput
        label="Project Code *"
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

      {/* 🔥 Project Name */}
      <TextInput
        label="Project Name *"
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

      {/* 🔥 Funder */}
      <TextInput
        label="Funder"
        value={funder}
        onChangeText={setFunder}
        mode="outlined"
        style={{ marginBottom: 15 }}
      />

      {/* 🔥 Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
      >
        {project ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}