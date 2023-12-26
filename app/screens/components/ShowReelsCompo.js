import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import Video from 'react-native-video';
import colors from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../styles/fontFamily';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowReelsCompo = ({item, index, currentReelIndex}) => {
  const {theme} = useTheme();
  const videoRef = useRef(null);

  const onBuffer = data => {
    console.log('on Buffer react native video: ', data);
  };
  const videoError = err => {
    console.log('Error react native video: ', err);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currentReelIndex]);

  return (
    <>
      <View style={styles.container}>
        <Video
          source={{
            uri: item.medialUrls[0],
          }}
          ref={videoRef}
          style={{
            width: screenWidth,
            height: screenHeight - 100,
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // bottom: 0,
            // right: 0,
          }}
          onBuffer={onBuffer}
          onError={videoError}
          resizeMode="cover"
          poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
          posterResizeMode="cover"
          repeat
          paused={currentReelIndex !== index}
          //   paused={true}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 20,
          height: '34%',
          paddingHorizontal: 20,
        }}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View
            style={{
              flex: 1,
              // borderWidth: 2,
              // borderColor: 'black',
              justifyContent: 'flex-end',
            }}>
            <View style={styles.userDetailContainer}>
              <FastImage
                style={styles.userProfileImage}
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtTgADTlo3rtSsrCFEIn0Onpx22hbJus4orcFhRIW42G5kl-5628x_kY_4jKUNbOWZQ1E&usqp=CAU',
                }}
              />
              <Text style={styles.userName}>Muhammad Usman</Text>
              <TouchableOpacity style={styles.followContainer}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.desText} numberOfLines={1}>
                Tag to your friend this video is amazing. This video from
                facebook.
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity style={{}}>
              <Image
                source={require('../../assets/tab_heart.png')}
                style={styles.reelIcons}
              />
              <Text style={styles.iconText}>72K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginVertical: 30}}>
              <Image
                source={require('../../assets/comment.png')}
                style={styles.reelIcons}
              />
              <Text style={styles.iconText}>2008</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{}}>
              <Image
                source={require('../../assets/share.png')}
                style={styles.reelIcons}
              />
              <Text style={styles.iconText}>12K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 30}}>
              <Image
                source={require('../../assets/vertical_dots.png')}
                style={styles.reelIcons}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    // height: screenHeight - 100,
  },
  reelIcons: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  iconText: {
    fontSize: 14,
    color: colors.white,
  },
  userProfileImage: {width: 44, height: 44, borderRadius: 44 / 2},
  userName: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamily.semiBold,
    marginHorizontal: 12,
  },
  userDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
  },
  followText: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
  desText: {
    width: '94%',
    fontSize: 12,
    color: colors.white,
    marginTop: 20,
  },
});

export default ShowReelsCompo;
