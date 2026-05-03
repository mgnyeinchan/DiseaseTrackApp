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
  Title,
  Portal,
  Modal,
  HelperText,
  Card,
  Text,
  ActivityIndicator
} from 'react-native-paper';

import {
  createSurveillance,
  updateSurveillance,
  getSurveillanceById,
  getFacilities,
  getTownships,
  getAgegroups,
  getSources
} from '../../services/surveillanceApi';

export default function SurveillanceFormScreen({ route, navigation }: any) {

  const id = route.params?.id;

  // ✅ spacing system
  const FIELD_SPACE = 8;
  const SECTION_SPACE = 14;

  // 🔹 form state
  const [form, setForm] = useState<any>({
    facility_id: null,
    reporter_name: '',
    report_date: '',
    report_reason: '',
    report_by_audio: '',
    awarenesssource_id: null,

    event_datetime: '',
    event_tsp_id: null,
    event_location_detail: '',
    agegroup_id: null,

    total_cases: '',
    total_deaths: '',
    hospitalized_count: '',
    at_risk_count: '',

    triage_result: '',
    verification_result: '',
    event_assessment: '',
    reported_to_higher_date: '',
    response_actions: '',
    recorded_by: ''
  });

  // dropdown data
  const [facilities, setFacilities] = useState<any[]>([]);
  const [townships, setTownships] = useState<any[]>([]);
  const [agegroups, setAgegroups] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);

  const [modalType, setModalType] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // 🔹 load dropdowns
  useEffect(() => {
    Promise.all([
      getFacilities(),
      getTownships(),
      getAgegroups(),
      getSources()
    ]).then(([f, t, a, s]) => {
      setFacilities(f.data || []);
      setTownships(t.data || []);
      setAgegroups(a.data || []);
      setSources(s.data || []);
    });
  }, []);

  // 🔹 edit mode
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoadingData(true);
        const res = await getSurveillanceById(id);
        setForm({
        ...res.data,

        total_cases: String(res.data.total_cases || ''),
        total_deaths: String(res.data.total_deaths || ''),
        hospitalized_count: String(res.data.hospitalized_count || ''),
        at_risk_count: String(res.data.at_risk_count || '')
        });
      } catch (err: any) {
        Alert.alert('Error', err.message);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [id]);

  // 🔹 selected values
  const selectedFacility = facilities.find(f => f.facility_id === form.facility_id);
  const selectedTsp = townships.find(t => t.tsp_id === form.event_tsp_id);
  const selectedAge = agegroups.find(a => a.agegroup_id === form.agegroup_id);
  const selectedSource = sources.find(s => s.id === form.awarenesssource_id);

  // 🔹 validation
  const validate = () => {
    if (!form.facility_id) return Alert.alert('ယူနစ်ရွေးပါ'), false;
    if (!form.reporter_name) return Alert.alert('သတင်းပို့သူအမည်လိုအပ်သည်'), false;
    if (!form.report_date) return Alert.alert('နေ့စွဲလိုအပ်သည်'), false;
    return true;
  };

  // 🔹 save
  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        total_cases: Number(form.total_cases) || 0,
        total_deaths: Number(form.total_deaths) || 0,
        hospitalized_count: Number(form.hospitalized_count) || 0,
        at_risk_count: Number(form.at_risk_count) || 0
      };

      if (id) await updateSurveillance(id, payload);
      else await createSurveillance(payload);

      Alert.alert('Success', id ? 'Updated successfully' : 'Created successfully');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 dropdown list
  const getList = () => {
    switch (modalType) {
      case 'facility': return facilities;
      case 'tsp': return townships;
      case 'age': return agegroups;
      case 'source': return sources;
      default: return [];
    }
  };

  const filteredList = getList().filter((item: any) =>
    (
      item.facility_name ||
      item.tsp_name ||
      item.agegroup_name ||
      item.source_name ||
      ''
    ).toLowerCase().includes(search.toLowerCase())
  );

  if (loadingData) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15 }}>

      <Title style={{ marginBottom: 15 }}>
        Event-based Surveillance Form
      </Title>

      {/* ================= Info ================= */}
      <Card style={{ marginBottom: SECTION_SPACE }}>
        <Card.Content>

          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            သတင်းအချက်အလက်
          </Text>

          {/* Facility */}
          <TouchableOpacity onPress={() => setModalType('facility')}>
            <TextInput
              label="အစီရင်ခံသည့် ယူနစ်အမည် *"
              value={selectedFacility?.facility_name || ''}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          </TouchableOpacity>

          {selectedFacility && (
            <>
              <TextInput label="အမျိုးအစား" value={selectedFacility.facility_type} editable={false} style={{ marginTop: FIELD_SPACE }} />
              <TextInput label="မြို့နယ်" value={selectedFacility.tsp_name} editable={false} style={{ marginTop: FIELD_SPACE }} />
              <TextInput label="အဖွဲ့အစည်း" value={selectedFacility.org_name} editable={false} style={{ marginTop: FIELD_SPACE }} />
            </>
          )}

          <TextInput
            label="သတင်းပို့သူအမည် *"
            value={form.reporter_name}
            onChangeText={t => setForm({ ...form, reporter_name: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput
            label="သတင်းပို့သည့်နေ့ *"
            value={form.report_date}
            onChangeText={t => setForm({ ...form, report_date: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput
            label="သတင်းပို့သည့်အကြောင်းအရာ"
            value={form.report_reason}
            onChangeText={t => setForm({ ...form, report_reason: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput
            label="အသံဖြင့် သတင်းပို့ရန်"
            value={form.report_by_audio}
            onChangeText={t => setForm({ ...form, report_by_audio: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          {/* Source */}
          <TouchableOpacity onPress={() => setModalType('source')}>
            <TextInput
              label="သတင်းရရှိရာ"
              value={selectedSource?.source_name || ''}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={{ marginTop: FIELD_SPACE }}
            />
          </TouchableOpacity>

          {/* Event */}
          <TextInput
            label="ဖြစ်ခဲ့သော ရက်စွဲနှင့် အချိန်"
            value={form.event_datetime}
            onChangeText={t => setForm({ ...form, event_datetime: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TouchableOpacity onPress={() => setModalType('tsp')}>
            <TextInput
              label="ဖြစ်ခဲ့သော မြို့နယ်"
              value={selectedTsp?.tsp_name || ''}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={{ marginTop: FIELD_SPACE }}
            />
          </TouchableOpacity>

          <TextInput
            label="နေရာအသေးစိတ်"
            value={form.event_location_detail}
            onChangeText={t => setForm({ ...form, event_location_detail: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TouchableOpacity onPress={() => setModalType('age')}>
            <TextInput
              label="အသက်အုပ်စု"
              value={selectedAge?.agegroup_name || ''}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={{ marginTop: FIELD_SPACE }}
            />
          </TouchableOpacity>

          {/* Numbers */}
          <TextInput label="ဖြစ်ပွားသူ" keyboardType="numeric"
            value={form.total_cases}
            onChangeText={t => setForm({ ...form, total_cases: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="သေဆုံးသူ" keyboardType="numeric"
            value={form.total_deaths}
            onChangeText={t => setForm({ ...form, total_deaths: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="ဆေးရုံတက်" keyboardType="numeric"
            value={form.hospitalized_count}
            onChangeText={t => setForm({ ...form, hospitalized_count: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="နောက်ထပ်အန္တရာယ်ရှိသူ" keyboardType="numeric"
            value={form.at_risk_count}
            onChangeText={t => setForm({ ...form, at_risk_count: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

        </Card.Content>
      </Card>

      {/* ================= Triage ================= */}
      <Card style={{ marginBottom: SECTION_SPACE }}>
        <Card.Content>

          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Triage / Verification / Assessment
          </Text>

          <TextInput label="Triage ရလဒ်"
            value={form.triage_result}
            onChangeText={t => setForm({ ...form, triage_result: t })}
            mode="outlined"
          />

          <TextInput label="Verification ရလဒ်"
            value={form.verification_result}
            onChangeText={t => setForm({ ...form, verification_result: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="Event assessment"
            value={form.event_assessment}
            onChangeText={t => setForm({ ...form, event_assessment: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="အထက်သို့ အကြောင်းကြားသည့်နေ့"
            value={form.reported_to_higher_date}
            onChangeText={t => setForm({ ...form, reported_to_higher_date: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="လုပ်ဆောင်ချက်များ"
            value={form.response_actions}
            onChangeText={t => setForm({ ...form, response_actions: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

          <TextInput label="မှတ်တမ်းတင်သူ"
            value={form.recorded_by}
            onChangeText={t => setForm({ ...form, recorded_by: t })}
            mode="outlined"
            style={{ marginTop: FIELD_SPACE }}
          />

        </Card.Content>
      </Card>

      {/* Dropdown Modal */}
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
            placeholder="ရှာရန်..."
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={filteredList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Button
                style={{ alignItems: 'flex-start' }}
                onPress={() => {
                  if (modalType === 'facility')
                    setForm({ ...form, facility_id: item.facility_id });

                  if (modalType === 'tsp')
                    setForm({ ...form, event_tsp_id: item.tsp_id });

                  if (modalType === 'age')
                    setForm({ ...form, agegroup_id: item.agegroup_id });

                  if (modalType === 'source')
                    setForm({ ...form, awarenesssource_id: item.id });

                  setModalType(null);
                  setSearch('');
                }}
              >
                {item.facility_name ||
                  item.tsp_name ||
                  item.agegroup_name ||
                  item.source_name}
              </Button>
            )}
          />
        </Modal>
      </Portal>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 10 }}
      >
        {id ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}