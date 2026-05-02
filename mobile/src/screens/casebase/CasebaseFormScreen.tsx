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
import { getCasebaseDropdown } from '../../services/diseaseApi';
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

  // AFP
  const [afpForm, setAfpForm] = useState<any>({
    opv_ipv_vaccinated: '',
    paralysis_duration: '',
    acute_paralysis: '',
    fever_within_3weeks: '',
    fever_onset_day: '',
    patient_status: ''
  });

  // Fever With Rash
  const [feverRashForm, setFeverRashForm] = useState<any>({
    mr_mmr_vaccinated: '',
    fever: '',
    rash: '',
    cough: '',
    runny_nose: '',
    red_eyes: '',
    joint_pain: '',
    lymph_nodes: '',
    other_symptoms: '',
    patient_status: ''
  });

  // Diphtheria
  const [diphtheriaForm, setDiphtheriaForm] = useState<any>({
    dpt_vaccine: '',
    fever_start_date: '',
    fever: '',
    sore_throat: '',
    difficulty_swallowing: '',
    stridor: '',
    tonsil_swelling: '',
    voice_change: '',
    tachycardia: '',
    neck_swelling: '',
    weakness: '',
    membrane_present: '',
    complications: '',
    airway_block: '',
    myocarditis: '',
    patient_status: ''
  });

  // NNT
  const [nntForm, setNntForm] = useState<any>({
    tt_vaccinated: '',
    symptom_onset_date: '',
    normal_breastfeeding: '',
    difficulty_feeding: '',
    stiffness: '',
    convulsion: '',
    patient_status: ''
  });

  // AES
  const [aesForm, setAesForm] = useState<any>({
    je_vaccine: '',
    onset_date: '',
    rapid_onset: '',
    fever: '',
    paresis: '',
    headache: '',
    paralysis: '',
    neck_stiffness: '',
    seizure: '',
    mental_change: '',
    patient_status: ''
  });

  // Whooping Cough
  const [whoopingForm, setWhoopingForm] = useState<any>({
    dpt_vaccine: '',
    fever_start_date: '',
    fever_days: '',
    cough: '',
    breathing_difficulty: '',
    paroxysm_date: '',
    patient_status: ''
  });

  // Meningococcal
  const [meningoForm, setMeningoForm] = useState<any>({
    meningococcal_vaccine: '',
    onset_date: '',
    rapid_onset: '',
    fever: '',
    diarrhea: '',
    headache: '',
    vomiting: '',
    shock: '',
    kernig_sign: '',
    mental_change: '',
    rash: '',
    convulsion: '',
    muscle_pain: '',
    anemia: '',
    neck_stiffness: '',
    clinical_diagnosis: '',
    travel_history: '',
    patient_status: ''
  });

  // Cholera
  const [choleraForm, setCholeraForm] = useState<any>({
    cholera_vaccine: '',
    onset_date: '',
    diarrhea: '',
    vomiting: '',
    nausea: '',
    abdominal_pain: '',
    fever: '',
    headache: '',
    myalgia: '',
    other_symptoms: '',
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
    getCasebaseDropdown().then(r => setDiseases(r.data || []));

    // ✅ priority 1: API call (full data)
    if (id) {
      getCasebaseById(id).then(res => {
        const fullData = res.data;

        setForm(fullData);

        if (fullData?.disease_id === 1 && fullData?.disease_detail) {
          setAfpForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 2 && fullData?.disease_detail) {
          setFeverRashForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 3 && fullData?.disease_detail) {
          setDiphtheriaForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 4 && fullData?.disease_detail) {
          setNntForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 5 && fullData?.disease_detail) {
          setAesForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 6 && fullData?.disease_detail) {
          setWhoopingForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 7 && fullData?.disease_detail) {
          setMeningoForm(fullData.disease_detail);
        }else if (fullData?.disease_id === 8 && fullData?.disease_detail) {
          setCholeraForm(fullData.disease_detail);
        }
      });
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
        
        afp: form.disease_id === 1 ? afpForm : null,
        fever: form.disease_id === 2 ? feverRashForm : null,
        diphtheria: form.disease_id === 3 ? diphtheriaForm : null,
        nnt: form.disease_id === 4 ? nntForm : null,
        aes: form.disease_id === 5 ? aesForm : null,
        whooping: form.disease_id === 6 ? whoopingForm : null,
        meningo: form.disease_id === 7 ? meningoForm : null,
        cholera: form.disease_id === 8 ? choleraForm : null,
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
              }else if (item.disease_id === 1) {
                // Fever With Rash
                setFeverRashForm({
                  mr_mmr_vaccinated: '',
                  fever: '',
                  rash: '',
                  cough: '',
                  runny_nose: '',
                  red_eyes: '',
                  joint_pain: '',
                  lymph_nodes: '',
                  other_symptoms: '',
                  patient_status: ''
                });
              }else if (item.disease_id === 1) {
                // Diphtheria
                setDiphtheriaForm({
                  dpt_vaccine: '',
                  fever_start_date: '',
                  fever: '',
                  sore_throat: '',
                  difficulty_swallowing: '',
                  stridor: '',
                  tonsil_swelling: '',
                  voice_change: '',
                  tachycardia: '',
                  neck_swelling: '',
                  weakness: '',
                  membrane_present: '',
                  complications: '',
                  airway_block: '',
                  myocarditis: '',
                  patient_status: ''
                });
              }else if (item.disease_id === 1) {
                // NNT
                setNntForm({
                  tt_vaccinated: '',
                  symptom_onset_date: '',
                  normal_breastfeeding: '',
                  difficulty_feeding: '',
                  stiffness: '',
                  convulsion: '',
                  patient_status: ''
                });
              }else if (item.disease_id === 1) {
                // AES
                setAesForm({
                  je_vaccine: '',
                  onset_date: '',
                  rapid_onset: '',
                  fever: '',
                  paresis: '',
                  headache: '',
                  paralysis: '',
                  neck_stiffness: '',
                  seizure: '',
                  mental_change: '',
                  patient_status: ''
                });
              }else if (item.disease_id === 1) {
                // Whooping Cough
                setWhoopingForm({
                  dpt_vaccine: '',
                  fever_start_date: '',
                  fever_days: '',
                  cough: '',
                  breathing_difficulty: '',
                  paroxysm_date: '',
                  patient_status: ''
                });
              }else if (item.disease_id === 1) {
                // Meningococcal
                setMeningoForm({
                  meningococcal_vaccine: '',
                  onset_date: '',
                  rapid_onset: '',
                  fever: '',
                  diarrhea: '',
                  headache: '',
                  vomiting: '',
                  shock: '',
                  kernig_sign: '',
                  mental_change: '',
                  rash: '',
                  convulsion: '',
                  muscle_pain: '',
                  anemia: '',
                  neck_stiffness: '',
                  clinical_diagnosis: '',
                  travel_history: '',
                  patient_status: ''
                });
              }else if (item.disease_id === 1) {
                // Cholera
                setCholeraForm({
                  cholera_vaccine: '',
                  onset_date: '',
                  diarrhea: '',
                  vomiting: '',
                  nausea: '',
                  abdominal_pain: '',
                  fever: '',
                  headache: '',
                  myalgia: '',
                  other_symptoms: '',
                  patient_status: ''
                });
              }
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
              <TextInput
                label="မြို့နယ်"
                value={selectedFacility?.tsp_name || ''}
                mode="outlined"
                editable={false}
                style={{ marginBottom: 10 }}
              />

              <TextInput
                label="အဖွဲ့အစည်း"
                value={selectedFacility?.org_name || ''}
                mode="outlined"
                editable={false}
                style={{ marginBottom: 10 }}
              />
              <TextInput
                label="အမျိုးအစား"
                value={selectedFacility?.facility_type || ''}
                mode="outlined"
                editable={false}
                style={{ marginBottom: 10 }}
              />
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
              လတ်တလောပျောခွေအကြောသေရောဂါ
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
      
      {/* feverRash Form */}
      {form.disease_id === 2 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              အနီကွက်ထွက်၍ဖျားနာခြင်း
            </Title>

            {/* ================= Vaccine ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  MR/MMR ထိုးထားခြင်း
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ', 'မရှိပါ', 'မသိပါ'].map(v => (
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={feverRashForm.mr_mmr_vaccinated}
                      onSelect={(val: any) =>
                        setFeverRashForm({
                          ...feverRashForm,
                          mr_mmr_vaccinated: val
                        })
                      }
                    />
                  ))}
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
                  { label: 'အဖျားရှိပါသလား', key: 'fever' },
                  { label: 'Maculo-papular rash ရှိပါသလား', key: 'rash' },
                  { label: 'ချောင်းဆိုးခြင်း', key: 'cough' },
                  { label: 'နှာရည်ယိုခြင်း', key: 'runny_nose' },
                  { label: 'မျက်လုံးနီခြင်း', key: 'red_eyes' },
                  { label: 'အဆစ်နာခြင်း', key: 'joint_pain' },
                  { label: 'ပြန်ရည်ကျိတ် ကြီးခြင်း', key: 'lymph_nodes' }
                ].map((item, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>

                    <Text style={{ marginBottom: 4 }}>
                      {item.label}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['ရှိ', 'မရှိပါ', 'မသိပါ'].map(v => (
                        <RadioRow
                          key={v}
                          value={v}
                          label={v}
                          selected={feverRashForm[item.key]}
                          onSelect={(val: any) =>
                            setFeverRashForm({
                              ...feverRashForm,
                              [item.key]: val
                            })
                          }
                        />
                      ))}
                    </View>

                  </View>
                ))}

                {/* Other Symptoms */}
                <TextInput
                  label="အခြားရောဂါလက္ခဏာများ"
                  mode="outlined"
                  style={{ marginTop: 10 }}
                  value={feverRashForm.other_symptoms}
                  onChangeText={t =>
                    setFeverRashForm({
                      ...feverRashForm,
                      other_symptoms: t
                    })
                  }
                />

                {/* Patient Status */}
                <View style={{ marginTop: 15 }}>
                  <Text style={{ marginBottom: 4 }}>
                    လူနာ အခြေအနေ
                  </Text>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {['အသက်ရှင်', 'သေဆုံး', 'မသိပါ'].map(v => (
                      <RadioRow
                        key={v}
                        value={v}
                        label={v}
                        selected={feverRashForm.patient_status}
                        onSelect={(val: any) =>
                          setFeverRashForm({
                            ...feverRashForm,
                            patient_status: val
                          })
                        }
                      />
                    ))}
                  </View>
                </View>

              </Card.Content>
            </Card>

          </Card.Content>
        </Card>
      )}

      {/* diphtheria Form */}
      {form.disease_id === 3 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              ဆုံဆို့နာရောဂါ
            </Title>

            {/* ================= Vaccine ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  DPT/Penta/Quadri/Td ထိုးထားခြင်း
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ','မရှိပါ','မသိပါ'].map(v => (
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={diphtheriaForm.dpt_vaccine}
                      onSelect={(val:any)=>
                        setDiphtheriaForm({...diphtheriaForm, dpt_vaccine: val})
                      }
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

            {/* ================= Symptoms ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                {/* Fever Start Date */}
                <Text style={{ marginBottom: 4 }}>
                  စတင်ဖျားသည့် ရက်စွဲ
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="yyyy-mm-dd"
                  value={diphtheriaForm.fever_start_date}
                  onChangeText={t =>
                    setDiphtheriaForm({
                      ...diphtheriaForm,
                      fever_start_date: t
                    })
                  }
                  style={{ marginBottom: 12 }}
                />

                {[
                  { label: 'ဖျားခြင်း', key: 'fever' },
                  { label: 'လည်ချောင်းနာခြင်း', key: 'sore_throat' },
                  { label: 'မျိုချရခက်ခြင်း', key: 'difficulty_swallowing' },
                  { label: 'Stridor (အသက်ရှူသံ)', key: 'stridor' },
                  { label: 'အာသီးရောင်ခြင်း', key: 'tonsil_swelling' },
                  { label: 'အသံပြောင်းခြင်း', key: 'voice_change' },
                  { label: 'နှလုံးခုန်မြန်ခြင်း', key: 'tachycardia' },
                  { label: 'လည်ပင်းရောင်ခြင်း', key: 'neck_swelling' },
                  { label: 'အားနည်းခြင်း', key: 'weakness' },
                  { label: 'Membrane ရှိခြင်း', key: 'membrane_present' },
                  { label: 'နောက်ဆက်တွဲရောဂါ', key: 'complications' },
                  { label: 'လေပြွန်ပိတ်ဆို့ခြင်း', key: 'airway_block' },
                  { label: 'Myocarditis', key: 'myocarditis' },
                  {
                    label: 'လူနာ အခြေအနေ',
                    key: 'patient_status',
                    options: ['အသက်ရှင်','သေဆုံး','မသိပါ']
                  }
                ].map((item, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>

                    <Text style={{ marginBottom: 4 }}>
                      {item.label}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {(item.options || ['ရှိ','မရှိပါ','မသိပါ']).map(v => (
                        <RadioRow
                          key={v}
                          value={v}
                          label={v}
                          selected={diphtheriaForm[item.key]}
                          onSelect={(val:any)=>
                            setDiphtheriaForm({
                              ...diphtheriaForm,
                              [item.key]: val
                            })
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

      {/* nnt Form */}
      {form.disease_id === 4 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              မွေးကင်းစမေးခိုင်ရောဂါ
            </Title>

            {/* ================= Vaccine ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              မိခင်၏ ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  မေးခိုင်ကာကွယ်ဆေး (TT/Td)
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ','မရှိပါ','မသိပါ'].map(v => (
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={nntForm.tt_vaccinated}
                      onSelect={(val:any)=>
                        setNntForm({...nntForm, tt_vaccinated: val})
                      }
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

            {/* ================= Symptoms ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                {/* onset date */}
                <Text style={{ marginBottom: 4 }}>
                  ရောဂါလက္ခဏာစပြသည့် ရက်စွဲ
                </Text>

                <TextInput
                  mode="outlined"
                  placeholder="yyyy-mm-dd"
                  value={nntForm.symptom_onset_date}
                  onChangeText={(v)=>
                    setNntForm({...nntForm, symptom_onset_date:v})
                  }
                  style={{ marginBottom: 12 }}
                />

                {[
                  {
                    label: 'ပထမ ၂ ရက်အတွင်း နို့စို့နိုင်',
                    key: 'normal_breastfeeding'
                  },
                  {
                    label: 'နို့စို့ရာတွင် အခက်အခဲ',
                    key: 'difficulty_feeding'
                  },
                  {
                    label: 'တောင့်တင်းလာခြင်း',
                    key: 'stiffness'
                  },
                  {
                    label: 'တက်ခြင်း',
                    key: 'convulsion'
                  },
                  {
                    label: 'လူနာ အခြေအနေ',
                    key: 'patient_status',
                    options: ['အသက်ရှင်','သေဆုံး','မသိပါ']
                  }
                ].map((item, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>

                    <Text style={{ marginBottom: 4 }}>
                      {item.label}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {(item.options || ['ရှိ','မရှိပါ','မသိပါ']).map(v => (
                        <RadioRow
                          key={v}
                          value={v}
                          label={v}
                          selected={nntForm[item.key]}
                          onSelect={(val:any)=>
                            setNntForm({
                              ...nntForm,
                              [item.key]: val
                            })
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

      {/* aes Form */}
      {form.disease_id === 5 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              လတ်တလောဦးနှောက်ရောင်ရောဂါလက္ခဏာစု
            </Title>

            {/* Vaccine */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  JE Vaccine
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ','မရှိပါ','မသိပါ'].map(v=>(
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={aesForm.je_vaccine}
                      onSelect={(val:any)=>setAesForm({...aesForm, je_vaccine:val})}
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

            {/* Symptoms */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text>ရောဂါစတင်ရက်</Text>
                <TextInput
                  value={aesForm.onset_date}
                  onChangeText={(v)=>setAesForm({...aesForm, onset_date:v})}
                  placeholder="yyyy-mm-dd"
                  style={{ marginBottom: 10 }}
                />

                {[
                  {label:'လျင်မြန်စွာစပြ', key:'rapid_onset'},
                  {label:'ဖျားခြင်း', key:'fever'},
                  {label:'Paresis', key:'paresis'},
                  {label:'ခေါင်းကိုက်', key:'headache'},
                  {label:'လေဖြတ်', key:'paralysis'},
                  {label:'လည်ပင်းတောင့်', key:'neck_stiffness'},
                  {label:'တက်ခြင်း', key:'seizure'},
                  {label:'စိတ်ပြောင်း', key:'mental_change'},
                ].map((item,i)=>(
                  <View key={i} style={{ marginBottom: 10 }}>
                    <Text>{item.label}</Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['ရှိ','မရှိပါ','မသိပါ'].map(opt=>(
                        <RadioRow
                          key={opt}
                          value={opt}
                          label={opt}
                          selected={aesForm[item.key]}
                          onSelect={(v:any)=>setAesForm({...aesForm, [item.key]:v})}
                        />
                      ))}
                    </View>
                  </View>
                ))}

                {/* patient */}
                <Text>လူနာ အခြေအနေ</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['အသက်ရှင်','သေဆုံး','မသိပါ'].map(v=>(
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={aesForm.patient_status}
                      onSelect={(val:any)=>setAesForm({...aesForm, patient_status:val})}
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

          </Card.Content>
        </Card>
      )}

      {/* whooping Form */}
      {form.disease_id === 6 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              ကြက်ညှာချောင်းဆိုးရောဂါ
            </Title>

            {/* Vaccine */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text>DPT Vaccine</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ','မရှိပါ','မသိပါ'].map(v=>(
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={whoopingForm.dpt_vaccine}
                      onSelect={(val:any)=>setWhoopingForm({...whoopingForm, dpt_vaccine:val})}
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

            {/* Symptoms */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text>စဖျားရက်</Text>
                <TextInput
                  value={whoopingForm.fever_start_date}
                  onChangeText={(v)=>setWhoopingForm({...whoopingForm, fever_start_date:v})}
                  placeholder="yyyy-mm-dd"
                  style={{ marginBottom: 10 }}
                />

                <Text>ဖျားရက်ပေါင်း</Text>
                <TextInput
                  value={whoopingForm.fever_days}
                  onChangeText={(v)=>setWhoopingForm({...whoopingForm, fever_days:v})}
                  style={{ marginBottom: 10 }}
                />

                {[
                  {label:'ချောင်းဆိုး', key:'cough'},
                  {label:'အသက်ရှူခက်', key:'breathing_difficulty'},
                ].map((item,i)=>(
                  <View key={i} style={{ marginBottom: 10 }}>
                    <Text>{item.label}</Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {['ရှိ','မရှိပါ','မသိပါ'].map(opt=>(
                        <RadioRow
                          key={opt}
                          value={opt}
                          label={opt}
                          selected={whoopingForm[item.key]}
                          onSelect={(v:any)=>setWhoopingForm({...whoopingForm, [item.key]:v})}
                        />
                      ))}
                    </View>
                  </View>
                ))}

                <Text>Paroxysm Date</Text>
                <TextInput
                  value={whoopingForm.paroxysm_date}
                  onChangeText={(v)=>setWhoopingForm({...whoopingForm, paroxysm_date:v})}
                  placeholder="yyyy-mm-dd"
                  style={{ marginBottom: 10 }}
                />

                <Text>လူနာ အခြေအနေ</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['အသက်ရှင်','သေဆုံး','မသိပါ'].map(v=>(
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={whoopingForm.patient_status}
                      onSelect={(val:any)=>setWhoopingForm({...whoopingForm, patient_status:val})}
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

          </Card.Content>
        </Card>
      )}
      
      {/* meningo Form */}
      {form.disease_id === 7 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              ကူးစက်မြန် ဦးနှောက်အမြှေးရောင်ရောဂါ
            </Title>

            {/* ================= Vaccine ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  Meningococcal Vaccine
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ', 'မရှိပါ', 'မသိပါ'].map(v => (
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={meningoForm.meningococcal_vaccine}
                      onSelect={(val:any)=>
                        setMeningoForm({...meningoForm, meningococcal_vaccine: val})
                      }
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

            {/* ================= Symptoms ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>ရောဂါစတင်ရက်</Text>
                <TextInput
                  value={meningoForm.onset_date}
                  onChangeText={(v)=>setMeningoForm({...meningoForm, onset_date:v})}
                  placeholder="yyyy-mm-dd"
                  style={{ marginBottom: 12 }}
                />

                {[
                  { label: 'လျင်မြန်စွာစပြ', key: 'rapid_onset' },
                  { label: 'ဖျားခြင်း', key: 'fever' },
                  { label: 'ဝမ်းလျော', key: 'diarrhea' },
                  { label: 'ခေါင်းကိုက်', key: 'headache' },
                  { label: 'အန်ခြင်း', key: 'vomiting' },
                  { label: 'Shock', key: 'shock' },
                  { label: 'Kernig Sign', key: 'kernig_sign' },
                  { label: 'စိတ်ပြောင်း', key: 'mental_change' },
                  { label: 'Rash', key: 'rash' },
                  { label: 'Convulsion', key: 'convulsion' },
                  { label: 'ကြွက်သားနာ', key: 'muscle_pain' },
                  { label: 'သွေးအားနည်း', key: 'anemia' },
                  { label: 'လည်ပင်းတောင့်', key: 'neck_stiffness' },
                  { label: 'Clinical Diagnosis', key: 'clinical_diagnosis' },
                  { label: 'Travel History', key: 'travel_history' },
                  {
                    label: 'လူနာ အခြေအနေ',
                    key: 'patient_status',
                    options: ['အသက်ရှင်','သေဆုံး','မသိပါ']
                  }
                ].map((item, i) => (
                  <View key={i} style={{ marginBottom: 12 }}>

                    <Text style={{ marginBottom: 4 }}>
                      {item.label}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {(item.options || ['ရှိ','မရှိပါ','မသိပါ']).map(opt => (
                        <RadioRow
                          key={opt}
                          value={opt}
                          label={opt}
                          selected={meningoForm[item.key]}
                          onSelect={(v:any)=>
                            setMeningoForm({...meningoForm, [item.key]: v})
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

      {/* Cholera Form */}
      {form.disease_id === 8 && (
        <Card style={{ marginBottom: 20, borderRadius: 10 }}>
          <Card.Content>

            <Title style={{ marginBottom: 10 }}>
              ပြင်းထန်ဝမ်းပျက်ဝမ်းလျှောရောဂါ
            </Title>

            {/* ================= Vaccine ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ကာကွယ်ဆေးထိုး မှတ်တမ်း
            </Text>

            <Card style={{ marginBottom: 15, backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>
                  Cholera Vaccine
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['ရှိ','မရှိပါ','မသိပါ'].map(v => (
                    <RadioRow
                      key={v}
                      value={v}
                      label={v}
                      selected={choleraForm.cholera_vaccine}
                      onSelect={(val:any)=>
                        setCholeraForm({...choleraForm, cholera_vaccine: val})
                      }
                    />
                  ))}
                </View>

              </Card.Content>
            </Card>

            {/* ================= Symptoms ================= */}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              ရောဂါသွင်ပြင်လက္ခဏာ
            </Text>

            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Card.Content>

                <Text style={{ marginBottom: 5 }}>ရောဂါစတင်ရက်</Text>
                <TextInput
                  value={choleraForm.onset_date}
                  onChangeText={(v)=>setCholeraForm({...choleraForm, onset_date:v})}
                  placeholder="yyyy-mm-dd"
                  style={{ marginBottom: 12 }}
                />

                {[
                  { label: 'ဝမ်းလျော', key: 'diarrhea' },
                  { label: 'အန်ခြင်း', key: 'vomiting' },
                  { label: 'ပျို့ခြင်း', key: 'nausea' },
                  { label: 'ဗိုက်အောင့်', key: 'abdominal_pain' },
                  { label: 'ဖျားခြင်း', key: 'fever' },
                  { label: 'ခေါင်းကိုက်', key: 'headache' },
                  { label: 'Myalgia', key: 'myalgia' },
                  {
                    label: 'လူနာ အခြေအနေ',
                    key: 'patient_status',
                    options: ['အသက်ရှင်','သေဆုံး','မသိပါ']
                  }
                ].map((item, i) => (
                  <View key={i} style={{ marginBottom: 12 }}>

                    <Text style={{ marginBottom: 4 }}>
                      {item.label}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {(item.options || ['ရှိ','မရှိပါ','မသိပါ']).map(opt => (
                        <RadioRow
                          key={opt}
                          value={opt}
                          label={opt}
                          selected={choleraForm[item.key]}
                          onSelect={(v:any)=>
                            setCholeraForm({...choleraForm, [item.key]: v})
                          }
                        />
                      ))}
                    </View>

                  </View>
                ))}

                {/* other */}
                <Text style={{ marginBottom: 5 }}>Other Symptoms</Text>
                <TextInput
                  value={choleraForm.other_symptoms}
                  onChangeText={(v)=>
                    setCholeraForm({...choleraForm, other_symptoms:v})
                  }
                />

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