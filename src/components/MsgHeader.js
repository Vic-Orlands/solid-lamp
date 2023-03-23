import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import * as image from './Images'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { DarkMode } from '../config/DarkMode';

const MsgHeader = () => {
	const navigation = useNavigation();

	// setTheme
	const themes = useContext(DarkMode)

	return (
		<View style={[styles.flex, tw`px-6 flex-row items-center pt-3`]}>
			<TouchableOpacity onPress={() => navigation.goBack(null)}>
				<Ionicons name="chevron-back" size={30} color={themes.color === "dark" || themes.color === "#202124" ? "#cc0000" :  themes.color}  />
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					navigation.navigate('Feeds');
				}}
			>
				<Image source={themes.color === "dark" || themes.color === "#202124" ? image.splash : image.love_white} style={tw`h-6 w-6`} />
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.openDrawer()}>
				<AntDesign name="menu-unfold" size={26} color={themes.color === "dark" || themes.color === "#202124" ? "#cc0000" :  themes.color} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	flex: {
		justifyContent: 'space-between'
	}
});

export default MsgHeader;
