import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useContext(AuthContext);

  const goToForm = (module: string) => {
    navigation.navigate(module, {
      screen: `${module}Form`,
    });
  };

  const goToList = (module: string) => {
    navigation.navigate(module, {
      screen: `${module}List`,
    });
  };

  const ActionCard = ({ title, module }: any) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text style={styles.cardTitle}>{title}</Text>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          style={styles.addBtn}
          onPress={() => goToForm(module)}
        >
          Add
        </Button>

        <Button
          mode="outlined"
          onPress={() => goToList(module)}
        >
          View
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      
      {/* 👋 Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.username}>{user?.username}</Text>
      </View>

      {/* ⚡ Quick Actions */}
      <Text style={styles.section}>Quick Actions</Text>

      <View style={styles.grid}>
        <ActionCard title="Casebase" module="Casebase" />
        <ActionCard title="Surveillance" module="Surveillance" />
        <ActionCard title="Weekly Report" module="Weekly" />
      </View>

      {/* 🔒 Admin Panel */}
      {user?.role === 'admin' && (
        <>
          <Text style={styles.section}>Admin Panel</Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Setup Data</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Projects')}>
                Projects
              </Button>
              <Button onPress={() => navigation.navigate('Org')}>
                Org
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Analytics</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('DashboardStats')}
              >
                View Charts
              </Button>
            </Card.Actions>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7FB',
  },

  header: {
    marginBottom: 20,
  },

  welcome: {
    fontSize: 16,
    color: '#777',
  },

  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  section: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },

  grid: {
    gap: 12,
  },

  card: {
    borderRadius: 16,
    marginBottom: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  addBtn: {
    borderRadius: 8,
  },
});