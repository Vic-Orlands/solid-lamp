//import liraries
import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';
import RegNav from '../../components/RegNav';
import { DarkMode } from '../../config/DarkMode';

const EmailRecover = () => {
	const navigation = useNavigation();
	const [ info, setInfo ] = useState('');
	const [ email, setEmail ] = useState('');

	const disable = !email;

	// setTheme
	const themes = useContext(DarkMode);

	const setTheinfo = () => {
		setInfo('You will receive an email to continue your account recovery.');
	};

	const sendRecoveryEmail = async () => {
		await auth()
			.sendPasswordResetEmail(email)
			.then((response) => {
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Please check your email',
					visibilityTime: 3000,
					autoHide: true
				});
				navigation.navigate('EmailSent');
			})
			.catch((error) => {
				const errorMessage = error.code.includes('auth/user-not-found')
					? 'User does not exist'
					: error.code.replace(/\bauth\b/g, '').replace(/[^\w\s]/gi, ' ');
				Toast.show({
					type: 'error',
					position: 'top',
					text1: `Error Message: ${errorMessage}`,
					visibilityTime: 3000,
					autoHide: true
				});
			});
	};

	// style the toast messages
	const { width } = Dimensions.get('window');
	const toastConfig = {
		error: (internalState) => (
			<View
				style={{
					height: 45,
					width: width - 20,
					marginTop: 0,
					zIndex: 2,
					backgroundColor: '#CC0000',
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					borderWidth: 1,
					borderColor: '#ccc',
					borderRadius: 15
				}}
			>
				<Text style={{ fontSize: 14, color: '#fff' }}>{internalState.text1}</Text>
			</View>
		)
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center p-4` ]}>
			<View style={[ tw``, { zIndex: -3 } ]}>
				<RegNav Title="Account Recovery" />
			</View>
			<Toast
				config={toastConfig}
				refs={(ref) => {
					Toast.setRef(ref);
				}}
			/>

			<View style={tw`flex-1 content-center items-center p-4 `}>
				<View style={tw`flex items-center `}>
					<TextInput
						placeholder="Enter email address"
						value={email}
						keyboardType="email-address"
						onTextInput={setTheinfo}
						onChangeText={setEmail}
						style={[
							tw` w-80 px-3 py-3 mt-12 mb-2 rounded-xl text-center max-w-72 shadow`,
							{ backgroundColor: '#F0E0E0', fontFamily: 'Regular' }
						]}
						autoComplete="email"
					/>
					<Text style={[ { color: themes.color, fontFamily: 'Light' }, tw`pl-3 flex items-center w-72` ]}>
						{info}
					</Text>
				</View>

				<View style={tw`mt-24`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						disabled={disable}
						onPress={sendRecoveryEmail}
						style={[
							tw`flex justify-center items-center w-72 rounded-full py-4 `,
							{ backgroundColor: '#CC0000' }
						]}
					>
						<Text style={[ { fontFamily: 'Bold' }, tw`text-white text-center text-xl flex items-center` ]}>
							Send Email Link
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<FooterImg />
		</View>
	);
};

export default EmailRecover;
