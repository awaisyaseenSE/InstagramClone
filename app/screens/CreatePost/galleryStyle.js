import {StyleSheet} from 'react-native';
import fontFamily from '../../styles/fontFamily';

const galleryStyle = theme => {
  const styles = StyleSheet.create({
    text: {
      fontSize: 30,
      color: theme.text,
    },
  });
  return styles;
};

export default galleryStyle;
