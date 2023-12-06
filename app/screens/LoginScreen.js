import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';

export default function LoginScreen() {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  return (
    <>
      <ScreenComponent>
        <View style={styles.container}>
          <TouchableOpacity style={{paddingHorizontal: 20}}>
            <Image
              style={styles.iconBack}
              source={require('../assets/ic_back.png')}
            />
          </TouchableOpacity>

          <View style={styles.mainContainer}>
            <View style={{flex: 0.3}} />
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input]} placeholder="Email" />
              <TextInput style={[styles.input]} placeholder="Password" />
            </View>
            <View style={styles.fogotPassContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonStyle}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={styles.facebookIconStyle}
                source={require('../assets/facebook_Icon.png')}
              />
              <Text style={styles.facebookText}>Log in with Facebook</Text>
            </TouchableOpacity>
            <View style={styles.OrTextContainer}>
              <View style={styles.lineStyle} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.lineStyle} />
            </View>
            <View style={styles.createAccontContainer}>
              <Text style={styles.createAccountText}>
                Don’t have an account?
              </Text>
              <TouchableOpacity>
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>Instagram оr Facebook</Text>
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  iconBack: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    flex: 0.1,
    borderTopWidth: 1.2,
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.borderColor,
  },
  logo: {
    width: 182,
    height: 50,
    resizeMode: 'contain',
  },
  input: {
    backgroundColor: colors.borderColor,
    width: '90%',
    height: 36,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
    color: colors.lightBlack,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  fogotPassContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  forgotText: {
    fontSize: 12,
    color: colors.skyBlue,
    fontWeight: '500',
  },
  buttonStyle: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skyBlue,
    height: 44,
    borderRadius: 6,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonText: {
    fontSize: 14,
    color: colors.white,
  },
  facebookIconStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  facebookText: {
    fontSize: 14,
    color: colors.skyBlue,
    marginLeft: 12,
    fontWeight: '700',
  },
  lineStyle: {
    height: 1,
    backgroundColor: colors.borderColor,
    flex: 1,
  },
  OrTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 20,
  },
  orText: {
    fontSize: 14,
    color: colors.gray,
    marginHorizontal: 12,
    fontWeight: '700',
  },
  createAccontContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  signUpText: {
    fontSize: 14,
    color: colors.skyBlue,
    fontWeight: '500',
    marginLeft: 6,
  },
});
