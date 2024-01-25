import {View, FlatList, StyleSheet, ScrollView, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import TopHomeCompo from './components/TopHomeCompo';
import StoryComponent from './components/StoryComponent';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../components/MyIndicator';
import ShowPostsCompo from './components/ShowPostsCompo';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {getLocation} from '../utils/getUserLocation';
import fontFamily from '../styles/fontFamily';

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

  const getCityAndCountry = async (latitude, longitude) => {
    try {
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCtRP6bt1pJv3u2LXVLge9d34EMbz2AbAk`,
      // );
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const addressComponents = data.results[0].address_components;
        let city = '';
        let country = '';
        for (let component of addressComponents) {
          if (component.types.includes('locality')) {
            city = component.long_name;
          } else if (component.types.includes('country')) {
            country = component.long_name;
          }
        }
        return {city, country};
      } else {
        throw new Error('Failed to fetch location information');
      }
    } catch (error) {
      throw new Error('Error fetching location information: ' + error.message);
    }
  };

  const handleGetLocation = async () => {
    try {
      const position = await getLocation();

      if (position !== undefined && position !== null) {
        console.log('Location of user is: ', position);
        const {latitude, longitude} = position.coords;
        try {
          const locationInfo = await getCityAndCountry(latitude, longitude);
          console.log('City:', locationInfo.city);
          console.log('Country:', locationInfo.country);
        } catch (error) {
          console.error('Error in getting user city name in home.js ', error);
        }
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
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  userDetailText: {
    fontSize: 11,
  },
});
