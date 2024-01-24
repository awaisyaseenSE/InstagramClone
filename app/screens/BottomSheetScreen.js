import {View, Text, StyleSheet, Modal} from 'react-native';
import React, {useState} from 'react';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../themes/ThemeContext';
import ScreenComponent from '../components/ScreenComponent';
import ButtonComponent from './CreateAccount/components/ButtonComponent';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function BottomSheetScreen() {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => {
    setOpenModal(true);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Bottom Sheet Screen"
          onPress={() => navigation.goBack()}
        />
        <View style={{alignItems: 'center', marginTop: 12, flex: 1}}>
          <ButtonComponent
            style={{width: '50%', borderRadius: 8}}
            title="Open Modal"
            onPress={handleModal}
          />
        </View>
        {/* {!!openModal && <BottomSheetComponent setOpenModal={setOpenModal} />} */}
        <Modal visible={openModal} style={{flex: 1}} transparent>
          <BottomSheetComponent setOpenModal={setOpenModal} />
        </Modal>
      </ScreenComponent>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  containerHeadline: {
    fontSize: 14,
    fontWeight: '600',
  },
});
