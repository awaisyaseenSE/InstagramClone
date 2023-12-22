import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import TabRoutes from './TabRoutes';
import PhotoCaptureScreen from '../screens/CreatePost/PhotoCaptureScreen';
import CreatePostScreen from '../screens/CreatePost/CreatePostScreen';
import CreateStoryScreen from '../screens/CreateStory/CreateStoryScreen';
import ShowGalleryStoryScreen from '../screens/CreateStory/ShowGalleryStoryScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import ShowAllUserPostsScreen from '../screens/Profile/ShowAllUserPostsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import FollowerAndFollowingScreen from '../screens/Following/FollowerAndFollowingScreen';
import EditPostScreen from '../screens/CreatePost/EditPostScreen';
import AboutAccountScreen from '../screens/AboutAccountScreen';
import SavedPostsScreen from '../screens/SavedPostsScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerProfile = () => (
  <>
    <Drawer.Navigator
      initialRouteName="TabRoutes"
      screenOptions={{
        // drawerStyle: {
        //   width: wid * 0.7,
        //   alignSelf: 'center',
        // },
        // sceneContainerStyle: {
        //   backgroundColor: '#F2F2F7',
        // },
        headerShown: false,
        drawerPosition: 'right',
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveBackgroundColor: 'transparent',
        // drawerActiveTintColor: 'red',

        // drawerInactiveTintColor: 'green',
        // overlayColor: 'transparent',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  </>
);
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabRoutes">
      <Stack.Screen
        name="MainTabRoutes"
        component={DrawerProfile}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      /> */}
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
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowAllUserPostsScreen"
        component={ShowAllUserPostsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FollowerAndFollowingScreen"
        component={FollowerAndFollowingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditPostScreen"
        component={EditPostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AboutAccountScreen"
        component={AboutAccountScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SavedPostsScreen"
        component={SavedPostsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
