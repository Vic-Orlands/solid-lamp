import React, { useState } from 'react';
import ImageView from 'react-native-image-viewing';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import moment from 'moment';
import tw from 'twrnc';

const SenderMessage = ({ message }) => {
	const { width } = Dimensions.get('window');
	const [ visible, setIsVisible ] = useState(false);

	return (
		<View style={[ tw`flex-row mx-3 my-1 pl-19`, { width: width - 20 } ]}>
			{message.message.includes(
				'https://firebasestorage.googleapis.com/v0/b/loveafrica-app-f167c.appspot.com'
			) ? (
				<View style={tw`bg-red-500 rounded-xl rounded-tr-none w-55 h-74 relative rounded-xl ml-auto px-1 py-1`}>
					{!visible ? (
						<Pressable onPress={() => setIsVisible(true)}>
							<Image
								source={{ uri: message.message }}
								resizeMode="cover"
								style={tw`h-full w-full rounded-xl rounded-tr-none`}
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
						tw`bg-red-500 rounded-xl rounded-tr-none ml-auto px-4 py-1 pb-1.5`,
						message.message.length > 40 ? tw`w-full` : tw``
					]}
				>
					<Text style={tw`text-white text-base pb-1 pr-4`}>{message.message}</Text>
					<Text style={tw`text-slate-50 text-xs text-right`}>
						{moment(new Date(message?.timestamp?.seconds * 1000 + message?.timestamp?.nanoseconds / 1000000)).format('LT')}
					</Text>
				</View>
			)}
		</View>
	);
};

export default SenderMessage;
