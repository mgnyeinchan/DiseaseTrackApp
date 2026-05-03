import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  Text,
  Button,
  FAB,
  TextInput,
  Portal,
  Modal
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import {
  getSurveillance,
  deleteSurveillance,
  getFacilities,
  getTownships,
  getAgegroups,
  getSources
} from '../../services/surveillanceApi';

import { AuthContext } from '../../context/AuthContext';

const LIMIT = 10;

export default function SurveillanceListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // 🔍 search
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 🔽 filters
  const [facilityId, setFacilityId] = useState<number | undefined>();
  const [tspId, setTspId] = useState<number | undefined>();
  const [ageId, setAgeId] = useState<number | undefined>();
  const [sourceId, setSourceId] = useState<number | undefined>();

  const [facilities, setFacilities] = useState<any[]>([]);
  const [townships, setTownships] = useState<any[]>([]);
  const [agegroups, setAgegroups] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);

  // 📅 date filters
  const [reportStart, setReportStart] = useState('');
  const [reportEnd, setReportEnd] = useState('');

  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');

  // modal
  const [modalType, setModalType] = useState<string | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // 🔥 debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  // 🔥 dropdown load
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

  // 🔥 load data
  const loadData = async (pageNum = 1, refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);

      const res = await getSurveillance({
        page: pageNum,
        limit: LIMIT,
        search: debouncedSearch,
        facility_id: facilityId,
        event_tsp_id: tspId,
        agegroup_id: ageId,
        awarenesssource_id: sourceId,
        report_start: reportStart,
        report_end: reportEnd,
        event_start: eventStart,
        event_end: eventEnd
      });

      const list = res.data.data;

      if (pageNum === 1) setData(list);
      else {
        setData(prev => {
          const map = new Map();
          [...prev, ...list].forEach(i => map.set(i.id, i));
          return Array.from(map.values());
        });
      }

      setTotal(res.data.meta.total);
      setHasMore(list.length === LIMIT);
      setPage(pageNum);

    } catch (err: any) {
      if (err?.response?.status === 401) {
        Alert.alert('Session expired');
        logout();
      } else {
        Alert.alert('Error', err.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      loadData(1, true);
    }, [debouncedSearch, facilityId, tspId, ageId, sourceId, reportStart, reportEnd, eventStart, eventEnd])
  );

  const loadMore = () => {
    if (!loading && hasMore) loadData(page + 1);
  };

  // 🔥 delete
  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete this record?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const old = [...data];
          setData(prev => prev.filter(x => x.id !== id));

          try {
            await deleteSurveillance(id);
          } catch (err: any) {
            setData(old);
            Alert.alert('Error', err.message);
          } finally {
            setDeletingIds(prev => prev.filter(x => x !== id));
          }
        }
      }
    ]);
  };

  const renderSkeleton = () => (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <View style={{ height: 20, backgroundColor: '#eee', marginBottom: 10 }} />
      </Card.Content>
    </Card>
  );

  // 🔽 selected labels
  const selectedFacility = facilities.find(f => f.facility_id === facilityId);
  const selectedTsp = townships.find(t => t.tsp_id === tspId);
  const selectedAge = agegroups.find(a => a.agegroup_id === ageId);
  const selectedSource = sources.find(s => s.id === sourceId);

  const getList = () => {
    switch (modalType) {
      case 'facility': return facilities;
      case 'tsp': return townships;
      case 'age': return agegroups;
      case 'source': return sources;
      default: return [];
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* 🔍 SEARCH */}
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* 🔽 FILTERS */}
      <TouchableOpacity onPress={() => setModalType('facility')}>
        <TextInput
          label="Facility"
          value={selectedFacility?.facility_name || ''}
          editable={false}
          mode="outlined"
          style={{ margin: 10 }}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalType('tsp')}>
        <TextInput
          label="Township"
          value={selectedTsp?.tsp_name || ''}
          editable={false}
          mode="outlined"
          style={{ marginHorizontal: 10, marginBottom: 10 }}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalType('age')}>
        <TextInput
          label="Age Group"
          value={selectedAge?.agegroup_name || ''}
          editable={false}
          mode="outlined"
          style={{ marginHorizontal: 10, marginBottom: 10 }}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalType('source')}>
        <TextInput
          label="Awareness Source"
          value={selectedSource?.source_name || ''}
          editable={false}
          mode="outlined"
          style={{ marginHorizontal: 10, marginBottom: 10 }}
          right={<TextInput.Icon icon="chevron-down" />}
        />
      </TouchableOpacity>

      {/* 📅 DATE */}
      <TextInput
        label="Report Start"
        value={reportStart}
        onChangeText={setReportStart}
        mode="outlined"
        style={{ margin: 10 }}
      />

      <TextInput
        label="Report End"
        value={reportEnd}
        onChangeText={setReportEnd}
        mode="outlined"
        style={{ marginHorizontal: 10, marginBottom: 10 }}
      />

      {/* 🔢 COUNT */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      {/* 📄 LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(1, true)}
          />
        }
        ListEmptyComponent={() =>
          initialLoading
            ? Array.from({ length: 5 }).map((_, i) => <View key={i}>{renderSkeleton()}</View>)
            : <Text style={{ textAlign: 'center' }}>No Data</Text>
        }
        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Title
              title={item.report_reason || 'No Reason'}
              subtitle={`${item.facility_name} (${item.tsp_name})`}
            />

            <Card.Content>
              <Text>Cases: {item.total_cases}</Text>
              <Text>Deaths: {item.total_deaths}</Text>
            </Card.Content>

            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate('SurveillanceForm', { id: item.id })
                }
              >
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.id)}
                disabled={deletingIds.includes(item.id)}
                onPress={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      {/* ➕ FAB */}
      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 20, bottom: 20 }}
        onPress={() => navigation.navigate('SurveillanceForm')}
      />

      {/* 🔥 MODAL */}
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
            value={dropdownSearch}
            onChangeText={setDropdownSearch}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={getList().filter(i =>
              JSON.stringify(i).toLowerCase().includes(dropdownSearch.toLowerCase())
            )}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Button
                style={{ alignItems: 'flex-start' }}
                onPress={() => {

                  if (modalType === 'facility') setFacilityId(item.facility_id);
                  if (modalType === 'tsp') setTspId(item.tsp_id);
                  if (modalType === 'age') setAgeId(item.agegroup_id);
                  if (modalType === 'source') setSourceId(item.id);

                  setModalType(null);
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

    </View>
  );
}