import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '../../themes/ThemeContext';
import ProfileStyle from '../style/ProfileStyle';
import MyIndicator from '../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const ProfileGridCompo = ({setUserPostsLength, userUid}) => {
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  const [laoding, setLoading] = useState(false);
  const [allUserPosts, setAllUserPosts] = useState([]);
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .where('type', '==', 'post')
      .onSnapshot(snap => {
        if (snap) {
          const allPostData = snap.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(post => post.userUid === userUid);
          setUserPostsLength(allPostData.length);
          setAllUserPosts(allPostData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, [userUid]);

  const renderItem = ({item}) => {
    return (
      <>
        {/* {item.type == 'post' && ( */}
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
                clickedItem: item,
                userUid: userUid,
              })
            }>
            <FastImage
              source={{uri: item.medialUrls[0]}}
              style={{
                width: screenWidth / 3 - 4,
                height: screenHeight * 0.15,
                margin: 2,
                borderRadius: 2,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {item.medialUrls.length > 1 && (
            <Image
              source={require('../../assets/multiple.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'contain',
                tintColor: 'white',
                position: 'absolute',
                top: 10,
                right: 8,
              }}
            />
          )}
        </View>
        {/* )} */}
      </>
    );
  };

  return (
    <>
      <View style={{paddingVertical: 12, flex: 1, marginBottom: 50}}>
        <FlatList
          data={allUserPosts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
        />
      </View>
      <MyIndicator visible={laoding} />
    </>
  );
};

export default ProfileGridCompo;
