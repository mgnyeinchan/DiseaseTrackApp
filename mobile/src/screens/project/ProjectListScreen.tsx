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

import { getProjects, deleteProject } from '../../services/projectApi';
import { AuthContext } from '../../context/AuthContext';

export default function ProjectListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]); // 🔥 prevent double click

  const LIMIT = 10;

  // 🔥 Debounce
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

      const res = await getProjects(pageNumber, LIMIT, debouncedSearch);

      if (pageNumber === 1) {
        setData(res.data.data);
      } else {
        setData(prev => {
          const map = new Map();
          [...prev, ...res.data.data].forEach(item => {
            map.set(item.project_id, item);
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
    }
  };

  // 🔥 reload
  useFocusEffect(
    useCallback(() => {
      loadData(1, true);
    }, [debouncedSearch])
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1);
    }
  };

  // 🔥 Optimistic Delete
  const handleDelete = (id: number) => {

    Alert.alert('Confirm', 'Delete this project?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          // prevent double click
          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const oldData = [...data];

          // 🔥 remove from UI immediately
          setData(prev => prev.filter(item => item.project_id !== id));

          try {
            await deleteProject(id);
          } catch (err: any) {
            // rollback
            setData(oldData);
            Alert.alert('Error', err.message);
          } finally {
            setDeletingIds(prev => prev.filter(x => x !== id));
          }
        }
      }
    ]);
  };

  // 🔥 Skeleton
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

  return (
    <View style={{ flex: 1 }}>

      <TextInput
        placeholder="Search project..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total} projects
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.project_id.toString()}

        onEndReached={loadMore}
        onEndReachedThreshold={0.5}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(1, true)}
          />
        }

        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 10 }} /> : null
        }

        ListEmptyComponent={
          loading
            ? <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View key={i}>{renderSkeleton()}</View>
                ))}
              </>
            : <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No Data
              </Text>
        }

        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Title
              title={item.project_name}
              subtitle={item.project_code}
            />

            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate('ProjectForm', { project: item })
                }
              >
                Edit
              </Button>

              <Button
                loading={deletingIds.includes(item.project_id)}
                disabled={deletingIds.includes(item.project_id)}
                onPress={() => handleDelete(item.project_id)}
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
        onPress={() => navigation.navigate('ProjectForm')}
      />
    </View>
  );
}