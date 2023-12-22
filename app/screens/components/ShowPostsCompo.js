import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ShowPostStyle from '../style/ShowPostStyle';
import colors from '../../styles/colors';
import LikeComponent from './LikeComponent';
import CommentCompo from './CommentModal';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import ShowPostOptionModal from './ShowPostOptionModal';
import MyIndicator from '../../components/MyIndicator';

const ShowPostsCompo = ({item, allUrls, switchToScreen}) => {
  const {theme} = useTheme();
  const styles = ShowPostStyle(theme);
  const navigation = useNavigation();
  const [postUserData, setPostUserData] = useState(null);
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(1);
  const [showComment, setShowComment] = useState(false);
  const [commentLength, setCommentLength] = useState(0);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [currentUserAlldata, setCurrentUserAllData] = useState(null);
  const [laoding, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(item.userUid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          var doc = documentSnapshot.data();
          setPostUserData(doc);
        }
      });
    return () => unsubscribe();
    // firestore()
    //   .collection('users')
    //   .doc(item.userUid)
    //   .get()
    //   .then(res => {
    //     setPostUserData(res.data());
    //   })
    //   .catch(err => {
    //     console.log(
    //       'error in getting user data in home where show posts: ',
    //       err,
    //     );
    //   });
  }, [postUserData]);
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

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setCurrentUserAllData(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  function formateTime() {
    const postTime = item.time.toDate();
    const currentTime = new Date();
    const timeDiff = currentTime - postTime;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) {
      return `now`;
      // return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      // Format the postTime to display the date
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return postTime.toLocaleDateString(undefined, options);
    }
  }

  const profileNavigationHandler = () => {
    if (item.userUid == auth().currentUser.uid) {
      switchToScreen(4);
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: item.userUid,
      });
    }
  };

  const handleSavePost = async () => {
    const currentPostId = item.id;
    const loggedUserId = auth().currentUser.uid;
    const userRef = firestore().collection('users').doc(loggedUserId);
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('savedPosts')) {
          let updatedPosts = [...fuserData.savedPosts]; // Create a new array
          if (fuserData.savedPosts.includes(currentPostId)) {
            updatedPosts = updatedPosts.filter(id => id !== currentPostId); // Remove post id
          } else {
            updatedPosts.push(currentPostId); // Add post id
          }
          await userRef.update({savedPosts: updatedPosts}); // Update the post id
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };

  return (
    <>
      <View>
        <View style={styles.postFistContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={profileNavigationHandler}>
              <FastImage
                source={{
                  uri: postUserData?.imageUrl,
                }}
                style={styles.UserimgStyle}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 8}}>
              <Text style={styles.userDetailText}>
                {postUserData?.fullName}
              </Text>
              <Text style={styles.userDetailText}>{postUserData?.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}
            onPress={() => setShowOptionModal(!showOptionModal)}>
            <Image
              source={require('../../assets/three_dot.png')}
              style={styles.threeDotIcon}
            />
          </TouchableOpacity>
        </View>
        <View>
          {allUrls.length > 0 && (
            <View>
              <FlatList
                data={allUrls}
                onMomentumScrollEnd={ev => {
                  setCurrentPhotoIndex(
                    Math.round(ev.nativeEvent.contentOffset.x / screenWidth) +
                      1,
                  );
                }}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <View>
                        <FastImage
                          resizeMode="cover"
                          source={{uri: item}}
                          style={{width: screenWidth, height: 270}}
                        />
                        {/* {allUrls.length > 1 && (
                          <View style={styles.photoNoContainer}>
                            <Text style={{fontSize: 12, color: colors.white}}>
                              {index + 1}/{allUrls.length}
                            </Text>
                          </View>
                        )} */}
                      </View>
                    </>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
              />
              {allUrls.length > 1 && (
                <View style={[styles.photoNoContainer]}>
                  <Text style={{fontSize: 12, color: colors.white}}>
                    {currentPhotoIndex}/{allUrls.length}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <LikeComponent postId={item.id} postLikes={item.likes} />
            <TouchableOpacity
              style={styles.postIconsContainer}
              onPress={() => setShowComment(!showComment)}>
              <Image
                source={require('../../assets/comment.png')}
                style={[styles.postIconsStyle, {marginHorizontal: 8}]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postIconsContainer}>
              <Image
                source={require('../../assets/share.png')}
                style={styles.postIconsStyle}
              />
            </TouchableOpacity>
          </View>
          {allUrls.length > 1 && (
            <FlatList
              data={allUrls}
              renderItem={({item, index}) => (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor:
                      currentPhotoIndex === index + 1
                        ? colors.blue
                        : theme.paginationColor,
                    borderRadius: 3,
                    marginRight: 3,
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={10}
              // horizontal
            />
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={styles.postIconsContainer}>
              <View style={styles.postIconsStyle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postIconsContainer}>
              <View style={styles.postIconsStyle} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postIconsContainer}
              onPress={handleSavePost}>
              <Image
                source={
                  currentUserAlldata !== null &&
                  currentUserAlldata.savedPosts.includes(item.id)
                    ? require('../../assets/saved_fill.png')
                    : require('../../assets/save.png')
                }
                style={[
                  styles.postIconsStyle,
                  {
                    tintColor:
                      currentUserAlldata !== null &&
                      currentUserAlldata.savedPosts.includes(item.id)
                        ? theme.lightText
                        : theme.text,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{item.likes.length} Likes</Text>
          {item.caption !== '' && (
            <Text style={[styles.captionText]} numberOfLines={3}>
              {item.caption}
            </Text>
          )}
          {commentLength > 0 && (
            <TouchableOpacity onPress={() => setShowComment(!showComment)}>
              <Text
                style={[styles.captionText, {color: theme.commentGrayText}]}>
                View{commentLength == 1 ? '' : ' all'} {commentLength}
                {commentLength == 1 ? ' comment' : ' comments'}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.captionText, {color: theme.commentGrayText}]}>
            {formateTime()}
          </Text>
        </View>
      </View>
      {showComment && (
        <CommentCompo
          showComment={showComment}
          setShowComment={setShowComment}
          postId={item.id}
          switchToScreen={switchToScreen}
        />
      )}
      {showOptionModal && (
        <ShowPostOptionModal
          showOptionModal={showOptionModal}
          setShowOptionModal={setShowOptionModal}
          switchToScreen={switchToScreen}
          postUserUid={item.userUid}
          postUserData={postUserData}
          currentUserAlldata={currentUserAlldata}
          postId={item.id}
          handleSavePost={handleSavePost}
        />
      )}
      <MyIndicator visible={laoding} />
    </>
  );
};

export default ShowPostsCompo;
