//import liraries
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, PermissionsAndroid, Linking, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import FooterImg from '../../components/FooterImg';
import Toast from 'react-native-toast-message';
import { DarkMode } from '../../config/DarkMode';
import useAuth from '../../auth/useAuth';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';

// create a component
const Passion = () => {
	const { user } = useAuth();
	const [ Modals ] = useState(true);
	const navigation = useNavigation();
	const themes = useContext(DarkMode);
	const [ bgColor, setColor ] = useState('');
	const [ passion, setPassion ] = useState([]);

	useEffect(() => {
		async function requestLocationPermission() {
			try {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
					title: 'LoveAfrica',
					message: 'LoveAfrica Needs access to your device Location',
					// buttonNeutral: "Ask Me Later",
					buttonNegative: 'Cancel',
					buttonPositive: 'Allow'
				});

				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					// console.log('you can use the location');
					// Linking.openSettings()
				} else {
					// console.log('Permission denied');
					Alert.alert('GPS', 'Ensure your GPS is turned on', [
						{
							text: 'Cancel',
							onPress: () => navigation.navigate('Home'),
							style: 'cancel'
						},
						{ text: 'OK', onPress: () => Linking.openSettings() }
					]);
				}
			} catch (err) {
				console.log(err);
			}
		}
		requestLocationPermission();
	});

	const handlePassion = (props) => {
		if (passion.includes(props)) {
			Toast.show({
				type: 'success',
				position: 'top',
				text1: `${props} has been removed 😔. Add one more!`,
				visibilityTime: 2000,
				autoHide: true
			});

			let propIndex = passion.indexOf(props);
			passion.splice(propIndex, 1);
		} else if (passion.length === 5) {
			Toast.show({
				type: 'success',
				position: 'top',
				text1: 'You can select only five hobbies!',
				visibilityTime: 2000,
				autoHide: true
			});
		} else {
			setPassion((otherPassions) => [ ...otherPassions, `${props}` ]);
			setColor('#CC0000');
		}
	};

	const handleRegistration = async () => {
		const savedUser = await AsyncStorage.getItem('userDetails');
		const currentUser = JSON.parse(savedUser) || [];

		currentUser[0].id = user.uid;
		currentUser[0].hobbies = passion;
		currentUser[0].timeStamp = firestore.FieldValue.serverTimestamp();

		// convert the array to an object because setDoc only accepts objects
		const newObj = currentUser.reduce((obj, idx) => {
			return obj[idx];
		});


		

		await firestore()
			.collection('users')
			.doc(user.uid)
			.set(newObj)
			.then((response) => {
				console.log('profile created successfully');
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Registration completed successfully! 👍',
					visibilityTime: 2000,
					autoHide: true
				});
				AsyncStorage.setItem('loggedIn', JSON.stringify(response));
				setTimeout(() => {
					navigation.navigate('Drawers');
				}, 1000);
			})
			.catch((error) => {
				console.log(error);
				Toast.show({
					type: 'error',
					position: 'top',
					text1: error.code,
					visibilityTime: 2000,
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

	const Threes = () => {
		return (
			<View style={tw`flex-row mt-4`}>
				<TouchableOpacity
					style={[
						tw`mr-2 flex  rounded-full `,
						passion.includes('Board Games')
							? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
							: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
					]}
					onPress={() => handlePassion('Board Games')}
				>
					<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
						{' '}
						Board Games
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						tw`mr-2 flex  rounded-full`,
						passion.includes('Swimming')
							? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
							: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
					]}
					onPress={() => handlePassion('Swimming')}
				>
					<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>Swimming</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						tw`mr-2 flex  rounded-full `,
						passion.includes('Hiking')
							? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
							: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
					]}
					onPress={() => handlePassion('Hiking')}
				>
					<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>Hiking</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const [ modall, setModal ] = useState(false);

	const hide = {
		display: 'none',
		zIndex: 10
	};

	const show = {
		display: 'flex',
		flex: 1,
		zIndex: 99,
		position: 'absolute'
	};

	const mode = {
		opacity: 0.1,
		position: 'relative',
		display: 'none',
		zIndex: 10
	};

	const Modal = () => {
		return (
			<View style={[ tw`w-full  flex absolute h-full justify-center items-center px-6 ` ]}>
				<Animated.View
					style={[
						!modall
							? { ...hide }
							: ({ ...show },
								tw`flex   bg-white shadow justify-center items-center w-full rounded-lg py-4  z-99 `)
					]}
					entering={FadeIn.delay(100)}
					exiting={FadeOut.delay(100)}
				>
					<View style={tw`px-6`}>
						<Text
							style={[
								{ fontFamily: 'Bold' },
								tw`text-3xl text-black mt-4 text-center flex justify-center`
							]}
						>
							Done!
						</Text>
						<View style={tw`mt-8`}>
							<Text style={[ { fontFamily: 'Regular' }, tw`leading-6  text-xl text-center ` ]}>
								Your Profile has been created successfully!.
							</Text>
						</View>
						<View style={tw`flex-row justify-between mt-6 mb-4 items-center`}>
							<TouchableOpacity
								onPress={handleRegistration}
								style={[
									tw`flex mb-2 justify-center shadow items-center px-24 rounded-full mt-6 px-3   w-full py-3 `,
									{ backgroundColor: '#CC0000' }
								]}
							>
								<Text
									style={[
										{ fontFamily: 'Bold' },
										tw`text-white  w-full text-center text-base flex items-center text-xl`
									]}
								>
									Continue
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
			</View>
		);
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center p-4` ]}>
			{Modals && <Modal />}

			<View style={[ modall && { ...mode }, tw`mt-3   h-full` ]}>
				<Toast
					config={toastConfig}
					refs={(innerRefs) => {
						Toast.setRef(innerRefs);
					}}
				/>

				<ScrollView style={{ zIndex: -3 }}>
					<View style={tw`flex-1 `}>
						<View>
							<Text style={[ { fontFamily: 'Bold', color: themes.color }, tw` text-2xl pb-4` ]}>
								{' '}
								Passion
							</Text>
						</View>
						<View style={tw`px-4`}>
							<Text style={[ { fontFamily: 'Regular', color: themes.color }, tw`w-72` ]}>
								Let everyone know what you’re passionate about.{' '}
								<Text style={[ tw`opacity-25 text-xs`, { color: themes.color } ]}>(Choose Five).</Text>
							</Text>
						</View>
						<View style={[ tw`pt-8 rounded-xl` ]}>
							<Threes />

							<View style={tw`flex-row mt-4`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Tea')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Tea')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Tea
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Working out')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Working out')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Working out
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Astrology')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Astrology')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Astrology
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Cat')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Cat')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Cat
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Working')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Working')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Working
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Fishing')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Fishing')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Fishing
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Animals')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Animals')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Animals
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex rounded-full `,
										passion.includes('Comedy')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Comedy')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Comedy
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Drawings')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Drawings')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Drawings
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Blogging')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Blogging')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Blogging
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Vlogging')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Vlogging')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Vlogging
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Law')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Law')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Law
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Photography')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Photography')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Photography
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Excursion')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Excursion')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Excursion
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Travel')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Travel')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Travel
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Journaling')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Journaling')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Journaling
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Eating Healthy')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Eating Healthy')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Eating Healthy
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Spirituality')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Spirituality')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Spirituality
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('NetFlix')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('NetFlix')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										NetFlix
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Dance')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Dance')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Dance
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Sports')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Sports')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Sports
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Gamer')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Gamer')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Gamer
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Learning new skills')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Learning new skills')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Learning new skills
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Cleaning')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Cleaning')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Cleaning
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Cycling')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Cycling')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Cycling
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Knitting/crocheting')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Knitting/crocheting')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Knitting/crocheting
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Technology')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Technology')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Technology
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Yoga')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Yoga')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Yoga
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Snapchat')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Snapchat')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Snapchat
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Instagram')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Instagram')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Instagram
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Facebook')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Facebook')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Facebook
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Cooking')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Cooking')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Cooking
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Instrument')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Instrument')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Instrument
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Wine')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Wine')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Wine
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Painting')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Painting')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Painting
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Coffee')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Coffee')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Coffee
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Brunch')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Brunch')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Brunch
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Organizing')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Organizing')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Organizing
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Lunch')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Lunch')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Lunch
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Volunteering')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Volunteering')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Volunteering
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Self Care')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Self Care')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Self Care
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Shopping')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Shopping')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Shopping
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Politics')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Politics')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Politics
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Finance')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Finance')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Finance
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Reading')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Reading')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Reading
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Museum')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Museum')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Museum
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Entrepreneurship')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Entrepreneurship')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Entrepreneurship
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Writing')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Writing')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Writing
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Self Defense')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Self Defense')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Self Defense
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Running')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Running')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Running
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Designing')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Designing')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Designing
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Dinner')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Dinner')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Dinner
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Medicine')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Medicine')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Medicine
									</Text>
								</TouchableOpacity>
							</View>

							<View style={tw`mt-3 flex-row`}>
								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Sleeping')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Sleeping')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Sleeping
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`mr-2 flex  rounded-full `,
										passion.includes('Parenthood')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Parenthood')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Parenthood
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										tw`flex  rounded-full `,
										passion.includes('Breakfast')
											? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
											: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
									]}
									onPress={() => handlePassion('Breakfast')}
								>
									<Text style={[ { fontFamily: 'Regular' }, tw`text-center p-2 text-black text-xs` ]}>
										Breakfast
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={tw`mt-24`} />
					</View>
				</ScrollView>
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						onPress={() => {
							setModal(true);
						}}
						style={[
							tw`flex mb-2 justify-center shadow items-center w-72 rounded-full py-3 `,
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
				<FooterImg />
			</View>
		</View>
	);
};

// define your styles
const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalview: {
		width: 300,
		height: 200
	}
});

//make this component available to the app
export default Passion;
