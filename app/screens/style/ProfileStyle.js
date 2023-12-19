import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const ProfileStyle = theme => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.profileBg,
    },
    userName: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.regular,
    },
    drawerIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 12,
    },
    drawerIconContainer: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    profileImageContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.profileImgBorder,
    },
    profileImageStyle: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    followingContentText: {
      color: theme.postCaption,
      fontSize: 15,
      //   fontFamily: fontFamily.medium,
    },
    followingContentText1: {
      color: theme.postCaption,
      fontSize: 12,
      //   fontFamily: fontFamily.regular,
    },
    followingTextContainer: {
      alignItems: 'center',
    },
    userDetailContainer: {
      paddingHorizontal: 20,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    followerContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    bioContainer: {
      paddingHorizontal: 30,
      marginVertical: 12,
    },
    bioText: {
      width: '80%',
      color: theme.postCaption,
      fontSize: 12,
      fontFamily: fontFamily.regular,
    },
    editProfileBtnContainer: {
      height: 34,
      backgroundColor: theme.background,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.6,
      borderColor: theme.profileImgBorder,
    },
    editProfileBtnText: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
    },
  });
  return styles;
};

export default ProfileStyle;
