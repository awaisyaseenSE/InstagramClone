import {View, Text, Button} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import useAuth from '../auth/useAuth';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../themes/ThemeContext';
import TopHomeCompo from './components/TopHomeCompo';
import StoryComponent from './components/StoryComponent';

export default function Home() {
  const {logout} = useAuth();
  const {theme} = useTheme();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };
  return (
    <>
      <ScreenComponent
        style={{
          backgroundColor: theme.bottonTabBg,
          paddingTop: Platform.OS === 'android' ? 0 : 0,
        }}
        statusBarBg={theme.bottonTabBg}>
        <TopHomeCompo />
        <View style={{flex: 1, backgroundColor: theme.background}}>
          <StoryComponent />
          <Text style={{marginTop: 20}}>Welcome to Home Screen</Text>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}
