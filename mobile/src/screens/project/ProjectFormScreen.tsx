import React, { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

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

  const [code, setCode] = useState(project?.project_code || '');
  const [name, setName] = useState(project?.project_name || '');
  const [funder, setFunder] = useState(project?.project_funder || '');

  const handleSave = async () => {
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

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput
        label="Project Code"
        value={code}
        onChangeText={setCode}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Project Name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="Funder"
        value={funder}
        onChangeText={setFunder}
        style={{ marginBottom: 10 }}
      />

      <Button mode="contained" onPress={handleSave}>
        {project ? 'Update' : 'Create'}
      </Button>
    </ScrollView>
  );
}