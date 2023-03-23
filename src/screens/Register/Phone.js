import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import RegNav from '../../components/RegNav';
import { DarkMode } from '../../config/DarkMode';
import { EventRegister } from 'react-native-event-listeners';

// create a component
const Phone = () => {
	const navigation = useNavigation();
	// setTheme
	const themes = useContext(DarkMode)

	return (
		<View style={[{ backgroundColor: themes.background }, tw`flex-1 items-center`]}>
			<RegNav Title="Phone Verification" />

			<View style={tw`flex-1 content-center items-center p-4`}>
				<View style={tw`pt-2`} />
				<View style={tw`flex justify-center items-center`}>
					<Text style={[{ fontFamily: 'Regular', color: themes.color }, tw`text-base  max-w-xs px-4 pt-8 pb-4`]}>
						LOVEAFRICA needs you to verify your identity. Please enter your phone number to receive a text
						message with a verification code.
					</Text>

				</View>
				<View style={tw`mt-24`} />
				<Text style={[{ fontFamily: 'Light', color: themes.color }, tw`max-w-xs text-xs pb-12 opacity-50`]}>
					Your Number will not be shared with anyone.
				</Text>
				<View style={tw` flex justify-center items-center`}>
					<TouchableOpacity
						onPress={() => navigation.navigate('PhoneNumber')}
						style={[
							tw`flex justify-center items-center w-72 rounded-full py-4 `,
							{ backgroundColor: '#CC0000' }
						]}
					>
						<Text
							style={[{ fontFamily: 'Bold' }, tw`text-white text-center  text-base flex items-center`]}
						>
							Verify Now
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View>
				<FooterImg />
			</View>
		</View>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2c3e50'
	}
});

//make this component available to the app
export default Phone;
