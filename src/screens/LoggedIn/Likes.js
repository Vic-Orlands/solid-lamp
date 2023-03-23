//import libraries
import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import tw from 'twrnc';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import useAuth from '../../auth/useAuth';
import Loading from '../../components/Loading';
import {DarkMode} from '../../config/DarkMode';
import VideoProvider from '../../auth/VideoProvider';
import firestore from '@react-native-firebase/firestore';
import {APPID, CHANNEL, TOKEN} from '../../auth/Secret';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import AgoraVideo from '../../components/videoCall/AgoraVideo';

// create a component
const Likes = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [likes, setLikes] = useState(true);
  const [loading, setLoading] = useState(true);
  const [likedUsers, setLikedusers] = useState([]);
  const [matchedUsers, setMatchedusers] = useState([]);
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

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  // setTheme
  const themes = useContext(DarkMode);

  useEffect(() => {
    const fetchUsersProfiles = async () => {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('likes')
        .get()
        .then(documentSnapshot =>
          setLikedusers(
            documentSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })),
          ),
        );
    };
    fetchUsersProfiles();

    return () => fetchUsersProfiles();
  }, []);

  useEffect(() => {
    const subscriber = db.get().then(querySnapshot =>
      setMatchedusers(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      ),
    );

    return () => subscriber;
  }, []);

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

  const Liked = ({item, details, user}) => {
    const matchUsersInfo = !likes
      ? getMatchedUserInfo(details.users, user.uid)
      : null;

    return (
      <View style={tw`w-full`}>
        {likes ? (
          <View>
            <View
              style={[
                tw`w-40 h-40 relative mb-2`,
                {borderRadius: 7, borderWidth: 2, borderColor: '#ddd'},
              ]}>
              <Pressable
                onPress={() =>
                  navigation.navigate('ProfileInfo', {user: item})
                }>
                <ImageBackground
                  source={{uri: item.image}}
                  resizeMode="cover"
                  style={tw`h-full w-full`}>
                  <View
                    style={tw`bg-black bg-opacity-30 w-full left-0 absolute bottom-0`}>
                    <Text
                      style={[
                        {fontFamily: 'Bold'},
                        tw`  p-2 text-xs text-white overflow-hidden  `,
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <View
              style={[
                tw`w-40 h-40 relative mb-2`,
                {borderRadius: 5, borderWidth: 2, borderColor: '#ddd'},
              ]}>
              <Pressable
                onPress={() =>
                  navigation.navigate('ProfileInfo', {user: matchUsersInfo})
                }>
                <ImageBackground
                  source={{uri: matchUsersInfo.image}}
                  resizeMode="cover"
                  style={tw`h-full w-full`}>
                  <View
                    style={tw`bg-black bg-opacity-30 w-full left-0 absolute bottom-0`}>
                    <Text
                      style={[
                        {fontFamily: 'Bold'},
                        tw`text-white p-2 text-xs overflow-hidden`,
                      ]}>
                      {matchUsersInfo.name}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <React.Fragment>
      {videoCall ? (
        <AgoraVideo rtcCallbacks={rtcCallbacks} />
      ) : (
        <SafeAreaView
          style={[styles.container, {backgroundColor: themes.background}]}>
          <View style={tw`mt-3 h-full`}>
            {/* Header */}
            <View>
              <Header
                activeLikes={tw`underline border-b-2 border-red-700  pb-1`}
              />
            </View>
            {/* Header */}
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

            <View
              style={
                themes.color === 'dark' || themes.color === '#202124'
                  ? tw`px-6 border-t border-b border-gray-200 mt-6 flex  flex-row w-full justify-around`
                  : tw`px-6 border-t border-b border-gray-700 mt-6 flex  flex-row w-full justify-around`
              }>
              <TouchableOpacity style={tw`p-2`} onPress={() => setLikes(true)}>
                <Text
                  style={[
                    likes
                      ? {fontFamily: 'Bold', color: themes.color, opacity: 1}
                      : {fontFamily: 'Bold', color: themes.color, opacity: 0.4},
                    tw`text-xl w-full `,
                  ]}>
                  My Likes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={tw`p-2`} onPress={() => setLikes(false)}>
                <Text
                  style={[
                    !likes
                      ? {fontFamily: 'Bold', opacity: 1, color: themes.color}
                      : {
                          fontFamily: 'Bold',
                          opacity: 0.4,
                          color: themes.color,
                        },
                    tw`text-xl w-full `,
                  ]}>
                  My Matches
                </Text>
              </TouchableOpacity>
            </View>

            <View style={tw`mt-5`} />
            {loading ? (
              <Loading />
            ) : likes ? (
              <View style={tw`px-6 mb-6 w-full`}>
                {likedUsers.length > 0 ? (
                  <View>
                    <FlatList
                      data={likedUsers}
                      renderItem={Liked}
                      extraData={likedUsers}
                      keyExtractor={item => item.id}
                      contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={tw`w-full flex flex-row justify-evenly items-center`}>
                    <Text
                      style={[
                        {
                          fontFamily: 'Regular',
                          color: themes.color,
                          fontSize: 20,
                        },
                        tw` p-2`,
                      ]}>
                      You haven't liked anybody yet
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={tw`px-6 mb-6 w-full`}>
                {matchedUsers.length > 0 ? (
                  <View style={tw``}>
                    <FlatList
                      data={matchedUsers}
                      extraData={matchedUsers}
                      keyExtractor={item => item.id}
                      renderItem={({item}) => (
                        <Liked details={item} user={user} />
                      )}
                      contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={tw`w-full flex flex-row justify-evenly items-center`}>
                    <Text
                      style={[
                        {
                          fontFamily: 'Regular',
                          color: themes.color,
                          fontSize: 20,
                        },
                        tw`   p-2 `,
                      ]}>
                      You haven't matched with anybody yet
                    </Text>
                  </View>
                )}
              </View>
            )}
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
});

//make this component available to the app
export default Likes;
