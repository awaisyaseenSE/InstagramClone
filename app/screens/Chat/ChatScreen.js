import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';

export default function ChatScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Chat Screen"
          onPress={() => navigation.goBack()}
        />
      </ScreenComponent>
    </>
  );
}
