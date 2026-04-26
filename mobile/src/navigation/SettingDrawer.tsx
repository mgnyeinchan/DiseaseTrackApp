import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function AccountDrawer({ visible, onClose }: any) {
  const { user, logout } = useContext(AuthContext);
  const navigation: any = useNavigation();

  const go = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>

        {/* 🔹 USER PROFILE */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>

          <Text style={styles.username}>{user?.username || 'User'}</Text>
        </View>

        {/* 🔹 ACCOUNT SETTINGS */}
        <Text style={styles.section}>Account Settings</Text>

        <Item icon="call-outline" label="Phone Number" onPress={() => go('ChangePhone')} />
        <Item icon="mail-outline" label="Email" onPress={() => go('ChangeEmail')} />
        <Item icon="lock-closed-outline" label="Password" onPress={() => go('ChangePassword')} />

        <View style={styles.disabledItem}>
          <Icon name="person-outline" size={20} />
          <Text style={styles.disabledText}>Role: {user?.role}</Text>
        </View>

        {/* 🔹 OTHER */}
        <Text style={styles.section}>Others</Text>

        <Item icon="information-circle-outline" label="About" onPress={() => go('About')} />
        <Item icon="settings-outline" label="Settings" onPress={() => go('Settings')} />

        {/* 🔹 LOGOUT */}
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Icon name="log-out-outline" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </Modal>
    </Portal>
  );
}

function Item({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Icon name={icon} size={20} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },

  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },

  role: {
    color: '#888',
    fontSize: 13,
  },

  section: {
    marginTop: 15,
    marginBottom: 5,
    color: '#666',
    fontWeight: 'bold',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  label: {
    marginLeft: 10,
    fontSize: 15,
  },

  disabledItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    opacity: 0.5,
  },

  disabledText: {
    marginLeft: 10,
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },

  logoutText: {
    marginLeft: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});