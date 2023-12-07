import {View, Text, Button} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import useAuth from '../auth/useAuth';
import auth from '@react-native-firebase/auth';

export default function Home() {
  const {logout} = useAuth();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };
  return (
    <>
      <ScreenComponent>
        <View>
          <Text>Welcome to Home Screen</Text>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}
