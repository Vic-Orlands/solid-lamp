//import liraries
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {DarkMode} from '../config/DarkMode';
import * as image from './Images';
import tw from 'twrnc';

// create a component
const Header = ({activeHome, activeLikes}) => {
  const navigation = useNavigation();
  const themes = useContext(DarkMode);
  const [color, setColor] = useState(themes.color);

  useEffect(() => {
    if (themes.color === 'dark' || themes.color === '#202124') {
      setColor('#cc0000');
    } else {
      setColor(themes.color);
    }
  });

  return (
    <View
      style={[styles.flex, {zIndex: 10}, tw`px-6 flex-row items-center pt-3`]}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <AntDesign name="menu-unfold" size={26} color={color} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Feeds');
        }}
        style={activeHome}>
        <Image
          source={
            themes.color === 'dark' || themes.color === '#202124'
              ? image.splash
              : image.love_white
          }
          style={tw`h-6 w-6`}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Likes');
        }}
        style={activeLikes}>
        <AntDesign name="star" size={26} color={color} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Messages');
        }}>
        <AntDesign name="message1" size={26} color={color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    justifyContent: 'space-between',
  },
});

//make this component available to the app
export default Header;
