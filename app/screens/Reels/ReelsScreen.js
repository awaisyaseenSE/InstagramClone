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
import {useTheme} from '../../themes/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import navigationStrings from '../../navigation/navigationStrings';
import ScreenComponent from '../../components/ScreenComponent';
import ReelStyle from '../style/ReelStyle';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ShowReelsCompo from '../components/ShowReelsCompo';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

export default function ReelsScreen({switchToScreen}) {
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

  useEffect(() => {
    isMounted = true;
    getPostData();
    return () => {
      isMounted = false;
    };
  }, []);

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
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <View style={styles.container}>
          <SwiperFlatList
            contentContainerStyle={{paddingBottom: 70}}
            pagingEnabled
            vertical
            data={reelData}
            renderItem={({item, index}) => (
              <ShowReelsCompo
                item={item}
                index={index}
                currentReelIndex={currentReelIndex}
                getPostData={getPostData}
                switchToScreen={switchToScreen}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onChangeIndex={onChangeIndex}
          />
          <Text style={styles.reelTextStyle}>Reels</Text>
          <TouchableOpacity style={styles.reelCameraIconContainer}>
            <Image
              source={require('../../assets/camera.png')}
              style={styles.reelCameraIcon}
            />
          </TouchableOpacity>
        </View>
      </ScreenComponent>
      <MyIndicator visible={laoding} />
    </>
  );
}

const myStyles = StyleSheet.create({});
