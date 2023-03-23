import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import useAuth from '../../auth/useAuth';
import moment from 'moment';
import tw from 'twrnc';
import VideoProvider from '../../auth/VideoProvider';
import {APPID, CHANNEL, TOKEN} from '../../auth/Secret';
import AgoraVideo from '../../components/videoCall/AgoraVideo';

const ChatScroll = ({matchedDetails}) => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [time, setTime] = useState([]);
  const [lastMessage, setLastMessage] = useState('');
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  // video call states below
  const [callAlert, setCallAlert] = useState([]);
  const [videoCall, setVideoCall] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // get last message's exact date and time
  const fireBaseTime =
    time !== undefined
      ? new Date(time.seconds * 1000 + time.nanoseconds / 1000000)
      : null;
  const atLastMessageTime =
    time !== undefined ? moment(fireBaseTime).calendar() : null;

  // set the matched user using
  // I used useMemo here so that user remains cached and unchanged unless matchedUser or user changes
  useMemo(
    () =>
      setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users, user.uid)),
    [matchedDetails, user],
  );

  const {width} = Dimensions.get('window');
  const db = firestore()
    .collection('matches')
    .doc(matchedDetails.id)
    .collection('messages');

  useEffect(() => {
    const subscribe = db
      .orderBy('timestamp', 'desc')
      .get()
      .then(querySnapshot => {
        setLastMessage(querySnapshot.docs[0]?.data()?.message);
        setTime(querySnapshot.docs[0]?.data()?.timestamp);
      });

    return () => subscribe;
  }, [db]);

  // get call logs
  const callDb = firestore()
    .collection('matches')
    .doc(matchedDetails.id)
    .collection('calls');

  // check if user is calling
  useEffect(() => {
    const unsubscrbe = callDb
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

    return () => unsubscrbe;
  }, [callDb]);

  // video call functions
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
      name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
      connectionData: connectionData,
      message: 'Cancel Call',
    });

    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'Call Canceled',
      visibilityTime: 3000,
      autoHide: true,
    });
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
        name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
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

  // style the toast messages
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

  return (
    <React.Fragment>
      {videoCall ? (
        <AgoraVideo rtcCallbacks={rtcCallbacks} />
      ) : (
        <View>
          {/* toast message container */}
          {/* show calling modal if isModalVisible is true and vice versa */}
          <Toast
            config={toastConfig}
            innerRef={res => {
              Toast.setRef(res);
            }}
          />

          {/* Agora Video Component */}
          <VideoProvider
            callAlert={callAlert}
            setVideoCall={acceptCall}
            isModalVisible={isModalVisible}
            sendCancelCallAlert={sendCancelCallAlert}
          />

          <View
            style={[
              tw`w-full flex flex-row bg-gray-200 h-16 rounded-lg mt-3 justify-center`,
              {zIndex: -3},
            ]}>
            <TouchableOpacity
              style={tw`p-4 flex flex-row w-full`}
              onPress={() =>
                navigation.navigate('Chat', {
                  matchedDetails,
                })
              }>
              <View style={tw`flex items-center`}>
                <Image
                  source={{uri: matchedUserInfo?.image}}
                  style={tw`h-10 w-10 rounded-full m-auto ml-0`}
                />
              </View>
              <View style={tw`pl-3 w-48 flex-grow`}>
                <Text style={[{fontFamily: 'Bold'}, tw`text-base text-black`]}>
                  {matchedUserInfo?.name}
                </Text>
                {lastMessage !== undefined &&
                lastMessage.includes(
                  'https://firebasestorage.googleapis.com/v0/b/loveafrica-app-f167c.appspot.com',
                ) ? (
                  <Text
                    style={[
                      {fontFamily: 'Regular'},
                      tw`text-xs overflow-hidden flex-grow pb-4 text-black`,
                    ]}>
                    Image.jpeg
                  </Text>
                ) : (
                  <Text
                    style={[
                      {fontFamily: 'Regular'},
                      tw`text-xs overflow-hidden flex-grow pb-4 text-black`,
                    ]}>
                    {lastMessage || 'Say Hi'}
                  </Text>
                )}
              </View>

              <View style={tw`flex-grow m-auto`}>
                <Text
                  style={[
                    {fontFamily: 'Light'},
                    tw`text-xs text-right mr-0 text-black`,
                  ]}>
                  {time !== undefined ? atLastMessageTime : null}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default ChatScroll;
