import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '../../themes/ThemeContext';

const ProfileUserTagsCompo = () => {
  const {theme} = useTheme();
  return (
    <View style={{alignItems: 'center'}}>
      <Text style={{color: theme.text, fontSize: 14, marginTop: 12}}>
        Profile User Tags Compo
      </Text>
    </View>
  );
};

export default ProfileUserTagsCompo;
