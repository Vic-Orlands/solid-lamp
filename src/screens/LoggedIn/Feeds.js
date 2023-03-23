//import liraries
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import Swiper from 'react-native-deck-swiper';

import firestore from '@react-native-firebase/firestore';
import {DarkMode} from '../../config/DarkMode';
import Loading from '../../components/Loading';
import generateId from '../../lib/generateID';
import useAuth from '../../auth/useAuth';
import tw from 'twrnc';

import {EventRegister} from 'react-native-event-listeners';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';
import VideoProvider from '../../auth/VideoProvider';
import {APPID, CHANNEL, TOKEN} from '../../auth/Secret';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import AgoraVideo from '../../components/videoCall/AgoraVideo';

// create a component
const Feeds = () => {
  const {user} = useAuth();
  const swipeRef = useRef(null);
  const navigation = useNavigation();
  const themes = useContext(DarkMode);
  // themeRefresh State
  const [mode, setMode] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const {isDarkTheme} = useContext(DarkMode);
  // video call states below
  const [callAlert, setCallAlert] = useState([]);
  const [videoCall, setVideoCall] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [matchedDetails, setMatchedDetails] = useState([]);

  setTimeout(() => {
    setLoading(false);
  }, 5000);

  // if user data does not exist, navigate user to complete sign up
  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        if (!documentSnapshot.exists) {
          navigation.navigate('DobInput');
        }
      });

    // prevent users from seeing the interface if not registered
    if (!subscriber) return <Loading />;

    return () => subscriber;
  }, []);

  // get all available profiles aside the users'
  useEffect(() => {
    prepareTheme();
    const fetchUsersProfiles = async () => {
      const passes = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('passes')
        .get()
        .then(documentSnapshot => documentSnapshot.docs.map(doc => doc.id));

      const swipes = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('swipes')
        .get()
        .then(documentSnapshot => documentSnapshot.docs.map(doc => doc.id));

      // get user sex
      const sex = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => documentSnapshot.data().interested_in);

      //get all users of opposite sex
      const oppositeGender = await firestore()
        .collection('users')
        .get()
        .then(documentSnapshot =>
          documentSnapshot.docs.filter(doc => doc.data().sex === sex),
        );

      const passedUserIds = passes.length > 0 ? passes : [''];
      const swipedUserIds = swipes.length > 0 ? swipes : [''];

      firestore()
        .collection('users')
        .where('sex', '==', oppositeGender[0]._data.sex)
        .where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
        .get()
        .then(querySnapshot => {
          setProfiles(
            querySnapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              })),
          );
        });
    };
    fetchUsersProfiles();

    if (!fetchUsersProfiles) return <Loading />;

    return () => fetchUsersProfiles();
  }, []);

  // set darkMode auto  between 21:00 && 05:00
  function prepareTheme() {
    const hrs = new Date().getHours();

    if (
      hrs === 21 ||
      hrs === 20 ||
      hrs === 22 ||
      hrs === 23 ||
      hrs === 0 ||
      hrs === 1 ||
      hrs === 2 ||
      hrs === 3 ||
      hrs === 4 ||
      hrs === 5
    ) {
      setMode(true);
      EventRegister.emit('changeTheme', mode);
      setTimeout(() => {
        setMode(true);
      }, 6000);
    } else {
      setMode(false);
      EventRegister.emit('changeTheme', mode);
    }
  }

  // swipe left function to pass a user
  const swipeLeft = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('passes')
      .doc(userSwiped.id)
      .set(userSwiped);
  };

  // swipe bottom function to like a user
  const swipeBottom = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    Toast.show({
      type: 'success',
      position: 'top',
      text1: `You liked ${userSwiped.name} ☺️`,
    });
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('likes')
      .doc(userSwiped.id)
      .set(userSwiped);
  };

  // swipe right function to match with the user
  const swipeRight = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => documentSnapshot.data());

    firestore()
      .collection('users')
      .doc(userSwiped.id)
      .collection('swipes')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firestore()
            .collection('users')
            .doc(user.uid)
            .collection('swipes')
            .doc(userSwiped.id)
            .set(userSwiped);

          firestore()
            .collection('matches')
            .doc(generateId(user.uid, userSwiped.id))
            .set({
              users: {
                [user.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              usersMatched: [user.uid, userSwiped.id],
              timestamp: firestore.FieldValue.serverTimestamp(),
            });
          navigation.navigate('MatchScreen', {loggedInProfile, userSwiped});
        } else {
          console.log(`You swiped "MATCH" on ${userSwiped.name}`);
        }
        firestore()
          .collection('users')
          .doc(user.uid)
          .collection('swipes')
          .doc(userSwiped.id)
          .set(userSwiped);
      });
  };

  const [currentMatch, setCurrentMatch] = useState('');
  const [currentExploreMatch, setCurrentExploreMatch] = useState('');
  // log into the matches array
  // log into the call collection
  // map through all matches in the call collection
  // get the last call log in all matches
  // check what the message in the call data is
  // using conditionals, make decisions for each scenario

  // db instances
  const db = firestore()
    .collection('matches')
    .where('usersMatched', 'array-contains', user.uid);
  const exploreDb = firestore()
    .collection('explore')
    .where('usersMatched', 'array-contains', user.uid);
  const callDb = firestore()
    .collection('matches')
    .doc(currentMatch.id)
    .collection('calls');
  const exploreCallDb = firestore()
    .collection('explore')
    .doc(currentExploreMatch.id)
    .collection('calls');

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

  // 2. get explore matches
  useEffect(() => {
    async function getCallLogs() {
      await exploreDb
        .get()
        .then(querySnapshot => {
          if (querySnapshot._docs[0]._exists) {
            setMatchedDetails([
              ...matchedDetails,
              querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              })),
            ]);
          }
        })
        .then(() => {
          for (let i = 0; i < matchedDetails.length; i++) {
            let matched = matchedDetails[i];
            firestore()
              .collection('explore')
              .doc(matched.id)
              .collection('calls')
              .orderBy('timestamp', 'desc')
              .get()
              .then(querySnapshot => {
                setCurrentExploreMatch(matched);
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

  const cancelExploreCallAlert = () => {
    // send the user an alert
    exploreCallDb.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      name: getMatchedUserInfo(currentExploreMatch.users, user.uid).name,
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

      exploreCallDb.add({
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        name: getMatchedUserInfo(currentExploreMatch.users, user.uid).name,
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

  const Like = () => {
    return (
      <View style={tw`flex items-center`}>
        <View
          style={[{backgroundColor: '#4CD964'}, tw`p-3 mb-3 rounded-full `]}>
          <AntDesign name="heart" size={30} color="white" />
        </View>
        <Text
          style={[
            {fontFamily: 'Bold', color: '#4CD964', borderColor: '#4CD964'},
            tw` text-base border rounded-xl px-3 pt-1`,
          ]}>
          LIKE
        </Text>
      </View>
    );
  };

  const Nope = () => {
    return (
      <View style={tw`flex items-center`}>
        <View
          style={[{backgroundColor: '#cc0000'}, tw`p-3 mb-3 rounded-full `]}>
          <Entypo name="cross" size={34} color="white" />
        </View>
        <Text
          style={[
            {fontFamily: 'Bold', color: '#cc0000', borderColor: '#cc0000'},
            tw` text-base border rounded-xl px-3 pt-1`,
          ]}>
          NOPE
        </Text>
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
          <View style={tw`mt-3   h-full`}>
            {/* Header */}
            <Header
              activeHome={tw`underline border-b-2 border-red-700  pb-1`}
              darkTheme={isDarkTheme}
            />
            {/* Header */}
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
              cancelExploreCallAlert={cancelExploreCallAlert}
            />

            {/* Cards */}
            {loading ? (
              <Loading />
            ) : (
              <React.Fragment>
                <View style={tw` flex w-full rounded-xl`}>
                  <Swiper
                    ref={swipeRef}
                    containerStyle={{backgroundColor: 'transparent'}}
                    stackSize={3}
                    cardIndex={0}
                    onSwipedLeft={cardIndex => {
                      swipeLeft(cardIndex);
                    }}
                    onSwipedRight={cardIndex => {
                      swipeRight(cardIndex);
                    }}
                    onSwipedBottom={cardIndex => {
                      swipeBottom(cardIndex);
                    }}
                    overlayLabels={{
                      left: {
                        element: <Nope />,
                        title: 'NOPE',
                        style: {
                          label: {
                            backgroundColor: '#cc0000',
                            borderColor: '#cc0000',
                            color: '#fff',
                            borderWidth: 1,
                          },
                          wrapper: {
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            marginTop: 30,
                            marginLeft: -30,
                          },
                        },
                      },
                      right: {
                        element: <Like />,
                        title: 'LIKE',
                        style: {
                          label: {
                            backgroundColor: 'white',
                            borderColor: '#4ded30',
                            color: '#4ded30',
                            borderWidth: 1,
                          },
                          wrapper: {
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: 30,
                            marginLeft: 30,
                          },
                        },
                      },
                    }}
                    animateCardOpacity
                    verticalSwipe={false}
                    cards={profiles}
                    renderCard={card =>
                      card ? (
                        <View
                          key={card.id}
                          style={tw`bg-red-400 h-3/4 rounded-xl`}>
                          <Image
                            source={{uri: card.image}}
                            style={tw`h-full w-full rounded-xl`}
                          />

                          <View
                            style={tw`flex-row flex items-center justify-center absolute bottom-0 bg-white w-full h-16 bg-opacity-10 rounded-b-xl`}>
                            <View style={tw`flex items-center`}>
                              <Text
                                style={[
                                  {fontFamily: 'Bold'},
                                  tw` pt-3 text-base text-white `,
                                ]}>
                                {card.name}, {calculateAge(card.dob)}
                              </Text>
                            </View>
                            <View style={tw`flex items-center  pl-2`}>
                              <Pressable
                                onPress={() =>
                                  navigation.navigate('ProfileInfo', {
                                    user: card,
                                  })
                                }>
                                <Entypo
                                  name="info-with-circle"
                                  size={20}
                                  color="#cc0000"
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={tw` bg-white h-3/4 rounded-xl justify-center items-center  pb-5 shadow`}>
                          <Text style={tw`text-2xl text-black`}>
                            No more users...
                          </Text>
                          <Text style={{fontSize: 50}}> &#x2639; </Text>
                        </View>
                      )
                    }
                  />
                </View>
                {/* Cards */}

                {/* Alt Card */}
                <View style={tw`bottom-0 pb-20 absolute w-full `}>
                  <View
                    style={tw`flex flex-row justify-evenly mx-5 items-center bottom-0 px-4 pt-4 `}>
                    <View>
                      <TouchableOpacity
                        onPress={() => swipeRef.current.swipeLeft()}
                        style={[
                          {backgroundColor: '#cc0000'},
                          tw`p-3 mb-3 rounded-full `,
                        ]}>
                        <Entypo name="cross" size={30} color="white" />
                      </TouchableOpacity>
                    </View>

                    <View>
                      <TouchableOpacity
                        onPress={() => swipeRef.current.swipeBottom()}
                        style={[
                          {backgroundColor: '#E89528'},
                          tw`p-3 mb-3 rounded-full `,
                        ]}>
                        <AntDesign name="star" size={30} color="white" />
                      </TouchableOpacity>
                    </View>

                    <View>
                      <TouchableOpacity
                        onPress={() => swipeRef.current.swipeRight()}
                        style={[
                          {backgroundColor: '#4CD964'},
                          tw`p-3 mb-3 rounded-full `,
                        ]}>
                        <AntDesign name="heart" size={30} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )}

            <View
              style={[
                {zIndex: 10},
                tw`absolute border border-gray-400/50 bottom-3   left-0 flex justify-center items-center w-full h-auto `,
              ]}>
              <BannerAd
                size={BannerAdSize.BANNER}
                unitId={TestIds.BANNER}
                style={[{zIndex: 10}]}
              />
            </View>
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
  flex: {
    justifyContent: 'space-between',
  },
});

//make this component available to the app
export default Feeds;
