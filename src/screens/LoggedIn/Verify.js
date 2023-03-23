import React, {useState, useContext, Fragment, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import Animated, {FadeInDown} from 'react-native-reanimated';
import RegNav from '../../components/RegNav';
import LoadComponent from '../../components/Loading';
import {DarkMode} from '../../config/DarkMode';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TouchID from 'react-native-touch-id';

// create a component
const Verify = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [authen, setAuthen] = useState(false);
  const [theColor, setTheColor] = useState('gray');

  // setTheme
  const themes = useContext(DarkMode);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  function handleVerify() {
    console.log(
      'OK Pressed: do a function to send a unique hash to the database and go back to home page ',
    );

    navigation.replace('Feeds');
  }

  async function pressHandler() {
    const optionalConfigObject = {
      title: 'LoveAfrica Verification', // Android
      imageColor: 'gray', // Android
      imageErrorColor: '#cc0000', // Android
      sensorDescription: 'Touch sensor', // Android
      sensorErrorDescription: 'Failed', // Android
      cancelText: 'Cancel', // Android
      unifiedErrors: false, // use unified error messages (default false)
    };

    await TouchID.authenticate('Authentication Required', optionalConfigObject)
      .then(success => {
        setTheColor('black');

        Alert.alert(
          'LoveAfrica Authentification',
          'Authenticated Successfully',
          [{text: 'OK', onPress: () => handleVerify()}],
        );
      })
      .catch(error => {
        Alert.alert('LoveAfrica Authentification', 'Authentication Failed', [
          {text: 'Redo', onPress: () => navigation.replace('Verify')},
          {text: 'Cancel', onPress: () => navigation.replace('Feeds')},
        ]);
        setTheColor('#cc0000');
      });
  }

  const Details = () => {
    return (
      <Fragment>
        <View style={tw`flex justify-center items-center`}>
          <Text
            style={[
              {fontFamily: 'Regular', color: themes.color},
              tw`text-base max-w-xs px-4 pt-8`,
            ]}>
            Prove you're the owner of this account with no hassle. Use
            Fingerprint to verify your account.
          </Text>
        </View>
        <View style={tw`mt-32`} />
        <View style={tw` flex justify-center items-center`}>
          <TouchableOpacity
            onPress={() => setAuthen(true)}
            style={[
              tw`flex justify-center items-center w-72 rounded-full py-4 `,
              {backgroundColor: '#CC0000'},
            ]}>
            <Text
              style={[
                {fontFamily: 'Bold'},
                tw`text-white text-center  text-xl flex items-center`,
              ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  };

  const Fingerprint = () => {
    return (
      <Fragment>
        <View style={tw`flex justify-center items-center`}>
          <Text
            style={[
              {fontFamily: 'Regular', color: themes.color},
              tw`text-base max-w-xs px-4   mt-12 py-30`,
            ]}>
            <Ionicons name="finger-print" size={120} color={theColor} />
          </Text>
        </View>
        <View style={tw`mt-32`} />
        <View style={tw` flex justify-center items-center`}>
          <TouchableOpacity
            onPress={() => pressHandler()}
            style={[
              tw`flex justify-center items-center w-72 rounded-full py-4 `,
              {backgroundColor: '#CC0000'},
            ]}>
            <Text
              style={[
                {fontFamily: 'Bold'},
                tw`text-white text-center  text-xl flex items-center`,
              ]}>
              Verify Now
            </Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  };

  return (
    <Animated.View
      style={[
        {backgroundColor: themes.background},
        tw`flex-1 items-center px-4 pt-2`,
      ]}
      entering={FadeInDown}>
      <RegNav Title="Verify Account" />

      {loading ? (
        <LoadComponent />
      ) : (
        <View style={tw`flex-1 content-center items-center pt-8`}>
          {!authen ? <Details /> : <Fingerprint />}
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
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default Verify;
