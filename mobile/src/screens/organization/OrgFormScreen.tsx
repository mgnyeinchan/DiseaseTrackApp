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
  getOrgs,
  deleteOrg
} from '../../services/orgApi';

import { AuthContext } from '../../context/AuthContext';

export default function OrgListScreen({ navigation }: any) {

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

  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getOrgs(pageNumber, LIMIT, debouncedSearch);

      if (pageNumber === 1) {
        setData(res.data.data);
      } else {
        setData(prev => {
          const map = new Map();
          [...prev, ...res.data.data].forEach(item => {
            map.set(item.org_id, item);
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

  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true); // 🔥 reset
      loadData(1, true);
    }, [debouncedSearch])
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1);
    }
  };

  // 🔥 delete
  const handleDelete = (id: number) => {

    Alert.alert('Confirm', 'Delete this organization?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const oldData = [...data];

          setData(prev => prev.filter(item => item.org_id !== id));

          try {
            await deleteOrg(id);
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
        placeholder="Search organization..."
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
        keyExtractor={(item) => item.org_id.toString()}

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
              title={item.org_name}
              subtitle={item.org_code}
            />

            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate('OrgForm', { org: item })
                }
              >
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.org_id)}
                disabled={deletingIds.includes(item.org_id)}
                onPress={() => handleDelete(item.org_id)}
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
        onPress={() => navigation.navigate('OrgForm')}
      />

    </View>
  );
}