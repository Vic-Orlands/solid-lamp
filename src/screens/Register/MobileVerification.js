//import liraries
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import FooterImg from '../../components/FooterImg';
import RegNav from '../../components/RegNav';
import Toast from 'react-native-toast-message';
import { DarkMode } from '../../config/DarkMode';

// create a component
const MobileVerification = ({ route }) => {
	const navigation = useNavigation();
	const { verificationId } = route.params;
	const themes = useContext(DarkMode);
	const [ disable, setDisable ] = useState(true);
	const [ verificationCode, setVerificationCode ] = useState();

	// sets touchable opacity button to clickable when there's an input in the text area
	const setInfo = () => setDisable(false);

	// function to handle signing in...
	// it verifies the id of the captcha and the code sent to your mobile device and signs the user in on successful verification
	const handleConfirmOtp = async () => {
		await verificationId
			.confirm(verificationCode)
			.then((res) => {
				navigation.navigate('PhoneSuccess');
			})
			.catch((error) => {
				if (error.message.includes('auth/session-expired')) {
					navigation.navigate('PhoneSuccess');
				} else {
					Toast.show({
						type: 'error',
						position: 'top',
						text1: `Error: Invalid or Wrong Otp`
					});
				}
			});
	};

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

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center px-4` ]}>
			<RegNav Title="Verification Code" />

			<View style={tw`flex-1 content-center items-center p-4`}>
				<Toast
					config={toastConfig}
					refs={(ref) => {
						Toast.setRef(ref);
					}}
				/>
				<View style={tw`mt-8`} />
				<View style={tw`flex items-center`}>
					<TextInput
						placeholder="Enter  Code"
						keyboardType="email-address"
						style={[
							tw` w-72 px-3 py-3 rounded-xl text-center shadow`,
							{ fontFamily: 'Regular', backgroundColor: '#F0E0E0', zIndex: -3 }
						]}
						editable={!!verificationId}
						onChangeText={setVerificationCode}
						onTextInput={setInfo}
						autoComplete="sms-otp"
					/>
					<Text
						style={[ { fontFamily: 'Light', color: themes.color }, tw`pl-3  flex items-center w-72 pt-2` ]}
					>
						Please enter the verification code that was sent to your phone.
					</Text>
				</View>

				<View style={tw`mt-24`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						disabled={disable}
						onPress={handleConfirmOtp}
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
							Verify
						</Text>
					</TouchableOpacity>

					<View style={tw`pt-24`} />
					<View>
						<Text
							style={[ { fontFamily: 'Regular', color: themes.color }, tw`pl-3 flex items-center pt-2` ]}
						>
							Didn’t receive any code?
						</Text>
					</View>
					<View>
						<Pressable>
							<Text
								style={[
									{ fontFamily: 'Bold', color: themes.color },
									tw`pl-3 flex items-center text-base underline pt-2`
								]}
							>
								RESEND
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
			<FooterImg />
		</View>
	);
};

//make this component available to the app
export default MobileVerification;
