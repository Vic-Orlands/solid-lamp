//import liraries
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from 'twrnc';
import Modal from 'react-native-modal';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import {DarkMode} from '../../config/DarkMode';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import AgoraUIKit, {VideoRenderMode} from 'agora-rn-uikit';
import {APPID, CHANNEL, TOKEN} from '../../auth/Secret';
import useAuth from '../../auth/useAuth';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';

// create style for the video
const btnStyle = {
  borderRadius: 30,
  padding: 10,
  width: 50,
  borderWidth: 0,
  height: 50,
  backgroundColor: '#F0E0E0',
};

const remoteBtnStyle = {backgroundColor: '#2edb8555'};

const props = {
  styleProps: {
    iconSize: 30,
    theme: '#CC0000',
    videoMode: {
      max: VideoRenderMode.Hidden,
      min: VideoRenderMode.Hidden,
    },
    overlayContainer: {
      backgroundColor: '#F0E0E0',
      opacity: 1,
    },
    localBtnStyles: {
      muteLocalVideo: btnStyle,
      muteLocalAudio: btnStyle,
      switchCamera: btnStyle,
      endCall: {
        borderRadius: 30,
        width: 50,
        height: 50,
        backgroundColor: '#CC0000',
        borderWidth: 0,
      },
    },
    localBtnContainer: {
      backgroundColor: '#fff',
      bottom: 0,
      paddingVertical: 10,
      height: 80,
    },
    maxViewRemoteBtnContainer: {
      top: 0,
      alignSelf: 'flex-end',
    },
    remoteBtnStyles: {
      muteRemoteAudio: remoteBtnStyle,
      muteRemoteVideo: remoteBtnStyle,
      remoteSwap: remoteBtnStyle,
      minCloseBtnStyles: remoteBtnStyle,
    },
    minViewContainer: {
      bottom: 80,
      top: undefined,
      backgroundColor: '#fff',
      borderColor: '#F0E0E0',
      borderWidth: 1,
      height: '15%',
    },
    minViewStyles: {
      height: '100%',
    },
    maxViewStyles: {
      height: '64%',
    },
    UIKitContainer: {height: '94%'},
  },
};

