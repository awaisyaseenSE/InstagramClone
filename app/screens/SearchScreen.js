import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../components/MyIndicator';
import {useTheme} from '../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import SearchStyle from './style/SearchStyle';
import ShowSearchPostCompo from './components/ShowSearchPostCompo';
import SearchComponent from './components/SearchComponent';
import fontFamily from '../styles/fontFamily';
import navigationStrings from '../navigation/navigationStrings';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SearchScreen() {
  const {theme} = useTheme();
  // const styles = SearchStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [allPostsData, setAllPostsData] = useState();

  const data = [
    {
      id: 0,
      images: [
        'https://images.pexels.com/photos/19341966/pexels-photo-19341966/free-photo-of-headquarter-of-deutsche-orientbank-in-berlin.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/16157623/pexels-photo-16157623/free-photo-of-set-table-decorated-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/17125142/pexels-photo-17125142/free-photo-of-cup-of-tea-with-chamomile-set-on-open-book.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ],
    },
    {
      id: 1,
      images: [
        'https://images.pexels.com/photos/17125142/pexels-photo-17125142/free-photo-of-cup-of-tea-with-chamomile-set-on-open-book.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/19341966/pexels-photo-19341966/free-photo-of-headquarter-of-deutsche-orientbank-in-berlin.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/16157623/pexels-photo-16157623/free-photo-of-set-table-decorated-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
      ],
    },
    {
      id: 2,
      images: [
        'https://images.pexels.com/photos/16157623/pexels-photo-16157623/free-photo-of-set-table-decorated-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/19341966/pexels-photo-19341966/free-photo-of-headquarter-of-deutsche-orientbank-in-berlin.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/17125142/pexels-photo-17125142/free-photo-of-cup-of-tea-with-chamomile-set-on-open-book.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ],
    },
    {
      id: 3,
      images: [
        'https://images.pexels.com/photos/18931202/pexels-photo-18931202/free-photo-of-a-white-building-with-trees-in-front-of-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/19341966/pexels-photo-19341966/free-photo-of-headquarter-of-deutsche-orientbank-in-berlin.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/16157623/pexels-photo-16157623/free-photo-of-set-table-decorated-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
      ],
    },
    {
      id: 4,
      images: [
        'https://images.pexels.com/photos/11163578/pexels-photo-11163578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/19341966/pexels-photo-19341966/free-photo-of-headquarter-of-deutsche-orientbank-in-berlin.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
        'https://images.pexels.com/photos/17125142/pexels-photo-17125142/free-photo-of-cup-of-tea-with-chamomile-set-on-open-book.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllPostsData(allPostData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <View style={styles.searchBarContainer}>
            <TouchableOpacity
              style={[
                styles.searchIconsContainer,
                {backgroundColor: theme.userProfileGray},
              ]}
              activeOpacity={0.8}>
              <Image
                source={require('../assets/tab_search.png')}
                style={[styles.searchIcon, {tintColor: theme.light}]}
              />
              <Text style={[styles.text, {color: theme.commentGrayText}]}>
                Search
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.findPoepleIconContainer}
              onPress={() =>
                navigation.navigate(navigationStrings.DISCOVER_PEOPLE_SCREEN)
              }>
              <Image
                source={require('../assets/find_people.png')}
                style={[styles.findPoepleIcon, {tintColor: theme.text}]}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={allPostsData}
            renderItem={({item, index}) => (
              <ShowSearchPostCompo item={item} index={index} />
            )}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
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
  container: {
    flex: 1,
  },
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
  findPoepleIconContainer: {
    width: 40,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  findPoepleIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});
