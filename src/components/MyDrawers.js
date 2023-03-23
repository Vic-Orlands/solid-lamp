import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import ActionButton from './ActionButton';
import useAuth from '../auth/useAuth';
import tw from 'twrnc';
import { DarkMode } from '../config/DarkMode';
import firestore from '@react-native-firebase/firestore';
import CountryFlag from "react-native-country-flag";

const MyDrawers = (props) => {
	const navigation = useNavigation();
	const themes = useContext(DarkMode)
	const [profile, setProfile] = useState([]);
	const { user, handleSignOut } = useAuth();

	useEffect(() => {
		const subscriber = firestore().collection('users').get().then((documentSnapshot) => {
			setProfile(
				documentSnapshot.docs.filter((doc) => doc.id === user.uid).map((doc) => ({
					id: doc.id,
					...doc.data()
				}))
			);
		});
		
		return () => subscriber
	}, []);
	
	//calculate age from returned dob
	const calculateAge = (dateString) => {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const UsableCard = ({ theText, theIcon, goTo }) => {
		return (
			<TouchableOpacity style={tw`w-full flex flex-row bg-gray-200 rounded-lg mt-3 `} onPress={goTo}>
				<View style={tw`p-3  flex flex-row items-center justify-center w-full`}>
					<View style={tw` w-full flex flex-row items-center justify-center  `}>
						<View style={tw`w-3/4 flex`}>
							<Text style={[{ fontFamily: 'Regular' }, tw` text-base `]}>{theText}</Text>
						</View>
						<View style={tw`w-1/4  flex  items-end   `}>{theIcon}</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={[{ backgroundColor: themes.background }, styles.container]}>
			<DrawerContentScrollView {...props} style={{ marginTop: 20 }}>
				<View style={tw`w-full flex items-center justify-center`}>
					<View style={[{ borderRadius: 40 }, tw`flex rounded-full border border-gray-200 p-1`]}>
						<View
							style={[
								{ height: 80, width: 80, borderRadius: 40 },
								tw`flex rounded-full border border-gray-200`
							]}
						>
							<Image
								source={{ uri: profile[0]?.image }}
								style={[{ height: 80, width: 80, borderRadius: 40 }, tw`border border-2 p-6`]}
							/>
						</View>
					</View>
					<View style={tw`flex items-center flex-row mt-1 mb-4`}>
						<CountryFlag isoCode={profile.length > 0 ? profile[0]?.countryCode : "ng"} size={16} style={tw`rounded`} />
						<Text style={[{ fontFamily: 'Bold', color: themes.color }, tw`pl-2 text-base`]}>
							{profile[0]?.name}, {calculateAge(profile[0]?.dob)}
						</Text>
					</View>
					{/* <Text style={[{ fontFamily: 'Regular', color: themes.color }, tw`text-sm`]}>Not Verified</Text> */}
				</View>

				<View style={[{ justifyContent: 'space-between',},tw`px-4 py-5`]}>
					<UsableCard
						theIcon={<FontAwesome5 name="user-edit" size={26} color="#CC0000" />}
						theText="Edit Profile"
						goTo={() => navigation.navigate('EditProfile')}
					/>
					<UsableCard
						theIcon={<MaterialCommunityIcons name="party-popper" size={28} color="#CC0000" />}
						theText="Explore"
						goTo={() => navigation.navigate('Explore')}
					/>
					<UsableCard
						theIcon={<MaterialIcons name="verified" size={28} color="#cc0000" />}
						theText="Verify your Account"
						goTo={() => navigation.navigate('Verify')}

					/>
					{/* <UsableCard
						theIcon={<FontAwesome5 name="user-cog" size={26} color="#CC0000" />}
						theText="Settings"
						goTo={() => navigation.navigate('SettingInfo')}
					/> */}
					<UsableCard
						theIcon={<FontAwesome5 name="ad" size={28} color="#CC0000" />}
						theText="My Ad Preference"
						goTo={() => navigation.navigate('Ads')}
					/>
					<UsableCard
						theIcon={<MaterialIcons name="support" size={28} color="#CC0000" />}
						theText="Help & Support"
						goTo={() => navigation.navigate('SettingInfo')}
					/>
				</View>
			</DrawerContentScrollView>
			<View style={[{ bottom: 0 }, tw`px-4 pb-3`]}>
				<ActionButton InfoText="Log Out" InfoIcon={<SimpleLineIcons name="logout" size={24} color="white" />} onPressAction={() => handleSignOut()} />
			</View>
		</SafeAreaView>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// marginTop: StatusBar.currentHeight
	}
});

export default MyDrawers;
