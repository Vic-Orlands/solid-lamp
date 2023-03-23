//import liraries
import React, { useState, useContext } from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import { DarkMode } from '../../config/DarkMode';
import RegNav from '../../components/RegNav';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';

// create a component
const Login = () => {
	const navigation = useNavigation();
	const [ email, setEmail ] = useState('');
	const themes = useContext(DarkMode);
	const [ password, setPassword ] = useState('');
	const [ loadingText, setLoadingText ] = useState('');

	const disable = !email || !password;

	const handleLogin = async () => {
		setLoadingText('Trying to Swipe...');
		setTimeout(() => {
			setLoadingText('');
		}, 3000);
		await auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Sign in Successful!',
					visibilityTime: 2000,
					autoHide: true
				});
				navigation.navigate('Drawers');
			})
			.catch((error) => {
				const errorMessage = error.message.includes('auth/wrong-password')
					? 'Wrong password'
					: error.message.includes('auth/user-not-found') ? 'User does not exist' : errorMessage;

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
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={[ { backgroundColor: themes.background }, tw`flex-1 items-center px-4` ]}
		>
			<Toast
				config={toastConfig}
				innerRef={(res) => {
					Toast.setRef(res);
				}}
			/>

			<View style={[ tw`flex-1 p-4` ]}>
				<View style={{ zIndex: -3 }}>
					<RegNav Title="Email Login" />
				</View>
				<View style={tw`mt-18`} />
				<View style={tw`flex`}>
					<TextInput
						placeholder="Enter email address"
						value={email}
						keyboardType="email-address"
						onChangeText={(text) => setEmail(text)}
						style={[
							tw` w-80 px-3 py-3 mb-6 rounded-xl text-center shadow`,
							{ backgroundColor: '#F0E0E0', fontFamily: 'Regular' }
						]}
						autoComplete="email"
					/>

					<TextInput
						placeholder="Enter password"
						value={password}
						secureTextEntry={true}
						keyboardType="default"
						style={[
							tw` w-80 px-3 py-3 mb-4 rounded-xl text-center shadow`,
							{ backgroundColor: '#F0E0E0', fontFamily: 'Regular' }
						]}
						onChangeText={(text) => setPassword(text)}
						autoComplete="password"
					/>
				</View>
				<Text style={[ { fontFamily: 'Light', color: themes.color }, tw`text-base text-center my-3` ]}>
					{loadingText}
				</Text>
				<View style={tw`mt-8`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						disabled={disable}
						onPress={handleLogin}
						style={[
							tw`flex justify-center shadow items-center w-80 rounded-full py-3 `,
							{ backgroundColor: '#CC0000', zIndex: 9999 }
						]}
					>
						<Text
							style={[
								{ fontFamily: 'Bold' },
								tw`text-white text-center  text-base flex items-center text-xl`
							]}
						>
							Login
						</Text>
					</TouchableOpacity>
				</View>
				<Pressable onPress={() => navigation.navigate('RecoverScreen')}>
					<Text style={[ { fontFamily: 'Bold', color: themes.color }, tw`text-center  text-base mt-12` ]}>
						Forgotten Password?
					</Text>
				</Pressable>
			</View>
			<FooterImg />
		</KeyboardAvoidingView>
	);
};

//make this component available to the app
export default Login;
