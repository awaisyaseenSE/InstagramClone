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
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../auth/useAuth';
import {useTheme} from '../themes/ThemeContext';
import ProfileDrawerStyle from './style/ProfileDrawerStyle';
import fontFamily from '../styles/fontFamily';
import DrawerItemListCompo from './DrawerItemListCompo';
import navigationStrings from './navigationStrings';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {getCameraPermission} from '../utils/askPermissions';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

function CustomDrawer(props) {
  const {theme} = useTheme();
  const styles = ProfileDrawerStyle(theme);
  // const {navigation} = props;
  const {logout} = useAuth();
  const navigation = useNavigation();

  const handleLogoutAccount = async () => {
    try {
      const isSigned = await GoogleSignin.isSignedIn();
      // if (isSigned) await GoogleSignin.signOut();
      if (isSigned) {
        console.log('Google SigIN is ON..');
        GoogleSignin.configure({
          offlineAccess: true,
          webClientId:
            '10428894886-8td5vg45o4vnqk396ju99oveoa21a8ti.apps.googleusercontent.com',
        });
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        if (auth().currentUser) {
          logout();
        }
      } else {
        console.log('Google SigIN is OFF..');
        if (auth().currentUser) {
          logout();
        }
      }
    } catch (error) {
      console.log(
        'Error in checking google signIn is activate or not: ',
        error,
      );
    }
  };

  const handleLogout = () => {
    try {
      Alert.alert('Logout', 'Are you sure to Logout!', [
        {
          text: 'Yes',
          onPress: handleLogoutAccount,
        },
        {
          text: 'No',
        },
      ]);
    } catch (error) {
      console.log('============ERROR WHILE LOG OUT========================');
      console.log(error);
      console.log('====================================');
    }
  };

  const storeFcmTokenToFirestore = async fcmToken => {
    try {
      const userRef = firestore()
        .collection('users')
        .doc(auth().currentUser?.uid);
      const userData = await userRef.get();

      if (userData.exists) {
        const userDataObj = userData.data(); // Access user data using data() method

        if (userDataObj.hasOwnProperty('fcmToken')) {
          // If 'fcmToken' field already exists, update it
          await userRef.update({fcmToken: fcmToken});
        } else {
          // If 'fcmToken' field doesn't exist, set it
          await userRef.set({...userDataObj, fcmToken: fcmToken});
        }
      }
    } catch (error) {
      console.log('Error while storing fcm to user collection: ', error);
    }
  };

  const handleSetFcmToken = async () => {
    try {
      const token = await firebase.messaging().getToken();
      if (token) {
        await storeFcmTokenToFirestore(token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkGoogleSignIn = async () => {
    try {
      const isSigned = await GoogleSignin.isSignedIn();
      // if (isSigned) await GoogleSignin.signOut();
      if (isSigned) {
        console.log('Google SigIN is ON..');
      } else {
        console.log('Google SigIN is OFF..');
      }
    } catch (error) {
      console.log(
        'Error in checking google signIn is activate or not: ',
        error,
      );
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
            onPress={getCameraPermission}
          />
          <DrawerItemListCompo
            image={require('../assets/nametag.png')}
            title="Nametag"
            onPress={checkGoogleSignIn}
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
            onPress={() =>
              navigation.navigate(navigationStrings.DISCOVER_PEOPLE_SCREEN)
            }
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
          <DrawerItemListCompo
            image={require('../assets/forward.png')}
            title="Set Fcm token"
            onPress={() => handleSetFcmToken()}
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
