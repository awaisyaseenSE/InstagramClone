import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import TabRoutes from './TabRoutes';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="TabRoutes">
      <Stack.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
