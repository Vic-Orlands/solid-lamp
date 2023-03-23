import React, { useState, createRef,useContext, useEffect } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import TopNav from '../../../../components/TopNav';
import Toast from 'react-native-toast-message';
import useAuth from '../../../../auth/useAuth';
import tw from 'twrnc';
import { DarkMode } from '../../../../config/DarkMode';


export default function ChangePhoneNumber() {
	const { user } = useAuth();
	const navigation = useNavigation();
	const phoneInput = createRef(null);
	const [ profile, setProfile ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ phoneNumber, setPhoneNumber ] = useState('');

	// setTheme
	const themes = useContext(DarkMode)

	useEffect(() => {
		const subscribe = firestore().collection('users').get().then((documentSnapshot) => {
			setProfile(
				documentSnapshot.docs.filter((doc) => doc.id === user.uid).map((doc) => ({
					id: doc.id,
					...doc.data()
				}))
			);
		});

		return () => subscribe;
	}, []);

	//handle to update phone number
	const handleUpdatePhoneNumber = async () => {
		setLoading(true);

		await firestore()
			.collection('users')
			.doc(user.uid)
			.update({
				phone_number: phoneNumber,
				timeStamp: firestore.FieldValue.serverTimestamp()
			})
			.then(() => {
				setLoading(false);
				Toast.show({
					type: 'success',
					position: 'top',
					text1: `Your phone number has been changed successfully!`
				});

				setTimeout(() => {
					navigation.navigate('EditProfile');
				}, 1500);
			})
			.catch((error) => {
				setLoading(false);
				console.log(error);
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
		<View style={[{backgroundColor:themes.background}, tw`flex-1 items-center pt-3` ]}>
			<TopNav Title="Change Phone number" />

			<Toast
				config={toastConfig}
				innerRef={(res) => {
					Toast.setRef(res);
				}}
			/>

			<View style={tw`flex-1 content-center items-center`}>
				{!profile[0]?.phone_number ? (
					<View style={tw`flex-1 justify-center pb-14`}>
						<Text style={[ { zIndex: -3 , fontFamily:"Bold", color:themes.color}, tw`text-xl text-center px-8` ]}>
							You can't change your phone number because you are using google login
						</Text>
					</View>
				) : (
					<View>
						<View style={tw`content-center items-center mt-8`}>
							<Text style={[{fontFamily:"Regular", color:themes.color},tw`flex items-center mt-4 mb-1 text-base`]}>Enter New Phone Number</Text>
							<PhoneInput
								ref={phoneInput}
								defaultCode="NG"
								layout="first"
								onChangeFormattedText={setPhoneNumber}
								textContainerStyle={[
									tw` rounded-r-xl`,
									{ fontFamily: 'Regular', backgroundColor: '#F0E0E0' }
								]}
								containerStyle={[
									tw`rounded-xl  shadow w-80`,
									{ fontFamily: 'Regular', backgroundColor: '#F0E0E0' }
								]}
								withShadow
								autoFocus
							/>
						</View>

						<View style={tw`flex items-center mt-14`}>
							<TouchableOpacity
								onPress={handleUpdatePhoneNumber}
								style={[
									tw`flex justify-center items-center w-72 rounded-full py-3 `,
									{ backgroundColor: '#CC0000' }
								]}
							>
								<Text
									style={[
										{ fontFamily: 'Bold' },
										tw`text-center text-white text-base flex items-center text-xl`
									]}
								>
									{!loading ? 'Update Number' : 'Updating...'}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}
