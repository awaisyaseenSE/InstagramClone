import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../../components/MyIndicator';
import ShowAlreadyChatCompo from './components/ShowAlreadyChatCompo';

export default function ChatUsersListScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [filteredChatsArray, setFilteredChatsArray] = useState([]);
  var isMounted = false;

  const getUsersList = async () => {
    try {
      setLoading(true);
      const tempArray = [];
      const fdata = await firestore().collection('users').get();
      fdata.forEach(doc => {
        tempArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      if (tempArray.length) {
        setUsersList(tempArray);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getChatsData = () => {
    try {
      firestore()
        .collection('chats')
        .orderBy('messageTime', 'desc')
        .onSnapshot(documentSnapshot => {
          var chattingArray = [];
          var doc = documentSnapshot.docs;
          doc.forEach(each => {
            if (each.id.includes(auth().currentUser.uid)) {
              chattingArray.push({
                chatID: each.id,
                ...each.data(),
              });
            }
          });
          isMounted = true;
          if (isMounted) {
            setFilteredChatsArray(chattingArray);
            setLoading(false);
          }
        });
    } catch (error) {
      console.log('error in getting user chat list screen: ', error);
    }
  };

  useEffect(() => {
    isMounted = true;
    getUsersList();
    getChatsData();
    return () => (isMounted = false);
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title={auth().currentUser?.displayName}
          onPress={() => navigation.goBack()}
          rightIcon={require('../../assets/create-group-icon.png')}
          rightIconStyle={{width: 28, height: 28, tintColor: theme.text}}
          onPressRight={() =>
            navigation.navigate(navigationStrings.CREATE_GROUP_SCREEN)
          }
        />
        <View style={styles.searchBarContainer}>
          <TouchableOpacity
            style={[
              styles.searchIconsContainer,
              {backgroundColor: theme.userProfileGray},
            ]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(navigationStrings.CHAT_SEARCH_SCREEN)
            }>
            <Image
              source={require('../../assets/tab_search.png')}
              style={[styles.searchIcon, {tintColor: theme.light}]}
            />
            <Text style={[styles.text, {color: theme.commentGrayText}]}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={filteredChatsArray}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{width: '100%', paddingBottom: 50}}
            renderItem={({item}) => {
              return (
                <ShowAlreadyChatCompo
                  data={item}
                  onPress={() => {
                    navigation.navigate(navigationStrings.CHAT_SCREEN, item);
                  }}
                />
              );
            }}
          />
        </View>
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  searchIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
});
