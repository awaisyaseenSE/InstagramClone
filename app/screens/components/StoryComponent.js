import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StoriesData from '../../dummyData/StoriesData';
import fontFamily from '../../styles/fontFamily';
import FastImage from 'react-native-fast-image';
import {useTheme} from '../../themes/ThemeContext';
import InstaStory from 'react-native-insta-story';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StoryComponent = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [allStoriesData, setAllStoriesData] = useState([]);
  const storyData = StoriesData.allStories;
  const [laoding, setLoading] = useState(true);
  const [showCreateStory, setShowCreateStory] = useState(true);

  useEffect(() => {
    getData();

    return () => {};
  }, []);

  const getData = () => {
    // const currentDate = new Date();
    // const currentTime = currentDate.getTime();
    const currentDate = new Date(); // get current date and time
    // const twentyFourHoursAgo = new Date(currentDate - 24 * 60 * 60 * 1000);
    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(
      currentTime.getTime() - 24 * 60 * 60 * 1000,
    );

    firestore()
      .collection('story')
      .orderBy('time', 'desc')
      .where('time', '>=', twentyFourHoursAgo)
      .onSnapshot(snap => {
        var temp = [];
        if (snap.docs.length > 0) {
          var doc = snap.docs;

          doc.forEach(each => {
            // var tempObj = {
            //   user_image:
            //     'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
            //   user_name: 'Ahmet Çağlar Durmuş',
            //   // user_id: 1,
            // };

            // tempObj.stories = each.data().stories;

            // temp.push(tempObj);
            if (each.data().userUid === auth().currentUser.uid) {
              setShowCreateStory(false);
            }
            temp.push(each.data());
          });

          // console.log(' => ', temp[0]);
          setLoading(false);
          setAllStoriesData(temp);
        }
      });
  };

  // const renderItem = ({item}) => {
  //   return (
  //     <View style={styles.container}>
  //       <View
  //         style={[
  //           styles.imageContainer,
  //           {borderColor: theme.storyBg, backgroundColor: theme.background},
  //         ]}>
  //         <TouchableOpacity style={styles}>
  //           <FastImage
  //             source={{uri: item.imageUrl}}
  //             style={styles.imageStyle}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //       <Text style={[styles.text, {color: theme.text}]}>{item.userName}</Text>
  //     </View>
  //   );
  // };

  return (
    <View
      style={{
        paddingVertical: 2,
        borderBottomWidth: 0.2,
        borderBottomColor: theme.bottonTabBorderColor,
        flexDirection: 'row',
      }}>
      {/* <FlatList
        data={storyData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      /> */}
      {showCreateStory && (
        <View style={styles.container}>
          <View
            style={[
              styles.imageContainer,
              {backgroundColor: theme.background},
            ]}>
            <TouchableOpacity
              style={styles}
              onPress={() =>
                navigation.navigate(navigationStrings.SHOW_GALLERY_STORY)
              }>
              <FastImage
                source={{
                  uri:
                    auth().currentUser?.photoURL !== '' ||
                    auth().currentUser?.photoURL !== null
                      ? auth().currentUser?.photoURL
                      : 'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
                }}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.text, {color: theme.text}]}>Create Story</Text>
        </View>
      )}

      {allStoriesData.length > 0 && (
        <InstaStory
          data={allStoriesData}
          duration={6}
          style={{backgroundColor: theme.background}}
          avatarTextStyle={{
            color: theme.text,
            fontSize: 10,
            fontFamily: fontFamily.regular,
          }}
          showAvatarText={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 1,
    marginLeft: 6,
    marginTop: 3,
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: 68 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: Platform.OS === 'android' ? 1.2 : 2,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  text: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: fontFamily.regular,
  },
});

export default StoryComponent;
