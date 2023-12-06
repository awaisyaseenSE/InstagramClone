import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import auth from '@react-native-firebase/auth';
import colors from '../../styles/colors';
import TopSignUpCompo from './components/TopSignUpCompo';
import GetUserNameComponent from './components/GetUserNameComponent';
import GetUserPasswordComponent from './components/GetUserPasswordComponent';
import GetUserDateOfBirthCompo from './components/GetUserDateOfBirthCompo';

export default function SignUpScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const handleBackScreens = () => {
    if (selectedIndex == 0) {
      return null;
    } else if (selectedIndex == 10) {
      return null;
    } else {
      setSelectedIndex(selectedIndex - 1);
    }
  };
  // if (dateOfBirth !== '') {
  //   console.log(dateOfBirth);
  // }
  return (
    <>
      <ScreenComponent>
        <View style={{backgroundColor: colors.bg, flex: 1}}>
          <View style={styles.container}>
            <TopSignUpCompo onPress={handleBackScreens} />
            {selectedIndex == 0 && (
              <GetUserNameComponent
                fullName={fullName}
                setFullName={setFullName}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {selectedIndex == 1 && (
              <GetUserPasswordComponent
                password={password}
                setPassword={setPassword}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {selectedIndex == 2 && (
              <GetUserDateOfBirthCompo
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.footerText}>Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    flex: 0.07,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: '500',
  },
});
