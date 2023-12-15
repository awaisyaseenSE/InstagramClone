import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import CommentStyle from '../style/CommentStyle';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import MyIndicator from '../../components/MyIndicator';
import fontFamily from '../../styles/fontFamily';
import auth from '@react-native-firebase/auth';

const ShowCommentsCompo = ({item}) => {
  const {theme} = useTheme();
  const styles = CommentStyle(theme);
  const [userData, setUserData] = useState(null);
  const [laoding, setLoading] = useState(false);
  const loggedUser = auth().currentUser.uid;

  function formateTime() {
    const postTime = item.time;
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

  var isMoundted = false;
  const getUserData = () => {
    try {
      setLoading(true);
      firestore()
        .collection('users')
        .doc(item.userId)
        .get()
        .then(res => {
          setUserData(res.data());
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.log(
            'error in getting user data in home where show posts: ',
            err,
          );
        });
    } catch (error) {
      setLoading(false);
      console.log(
        'error in getting user data in home where show posts: ',
        error,
      );
    }
  };
  useEffect(() => {
    isMoundted = true;
    getUserData();
    return () => (isMoundted = false);
  }, []);

  const handleLike = async () => {
    const postRef = firestore()
      .collection('posts')
      .doc(item.postId)
      .collection('comments')
      .doc(item.commentId);
    try {
      const postDoc = await postRef.get();
      if (postDoc.exists) {
        const postData = postDoc.data();
        if (postData.hasOwnProperty('likes')) {
          let updatedLikes = [...postData.likes]; // Create a new array
          if (postData.likes.includes(loggedUser)) {
            updatedLikes = updatedLikes.filter(id => id !== loggedUser); // Remove like
          } else {
            updatedLikes.push(loggedUser); // Add like
          }
          await postRef.update({likes: updatedLikes}); // Update the likes
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.commentsContainer}>
        <FastImage
          source={{
            uri: userData?.imageUrl,
          }}
          style={styles.profileImageStyle}
        />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.userNameStyle}>{userData?.fullName}</Text>
            <Text
              style={[
                styles.commentTextStyle,
                {
                  fontFamily: fontFamily.medium,
                  marginLeft: 8,
                  color: theme.commentGrayText,
                },
              ]}>
              {formateTime()}
            </Text>
          </View>
          <Text style={[styles.commentTextStyle, {fontSize: 11}]}>
            {item.text} hi i am from pakistan punjab where are you from
          </Text>
          <TouchableOpacity>
            <Text
              style={[styles.commentTextStyle, {color: theme.commentGrayText}]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingTop: 8,
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
            onPress={handleLike}>
            <Image
              source={
                item.likes.includes(loggedUser)
                  ? require('../../assets/tab_heart_fill.png')
                  : require('../../assets/tab_heart.png')
              }
              style={[
                styles.heartIcon,
                {
                  tintColor: item.likes.includes(loggedUser)
                    ? 'red'
                    : theme.commentIconColor,
                },
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.likeCounterText}>{item.likes.length}</Text>
        </View>
      </View>
      <MyIndicator
        visible={laoding}
        style={{backgroundColor: 'transparent'}}
        size={14}
      />
    </>
  );
};

export default ShowCommentsCompo;
