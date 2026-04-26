import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingDrawer from '../SettingDrawer';

export default function HeaderRight() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 15 }}>
        <Icon name="settings-outline" size={24} />
      </TouchableOpacity>

      <SettingDrawer visible={visible} onClose={() => setVisible(false)} />
    </>
  );
}