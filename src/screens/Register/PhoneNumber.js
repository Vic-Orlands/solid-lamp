//import liraries
import React, { useState, createRef, useContext } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-number-input';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import RegNav from '../../components/RegNav';
import tw from 'twrnc';

// Import the functions you need from the SDKs you need
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { DarkMode } from '../../config/DarkMode';

// create a component
const PhoneNumber = () => {
	const [ info, setInfo ] = useState('');
	const navigation = useNavigation();
	const phoneInput = createRef(null);
	const [ phoneNumber, setPhoneNumber ] = useState();

	// setTheme
	const themes = useContext(DarkMode);

	// style the toast messages
	const { width } = Dimensions.get('window');
	const toastConfig = {
		success: (internalState) => (
			<View
				style={{
					height: 45,
					width: width - 20,
					marginTop: -15,
					zIndex: 2,
					backgroundColor: '#10873a',
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
		),
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

	const handleSignIn = async () => {
		setInfo('Loading...');
		await auth()
			.signInWithPhoneNumber(phoneNumber)
			.then((response) => {
				let obj = {
					phone_number: phoneNumber
				};
				const stringObj = JSON.stringify(obj);
				AsyncStorage.setItem('userDetails', stringObj);

				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Verification code has been sent to your phone'
				});

				// navigate to mobille verification page after toast message has displayed
				setTimeout(() => {
					navigation.navigate('MobileVerification', {
						verificationId: response
					});
				}, 2000);
			})
			.catch((error) => {
				const errorMessage = error.message.includes('auth/invalid-phone-number)')
					? 'Invalid phone number '
					: error.message.includes('Cancelled by user')
						? 'You cancelled the verification'
						: 'Oops!, too many trials. Try again later';

				Toast.show({
					type: 'error',
					position: 'top',
					text1: `Error: ${errorMessage}`
				});
			});
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center p-4` ]}>
			<RegNav Title="Mobile Number" />

			<Toast
				config={toastConfig}
				innerRef={(res) => {
					Toast.setRef(res);
				}}
			/>

			<View style={tw`flex-1 content-center items-center p-4`}>
				<View style={tw`mt-8`} />
				<View style={tw`flex items-center`}>
					<PhoneInput
						ref={phoneInput}
						defaultCode="NG"
						layout="first"
						onChangeText={() => setInfo('A one-time code will be sent to this number.')}
						onChangeFormattedText={setPhoneNumber}
						textContainerStyle={[
							tw` rounded-r-xl`,
							{ fontFamily: 'Regular', backgroundColor: '#F0E0E0' }
						]}
						containerStyle={[
							tw`rounded-xl shadow`,
							{ fontFamily: 'Regular', backgroundColor: '#F0E0E0', color: 'red' }
						]}
						withShadow
						autoFocus
					/>

					<Text
						style={[
							{ fontFamily: 'Light', color: themes.color },
							tw`pl-3 text-xs  flex items-center w-72 pt-4`
						]}
						onChange
					>
						{info}
					</Text>
				</View>

				<View style={tw`mt-24`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						disabled={!phoneNumber}
						onPress={handleSignIn}
						style={[
							tw`flex justify-center items-center w-72 rounded-full py-3 `,
							{ backgroundColor: '#CC0000' }
						]}
					>
						<Text
							style={[
								{ fontFamily: 'Bold' },
								tw`text-white text-center text-base flex items-center text-xl`
							]}
						>
							Proceed
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<FooterImg />
		</View>
	);
};

export default PhoneNumber;
