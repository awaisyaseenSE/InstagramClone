import {StyleSheet} from 'react-native';

const AuthStyles = theme => {
  const styles = StyleSheet.create({
    heading: {
      fontSize: 22,
      color: theme.text,
      fontWeight: '700',
      marginBottom: 18,
      marginTop: 8,
    },
    errorText: {
      fontSize: 12,
      color: theme.red,
      marginTop: 6,
      paddingLeft: 6,
    },
    descText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 14,
    },
  });
  return styles;
};

export default AuthStyles;
