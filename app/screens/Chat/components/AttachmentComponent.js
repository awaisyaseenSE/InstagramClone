import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

export default function AttachmentComponent({
  onPressCancel,
  onPressPickImage,
  onPressPickDocument,
  onPressPickFiles,
  onPressPickAudio,
}) {
  return (
    <>
      <TouchableOpacity
        onPress={onPressCancel}
        style={{flex: 1, backgroundColor: 'rgba(60, 60, 60,0.5)'}}
      />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.white,
          justifyContent: 'space-around',
          padding: 10,
          height: 160,
          alignItems: 'center',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onPressPickImage}>
          <Image
            source={require('../../../assets/ic_image.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onPressPickDocument}>
          <Image
            source={require('../../../assets/ic_document.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {height: 30, width: 30, tintColor: colors.white, alignSelf: 'center'},
  iconContainer: {
    padding: 10,
    backgroundColor: colors.blue,
    borderRadius: 30,
    marginVertical: 10,
    height: 60,
    width: 60,
    justifyContent: 'center',
  },
});
