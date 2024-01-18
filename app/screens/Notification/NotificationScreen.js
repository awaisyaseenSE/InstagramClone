import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';
import auth from '@react-native-firebase/auth';
import colors from '../../styles/colors';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import ShowNotificationCompo from '../components/ShowNotificationCompo';

export default function NotificationScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allNotificationsData = snap.docs.map(doc => ({...doc.data()}));
        const filteredNotificationsData = allNotificationsData.filter(
          ele => ele.receiverID === auth().currentUser?.uid,
        );
        // console.log(
        //   'Total Notification is: ',
        //   filteredNotificationsData.length,
        // );
        setNotifications(filteredNotificationsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Notification"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <FlatList
            data={notifications}
            renderItem={({item}) => <ShowNotificationCompo data={item} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScreenComponent>
      <MyIndicator
        visible={loading}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
