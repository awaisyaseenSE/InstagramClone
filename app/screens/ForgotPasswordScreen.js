import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import styles from './CreateAccount/CommonSignUpStyle';
import ButtonComponent from './CreateAccount/components/ButtonComponent';
import TextInputSignUpCompo from './CreateAccount/components/TextInputSignUpCompo';
import TopSignUpCompo from './CreateAccount/components/TopSignUpCompo';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isResetPasswordSend, setIsResetPasswordSend] = useState(false);

  const validateEmail = email => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(email).toLowerCase());
  };
  const handleForgotPassword = () => {
    if (email == '') {
      return setEmailError('email is required!');
    } else {
      if (!validateEmail(email)) {
        setEmailError('Email is invalid!');
        return null;
      } else {
        setEmailError('');
      }
    }
    setLoading(true);
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsResetPasswordSend(true);
        setEmail('');
        setLoading(false);
      })
      .catch(function (e) {
        setLoading(false);
        console.log(e);
        Alert.alert('Error: ', e);
      });
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.white}}>
        <View style={mystyles.container}>
          <TopSignUpCompo onPress={() => navigation.goBack()} />
          <View>
            <Text style={[styles.heading, {marginBottom: 8}]}>
              Reset password of your account
            </Text>
            <Text style={styles.descText}>Enter your email address</Text>
            {isResetPasswordSend && (
              <Text style={mystyles.successText}>
                Password is send to your email please check it!
              </Text>
            )}
            <TextInputSignUpCompo
              label="Enter Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (text.length > 0) {
                  setEmailError('');
                }
              }}
              autoCapitalize="none"
              clearIcon={
                email.length > 0 ? require('../assets/close.png') : null
              }
              onPressClear={() => setEmail('')}
            />
            {emailError !== '' ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <View style={{marginTop: 20}}>
              <ButtonComponent
                title="Next"
                onPress={handleForgotPassword}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const mystyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },
  successText: {
    // alignSelf: 'center',
    marginBottom: 8,
    color: 'seagreen',
    fontWeight: '600',
  },
});
