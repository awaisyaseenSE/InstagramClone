import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ShowPostStyle from '../style/ShowPostStyle';
import colors from '../../styles/colors';

const ShowPostsCompo = ({item, allUrls}) => {
  const {theme} = useTheme();
  const styles = ShowPostStyle(theme);
  const [postUserData, setPostUserData] = useState(null);
  const screenWidth = Dimensions.get('screen').width;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(1);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(item.userUid)
      .get()
      .then(res => {
        setPostUserData(res.data());
      })
      .catch(err => {
        console.log(
          'error in getting user data in home where show posts: ',
          err,
        );
      });
  }, []);

  return (
    <>
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg',
                }}
                style={styles.UserimgStyle}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 8}}>
              <Text style={styles.userDetailText}>
                {postUserData?.fullName}
              </Text>
              <Text style={styles.userDetailText}>{postUserData?.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}>
            <Image
              source={require('../../assets/three_dot.png')}
              style={styles.threeDotIcon}
            />
          </TouchableOpacity>
        </View>
        <View>
          {allUrls.length > 0 && (
            <View>
              <FlatList
                data={allUrls}
                onMomentumScrollEnd={ev => {
                  setCurrentPhotoIndex(
                    Math.round(ev.nativeEvent.contentOffset.x / screenWidth) +
                      1,
                  );
                }}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <View>
                        <FastImage
                          resizeMode="cover"
                          source={{uri: item}}
                          style={{width: screenWidth, height: 270}}
                        />
                        {/* {allUrls.length > 1 && (
                          <View style={styles.photoNoContainer}>
                            <Text style={{fontSize: 12, color: colors.white}}>
                              {index + 1}/{allUrls.length}
                            </Text>
                          </View>
                        )} */}
                      </View>
                    </>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
              />
              {allUrls.length > 1 && (
                <View style={[styles.photoNoContainer]}>
                  <Text style={{fontSize: 12, color: colors.white}}>
                    {currentPhotoIndex}/{allUrls.length}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={styles.postIconsContainer}>
              <Image
                source={require('../../assets/tab_heart.png')}
                style={styles.postIconsStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postIconsContainer}>
              <Image
                source={require('../../assets/comment.png')}
                style={[styles.postIconsStyle, {marginHorizontal: 8}]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postIconsContainer}>
              <Image
                source={require('../../assets/share.png')}
                style={styles.postIconsStyle}
              />
            </TouchableOpacity>
          </View>
          {allUrls.length > 1 && (
            <FlatList
              data={allUrls}
              renderItem={({item, index}) => (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor:
                      currentPhotoIndex === index + 1
                        ? colors.blue
                        : theme.paginationColor,
                    borderRadius: 3,
                    marginRight: 3,
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={10}
              // horizontal
            />
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={styles.postIconsContainer}>
              <View style={styles.postIconsStyle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postIconsContainer}>
              <View style={styles.postIconsStyle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postIconsContainer}>
              <Image
                source={require('../../assets/save.png')}
                style={styles.postIconsStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{item.caption}</Text>
        </View>
      </View>
    </>
  );
};

export default ShowPostsCompo;
