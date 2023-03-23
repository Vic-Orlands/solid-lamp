//import liraries
import React, {
  useState,
  useContext,
  useEffect,
  Fragment,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Switch,
  Dimensions,
} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Cards from '../../../components/Cards';
import myImgs from '../../../../assets/splash.png';
import TopNav from '../../../components/TopNav';
import FooterImg from '../../../components/FooterImg';

import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import useAuth from '../../../auth/useAuth';
import {DarkMode} from '../../../config/DarkMode';
import {EventRegister} from 'react-native-event-listeners';
import CountryFlag from 'react-native-country-flag';

// create a component
const EditProfile = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState([]);
  const themes = useContext(DarkMode);
  const [mode, setMode] = useState(true);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const imageUrl = image?.assets && image.assets[0].uri;

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .get()
      .then(documentSnapshot => {
        setProfile(
          documentSnapshot.docs
            .filter(doc => doc.id === user.uid)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            })),
        );
      });

    return () => subscriber;
  }, []);

  // select image
  const pickImage = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, setImage);
  }, []);

  //calculate age from returned dob
  const calculateAge = dateString => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveImage = async () => {
    setLoading(true);

    // get new image url from firebase storage
    const getImageName = imageUrl.replace(
      'file:///data/user/0/com.lovafrica/cache/',
      '',
    );
    let reference = storage().ref(`profileImages://${getImageName}`);
    let task = reference.putFile(imageUrl);
    task
      .then(async () => {
        console.log('Image uploaded to the bucket!');

        const newImageUrl = await storage()
          .ref(`profileImages://${getImageName}`)
          .getDownloadURL();

        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            image: newImageUrl,
            timeStamp: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            setLoading(false);

            Toast.show({
              type: 'success',
              position: 'top',
              text1: `Image has been saved successfully!`,
            });

            setTimeout(() => {
              navigation.navigate('Feeds');
            }, 2000);
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
            Toast.show({
              type: 'error',
              position: 'top',
              text1: error.code,
              text2: 'Error uploading image. Ttry again later',
            });
          });
      })
      .catch(e => {
        console.log('uploading image error => ', e);
      });
  };

  // style the toast messages
  const {width} = Dimensions.get('window');
  const toastConfig = {
    success: internalState => (
      <View
        style={{
          height: 45,
          width: width - 20,
          marginTop: -15,
          zIndex: 2,
          backgroundColor: '#10873a',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 15,
        }}>
        <Text style={{fontSize: 14, color: '#fff'}}>{internalState.text1}</Text>
      </View>
    ),
    error: internalState => (
      <View
        style={{
          height: 45,
          width: width - 20,
          marginTop: 0,
          zIndex: 2,
          backgroundColor: '#CC0000',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 15,
        }}>
        <Text style={{fontSize: 14, color: '#fff'}}>{internalState.text1}</Text>
      </View>
    ),
  };

  const Photo = ({ImageHere, icon}) => {
    return (
      <Fragment>
        {image ? (
          <View style={tw`w-24 h-24 relative rounded-3xl`}>
            <ImageBackground
              source={{uri: imageUrl}}
              resizeMode="cover"
              style={tw`h-full w-full`}>
              <View
                style={[
                  {backgroundColor: '#cc0000'},
                  tw` rounded-full right-0 absolute bottom-0 flex-row items-center`,
                ]}>
                <View>
                  <TouchableOpacity onPress={() => setImage(null)}>
                    {icon}
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View style={tw`w-24 h-24 relative rounded-xl`}>
            <ImageBackground
              source={{uri: profile[0]?.image}}
              resizeMode="cover"
              style={tw`h-full w-full rounded-xl`}>
              <View
                style={[
                  {backgroundColor: '#cc0000'},
                  tw` rounded-full right-0 absolute bottom-0 flex-row items-center`,
                ]}
              />
            </ImageBackground>
          </View>
        )}
      </Fragment>
    );
  };

  const AddImage = () => {
    return (
      <Fragment>
        <View style={tw`mb-6 flex-row justify-evenly`}>
          <Photo
            ImageHere={myImgs}
            icon={<Entypo name="cross" size={20} color="white" />}
          />
        </View>

        <View
          style={[
            tw`w-full bg-gray-200 rounded-lg mt-1`,
            {backgroundColor: '#cc0000'},
          ]}>
          {!image ? (
            <TouchableOpacity
              style={tw`p-4 bottom-0 right-0 flex-row justify-center w-full`}
              onPress={pickImage}>
              <AntDesign name="plussquare" size={24} color="white" />
              <Text
                style={[
                  {fontFamily: 'Bold'},
                  tw` ml-4 text-center flex justify-center  text-white text-base`,
                ]}>
                Change Avatar
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={tw`p-4 bottom-0 right-0 flex-row justify-center w-full`}
              onPress={handleSaveImage}>
              <AntDesign name="plussquare" size={24} color="white" />
              <Text
                style={[
                  {fontFamily: 'Bold'},
                  tw` ml-4 text-center flex justify-center  text-white  text-base`,
                ]}>
                {!loading ? 'Update Avatar' : 'Updating...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Fragment>
    );
  };

  const SettingMyProfile = () => {
    return (
      <Fragment>
        <View style={[tw`w-full `]}>
          {/* Add Profile Images */}
          <AddImage />
          {/*  */}
          <View style={tw`mt-12`} />
          <Text
            style={[{fontFamily: 'Bold', color: themes.color}, tw` text-xl`]}>
            My Settings
          </Text>

          <Cards
            title="Profile Name"
            slug={profile[0]?.name}
            yes={
              <MaterialIcons
                name="arrow-forward-ios"
                size={24}
                color="#cc0000"
              />
            }
            action={() => navigation.navigate('ChangeName')}
          />

          <Cards
            title="Phone Number"
            slug={profile[0]?.phone_number}
            yes={
              <MaterialIcons
                name="arrow-forward-ios"
                size={24}
                color="#cc0000"
              />
            }
            action={() => navigation.navigate('ChangePhoneNumber')}
          />

          <Cards
            title="Change Password"
            action={() => navigation.navigate('ChangePassword')}
            yes={<Ionicons name="key-sharp" size={24} color="#cc0000" />}
          />

          <Cards
            title="Age"
            slug={calculateAge(profile[0]?.dob)}
            // yes={<MaterialIcons name="arrow-forward-ios" size={24} color="#cc0000" />}
            // action={() => navigation.navigate('ChangeAge')}
          />

          <Cards
            title="Gender"
            slug={profile[0]?.sex}
            // yes={<MaterialIcons name="arrow-forward-ios" size={24} color="#cc0000" />}
            // action={() => navigation.navigate('ChangeGender')}
          />

          <Cards
            title="Dark Mode"
            yes={
              <Switch
                thumbColor={mode ? '#cc0000' : '#f4f3f4'}
                trackColor={{false: 'gray', true: 'gray'}}
                ios_backgroundColor="#3e3e3e"
                value={mode}
                onValueChange={value => {
                  setMode(value);
                  EventRegister.emit('changeTheme', mode);
                }}
              />
            }
          />
        </View>
      </Fragment>
    );
  };

  const MyProfilePreference = () => {
    return (
      <Fragment>
        <View style={[tw`w-full mt-8`]}>
          <Text
            style={[{fontFamily: 'Bold', color: themes.color}, tw` text-xl`]}>
            My Preferences
          </Text>
          <Cards
            title={
              profile[0]?.interested_in === 'Male'
                ? 'Men'
                : profile[0]?.interested_in === 'Female'
                ? 'Women'
                : 'Both Men and Female'
            }
            action={() => navigation.navigate('ChangeInterest')}
            yes={
              <MaterialIcons
                name="arrow-forward-ios"
                size={24}
                color="#cc0000"
              />
            }
          />

          <Cards
            title={profile[0]?.country}
            slug={
              <CountryFlag
                isoCode={profile.length > 0 ? profile[0]?.countryCode : 'de'}
                size={16}
                style={tw`rounded`}
              />
            }
            yes={
              <MaterialIcons
                name="arrow-forward-ios"
                size={24}
                color="#cc0000"
              />
            }
          />
        </View>
      </Fragment>
    );
  };

  return (
    <SafeAreaView style={[{backgroundColor: themes.background}, tw`flex-1`]}>
      {/* Top Navigation */}
      <TopNav Title="Edit Profile" />

      <Toast
        config={toastConfig}
        refs={innerRefs => {
          Toast.setRef(innerRefs);
        }}
      />

      <ScrollView style={tw`h-full `}>
        <View style={tw`flex-1`}>
          <View style={tw`flex`}>
            <View style={tw`w-full`}>
              <View style={tw`px-6 w-full`}>
                <View style={tw`pb-4 mt-8 h-full`}>
                  {/* PROFILE SETUP */}
                  <SettingMyProfile />
                  {/* PROFILE SETUP */}

                  <MyProfilePreference />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={tw`my-6 `} />

        <FooterImg />
      </ScrollView>
    </SafeAreaView>
  );
};

//make this component available to the app
export default EditProfile;
