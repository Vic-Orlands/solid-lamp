import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as image from './Images'
import Animated, { FadeIn, FadeOut, FadeInDown } from 'react-native-reanimated';
import tw from 'twrnc';

const AppLoading = () => {
	const [ loaded, setLoaded ] = useState(false);
	const [ closing, setClosing ] = useState(false);
	useEffect(
		() => {
			setTimeout(() => {
				setLoaded(true);

				setTimeout(() => {
					setClosing(true);
				}, 5);
			}, 1500);
		},
		[ loaded ]
	);

	return (
		<View style={tw` h-full flex justify-center items-center`}>
			{!loaded ? (
				<Animated.Image source={image.splash} style={{ width: 80, height: 85 }} entering={FadeIn} exiting={FadeOut} />
			) : (
				<React.Fragment>
					{closing && (
						<Animated.Image source={image.love_text_black} style={{ width: 230, height: 80 }} entering={FadeInDown} />
					)}
				</React.Fragment>
			)}
		</View>
	);
};

export default AppLoading;
