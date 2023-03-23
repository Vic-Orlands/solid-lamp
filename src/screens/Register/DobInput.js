//import liraries
import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import { DarkMode } from '../../config/DarkMode';
import RegNav from '../../components/RegNav';
import useAuth from '../../auth/useAuth';
import tw from 'twrnc';

// create a component

let localYear;
const DobInput = () => {
	const { user } = useAuth();
	const navigation = useNavigation();

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const themes = useContext(DarkMode);
	const [show, setShow] = useState(false);
	const [mode, setMode] = useState('date');
	const [date, setDate] = useState(new Date());
	const [val, setVal] = useState('MM / DD / YYYY');
	const [theErr, settheErr] = useState('');
	const [dob, setDob] = useState(2022);


	const nullField = !date;

	// set google user name and email
	useEffect(
		() => {
			let unsub = true;

			if (unsub && user) {
				setEmail(user.email);
				setName(user.displayName);
			}

			return () => (unsub = false);
		},
		[user]
	);


	// set Error
	const imgErr = () => {
		settheErr('You should be  18+ to continue ')
		setTimeout(() => {
			settheErr('')
		}, 2000);
	}
	const onChange = (event, selectedDate) => {

		
		const currentDate = selectedDate;
		setShow(false);
		setDate(currentDate);
		let tempDate = new Date(currentDate);
		let fDate = tempDate.getMonth() + 1 + ' / ' + tempDate.getDate() + ' / ' + tempDate.getFullYear();
		setVal(fDate);

		localYear = JSON.stringify(date).substring(1, 5) 
		localYear = parseInt(localYear)
		setDob(localYear)
		console.log(date)
		console.log(localYear)
		console.log(dob)
		console.log(val)
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};

	const handleContinueRegistration = async () => {
		if (user.displayName === null) {
			const savedUser = await AsyncStorage.getItem('userDetails');
			const currentUser = JSON.parse(savedUser) || [];

			currentUser[0].dob = date;
			await AsyncStorage.setItem('userDetails', JSON.stringify(currentUser));
			navigation.navigate('Gender');
		} else {
			const currentUser = [];

			let obj = {
				dob: date,
				name: name,
				email_address: email
			};
			currentUser.push(obj);
			await AsyncStorage.setItem('userDetails', JSON.stringify(currentUser));
			navigation.navigate('Gender');
		}
	};

	return (
		<View style={[{ backgroundColor: themes.background }, tw`flex-1 items-center px-4`]}>


			
			<View style={[tw` flex-row items-center pt-6 px-2`]}>
				<View>
					<TouchableOpacity  />
				</View>

				<View style={tw`flex-grow`}>
					<Text style={[{ fontFamily: 'Bold', color: themes.color }, tw` text-center mr-3 text-3xl`]}>
						Date of Birth
					</Text>
				</View>
			</View>
			
			<View style={tw`flex-1 p-4`}>
				<View style={tw`mt-12`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						onPress={showDatepicker}
						style={[tw` w-72 px-3 py-4 rounded-xl text-center shadow`, { backgroundColor: '#F0E0E0' }]}
					>
						<Text style={[{ fontFamily: 'Bold' }, tw`   `]}>{val}</Text>
					</TouchableOpacity>

					<Text style={[{ fontFamily: 'Light', color: themes.color }, tw`pl-3 flex items-center text-xs w-72 pt-2`]}>
						Your Age will be public.
					</Text>
				</View>
				<Text style={[{ fontFamily: 'Bold' }, tw` text-xl text-center text-red-700 pt-3`]}>{theErr}</Text>

				<View>
					{show && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode={mode}
							is24Hour={true}
							onChange={onChange}
							minimumDate={new Date(1970, 0, 1)}
							maximumDate={new Date(2004, 10, 30)}
						/>
					)}
				</View>

				<View style={tw`mt-24`} />
				<View style={tw`flex items-center`}>
					<TouchableOpacity
						disabled={nullField}
							onPress={val === 'MM / DD / YYYY' || dob > 2004 ? imgErr :  handleContinueRegistration    }
						style={[
							tw`flex justify-center shadow items-center w-72 rounded-full py-3 `,
							{ backgroundColor: '#CC0000' }
						]}
					>
						<Text
							style={[
								{ fontFamily: 'Bold' },
								tw`text-white text-center  text-base flex items-center text-xl`
							]}
						>
							Continue
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<FooterImg />
		</View>
	);
};

//make this component available to the app
export default DobInput;
