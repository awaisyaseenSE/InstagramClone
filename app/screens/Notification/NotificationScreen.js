import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import {
  sendSingleNotification,
  sendNotificationToAll,
} from '../../utils/sendNotification';
import auth from '@react-native-firebase/auth';
import colors from '../../styles/colors';

export default function NotificationScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  // senderID,
  // receiverID,
  // title,
  // body,
  // imageUrl,
  // type,
  // classID,
  const senderID = auth().currentUser?.uid;
  const receiverID = 'r1WHmkg9OCQUAH5Y750AQMl9kdw1';
  const title = 'This is Notification from Local';
  const body = 'body of notification is here';
  const imageUrl =
    'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_640.jpg';
  const type = 'post';
  const typeID = 'ksjfkljsdl';
  const fcmToken =
    'f1EEx0igRYKZ-byIo_WFFt:APA91bHYDdI8WZdXRofLoFdlOkJ4E6AwVVC8gSRO9R_DGnHxUgAQJ5UICn-BS7vst79sIXbf9KiAGSrCrosTTDprMecUT8GEojEye6wmjPK8GFWsaaCrxgaXAbTv5Ajl9mUMsWyF5B8F';
  const handleNotification = async () => {
    await sendSingleNotification(
      senderID,
      receiverID,
      title,
      body,
      imageUrl,
      type,
      typeID,
      fcmToken,
    );
  };

  const handleSendAllNotfication = () => {
    sendNotificationToAll();
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Notification"
          onPress={() => navigation.goBack()}
        />
        <View style={{alignItems: 'center', marginTop: 12}}>
          <ButtonComponent
            title="Send Notification"
            onPress={() => handleNotification()}
            style={{width: '70%', marginVertical: 14}}
          />
          <ButtonComponent
            title="Send Notification To All"
            onPress={() => handleSendAllNotfication()}
            style={{backgroundColor: colors.lightBlack, width: '70%'}}
          />
        </View>
      </ScreenComponent>
    </>
  );
}
