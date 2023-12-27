import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import navigationStrings from '../../navigation/navigationStrings';
import ScreenComponent from '../../components/ScreenComponent';
import ReelStyle from '../style/ReelStyle';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ShowReelsCompo from '../components/ShowReelsCompo';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import {useTheme} from '../../themes/ThemeContext';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ChatScreen({switchToScreen}) {
  const {theme} = useTheme();
  const styles = ReelStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [reelData, setReelData] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  var isMounted = false;

  // useEffect(() => {
  //   setLoading(true);
  //   const unsubscribe = firestore()
  //     .collection('posts')
  //     .orderBy('time', 'desc')
  //     .where('type', '==', 'reel')
  //     .onSnapshot(snap => {
  //       if (snap) {
  //         var temp = [];
  //         if (snap.docs.length > 0) {
  //           var doc = snap.docs;
  //           doc.forEach(each => {
  //             temp.push({...each.data(), id: each.id});
  //           });
  //           setReelData(temp);
  //           setLoading(false);
  //         } else {
  //           setLoading(false);
  //         }
  //       } else {
  //         setLoading(false);
  //       }
  //     });
  //   return () => unsubscribe();
  // }, []);

  //   useEffect(() => {
  //     isMounted = true;
  //     getPostData();
  //     return () => {
  //       isMounted = false;
  //     };
  //   }, []);

  const getPostData = () => {
    try {
      setLoading(true);
      firestore()
        .collection('posts')
        .orderBy('time', 'desc')
        .where('type', '==', 'reel')
        .onSnapshot(snap => {
          if (snap) {
            var temp = [];
            if (snap.docs.length > 0) {
              var doc = snap.docs;
              doc.forEach(each => {
                temp.push({...each.data(), id: each.id});
              });
              setReelData(temp);
              setLoading(false);
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onChangeIndex = ({index}) => {
    setCurrentReelIndex(index);
    console.log(index);
  };

  return (
    <>
      <View style={{flex: 1}}>
        <FlatList
          // contentContainerStyle={{paddingBottom: 70}}
          pagingEnabled
          // vertical
          data={[
            'https://firebasestorage.googleapis.com/v0/b/instagramclone-e95ef.appspot.com/o/ReelVideos%2F1703668108510.mp4?alt=media&token=14a3d014-ac22-44f0-8ee7-dfa7e73dddae',
            'https://firebasestorage.googleapis.com/v0/b/instagramclone-e95ef.appspot.com/o/ReelVideos%2F1703668108510.mp4?alt=media&token=14a3d014-ac22-44f0-8ee7-dfa7e73dddae',
            'https://firebasestorage.googleapis.com/v0/b/instagramclone-e95ef.appspot.com/o/ReelVideos%2F1703668108510.mp4?alt=media&token=14a3d014-ac22-44f0-8ee7-dfa7e73dddae',
            'https://firebasestorage.googleapis.com/v0/b/instagramclone-e95ef.appspot.com/o/ReelVideos%2F1703668108510.mp4?alt=media&token=14a3d014-ac22-44f0-8ee7-dfa7e73dddae',
          ]}
          renderItem={({item, index}) => (
            <View
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}>
              <Video
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                }}
                source={{uri: item}}
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          // onChangeIndex={onChangeIndex}
        />
        {/* <Text style={styles.reelTextStyle}>Reels</Text>
          <TouchableOpacity style={styles.reelCameraIconContainer}>
            <Image
              source={require('../../assets/camera.png')}
              style={styles.reelCameraIcon}
            />
          </TouchableOpacity> */}
      </View>
    </>
  );
}
