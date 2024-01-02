import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../../styles/fontFamily';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';

const AddNewMessageCompo = ({
  newTextMessage,
  setNewTextMessage,
  sendShow,
  setSendShow,
  sendMessage,
  pickImage,
  setRecordingModal,
  captureImage,
}) => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        // keyboardVerticalOffset={20}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: theme.chatTextInputBg},
            ]}>
            <TouchableOpacity
              style={styles.leftIconContainer}
              onPress={captureImage}>
              <Image
                source={require('../../../assets/fill_camera.png')}
                style={styles.leftIcon}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Message..."
              placeholderTextColor={theme.gray}
              style={[styles.input, {color: theme.light}]}
              value={newTextMessage}
              onChangeText={text => {
                setNewTextMessage(text);
                if (text.trim().length) {
                  setSendShow(true);
                } else {
                  setSendShow(false);
                }
              }}
              multiline
            />
            {!sendShow ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.rightIconsContainer}
                  onPress={() => {
                    setRecordingModal(true);
                  }}>
                  <Image
                    source={require('../../../assets/microphone.png')}
                    style={[styles.rightIcons, {tintColor: theme.light}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rightIconsContainer, {marginLeft: 2}]}
                  onPress={pickImage}>
                  <Image
                    source={require('../../../assets/image.png')}
                    style={[styles.rightIcons, {tintColor: theme.light}]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.rightIconsContainer}
                onPress={() => {
                  if (newTextMessage !== '') {
                    if (!newTextMessage.trim().length) {
                      console.log('str is empty!');
                      setNewTextMessage('');
                      return;
                    }
                    sendMessage(newTextMessage.trim(), 'text');
                  } else {
                    //   setRecordingModal(true);
                  }
                }}>
                <Text style={styles.sendTextStyle}>Send</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  leftIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'snow',
  },
  leftIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skyBlue,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 22,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    height: '100%',
    textAlignVertical: 'top',
  },
  rightIcons: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rightIconsContainer: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  sendTextStyle: {
    fontSize: 16,
    color: colors.purple,
    fontWeight: '600',
  },
});

export default AddNewMessageCompo;
