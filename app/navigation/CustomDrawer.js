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
} from 'react-native';
import colors from '../styles/colors';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../auth/useAuth';

function CustomDrawer(props) {
  const [userStatus, setUserStatus] = useState('');
  const [userExist, setUserExist] = useState(false);
  const {navigation} = props;
  const {logout} = useAuth();

  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };

  return (
    <>
      <DrawerContentScrollView
        style={{backgroundColor: colors.white, width: '100%'}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoStyle}
            resizeMode="contain"
          />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          backgroundColor: colors.blue,
          paddingVertical: 24,
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          style={styles.itemDetailContainer}
          activeOpacity={0.5}
          onPress={handleLogout}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoutIconStyle}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    paddingVertical: 50,
    alignItems: 'center',
  },
  logoStyle: {
    width: 110,
    height: 70,
  },
  profileImageStyle: {
    width: 70,
    height: 70,
  },
  profileDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 14,
  },
  profileNameText: {
    fontSize: 16,
    fontFamily: 'UberMove-Medium',
    marginLeft: 12,
  },
  mainContainer: {
    backgroundColor: colors.offWhite,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flex: 1,
  },
  iconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'UberMove-Medium',
    marginLeft: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'UberMove-Medium',
    marginLeft: 12,
  },
  logoutIconStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
});

export default CustomDrawer;
