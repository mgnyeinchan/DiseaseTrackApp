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
  TextInput
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import {
  getDivisions,
  deleteDivision
} from '../../services/divisionApi';

import { AuthContext } from '../../context/AuthContext';

export default function DivisionListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true); // 🔥 FIX

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const LIMIT = 10;

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getDivisions(pageNumber, LIMIT, debouncedSearch);

      if (pageNumber === 1) {
        setData(res.data.data);
      } else {
        setData(prev => {
          const map = new Map();
          [...prev, ...res.data.data].forEach(item => {
            map.set(item.div_id, item);
          });
          return Array.from(map.values());
        });
      }

      setTotal(res.data.meta.total);
      setHasMore(res.data.data.length === LIMIT);
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
      setInitialLoading(false); // 🔥 IMPORTANT
    }
  };

  // 🔥 reload
  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true); // 🔥 reset
      loadData(1, true);
    }, [debouncedSearch])
  );

  // 🔥 infinite scroll
  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1);
    }
  };

  // 🔥 delete
  const handleDelete = (id: number) => {

    Alert.alert('Confirm', 'Delete this division?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const oldData = [...data];

          // optimistic remove
          setData(prev => prev.filter(item => item.div_id !== id));

          try {
            await deleteDivision(id);
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

  // 🔥 skeleton
  const renderSkeleton = () => (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <View style={{
          height: 20,
          backgroundColor: '#eee',
          marginBottom: 10,
          borderRadius: 4
        }} />
        <View style={{
          height: 15,
          width: '60%',
          backgroundColor: '#eee',
          borderRadius: 4
        }} />
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search division..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* 📊 Count */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.div_id.toString()}

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
              title={item.div_name}
              subtitle={item.div_code}
            />

            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate('DivisionForm', { division: item })
                }
              >
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.div_id)}
                disabled={deletingIds.includes(item.div_id)}
                onPress={() => handleDelete(item.div_id)}
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
        onPress={() => navigation.navigate('DivisionForm')}
      />

    </View>
  );
}