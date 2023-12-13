import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

export default function PhotoCaptureScreen() {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  const handleCameraLaunch = () => {
    console.log('handle ');
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        console.log('response: ', response);
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  };

  useEffect(() => {
    handleCameraLaunch();
  }, []);

  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View style={{paddingHorizontal: 20}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/close.png')}
              style={styles.closeIconStyle}
            />
          </TouchableOpacity>
        </View>
        {selectedImage !== null && (
          <View style={{alignItems: 'center', marginTop: 12}}>
            <Image
              source={{uri: selectedImage}}
              style={{width: '90%', height: 200}}
            />
          </View>
        )}
      </ScreenComponent>
    </>
  );
}
