import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import FooterImg from '../../components/FooterImg';
import * as img from '../../components/Images';

import RegNav from '../../components/RegNav';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { requestGalleryPermission } from '../../auth/Permissions';
import { DarkMode } from '../../config/DarkMode';

const ChoosePhoto = () => {
	const navigation = useNavigation();
	const themes = useContext(DarkMode);
	const [ image, setImage ] = useState(null);
	const [ theErr, settheErr ] = useState('');
	const [ imgUrl, setImgUrl ] = useState('');

	const disableBtn = !imgUrl;

	// set Error
	const imgErr = () => {
		settheErr('Please add a photo to continue. ');
		setTimeout(() => {
			settheErr('');
		}, 2000);
	};
	// select image
	const OpenGallery = async () => {
		const options = {
			maxWidth: 2000,
			maxHeight: 2000,
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		};

		await requestGalleryPermission();
		//Remember to Use Error toast instead
		await launchImageLibrary(options, (res) => {
			if (res.didCancel) {
				console.log('User cancelled image picker');
			} else if (res.error) {
				console.log('ImagePicker Error:', res.error);
			} else {
				const path = res.assets[0].uri;
				let fileName = getFileName(res.assets[0].fileName, path);
				setImage(path);

				// upload image to firebase storage
				let reference = storage().ref(`profileImages://${fileName}`);
				let task = reference.putFile(path);
				task
					.then(async () => {
						console.log('Image uploaded to the bucket!');
						const url = await reference.getDownloadURL();
						setImgUrl(url);
					})
					.catch((e) => {
						console.log('uploading image error => ', e);
					});
			}
		});
	};

	// get image path
	const getFileName = (name, path) => {
		if (name != null) {
			return name;
		}
		if (Platform.OS === 'ios') {
			path = '~' + path.substring(path.indexOf('/Documents'));
		}
		return path.split('/').pop();
	};

	const handleContinueRegistration = async () => {
		try {
			const savedUser = await AsyncStorage.getItem('userDetails');
			const currentUser = JSON.parse(savedUser) || [];

			currentUser[0].image = imgUrl;
			await AsyncStorage.setItem('userDetails', JSON.stringify(currentUser));
			navigation.navigate('AlmostDone');
		} catch (error) {}
	};

	return (
		<View style={[ { backgroundColor: themes.background }, tw`flex-1 items-center p-4` ]}>
			<ScrollView>
				<RegNav Title="Profile Photo" />
				<View style={tw`flex-1 p-4`}>
					<View style={[ tw`flex items-center rounded-xl py-4`, styles.rounded ]}>
						<Pressable onPress={OpenGallery}>
							<Image source={img.galleri} style={{ width: 300, height: 150, resizeMode: 'contain' }} />
						</Pressable>
						<View
							style={[
								{ flex: 1, alignItems: 'center', justifyContent: 'center' },
								tw`mt-12 rounded-lg`
							]}
						>
							{image && (
								<Image
									source={{ uri: image }}
									style={[ { width: 300, height: 430 }, tw`rounded-xl` ]}
								/>
							)}
						</View>
						<Text style={[ { fontFamily: 'Bold' }, tw` text-xl text-center text-red-700` ]}>{theErr}</Text>
					</View>

					<View style={tw`mt-6`} />
					<View style={tw`flex items-center`}>
						<TouchableOpacity
							onPress={image !== null ? handleContinueRegistration : imgErr}
							disabled={disableBtn}
							style={[
								tw`flex justify-center shadow items-center w-72 rounded-full py-3 `,
								{ backgroundColor: '#CC0000' }
							]}
						>
							<Text
								style={[
									{ fontFamily: 'Bold' },
									tw`text-white text-center text-base flex items-center text-xl`
								]}
							>
								Continue
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<FooterImg />
			</ScrollView>
		</View>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2c3e50'
	},
	rounded: {
		borderStyle: 'dashed'
	}
});

//make this component available to the app
export default ChoosePhoto;
