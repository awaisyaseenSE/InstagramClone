import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import AuthsContext from '../auth/AuthsContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import NavigationService from './NavigationService';

function MainNavigator(props) {
  const [user, setUser] = useState(null);

  const checkUser = () => {
    if (
      auth().currentUser?.emailVerified !== null &&
      auth().currentUser?.emailVerified !== undefined &&
      auth().currentUser?.emailVerified !== false
    ) {
      setUser(auth().currentUser);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthsContext.Provider value={{user, setUser}}>
      <NavigationContainer
        ref={ref => NavigationService.setTopLevelNavigator(ref)}>
        {/* {user !== null ? <AppNavigator /> : <AuthNavigator />} */}
        {auth().currentUser?.emailVerified ||
        auth()?.currentUser?.phoneNumber ? (
          <AppNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </AuthsContext.Provider>
  );
}

export default MainNavigator;
