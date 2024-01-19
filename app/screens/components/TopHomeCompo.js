import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const TopHomeCompo = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bottonTabBg,
          borderBottomColor: theme.bottonTabBorderColor,
        },
      ]}>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logoStyle, {tintColor: theme.bottonTabIconColor}]}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.NOTIFICATION_SCREEN)
          }>
          <Image
            source={require('../../assets/tab_heart.png')}
            style={[styles.iconstyle, {tintColor: theme.bottonTabIconColor}]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.CHAT_USERS_LIST_SCREEN)
          }>
          <Image
            source={require('../../assets/chat.png')}
            style={[
              styles.iconstyle,
              {marginLeft: 14, tintColor: theme.bottonTabIconColor},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconstyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  logoStyle: {
    width: 90,
    height: 34,
    resizeMode: 'contain',
  },
});

export default TopHomeCompo;
