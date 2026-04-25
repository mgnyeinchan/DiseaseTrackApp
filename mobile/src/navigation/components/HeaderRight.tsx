import React, { useState, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Portal, Modal, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

export default function HeaderRight() {
  const [visible, setVisible] = useState(false);
  const { logout } = useContext(AuthContext);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 15 }}>
        <Icon name="settings-outline" size={24} />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          {/* <Text style={{ fontSize: 18, marginBottom: 10 }}>Menu</Text> */}

          <Button onPress={() => {}}>Account Settings</Button>
          <Button onPress={() => {}}>About</Button>

          <Button textColor="red" onPress={logout}>
            Logout
          </Button>
        </Modal>
      </Portal>
    </>
  );
}