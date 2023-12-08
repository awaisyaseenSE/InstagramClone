import 'react-native-gesture-handler';
import React from 'react';
import MainNavigator from './app/navigation/MainNavigator';
import {ThemeProvider} from './app/themes/ThemeContext';

export default function App() {
  return (
    <>
      <ThemeProvider>
        <MainNavigator />
      </ThemeProvider>
    </>
  );
}
