import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import useAuth from '../auth/useAuth';
import {useTheme} from '../themes/ThemeContext';
import TopHomeCompo from './components/TopHomeCompo';
import StoryComponent from './components/StoryComponent';
import PostData from '../dummyData/PostData';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../components/MyIndicator';
import ShowPostsCompo from './components/ShowPostsCompo';

export default function Home() {
  const {theme} = useTheme();
  const [postData, setPostData] = useState([]);
  const [laoding, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPostData(allPostData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent
        style={{
          backgroundColor: theme.bottonTabBg,
          paddingTop: Platform.OS === 'android' ? 0 : 0,
        }}
        statusBarBg={theme.bottonTabBg}>
        <TopHomeCompo />
        <View style={{flex: 1, backgroundColor: theme.background}}>
          <StoryComponent />
          <View style={{flex: 1, marginBottom: 50}}>
            <FlatList
              data={postData}
              renderItem={({item}) => (
                <ShowPostsCompo item={item} allUrls={item.medialUrls} />
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </ScreenComponent>
      <MyIndicator laoding={laoding} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  userDetailText: {
    fontSize: 11,
  },
});
