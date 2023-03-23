import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import tw from 'twrnc';

const Cards = ({ title, slug, yes, no, action }) => {
	return (
		<Fragment>
			<Pressable onPress={action} >
				<View  style={tw`w-full flex flex-row bg-gray-200 rounded-lg mt-3`}>
					<View style={tw`p-4 flex flex-row w-full`}>
						<View style={tw`w-full flex flex-row`}>
							<View style={tw`flex flex-grow`}>
								<Text style={[ { fontFamily: 'Regular' }, tw` text-sm w-full flex-grow` ]}>
									{title}
								</Text>
							</View>
							<View style={tw`flex items-end`}>
								<View style={tw`flex flex-row justify-center items-center`}>
									<View style={tw`flex justify-center items-center  `}>
										<Text style={[ { fontFamily: 'Regular' }, tw`text-xs flex items-center  ` ]}>
											{slug}
										</Text>
									</View>
									<TouchableOpacity style={tw`pl-2 flex   `}>
										<Text style={[ { fontFamily: 'Regular' } ]}>
											{yes}
											{no}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</View>
			</Pressable>
		</Fragment>
	);
};

export default Cards;
