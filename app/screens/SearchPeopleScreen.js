import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import SearchStyle from './style/SearchStyle';
import fontFamily from '../styles/fontFamily';
import navigationStrings from '../navigation/navigationStrings';
import {useTheme} from '../themes/ThemeContext';
import TopCompoWithHeading from '../components/TopCompoWithHeading';

export default function SearchPeopleScreen() {
  const navigation = useNavigation();
  const {theme} = useTheme();
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Search People"
          onPress={() => navigation.goBack()}
        />
      </ScreenComponent>
    </>
  );
}
