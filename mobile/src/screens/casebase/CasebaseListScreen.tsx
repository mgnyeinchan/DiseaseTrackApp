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
  Modal,
  Portal
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import {
  getCasebases,
  deleteCasebase
} from '../../services/casebaseApi';

import {
  getTownshipsDropdown
} from '../../services/clinicApi';

import { AuthContext } from '../../context/AuthContext';

export default function CasebaseListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 🔥 filter
  const [tspId, setTspId] = useState<number | undefined>();
  const [townships, setTownships] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const LIMIT = 10;

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // load township
  useEffect(() => {
    getTownshipsDropdown()
      .then((res: any) => setTownships(res.data || []))
      .catch(() => {
        setTownships([]);
        Alert.alert('Error', 'Failed to load township');
      });
  }, []);

  // load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getCasebases(
        pageNumber,
        LIMIT,
        debouncedSearch,
        { tsp_id: tspId }
      );

      const list = res.data.data;

      if (pageNumber === 1) setData(list);
      else {
        setData(prev => {
          const map = new Map<number, any>();
          [...prev, ...list].forEach(i => map.set(i.casebase_id, i));
          return Array.from(map.values());
        });
      }

      setTotal(res.data.meta.total);
      setHasMore(list.length === LIMIT);
      setPage(pageNumber);

    } catch (err: any) {
      if (err?.response?.status === 401) {
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
    }, [debouncedSearch, tspId])
  );

  const loadMore = () => {
    if (!loading && hasMore) loadData(page + 1);
  };

  // delete
  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete this case?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const old = [...data];
          setData(prev => prev.filter(x => x.casebase_id !== id));

          try {
            await deleteCasebase(id);
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

  // skeleton
  const renderSkeleton = () => (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <View style={{ height: 20, backgroundColor: '#eee', marginBottom: 10 }} />
        <View style={{ height: 15, width: '60%', backgroundColor: '#eee' }} />
      </Card.Content>
    </Card>
  );

  const filteredTownships = townships.filter(t =>
    t.tsp_name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const selectedTownship = townships.find(t => t.tsp_id === tspId);

  return (
    <View style={{ flex: 1 }}>

      {/* Search */}
      <TextInput
        placeholder="Search patient..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* Filter */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          label="Filter Township"
          value={selectedTownship?.tsp_name || ''}
          editable={false}
          style={{ margin: 10 }}
        />
      </TouchableOpacity>

      {/* Dropdown */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            padding: 10,
            borderRadius: 10,
            maxHeight: '80%'
          }}
        >

          <TextInput
            placeholder="Search township..."
            value={dropdownSearch}
            onChangeText={setDropdownSearch}
            style={{ marginBottom: 10 }}
          />

          <FlatList
            data={filteredTownships}
            keyExtractor={(item) => item.tsp_id.toString()}
            ListHeaderComponent={
              <Button onPress={() => {
                setTspId(undefined);
                setModalVisible(false);
              }}>All</Button>
            }
            renderItem={({ item }) => (
              <Button onPress={() => {
                setTspId(item.tsp_id);
                setModalVisible(false);
              }}>
                {item.tsp_name}
              </Button>
            )}
          />
        </Modal>
      </Portal>

      {/* Count */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.casebase_id.toString()}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(1, true)} />
        }

        ListEmptyComponent={() => (
          initialLoading
            ? <>{Array.from({ length: 5 }).map((_, i) => <View key={i}>{renderSkeleton()}</View>)}</>
            : <Text style={{ textAlign: 'center' }}>No Data</Text>
        )}

        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Title
              title={item.patient_name}
              subtitle={`${item.patient_code} (${item.disease_name})`}
            />

            <Card.Actions>

              {/* FIXED EDIT */}
              {/* <Button onPress={() => navigation.navigate('CasebaseForm', {
                data: {
                  ...item,
                  facility_id: item.facility_id,
                  tsp_id: item.tsp_id,
                  village_id: item.village_id,
                  disease_id: item.disease_id
                }
              })}>
                Edit
              </Button> */}
              <Button onPress={() => navigation.navigate('CasebaseForm', {
                id: item.casebase_id
              })}>
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.casebase_id)}
                disabled={deletingIds.includes(item.casebase_id)}
                onPress={() => handleDelete(item.casebase_id)}
              >
                Delete
              </Button>

            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 20, bottom: 20 }}
        onPress={() => navigation.navigate('CasebaseForm')}
      />

    </View>
  );
}