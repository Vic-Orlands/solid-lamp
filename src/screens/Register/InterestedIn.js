import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import { DarkMode } from '../../config/DarkMode';
import RegNav from '../../components/RegNav';
import tw from 'twrnc';

const InterestedIn = () => {
	const navigation = useNavigation();
	const [ bgColor, setColor ] = useState('');
	const [ interestedIn, setInterestedIn ] = useState('');
	const themes = useContext(DarkMode);

	const nullField = !interestedIn;
	
	const handleInterest = (props) => {
		setInterestedIn(props);
		setColor('#CC0000');
	};

	const handleContinueRegistration = async () => {
		try {
			const savedUser = await AsyncStorage.getItem('userDetails');
			const currentUser = JSON.parse(savedUser) || [];

			currentUser[0].interested_in = interestedIn;
			await AsyncStorage.setItem('userDetails', JSON.stringify(currentUser));
			navigation.navigate('Country');
		} catch (error) {}
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center p-4` ]}>
			<RegNav Title="Interested In" />
			<View style={tw`flex-1 p-4`}>
				<View style={tw`mt-12`} />
				<View style={tw`flex items-center pt-4`}>
					<TouchableOpacity
						style={[
							tw` w-72 px-3 py-4 rounded-xl text-center shadow`,
							interestedIn === 'Male'
								? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
								: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
						]}
						onPress={() => handleInterest('Male')}
					>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-black` ]}>Male</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`flex items-center pt-4`}>
					<TouchableOpacity
						style={[
							tw` w-72 px-3 py-4 rounded-xl text-center shadow`,
							interestedIn === 'Female'
								? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
								: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
						]}
						onPress={() => handleInterest('Female')}
					>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-black` ]}>Female</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`flex items-center pt-4`}>
					<TouchableOpacity
						style={[
							tw` w-72 px-3 py-4 rounded-xl text-center shadow`,
							interestedIn === 'Both'
								? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
								: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
						]}
						onPress={() => handleInterest('Both')}
					>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-black` ]}>Both</Text>
					</TouchableOpacity>
				</View>

				<View style={tw`mt-24`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						onPress={handleContinueRegistration}
						style={[
							tw`flex justify-center shadow items-center w-72 rounded-full py-3 `,
							{ backgroundColor: '#CC0000' }
						]}
						disabled={nullField}
					>
						<Text
							style={[
								{ fontFamily: 'Bold' },
								tw`text-white text-center text-base flex items-center text-xl`
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
export default InterestedIn;
