import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import MyIndicator from '../../components/MyIndicator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import ShowPostsCompo from '../components/ShowPostsCompo';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';

export default function ShowAllUserPostsScreen({route}) {
  const {theme} = useTheme();
  const [allUserPosts, setAllUserPosts] = useState([]);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const clickedItem = route.params?.clickedItem;
  const userUid = route.params?.userUid;
  const userClickedPost = useRef(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .where('type', '==', 'post')
      .onSnapshot(snap => {
        if (snap) {
          const allPostData = snap.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(post => post.userUid === userUid);
          setAllUserPosts(allPostData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  //   useEffect(() => {
  //     // userClickedPost.current.scrollToItem({item: clickedItem, animated: true});
  //     // if (allUserPosts.length > 0) {

  //     // }
  //   }, []);
  const scrollToSelectedItem = () => {
    if (clickedItem !== null || clickedItem !== '') {
      userClickedPost?.current.scrollToIndex({index: 2, animated: true});
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Posts"
          onPress={() => navigation.goBack()}
        />
        <View style={{flex: 1, marginBottom: 50}}>
          <FlatList
            ref={userClickedPost}
            data={allUserPosts}
            renderItem={({item}) => (
              <ShowPostsCompo item={item} allUrls={item.medialUrls} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScreenComponent>
      <MyIndicator visible={laoding} />
    </>
  );
}
