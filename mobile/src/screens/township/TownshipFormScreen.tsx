import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title,
  Menu,
  Modal
} from 'react-native-paper';

import {
  createTownship,
  updateTownship,
  getDivisions
} from '../../services/townshipApi';
import { Portal } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

type Division = {
  div_id: number;
  div_name: string;
};

export default function TownshipFormScreen({ route, navigation }: any) {

  const township = route.params?.township;

  // 🔥 form state
  const [code, setCode] = useState(township?.tsp_code || '');
  const [name, setName] = useState(township?.tsp_name || '');
  const [divisionId, setDivisionId] = useState<number | null>(
    township?.tps_div_id || null
  );

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // 🔥 error state (same pattern as project)
  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [divisionError, setDivisionError] = useState('');

  // 🔥 loading
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  // 🔥 load divisions
  useEffect(() => {
    getDivisions()
      .then(res => setDivisions(res.data))
      .catch(() => setDivisions([]));
  }, []);

  // 🔥 validation (same pattern)
  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Township code is required');
      valid = false;
    } else setCodeError('');

    if (!name.trim()) {
      setNameError('Township name is required');
      valid = false;
    } else setNameError('');

    if (!divisionId) {
      setDivisionError('Division is required');
      valid = false;
    } else setDivisionError('');

    return valid;
  };

  // 🔥 save
  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        tsp_code: code,
        tsp_name: name,
        tps_div_id: divisionId
      };

      if (township) {
        await updateTownship(township.tsp_id, payload);
      } else {
        await createTownship(payload);
      }

      Alert.alert(
        'Success',
        township ? 'Updated successfully' : 'Created successfully'
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

  // 🔥 selected division name
  const selectedDivision = divisions.find(d => d.div_id === divisionId);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      {/* 🔥 Title */}
      <Title style={{ marginBottom: 20 }}>
        {township ? 'Edit Township' : 'Create Township'}
      </Title>

      {/* 🔥 Code */}
      <TextInput
        label="Township Code *"
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

      {/* 🔥 Name */}
      <TextInput
        label="Township Name *"
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

      {/* 🔥 Division Dropdown (FIXED UI) */}
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <TextInput
            label="Division *" // 🔥 better label
            value={selectedDivision?.div_name || ''}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 10,
            padding: 10
          }}
        >

          {/* All option */}
          <Button
            onPress={() => {
              setDivisionId(null);
              setModalVisible(false);
            }}
          >
            All
          </Button>

          {divisions.map(d => (
            <Button
              key={d.div_id}
              onPress={() => {
                setDivisionId(d.div_id);
                setModalVisible(false);
              }}
            >
              {d.div_name}
            </Button>
          ))}

        </Modal>
      </Portal>

      <HelperText type="error" visible={!!divisionError}>
        {divisionError}
      </HelperText>

      {/* 🔥 Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
      >
        {township ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}