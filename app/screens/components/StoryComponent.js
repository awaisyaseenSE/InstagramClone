import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import React from 'react';
import StoriesData from '../../dummyData/StoriesData';
import fontFamily from '../../styles/fontFamily';
import FastImage from 'react-native-fast-image';
import {useTheme} from '../../themes/ThemeContext';
const StoryComponent = () => {
  const {theme} = useTheme();
  const storyData = StoriesData.allStories;

  const renderItem = ({item}) => {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.imageContainer,
            {borderColor: theme.storyBg, backgroundColor: theme.background},
          ]}>
          <TouchableOpacity style={styles}>
            <FastImage
              source={{uri: item.imageUrl}}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.text, {color: theme.text}]}>{item.userName}</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 0.2,
        borderBottomColor: theme.bottonTabBorderColor,
      }}>
      <FlatList
        data={storyData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 6,
  },
  imageContainer: {
    width: 62,
    height: 62,
    borderRadius: 62 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Platform.OS === 'android' ? 1.2 : 2,
  },
  imageStyle: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
  },
  text: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
});

export default StoryComponent;
