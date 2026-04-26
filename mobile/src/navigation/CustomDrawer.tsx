import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { AuthContext } from '../context/AuthContext';

export default function CustomDrawer({ navigation }: any) {
  const [openSetup, setOpenSetup] = useState(false);
  const { user } = useContext(AuthContext); // role
  
  return (
    <DrawerContentScrollView>
      <View style={styles.container}>

        {/* 🔹 DATA ENTRY */}
        <Text style={styles.section}>Data Entry</Text>

        <DrawerItem label="Weekly Reporting Form" icon="document-text-outline"
          onPress={() => navigation.navigate('Weekly')} />

        <DrawerItem label="Case-based Reporting Form" icon="medkit-outline"
          onPress={() => navigation.navigate('Case')} />

        <DrawerItem label="Event-based Surveillance Form" icon="alert-circle-outline"
          onPress={() => navigation.navigate('Event')} />

        {/* 🔹 EXPORT */}
        <Text style={styles.section}>Export</Text>

        <DrawerItem
          label="Weekly Export"
          icon="download-outline"
          onPress={() => navigation.navigate('WeeklyExport')}
        />

        <DrawerItem
          label="Case Export"
          icon="file-tray-full-outline"
          onPress={() => navigation.navigate('CaseExport')}
        />

        <DrawerItem
          label="Event Export"
          icon="cloud-download-outline"
          onPress={() => navigation.navigate('EventExport')}
        />

        {/* 🔹 DASHBOARD */}
        {(user?.role === 'admin' || user?.role === 'supervisor') && (
        <>
            <Text style={styles.section}>Dashboard</Text>

            <DrawerItem
              label="Summary Dashboard"
              icon="stats-chart-outline"
              onPress={() => navigation.navigate('Dashboard', {
                screen: 'SummaryDashboard'
              })}
            />

            <DrawerItem
              label="Detail Dashboard"
              icon="bar-chart-outline"
              onPress={() => navigation.navigate('Dashboard', {
                screen: 'DetailDashboard'
              })}
            />
        </>
        )}

        {/* 🔹 DATA SETUP */}
        {(user?.role === 'admin' || user?.role === 'supervisor') && (
          <>
            {/* ✅ SECTION TITLE */}
            <Text style={styles.section}>Setup</Text>

            {/* ✅ HEADER (dropdown trigger) */}
            <TouchableOpacity
              onPress={() => setOpenSetup(!openSetup)}
              style={styles.dropdownHeader}
            >
              <Icon name="settings-outline" size={20} />

              <Text style={styles.dropdownLabel}>Data Setup</Text>

              <Icon
                name={openSetup ? 'chevron-up' : 'chevron-down'}
                size={20}
              />
            </TouchableOpacity>

            {/* ✅ SUB MENU */}
            {openSetup && (
              <View style={styles.subMenu}>
                <DrawerItem label="Project Setup" onPress={() => navigation.navigate('Home', {
                  screen: 'Projects',
                  params: {
                    screen: 'ProjectList',
                    params: {}
                  }
                })} />
                <DrawerItem label="Org Setup" onPress={() => navigation.navigate('Org')} />
                <DrawerItem label="Division Setup" onPress={() => navigation.navigate('Division')} />
                <DrawerItem label="Township Setup" onPress={() => navigation.navigate('Township')} />
                <DrawerItem label="Village Setup" onPress={() => navigation.navigate('Village')} />
                <DrawerItem label="Clinic Setup" onPress={() => navigation.navigate('Clinic')} />
              </View>
            )}
          </>
        )}
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerItem({ label, onPress, icon }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.item}
    >
      {icon && <Icon name={icon} size={20} style={{ marginRight: 10 }} />}
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#666'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  label: {
    flex: 1,
    marginLeft: 10
  },
  subMenu: {
    paddingLeft: 20,
    marginTop: 5
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 8
  },
  dropdownLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14
  },
});