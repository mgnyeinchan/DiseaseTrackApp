import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import API from '../../services/api';
import { styles } from '../../styles/caseListStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function CaseListScreen({ navigation }: any) {
  
  const [cases, setCases] = useState<any[]>([]);

  const fetchCases = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("TOKEN:", token);
      const res = await API.get('/api/cases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [])
  );

  return (
    <View style={styles.container}>
      
      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddCase')}
      >
        <Text style={styles.addText}>+ Add Case</Text>
      </TouchableOpacity>

      <FlatList
        data={cases}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.age}>Age: {item.age}</Text>

            <View style={styles.actions}>
              
              <TouchableOpacity
                style={[styles.btn, styles.editBtn]}
                onPress={() => navigation.navigate('EditCase', { item })}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={async () => {
                  await API.delete(`/api/cases/${item.id}`);
                  fetchCases();
                }}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />
    </View>
  );
}