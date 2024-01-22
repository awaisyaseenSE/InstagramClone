import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '../../themes/ThemeContext';
import {shareLink} from '../../utils/deepLinking';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';

const ProfileUserTagsCompo = ({userID}) => {
  const {theme} = useTheme();
  const handleDeepLinking = async () => {
    try {
      await shareLink('userProfile', userID);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{alignItems: 'center'}}>
      <Text style={{color: theme.text, fontSize: 14, marginTop: 12}}>
        Profile User Tags Compo
      </Text>
      <ButtonComponent
        title="Share Profile"
        style={{width: '60%', marginTop: 20}}
        onPress={handleDeepLinking}
      />
    </View>
  );
};

export default ProfileUserTagsCompo;
