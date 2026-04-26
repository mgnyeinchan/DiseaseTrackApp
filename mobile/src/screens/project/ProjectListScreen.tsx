import React, { useState, useContext, useCallback } from 'react';
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

  // 🔥 NEW
  const [search, setSearch] = useState('');

  const LIMIT = 10;

  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getProjects(
        pageNumber,
        LIMIT,
        search
      );

      if (pageNumber === 1) {
        setData(res.data.data);
      } else {
        setData(prev => [...prev, ...res.data.data]);
      }

      setHasMore(res.data.data.length === LIMIT);
      setPage(pageNumber);

    } catch (err: any) {
      console.log(err);

      if (err?.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        logout();
      }

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔥 reload when screen focus
  useFocusEffect(
    useCallback(() => {
      loadData(1, true);
    }, [search])
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      loadData(page + 1);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete this project?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteProject(id);
          loadData(1, true);
        }
      }
    ]);
  };

  // 🔥 SEARCH HANDLER
  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  return (
    <View style={{ flex: 1 }}>

      {/* 🔥 SEARCH BOX */}
      <TextInput
        placeholder="Search project..."
        value={search}
        onChangeText={handleSearch}
        style={{ margin: 10 }}
      />

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

              <Button onPress={() => handleDelete(item.project_id)}>
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