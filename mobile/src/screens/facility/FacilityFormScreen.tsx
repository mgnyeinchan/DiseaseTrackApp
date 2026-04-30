import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
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
  createFacility,
  updateFacility,
  getDivisionsDropdown,
  getTownshipsDropdown,
  getOrgsDropdown
} from '../../services/facilityApi';

export default function FacilityFormScreen({ route, navigation }: any) {

  const facility = route.params?.facility;

  const [code, setCode] = useState(facility?.facility_code || '');
  const [name, setName] = useState(facility?.facility_name || '');

  const [divId, setDivId] = useState(facility?.facility_div_id);
  const [tspId, setTspId] = useState(facility?.facility_tsp_id);
  const [orgId, setOrgId] = useState(facility?.facility_org_id);

  const [divisions, setDivisions] = useState<any[]>([]);
  const [townships, setTownships] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);

  const [modalType, setModalType] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);

  const [codeError, setCodeError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    getDivisionsDropdown().then(res => setDivisions(res.data || []));
    getTownshipsDropdown().then(res => setTownships(res.data || []));
    getOrgsDropdown().then(res => setOrgs(res.data || []));
  }, []);

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

    return valid;
  };

  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        facility_code: code,
        facility_name: name,
        facility_div_id: divId,
        facility_tsp_id: tspId,
        facility_org_id: orgId
      };

      if (facility) await updateFacility(facility.facility_id, payload);
      else await createFacility(payload);

      Alert.alert('Success');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const list =
    modalType === 'div' ? divisions :
    modalType === 'tsp' ? townships :
    orgs;

  const filtered = list.filter((i: any) =>
    (i.div_name || i.tsp_name || i.org_name)
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      {/* 🔥 Title */}
      <Title style={{ marginBottom: 20 }}>
        {facility ? 'Edit Facility' : 'Create Facility'}
      </Title>

      {/* 🔹 Basic Info */}
      <View style={{ marginBottom: 20 }}>

        <TextInput
          label="Facility Code *"
          value={code}
          onChangeText={setCode}
          mode="outlined"
          style={{ marginBottom: 5 }}
          error={!!codeError}
        />
        <HelperText type="error" visible={!!codeError}>
          {codeError}
        </HelperText>

        <TextInput
          label="Facility Name *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={{ marginBottom: 5 }}
          error={!!nameError}
        />
        <HelperText type="error" visible={!!nameError}>
          {nameError}
        </HelperText>

      </View>

      <Divider style={{ marginVertical: 10 }} />

      {/* 🔹 Location Section */}
      <View style={{ marginBottom: 20 }}>

        <TouchableOpacity onPress={() => setModalType('div')}>
          <TextInput
            label="Division"
            value={divisions.find(d => d.div_id === divId)?.div_name || ''}
            mode="outlined"
            editable={false}
            style={{ marginBottom: 10 }}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalType('tsp')}>
          <TextInput
            label="Township"
            value={townships.find(t => t.tsp_id === tspId)?.tsp_name || ''}
            mode="outlined"
            editable={false}
            style={{ marginBottom: 10 }}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalType('org')}>
          <TextInput
            label="Organization"
            value={orgs.find(o => o.org_id === orgId)?.org_name || ''}
            mode="outlined"
            editable={false}
            style={{ marginBottom: 10 }}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </TouchableOpacity>

      </View>

      {/* 🔥 Modal */}
      <Portal>
        <Modal
          visible={!!modalType}
          onDismiss={() => setModalType(null)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            padding: 15,
            borderRadius: 10,
            maxHeight: '80%'
          }}
        >

          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item: any) =>
              String(item.div_id || item.tsp_id || item.org_id)
            }
            renderItem={({ item }) => (
              <Button
                style={{ alignItems: 'flex-start' }}
                onPress={() => {
                  if (modalType === 'div') setDivId(item.div_id);
                  if (modalType === 'tsp') setTspId(item.tsp_id);
                  if (modalType === 'org') setOrgId(item.org_id);
                  setModalType(null);
                }}
              >
                {item.div_name || item.tsp_name || item.org_name}
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
        style={{ marginTop: 10 }}
      >
        {facility ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}