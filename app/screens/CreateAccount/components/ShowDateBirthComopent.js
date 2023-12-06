import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../styles/colors';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const ShowDateBirthComopent = ({
  label = '',
  dateOfBirth = '',
  setDateOfBirth,
}) => {
  const [openDateModal, setOpenDateModal] = useState(false);
  const [calulatedAge, setCalulatedAge] = useState(0);
  const toggleOpenDateModal = () => {
    setOpenDateModal(!openDateModal);
  };
  const handleCalculateDate = dateOfBirth => {
    if (dateOfBirth !== '') {
      //calculate month difference from current date in time
      var month_diff = Date.now() - dateOfBirth.getTime();

      //convert the calculated difference in date format
      var age_dt = new Date(month_diff);

      //extract year from date
      var year = age_dt.getUTCFullYear();

      //now calculate the age of the user
      var age = Math.abs(year - 1970);
      setCalulatedAge(age);
    }
  };
  return (
    <View style={styles.inputContainer}>
      <View style={{flex: 1}}>
        <Text style={styles.labelStyle}>
          {label} ({calulatedAge} year old)
        </Text>
        <TouchableOpacity
          onPress={toggleOpenDateModal}
          style={styles.datePickerContainer}>
          {dateOfBirth == '' && <Text>Select Date of Birth</Text>}
          <TextInput
            editable={false}
            value={
              dateOfBirth !== ''
                ? moment(dateOfBirth).format('LL')
                : dateOfBirth
            }
          />
          <Image
            source={require('../../../assets/ic_datepicker.png')}
            style={styles.datePickerIcon}
          />
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={openDateModal}
          date={new Date()}
          maximumDate={new Date()}
          minimumDate={new Date('1920-12-10')}
          onConfirm={date => {
            setDateOfBirth(date);
            handleCalculateDate(date);
            setOpenDateModal(false);
          }}
          onCancel={() => setOpenDateModal(false)}
        />
      </View>
      <View style={styles.inputMainContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.signUpBordercolor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.signUpInput,
    flexDirection: 'row',
  },
  input: {
    paddingVertical: 4,
    fontSize: 14,
    color: colors.black,
    paddingRight: 6,
  },
  inputMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelStyle: {
    fontSize: 14,
    color: colors.signUpBordercolor,
    fontWeight: '500',
  },
  datePickerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
});

export default ShowDateBirthComopent;
