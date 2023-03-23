//import liraries
import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  TextInput,
  Keyboard,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import tw from 'twrnc';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import {DarkMode} from '../../config/DarkMode';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import {launchImageLibrary} from 'react-native-image-picker';
import ReceiverMessage from '../../components/SenderMessage';
import SenderMessage from '../../components/ReceiverMessage';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useAuth from '../../auth/useAuth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AgoraUIKit, {VideoRenderMode} from 'agora-rn-uikit';
import {APPID, CHANNEL, TOKEN} from '../../auth/Secret';

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
const Chat = () => {
  const {user} = useAuth();
  const {params} = useRoute();
  const navigation = useNavigation();
  const {matchedDetails} = params;

  const [input, setInput] = useState('');
  const themes = useContext(DarkMode);
  const [callAlert, setCallAlert] = useState([]);
  const [messages, setMessages] = useState([]);
  const [videoCall, setVideoCall] = useState(false);
  const [IsFocused, setIsFocused] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const db = firestore()
    .collection('matches')
    .doc(matchedDetails.id)
    .collection('messages');
  const callDb = firestore()
    .collection('matches')
    .doc(matchedDetails.id)
    .collection('calls');

  useEffect(() => {
    db.orderBy('timestamp', 'desc')
      .get()
      .then(querySnapshot => {
        setMessages(
          querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      })
      .catch(error => console.log(error));
  }, [matchedDetails, db]);

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

  // send message
  const sendMessage = () => {
    db.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
      image: matchedDetails.users[user.uid].image,
      message: input,
    });

    // clear keyboard input after sending a message
    setInput('');
  };

  // send image message
  const sendImageMessage = async () => {
    const options = {
      quality: 1,
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };

    await launchImageLibrary(options, res => {
      setLoadImage(true);
      if (res.didCancel) {
        setLoadImage(false);
        console.log('User cancelled image picker');
      } else if (res.errorMessage) {
        setLoadImage(false);
        console.log('ImagePicker Error:', res.errorMessage);
      } else {
        setLoadImage(true);
        // get image uri
        const imagePath = res.assets[0].uri;
        // remove the file path and get only the image name
        const imageName = imagePath.replace(
          'file:///data/user/0/com.lovafrica/cache/',
          '',
        );

        // upload to secondary or custom storage bucket
        let reference = storage().ref(`messages://${imageName}`);
        let task = reference.putFile(imagePath);
        task
          .then(async () => {
            // get the new image url from firebase storage bucket and send image as message
            const newImageUrl = await storage()
              .ref(`messages://${imageName}`)
              .getDownloadURL();
            db.add({
              timestamp: firestore.FieldValue.serverTimestamp(),
              userId: user.uid,
              name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
              image: matchedDetails.users[user.uid].image,
              message: newImageUrl,
            });
            // set loader to false and show image
            setLoadImage(false);
          })
          .catch(e => {
            console.log('uploading image error:', e);
          });
      }
    });
  };

  // video call functions
  const connectionData = {
    appId: APPID,
    channel: CHANNEL,
    token: TOKEN,
  };

  // calling user function
  const sendCallAlert = () => {
    // send the user an alert
    callDb.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
      connectionData: connectionData,
      message: 'Calling',
    });
    // set video call to true and then show video call
    setVideoCall(true);
  };

  // ending call function
  const sendCancelCallAlert = () => {
    // send the user an alert
    callDb.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
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
        name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
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

  const Icons = () => {
    return (
      <View style={tw`flex justify-start`}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChatStarter', {theme: themes, matchedDetails})
          }
          style={tw`flex justify-start items-center`}>
          <Entypo name="new-message" size={28} color="#cc0000" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <React.Fragment>
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
          <View style={tw`w-full h-full`}>
            {/* Header */}
            <View style={[styles.flex, tw` bg-white shadow py-5 mb-2`]}>
              <View style={tw`px-6  flex-row items-center`}>
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack(null)}>
                    <Ionicons name="chevron-back" size={30} color="#cc0000" />
                  </TouchableOpacity>
                </View>

                <View style={tw`ml-3`}>
                  <Pressable style={tw`w-full flex flex-row`}>
                    <View style={tw`flex items-center rounded-full`}>
                      <Image
                        source={{
                          uri: getMatchedUserInfo(
                            matchedDetails.users,
                            user.uid,
                          ).image,
                        }}
                        style={tw`h-8 w-8 rounded-full`}
                      />
                    </View>
                    <View style={tw`pl-2  flex justify-center`}>
                      <Text
                        style={[
                          {fontFamily: 'Bold'},
                          tw`text-base text-black`,
                        ]}>
                        {
                          getMatchedUserInfo(matchedDetails.users, user.uid)
                            .name
                        }
                      </Text>
                      <Text
                        style={[
                          {fontFamily: 'Regular'},
                          tw`text-xs text-black`,
                        ]}>
                        Available
                      </Text>
                    </View>
                  </Pressable>
                </View>

                <View
                  style={tw`flex flex-grow flex-row justify-center items-center justify-end`}>
                  <View>
                    <TouchableOpacity style={tw`pl-1`} onPress={sendCallAlert}>
                      <Ionicons name="videocam" size={24} color="#cc0000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
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

            {/* // message boards show up here */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={tw`flex-1`}
              keyboardVerticalOffset={10}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList
                  data={messages}
                  inverted={-1}
                  keyExtractor={item => item.id}
                  renderItem={({item: message}) =>
                    message.userId === user.uid ? (
                      <ReceiverMessage key={message.id} message={message} />
                    ) : (
                      <SenderMessage key={message.id} message={message} />
                    )
                  }
                />
              </TouchableWithoutFeedback>

              {/* show loading indicator as inage is being uploaded */}
              {loadImage ? (
                <View
                  style={tw`flex flex-grow flex-row justify-center items-center justify-end mr-24 my-4`}>
                  <ActivityIndicator size="large" color="#cc0000" />
                </View>
              ) : null}

              <View
                style={[
                  tw`flex flex-row rounded-full bg-gray-200 items-center h-12 w-full px-4 mb-2 mt-2  `,
                  {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}>
                <View style={IsFocused ? {width: '90%'} : {width: '65%'}}>
                  <TextInput
                    placeholder="Start typing..."
                    placeholderTextColor={'grey'}
                    style={tw`h-full  w-full text-lg`}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </View>

                <View>
                  {IsFocused ? (
                    <View style={tw`w-6/6`}>
                      <TouchableOpacity onPress={sendMessage}>
                        <Text>
                          <MaterialCommunityIcons
                            name="send"
                            size={32}
                            color="#cc0000"
                          />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={tw`flex w-1/2 flex-row   `}>
                      <TouchableOpacity style={[tw` flex-row mr-1 `]}>
                        <Icons />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`items-center ml-2 `}
                        onPress={sendImageMessage}>
                        <MaterialCommunityIcons
                          name="paperclip"
                          size={30}
                          color="#cc0000"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      )}
    </React.Fragment>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  div: {
    flexWrap: 'wrap',
  },
});

//make this component available to the app
export default Chat;
