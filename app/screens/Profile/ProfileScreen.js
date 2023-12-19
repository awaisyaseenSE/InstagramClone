import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import ProfileStyle from '../style/ProfileStyle';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';

export default function ProfileScreen() {
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userAllData, setUserAllData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setUserAllData(data);
          setUserImageUrl(data.imageUrl);
          setUserName(data.fullName);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  const {logout} = useAuth();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.drawerIconContainer}>
            <View style={styles.drawerIcon} />
          </TouchableOpacity>
          <Text style={styles.userName}>{userName}</Text>
          <TouchableOpacity
            style={styles.drawerIconContainer}
            onPress={() => navigation.openDrawer()}>
            <Image
              source={require('../../assets/drawer_Icon.png')}
              style={styles.drawerIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.userDetailContainer}>
          <View style={styles.profileImageContainer}>
            <FastImage
              source={{
                uri:
                  userImageUrl !== ''
                    ? userImageUrl
                    : 'https://is3-ssl.mzstatic.com/image/thumb/Purple127/v4/f5/ca/fd/f5cafd96-f3a4-8ec1-37b0-2e82f8bdea77/source/512x512bb.jpg',
              }}
              style={styles.profileImageStyle}
            />
          </View>
          <View style={styles.followerContainer}>
            <TouchableOpacity style={styles.followingTextContainer}>
              <Text style={styles.followingContentText}>54</Text>
              <Text style={styles.followingContentText1}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followingTextContainer}>
              <Text style={styles.followingContentText}>22</Text>
              <Text style={styles.followingContentText1}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followingTextContainer}>
              <Text style={styles.followingContentText}>12</Text>
              <Text style={styles.followingContentText1}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>
            Digital goodies designer Everthing is designed.
          </Text>
        </View>
        <View style={{paddingHorizontal: 24}}>
          <TouchableOpacity style={styles.editProfileBtnContainer}>
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MyIndicator visible={laoding} />
    </>
  );
}
