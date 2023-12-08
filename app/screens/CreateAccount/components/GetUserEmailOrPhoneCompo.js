import {View, Text, Alert} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import colors from '../../../styles/colors';
import TextInputSignUpCompo from './TextInputSignUpCompo';
import ButtonComponent from './ButtonComponent';
import useAuth from '../../../auth/useAuth';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';
import firestore from '@react-native-firebase/firestore';
import AuthStyles from '../../../styles/AuthStyles';
import {useTheme} from '../../../themes/ThemeContext';

const GetUserEmailOrPhoneCompo = ({
  email = '',
  setEmail,
  phoneNumber = '',
  setPhoneNumber,
  isEmailSignIn,
  setIsEmailSignIn,
  password,
  selectedIndex,
  setSelectedIndex,
  setIsCreated,
  fullName,
  dateOfBirth,
}) => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberErrorText, setPhoneNumberErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const {logout} = useAuth();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = AuthStyles(theme);

  const validateEmail = email => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(email).toLowerCase());
  };
  const validatePhoneNumber = phone => {
    return /^\+?\d{10,14}$/.test(phone);
  };

  const sendVerificationLink = async result => {
    try {
      await result.user.sendEmailVerification();
      logout();
      navigation.navigate(navigationStrings.SUCCESSFULLY_CREATE_ACCOUNT);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error in sending verification link to email: ', error);
    }
  };
  const handleUploadUserData = async () => {
    try {
      await auth().currentUser?.updateProfile({
        displayName: fullName,
      });
      await firestore().collection('users').doc(auth().currentUser.uid).set({
        fullName: fullName,
        email: email,
        dateOfBirth: dateOfBirth,
      });
      return true;
    } catch (error) {
      setLoading(false);
      console.log('Error while uploading data of user to firestore: ', error);
      return false;
    }
  };
  const handleEmailSignUp = () => {
    try {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          const res = handleUploadUserData();
          if (res) {
            sendVerificationLink(result);
          }
          setLoading(false);
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setLoading(false);
            console.log('That email address is already in use!');
            setEmailError(true);
            setEmailErrorText('That email address is already in use!');
            setIsCreated(false);
          }
          if (error.code === 'auth/invalid-email') {
            setLoading(false);
            console.log('That email address is invalid!');
            setEmailError(true);
            setEmailErrorText('That email address is invalid!');
            setIsCreated(false);
          }
          if (error.code == 'auth/weak-password') {
            setLoading(false);
            console.log(
              'Password is weak, password must be 6 characters or more!',
            );
            setEmailError(true);
            setEmailErrorText(
              'Password is weak, password must be 6 characters or more!',
            );
            setIsCreated(false);
          }
          setLoading(false);
          console.log('getting ERROR while Sign up with Eamil: ', error);
          setIsCreated(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERROR while Sign up with Eamil: ', error);
      setIsCreated(false);
    }
  };
  const handlePhoneNumberSignUp = () => {
    Alert.alert(' handle Phone SignUp');
  };

  const handleNextScreen = () => {
    if (isEmailSignIn) {
      if (email == '') {
        setEmailError(true);
        setEmailErrorText('Email is required!');
        return null;
      } else {
        if (!validateEmail(email)) {
          setEmailError(true);
          setEmailErrorText('Email is invalid!');
          return null;
        } else {
          setEmailError(false);
          setEmailErrorText('');
          handleEmailSignUp();
        }
      }
    } else {
      if (phoneNumber == '') {
        setPhoneNumberError(true);
        setPhoneNumberErrorText('Mobile number is required!');
        return null;
      } else {
        if (!validatePhoneNumber(phoneNumber)) {
          setPhoneNumberError(true);
          setPhoneNumberErrorText('Mobile number is invalid!');
          return null;
        } else {
          setPhoneNumberError(false);
          setPhoneNumberErrorText('');
          handlePhoneNumberSignUp();
        }
      }
    }
  };
  const handleSignUpMethodChange = () => {
    setPhoneNumber('');
    setPhoneNumberError(false);
    setPhoneNumberErrorText('');
    setEmail('');
    setEmailError(false);
    setEmailErrorText('');
    setIsEmailSignIn(!isEmailSignIn);
  };
  return (
    <View>
      <Text style={styles.heading}>
        What's your {isEmailSignIn ? 'email address' : 'mobile number'}?
      </Text>
      <Text style={styles.descText}>
        Enter the{' '}
        {isEmailSignIn ? 'email address' : 'mobile number with country code'} at
        which you can be contacted. No one will see this on your profile.
      </Text>
      {isEmailSignIn ? (
        <TextInputSignUpCompo
          label="Email address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (text.length > 0) {
              setEmailError(false);
              setEmailErrorText('');
            }
          }}
          clearIcon={
            email.length > 0 ? require('../../../assets/close.png') : null
          }
          onPressClear={() => setEmail('')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      ) : (
        <TextInputSignUpCompo
          label="Mobile number"
          value={phoneNumber}
          onChangeText={text => {
            setPhoneNumber(text);
            if (text.length > 0) {
              setPhoneNumberError(false);
              setPhoneNumberErrorText('');
            }
          }}
          clearIcon={
            email.length > 0 ? require('../../../assets/close.png') : null
          }
          onPressClear={() => setPhoneNumber('')}
          keyboardType="phone-pad"
        />
      )}
      {isEmailSignIn && emailError ? (
        <Text style={styles.errorText}>{emailErrorText}</Text>
      ) : null}
      {!isEmailSignIn && phoneNumberError ? (
        <Text style={styles.errorText}>{phoneNumberErrorText}</Text>
      ) : null}
      {!isEmailSignIn && (
        <View style={{marginTop: 6}}>
          <Text style={[styles.descText, {fontSize: 12}]}>
            You may receive SMS notifications from us for security and login
            purposes.
          </Text>
        </View>
      )}
      <View style={{marginTop: 20}}>
        <ButtonComponent
          title="Next"
          onPress={handleNextScreen}
          loading={loading}
        />
      </View>
      <View style={{marginTop: 10}}>
        {isEmailSignIn ? (
          <ButtonComponent
            title="Sign up with mobile number"
            style={{
              backgroundColor: theme.loginBackground,
              borderWidth: 1,
              borderColor: theme.light,
            }}
            textStyle={{color: theme.text}}
            onPress={handleSignUpMethodChange}
          />
        ) : (
          <ButtonComponent
            title="Sign up with email address"
            style={{
              backgroundColor: theme.loginBackground,
              borderWidth: 1,
              borderColor: theme.light,
            }}
            textStyle={{color: theme.text}}
            onPress={handleSignUpMethodChange}
          />
        )}
      </View>
    </View>
  );
};

export default GetUserEmailOrPhoneCompo;
