import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import useAuth from '../auth/useAuth';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../themes/ThemeContext';
import TopHomeCompo from './components/TopHomeCompo';
import StoryComponent from './components/StoryComponent';
import PostData from '../dummyData/PostData';
import FastImage from 'react-native-fast-image';

export default function Home() {
  const {logout} = useAuth();
  const {theme} = useTheme();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            paddingVertical: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity>
              <Image
                source={{uri: item.userImageUrl}}
                style={styles.imgStyle}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 8}}>
              <Text style={[styles.userDetailText, {color: theme.text}]}>
                {item.userName}
              </Text>
              <Text style={[styles.userDetailText, {color: theme.text}]}>
                {item.address}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image
              source={require('../assets/three_dot.png')}
              style={styles.threeDotIcon}
            />
          </TouchableOpacity>
        </View>
        <View>
          <FastImage
            source={{uri: item.postImagesUrl[0]}}
            style={styles.postImage}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <ScreenComponent
        style={{
          backgroundColor: theme.bottonTabBg,
          paddingTop: Platform.OS === 'android' ? 0 : 0,
        }}
        statusBarBg={theme.bottonTabBg}>
        <TopHomeCompo />
        <View style={{flex: 1, backgroundColor: theme.background}}>
          <StoryComponent />
          <View style={{flex: 1, marginBottom: 50}}>
            <FlatList
              data={PostData}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              // ItemSeparatorComponent={<View style={{marginVertical: 12}} />}
            />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  imgStyle: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  threeDotIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  userDetailText: {
    fontSize: 11,
  },
  postImage: {
    width: '100%',
    height: 270,
  },
});
