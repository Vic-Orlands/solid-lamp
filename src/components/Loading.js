import { SafeAreaView, Image } from 'react-native';
import React,{useContext} from 'react';
import tw from 'twrnc';
import * as image from './Images'
import { DarkMode } from '../config/DarkMode';


const Loading = () => {
	const themes = useContext(DarkMode);

	return (
		<SafeAreaView style={[ {backgroundColor:themes.background, zIndex:99},tw` h-full flex justify-center items-center`]}>
			<Image source={image.splash} style={[{ width: 100, height: 100 }, tw`opacity-75`]} />
		</SafeAreaView>
	);
};

export default Loading;
