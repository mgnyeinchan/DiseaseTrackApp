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
  Title,
  Portal,
  Modal,
  Text,
  Card,
  RadioButton
} from 'react-native-paper';

import { createCasebase, updateCasebase } from '../../services/casebaseApi';
import { getFacilitiesDropdown } from '../../services/facilityApi';
import { getTownshipsDropdown } from '../../services/clinicApi';
import { getDiseasesDropdown } from '../../services/diseaseApi';
import { getVillagesDropdown } from '../../services/villageApi';
import { getCasebaseById } from '../../services/casebaseApi';

export default function CasebaseFormScreen({ route, navigation }: any) {

  const data = route.params?.data;
  const id = route.params?.id || data?.casebase_id;

  const [form, setForm] = useState<any>({
    reporter_name: '',
    reporter_position: '',
    facility_id: null,

    patient_code: '',
    patient_name: '',
    gender: null,

    age_year: '',
    age_month: '',

    father_name: '',
    mother_name: '',

    tsp_id: null,
    village_id: null,

    phone: '',
    disease_id: null
  });

  const [facilities, setFacilities] = useState<any[]>([]);
  const [townships, setTownships] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);

  const [modal, setModal] = useState<string | null>(null);

  const [afpForm, setAfpForm] = useState<any>({
    opv_ipv_vaccinated: '',
    paralysis_duration: '',
    acute_paralysis: '',
    fever_within_3weeks: '',
    fever_onset_day: '',
    patient_status: ''
  });

  // reusable radio row
  const RadioRow = ({ value, label, selected, onSelect }: any) => (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 8
      }}
    >
      <RadioButton
        value={value}
        status={selected === value ? 'checked' : 'unchecked'}
        onPress={() => onSelect(value)}
      />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
  

  useEffect(() => {
    getFacilitiesDropdown().then(r => setFacilities(r.data || []));
    getTownshipsDropdown().then(r => setTownships(r.data || []));
    getVillagesDropdown().then(r => setVillages(r.data || []));
    getDiseasesDropdown().then(r => setDiseases(r.data || []));

    // ✅ priority 1: API call (full data)
    if (id) {
      getCasebaseById(id).then(res => {
        const fullData = res.data;

        setForm(fullData);

        if (fullData?.disease_id === 1 && fullData?.disease_detail) {
          setAfpForm(fullData.disease_detail);
        }
      });
    }

    // ✅ fallback: route data (fast UI)
    else if (data) {
      setForm(data);

      if (data?.disease_id === 1 && data?.disease_detail) {
        setAfpForm(data.disease_detail);
      }
    }

  }, [id]);

  useEffect(() => {
    if (!id) {
      setForm({
        reporter_name: '',
        reporter_position: '',
        facility_id: null,
        patient_code: '',
        patient_name: '',
        gender: null,
        age_year: '',
        age_month: '',
        father_name: '',
        mother_name: '',
        tsp_id: null,
        village_id: null,
        phone: '',
        disease_id: null
      });
    }
  }, [id]);

  const selectedFacility = facilities.find(f => f.facility_id === form.facility_id);
  const selectedTownship = townships.find(t => t.tsp_id === form.tsp_id);
  const selectedVillage = villages.find(v => v.village_id === form.village_id);
  const selectedDisease = diseases.find(d => d.disease_id === form.disease_id);

  const handleSave = async () => {
    try {

      const payload = {
        ...form,

        age_year: form.age_year ? parseInt(form.age_year) : null,
        age_month: form.age_month ? parseInt(form.age_month) : null,

        gender: form.gender ? parseInt(form.gender) : null,

        facility_id: form.facility_id || null,
        tsp_id: form.tsp_id || null,
        village_id: form.village_id || null,
        disease_id: form.disease_id || null,
        
        afp: form.disease_id === 1 ? afpForm : null
      };

      if (id) {
        await updateCasebase(id, payload);
      } else {
        await createCasebase(payload);
      }

      Alert.alert('Success', id ? 'Updated Successfully' : 'Created Successfully');
      navigation.goBack();

    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const renderList = (list: any[], key: string, label: string) => (
    <FlatList
      data={list}
      keyExtractor={(i) => String(i[key])}
      renderItem={({ item }) => (
        <Button
          style={{ alignItems: 'flex-start' }}
          onPress={() => {

            const newForm = { ...form, [key]: item[key] };
            setForm(newForm);

            // 🔥 IMPORTANT: disease only logic
            if (key === 'disease_id') {

              // AFP reset
              if (item.disease_id === 1) {
                setAfpForm({
                  opv_ipv_vaccinated: '',
                  paralysis_duration: '',
                  acute_paralysis: '',
                  fever_within_3weeks: '',
                  fever_onset_day: '',
                  patient_status: ''
                });
              }

              // 👉 future (other disease reset)
              // else if (item.disease_id === 2) { ... }

            }

            setModal(null);
          }}
        >
          {item[label]}
        </Button>
      )}
    />
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      {/* ================= Reporter ================= */}
      <Card style={{ marginBottom: 15 }}>
        <Card.Content>
          <Title>သတင်းပေးပို့သူ</Title>

          <TextInput
            label="အမည်"
            mode="outlined"
            value={form.reporter_name}
            onChangeText={t => setForm({ ...form, reporter_name: t })}
            style={{ marginBottom: 10 }}
          />

          <TextInput
            label="ရာထူး"
            mode="outlined"
            value={form.reporter_position}
            onChangeText={t => setForm({ ...form, reporter_position: t })}
            style={{ marginBottom: 10 }}
          />

          <TouchableOpacity onPress={() => setModal('facility')}>
            <TextInput
              label="ယူနစ်အမည်"
              mode="outlined"
              value={selectedFacility?.facility_name || ''}
              editable={false}
            />
          </TouchableOpacity>

          {selectedFacility && (
            <View style={{ marginTop: 10 }}>
              <Text>မြို့နယ် - {selectedFacility.tsp_name}</Text>
              <Text>တိုင်း/ပြည်နယ် - {selectedFacility.div_name}</Text>
              <Text>အဖွဲ့အစည်း - {selectedFacility.org_name}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* ================= Patient ================= */}
      <Card style={{ marginBottom: 15 }}>
        <Card.Content>
          <Title>လူနာ အချက်အလက်</Title>

          <TextInput
            label="လူနာ ID"
            mode="outlined"
            value={form.patient_code}
            onChangeText={t => setForm({ ...form, patient_code: t })}
            style={{ marginBottom: 10 }}
          />

          <TextInput
            label="အမည်"
            mode="outlined"
            value={form.patient_name}
            onChangeText={t => setForm({ ...form, patient_name: t })}
            style={{ marginBottom: 10 }}
          />

          {/* 🔥 Gender Radio */}
          <Text style={{ marginBottom: 5 }}>လိင်</Text>
          <RadioButton.Group
            onValueChange={(value) =>
              setForm({ ...form, gender: parseInt(value) })
            }
            value={form.gender ? String(form.gender) : ''}
          >
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                <RadioButton value="1" />
                <Text>ကျား</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="2" />
                <Text>မ</Text>
              </View>
            </View>
          </RadioButton.Group>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              label="အသက် (နှစ်)"
              mode="outlined"
              keyboardType="numeric"
              style={{ flex: 1 }}
              value={form.age_year?.toString() || ''}
              onChangeText={t => setForm({ ...form, age_year: t })}
            />
            <TextInput
              label="အသက် (လ)"
              mode="outlined"
              keyboardType="numeric"
              style={{ flex: 1 }}
              value={form.age_month?.toString() || ''} 
              onChangeText={t => setForm({ ...form, age_month: t })}
            />
          </View>

          <TextInput
            label="ဖခင် အမည်"
            mode="outlined"
            value={form.father_name}
            onChangeText={t => setForm({ ...form, father_name: t })}
            style={{ marginTop: 10 }}
          />

          <TextInput
            label="မိခင် အမည်"
            mode="outlined"
            value={form.mother_name}
            onChangeText={t => setForm({ ...form, mother_name: t })}
            style={{ marginTop: 10 }}
          />

          {/* Township */}
          <TouchableOpacity onPress={() => setModal('tsp')}>
            <TextInput
              label="မြို့နယ်"
              mode="outlined"
              value={selectedTownship?.tsp_name || ''}
              editable={false}
              style={{ marginTop: 10 }}
            />
          </TouchableOpacity>

          {selectedTownship && (
            <Text style={{ marginTop: 5 }}>
              တိုင်း/ပြည်နယ် - {selectedTownship.div_name}
            </Text>
          )}

          {/* Village */}
          <TouchableOpacity onPress={() => setModal('village')}>
            <TextInput
              label="ကျေးရွာ"
              mode="outlined"
              value={selectedVillage?.village_name || ''}
              editable={false}
              style={{ marginTop: 10 }}
            />
          </TouchableOpacity>

          <TextInput
            label="ဖုန်း"
            mode="outlined"
            value={form.phone}
            onChangeText={t => setForm({ ...form, phone: t })}
            style={{ marginTop: 10 }}
          />
        </Card.Content>
      </Card>

      {/* ================= Disease ================= */}
      <Card style={{ marginBottom: 15 }}>
        <Card.Content>
          <Title>သတင်းပို့ ရောဂါ</Title>

          <TouchableOpacity onPress={() => setModal('disease')}>
            <TextInput
              label="ရောဂါ"
              mode="outlined"
              value={selectedDisease?.disease_name || ''}
              editable={false}
            />
          </TouchableOpacity>

          {selectedDisease && (
            <Card style={{ marginTop: 10, backgroundColor: '#E3F2FD' }}>
              <Card.Content>
                <Text style={{ fontWeight: 'bold' }}>ရောဂါ အချက်အလက်</Text>
                <Text>{selectedDisease.disease_definition}</Text>
              </Card.Content>
            </Card>
          )}
        </Card.Content>
      </Card>
          
      {/* Modal */}
      <Portal>
        <Modal
          visible={!!modal}
          onDismiss={() => setModal(null)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            padding: 15,
            maxHeight: '80%'
          }}
        >
          {modal === 'facility' && renderList(facilities, 'facility_id', 'facility_name')}
          {modal === 'tsp' && renderList(townships, 'tsp_id', 'tsp_name')}
          {modal === 'village' && renderList(villages, 'village_id', 'village_name')}
          {modal === 'disease' && renderList(diseases, 'disease_id', 'disease_name')}
        </Modal>
      </Portal>
      
      {/* AFP Form */}
      {form.disease_id === 1 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              AFP (ပိုလီယို သံသယ)
            </Title>

            {/* ================= Vaccine ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  ပိုလီယို ကာကွယ်ဆေး (OPV/IPV)
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <RadioRow
                    value="ရှိ"
                    label="ရှိ"
                    selected={afpForm.opv_ipv_vaccinated}
                    onSelect={(v: any) =>
                      setAfpForm({ ...afpForm, opv_ipv_vaccinated: v })
                    }
                  />
                  <RadioRow
                    value="မရှိပါ"
                    label="မရှိပါ"
                    selected={afpForm.opv_ipv_vaccinated}
                    onSelect={(v: any) =>
                      setAfpForm({ ...afpForm, opv_ipv_vaccinated: v })
                    }
                  />
                  <RadioRow
                    value="မသိပါ"
                    label="မသိပါ"
                    selected={afpForm.opv_ipv_vaccinated}
                    onSelect={(v: any) =>
                      setAfpForm({ ...afpForm, opv_ipv_vaccinated: v })
                    }
                  />
                </View>

              </Card.Content>
            </Card>

            {/* ================= Symptoms ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                {[
                  {
                    label: 'ပျော့ခွေအကြာသေခြင်း',
                    key: 'paralysis_duration',
                    options: [
                      { label: 'ရှိ', value: 'ရှိ' },
                      { label: 'မရှိပါ', value: 'မရှိပါ' },
                      { label: 'သံသယ', value: 'သံသယ' }
                    ]
                  },
                  {
                    label: 'လတ်တလောအကြောသေခြင်း',
                    key: 'acute_paralysis',
                    options: [
                      { label: 'ရှိ', value: 'ရှိ' },
                      { label: 'မရှိပါ', value: 'မရှိပါ' },
                      { label: 'သံသယ', value: 'သံသယ' }
                    ]
                  },
                  {
                    label: '၃ ပတ်အတွင်း အဖျားရှိခဲ့ပါသလား',
                    key: 'fever_within_3weeks',
                    options: [
                      { label: 'ရှိ', value: 'ရှိ' },
                      { label: 'မရှိပါ', value: 'မရှိပါ' },
                      { label: 'မသိပါ', value: 'မသိပါ' }
                    ]
                  },
                  {
                    label: 'ဖြစ်သည့်နေ့တွင် အဖျားရှိခဲ့ပါသလား',
                    key: 'fever_onset_day',
                    options: [
                      { label: 'ရှိ', value: 'ရှိ' },
                      { label: 'မရှိပါ', value: 'မရှိပါ' },
                      { label: 'မသိပါ', value: 'မသိပါ' }
                    ]
                  },
                  {
                    label: 'လူနာ အခြေအနေ',
                    key: 'patient_status',
                    options: [
                      { label: 'အသက်ရှင်', value: 'အသက်ရှင်' },
                      { label: 'သေဆုံး', value: 'သေဆုံး' },
                      { label: 'မသိပါ', value: 'မသိပါ' }
                    ]
                  }
                ].map((item, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>

                    <Text style={{ marginBottom: 4 }}>
                      {item.label}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {item.options.map((opt, i) => (
                        <RadioRow
                          key={i}
                          value={opt.value}
                          label={opt.label}
                          selected={afpForm[item.key]}
                          onSelect={(v: any) =>
                            setAfpForm({ ...afpForm, [item.key]: v })
                          }
                        />
                      ))}
                    </View>

                  </View>
                ))}

              </Card.Content>
            </Card>

          </Card.Content>
        </Card>
      )}
      

      <Button
        mode="contained"
        onPress={handleSave}
      >
        {id ? 'Update' : 'Create'}
      </Button>

    </ScrollView>
  );
}