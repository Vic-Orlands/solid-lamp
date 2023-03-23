//import libraries
import React, {useEffect, useContext, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import MsgHeader from '../../components/MsgHeader';
import firestore from '@react-native-firebase/firestore';
import {DarkMode} from '../../config/DarkMode';
import useAuth from '../../auth/useAuth';
import ChatScroll from './ChatScroll';
import tw from 'twrnc';

const Messages = () => {
  const {user} = useAuth();
  const themes = useContext(DarkMode);
  const [matches, setMatches] = useState([]);

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

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: themes.background}]}>
      <View style={tw`mt-2`}>
        <MsgHeader />
        <View style={tw`px-6 w-full`}>
          <View>
            <Text
              style={[
                {fontFamily: 'Bold', color: themes.color},
                tw`  text-2xl pt-4`,
              ]}>
              Messages
            </Text>
          </View>

          {matches.length > 0 ? (
            <View style={tw`pb-4`}>
              <View style={tw`w-full mb-24`}>
                <FlatList
                  data={matches}
                  style={tw`mb-12`}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => <ChatScroll matchedDetails={item} />}
                />
              </View>
            </View>
          ) : (
            <View style={tw`pb-4 w-full mb-24`}>
              <Text
                style={[
                  {fontFamily: 'Bold', fontSize: 18, color: themes.color},
                  tw`   pt-6`,
                ]}>
                You don't have any messages yet
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default Messages;
