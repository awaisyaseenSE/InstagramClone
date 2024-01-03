import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  View,
  Image,
  StyleSheet,
  LogBox,
} from 'react-native';
import MainNavigator from './app/navigation/MainNavigator';
import {ThemeProvider} from './app/themes/ThemeContext';
import SplashScreen from './app/screens/SplashScreen';
const {height, width} = Dimensions.get('screen');

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  LogBox.ignoreLogs(['new NativeEventEmitter']);
  useEffect(() => {
    setTimeout(() => {
      setSplashDone(true);
    }, 2000);
  }, []);
  return (
    <>
      <ThemeProvider>
        {splashDone ? <MainNavigator /> : <SplashScreen />}
      </ThemeProvider>
    </>
  );
}
