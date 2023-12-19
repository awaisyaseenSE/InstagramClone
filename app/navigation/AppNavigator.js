import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import TabRoutes from './TabRoutes';
import PhotoCaptureScreen from '../screens/CreatePost/PhotoCaptureScreen';
import CreatePostScreen from '../screens/CreatePost/CreatePostScreen';
import CreateStoryScreen from '../screens/CreateStory/CreateStoryScreen';
import ShowGalleryStoryScreen from '../screens/CreateStory/ShowGalleryStoryScreen';

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
      <Stack.Screen
        name="PhotoCaptureScreen"
        component={PhotoCaptureScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreatePostScreen"
        component={CreatePostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateStoryScreen"
        component={CreateStoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowGalleryStoryScreen"
        component={ShowGalleryStoryScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
