import React, {useContext} from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import Ionicons  from 'react-native-vector-icons/Ionicons';
import { DarkMode } from '../config/DarkMode';


export default function TopNav({ Title, OpenMenu }) {
    const navigation = useNavigation();
	const themes = useContext(DarkMode);

    return (
        <>
            <View style={[tw`px-6 flex-row items-center pt-3`]}>
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack(null)}
                    >
                        <Ionicons name="chevron-back" size={30} color={themes.color === "dark" || themes.color === "#202124" ? "#cc0000" :  themes.color} />
                    </TouchableOpacity>
                </View>

                <View style={tw`flex-grow`}>
                    <Text style={[{fontFamily: 'Bold', color:themes.color} , tw` pr-6 text-center text-3xl`]}>
                        {Title}
                    </Text>
                </View>

                <View style={tw`flex  `}>
                    <Text style={[{fontFamily: 'Bold', color:themes.color} , tw`px-1 text-center text-2xl`]}>
                        {OpenMenu}
                    </Text>
                </View>
            </View>
        </>
    )
}

