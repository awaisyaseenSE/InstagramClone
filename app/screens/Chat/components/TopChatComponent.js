import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../themes/ThemeContext';

const TopChatComponent = ({
  onPressRight,
  rightIcon = '',
  label,
  rightIconStyle,
  rightIconContainerStyle,
  labelStyle,
}) => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.backIconContainer}>
        <TouchableOpacity
          style={styles.backIconMainContainer}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/back.png')}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <Text style={{...styles.text, ...labelStyle, color: theme.text}}>
          {label}
        </Text>
      </View>
      <TouchableOpacity
        style={{...styles.backIconMainContainer, ...rightIconContainerStyle}}
        onPress={onPressRight}>
        <Image
          source={
            rightIcon !== ''
              ? rightIcon
              : require('../../../assets/tab_search.png')
          }
          style={{...styles.iconStyle, ...rightIconStyle}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  backIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  backIconMainContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: 'grey',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    // elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  text: {
    fontSize: 14,
    color: colors.black,
    marginLeft: 20,
  },
});

export default TopChatComponent;
