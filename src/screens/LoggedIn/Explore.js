//import liraries
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';

// images
import useAuth from '../../auth/useAuth';
import generateId from '../../lib/generateID';
import speed from '../../../assets/speed.png';
import Header from '../../components/Header';
import {DarkMode} from '../../config/DarkMode';
import Loading from '../../components/Loading';
import * as image from '../../components/Images';
import firestore from '@react-native-firebase/firestore';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

// create a component
const Explore = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const themes = useContext(DarkMode);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentProfiles, setCurrentProfiles] = useState([]);

  const getInterestInstance = firestore().collection('users').doc(user.uid);
  const getOppositeGenderInstance = firestore().collection('users');

  useEffect(() => {
    async function getRandomMatch() {
      // get user's sex interest
      const interest = await getInterestInstance
        .get()
        .then(documentSnapshot => documentSnapshot.data().interested_in);

      //get all users of opposite sex
      const oppositeGender = await getOppositeGenderInstance
        .get()
        .then(documentSnapshot =>
          documentSnapshot.docs.filter(doc => doc.data().sex === interest),
        );

      getOppositeGenderInstance
        .where('sex', '==', oppositeGender[0]._data.sex)
        .get()
        .then(querySnapshot => {
          setCurrentProfiles(
            querySnapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              })),
          );
        });
    }
    getRandomMatch();
  }, []);

  // get a random user and match them together
  const handleMatchRandom = async () => {
    const random = Math.floor(Math.random() * currentProfiles.length);
    const userSwiped = currentProfiles[random];

    const loggedInProfile = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => documentSnapshot.data());

    const matchedUserDetails = {
      users: {
        [user.uid]: loggedInProfile,
        [userSwiped.id]: userSwiped,
      },
      id: generateId(user.uid, userSwiped.id),
    };

    await firestore()
      .collection('explore')
      .doc(generateId(user.uid, userSwiped.id))
      .set({
        users: {
          [user.uid]: loggedInProfile,
          [userSwiped.id]: userSwiped,
        },
        usersMatched: [user.uid, userSwiped.id],
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    navigation.navigate('SpeedDating', {userSwiped, matchedUserDetails});
  };

  const Modal = () => {
    return (
      <View
        style={[
          tw`w-full  flex absolute h-full justify-center items-center px-6 `,
        ]}>
        <Animated.View
          style={[
            !modal
              ? styles.hide
              : (styles.show,
                tw`flex bg-white shadow justify-center items-center w-full rounded-lg py-4  z-99 `),
          ]}
          entering={FadeIn.delay(100)}
          exiting={FadeOut.delay(100)}>
          <View style={tw`px-6`}>
            <Text style={[{fontFamily: 'Bold'}, tw`text-2xl text-black mt-4`]}>
              Speed Video Dating
            </Text>
            <View style={tw`mt-8`}>
              <Text style={[{fontFamily: 'Bold'}, tw`leading-5`]}>
                Make video calls with random available users that match with
                your interests.
              </Text>
            </View>
            <View style={tw`flex-row justify-between mt-12 mb-4 items-center`}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={[{backgroundColor: '#cc0000'}, tw`py-2 px-5 rounded`]}>
                <Text style={[{fontFamily: 'Bold'}, tw`text-white text-base`]}>
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleMatchRandom}
                style={[tw`py-2 px-6 bg-black/75 rounded`]}>
                <Text style={[{fontFamily: 'Bold'}, tw`text-white text-base`]}>
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  const SpeedDating = ({title}) => {
    return (
      <View style={tw`w-full  justify-center `}>
        {currentProfiles.length > 0 ? (
          <View style={tw`flex justify-evenly items-center`}>
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={tw`w-full h-48 relative rounded-xl  `}>
              <ImageBackground
                source={speed}
                resizeMode="contain"
                style={tw`h-full w-full rounded-xl `}>
                <View
                  style={tw`bg-black bg-opacity-25 w-full rounded-b-xl left-0 absolute bottom-0 flex-row items-center`}>
                  <Text
                    style={[
                      {fontFamily: 'Bold'},
                      tw` text-white p-4 text-xs w-32 overflow-hidden  `,
                    ]}>
                    {title}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`mt-6`}>
            <Text style={[{fontFamily: 'Bold'}, tw`leading-5`]}>
              Setting speed dating..., please wait a moment as we get you
              started!
            </Text>
          </View>
        )}
      </View>
    );
  };

  const Networks = ({name, myImgs}) => {
    return (
      <View style={tw`w-1/2  justify-center `}>
        <View style={tw`flex justify-evenly items-center`}>
          <TouchableOpacity
            onPress={() => navigation.replace('Feeds')}
            style={tw`w-32 h-32 relative rounded-2xl `}>
            <ImageBackground
              source={myImgs}
              resizeMode="cover"
              style={tw`h-full w-full rounded-2xl`}>
              <View
                style={tw`bg-black bg-opacity-25 w-full rounded-b-xl left-0 absolute bottom-0 flex-row items-center`}>
                <Text
                  style={[
                    {fontFamily: 'Bold'},
                    tw` text-white p-2 text-xs w-24 overflow-hidden  `,
                  ]}>
                  {name}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Row = ({imageName, imageName2, name, name2}) => {
    return (
      <View style={tw`my-4 w-full flex flex-row  justify-evenly items-center`}>
        <Networks myImgs={imageName} name={name} />
        <Networks myImgs={imageName2} name={name2} />
      </View>
    );
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SafeAreaView
          style={[styles.container, {backgroundColor: themes.background}]}>
          {modal && <Modal />}

          <View style={[modal ? styles.mode : null, tw`mt-3   h-full`]}>
            {/* Header */}
            <View>
              <Header />
            </View>
            {/* Header */}

            <View
              style={
                themes.color === 'dark' || themes.color === '#202124'
                  ? tw`px-6 border-t border-b border-gray-200 mt-6 flex    w-full justify-center`
                  : tw`px-6 border-t border-b border-gray-700 mt-6 flex    w-full justify-center`
              }>
              <Text
                style={[
                  {fontFamily: 'Bold', color: themes.color},
                  tw`text-center p-2 text-xl w-full `,
                ]}>
                Explore more to Love
              </Text>
            </View>

            <View style={tw`mt-5`} />
            <ScrollView>
              <View style={tw`px-6 mb-6 w-full`}>
                <View
                  style={tw`w-full flex flex-row  justify-evenly items-center`}>
                  <SpeedDating myImgs={image.splash} title="Speed Dating" />
                </View>
              </View>

              <View
                style={
                  themes.color === 'dark' || themes.color === '#202124'
                    ? tw`px-6 border-t border-b border-gray-200 flex  mt-12 mb-2  w-full justify-center`
                    : tw`px-6 border-t border-b border-gray-700 flex  mt-12 mb-2  w-full justify-center`
                }>
                <Text
                  style={[
                    {fontFamily: 'Bold', color: themes.color},
                    tw`p-2 text-center text-xl w-full `,
                  ]}>
                  Networks{' '}
                </Text>
              </View>
              <Text
                style={[
                  {fontFamily: 'Light', color: themes.color},
                  tw`text-center w-full mb-6 `,
                ]}>
                Find a partner that is interested in
              </Text>

              <Row
                imageName={image.food}
                imageName2={image.technology}
                name2="Technology"
                name="Food"
              />
              <Row
                imageName={image.nft}
                name="NFT"
                imageName2={image.fashion}
                name2="Fashion"
              />
              <Row
                imageName={image.sports}
                name="Sports"
                imageName2={image.news}
                name2="News"
              />
              <Row
                imageName={image.gaming}
                name="Gaming"
                imageName2={image.tv}
                name2="TV Show"
              />
            </ScrollView>
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
    position: 'relative',
  },
  hide: {
    display: 'none',
    // zIndex: 0
  },
  show: {
    display: 'flex',
    // flex: 1,
    zIndex: 99,
    position: 'absolute',
    // height: 200
  },
  mode: {
    opacity: 0.1,
    position: 'relative',
    // zIndex: 0.1
  },
});

//make this component available to the app
export default Explore;
