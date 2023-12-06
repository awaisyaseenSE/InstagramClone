import 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import React from 'react';
import LoginScreen from './app/screens/LoginScreen';
import SignUpScreen from './app/screens/CreateAccount/SignUpScreen';

export default function App() {
  return (
    <>
      <SignUpScreen />
    </>
  );
}
