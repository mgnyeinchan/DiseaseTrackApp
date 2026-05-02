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
  ActivityIndicator,
  HelperText,
  Card,
  Text,
  Checkbox
} from 'react-native-paper';

import {
  createWeeklyReport,
  updateWeeklyReport,
  getWeeklyReportById
} from '../../services/weeklyreportApi';
import { getFacilitiesDropdown } from '../../services/facilityApi';
import { getWeeklyDropdown } from '../../services/diseaseApi';

type Facility = {
  facility_id: number;
  facility_name: string;
  facility_type: string;
  facility_tsp_name: string;
  facility_org_name: string;
};

export default function WeeklyReportFormScreen({ route, navigation }: any) {

  const id = route.params?.id;

  // 🔹 form state
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [date, setDate] = useState('');
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');
  const [facilityId, setFacilityId] = useState<number | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // 🔴 errors
  const [nameError, setNameError] = useState('');
  const [positionError, setPositionError] = useState('');
  const [dateError, setDateError] = useState('');
  const [weekError, setWeekError] = useState('');
  const [yearError, setYearError] = useState('');
  const [facilityError, setFacilityError] = useState('');

  // ✅ spacing system (FIXED)
  const FIELD_SPACE = 6;
  const SECTION_SPACE = 10;

  // disease lists start
  const [diseases, setDiseases] = useState<any[]>([]); // dropdown list

  const [selectedDiseases, setSelectedDiseases] = useState<number[]>([]);

  const [diseaseForms, setDiseaseForms] = useState<any>({});

  const getEmptyForm = (disease_id: number) => ({
    disease_id,

    male_under5_cases: '',
    female_under5_cases: '',
    male_over5_cases: '',
    female_over5_cases: '',

    male_under5_deaths: '',
    female_under5_deaths: '',
    male_over5_deaths: '',
    female_over5_deaths: '',

    total_cases: 0,
    total_deaths: 0,
    grand_total: 0
  });

  const toggleDisease = (id: number) => {
    if (selectedDiseases.includes(id)) {
      // ❌ UNCHECK
      setSelectedDiseases(prev => prev.filter(d => d !== id));

      // remove form data
      const updated = { ...diseaseForms };
      delete updated[id];
      setDiseaseForms(updated);

    } else {
      // ✅ CHECK
      setSelectedDiseases(prev => [...prev, id]);

      setDiseaseForms((prev:any) => ({
        ...prev,
        [id]: getEmptyForm(id)
      }));
    }
  };

  const calculateTotals = (form: any) => {
    const total_cases =
      (+form.male_under5_cases || 0) +
      (+form.female_under5_cases || 0) +
      (+form.male_over5_cases || 0) +
      (+form.female_over5_cases || 0);

    const total_deaths =
      (+form.male_under5_deaths || 0) +
      (+form.female_under5_deaths || 0) +
      (+form.male_over5_deaths || 0) +
      (+form.female_over5_deaths || 0);

    return {
      ...form,
      total_cases,
      total_deaths,
      grand_total: total_cases + total_deaths
    };
  };
  
  const updateField = (disease_id: number, field: string, value: string) => {
    const updated = {
      ...diseaseForms[disease_id],
      [field]: value.replace(/[^0-9]/g, '')
    };

    setDiseaseForms((prev:any) => ({
      ...prev,
      [disease_id]: calculateTotals(updated)
    }));
  };
  // disease lists end

  // fetch data
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoadingData(true);
        const res = await getWeeklyReportById(id);
        const d = res.data;

        setName(d.reporter_name || '');
        setPosition(d.reporter_position || '');
        setDate(d.report_date || '');
        setWeek(d.report_week?.toString() || '');
        setYear(d.report_year?.toString() || '');
        setFacilityId(d.facility_id || null);

        if (d.diseases && d.diseases.length > 0) {

          // 1. selected ids
          const ids = d.diseases.map((item: any) => item.disease_id);
          setSelectedDiseases(ids);

          // 2. form data
          const forms: any = {};

          d.diseases.forEach((item: any) => {
            forms[item.disease_id] = {
              disease_id: item.disease_id,

              male_under5_cases: String(item.male_under5_cases || ''),
              female_under5_cases: String(item.female_under5_cases || ''),
              male_over5_cases: String(item.male_over5_cases || ''),
              female_over5_cases: String(item.female_over5_cases || ''),

              male_under5_deaths: String(item.male_under5_deaths || ''),
              female_under5_deaths: String(item.female_under5_deaths || ''),
              male_over5_deaths: String(item.male_over5_deaths || ''),
              female_over5_deaths: String(item.female_over5_deaths || ''),

              total_cases: item.total_cases || 0,
              total_deaths: item.total_deaths || 0,
              grand_total: item.grand_total || 0
            };
          });

          setDiseaseForms(forms);
        }

      } catch (err: any) {
        Alert.alert('Error', err.message);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [id]);

  // facilities
  useEffect(() => {
    getFacilitiesDropdown()
      .then((res: any) => {
        const mapped = (res.data || []).map((f: any) => ({
          facility_id: f.facility_id,
          facility_name: f.facility_name,
          facility_type: f.facility_type,
          facility_tsp_name: f.tsp_name,
          facility_org_name: f.org_name
        }));
        setFacilities(mapped);
      })
      .catch(() => Alert.alert('Error', 'Failed to load facility'));
    
    getWeeklyDropdown()
    .then((res: any) => {
      setDiseases(res.data || []);
    })
    .catch(() => Alert.alert('Error', 'Failed to load diseases'));
  }, []);

  const selected = facilities.find(f => f.facility_id === facilityId);

  // date calc
  const getStartEndDate = () => {
    if (!week || !year) return { start: '', end: '' };

    const firstDay = new Date(Number(year), 0, 1);
    const start = new Date(firstDay.getTime() + (Number(week) - 1) * 7 * 86400000);
    const end = new Date(start.getTime() + 6 * 86400000);

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const { start, end } = getStartEndDate();

  // validation
  const validate = () => {
    let valid = true;

    if (!name.trim()) { setNameError('လိုအပ်သည်'); valid = false; } else setNameError('');
    if (!position.trim()) { setPositionError('လိုအပ်သည်'); valid = false; } else setPositionError('');
    if (!date) { setDateError('လိုအပ်သည်'); valid = false; } else setDateError('');

    if (!week) {
      setWeekError('လိုအပ်သည်'); valid = false;
    } else if (+week < 1 || +week > 52) {
      setWeekError('1-52'); valid = false;
    } else setWeekError('');

    if (!year) { setYearError('လိုအပ်သည်'); valid = false; } else setYearError('');
    if (!facilityId) { setFacilityError('ရွေးပါ'); valid = false; } else setFacilityError('');

    return valid;
  };

  // save
  const handleSave = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      // 🔹 disease payload
      const diseasePayload = selectedDiseases.map(id => ({
        ...diseaseForms[id],

        disease_id: id,

        male_under5_cases: Number(diseaseForms[id].male_under5_cases) || 0,
        female_under5_cases: Number(diseaseForms[id].female_under5_cases) || 0,
        male_over5_cases: Number(diseaseForms[id].male_over5_cases) || 0,
        female_over5_cases: Number(diseaseForms[id].female_over5_cases) || 0,

        male_under5_deaths: Number(diseaseForms[id].male_under5_deaths) || 0,
        female_under5_deaths: Number(diseaseForms[id].female_under5_deaths) || 0,
        male_over5_deaths: Number(diseaseForms[id].male_over5_deaths) || 0,
        female_over5_deaths: Number(diseaseForms[id].female_over5_deaths) || 0,

        total_cases: diseaseForms[id].total_cases,
        total_deaths: diseaseForms[id].total_deaths,
        grand_total: diseaseForms[id].grand_total
      }));


      // 🔹 weekly payload
      const payload = {
        reporter_name: name,
        reporter_position: position,
        report_date: date,
        report_week: Number(week),
        report_year: Number(year),
        report_start_date: start,
        report_end_date: end,
        facility_id: facilityId,

        // include diseases
        diseases: diseasePayload
      };


      if (id) {
        await updateWeeklyReport(id, payload);
      } else {
        await createWeeklyReport(payload);
      }

      Alert.alert('Success', id ? 'Updated Successfully' : 'Created Successfully');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = facilities.filter(f =>
    f.facility_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loadingData) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15 }}>

      <Title style={{ marginBottom: 15 }}>
        {id ? 'အစီရင်ခံစာ ပြင်ဆင်ရန်' : 'အစီရင်ခံစာ အသစ်'}
      </Title>

      {/* ================= Reporter ================= */}
      <Card style={{ marginBottom: SECTION_SPACE }}>
        <Card.Content>
          <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
            အစီရင်ခံသူ
          </Text>

          <TextInput
            label="အမည် *"
            mode="outlined"
            value={name}
            onChangeText={(v) => { setName(v); setNameError(''); }}
            style={{ marginBottom: 2 }}
          />
          {nameError? <HelperText type="error">{nameError}</HelperText> :null}

          <TextInput
            label="ရာထူး *"
            mode="outlined"
            value={position}
            onChangeText={(v) => { setPosition(v); setPositionError(''); }}
            style={{ marginTop: FIELD_SPACE, marginBottom: 2 }}
          />
          {positionError? <HelperText type="error">{positionError}</HelperText> :null}
        </Card.Content>
      </Card>

      {/* ================= Report ================= */}
      <Card style={{ marginBottom: SECTION_SPACE }}>
        <Card.Content>
          <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
            အစီရင်ခံအချက်အလက်
          </Text>

          <TextInput
            label="ရက်စွဲ *"
            mode="outlined"
            value={date}
            onChangeText={setDate}
            style={{ marginBottom: 2 }}
          />
          {dateError? <HelperText type="error">{dateError}</HelperText> :null}

          <TextInput
            label="သီတင်းပတ် *"
            mode="outlined"
            value={week}
            onChangeText={(t) => setWeek(t.replace(/[^0-9]/g, ''))}
            style={{ marginTop: FIELD_SPACE, marginBottom: 2 }}
          />
          {weekError? <HelperText type="error">{weekError}</HelperText> :null}

          <TextInput
            label="နှစ် *"
            mode="outlined"
            value={year}
            onChangeText={(t) => setYear(t.replace(/[^0-9]/g, ''))}
            style={{ marginTop: FIELD_SPACE, marginBottom: 6 }}
          />
          {yearError? <HelperText type="error">{yearError}</HelperText> :null}

          <TextInput label="စတင်နေ့" value={start} mode="outlined" editable={false} style={{ marginBottom: 6 }} />
          <TextInput label="ပြီးဆုံးနေ့" value={end} mode="outlined" editable={false} />
        </Card.Content>
      </Card>

      {/* ================= Facility ================= */}
      <Card style={{ marginBottom: SECTION_SPACE }}>
        <Card.Content>
          <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
            ယူနစ်
          </Text>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <TextInput
              label="ယူနစ်အမည် *"
              mode="outlined"
              value={selected?.facility_name || ''}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={{ marginBottom: 2 }}
            />
          </TouchableOpacity>

          {facilityError? <HelperText type="error">{facilityError}</HelperText> :null}

          {selected && (
            <>
              <TextInput
                label="အမျိုးအစား"
                value={selected.facility_type}
                mode="outlined"
                editable={false}
                style={{ marginTop: FIELD_SPACE }}
              />
              <TextInput
                label="မြို့နယ်"
                value={selected.facility_tsp_name}
                mode="outlined"
                editable={false}
                style={{ marginTop: FIELD_SPACE }}
              />
              <TextInput
                label="အဖွဲ့အစည်း"
                value={selected.facility_org_name}
                mode="outlined"
                editable={false}
                style={{ marginTop: FIELD_SPACE }}
              />
            </>
          )}

          {/* ===== Disease Selection ===== */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              ရောဂါရွေးချယ်ရန်
            </Text>

            {diseases.map(d => (
              <TouchableOpacity
                key={d.disease_id}
                onPress={() => toggleDisease(d.disease_id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6
                }}
              >
                <Checkbox
                  status={
                    selectedDiseases.includes(d.disease_id)
                      ? 'checked'
                      : 'unchecked'
                  }
                />
                <Text>{d.disease_name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedDiseases.map(id => {
            const form = diseaseForms[id];
            const disease = diseases.find(d => d.disease_id === id);

            return (
              <Card key={id} style={{ marginBottom: 15 }}>
                <Card.Content>
                  <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                    {disease?.disease_name}
                  </Text>

                  {/* UNDER 5 CASES */}
                  <TextInput
                    label="ဖြစ်ပွားမှု အမျိုးသား (အသက် ၅နှစ်အောက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.male_under5_cases}
                    onChangeText={v => updateField(id, 'male_under5_cases', v)}
                    style={{ marginBottom: 8 }}
                  />

                  <TextInput
                    label="ဖြစ်ပွားမှု အမျိုးသမီး (အသက် ၅နှစ်အောက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.female_under5_cases}
                    onChangeText={v => updateField(id, 'female_under5_cases', v)}
                    style={{ marginBottom: 8 }}
                  />

                  {/* UNDER 5 DEATHS */}
                  <TextInput
                    label="သေဆုံးမှု အမျိုးသား (အသက် ၅နှစ်အောက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.male_under5_deaths}
                    onChangeText={v => updateField(id, 'male_under5_deaths', v)}
                    style={{ marginBottom: 8 }}
                  />

                  <TextInput
                    label="သေဆုံးမှု အမျိုးသမီး (အသက် ၅နှစ်အောက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.female_under5_deaths}
                    onChangeText={v => updateField(id, 'female_under5_deaths', v)}
                    style={{ marginBottom: 8 }}
                  />

                  {/* OVER 5 */}
                  <TextInput
                    label="ဖြစ်ပွားမှု အမျိုးသား (အသက် ၅နှစ်အထက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.male_over5_cases}
                    onChangeText={v => updateField(id, 'male_over5_cases', v)}
                    style={{ marginBottom: 8 }}
                  />

                  <TextInput
                    label="ဖြစ်ပွားမှု အမျိုးသမီး (အသက် ၅နှစ်အထက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.female_over5_cases}
                    onChangeText={v => updateField(id, 'female_over5_cases', v)}
                    style={{ marginBottom: 8 }}
                  />

                  <TextInput
                    label="သေဆုံးမှု အမျိုးသား (အသက် ၅နှစ်အထက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.male_over5_deaths}
                    onChangeText={v => updateField(id, 'male_over5_deaths', v)}
                    style={{ marginBottom: 8 }}
                  />

                  <TextInput
                    label="သေဆုံးမှု အမျိုးသမီး (အသက် ၅နှစ်အထက်)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={form.female_over5_deaths}
                    onChangeText={v => updateField(id, 'female_over5_deaths', v)}
                    style={{ marginBottom: 8 }}
                  />

                  {/* TOTALS */}
                  <TextInput label="စုစုပေါင်း ဖြစ်ပွားသူအရေအတွက်" value={String(form.total_cases)} editable={false} mode="outlined" style={{ marginBottom: 8 }} />
                  <TextInput label="စုစုပေါင်း သေဆုံးသူအရေအတွက်" value={String(form.total_deaths)} editable={false} mode="outlined" style={{ marginBottom: 8 }} />
                  <TextInput label="စုစုပေါင်း" value={String(form.grand_total)} editable={false} mode="outlined" />

                </Card.Content>
              </Card>
            );
          })}
        </Card.Content>
      </Card>

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            padding: 15,
            borderRadius: 10
          }}
        >
          <TextInput
            placeholder="ရှာရန်..."
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={filtered}
            keyExtractor={(i) => i.facility_id.toString()}
            renderItem={({ item }) => (
              <Button onPress={() => {
                setFacilityId(item.facility_id);
                setModalVisible(false);
              }}>
                {item.facility_name}
              </Button>
            )}
          />
        </Modal>
      </Portal>

      {/* Save */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
      >
        {id ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}