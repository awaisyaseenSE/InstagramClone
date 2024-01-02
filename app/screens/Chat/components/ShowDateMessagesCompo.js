import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import moment from 'moment';
import {useTheme} from '../../../themes/ThemeContext';

const ShowDateMessagesCompo = ({date}) => {
  var dateOfMsg = moment(date).month(moment(date).month()).format('ddd, DD/MM');

  const today = new Date();
  if (today.toDateString() === date.toDateString()) {
    dateOfMsg = 'Today';
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    dateOfMsg = 'Yesterday';
  }
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.messageDateStyle, {color: theme.gray}]}>
        {dateOfMsg}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  messageDateStyle: {
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 12,
    color: colors.gray,
    fontSize: 12,
  },
});

export default ShowDateMessagesCompo;
