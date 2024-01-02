import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatStyle from '../style/ChatStyle';
import ScreenComponent from '../../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MyIndicator from '../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import fontFamily from '../../styles/fontFamily';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';
import TopChatComponent from './components/TopChatComponent';
import AddNewMessageCompo from './components/AddNewMessageCompo';
import ShowMessagesComponent from './components/ShowMessagesComponent';
import ShowDateMessagesCompo from './components/ShowDateMessagesCompo';
import askPermissionsEasy from '../../utils/askPermissionsEasy';
import {launchImageLibrary} from 'react-native-image-picker';

export default function ChatScreen({route}) {
  const routeData = route?.params;
  const {theme} = useTheme();
  const styles = ChatStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [allPostsData, setAllPostsData] = useState();
  const [messages, setMessages] = useState([]);
  const currentUserUid = auth().currentUser.uid;
  const [idForReceiver, setIDForReceiver] = useState('');
  const [receiverData, setReceiverData] = useState(null);
  const [newTextMessage, setNewTextMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [replyId, setReplyId] = useState('');
  const [sendShow, setSendShow] = useState(false);
  const askingPermission = askPermissionsEasy();
  var isMounted = false;

  useEffect(() => {
    isMounted = true;
    getChatMessage();
    getUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getChatMessage = () => {
    try {
      setLoading(true);
      firestore()
        .collection('chats')
        .doc(routeData.chatID)
        .collection('messages')
        .orderBy('time', 'asc')
        .onSnapshot(snapshot => {
          const newMessages = snapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id,
            isPlaying: false,
            time: doc.data().time.toDate(),
          }));
          // setMessages(newMessages);
          formatMessages(newMessages);
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

  const getUserData = () => {
    try {
      setLoading(true);
      var separate = routeData.chatID.split('&');
      var id1 = separate[0];
      var id2 = separate[1];
      var receiverID = '';
      if (id1 !== auth().currentUser.uid) {
        receiverID = id1;
      } else {
        receiverID = id2;
      }
      setIDForReceiver(receiverID);
      firestore()
        .collection('users')
        .doc(receiverID)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            var doc = documentSnapshot.data();
            setReceiverData({...doc, id: documentSnapshot.id});
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching receiver data for chat message's in chat screen: ",
        error,
      );
    }
  };

  // Function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatMessages = messages => {
    const formattedList = [];
    let currentDate = null;
    messages.forEach(message => {
      const messageDate = message.time;
      if (!currentDate || !isSameDay(currentDate, messageDate)) {
        formattedList.push({
          id: `separator_${message._id}`,
          isSeparator: true,
          date: messageDate,
        });
        currentDate = messageDate;
      }
      formattedList.push(message);
    });
    // return formattedList;
    setMessages(formattedList);
  };

  const sendMessage = (txt, type, extraText, ifAudio) => {
    setLoading(true);
    if (type !== 'text') {
    }

    setNewTextMessage('');
    if (extraText === undefined) {
      extraText = '';
    }
    if (ifAudio === true) {
      type = 'audio';
    }

    var lastSendMessage = '';
    var idForMessagesCollection = firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .collection('messages')
      .doc().id;

    lastSendMessage = txt;

    var allIDs = routeData.chatID.split('&');
    var senderID = '';
    var receiverID = '';
    if (allIDs[0] === auth().currentUser.uid) {
      senderID = allIDs[0];
      receiverID = allIDs[1];
    } else {
      senderID = allIDs[1];
      receiverID = allIDs[0];
    }

    firestore().collection('chats').doc(routeData.chatID).set(
      {
        lastMessage: lastSendMessage,
        messageTime: new Date(),
        type: type,
      },
      {merge: true},
    );

    var chatData;

    if (replyId !== '') {
      chatData = {
        message: lastSendMessage,
        time: new Date(),
        senderID: senderID,
        receiverID: receiverID,
        chatID: routeData.chatID,
        isRead: false,
        type: type,
        extraText: extraText,
        replyId: replyId,
      };
    } else {
      chatData = {
        message: lastSendMessage,
        time: new Date(),
        senderID: senderID,
        receiverID: receiverID,
        chatID: routeData.chatID,
        isRead: false,
        type: type,
        extraText: extraText,
      };
    }

    firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .collection('messages')
      .doc(idForMessagesCollection)
      .set(chatData, {merge: true})
      .then(() => {
        setLoading(false);
        setNewTextMessage('');
        setSendShow(false);
        // setIsModalVisible(false);
        // setSelectedImage('');
        // setShowImageModal(false);
        // setCaptionText('');
        // closeReply();
        // setNotification();
      })
      .catch(err => {
        setLoading(false);
        console.log('Error in uploading messages: ', err);
      });
  };

  const pickImage = async () => {
    setLoading(true);
    const value1 = await askingPermission.requestPermissionn();
    const value = true;
    if (value) {
      const options = {
        title: 'Select Photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        mediaType: 'mixed',
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          setLoading(false);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          setLoading(false);
        } else {
          const source = {uri: response.uri};
          let imageUri = response.uri || response.assets?.[0]?.uri;
          // console.log(response.assets[0].uri);
          // setSelectAttachment(false);
          // setSelectedImage(imageUri);

          // setTimeout(() => {
          //   setShowImageModal(true);
          //   setLoading(false);
          // }, 1000);
          console.log(imageUri);
          setLoading(false);
        }
      });
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopChatComponent userData={receiverData} />
        <View style={myStyles.container}>
          <FlatList
            inverted={true}
            data={[...messages].reverse()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              if (!item.isSeparator) {
                return (
                  <ShowMessagesComponent
                    item={item}
                    startPlaying={() => {
                      startPlaying(item);
                    }}
                    stopPlaying={() => stopPlaying(item)}
                    // swipeToReply={swipeToReply}
                    // closeReply={closeReply}
                    // fullName={fullName}
                  />
                );
              } else {
                return <ShowDateMessagesCompo date={item.date} />;
              }
            }}
            ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
            // onStartReached={() => console.log('finally end is reach')}
          />
        </View>
        <AddNewMessageCompo
          setNewTextMessage={setNewTextMessage}
          newTextMessage={newTextMessage}
          sendShow={sendShow}
          setSendShow={setSendShow}
          sendMessage={sendMessage}
          pickImage={pickImage}
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

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'hotpink',
  },
});
