import {View, Text} from 'react-native';
import React from 'react';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';

export default function ProfileScreen() {
  const {logout} = useAuth();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };
  return (
    <View style={{alignItems: 'center', marginTop: 30}}>
      <ButtonComponent
        title="Logout"
        style={{width: '60%', height: 38}}
        onPress={handleLogout}
      />
    </View>
  );
}
