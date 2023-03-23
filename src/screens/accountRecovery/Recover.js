//import liraries
import React, { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import tw from 'twrnc';
import RegNav from '../../components/RegNav';
import { DarkMode } from '../../config/DarkMode';

const Email = () => {
	return <MaterialIcons name="email" size={24} color="white" />;
};

const Recover = () => {
	const navigation = useNavigation();


	// setTheme
	const themes = useContext(DarkMode)

	return (
		<View style={[{ backgroundColor: themes.background }, tw`w-full flex-1 items-center`]}>
			{/* <View style={tw`flex  w-full justify-center itmes-center`}> */}
			<RegNav Title="Account Recovery" />
			{/* </View> */}
			<View style={tw`flex-1 content-center items-center p-4`}>
				<View style={tw`flex justify-center items-center mt-4`}>
					<Text style={[{ color: themes.color, fontFamily: "Regular" }, tw`text-base `]}>Unable to access your account?</Text>
					<Text style={[{ color: themes.color, fontFamily: "Regular" }, tw`pt-6 text-base max-w-md`]}>
						Click recover with email below to get help retrieving your account.
					</Text>
				</View>
				<View style={tw`mt-24`} />
				<View style={tw`mt-12 flex justify-center items-center`}>
					<TouchableOpacity
						onPress={() => navigation.navigate('EmailRecover')}
						style={[
							tw`flex-row justify-center  items-center w-72 rounded-full py-4 `,
							{ backgroundColor: '#CC0000' }
						]}
					>
						<Text><Email style={tw`text-left pt-2`} /></Text>
						<Text style={[{ fontFamily: "Bold" }, tw`text-white pl-2 text-center  text-xl flex items-center`]}>
							Recover with Email
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

export default Recover;
