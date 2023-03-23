//import liraries
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { DarkMode } from '../../config/DarkMode';

// create a component
const AlmostDone = () => {
	const navigation = useNavigation();

	useEffect(() => {
		setTimeout(() => {
			navigation.navigate('Passion');
		}, 1000);
	});

	// setTheme
	const themes = useContext(DarkMode);

	return (
		<View style={[ styles.container, { backgroundColor: themes.background } ]}>
			<Pressable onPress={() => navigation.navigate('Passion')}>
				<Text style={[ { fontFamily: 'Bold', color: themes.color }, tw` text-2xl` ]}>You're Almost Done</Text>
			</Pressable>
		</View>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

//make this component available to the app
export default AlmostDone;
