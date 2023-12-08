import {StyleSheet} from 'react-native';
import fontFamily from './fontFamily';

const AuthStyles = theme => {
  const styles = StyleSheet.create({
    heading: {
      fontSize: 22,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
      marginBottom: 18,
      marginTop: 8,
    },
    errorText: {
      fontSize: 12,
      color: theme.red,
      marginTop: 6,
      paddingLeft: 6,
      fontFamily: fontFamily.medium,
    },
    descText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 14,
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
};

export default AuthStyles;
