import React, { useState , useContext} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RegNav from '../../components/RegNav';
import LoadComponent from '../../components/Loading';
import { DarkMode } from '../../config/DarkMode';

// create a component
const Ads = () => {
	const navigation = useNavigation();
	const [ loading, setLoading ] = useState(true);

	// setTheme
	const themes = useContext(DarkMode)

	setTimeout(() => {
		setLoading(false);
	}, 2000);

	return (
		<Animated.View style={[{backgroundColor:themes.background},tw`flex-1 items-center px-4 pt-2`]} entering={FadeInDown}>
			<RegNav Title="Ads Settings" />

			{loading ? (
				<LoadComponent />
			) : (
				<View style={tw`flex-1 content-center items-center pt-8`}>
					<View style={tw`flex justify-center items-center`}>
						<Text style={[ { fontFamily: 'Regular', color:themes.color }, tw`text-base max-w-xs px-4 pt-8` ]}>
							Ads can be disruptive. Disable the Ads to further enjoy the best experience.
						</Text>
					</View>
					<View style={tw`mt-32`} />
					<View style={tw` flex justify-center items-center`}>
						<TouchableOpacity
							onPress={() => alert('You cannot make Payments right now.')}
							style={[
								tw`flex justify-center items-center w-72 rounded-full py-4 `,
								{ backgroundColor: '#CC0000' }
							]}
						>
							<Text
								style={[
									{ fontFamily: 'Bold' },
									tw`text-white text-center  text-base flex items-center`
								]}
							>
								Remove Ads Now
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
			<View>
				<FooterImg />
			</View>
		</Animated.View>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2c3e50'
	}
});

//make this component available to the app
export default Ads;
