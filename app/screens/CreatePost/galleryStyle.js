import {Dimensions, StyleSheet} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const galleryStyle = theme => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    text: {
      fontSize: 30,
      color: theme.text,
    },
    closeIconStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    heading: {
      fontSize: 16,
      fontFamily: fontFamily.semiBold,
      color: theme.text,
      marginLeft: 16,
    },
    headingIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headingiconImageContainer: {
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 12,
      backgroundColor: theme.background,
    },
    nextText: {
      fontSize: 16,
      fontFamily: fontFamily.semiBold,
      color: colors.blue,
    },
    nextContainer: {
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    pickedImageContainer: {
      alignItems: 'center',
      marginBottom: 12,
      backgroundColor: colors.galleryPickImageBg,
      paddingVertical: 6,
    },
    pickedImageStyle: {
      width: screenWidth - 16,
      height: screenHeight / 4,
      resizeMode: 'cover',
      borderRadius: 6,
    },
    allImagesStyle: {
      width: screenWidth / 3 - 10,
      height: 100,
      borderRadius: 4,
    },
  });
  return styles;
};

export default galleryStyle;