// create a component
const SpeedDating = () => {
  const {user} = useAuth();
  const {params} = useRoute();
  const {userSwiped, matchedUserDetails} = params;
  const navigation = useNavigation();
  const themes = useContext(DarkMode);
  const [callAlert, setCallAlert] = useState([]);
  const [videoCall, setVideoCall] = useState(false);
  const [loadMatch, setLoadMatch] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const callDb = firestore()
    .collection('explore')
    .doc(matchedUserDetails.id)
    .collection('calls');

  // video call functions
  const connectionData = {
    appId: APPID,
    channel: CHANNEL,
    token: TOKEN,
  };

  // check if user is calling
  useEffect(() => {
    let unsub = callDb
      .orderBy('timestamp', 'desc')
      .get()
      .then(querySnapshot => {
        const allCalls = [];
        allCalls.push(
          querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
        // get last call from list of call array
        const lastCall = allCalls[0].shift();

        if (
          allCalls.length > 0 &&
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
      .catch(error => {
        console.log(error);
      });

    return () => unsub;
  }, [callDb]);

  // function to handle video call
  const startVideoCall = () => {
    // send the user an alert
    callDb.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(matchedUserDetails.users, user.uid).name,
      connectionData: connectionData,
      message: 'Calling',
    });
    // set video call to true and then show video call
    setVideoCall(true);
  };

  // end call function
  const sendCancelCallAlert = () => {
    // send the user an alert
    callDb.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(matchedUserDetails.users, user.uid).name,
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
      // send the user an alert
      callDb.add({
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        name: getMatchedUserInfo(matchedUserDetails.users, user.uid).name,
        connectionData: connectionData,
        message: 'End Call',
      });
      // set video call to false to end call
      setVideoCall(false);

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

  const UsersImage = ({myImgs}) => {
    return (
      <View style={tw`flex w-full justify-evenly items-center`}>
        <View style={tw`w-48 h-48 relative bg-black bg-opacity-25 rounded-xl `}>
          <ImageBackground
            source={myImgs}
            resizeMode="contain"
            style={tw`h-full w-full rounded-xl`}
          />
        </View>
      </View>
    );
  };

  const MyMatch = () => {
    return (
      <Animated.View
        style={[
          tw`flex bg-white shadow justify-center items-center w-full rounded-lg py-4`,
        ]}
        entering={FadeIn.delay(100)}
        exiting={FadeOut.delay(200)}>
        <View style={tw`px-6`}>
          <View style={tw``}>
            <UsersImage
              myImgs={{uri: userSwiped.image}}
              username="Blind Date"
            />
          </View>
          <View style={tw`mt-8`}>
            <Text style={[{fontFamily: 'Bold'}, tw`leading-5 text-center`]}>
              Know more about your match by starting a video call.
            </Text>
          </View>
          <View style={tw`flex-row justify-between mt-12 mb-4 items-center`}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Explore')}
              style={[
                {backgroundColor: '#cc0000'},
                tw`p-3 mb-3 rounded-full `,
              ]}>
              <Entypo name="cross" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={startVideoCall}
              style={[tw`p-3 bg-black mb-3 rounded-full `]}>
              <Ionicons name="videocam" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  // set loader to false after 4secs
  setTimeout(() => {
    setLoadMatch(false);
  }, 4000);

  return (
    <>
      {videoCall || callAlert.length > 0 ? (
        <AgoraUIKit
          connectionData={
            callAlert.length > 0 ? callAlert.connectionData : connectionData
          }
          styleProps={props.styleProps}
          rtcCallbacks={rtcCallbacks}
        />
      ) : (
        <SafeAreaView
          style={[styles.container, {backgroundColor: themes.background}]}>
          <View style={tw`mt-3   h-full`}>
            {/* Header */}
            <View>
              <Header />
            </View>

            {/* toast message container */}
            <Toast
              config={toastConfig}
              innerRef={res => {
                Toast.setRef(res);
              }}
            />

            {/* show calling modal if isModalVisible is true and vice versa */}
            <Modal
              isVisible={isModalVisible}
              swipeDirection="left"
              backdropOpacity={0.3}
              animationIn="slideInDown"
              onSwipeComplete={sendCancelCallAlert}
              onBackdropPress={sendCancelCallAlert}
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  height: 100,
                  width: width - 20,
                  borderRadius: 20,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  backgroundColor: 'grey',
                }}>
                <Text style={{color: '#fff', fontSize: 24, paddingTop: 5}}>
                  {callAlert.name} calling...
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableWithoutFeedback onPress={sendCancelCallAlert}>
                    <View
                      style={{
                        flex: 1,
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cc0000',
                      }}>
                      <Text style={tw`text-white text-base`}>Cancel</Text>
                    </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={() => setVideoCall(true)}>
                    <View
                      style={{
                        flex: 1,
                        width: 45,
                        height: 45,
                        marginLeft: 60,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#10873a',
                      }}>
                      <Text style={tw`text-white text-base`}>Answer</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </Modal>

            <View
              style={
                themes.color === 'dark' || themes.color === '#202124'
                  ? tw`px-6 border-t border-b border-gray-200 mt-6 flex  flex-row w-full justify-around`
                  : tw`px-6 border-t border-b border-gray-700 mt-6 flex  flex-row w-full justify-around`
              }>
              <Pressable style={tw`p-2`}>
                {!loadMatch ? (
                  <Text
                    style={[
                      {fontFamily: 'Regular', color: themes.color},
                      tw`text-xl  w-full`,
                    ]}>
                    Best Match
                  </Text>
                ) : (
                  <Text
                    style={[
                      {fontFamily: 'Regular', color: themes.color},
                      tw`text-xl  w-full`,
                    ]}>
                    Loading Matches
                  </Text>
                )}
              </Pressable>
            </View>

            <View
              style={[tw`mt-8 w-full  flex  justify-center items-center px-6`]}>
              {!loadMatch && <MyMatch />}
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default SpeedDating;
