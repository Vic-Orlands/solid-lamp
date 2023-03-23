import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MatchPage = () => {
	const { params } = useRoute();
	const navigation = useNavigation();
	const { loggedInProfile, userSwiped } = params;

	return (
		<View style={[ tw`h-full bg-red-500 pt-20`, { opacity: 0.89 } ]}>
			<View style={tw`justify-center px-10 pt-20`}>
				<Text style={[ tw`text-white text-center`, { fontSize: 60, fontFamily: 'Bold' } ]}>Best Match</Text>
				<Text style={[ { fontFamily: 'Regular' }, tw`text-white text-center text-lg mt-2` ]}>
					You and {userSwiped.name} have liked each other
				</Text>
			</View>

			<View style={tw`flex-row justify-evenly mt-5`}>
				<Image style={tw`h-40 w-40 rounded-full`} source={{ uri: loggedInProfile.image }} />
				<Image style={tw`h-40 w-40 rounded-full`} source={{ uri: userSwiped.image }} />
			</View>

			<View style={tw`mt-8 mb-4`}>
				<Text style={[ { fontFamily: 'Bold' }, tw`leading-5 text-center text-white text-lg` ]}>
					Know more about your match by sending a message.
				</Text>
			</View>

			<TouchableOpacity
				style={tw`bg-white mx-5 px-8 py-4 rounded-full`}
				onPress={() => navigation.navigate('Messages')}
			>
				<Text style={[ { fontFamily: 'Regular' }, tw`text-center text-xl ` ]}>Send a message</Text>
			</TouchableOpacity>

			<View style={tw`flex-row justify-between mt-8 mb-4 mx-20 items-center`}>
				<TouchableOpacity
					onPress={() => navigation.navigate('Feeds')}
					style={tw`p-3 mb-3 rounded-full bg-black`}
				>
					<Entypo name="cross" size={30} color="white" />
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => navigation.navigate('SpeedDating')}
					style={[ tw`p-3 bg-black mb-3 rounded-full`, { backgroundColor: '#10873a' } ]}
				>
					<Ionicons name="videocam" size={32} color="#fff" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default MatchPage;
