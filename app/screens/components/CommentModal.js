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
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import colors from '../../styles/colors';
import CommentStyle from '../style/CommentStyle';
import FastImage from 'react-native-fast-image';
import PostData from '../../dummyData/PostData';
import ScreenComponent from '../../components/ScreenComponent';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ShowCommentsCompo from './ShowCommentsCompo';

const CommentModal = ({showComment, setShowComment, postId}) => {
  const {theme} = useTheme();
  const styles = CommentStyle(theme);
  const [comment, setComment] = useState('');
  const [laoding, setLoading] = useState(false);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('time', 'desc')
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => ({
          ...doc.data(),
          commentId: doc.id,
          time: doc.data().time.toDate(),
        }));

        setCommentData(newMessages);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const handleAddComment = async () => {
    try {
      setLoading(true);
      const newComment = {
        text: comment,
        time: new Date(),
        userId: auth().currentUser.uid,
        postId,
        likes: [],
      };
      setComment('');
      await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add(newComment)
        .then(() => {
          setLoading(false);
        })
        .catch(er => console.log('Error in adding comment: ', er));
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
                <Text style={styles.commentHeading}>
                  Comments ({commentData.length})
                </Text>
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
                <View
                  style={{flex: 1, paddingHorizontal: 20, paddingVertical: 8}}>
                  <FlatList
                    data={commentData}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => <ShowCommentsCompo item={item} />}
                  />
                </View>
                <View style={styles.addCommentContainer}>
                  <FastImage
                    source={{
                      uri: auth().currentUser?.photoURL,
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
