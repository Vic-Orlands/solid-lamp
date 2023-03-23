//import liraries
import React from 'react';
import { View, Image } from 'react-native';
import tw from 'twrnc';
import * as image from './Images'


const FooterImg = () => {
	return (
		<View style={tw`flex items-center pl-2 justify-center content-center`}>
			<Image source={image.footer} style={{ width: 100, height: 30, resizeMode: 'contain' }} />
		</View>
	);
};

export default FooterImg;
