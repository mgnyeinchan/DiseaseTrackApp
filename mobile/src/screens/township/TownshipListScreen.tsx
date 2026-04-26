import React, { useState, useContext, useCallback, useEffect } from 'react';
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
  Menu,
  Modal
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import {
  getTownships,
  deleteTownship,
  getDivisions
} from '../../services/townshipApi';

import { AuthContext } from '../../context/AuthContext';
import { Portal } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

type Township = {
  tsp_id: number;
  tsp_code: string;
  tsp_name: string;
  div_name: string;
  tps_div_id: number;
};

type Division = {
  div_id: number;
  div_name: string;
};

export default function TownshipListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<Township[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 🔥 filter (FIXED TYPE)
  const [divisionId, setDivisionId] = useState<number | undefined>(undefined);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const LIMIT = 10;

  // 🔥 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 load divisions
  useEffect(() => {
    getDivisions()
      .then(res => {
        if (Array.isArray(res.data)) {
          setDivisions(res.data);
        } else {
          setDivisions([]); // fallback
        }
      })
      .catch(() => {
        setDivisions([]);
        Alert.alert('Error', 'Failed to load divisions');
      });
  }, []);

  // 🔥 load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getTownships(
        pageNumber,
        LIMIT,
        debouncedSearch,
        divisionId
      );

      const list = res.data.data;

      if (pageNumber === 1) {
        setData(list);
      } else {
        setData(prev => {
          const map = new Map<number, Township>();
          [...prev, ...list].forEach(item => {
            map.set(item.tsp_id, item);
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

  // 🔥 reload when search or filter change
  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      loadData(1, true);
    }, [debouncedSearch, divisionId])
  );

  // 🔥 infinite scroll
  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1);
    }
  };

  // 🔥 optimistic delete
  const handleDelete = (id: number) => {

    Alert.alert('Confirm', 'Delete this township?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const oldData = [...data];

          // remove instantly
          setData(prev => prev.filter(x => x.tsp_id !== id));

          try {
            await deleteTownship(id);
          } catch (err: any) {
            setData(oldData); // rollback
            Alert.alert('Error', err.message);
          } finally {
            setDeletingIds(prev => prev.filter(x => x !== id));
          }
        }
      }
    ]);
  };

  // 🔥 skeleton UI
  const renderSkeleton = () => (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <View
          style={{
            height: 20,
            backgroundColor: '#eee',
            marginBottom: 10,
            borderRadius: 4
          }}
        />
        <View
          style={{
            height: 15,
            width: '60%',
            backgroundColor: '#eee',
            borderRadius: 4
          }}
        />
      </Card.Content>
    </Card>
  );

  const selectedDivision = Array.isArray(divisions)
  ? divisions.find(d => d.div_id === divisionId)
  : undefined;

  return (
    <View style={{ flex: 1 }}>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search township..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* 🔽 Division Filter */}
      <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <TextInput
            label="Filter Division"
            value={selectedDivision?.div_name || ''}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" />}
          />
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 10,
            padding: 10
          }}
        >

          {/* All option */}
          <Button
            onPress={() => {
              setDivisionId(undefined);
              setModalVisible(false);
            }}
          >
            All
          </Button>

          {divisions.map(d => (
            <Button
              key={d.div_id}
              onPress={() => {
                setDivisionId(d.div_id);
                setModalVisible(false);
              }}
            >
              {d.div_name}
            </Button>
          ))}

        </Modal>
      </Portal>

      {/* 📊 Count */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      {/* 📋 List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.tsp_id.toString()}

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
              title={item.tsp_name}
              subtitle={`${item.tsp_code} (${item.div_name})`}
            />

            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate('TownshipForm', { township: item })
                }
              >
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.tsp_id)}
                disabled={deletingIds.includes(item.tsp_id)}
                onPress={() => handleDelete(item.tsp_id)}
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
        onPress={() => navigation.navigate('TownshipForm')}
      />

    </View>
  );
}