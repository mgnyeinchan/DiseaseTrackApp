import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Title,
  Portal,
  Modal,
  Text
} from 'react-native-paper';
import { TouchableOpacity, FlatList } from 'react-native';

import {
  createVillage,
  updateVillage,
  getTownshipsDropdown
} from '../../services/villageApi';

type Township = {
  tsp_id: number;
  tsp_name: string;
};

export default function VillageFormScreen({ route, navigation }: any) {

  const village = route.params?.village;

  // 🔥 BASIC
  const [code, setCode] = useState(village?.village_code || '');
  const [name, setName] = useState(village?.village_name || '');
  const [nameMM, setNameMM] = useState(village?.village_namemm || '');

  // 🔥 ADVANCED
  const [malePop, setMalePop] = useState(village?.village_malepop?.toString() || '');
  const [femalePop, setFemalePop] = useState(village?.village_femalepop?.toString() || '');
  const [household, setHousehold] = useState(village?.village_household?.toString() || '');
  const [latitude, setLatitude] = useState(village?.village_latitude?.toString() || '');
  const [longitude, setLongitude] = useState(village?.village_longitude?.toString() || '');
  const [remark, setRemark] = useState(village?.village_remark || '');

  const [status, setStatus] = useState<number>(village?.village_status ?? 1);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // 🔥 Township
  const [townshipId, setTownshipId] = useState<number | undefined>(
    village?.village_tsp_id
  );

  const [townships, setTownships] = useState<Township[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTownship, setSearchTownship] = useState('');

  // 🔥 status dropdown
  const [statusModal, setStatusModal] = useState(false);

  // 🔥 errors
  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [townshipError, setTownshipError] = useState('');

  const [loading, setLoading] = useState(false);

  // 🔥 load township
  useEffect(() => {
    getTownshipsDropdown()
      .then((res: any) => {
        if (Array.isArray(res.data)) setTownships(res.data);
      })
      .catch(() => Alert.alert('Error', 'Failed to load township'));
  }, []);

  const filteredTownships = townships.filter(t =>
    t.tsp_name.toLowerCase().includes(searchTownship.toLowerCase())
  );

  // 🔥 validation
  const validate = () => {
    let valid = true;

    if (!code.trim()) {
      setCodeError('Required');
      valid = false;
    } else setCodeError('');

    if (!name.trim()) {
      setNameError('Required');
      valid = false;
    } else setNameError('');

    if (!townshipId) {
      setTownshipError('Required');
      valid = false;
    } else setTownshipError('');

    return valid;
  };

  // 🔥 save
  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        village_code: code,
        village_name: name,
        village_namemm: nameMM,
        village_malepop: Number(malePop) || 0,
        village_femalepop: Number(femalePop) || 0,
        village_household: Number(household) || 0,
        village_latitude: Number(latitude) || null,
        village_longitude: Number(longitude) || null,
        village_status: status,
        village_remark: remark,
        village_tsp_id: townshipId
      };

      if (village) {
        await updateVillage(village.village_id, payload);
      } else {
        await createVillage(payload);
      }

      Alert.alert('Success', village ? 'Updated' : 'Created');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedTownship = townships.find(t => t.tsp_id === townshipId);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      <Title>{village ? 'Edit Village' : 'Create Village'}</Title>

      {/* 🔥 Code + Name (ROW FIX) */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextInput label="Code *" value={code} onChangeText={setCode} mode="outlined" />
          <HelperText type="error" visible={!!codeError}>{codeError}</HelperText>
        </View>

        <View style={{ flex: 1 }}>
          <TextInput label="Name *" value={name} onChangeText={setName} mode="outlined" />
          <HelperText type="error" visible={!!nameError}>{nameError}</HelperText>
        </View>
      </View>

      {/* Name MM */}
      <TextInput
        label="Name (MM)"
        value={nameMM}
        onChangeText={setNameMM}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      {/* Township */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          label="Township *"
          value={selectedTownship?.tsp_name || ''}
          mode="outlined"
          editable={false}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>
      <HelperText type="error" visible={!!townshipError}>
        {townshipError}
      </HelperText>

      {/* 🔥 Status Dropdown */}
      <TouchableOpacity onPress={() => setStatusModal(true)}>
        <TextInput
          label="Status"
          value={status === 1 ? 'Active' : 'Inactive'}
          mode="outlined"
          editable={false}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>

      {/* 🔥 ADVANCED TOGGLE */}
      <Button
        mode="text"
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide Advanced ▲' : 'Show Advanced ▼'}
      </Button>

      {/* 🔥 ADVANCED SECTION */}
      {showAdvanced && (
        <>
          <TextInput label="Male Population" value={malePop} onChangeText={setMalePop} keyboardType="numeric" mode="outlined" />
          <TextInput label="Female Population" value={femalePop} onChangeText={setFemalePop} keyboardType="numeric" mode="outlined" />
          <TextInput label="Household" value={household} onChangeText={setHousehold} keyboardType="numeric" mode="outlined" />
          <TextInput label="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="numeric" mode="outlined" />
          <TextInput label="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="numeric" mode="outlined" />
          <TextInput label="Remark" value={remark} onChangeText={setRemark} mode="outlined" multiline />
        </>
      )}

      {/* 🔥 SAVE */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {village ? 'Update' : 'Create'}
      </Button>

      {/* 🔽 Township Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{ backgroundColor: 'white', margin: 20, padding: 10, borderRadius: 10, maxHeight: '70%' }}>

          <TextInput
            placeholder="Search township..."
            value={searchTownship}
            onChangeText={setSearchTownship}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={filteredTownships}
            keyExtractor={(item) => item.tsp_id.toString()}
            renderItem={({ item }) => (
              <Button onPress={() => {
                setTownshipId(item.tsp_id);
                setModalVisible(false);
              }}>
                {item.tsp_name}
              </Button>
            )}
          />
        </Modal>
      </Portal>

      {/* 🔽 Status Modal */}
      <Portal>
        <Modal visible={statusModal} onDismiss={() => setStatusModal(false)}
          contentContainerStyle={{ backgroundColor: 'white', margin: 20, padding: 10, borderRadius: 10 }}>

          <Button onPress={() => { setStatus(1); setStatusModal(false); }}>
            Active
          </Button>

          <Button onPress={() => { setStatus(0); setStatusModal(false); }}>
            Inactive
          </Button>

        </Modal>
      </Portal>

    </ScrollView>
  );
}