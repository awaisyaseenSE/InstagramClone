import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const TopGroupChatCompo = ({groupData, onPress}) => {
  const {theme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [groupMemberImage, setGroupMemberImage] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(groupData?.members[groupData.members?.length - 1])
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setGroupMemberImage(data.imageUrl);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, [groupData]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIconContainer} onPress={onPress}>
        <Image
          source={require('../../../../assets/back.png')}
          style={[styles.backIcon, {tintColor: theme.text}]}
        />
      </TouchableOpacity>
      <View style={styles.mainContainer}>
        <View style={{width: 40, height: 40}}>
          <FastImage
            source={{
              uri:
                groupMemberImage !== ''
                  ? groupMemberImage
                  : 'https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg',
            }}
            // source={{uri: auth().currentUser?.photoURL}}
            style={styles.profileImage}
          />
          <FastImage
            source={{uri: auth().currentUser?.photoURL}}
            style={[styles.secondprofileImage]}
          />
        </View>
        <Text style={[styles.groupNameStyle, {color: theme.text}]}>
          {groupData?.groupName}
        </Text>
      </View>
      <TouchableOpacity style={styles.rightIconContainer}>
        <Image
          source={require('../../../../assets/call.png')}
          style={[styles.rightIcon, {tintColor: theme.text}]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.rightIconContainer}>
        <Image
          source={require('../../../../assets/video_call.png')}
          style={[
            styles.rightIcon,
            {tintColor: theme.text, width: 26, height: 26, marginLeft: 6},
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    flex: 1,
    paddingHorizontal: 10,
  },
  backIconContainer: {
    // backgroundColor: 'pink',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  groupNameStyle: {
    fontSize: 16,
    marginLeft: 16,
  },
  rightIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rightIconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  secondprofileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
    position: 'absolute',
    left: 8,
    top: 8,
    zIndex: 1,
    // borderWidth: 1,
  },
});

export default TopGroupChatCompo;
