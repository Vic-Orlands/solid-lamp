import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, Text, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import * as image from './Images'
import tw from 'twrnc';

const HomeDrawer = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={tw`flex justify-center items-center`}>
				<DrawerContentScrollView contentContainerStyle={{ backgroundColor: 'red' }}>
					<View style={tw`flex justify-center items-center`}>
						<Image source={image.splash} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
						<View style={tw`flex-row`}>
							<Entypo name="info-with-circle" size={20} color="#cc0000" />
							<Text style={[ { fontFamily: 'Bold' }, tw`pl-2 text-base` ]}>Fullname Here, Age</Text>
						</View>
						<Text style={[ { fontFamily: 'Regular' }, tw`text-sm` ]}>Not Verified</Text>
					</View>
				</DrawerContentScrollView>

				<Text>Home Drawers</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight
	}
});

export default HomeDrawer;
