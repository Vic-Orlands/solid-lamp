//import liraries
import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import { DarkMode } from '../../config/DarkMode';
import RegNav from '../../components/RegNav';
import tw from 'twrnc';

// create a component
const Gender = () => {
	const navigation = useNavigation();
	const themes = useContext(DarkMode);
	const [ bgColor, setColor ] = useState('');
	const [ gender, setGender ] = useState('');

	const nullField = !gender;
	const handleSetGender = (props) => {
		setGender(props);
		setColor('#CC0000');
	};

	const handleContinueRegistration = async () => {
		try {
			// get local storage
			const savedUser = await AsyncStorage.getItem('userDetails');
			const currentUser = JSON.parse(savedUser) || [];

			currentUser[0].sex = gender;
			await AsyncStorage.setItem('userDetails', JSON.stringify(currentUser));
			navigation.navigate('InterestedIn');
		} catch (error) {}
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center px-4` ]}>
			<RegNav Title="Gender" />
			<View style={tw`flex-1 p-4`}>
				<View style={tw`mt-8`} />
				<View style={tw`flex items-center pt-4`}>
					<TouchableOpacity
						style={[
							tw` w-72 px-3 py-4 rounded-xl text-center shadow`,
							gender === 'Male'
								? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
								: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
						]}
						onPress={() => handleSetGender('Male')}
					>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-black` ]}>Male</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`flex items-center pt-4`}>
					<TouchableOpacity
						style={[
							tw` w-72 px-3 py-4 rounded-xl text-center shadow`,
							gender === 'Female'
								? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
								: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
						]}
						onPress={() => handleSetGender('Female')}
					>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-black` ]}>Female</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`flex items-center pt-4`}>
					<TouchableOpacity
						style={[
							tw` w-72 px-3 py-4 rounded-xl text-center shadow`,
							gender === 'Prefer Not to say'
								? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
								: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
						]}
						onPress={() => handleSetGender('Prefer Not to say')}
					>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-black` ]}>Prefer Not to say</Text>
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

export default Gender;
