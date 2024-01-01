import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import ScreenComponent from '../../components/ScreenComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import colors from '../../styles/colors';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
// import askPermissionsEasy from '../../utils/askPermissionsEasy';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import ShowMessagesComponent from './components/ShowMessagesComponent';
import FastImage from 'react-native-fast-image';
import AttachmentComponent from './components/AttachmentComponent';
import MyIndicator from '../../components/MyIndicator';
import SoundRecorder from 'react-native-sound-recorder';
import RecordingComponent from './components/RecordingComponent';
import SoundPlayer from 'react-native-sound-player';
import BackgroundTimer from 'react-native-background-timer';
import TopChatComponent from './components/TopChatComponent';
import ShowDateMessagesCompo from './components/ShowDateMessagesCompo';
import {useTheme} from '../../themes/ThemeContext';

export default function ChatScreen({route}) {
  const currentUserUid = auth().currentUser.uid;
  const [messages, setMessages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sendShow, setSendShow] = useState(false);
  const [selectAttachment, setSelectAttachment] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [loading, setLoading] = useState(true);
  const [idForReceiver, setIDForReceiver] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmSend, setConfirmSend] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [recordingModal, setRecordingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyId, setReplyId] = useState('');
  const [replyMessageType, setReplyMessageType] = useState('');
  const [finalMessages, setFinalMessages] = useState([]);
  const [replyUserUid, setReplyUserUid] = useState('');
  const {theme} = useTheme();
  const [isImageLoading, setIsImageLoading] = useState(false);
  // cosnt [showDocumentModal,setShowDocumentModal] = useState(false);

  const routeData = route.params;
  // const askingPermission = askPermissionsEasy();
  const flatListScroll = useRef();
  var isMounted = false;

  const screenHeight = Dimensions.get('window').height;

  const RPH = percentage => {
    return (percentage / 100) * screenHeight;
  };

  const swipeToReply = itemReply => {
    // console.log('...... >>> .... ', itemReply);
    let replyMessage = '';
    if (itemReply.type === 'text') {
      setReplyMessageType('text');
      replyMessage =
        itemReply.message.length > 20
          ? itemReply.message.slice(0, 20) + '...'
          : itemReply.message;
    } else if (itemReply.type === 'audio') {
      setReplyMessageType('audio');
      replyMessage = 'Reply to Vocie!';
    } else if (itemReply.type === 'image') {
      setReplyMessageType('image');
      replyMessage = 'Reply to Image!';
    } else {
      setReplyMessageType('file');
      replyMessage = 'Reply to file';
    }
    // console.log('replyMessage: ', replyMessage);
    setReplyId(itemReply._id);
    setReplyText(replyMessage);
    setReplyUserUid(itemReply.senderID);
  };

  const closeReply = () => {
    setReplyId('');
    setReplyText('');
    setReplyMessageType('');
  };

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      if (grants === PermissionsAndroid.RESULTS.GRANTED) {
        SoundRecorder.start(
          SoundRecorder.PATH_CACHE + '/' + Date.now() + '.mp4',
        )
          .then(function () {})
          .catch(function (error) {
            console.log('error', error);
          });
      }
    } else {
      SoundRecorder.start(SoundRecorder.PATH_CACHE + '/' + Date.now() + '.mp4')
        .then(function () {})
        .catch(function (error) {
          console.log('error', error);
        });
    }
  };

  const onStopRecord = async () => {
    SoundRecorder.stop()
      .then(function (result) {
        var path = result.path;
        let voiceDuration = result.duration;

        // confirmAndSendMesssage(path, '', true);
        confirmAndSendMesssage(path, voiceDuration, true);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  const startPlaying = item => {
    var temp = messages;
    temp.forEach(each => {
      if (item.message === each.message) {
        each.isPlaying = true;
      } else {
        each.isPlaying = false;
      }
    });

    setMessages([...temp]);
  };

  const stopPlaying = item => {
    var temp = messages;
    temp.forEach(each => {
      if (item.message === each.message) {
        each.isPlaying = false;
      }
    });
    setMessages([...temp]);
    SoundPlayer.stop();
    BackgroundTimer.stopBackgroundTimer();
  };

  useEffect(() => {
    const unsubscribe = firestore()
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

        setMessages(newMessages);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    // isMounted = true;
    getData();
  }, []);
  const getData = () => {
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
          setFullName(doc.fullName);
        }
      });
  };

  const pickImage = async () => {
    setLoading(true);
    // const value = await askingPermission.requestPermissionn();
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
          setSelectAttachment(false);
          setSelectedImage(imageUri);

          setTimeout(() => {
            setShowImageModal(true);
            setLoading(false);
          }, 1000);
        }
      });
    }
  };
  const cencelImage = () => {
    setIsModalVisible(!isModalVisible);
    setSelectedImage('');
    setShowImageModal(false);
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      // console.log('handle document selection is called');
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      // console.log('document uri is: ', response.uri);
      setSelectedImage('');
      setSelectAttachment(false);
      confirmAndSendMesssage(response.uri, response.name);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const confirmAndSendMesssage = (filePath, extraText, ifAudio) => {
    setConfirmSend(false);
    setLoading(true);
    // if (ifAudio === true) {
    //   filePath = recordedFilePath;
    // }

    const childPath = 'chatImages/' + Date.now() + '.png';
    storage()
      .ref(childPath)
      .putFile(selectedImage === '' ? filePath : selectedImage)
      .then(snapshot => {
        storage()
          .ref(childPath)
          .getDownloadURL()
          .then(url => {
            if (ifAudio !== true) {
              setSelectedImage(url);
            } else {
              // console.log('uploaded file url is     ', url);
            }
            if (selectedImage !== '') {
              setIsImageLoading(true);
              sendMessage(url, 'image', captionText, false);
            } else {
              sendMessage(url, 'file', extraText, ifAudio);
            }
          });
      })
      .catch(e => {
        console.log('uploading image error => ', e);
        setLoading(false);
        setIsImageLoading(false);
      });
  };

  const sendMessage = (txt, type, extraText, ifAudio) => {
    setLoading(true);
    if (type !== 'text') {
    }

    setNewMessage('');
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
        setIsImageLoading(false);
        setNewMessage('');
        setSendShow(false);
        setIsModalVisible(false);
        setSelectedImage('');
        setShowImageModal(false);
        setCaptionText('');
        closeReply();
        // setNotification();
      })
      .catch(err => {
        setLoading(false);
        setIsImageLoading(false);
        console.log('Error in uploading messages: ', err);
      });
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
    return formattedList;
  };
  useEffect(() => {
    if (messages.length > 0) {
      const formattedMessages = formatMessages(messages);
      setFinalMessages(formattedMessages);
    }
  }, [messages]);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        {selectAttachmentFunction()}
        {pickImageFunction()}
        {recordingModalFunction()}
        <TopChatComponent label={fullName} />
        <View
          style={[
            styles.flatListViewStyle,
            {backgroundColor: theme.background},
          ]}>
          <FlatList
            inverted={true}
            data={[...finalMessages].reverse()}
            // ref={flatListScroll}
            // contentContainerStyle={{justifyContent: 'flex-end'}}
            showsVerticalScrollIndicator={false}
            // onContentSizeChange={() =>
            //   flatListScroll.current.scrollToEnd({animated: true})
            // }
            // onLayout={() =>
            //   flatListScroll.current.scrollToEnd({animated: true})
            // }
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
                    swipeToReply={swipeToReply}
                    closeReply={closeReply}
                    fullName={fullName}
                  />
                );
              } else {
                return <ShowDateMessagesCompo date={item.date} />;
              }
            }}
            ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
            onStartReached={() => console.log('finally end is reach')}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={40}>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.borderColor,
            }}>
            {replyText.length > 0 ? (
              <View style={styles.replyContainer}>
                <View style={styles.replyTopContainer}>
                  <Text style={styles.replyTextHeading}>
                    {replyUserUid === currentUserUid ? 'You' : fullName}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeReplyIconContainer}
                    onPress={closeReply}>
                    <Image
                      source={require('../../assets/close.png')}
                      style={styles.closeReplyIcon}
                    />
                  </TouchableOpacity>
                </View>
                {replyMessageType === 'text' ? (
                  <Text style={styles.replyTextStyle}>{replyText}</Text>
                ) : null}
                {replyMessageType === 'image' ? (
                  <View style={styles.replyImageContainer}>
                    <Image
                      source={require('../../assets/ic_image.png')}
                      style={styles.replyImageIcon}
                    />
                    <Text style={[styles.replyTextStyle, {marginLeft: 6}]}>
                      Photo
                    </Text>
                  </View>
                ) : null}
                {replyMessageType === 'audio' ? (
                  <View style={styles.replyImageContainer}>
                    <Image
                      source={require('../../assets/mic.png')}
                      style={styles.replyImageIcon}
                    />
                    <Text style={[styles.replyTextStyle, {marginLeft: 6}]}>
                      Voice
                    </Text>
                  </View>
                ) : null}
                {replyMessageType === 'file' ? (
                  <View style={styles.replyImageContainer}>
                    <Image
                      source={require('../../assets/ic_document.png')}
                      style={styles.replyImageIcon}
                    />
                    <Text style={[styles.replyTextStyle, {marginLeft: 6}]}>
                      Document
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <View style={[styles.addMessageContainer, {height: RPH(8)}]}>
              <TouchableOpacity
                style={styles.plusIconContainer}
                //   onPress={() => handleModal()}
                onPress={() => setSelectAttachment(true)}>
                <Image
                  source={require('../../assets/ic_plus.png')}
                  style={styles.plusIcon}
                />
              </TouchableOpacity>
              <TextInput
                placeholder="Enter Message"
                style={styles.input}
                value={newMessage}
                onChangeText={text => {
                  setNewMessage(text);
                  if (text.trim().length) {
                    setSendShow(true);
                  } else {
                    setSendShow(false);
                  }
                }}
                multiline
              />
              {sendShow ? (
                <TouchableOpacity
                  style={styles.plusIconContainer}
                  onPress={() => {
                    if (newMessage !== '') {
                      if (!newMessage.trim().length) {
                        // console.log('str is empty!');
                        setNewMessage('');
                        return;
                      }
                      sendMessage(newMessage.trim(), 'text');
                    } else {
                      setRecordingModal(true);
                    }
                  }}>
                  <Image
                    source={require('../../assets/ic_send.png')}
                    style={[styles.plusIcon, {tintColor: colors.blue}]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.plusIconContainer}
                  onPress={() => {
                    setRecordingModal(true);
                  }}>
                  <Image
                    source={require('../../assets/mic.png')}
                    style={[styles.plusIcon, {tintColor: colors.gray}]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenComponent>
      <MyIndicator visible={loading} />
    </>
  );

  function selectAttachmentFunction() {
    return (
      <Modal
        visible={selectAttachment}
        animationType="slide"
        transparent={true}
        style={{flex: 1}}>
        <AttachmentComponent
          onPressCancel={() => setSelectAttachment(false)}
          onPressPickImage={() => {
            pickImage();
            // setSelectAttachment(false);
          }}
          onPressPickDocument={() => {
            handleDocumentSelection();
            // setSelectAttachment(false);
          }}
          onPressPickAudio={() => {
            // handleAudioSelection();
            // setSelectAttachment(false);
          }}
        />
      </Modal>
    );
  }

  function pickImageFunction() {
    return (
      <Modal
        visible={showImageModal}
        animationType="slide"
        style={{flex: 1}}
        transparent={true}>
        {/* <ScreenComponent> */}
        <View style={{flex: 1, backgroundColor: 'rgba(60, 60, 60,0.5)'}}>
          <View style={{padding: 20, alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={cencelImage}>
              <Image
                source={require('../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: colors.white,
                paddingBottom: 42,
                paddingTop: 20,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}>
              <View style={{alignItems: 'center'}}>
                <FastImage
                  source={{uri: selectedImage}}
                  style={{width: '90%', height: 220, borderRadius: 6}}
                />
              </View>
              <View
                style={[
                  styles.addMessageContainer,
                  {marginTop: 12, paddingHorizontal: 20},
                ]}>
                <TextInput
                  style={styles.inputImageModal}
                  placeholder="Enter Caption here"
                  value={captionText}
                  onChangeText={text => setCaptionText(text)}
                />
                <TouchableOpacity
                  style={styles.plusIconContainer}
                  onPress={() => confirmAndSendMesssage()}>
                  <Image
                    source={require('../../assets/ic_send.png')}
                    style={[styles.plusIcon, {tintColor: colors.blue}]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {/* </ScreenComponent> */}
        {/* <MyIndicator visible={imageIsLoading} /> */}
        <MyIndicator visible={loading} />
      </Modal>
    );
  }

  function recordingModalFunction() {
    return (
      <Modal
        visible={recordingModal}
        animationType="slide"
        transparent={true}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <RecordingComponent
          onPressCancel={() => {
            SoundRecorder.stop()
              .then(function (result) {
                console.log('result', result);
              })
              .catch(function (error) {
                console.log('error', error);
              });
            setIsRecording(false);
            setRecordingModal(false);
          }}
          isRecording={isRecording}
          onPressRecord={() => {
            setIsRecording(true);
            onStartRecord();
          }}
          onPressSend={() => {
            onStopRecord();
            setIsRecording(false);
            setRecordingModal(false);
          }}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  flatListViewStyle: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'flex-end',
  },
  plusIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  addMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: 60,
    paddingRight: 5,
    // position: 'absolute',
    // bottom: 8,
    // paddingHorizontal: 12,
    // marginTop: 12,
  },
  plusIconContainer: {
    marginLeft: 10,
    paddingHorizontal: 10,
    // paddingVertical: 12,
    width: 30,
    alignItems: 'flex-end',
    height: 30,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    fontSize: 14,
    color: colors.black,
    fontFamily: 'UberMove-Medium',
  },
  chatTextStyle: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'UberMove-Medium',
  },
  chatTimeText: {
    fontSize: 10,
    color: colors.black,
    fontFamily: 'UberMove-Regular',
  },
  iconStyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.LightWhite,
    // backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: 15,
    marginTop: 40,
  },
  documentSelectContainer: {
    height: 140,
    backgroundColor: colors.whiteOpacity70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 12,
  },
  selectMedaiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  closeReplyIcon: {
    width: 8,
    height: 8,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  closeReplyIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  replyImageIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  replyTextStyle: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: 'UberMove-Medium',
  },
  replyImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyTextHeading: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: 'UberMove-Medium',
  },
  inputImageModal: {
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    fontSize: 14,
    color: colors.black,
    fontFamily: 'UberMove-Medium',
    // marginLeft: 20,
  },
  replyContainer: {
    paddingLeft: 20,
    backgroundColor: colors.offWhite,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    marginRight: 60,
  },
});
