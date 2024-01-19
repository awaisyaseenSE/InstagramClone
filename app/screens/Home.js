import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
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

export default function Home({switchToScreen}) {
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
        const filteredPostData = allPostData.filter(ele => ele.type === 'post');
        setPostData(filteredPostData);
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
          flex: 1,
        }}
        statusBarBg={theme.bottonTabBg}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <TopHomeCompo />
          <View style={{flex: 1, backgroundColor: theme.background}}>
            <StoryComponent />
            <View style={{flex: 1}}>
              <FlatList
                data={postData}
                renderItem={({item}) => (
                  <ShowPostsCompo
                    item={item}
                    allUrls={item.medialUrls}
                    switchToScreen={switchToScreen}
                  />
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  userDetailText: {
    fontSize: 11,
  },
});
