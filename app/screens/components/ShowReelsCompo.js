import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import Video from 'react-native-video';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../styles/fontFamily';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LikeComponent from './LikeComponent';
import CommentModal from './CommentModal';
import navigationStrings from '../../navigation/navigationStrings';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const ShowReelsCompo = ({
  item,
  index,
  currentReelIndex,
  setPost,
  getPostData,
  switchToScreen,
}) => {
  const {theme} = useTheme();
  const videoRef = useRef(null);
  const [pauseVideo, setPauseVideo] = useState(false);
  const [reelUserData, setReelUserData] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [commentLength, setCommentLength] = useState(0);
  const navigation = useNavigation();

  const onBuffer = data => {
    console.log('on Buffer react native video: ', data);
  };
  const videoError = err => {
    console.log('Error react native video: ', err);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currentReelIndex]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(item.userUid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          var doc = documentSnapshot.data();
          setReelUserData(doc);
        }
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('comments')
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => ({
          ...doc.data(),
        }));
        setCommentLength(newMessages.length);
      });
    return () => unsubscribe();
  }, []);

  const handleFollower = async () => {
    const userId = item.userUid;
    const userRef = firestore().collection('users').doc(userId);
    const loggedUserId = auth().currentUser.uid;
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('followers')) {
          let updatedFollowers = [...fuserData.followers];
          if (fuserData.followers.includes(loggedUserId)) {
            updatedFollowers = updatedFollowers.filter(
              id => id !== loggedUserId,
            );
          } else {
            updatedFollowers.push(loggedUserId);
          }
          await userRef.update({followers: updatedFollowers});
          // setFollowerCount(updatedFollowers.length);
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };
  const handleFollowing = async () => {
    const userId = item.userUid;
    const loggedUserId = auth().currentUser.uid;
    const userRef = firestore().collection('users').doc(loggedUserId);
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('following')) {
          let updatedFollowers = [...fuserData.following];
          if (fuserData.following.includes(userId)) {
            updatedFollowers = updatedFollowers.filter(id => id !== userId);
          } else {
            updatedFollowers.push(userId);
          }
          await userRef.update({following: updatedFollowers});
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

  const profileNavigationHandler = () => {
    if (item.userUid == auth().currentUser?.uid) {
      switchToScreen(4);
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: item.userUid,
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setPauseVideo(!pauseVideo)}>
          <Video
            source={{
              uri: item.medialUrls[0],
            }}
            ref={videoRef}
            style={{
              width: screenWidth,
              height: screenHeight - 70,
            }}
            onBuffer={onBuffer}
            onError={videoError}
            resizeMode="cover"
            poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
            posterResizeMode="cover"
            repeat
            paused={pauseVideo || currentReelIndex !== index}
            //   paused={true}
          />
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 20,
            height: '34%',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                // borderWidth: 2,
                // borderColor: 'black',
                justifyContent: 'flex-end',
                // backgroundColor: 'rgba(0,0,0,0.2)',
              }}>
              <View style={styles.userDetailContainer}>
                <TouchableOpacity onPress={profileNavigationHandler}>
                  <FastImage
                    style={styles.userProfileImage}
                    source={{
                      uri:
                        reelUserData !== null && reelUserData.imageUrl !== ''
                          ? reelUserData.imageUrl
                          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtTgADTlo3rtSsrCFEIn0Onpx22hbJus4orcFhRIW42G5kl-5628x_kY_4jKUNbOWZQ1E&usqp=CAU',
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.userName}>
                  {reelUserData !== null && reelUserData.fullName}
                </Text>
                {item.userUid !== auth().currentUser?.uid && (
                  <TouchableOpacity
                    style={styles.followContainer}
                    onPress={handleFollow}>
                    <Text style={styles.followText}>
                      {reelUserData !== null &&
                      reelUserData.followers.includes(auth().currentUser?.uid)
                        ? 'Following'
                        : 'follow'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text style={styles.desText} numberOfLines={1}>
                  {item.caption} Tag to your friend this video is amazing. This
                  video from facebook.
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <View style={{alignItems: 'center'}}>
                <LikeComponent
                  postId={item.id}
                  postLikes={item.likes}
                  getPostData={getPostData}
                  iconStyle={{width: 28, height: 28}}
                  iconContianerStyle={{
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                  }}
                />
                <Text style={styles.iconText}>{item.likes.length}</Text>
              </View>
              <TouchableOpacity
                style={{alignItems: 'center', marginVertical: 30}}
                onPress={() => setShowComment(!showComment)}>
                <Image
                  source={require('../../assets/comment.png')}
                  style={styles.reelIcons}
                />
                <Text style={styles.iconText}>{commentLength}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <Image
                  source={require('../../assets/share.png')}
                  style={styles.reelIcons}
                />
                <Text style={styles.iconText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{marginTop: 30}}>
                <Image
                  source={require('../../assets/vertical_dots.png')}
                  style={styles.reelIcons}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {showComment && (
        <CommentModal
          showComment={showComment}
          setShowComment={setShowComment}
          postId={item.id}
          // switchToScreen={switchToScreen}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: screenHeight - 70,
  },
  reelIcons: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  iconText: {
    fontSize: 14,
    color: colors.white,
  },
  userProfileImage: {width: 44, height: 44, borderRadius: 44 / 2},
  userName: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    marginHorizontal: 12,
  },
  userDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
  },
  followText: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  desText: {
    width: '94%',
    fontSize: 12,
    color: colors.white,
    marginTop: 20,
  },
});

export default ShowReelsCompo;
