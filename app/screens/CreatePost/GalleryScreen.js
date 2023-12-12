import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';

export default function GalleryScreen() {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  return (
    <View>
      <Text style={styles.text}>GalleryScreen</Text>
      <ButtonComponent title="open gallery" style={{width: '60%'}} />
    </View>
  );
}
