import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';

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

export default styles;
