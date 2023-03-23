import { View, Text, TouchableOpacity } from 'react-native';
import React, { Fragment } from 'react';
import tw from 'twrnc';

const Reuse = ({ iconText, text, linkTo, bgColor }) => {
	return (
		<Fragment>
			<TouchableOpacity
				style={[
					{ backgroundColor: bgColor },
					tw` flex-row items-center justify-center bg-white w-72 rounded-full py-4 `
				]}
				onPress={linkTo}
			>
				<Text style={tw` text-left font-bold `}> {iconText} </Text>
				<Text style={[ { fontFamily: 'Bold' }, tw`text-base text-black` ]}>{text}</Text>
			</TouchableOpacity>
			<View style={tw`mt-4`} />
		</Fragment>
	);
};
export default Reuse;
