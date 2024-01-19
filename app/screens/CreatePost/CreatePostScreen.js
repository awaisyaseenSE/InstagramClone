import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';
import {useNavigation} from '@react-navigation/native';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import MyIndicator from '../../components/MyIndicator';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import navigationStrings from '../../navigation/navigationStrings';
import {sendNotificationToAll} from '../../utils/sendNotification';

export default function CreatePostScreen({route}) {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const navigation = useNavigation();
  const allMedia = route?.params.allMedia;
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [medialUrls, setMediaUrls] = useState([]);
  const currentUserName = auth().currentUser?.displayName;
  const currentUserUID = auth().currentUser?.uid;

  const handleUploadPost = allUrls => {
    try {
      firestore()
        .collection('posts')
        .add({
          caption,
          medialUrls: allUrls,
          time: new Date(),
          userUid: auth().currentUser.uid,
          likes: [],
          type: 'post',
        })
        .then(docRef => {
          // Successfully uploaded post, now send notifications
          const title = `${currentUserName} added new post`;
          const body = caption !== '' ? caption : 'New post is added';
          const imageUrl = allUrls[0];
          const type = 'post';
          const typeID = docRef.id;
          sendNotificationToAll(title, body, imageUrl, type, typeID);

          // Navigate to the desired screen
          navigation.navigate('TabRoutes', {screenNo: 3});
        })
        .catch(er => {
          console.log('getting error while uploading post to firestore: ', er);
        });
    } catch (error) {
      console.log('error in handleUploadPost funtion: ', error);
    }
  };

  const uploadImages = async newImages => {
    setLoading(true);
    try {
      let allUrls = [];
      await Promise.all(
        newImages.map(async image => {
          const timestamp = Date.now();
          const postId = `post_${timestamp}`;
          const imageRef = storage().ref(`postImages/${postId}.jpg`);
          await imageRef.putFile(image);
          const downloadURL = await imageRef.getDownloadURL();
          allUrls.push(downloadURL);
          setMediaUrls(prevData => [...prevData, downloadURL]);
        }),
      );
      setLoading(false);
      handleUploadPost(allUrls);
    } catch (error) {
      console.error('Error uploading images: ', error);
      setLoading(false);
    }
  };

  const handleSharePost = async () => {
    try {
      await uploadImages(allMedia);
    } catch (error) {
      console.log('error in handleSharePost funtion: ', error);
    }
  };

  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View
          style={[
            styles.cameraContainer,
            {paddingHorizontal: 20, marginBottom: 20},
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/close.png')}
              style={styles.closeIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Create Post</Text>
        </View>
        <View>
          <FlatList
            data={allMedia}
            renderItem={({item}) => {
              return (
                <Image source={{uri: item}} style={styles.createPostImages} />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                marginTop: 12,
                flex: 1,
                justifyContent: 'space-between',
                paddingBottom: 20,
              }}>
              <View
                style={{
                  marginBottom: 20,
                  borderBottomWidth: 0.5,
                  borderBottomColor: theme.placeholderColor,
                }}>
                <TextInput
                  placeholder="Write a caption..."
                  style={styles.createPostTextInput}
                  placeholderTextColor={theme.placeholderColor}
                  multiline
                  maxLength={200}
                  value={caption}
                  onChangeText={text => setCaption(text)}
                />
              </View>
              <ButtonComponent
                title="Share"
                style={{
                  width: '70%',
                  alignSelf: 'center',
                  height: 40,
                  borderRadius: 8,
                }}
                loading={loading}
                textStyle={{fontSize: 12}}
                onPress={handleSharePost}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScreenComponent>
    </>
  );
}
