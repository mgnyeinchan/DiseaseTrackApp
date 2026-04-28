import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert
} from 'react-native';
import {
  Card,
  Text,
  Button,
  FAB,
  ActivityIndicator,
  TextInput,
  Modal,
  Portal
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

import {
  getClinics,
  deleteClinic,
  getTownshipsDropdown
} from '../../services/clinicApi';

import { AuthContext } from '../../context/AuthContext';

type Clinic = {
  cln_id: number;
  cln_code: string;
  cln_name: string;
  tsp_name: string;
  cln_tsp_id: number;
};

type Township = {
  tsp_id: number;
  tsp_name: string;
};

export default function ClinicListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<Clinic[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [townshipId, setTownshipId] = useState<number | undefined>();
  const [townships, setTownships] = useState<Township[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const LIMIT = 10;

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 load township dropdown
  useEffect(() => {
    getTownshipsDropdown()
      .then((res: any) => setTownships(res.data || []))
      .catch(() => {
        setTownships([]);
        Alert.alert('Error', 'Failed to load township');
      });
  }, []);

  // 🔥 load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getClinics(
        pageNumber,
        LIMIT,
        debouncedSearch,
        townshipId
      );

      const list = res.data.data;

      if (pageNumber === 1) setData(list);
      else {
        setData(prev => {
          const map = new Map<number, Clinic>();
          [...prev, ...list].forEach(i => map.set(i.cln_id, i));
          return Array.from(map.values());
        });
      }

      setTotal(res.data.meta.total);
      setHasMore(list.length === LIMIT);
      setPage(pageNumber);

    } catch (err: any) {
      if (err?.response?.status === 401) {
        Alert.alert('Session Expired');
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
    }, [debouncedSearch, townshipId])
  );

  const loadMore = () => {
    if (!loading && hasMore) loadData(page + 1);
  };

  // 🔥 delete
  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete this clinic?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const old = [...data];
          setData(prev => prev.filter(x => x.cln_id !== id));

          try {
            await deleteClinic(id);
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
        <View style={{ height: 15, width: '60%', backgroundColor: '#eee' }} />
      </Card.Content>
    </Card>
  );

  const filteredTownships = townships.filter(t =>
    t.tsp_name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const selectedTownship = townships.find(t => t.tsp_id === townshipId);

  return (
    <View style={{ flex: 1 }}>

      {/* Search */}
      <TextInput
        placeholder="Search clinic..."
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
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{ backgroundColor: 'white', margin: 20, padding: 10, borderRadius: 10, maxHeight: '80%' }}>

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
                setTownshipId(undefined);
                setModalVisible(false);
              }}>All</Button>
            }
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

      {/* Count */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.cln_id.toString()}
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
              title={item.cln_name}
              subtitle={`${item.cln_code} (${item.tsp_name})`}
            />

            <Card.Actions>
              <Button onPress={() => navigation.navigate('ClinicForm', { clinic: item })}>
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.cln_id)}
                disabled={deletingIds.includes(item.cln_id)}
                onPress={() => handleDelete(item.cln_id)}
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
        onPress={() => navigation.navigate('ClinicForm')}
      />
    </View>
  );
}