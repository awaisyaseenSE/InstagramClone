import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../components/MyIndicator';
import ProfileStyle from './style/ProfileStyle';
import navigationStrings from '../navigation/navigationStrings';
import ProfileGridCompo from './Profile/ProfileGridCompo';
import ProfileReelCompo from './Profile/ProfileReelCompo';
import ProfileUserTagsCompo from './Profile/ProfileUserTagsCompo';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';
import auth from '@react-native-firebase/auth';

export default function UserProfileScreen({route}) {
  const userId = route.params?.userUid;
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userAllData, setUserAllData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [userPostsLength, setUserPostsLength] = useState(0);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
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

  const handleFollower = async () => {
    const userRef = firestore().collection('users').doc(userId);
    const loggedUserId = auth().currentUser.uid;
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('followers')) {
          let updatedFollowers = [...fuserData.followers]; // Create a new array
          if (fuserData.followers.includes(loggedUserId)) {
            updatedFollowers = updatedFollowers.filter(
              id => id !== loggedUserId,
            ); // Remove like
          } else {
            updatedFollowers.push(loggedUserId); // Add like
          }
          await userRef.update({followers: updatedFollowers}); // Update the likes
          // setFollowerCount(updatedFollowers.length);
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };
  const handleFollowing = async () => {
    // userId
    const loggedUserId = auth().currentUser.uid;
    const userRef = firestore().collection('users').doc(loggedUserId);
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('following')) {
          let updatedFollowers = [...fuserData.following]; // Create a new array
          if (fuserData.following.includes(userId)) {
            updatedFollowers = updatedFollowers.filter(id => id !== userId); // Remove like
          } else {
            updatedFollowers.push(userId); // Add like
          }
          await userRef.update({following: updatedFollowers}); // Update the likes
          // setFollowerCount(updatedFollowers.length);
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };

  const handleFollow = async () => {
    await handleFollower();
    await handleFollowing();
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.profileBg}}>
        <TopCompoWithHeading
          title={userName}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
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
              <TouchableOpacity
                style={styles.followingTextContainer}
                onPress={() =>
                  navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
                    userUid: userId,
                  })
                }>
                <Text style={styles.followingContentText}>
                  {userPostsLength}
                </Text>
                <Text style={styles.followingContentText1}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.followingTextContainer}
                onPress={() => {
                  userAllData !== null && userAllData.followers.length > 0
                    ? navigation.navigate(
                        navigationStrings.FOLLOWER_FOLLOWING_SCREEN,
                        {
                          followingList: userAllData.following,
                          followerList: userAllData.followers,
                          userName: userName,
                          selectedIndex: 'followers',
                          totalFollowers: userAllData.followers.length,
                          totalFollowing: userAllData.following.length,
                        },
                      )
                    : null;
                }}>
                <Text style={styles.followingContentText}>
                  {userAllData !== null ? userAllData.followers.length : '22'}
                </Text>
                <Text style={styles.followingContentText1}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.followingTextContainer}
                onPress={() => {
                  userAllData !== null && userAllData.following.length > 0
                    ? navigation.navigate(
                        navigationStrings.FOLLOWER_FOLLOWING_SCREEN,
                        {
                          followingList: userAllData.following,
                          followerList: userAllData.followers,
                          userName: userName,
                          selectedIndex: 'following',
                          totalFollowers: userAllData.followers.length,
                          totalFollowing: userAllData.following.length,
                        },
                      )
                    : null;
                }}>
                <Text style={styles.followingContentText}>
                  {userAllData !== null ? userAllData.following.length : '22'}
                </Text>
                <Text style={styles.followingContentText1}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {userAllData !== null ? userAllData.bio : ''}
            </Text>
          </View>
          <View style={styles.userProfileFollowBtnContainer}>
            <TouchableOpacity
              style={[
                styles.userProfileFollowBtn,
                {
                  backgroundColor:
                    userAllData !== null &&
                    userAllData.followers.includes(auth().currentUser?.uid)
                      ? theme.userProfileGray
                      : theme.userProfileBlue,
                },
              ]}
              onPress={handleFollow}
              activeOpacity={0.6}>
              <Text
                style={[
                  styles.userProfileFollowText,
                  {
                    color:
                      userAllData !== null &&
                      userAllData.followers.includes(auth().currentUser?.uid)
                        ? theme.text
                        : 'white',
                  },
                ]}>
                {userAllData !== null &&
                userAllData.followers.includes(auth().currentUser?.uid)
                  ? 'Following'
                  : 'follow'}
              </Text>
            </TouchableOpacity>
            <View style={{marginHorizontal: 4}} />
            <TouchableOpacity
              style={[
                styles.userProfileFollowBtn,
                {backgroundColor: theme.userProfileGray},
              ]}>
              <Text style={styles.userProfileFollowText}>Message</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileTabContainer}>
            <TouchableOpacity
              style={[
                styles.profileTabsIconContainer,
                {
                  borderColor:
                    selectedTab === 0 ? theme.text : theme.profileImgBorder,
                },
              ]}
              onPress={() => setSelectedTab(0)}>
              <Image
                source={require('../assets/grid.png')}
                style={[
                  styles.profileTabsIconStyle,
                  {
                    tintColor:
                      selectedTab === 0 ? theme.text : theme.profileGray,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileTabsIconContainer,
                {
                  borderColor:
                    selectedTab === 1 ? theme.text : theme.profileImgBorder,
                },
              ]}
              onPress={() => setSelectedTab(1)}>
              <Image
                source={require('../assets/reel.png')}
                style={[
                  styles.profileTabsIconStyle,
                  {
                    tintColor:
                      selectedTab === 1 ? theme.text : theme.profileGray,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileTabsIconContainer,
                {
                  borderColor:
                    selectedTab === 2 ? theme.text : theme.profileImgBorder,
                },
              ]}
              onPress={() => setSelectedTab(2)}>
              <Image
                source={require('../assets/user_two.png')}
                style={[
                  styles.profileTabsIconStyle,
                  {
                    tintColor:
                      selectedTab === 2 ? theme.text : theme.profileGray,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
          {selectedTab === 0 && (
            <ProfileGridCompo
              setUserPostsLength={setUserPostsLength}
              userUid={userId}
            />
          )}
          {selectedTab === 1 && <ProfileReelCompo />}
          {selectedTab === 2 && <ProfileUserTagsCompo />}
        </View>
      </ScreenComponent>
      <MyIndicator visible={laoding} />
    </>
  );
}
