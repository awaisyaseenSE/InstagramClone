import {
  View,
  Text,
  PermissionsAndroid,
  Alert,
  Platform,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import MyIndicator from '../../components/MyIndicator';
import ScreenComponent from '../../components/ScreenComponent';

export default function GalleryScreen({switchToScreen}) {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const [media, setMedia] = useState([]);
  const [pickedImage, setPickedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  async function savePicture() {
    setLoading(true);
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      setLoading(false);
      return;
    }

    let params = {first: 20, assetType: 'All'};
    CameraRoll.getPhotos(params)
      .then(res => {
        setMedia(res.edges);
        setPickedImage(res.edges[0].node.image.uri);
        setLoading(false);
      })
      .catch(err => {
        console.log('error is: ', err);
        setLoading(false);
      });

    CameraRoll.getAlbums(params)
      .then(res => {
        console.log('album result is: ', res);
      })
      .catch(err => {
        console.log('error while getting album: ', err);
      });
  }

  useEffect(() => {
    savePicture();
  }, []);

  const imagePressed = item => {
    setPickedImage(item.node.image.uri);
  };

  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <View style={styles.headingIconContainer}>
              <TouchableOpacity
                style={styles.headingiconImageContainer}
                onPress={() => switchToScreen(0)}>
                <Image
                  source={require('../../assets/close.png')}
                  style={styles.closeIconStyle}
                />
              </TouchableOpacity>
              <Text style={styles.heading}>New Post</Text>
            </View>
            <TouchableOpacity style={styles.nextContainer}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickedImageContainer}>
            {pickedImage !== '' && (
              <Image
                source={{uri: pickedImage}}
                style={styles.pickedImageStyle}
              />
            )}
          </View>
          <View style={{flex: 1, paddingHorizontal: 8}}>
            <FlatList
              data={media}
              renderItem={({item}) => {
                return (
                  <View style={{flex: 1}}>
                    <TouchableOpacity onPress={() => imagePressed(item)}>
                      <Image
                        source={{uri: item.node.image.uri}}
                        style={styles.allImagesStyle}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              ItemSeparatorComponent={<View style={{marginVertical: 2}} />}
              columnWrapperStyle={{justifyContent: 'space-between'}}
            />
          </View>
        </View>
      </ScreenComponent>
      <MyIndicator visible={loading} />
    </>
  );
}
