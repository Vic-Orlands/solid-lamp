import React, { useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Text, Linking, View, Image, Pressable, Dimensions } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as image from '../../components/Images'
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/AppLoading';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import Reuse from '../../components/Reuse';
import tw from 'twrnc';

const Facebook = () => {
	return <AntDesign name="facebook-square" size={24} color="#3b5998" />;
};
const Google = () => {
	return <AntDesign name="google" size={24} color="#DB4437" />;
};
const Phone = () => {
	return <MaterialIcons name="call" size={24} color="#DB4437" />;
};

const Email = () => {
	return <MaterialIcons name="email" size={24} color="#CC0000" />;
};

const HomeScreen = () => {
	const navigation = useNavigation();
	const [ load, setLoad ] = useState(true);

	useEffect(
		() => {
			setTimeout(() => {
				setLoad(false);
			}, 4000);
		},
		[ load ]
	);

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

	// Google sign in
	const googleSignIn = async () => {
		const { idToken } = await GoogleSignin.signIn();
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);
		await auth()
			.signInWithCredential(googleCredential)
			.then((res) => {
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Login successful!',
					visibilityTime: 1000,
					autoHide: true
				});

				setTimeout(() => {
					navigation.navigate('DobInput');
				}, 1000);
			})
			.catch((error) => {
				if (error.code === statusCodes.SIGN_IN_CANCELLED) {
					// user cancelled the login flow
					console.log('Cancel');
				} else if (error.code === statusCodes.IN_PROGRESS) {
					// operation (f.e. sign in) is in progress already
					console.log('Signin in progress');
				} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
					// play services not available or outdated
					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Google services not available!',
						visibilityTime: 2000,
						autoHide: true
					});
				} else {
					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Error logging in with Google!',
						visibilityTime: 2000,
						autoHide: true
					});
				}
			});
	};

	//facebook signin
	const facebookSignIn = async () => {
		// Attempt login with permissions
		const result = await LoginManager.logInWithPermissions([ 'public_profile', 'email' ]);
		if (result.isCancelled) {
			console.log('User cancelled the login process');
		}

		// Once signed in, get the users AccessToken
		const data = await AccessToken.getCurrentAccessToken();
		if (!data) {
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Error logging in with Facebook!',
				visibilityTime: 2000,
				autoHide: true
			});
		}

		// Create a Firebase credential with the AccessToken
		const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
		Toast.show({
			type: 'success',
			position: 'top',
			text1: 'Login successful!',
			visibilityTime: 1000,
			autoHide: true
		});
		return auth().signInWithCredential(facebookCredential);
	};

	const openSettings = async () => {
		await Linking.openSettings();
	};

	const openTerms = async () => {
		await Linking.openURL('https://policy.loveafrica.app/terms');
	};

	return (
		<React.Fragment>
			{load ? (
				<React.Fragment>
					<Loading />
				</React.Fragment>
			) : (
				<Animated.View style={tw`h-full flex-1`} entering={FadeInDown}>
					<Toast
						config={toastConfig}
						refs={(innerRefs) => {
							Toast.setRef(innerRefs);
						}}
					/>

					<View style={tw` h-full flex-1 items-center`}>
						<View style={tw`mt-20`} />
						<Image
							source={image.love_text_black}
							style={{ width: 250, height: 100, resizeMode: 'contain', zIndex: -3 }}
						/>
						<View style={tw`mt-12`} />
						<View style={[ tw`rounded-t-3xl w-full h-full`, { backgroundColor: '#CC0000' } ]}>
							<View style={tw`mt-6 flex justify-center`}>
								<Text style={[ { fontFamily: 'Bold' }, tw` text-3xl text-white text-center` ]}>
									Sign In
								</Text>
								{/* USer sign In */}
								<View style={tw`mt-8 flex justify-center items-center`}>
									{/* Phone reg */}
									<Reuse
										text="Sign up with Phone Number"
										iconText={<Phone />}
										linkTo={() => navigation.navigate('Phone')}
									/>

									{/* Google reg */}
									<Reuse
										text="Sign in with Google"
										iconText={<Google style={tw`text-left`} />}
										linkTo={googleSignIn}
									/>

									{/* Facebook Sign in/ Log in */}
									<Reuse
										text="Sign in with Facebook"
										iconText={<Facebook style={tw`text-left`} />}
										linkTo={facebookSignIn}
									/>

									<View style={tw`my-6  w-full border border-white/50`} />

									<Reuse
										text="Login with Email"
										iconText={<Email style={tw`text-left`} />}
										linkTo={() => navigation.navigate('Login')}
									/>
								</View>

								<View style={tw`mt-4 w-full border border-white/50`} />
								<View style={tw`pt-6`}>
									<Text style={[ { fontFamily: 'Bold' }, tw`text-white max-w-sm text-center px-4 ` ]}>
										By signing in, you have read and agreed with our
									</Text>
									<View>
										<Pressable onPress={openTerms}>
											<Text style={[ { fontFamily: 'Bold' }, tw`text-center  text-blue-200` ]}>
												Terms and condition
											</Text>
										</Pressable>
									</View>
								</View>
							</View>
						</View>
					</View>
				</Animated.View>
			)}
		</React.Fragment>
	);
};

export default HomeScreen;
