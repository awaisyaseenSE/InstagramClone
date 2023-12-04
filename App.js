import 'react-native-gesture-handler';
import {View, Text, SafeAreaView, Button} from 'react-native';
import React from 'react';
import ScreenComponent from './app/components/ScreenComponent';

export default function App() {
  return (
    <ScreenComponent>
      <View>
        <Text>App file</Text>
      </View>
    </ScreenComponent>
  );
}
