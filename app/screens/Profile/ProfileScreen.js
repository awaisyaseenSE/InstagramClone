import {View, Text} from 'react-native';
import React from 'react';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';
import colors from '../../styles/colors';

export default function ProfileScreen() {
  const userData = auth().currentUser;
  const {logout} = useAuth();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };
  return (
    <View style={{alignItems: 'center', marginTop: 30}}>
      <View style={{alignItems: 'center', marginBottom: 18}}>
        <Text style={{color: colors.blue, fontSize: 20}}>
          Welcome {userData.displayName}
        </Text>
        <Text style={{color: 'seagreen', fontSize: 20, marginVertical: 12}}>
          {userData.email}
        </Text>
        <Text style={{fontSize: 16, color: 'tomato', fontWeight: 'bold'}}>
          {userData.emailVerified
            ? 'Verfied Account'
            : 'Please Verify your Account'}
        </Text>
      </View>
      <ButtonComponent
        title="Logout"
        style={{width: '60%', height: 38}}
        onPress={handleLogout}
      />
    </View>
  );
}
