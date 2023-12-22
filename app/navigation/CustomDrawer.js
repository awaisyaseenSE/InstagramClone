import React, {useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Alert,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import colors from '../styles/colors';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../auth/useAuth';
import {useTheme} from '../themes/ThemeContext';
import ProfileDrawerStyle from './style/ProfileDrawerStyle';
import fontFamily from '../styles/fontFamily';
import DrawerItemListCompo from './DrawerItemListCompo';
import navigationStrings from './navigationStrings';

function CustomDrawer(props) {
  const {theme} = useTheme();
  const styles = ProfileDrawerStyle(theme);
  // const {navigation} = props;
  const {logout} = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };

  return (
    <>
      <DrawerContentScrollView
        style={{
          backgroundColor: theme.background,
          width: '100%',
          paddingHorizontal: 12,
        }}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.userNameText,
            {marginTop: Platform.OS === 'android' ? 10 : 0},
          ]}>
          {auth().currentUser?.displayName}
        </Text>
        <View style={{flex: 1, marginTop: 18}}>
          <DrawerItemListCompo
            image={require('../assets/time.png')}
            title="Archive"
          />
          <DrawerItemListCompo
            image={require('../assets/activity.png')}
            title="Your Activity"
          />
          <DrawerItemListCompo
            image={require('../assets/nametag.png')}
            title="Nametag"
          />
          <DrawerItemListCompo
            image={require('../assets/save.png')}
            title="Saved"
            onPress={() =>
              navigation.navigate(navigationStrings.SAVED_POSTS_SCREEN)
            }
          />
          <DrawerItemListCompo
            image={require('../assets/close_friends.png')}
            title="Closed Friends"
          />
          <DrawerItemListCompo
            image={require('../assets/find_people.png')}
            title="Discover People"
          />
          <DrawerItemListCompo
            image={require('../assets/facebook.png')}
            title="Open Facebook"
          />
          <DrawerItemListCompo
            image={require('../assets/setting.png')}
            title="Settings"
            onPress={() =>
              navigation.navigate(navigationStrings.SETTING_SCREEN)
            }
          />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 12,
          backgroundColor: theme.background,
        }}>
        <DrawerItemListCompo
          image={require('../assets/exit.png')}
          title="Logout"
          style={{marginBottom: Platform.OS === 'ios' ? 8 : 2}}
          onPress={handleLogout}
        />
      </View>
    </>
  );
}

export default CustomDrawer;
