//import liraries
import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import { DarkMode } from '../../config/DarkMode';
import RegNav from '../../components/RegNav';
import tw from 'twrnc';
import CountryPicker from 'react-native-country-picker-modal';

// create a component
const Country = () => {
	const navigation = useNavigation();
	const themes = useContext(DarkMode);
	const [ countryCode, setCountryCode ] = useState('GH');
	const [ ChangeCountry, onChangeCountry ] = useState('');

	const nullField = !ChangeCountry;

	const handleContinueRegistration = async () => {
		try {
			// get local storage
			const savedUser = await AsyncStorage.getItem('userDetails');
			const currentUser = JSON.parse(savedUser) || [];

			currentUser[0].country = ChangeCountry;
			currentUser[0].countryCode = countryCode;
			await AsyncStorage.setItem('userDetails', JSON.stringify(currentUser));
			navigation.navigate('ChoosePhoto');
		} catch (error) {}
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center px-4` ]}>
			<RegNav Title="Country" />
			<View style={tw`flex-1 p-4`}>
				<View style={tw`mt-12`} />
				<Text style={[ { fontFamily: 'Regular' }, tw`  text-black   pb-2` ]}>Select your Nationality?.</Text>
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						style={[ tw` w-72 px-3 py-4 rounded-xl text-center shadow`, { backgroundColor: '#F0E0E0' } ]}
					>
						<CountryPicker
							withEmoji={true}
							countryCode={countryCode}
							withCountryNameButton
							onSelect={(country) => {
								onChangeCountry(country.name);
								setCountryCode(country.cca2);
							}}
						/>
					</TouchableOpacity>
				</View>

				<View style={tw`mt-24`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						disabled={nullField}
						onPress={handleContinueRegistration}
						style={[
							tw`flex justify-center shadow items-center w-72 rounded-full py-3 `,
							{ backgroundColor: '#CC0000' }
						]}
					>
						<Text
							style={[
								{ fontFamily: 'Bold' },
								tw`text-white text-center  text-base flex items-center text-xl`
							]}
						>
							Continue
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<FooterImg />
		</View>
	);
};

//make this component available to the app
export default Country;
