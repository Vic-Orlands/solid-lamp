import React, { useState } from 'react';
import ImageView from 'react-native-image-viewing';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import moment from 'moment';
import tw from 'twrnc';

const ReceiverMessage = ({ message }) => {
	const { width } = Dimensions.get('window');
	const [ visible, setIsVisible ] = useState(false);

	// convert firebase date stamp
	const fireBaseTime = new Date(message.timestamp.seconds * 1000 + message.timestamp.nanoseconds / 1000000);
	const messageTime = moment(fireBaseTime).format('LT');

	return (
		<View style={[ tw`flex flex-row mx-3 my-1 pr-19`, { width: width - 20 } ]}>
			{message.message.includes(
				'https://firebasestorage.googleapis.com/v0/b/loveafrica-app-f167c.appspot.com'
			) ? (
				<View style={tw`bg-gray-700 w-55 h-74 relative rounded-xl rounded-tl-none px-1 py-1`}>
					{!visible ? (
						<Pressable onPress={() => setIsVisible(true)}>
							<Image
								source={{ uri: message.message }}
								resizeMode="cover"
								style={tw`h-full w-full rounded-xl rounded-tl-none`}
							/>
						</Pressable>
					) : (
						<ImageView
							images={[ { uri: message.message } ]}
							imageIndex={0}
							visible={visible}
							onRequestClose={() => setIsVisible(false)}
						/>
					)}
				</View>
			) : (
				<View
					style={[
						tw`bg-gray-700 rounded-xl rounded-tl-none px-4 py-1 pb-1.5`,
						message.message.length > 40 ? tw`w-full` : tw``
					]}
				>
					<Text style={tw`text-white text-base pb-1 pr-4`}>{message.message}</Text>
					<Text style={tw`text-slate-50 text-xs text-right`}>{messageTime}</Text>
				</View>
			)}
		</View>
	);
};

export default ReceiverMessage;
