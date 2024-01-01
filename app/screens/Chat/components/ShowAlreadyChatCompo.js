import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../styles/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {useTheme} from '../../../themes/ThemeContext';

const ShowAlreadyChatCompo = ({data, onPress}) => {
  const [imageURL, setImageURL] = useState('');
  const [fullName, setFullName] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState('');
  const {theme} = useTheme();

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    if (data.messageTime !== undefined) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (today.toDateString() === data.messageTime.toDate().toDateString()) {
        setLastMessageTime('Today');
      } else if (
        yesterday.toDateString() === data.messageTime.toDate().toDateString()
      ) {
        setLastMessageTime('Yesterday');
      } else {
        setLastMessageTime(moment(data.messageTime.toDate()).format('l'));
      }
    }

    getData();
    return () => {
      isMounted = false;
    };
  }, [data]);

  const getData = () => {
    var separate = data.chatID.split('&');
    var id1 = separate[0];
    var id2 = separate[1];
    var receiverID = '';
    if (id1 !== auth().currentUser.uid) {
      receiverID = id1;
    } else {
      receiverID = id2;
    }

    firestore()
      .collection('users')
      .doc(receiverID)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          var doc = documentSnapshot.data();
          if (isMounted) {
            setImageURL(doc.imageUrl);
            setFullName(doc.fullName);
          }
        }
      });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <FastImage
          source={
            imageURL === ''
              ? require('../../../assets/avatar.png')
              : {uri: imageURL}
          }
          style={{height: 60, width: 60, borderRadius: 30}}
        />
        <View
          style={{
            alignSelf: 'center',
            marginStart: 10,
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.nameTextStyle, {color: theme.text}]}>
              {fullName}
            </Text>
            <Text style={[styles.lastMessageTimeStyle, {color: theme.gray}]}>
              {lastMessageTime}
            </Text>
          </View>

          {data.type === 'text' ||
          data.type === '' ||
          data.type === undefined ? (
            data.lastMessage !== '' ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[styles.lastmessageTextStyle, {color: theme.gray}]}
                  numberOfLines={1}>
                  {data.lastMessage}
                </Text>
                <View style={styles.unreadMessageContainer}>
                  <Text style={styles.unReadMessageText}>4</Text>
                </View>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, color: colors.black, flex: 1}}>
                  Tap to start a conversation
                </Text>
                <Text
                  style={{
                    color: colors.black,
                  }}>
                  {lastMessageTime}
                </Text>
              </View>
            )
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.lastmessageTextStyle, {color: theme.gray}]}>
                {data.type}
              </Text>
              <View style={styles.unreadMessageContainer}>
                <Text style={styles.unReadMessageText}>2</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  unreadMessageContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
  },
  unReadMessageText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: 'UberMove-Bold',
  },
  lastMessageTimeStyle: {
    color: colors.gray,
    fontSize: 10,
    fontFamily: 'UberMove-Medium',
  },
  nameTextStyle: {
    fontSize: 15,
    fontFamily: 'UberMove-Bold',
    color: colors.black,
  },
  lastmessageTextStyle: {
    fontSize: 13,
    color: colors.gray,
    textTransform: 'capitalize',
    flex: 1,
    alignSelf: 'flex-end',
  },
});

export default ShowAlreadyChatCompo;
