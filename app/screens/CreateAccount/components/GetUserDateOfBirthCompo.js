import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../styles/colors';
import TextInputSignUpCompo from './TextInputSignUpCompo';
import ButtonComponent from './ButtonComponent';
import ShowDateBirthComopent from './ShowDateBirthComopent';

const GetUserDateOfBirthCompo = ({
  dateOfBirth,
  setDateOfBirth,
  selectedIndex,
  setSelectedIndex,
  loading,
  setLoading,
}) => {
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [dateOfBirthErrorText, setDateOfBirthErrorText] = useState('');

  const handleNextScreen = () => {
    //   if (fullName == '') {
    //     setFullNameError(true);
    //     setFullNameErrorText('Full Name is required!');
    //     return null;
    //   } else {
    //     setFullNameError(false);
    //     setFullNameErrorText('');
    //   }
    //   setSelectedIndex(selectedIndex + 1);
  };
  return (
    <View>
      <Text style={styles.heading}>What's your date of birth?</Text>
      <Text style={styles.descText}>
        Use your own date of birth, even if this account is for a business, a
        pet or something else. No one will see this unless you choose to share
        it.
      </Text>
      <ShowDateBirthComopent
        label="Date of birth"
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
      />
      <View style={{marginTop: 20}}>
        <ButtonComponent title="Next" onPress={handleNextScreen} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    color: colors.black,
    fontWeight: '700',
    marginBottom: 18,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 6,
    paddingLeft: 6,
  },
  descText: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 14,
  },
});

export default GetUserDateOfBirthCompo;
