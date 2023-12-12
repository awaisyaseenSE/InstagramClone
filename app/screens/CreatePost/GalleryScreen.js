import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';

export default function GalleryScreen() {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  return (
    <View>
      <Text style={styles.text}>GalleryScreen</Text>
    </View>
  );
}
