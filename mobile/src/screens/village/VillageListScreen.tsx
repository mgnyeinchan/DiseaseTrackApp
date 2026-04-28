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
  getVillages,
  deleteVillage,
  getTownshipsDropdown
} from '../../services/villageApi';

import { AuthContext } from '../../context/AuthContext';

type Village = {
  village_id: number;
  village_code: string;
  village_name: string;
  tsp_name: string;
  village_tsp_id: number;
};

type Township = {
  tsp_id: number;
  tsp_name: string;
};

export default function VillageListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<Village[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [townshipId, setTownshipId] = useState<number | undefined>(undefined);
  const [townships, setTownships] = useState<Township[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const LIMIT = 10;

  // 🔥 debounce main search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 load dropdown
  useEffect(() => {
    getTownshipsDropdown()
      .then((res: any) => {
        if (Array.isArray(res.data)) {
          setTownships(res.data);
        } else {
          setTownships([]);
        }
      })
      .catch(() => {
        setTownships([]);
        Alert.alert('Error', 'Failed to load townships');
      });
  }, []);

  // 🔥 load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getVillages(
        pageNumber,
        LIMIT,
        debouncedSearch,
        townshipId
      );

      const list = res.data.data;

      if (pageNumber === 1) {
        setData(list);
      } else {
        setData(prev => {
          const map = new Map<number, Village>();
          [...prev, ...list].forEach(item => {
            map.set(item.village_id, item);
          });
          return Array.from(map.values());
        });
      }

      setTotal(res.data.meta.total);
      setHasMore(list.length === LIMIT);
      setPage(pageNumber);

    } catch (err: any) {
      if (err?.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
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

  // 🔥 reload
  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      loadData(1, true);
    }, [debouncedSearch, townshipId])
  );

  // 🔥 load more
  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1);
    }
  };

  // 🔥 delete
  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete this village?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const oldData = [...data];
          setData(prev => prev.filter(x => x.village_id !== id));

          try {
            await deleteVillage(id);
          } catch (err: any) {
            setData(oldData);
            Alert.alert('Error', err.message);
          } finally {
            setDeletingIds(prev => prev.filter(x => x !== id));
          }
        }
      }
    ]);
  };

  // 🔥 skeleton
  const renderSkeleton = () => (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <View style={{ height: 20, backgroundColor: '#eee', marginBottom: 10 }} />
        <View style={{ height: 15, width: '60%', backgroundColor: '#eee' }} />
      </Card.Content>
    </Card>
  );

  const selectedTownship = townships.find(t => t.tsp_id === townshipId);

  // 🔥 dropdown filter
  const filteredTownships = townships.filter(t =>
    t.tsp_name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search village..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* 🔽 Filter */}
      <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <TextInput
            label="Filter Township"
            value={selectedTownship?.tsp_name || ''}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </TouchableOpacity>
      </View>

      {/* 🔽 Dropdown Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 10,
            padding: 10,
            maxHeight: '80%'
          }}
        >

          {/* 🔍 dropdown search */}
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
              }}>
                All
              </Button>
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

      {/* 📊 Count */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      {/* 📋 List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.village_id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(1, true)}
          />
        }

        ListFooterComponent={
          loading && !initialLoading
            ? <ActivityIndicator style={{ margin: 10 }} />
            : null
        }

        ListEmptyComponent={() => {
          if (initialLoading) {
            return (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View key={i}>{renderSkeleton()}</View>
                ))}
              </>
            );
          }

          return (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No Data
            </Text>
          );
        }}

        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Title
              title={item.village_name}
              subtitle={`${item.village_code} (${item.tsp_name})`}
            />

            <Card.Actions>
              <Button onPress={() =>
                navigation.navigate('VillageForm', { village: item })
              }>
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.village_id)}
                disabled={deletingIds.includes(item.village_id)}
                onPress={() => handleDelete(item.village_id)}
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
        onPress={() => navigation.navigate('VillageForm')}
      />

    </View>
  );
}