import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import {useTheme} from '../themes/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ButtonComponent from './CreateAccount/components/ButtonComponent';
import ShowFollowerFollowingCompo from './Following/ShowFollowerFollowingCompo';

export default function DiscoverPeopleScreen() {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const currentUserId = auth().currentUser?.uid;
  const [allUsers, setAllUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
          const userData = doc.data();
          const userId = doc.id;

          // Skip the current user
          if (userId !== currentUserId) {
            // Check if the current user is not following this user
            if (
              !userData.followers ||
              !userData.followers.includes(currentUserId)
            ) {
              users.push({...userData, id: userId});
            }
          }
        });

        setAllUsers(users);
      });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Discover people"
          onPress={() => navigation.goBack()}
        />
        <View style={{marginTop: 12}}>
          <FlatList
            data={allUsers}
            renderItem={({item}) => (
              <ShowFollowerFollowingCompo item={item.id} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScreenComponent>
    </>
  );
}
