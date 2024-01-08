import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../../../components/ScreenComponent';
import {useTheme} from '../../../themes/ThemeContext';
import MyIndicator from '../../../components/MyIndicator';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';
import fontFamily from '../../../styles/fontFamily';

export default function GroupDetailScreen({route}) {
  const {theme} = useTheme();
  const groupData = route.params?.groupData;
  const groupMemberImage = route.params?.groupMemberImage;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading onPress={() => navigation.goBack()} />
        <View style={styles.container}>
          <View>
            <FastImage
              source={{uri: auth().currentUser?.photoURL}}
              style={styles.profileImage}
            />
            <FastImage
              source={{
                uri: groupMemberImage
                  ? groupMemberImage
                  : 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png',
              }}
              style={styles.profileImagetwo}
            />
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 26}}>
          <Text style={[styles.groupNameStyle, {color: theme.text}]}>
            {groupData?.groupName}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/profile_user.png')}
              style={styles.icon}
            />
            <Text style={{color: theme.text}}>Add</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/profile_user.png')}
              style={styles.icon}
            />
            <Text style={{color: theme.text}}>Search</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/profile_user.png')}
              style={styles.icon}
            />
            <Text style={{color: theme.text}}>Remove</Text>
          </View>
        </View>
      </ScreenComponent>
      <MyIndicator
        visible={loading}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    borderRadius: 35,
  },
  profileImagetwo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 40,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  groupNameStyle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
