import { PermissionsAndroid, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// location notification
async function requestLocationPermission() {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
			title: 'LoveAfrica',
			message: 'LoveAfrica Needs access to your device Location',
			// buttonNeutral: "Ask Me Later",
			buttonNegative: 'Cancel',
			buttonPositive: 'Allow'
		});
		console.log(granted);
		const navigation = useNavigation();

		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			// console.log('you can use the location');
			alert('Ensure your GPS is turned on');
			setTimeout(() => {
				Linking.openSettings();
			}, 500);
		} else {
			// console.log('Permission denied');

			navigation.navigate('Home');
		}
	} catch (err) {
		console.log(err);
	}
}

//  gallery notification
export async function requestGalleryPermission() {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
			title: 'LoveAfrica',
			message: 'LoveAfrica Needs access to your gallery',
			// buttonNeutral: "Ask Me Later",
			buttonNegative: 'Cancel',
			buttonPositive: 'Allow'
		});

		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('Access granted gallery');
		} else {
			console.log('Access denied gallery');
		}
	} catch (err) {
		console.log(err);
	}
}

//  Post notification
export async function requestNotificationPermission() {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
			title: 'LoveAfrica',
			message: 'LoveAfrica Needs your permission to Post notification',
			// buttonNeutral: "Ask Me Later",
			buttonNegative: 'Cancel',
			buttonPositive: 'Allow'
		});
		console.log(granted);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('Notifications allowed');
			alert('Notifications allowed');
		} else {
			console.log('Notifications denied');
			alert('Notifications denied');
		}
	} catch (err) {
		console.log(err);
	}
}

//  contact notification
export async function requestContactsPermission() {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS, {
			title: 'LoveAfrica',
			message: 'LoveAfrica Needs access to your contact for better experience',
			// buttonNeutral: "Ask Me Later",
			buttonNegative: 'Cancel',
			buttonPositive: 'Allow'
		});
		console.log(granted);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('contacts Allowed');
			alert('contacts Allowed');
		} else {
			console.log('contacts  denied');
			alert('contacts  denied');
		}
	} catch (err) {
		console.log(err);
	}
}

//  camera notification
export async function requestCameraPermission() {
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
			title: 'LoveAfrica',
			message: 'LoveAfrica Needs access to your Camera',
			// buttonNeutral: "Ask Me Later",
			buttonNegative: 'Cancel',
			buttonPositive: 'Allow'
		});
		console.log(granted);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('Camera Permssion  Allowed');
			alert('Camera Permssion  Allowed');
		} else {
			console.log('Camera Permssion  denied');
			alert('Camera Permssion  denied');
		}
	} catch (err) {
		console.log(err);
	}
}
