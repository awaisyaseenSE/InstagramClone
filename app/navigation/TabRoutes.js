import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import BottomTabStyle from './style/BottomTabStyle';
import Home from '../screens/Home';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePost/CreatePostScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import GalleryScreen from '../screens/CreatePost/GalleryScreen';

const TabRoutes = () => {
  const {theme} = useTheme();
  const styles = BottomTabStyle(theme);
  const [selectedScreen, setSelectedScreen] = useState(0);
  const switchToScreen = screenIndex => {
    setSelectedScreen(screenIndex);
  };
  return (
    <>
      <ScreenComponent
        style={{
          flex: 1,
          backgroundColor: theme.bottonTabBg,
          paddingTop: Platform.OS === 'android' ? 0 : 0,
        }}>
        {/* <View style={{flex: 1}}> */}
        {selectedScreen === 0 && <Home />}
        {selectedScreen === 1 && <SearchScreen />}
        {selectedScreen === 2 && <GalleryScreen />}
        {selectedScreen === 3 && <NotificationScreen />}
        {selectedScreen === 4 && <ProfileScreen />}
        {/* </View> */}
      </ScreenComponent>
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          onPress={() => switchToScreen(0)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 0
                ? require('../assets/tab_home_fill.png')
                : require('../assets/tab_home.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchToScreen(1)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 1
                ? require('../assets/tab_search_fill.png')
                : require('../assets/tab_search.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchToScreen(2)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 2
                ? require('../assets/tab_plus.png')
                : require('../assets/tab_plus.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchToScreen(3)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 3
                ? require('../assets/tab_heart_fill.png')
                : require('../assets/tab_heart.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchToScreen(4)}
          style={styles.iconContainer}>
          <Image
            source={require('../assets/user.png')}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default TabRoutes;
