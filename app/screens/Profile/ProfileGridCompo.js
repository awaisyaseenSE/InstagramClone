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

const ProfileGridCompo = ({setUserPostsLength}) => {
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  const [laoding, setLoading] = useState(false);
  const [allUserPosts, setAllUserPosts] = useState([]);
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs
          .map(doc => ({...doc.data(), id: doc.id}))
          .filter(post => post.userUid === auth().currentUser.uid);
        setUserPostsLength(allPostData.length);
        setAllUserPosts(allPostData);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => {
    return (
      <>
        <View>
          <TouchableOpacity>
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
      </>
    );
  };

  return (
    <>
      <View style={{paddingVertical: 12}}>
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
