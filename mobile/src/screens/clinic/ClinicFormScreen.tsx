import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View, FlatList, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title,
  Portal,
  Modal
} from 'react-native-paper';

import {
  createClinic,
  updateClinic,
  getTownshipsDropdown
} from '../../services/clinicApi';

type Township = {
  tsp_id: number;
  tsp_name: string;
};

export default function ClinicFormScreen({ route, navigation }: any) {

  const clinic = route.params?.clinic;

  const [code, setCode] = useState(clinic?.cln_code || '');
  const [name, setName] = useState(clinic?.cln_name || '');
  const [townshipId, setTownshipId] = useState<number | undefined>(
    clinic?.cln_tsp_id
  );

  const [townships, setTownships] = useState<Township[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [tspError, setTspError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTownshipsDropdown().then((res: any) => {
      setTownships(res.data || []);
    });
  }, []);

  const filtered = townships.filter(t =>
    t.tsp_name.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Required');
      valid = false;
    }

    if (!name.trim()) {
      setNameError('Required');
      valid = false;
    }

    if (!townshipId) {
      setTspError('Required');
      valid = false;
    }

    return valid;
  };

  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        cln_code: code,
        cln_name: name,
        cln_tsp_id: townshipId
      };

      if (clinic) {
        await updateClinic(clinic.cln_id, payload);
      } else {
        await createClinic(payload);
      }

      Alert.alert('Success');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const selected = townships.find(t => t.tsp_id === townshipId);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      <Title>{clinic ? 'Edit Clinic' : 'Create Clinic'}</Title>

      <TextInput label="Code *" value={code} onChangeText={setCode} />
      <HelperText type="error">{codeError}</HelperText>

      <TextInput label="Name *" value={name} onChangeText={setName} />
      <HelperText type="error">{nameError}</HelperText>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          label="Township *"
          value={selected?.tsp_name || ''}
          editable={false}
        />
      </TouchableOpacity>
      <HelperText type="error">{tspError}</HelperText>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{ backgroundColor: 'white', margin: 20, padding: 10, maxHeight: '80%' }}>

          <TextInput
            placeholder="Search township..."
            value={search}
            onChangeText={setSearch}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.tsp_id.toString()}
            renderItem={({ item }) => (
              <Button onPress={() => {
                setTownshipId(item.tsp_id);
                setModalVisible(false);
                setTspError('');
              }}>
                {item.tsp_name}
              </Button>
            )}
          />
        </Modal>
      </Portal>

      <Button mode="contained" onPress={handleSave} loading={loading}>
        Save
      </Button>

    </ScrollView>
  );
}