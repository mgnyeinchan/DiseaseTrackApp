import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  View
} from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title,
  Portal,
  Modal,
  Divider
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

  // 🔥 form state
  const [code, setCode] = useState(clinic?.cln_code || '');
  const [name, setName] = useState(clinic?.cln_name || '');
  const [townshipId, setTownshipId] = useState<number | null>(
    clinic?.cln_tsp_id || null
  );

  const [townships, setTownships] = useState<Township[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  // 🔥 error state
  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [tspError, setTspError] = useState('');

  // 🔥 loading
  const [loading, setLoading] = useState(false);

  // 🔥 load dropdown
  useEffect(() => {
    getTownshipsDropdown()
      .then((res: any) => setTownships(res.data || []))
      .catch(() => {
        setTownships([]);
        Alert.alert('Error', 'Failed to load township');
      });
  }, []);

  // 🔥 filter dropdown
  const filtered = townships.filter(t =>
    t.tsp_name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 validation
  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Clinic code is required');
      valid = false;
    } else setCodeError('');

    if (!name.trim()) {
      setNameError('Clinic name is required');
      valid = false;
    } else setNameError('');

    if (!townshipId) {
      setTspError('Township is required');
      valid = false;
    } else setTspError('');

    return valid;
  };

  // 🔥 save (create + update)
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

      Alert.alert(
        'Success',
        clinic ? 'Updated successfully' : 'Created successfully'
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

  const selected = townships.find(t => t.tsp_id === townshipId);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      {/* 🔥 Title */}
      <Title style={{ marginBottom: 20 }}>
        {clinic ? 'Edit Clinic' : 'Create Clinic'}
      </Title>

      {/* 🔹 Basic Info */}
      <View style={{ marginBottom: 20 }}>

        <TextInput
          label="Clinic Code *"
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
          label="Clinic Name *"
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

      {/* 🔹 Township */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          label="Township *"
          value={selected?.tsp_name || ''}
          mode="outlined"
          editable={false}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>

      <HelperText type="error" visible={!!tspError}>
        {tspError}
      </HelperText>

      {/* 🔥 Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            padding: 15,
            borderRadius: 10,
            maxHeight: '80%'
          }}
        >

          <TextInput
            placeholder="Search township..."
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.tsp_id.toString()}
            renderItem={({ item }) => (
              <Button
                style={{ alignItems: 'flex-start' }}
                onPress={() => {
                  setTownshipId(item.tsp_id);
                  setModalVisible(false);
                  setTspError('');
                }}
              >
                {item.tsp_name}
              </Button>
            )}
          />
        </Modal>
      </Portal>

      {/* 🔥 Save Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {clinic ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}