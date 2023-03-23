//import liraries
import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FooterImg from '../../components/FooterImg';
import tw from 'twrnc';

const CheckMark = () => {
	return <Ionicons name="checkmark" size={150} color="black" />;
};

// create a component
const EmailSent = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<View style={tw`flex-1 items-center p-4`}>
				<View style={tw`flex-1 content-center items-center p-4`}>
					<View style={tw`pt-2`}>
						<Text style={tw`font-bold text-3xl text-center pb-4`}> Email Sent</Text>
					</View>
					<View style={tw`mt-2`} />
					<View style={tw`flex items-center`}>
						<CheckMark />
						<Text style={[ tw`pl-3 flex text-center w-72 pt-2 pb-4`, { lineHeight: 20 } ]}>
							You will receive an email to continue your account recovery.
						</Text>
						<TouchableOpacity
							onPress={() => navigation.navigate('Login')}
							style={[
								tw`flex justify-center items-center w-72 rounded-full py-4 `,
								{ backgroundColor: '#CC0000' }
							]}
						>
							<Text style={tw`text-white text-center font-bold text-base flex items-center`}>
								Go to Sign in
							</Text>
						</TouchableOpacity>
						<View style={tw`pt-24`} />
						<Text style={tw`text-xl`}>Didnt’t receive any email ?</Text>

						<View style={tw`pt-4`} />
						<Pressable onPress={() => navigation.navigate('EmailRecover')}>
							<Text style={[ tw`text-base font-bold`, { color: '#CC0000' } ]}>
								Try Again with different email.
							</Text>
						</Pressable>
					</View>

					<View style={tw`mt-24`} />
				</View>
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
		alignItems: 'center'
	}
});

//make this component available to the app
export default EmailSent;
