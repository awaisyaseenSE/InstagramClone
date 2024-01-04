import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatStyle from '../../style/ChatStyle';
import ScreenComponent from '../../../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MyIndicator from '../../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import TopChatComponent from '../components/TopChatComponent';
import AddNewMessageCompo from '../components/AddNewMessageCompo';
import ShowMessagesComponent from '../components/ShowMessagesComponent';
import ShowDateMessagesCompo from '../components/ShowDateMessagesCompo';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import colors from '../../../styles/colors';
import Video from 'react-native-video';
import SoundRecorder from 'react-native-sound-recorder';
import SoundPlayer from 'react-native-sound-player';
import BackgroundTimer from 'react-native-background-timer';
import RecordingComponent from '../components/RecordingComponent';
import {useTheme} from '../../../themes/ThemeContext';
import TopGroupChatCompo from './components/TopGroupChatCompo';

export default function GroupChatScreen({route}) {
  const groupId = route?.params?.groupId;
  const {theme} = useTheme();
  const gobalStyles = ChatStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [groupData, setGroupData] = useState(null);

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    getGroupChatMessage();
    getGroupMetaData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getGroupChatMessage = () => {
    try {
      setLoading(true);
      firestore()
        .collection('chats')
        .doc(groupId)
        .collection('messages')
        .orderBy('time', 'asc')
        .onSnapshot(snapshot => {
          const newMessages = snapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id,
            isPlaying: false,
            time: doc.data().time.toDate(),
          }));
          setMessages(newMessages);
          console.log(newMessages.length);
          //   formatMessages(newMessages);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching chat message's from firestore in chat screen: ",
        error,
      );
    }
  };

  const getGroupMetaData = () => {
    try {
      setLoading(true);
      firestore()
        .collection('chats')
        .doc(groupId)
        .get()
        .then(res => {
          setGroupData({...res.data(), groupId: res.id});
          setLoading(false);
        })
        .catch(er => {
          setLoading(false);
          console.log(
            'error in getting members data of group chat screen: ',
            er,
          );
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching members data for group chat message's in Group chat screen: ",
        error,
      );
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopGroupChatCompo
          groupData={groupData}
          onPress={() => navigation.goBack()}
        />
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({});
