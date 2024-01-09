import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatStyle from '../../style/ChatStyle';
import ScreenComponent from '../../../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MyIndicator from '../../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../styles/colors';
import {useTheme} from '../../../themes/ThemeContext';
import TopCreateGroupCompo from './components/TopCreateGroupCompo';
import ButtonComponent from '../../CreateAccount/components/ButtonComponent';
import ShowAllUsersCreateGroupCompo from './components/ShowAllUsersCreateGroupCompo';
import navigationStrings from '../../../navigation/navigationStrings';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';

export default function AddPeopleGroupScreen() {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const currentUserId = auth().currentUser.uid;
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([currentUserId]);
  const [selectedName, setSelectedName] = useState([]);
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Add People"
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text style={{color: theme.text}}>AddPeopleGroupScreen</Text>
        </View>
      </ScreenComponent>
    </>
  );
}
