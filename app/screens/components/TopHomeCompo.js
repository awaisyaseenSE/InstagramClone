import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../themes/ThemeContext';

const TopHomeCompo = () => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bottonTabBg,
          borderBottomColor: theme.bottonTabBorderColor,
        },
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/ic_camera.png')}
            style={[styles.iconstyle, {tintColor: theme.bottonTabIconColor}]}
          />
        </TouchableOpacity>
        <View style={[styles.iconstyle, {marginLeft: 12}]} />
      </View>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logoStyle, {tintColor: theme.bottonTabIconColor}]}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/IGTV.png')}
            style={[styles.iconstyle, {tintColor: theme.bottonTabIconColor}]}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../assets/share.png')}
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
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  logoStyle: {
    width: 90,
    height: 34,
    resizeMode: 'contain',
  },
});

export default TopHomeCompo;
