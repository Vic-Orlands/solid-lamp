import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import TopNav from '../../../../components/TopNav';
import Toast from 'react-native-toast-message';
import useAuth from '../../../../auth/useAuth';
import tw from 'twrnc';
import { DarkMode } from '../../../../config/DarkMode';


export default function ChangeInterest() {
	const { user } = useAuth();
	const navigation = useNavigation();
	const [bgColor, setColor] = useState('');
	const [loading, setLoading] = useState(false);
	const [interestedIn, setInterestedIn] = useState('');


	// setTheme
	const themes = useContext(DarkMode)

	// handle setting interest or preference
	const handlesetPreference = (props) => {
		setInterestedIn(props);
		setColor('#CC0000');
	};

	const handleUpdateInterest = async () => {
		setLoading(true);

		await firestore()
			.collection('users')
			.doc(user.uid)
			.update({
				interested_in: interestedIn,
				timeStamp: firestore.FieldValue.serverTimestamp()
			})
			.then(() => {
				setLoading(false);

				Toast.show({
					type: 'success',
					position: 'top',
					text1: `Your interest preference has been changed successfully!`
				});

				setTimeout(() => {
					navigation.navigate('EditProfile');
				}, 2000);
			})
			.catch((error) => {
				setLoading(false);
				Toast.show({
					type: 'error',
					position: 'top',
					text1: error.code
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
		<View style={[{backgroundColor:themes.background},tw`flex-1 items-center pt-3`]}>
			<TopNav Title="Change Preference" />

			<Toast
				config={toastConfig}
				innerRef={(res) => {
					Toast.setRef(res);
				}}
			/>

			<View style={tw`mt-8`}>
				<Text style={[{ zIndex: -3 , fontFamily:"Regular", color:themes.color}, tw`text-xl text-center px-8 mt-8`]}>
					Select an interest preference to change existing preference
				</Text>
			</View>

			<Text style={tw`flex items-center mb-1 text-2xl`} />
			<View style={tw`flex flex-row`}>
				<TouchableOpacity
					style={[
						tw` w-24 h-16 rounded-xl pt-6 text-center shadow`,
						interestedIn === 'Male'
							? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
							: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
					]}
					onPress={() => handlesetPreference('Male')}
				>
					<Text style={[{ fontFamily: 'Regular' }, tw`text-center`]}>Male</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						tw` w-24 h-16 mx-4 rounded-xl pt-6 text-center shadow`,
						interestedIn === 'Female'
							? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
							: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
					]}
					onPress={() => handlesetPreference('Female')}
				>
					<Text style={[{ fontFamily: 'Regular' }, tw`text-center`]}>Female</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						tw` w-24 h-16 rounded-xl pt-6 text-center shadow`,
						interestedIn === 'Both'
							? { borderColor: bgColor, backgroundColor: '#F0E0E0', borderWidth: 3 }
							: { backgroundColor: '#F0E0E0', borderWidth: 3, borderColor: '#F0E0E0' }
					]}
					onPress={() => handlesetPreference('Both')}
				>
					<Text style={[{ fontFamily: 'Regular' }, tw`text-center`]}>Both</Text>
				</TouchableOpacity>
			</View>

			<View style={tw`flex items-center mt-14 mb-24`}>
				<TouchableOpacity
					onPress={handleUpdateInterest}
					style={[
						tw`flex justify-center items-center w-72 rounded-full py-3 `,
						{ backgroundColor: '#CC0000' }
					]}
				>
					<Text
						style={[
							{ fontFamily: 'Bold' },
							tw`text-white text-center  text-base flex items-center text-xl`
						]}
					>
						{!loading ? 'Update Preference' : 'Updating...'}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
