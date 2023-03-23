import React, { Fragment, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DarkMode } from '../config/DarkMode';

export default function RegNav({ Title, OpenMenu }) {
	const navigation = useNavigation();
	const themes = useContext(DarkMode);

	return (
		<Fragment>
			<View style={[tw` flex-row items-center pt-6 px-2`]}>
				<View>
					<TouchableOpacity onPress={() => navigation.goBack(null)}>
						<Ionicons name="chevron-back" size={30} color={themes.color === "dark" || themes.color === "#202124" ? "#cc0000" : themes.color} />
					</TouchableOpacity>
				</View>

				<View style={tw`flex-grow`}>
					<Text style={[{ fontFamily: 'Bold', color: themes.color }, tw` text-center mr-3 text-3xl`]}>
						{Title}
					</Text>
				</View>
			</View>
		</Fragment>
	);
}
