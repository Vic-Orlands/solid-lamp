import React, {useState, useContext, Fragment} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  padding,
  height,
} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import FooterImg from '../../components/FooterImg';
import Animated, {FadeInDown} from 'react-native-reanimated';
import RegNav from '../../components/RegNav';
// import Loading from '../../components/Loading';
import {DarkMode} from '../../config/DarkMode';
import firestore, {firebase} from '@react-native-firebase/firestore';

const Info = () => {
  const themes = useContext(DarkMode);
  const navigation = useNavigation();
  const date = new Date();

  const [report, setReport] = useState('');
  const [name, setName] = useState('');

  const handleReport = async () => {
    console.log('Action to report. send to database');

    await firestore()
      .collection('reports')
      .add({
        details: report,
        name: name,
        timestamp: firebase.firestore.Timestamp.fromDate(date).toDate(),
      })
      .then(response => {
        Alert.alert(
          'Report User Success.',
          "You have successfully reported a user. If this user poses a great threat to you, please mail to us directly at report@loveafrica.app and you'll get a reply within 24hrs.",
          [{text: 'Close', onPress: () => navigation.goBack('null')}],
        );
      })
      .catch(error => {
        Alert.alert(
          'Report User Error',
          "An error occured at this time. Please mail to us directly if this persist at report@loveafrica.app and you'll get a reply within 24hrs.",
          [{text: 'Close', onPress: () => navigation.goBack('null')}],
        );
      });
  };

  return (
    <Fragment>
      <ScrollView>
        <View style={tw`flex justify-center items-center`}>
          <Text
            style={[
              {fontFamily: 'Regular', color: themes.color},
              tw`text-base max-w-xs px-4 pt-8`,
            ]}>
            Let us know why you're reporting this user.
          </Text>
        </View>
        <View style={tw`w-full my-6 flex justify-center items-center`}>
          <TextInput
            style={[
              tw` w-72 px-3 pt-4  rounded-xl text-black/75 shadow mb-5`,
              {backgroundColor: '#F0E0E0'},
            ]}
            value={name}
            onChangeText={setName}
            placeholder="User's Display Name. "
            keyboardType="default"
          />

          <TextInput
            placeholder="Your reasons... "
            keyboardType="default"
            value={report}
            onChangeText={setReport}
            style={[
              tw` w-72 px-3 pt-4  rounded-xl text-black/75 shadow`,
              {backgroundColor: '#F0E0E0', textAlignVertical: 'top'},
            ]}
            multiline={true}
            numberOfLines={12}
          />
        </View>
        <View style={tw`mt-12`} />

        <View style={tw` flex justify-center items-center`}>
          <TouchableOpacity
            onPress={handleReport}
            style={[
              tw`flex justify-center items-center w-72 rounded-full py-4 `,
              {backgroundColor: '#CC0000'},
            ]}>
            <Text
              style={[
                {fontFamily: 'Bold'},
                tw`text-white text-center  text-xl flex items-center`,
              ]}>
              Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Fragment>
  );
};

const ReportUser = () => {
  // setTheme
  const themes = useContext(DarkMode);

  return (
    <Animated.View
      style={[
        {backgroundColor: themes.background},
        tw`flex-1 items-center px-4 pt-2`,
      ]}
      entering={FadeInDown}>
      <RegNav Title="Report User" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={tw`flex-1 content-center items-center pt-8`}>
          <Info />
        </View>
        <View>
          <FooterImg />
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

//make this component available to the app

export default ReportUser;
