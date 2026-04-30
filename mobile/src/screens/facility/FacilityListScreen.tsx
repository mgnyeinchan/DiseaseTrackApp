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
  getFacilities,
  deleteFacility,
  getDivisionsDropdown,
  getTownshipsDropdown,
  getOrgsDropdown
} from '../../services/facilityApi';

import { AuthContext } from '../../context/AuthContext';

export default function FacilityListScreen({ navigation }: any) {

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

  // 🔥 filters
  const [divId, setDivId] = useState<number | undefined>();
  const [tspId, setTspId] = useState<number | undefined>();
  const [orgId, setOrgId] = useState<number | undefined>();

  const [divisions, setDivisions] = useState<any[]>([]);
  const [townships, setTownships] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);

  const [modalType, setModalType] = useState<'div' | 'tsp' | 'org' | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const LIMIT = 10;

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 load dropdowns
  useEffect(() => {
    getDivisionsDropdown().then((res:any) => setDivisions(res.data || []));
    getTownshipsDropdown().then((res:any) => setTownships(res.data || []));
    getOrgsDropdown().then((res:any) => setOrgs(res.data || []));
  }, []);

  // 🔥 load data
  const loadData = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getFacilities(
        pageNumber,
        LIMIT,
        debouncedSearch,
        divId,
        tspId,
        orgId
      );

      const list = res.data.data;

      if (pageNumber === 1) setData(list);
      else {
        setData(prev => {
          const map = new Map();
          [...prev, ...list].forEach(i => map.set(i.facility_id, i));
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
    }, [debouncedSearch, divId, tspId, orgId])
  );

  const loadMore = () => {
    if (!loading && hasMore) loadData(page + 1);
  };

  // 🔥 delete
  const handleDelete = (id: number) => {
    Alert.alert('Confirm', 'Delete this facility?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {

          if (deletingIds.includes(id)) return;

          setDeletingIds(prev => [...prev, id]);

          const old = [...data];
          setData(prev => prev.filter(x => x.facility_id !== id));

          try {
            await deleteFacility(id);
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

  // 🔥 dropdown data
  const getList = () => {
    let list = modalType === 'div' ? divisions :
               modalType === 'tsp' ? townships :
               orgs;

    return list.filter((i:any) =>
      (i.div_name || i.tsp_name || i.org_name)
        .toLowerCase()
        .includes(dropdownSearch.toLowerCase())
    );
  };

  const handleSelect = (item:any) => {
    if (modalType === 'div') setDivId(item.div_id);
    if (modalType === 'tsp') setTspId(item.tsp_id);
    if (modalType === 'org') setOrgId(item.org_id);
    setModalType(null);
  };

  return (
    <View style={{ flex: 1 }}>

      {/* 🔍 Search */}
      <TextInput
        placeholder="Search facility..."
        value={search}
        onChangeText={setSearch}
        style={{ margin: 10 }}
      />

      {/* 🔽 Filters */}
      <TouchableOpacity onPress={() => setModalType('div')}>
        <TextInput label="Division" value={divisions.find(d=>d.div_id===divId)?.div_name || ''} editable={false} style={{ margin: 10 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalType('tsp')}>
        <TextInput label="Township" value={townships.find(t=>t.tsp_id===tspId)?.tsp_name || ''} editable={false} style={{ margin: 10 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalType('org')}>
        <TextInput label="Organization" value={orgs.find(o=>o.org_id===orgId)?.org_name || ''} editable={false} style={{ margin: 10 }} />
      </TouchableOpacity>

      {/* 🔽 Dropdown Modal */}
      <Portal>
        <Modal visible={!!modalType} onDismiss={()=>setModalType(null)}
          contentContainerStyle={{ backgroundColor:'white', margin:20, padding:10, borderRadius:10, maxHeight:'80%' }}>

          <TextInput
            placeholder="Search..."
            value={dropdownSearch}
            onChangeText={setDropdownSearch}
          />

          <FlatList
            data={getList()}
            keyExtractor={(item:any)=>String(item.id || item.div_id || item.tsp_id || item.org_id)}
            ListHeaderComponent={
              <Button onPress={()=>{
                if(modalType==='div') setDivId(undefined);
                if(modalType==='tsp') setTspId(undefined);
                if(modalType==='org') setOrgId(undefined);
                setModalType(null);
              }}>All</Button>
            }
            renderItem={({item})=>(
              <Button onPress={()=>handleSelect(item)}>
                {item.div_name || item.tsp_name || item.org_name}
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
        keyExtractor={(item)=>item.facility_id.toString()}
        onEndReached={loadMore}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>loadData(1,true)} />}
        ListEmptyComponent={() =>
          initialLoading
            ? <>{Array.from({length:5}).map((_,i)=><View key={i}>{renderSkeleton()}</View>)}</>
            : <Text style={{ textAlign:'center' }}>No Data</Text>
        }
        renderItem={({item})=>(
          <Card style={{ margin: 10 }}>
            <Card.Title
              title={item.facility_name}
              subtitle={`${item.facility_code} (${item.tsp_name || ''})`}
            />
            <Card.Actions>
              <Button onPress={()=>navigation.navigate('FacilityForm',{facility:item})}>Edit</Button>
              <Button
                loading={deletingIds.includes(item.facility_id)}
                disabled={deletingIds.includes(item.facility_id)}
                onPress={()=>handleDelete(item.facility_id)}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={{ position:'absolute', right:20, bottom:20 }}
        onPress={()=>navigation.navigate('FacilityForm')}
      />
    </View>
  );
}