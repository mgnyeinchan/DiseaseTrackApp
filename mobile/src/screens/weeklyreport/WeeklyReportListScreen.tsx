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
  ActivityIndicator,
  TextInput,
  Modal,
  Portal
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import {
  getWeeklyReports,
  deleteWeeklyReport
} from '../../services/weeklyreportApi';
import { getFacilitiesDropdown } from '../../services/facilityApi';

import { AuthContext } from '../../context/AuthContext';

type Report = {
  id: number;
  reporter_name: string;
  report_week: number;
  report_year: number;
  facility_name: string;
};

type Facility = {
  facility_id: number;
  facility_name: string;
};

export default function WeeklyReportListScreen({ navigation }: any) {

  const { logout } = useContext(AuthContext);

  const [data, setData] = useState<Report[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [year, setYear] = useState<number | undefined>();
  const [week, setWeek] = useState<number | undefined>();
  const [facilityId, setFacilityId] = useState<number | undefined>();

  const [facilities, setFacilities] = useState<Facility[]>([]);

  const [modal, setModal] = useState<'year' | 'week' | 'facility' | null>(null);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const LIMIT = 10;

  // 🔥 debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  // 🔥 load dropdown
  useEffect(() => {
    getFacilitiesDropdown()
      .then((res: any) => setFacilities(res.data || []))
      .catch(() => Alert.alert('Error', 'Failed to load facility'));
  }, []);

  // 🔥 load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getWeeklyReports(
        pageNumber,
        LIMIT,
        year,
        week,
        facilityId
      );

      const list = res.data.data;

      if (pageNumber === 1) setData(list);
      else {
        setData(prev => {
          const map = new Map<number, Report>();
          [...prev, ...list].forEach(i => map.set(i.id, i));
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
    }, [debouncedSearch, year, week, facilityId])
  );

  const loadMore = () => {
    if (!loading && hasMore) loadData(page + 1);
  };

  // 🔥 delete (optimistic)
  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const old = [...data];
          setData(prev => prev.filter(x => x.id !== id));

          try {
            await deleteWeeklyReport(id);
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

  return (
    <View style={{ flex: 1 }}>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search reporter..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* 🔽 Filters */}
      <TouchableOpacity onPress={() => setModal('year')}>
        <TextInput label="Year" value={year?.toString() || ''} editable={false} style={{ margin: 10 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModal('week')}>
        <TextInput label="Week" value={week?.toString() || ''} editable={false} style={{ margin: 10 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModal('facility')}>
        <TextInput
          label="Facility"
          value={facilities.find(f => f.facility_id === facilityId)?.facility_name || ''}
          editable={false}
          style={{ margin: 10 }}
        />
      </TouchableOpacity>

      {/* 📊 Count */}
      <Text style={{ marginLeft: 10 }}>
        Showing {data.length} of {total}
      </Text>

      {/* 📄 List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(1, true)} />
        }

        ListEmptyComponent={() =>
          initialLoading
            ? <>{Array.from({ length: 5 }).map((_, i) => <View key={i}>{renderSkeleton()}</View>)}</>
            : <Text style={{ textAlign: 'center' }}>No Data</Text>
        }

        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Title
              title={item.reporter_name}
              subtitle={`Week ${item.report_week} / ${item.report_year} (${item.facility_name})`}
            />

            <Card.Actions>
              <Button onPress={() => navigation.navigate('WeeklyReportForm', { id: item.id })}>
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

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 20, bottom: 20 }}
        onPress={() => navigation.navigate('WeeklyReportForm')}
      />
    </View>
  );
}