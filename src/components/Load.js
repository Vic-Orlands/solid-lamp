import { ImageBackground } from 'react-native';
import React from 'react';
import * as image from './Images'
import tw from 'twrnc';

const Load = () => {
	return (
		<React.Fragment>
			<ImageBackground source={image.splash2} resizeMode="contain" style={tw`h-full w-full`} />
		</React.Fragment>
	);
};

export default Load;
