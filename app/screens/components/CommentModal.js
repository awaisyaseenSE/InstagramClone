import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import colors from '../../styles/colors';
import CommentStyle from '../style/CommentStyle';
import FastImage from 'react-native-fast-image';
import PostData from '../../dummyData/PostData';
import ScreenComponent from '../../components/ScreenComponent';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CommentModal = ({showComment, setShowComment, postId}) => {
  const {theme} = useTheme();
  const styles = CommentStyle(theme);
  const [comment, setComment] = useState('');
  const [laoding, setLoading] = useState(false);

  const handleAddComment = async () => {
    try {
      setLoading(true);
      console.log('before adding comment');
      const newComment = {
        text: comment,
        time: new Date(),
        userId: auth().currentUser.uid,
        postId,
        likes: [],
      };

      // Update the local state to immediately display the new comment
      //   setCommnents([...comments, newComment]);
      //   setCLength(clength + 1);
      setComment('');
      //   handleTextInputBlur();

      // Add the comment to Firestore
      await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add(newComment)
        .then(() => {
          setLoading(false);
          console.log('commend is added');
        })
        .catch(er => console.log('er: ', er));
    } catch (error) {
      setLoading(false);
      console.log('Error while Adding Comment on Post: ', error);
    }
  };

  return (
    <>
      <Modal visible={showComment} style={{flex: 1}} transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <TouchableOpacity
            style={{backgroundColor: 'transparent', height: 100}}
            onPress={() => setShowComment(!showComment)}
          />
          <View style={styles.container}>
            <View style={styles.mainContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.commentHeading}>Comments</Text>
                <TouchableOpacity
                  style={styles.closeIconContainer}
                  onPress={() => setShowComment(!showComment)}>
                  <Image
                    source={require('../../assets/close.png')}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <View style={{flex: 1, paddingHorizontal: 20}}>
                  <FlatList
                    data={PostData}
                    renderItem={({item}) => {
                      return (
                        <View style={{marginVertical: 12}}>
                          <Text style={{fontSize: 14, color: theme.text}}>
                            {item.address}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: theme.text,
                              marginVertical: 12,
                            }}>
                            {item.id}
                          </Text>
                          <Text style={{fontSize: 14, color: theme.text}}>
                            {item.userName}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
                <View style={styles.addCommentContainer}>
                  <FastImage
                    source={{
                      uri: 'https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg',
                    }}
                    style={styles.profileImageStyle}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor={theme.placeholderColor}
                    value={comment}
                    onChangeText={text => setComment(text)}
                  />
                  <TouchableOpacity
                    style={styles.addCommentIconContainer}
                    onPress={handleAddComment}>
                    {laoding ? (
                      <ActivityIndicator size={14} color={'white'} />
                    ) : (
                      <Image
                        source={require('../../assets/up-arrow.png')}
                        style={styles.addCommentIcon}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default CommentModal;
