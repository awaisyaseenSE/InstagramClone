import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid, Platform} from 'react-native';

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //   console.log('Authorization status:', authStatus);
      if (Platform.OS === 'android') {
        const grants = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (grants === PermissionsAndroid.RESULTS.GRANTED) {
          getFcmToken();
        }
      } else {
        getFcmToken();
      }
    }
  } catch (error) {
    console.error(
      'Error for requesting permission in notification services file:',
      error,
    );
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      console.log('.....FCM TOken.....', fcmToken);
      if (fcmToken) {
        console.log('new generated fcm token is: ', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(
        'Error in notificationServices file while setting fcm token to async storage: ',
        error,
      );
    }
  } else {
    // console.log('old fcm token is: ', fcmToken);
  }
};

export const notificationListner = async () => {
  // this is for handling notification in background state
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // this is for handling notification in foreground state
  messaging().onMessage(async remoteMessage => {
    console.log('Notification foreground:', remoteMessage.notification);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
