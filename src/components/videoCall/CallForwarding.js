import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const CallForwarding = ({ user, rtcCallbacks }) => {
	return (
		<View style={[ tw`h-full bg-red-500 pt-20`, { opacity: 0.89 } ]}>
			<View style={tw`justify-center px-5 pt-40`}>
				<Text style={[ tw`text-white text-center`, { fontSize: 24, fontFamily: 'Bold' } ]}>Calling</Text>
				<Text style={[ tw`text-white text-center`, { fontSize: 34, fontFamily: 'Bold' } ]}>{user}</Text>
			</View>

			<View style={tw`mt-8 mb-4`}>
				<Text style={[ { fontFamily: 'Bold' }, tw`leading-5 text-center text-white text-lg` ]}>Ringing...</Text>
			</View>

			<TouchableOpacity style={tw`bg-white mx-5 px-8 py-4 rounded-full`} onPress={rtcCallbacks}>
				<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-xl ` ]}>End Call</Text>
			</TouchableOpacity>
		</View>
	);
};

export default CallForwarding;
