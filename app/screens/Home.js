import {View, FlatList, StyleSheet, ScrollView, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import TopHomeCompo from './components/TopHomeCompo';
import StoryComponent from './components/StoryComponent';
import firestore from '@react-native-firebase/firestore';
import ShowPostsCompo from './components/ShowPostsCompo';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {getLocation} from '../utils/getUserLocation';
import ShimmerEffectCompo from '../components/ShimmerEffectCompo';

export default function Home({switchToScreen}) {
  const {theme} = useTheme();
  const [postData, setPostData] = useState([]);
  const [laoding, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [commentPostID, setCommentPostID] = useState('');

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

  const handleGetLocation = async () => {
    try {
      const position = await getLocation();

      if (position !== undefined && position !== null) {
        // console.log('Location of user is: ', position);
      }
    } catch (error) {
      console.log('Error in handleGetLocation in Home screen: ', error);
    }
  };

  useEffect(() => {
    handleGetLocation();
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
              {!laoding ? (
                <FlatList
                  data={postData}
                  renderItem={({item}) => (
                    <ShowPostsCompo
                      item={item}
                      allUrls={item.medialUrls}
                      switchToScreen={switchToScreen}
                      setOpenModal={setOpenModal}
                      setCommentPostID={setCommentPostID}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <ShimmerEffectCompo />
              )}
            </View>
          </View>
        </ScrollView>
        <Modal visible={openModal} style={{flex: 1}} transparent>
          <BottomSheetComponent
            setOpenModal={setOpenModal}
            showComment={openModal}
            setShowComment={setOpenModal}
            postId={commentPostID}
            switchToScreen={switchToScreen}
          />
        </Modal>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  userDetailText: {
    fontSize: 11,
  },
});
