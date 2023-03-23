//import liraries
import React, {useState, Fragment, useEffect, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import TopNav from '../../components/TopNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import firestore from '@react-native-firebase/firestore';
import Cards from '../../components/Cards';
import Loading from '../../components/Loading';
import useAuth from '../../auth/useAuth';
import {DarkMode} from '../../config/DarkMode';
import CountryFlag from 'react-native-country-flag';
import VideoProvider from '../../auth/VideoProvider';
import {APPID, CHANNEL, TOKEN} from '../../auth/Secret';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import AgoraVideo from '../../components/videoCall/AgoraVideo';

// create a component
const ProfileInfo = ({route}) => {
  const navigation = useNavigation();

  const {user} = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  // setTheme
  const themes = useContext(DarkMode);
  const [color, setColor] = useState(themes.color);
  // video call states below
  const [callAlert, setCallAlert] = useState([]);
  const [videoCall, setVideoCall] = useState(false);
  const [currentMatch, setCurrentMatch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [matchedDetails, setMatchedDetails] = useState([]);

  // get db instances
  const callDb = firestore()
    .collection('matches')
    .doc(currentMatch.id)
    .collection('calls');
  const db = firestore()
    .collection('matches')
    .where('usersMatched', 'array-contains', user.uid);

  useEffect(() => {
    if (themes.color === 'dark' || themes.color === '#202124') {
      setColor('#cc0000');
    } else {
      setColor(themes.color);
    }
  });

  //get matchedUser
  useEffect(() => {
    const subscriber = firestore()
      .collection('matches')
      .where('usersMatched', 'array-contains', user.uid)
      .get()
      .then(querySnapshot =>
        setMatches(
          querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      );

    return () => subscriber;
  }, [user]);

  const InfoNote = () => {
    Alert.alert('Cannot Send a Message', "You're yet to be matched!. ", [
      {text: 'OK'},
    ]);
  };

  // 1. get all matches id
  useEffect(() => {
    async function getCallLogs() {
      await db
        .get()
        .then(querySnapshot => {
          if (querySnapshot._docs[0]._exists) {
            setMatchedDetails(
              querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              })),
            );
          }
        })
        .then(() => {
          for (let i = 0; i < matchedDetails.length; i++) {
            let matched = matchedDetails[i];
            firestore()
              .collection('matches')
              .doc(matched.id)
              .collection('calls')
              .orderBy('timestamp', 'desc')
              .get()
              .then(querySnapshot => {
                setCurrentMatch(matched);
                let allCalls = [];
                allCalls.push(
                  querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                  })),
                );
                // set last entered call to lastCall array
                const lastCall = allCalls[0].shift();

                // check and handle user calling
                if (
                  lastCall?.userId !== user.uid &&
                  lastCall?.message === 'Calling'
                ) {
                  setCallAlert(lastCall);
                  setModalVisible(true);
                } else {
                  setCallAlert(lastCall);
                  setModalVisible(false);
                  setVideoCall(false);
                }
              })
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    }
    getCallLogs();

    return () => getCallLogs();
  }, [db]);

  // connection data
  const connectionData = {
    appId: APPID,
    channel: CHANNEL,
    token: TOKEN,
  };

  // accept call
  const acceptCall = () => {
    setVideoCall(!videoCall);
  };

  // ending user function
  const sendCancelCallAlert = () => {
    // send the user an alert
    callDb.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(currentMatch.users, user.uid).name,
      connectionData: connectionData,
      message: 'Cancel Call',
    });

    setTimeout(() => {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Call Canceled',
        visibilityTime: 3000,
        autoHide: true,
      });
    }, 1000);
  };

  // end call and close video
  const rtcCallbacks = {
    EndCall: () => {
      // set video call to false to end call
      setVideoCall(false);

      // send the user an alert
      callDb.add({
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        name: getMatchedUserInfo(currentMatch.users, user.uid).name,
        connectionData: connectionData,
        message: 'End Call',
      });

      setTimeout(() => {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Call ended',
          visibilityTime: 2000,
          autoHide: true,
        });
      }, 2000);
    },
  };
  // user call logs functions ends here

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

  const ImgCarousel = ({fileName}) => {
    return (
      <View style={tw`border rounded-xl mr-4 border-gray-200`}>
        <Image style={tw`h-32 w-32`} source={fileName} />
      </View>
    );
  };

  // load state for 2secs
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView
          style={[{backgroundColor: themes.background}, tw`flex-1`]}>
          {/* Top Navigation */}
          <TopNav />

          <React.Fragment>
            {videoCall || callAlert.length > 0 ? (
              <AgoraVideo rtcCallbacks={rtcCallbacks} />
            ) : (
              <ScrollView style={tw`h-full `}>
                <View style={tw`flex-1 px-4`}>
                  <View style={tw`mt-4`} />

                  <Toast
                    config={toastConfig}
                    innerRef={res => {
                      Toast.setRef(res);
                    }}
                  />

                  <VideoProvider
                    callAlert={callAlert}
                    setVideoCall={acceptCall}
                    isModalVisible={isModalVisible}
                    sendCancelCallAlert={sendCancelCallAlert}
                  />

                  {/* User Info Header */}
                  <View style={tw`flex items-center justify-center`}>
                    <View>
                      <Image
                        source={{uri: route.params.user.image}}
                        style={tw`h-20 w-20 rounded-full border `}
                      />
                    </View>
                    <View style={tw`pt-1 `}>
                      <Text
                        style={[
                          {fontFamily: 'Bold', color: themes.color},
                          tw`text-2xl flex items-center   `,
                        ]}>
                        <CountryFlag
                          isoCode={route.params.user.countryCode}
                          size={16}
                          style={tw`rounded `}
                        />{' '}
                        {route.params.user.name},{' '}
                        {calculateAge(route.params.user.dob)}
                      </Text>
                      <Text
                        style={[
                          {fontFamily: 'Light', color: themes.color},
                          tw`italic text-xs font-bold text-center opacity-50 `,
                        ]}>
                        ~3Mi away
                      </Text>
                    </View>
                  </View>

                  <View style={tw` pb-8 w-full `}>
                    {matches[0]?.id.includes(route.id) ? (
                      <View
                        style={tw`flex flex-row justify-evenly mx-5 items-center bottom-0  pt-4 `}>
                        <View style={[tw`flex justify-center items-center `]}>
                          <TouchableOpacity style={[tw`rounded-full `]}>
                            <AntDesign
                              name="message1"
                              size={32}
                              color={color}
                            />
                          </TouchableOpacity>
                          <Text
                            style={[
                              {fontFamily: 'Regular', color: themes.color},
                              tw`text-xs text-center`,
                            ]}>
                            Message
                          </Text>
                        </View>

                        <View style={[tw`flex justify-center items-center `]}>
                          <TouchableOpacity style={[tw`  rounded-full `]}>
                            <Ionicons name="videocam" size={32} color={color} />
                          </TouchableOpacity>
                          <Text
                            style={[
                              {fontFamily: 'Regular', color: themes.color},
                              tw`text-xs text-center`,
                            ]}>
                            Video Call
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* About me */}
                  <View style={tw` pb-8 px-2 w-full `}>
                    <View>
                      <Text
                        style={[
                          {fontFamily: 'Bold', color: color},
                          tw` text-xl   `,
                        ]}>
                        About Me.
                      </Text>
                    </View>

                    <View style={tw` `}>
                      <Text
                        style={[
                          {
                            fontFamily: 'Regular',
                            lineHeight: 23,
                            color: themes.color,
                          },
                          tw` pt-3`,
                        ]}>
                        {route.params.user.email_address}
                      </Text>
                    </View>
                  </View>

                  {/* Passion and Interest */}
                  <View style={tw` px-2 pb-8 w-full `}>
                    <View>
                      <Text
                        style={[
                          {fontFamily: 'Bold', color: color},
                          tw` text-xl  `,
                        ]}>
                        Passions & Interests.
                      </Text>
                    </View>

                    <View style={tw` w-full `}>
                      <View
                        style={tw`w-full flex-row items-start justify-start flex-wrap`}>
                        {route.params.user.hobbies.map((hobb, idx) => (
                          <Pressable
                            style={tw`border mt-2 border-gray-300 p-2 mx-1 flex justify-center  rounded-full`}
                            key={idx}>
                            <Text
                              style={[
                                {fontFamily: 'Regular', color: color},
                                tw``,
                              ]}>
                              {hobb}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Interest */}
                  <View style={tw`px-2 pb-8 w-full `}>
                    <Cards
                      title="Interested In"
                      slug={route.params.user.interested_in}
                    />

                    <Cards
                      title="Nationality"
                      slug={route.params.user.country}
                    />
                  </View>

                  {/* Chat starter */}
                  <View style={tw` px-2 pb-8 w-full `}>
                    <View>
                      <Text
                        style={[
                          {fontFamily: 'Bold', color: color},
                          tw` text-xl   `,
                        ]}>
                        Say Hello.
                      </Text>
                    </View>
                    <View style={tw` w-full`}>
                      <Cards
                        action={() => InfoNote()}
                        title="Chat Starter"
                        yes={
                          <AntDesign name="message1" size={22} color="black" />
                        }
                      />
                    </View>
                  </View>

                  {/* Media Images */}
                  <View style={tw` px-2 pb-8 w-full `}>
                    <View>
                      <Text
                        style={[
                          {fontFamily: 'Bold', color: color},
                          tw` text-xl `,
                        ]}>
                        Media.
                      </Text>
                    </View>
                    <View style={tw` w-full `}>
                      <ScrollView horizontal disableIntervalMomentum={true}>
                        <ImgCarousel
                          fileName={{uri: route.params.user.image}}
                        />
                      </ScrollView>
                    </View>
                  </View>

                  <View style={tw`px-2 pb-8 w-full `}>
                    <Cards
                      action={() => navigation.navigate('ReportUser')}
                      title="Report User"
                      yes={<Feather name="flag" size={20} color="#cc0000" />}
                    />
                  </View>
                </View>
              </ScrollView>
            )}
          </React.Fragment>
        </SafeAreaView>
      )}
    </Fragment>
  );
};

export default ProfileInfo;
