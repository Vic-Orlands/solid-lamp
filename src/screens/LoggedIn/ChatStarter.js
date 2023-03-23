//import liraries
import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import MsgHeader from '../../components/MsgHeader';
import firestore from '@react-native-firebase/firestore';
import useAuth from '../../auth/useAuth';
import tw from 'twrnc';

const msgData = [
	{
		id: 1,
		text: 'WHAT ARE YOU LOOKING FOR ON LOVEAFRICA ?'
	},
	{
		id: 2,
		text: 'WHAT IS YOUR FAVORITE CHILDHOOD MEMORY ?'
	},
	{
		id: 3,
		text: 'DO YOU BELIEVE IN GOD ?'
	},
	{
		id: 4,
		text: 'WHAT IS ONE THING YOU HAVE NOT TOLD ANYONE ?'
	},
	{
		id: 5,
		text: 'WHERE DID YOU GROW UP?'
	},
	{
		id: 6,
		text: 'WOULD YOU RATHER FIND TRUE LOVE RIGHT NOW OR WIN THE LOTTERY?'
	},
	{
		id: 7,
		text: 'WHO WOULD YOU SAY KNOW YOU THE BEST?'
	},
	{
		id: 8,
		text: 'ARE YOU INTO ASTROLOGY?'
	},
	{
		id: 9,
		text: 'HAVE YOU BEEN BACK TO THE MOTHERLAND RECENTLY?'
	},
	{
		id: 10,
		text: 'WHAT ARE SOME CULTURAL TRADITIONS YOUR FAMILY PRACTICES?'
	},
	{
		id: 11,
		text: 'WHAT IS YOUR FAVORITE COLOR?'
	},
	{
		id: 12,
		text: 'WHEN IS YOUR BIRTHDAY?'
	},

	{
		id: 13,
		text: 'HOW WOULD YOU EXPLAIN YOUR CHILDHOOD?'
	},
	{
		id: 14,
		text: 'WHAT IS YOUR FAVORITE CHILDHOOD MEMORY ?'
	},
	{
		id: 15,
		text: 'HOW WOULD YOU EXPLAIN YOUR PARENTS RELATIONSHIP WITH EACH OTHER?'
	},
	{
		id: 16,
		text: 'WHICH PARENT ARE YOU CLOSER TO?'
	},
	{
		id: 17,
		text: 'DO YOU WANT A BIG OR SMALL FAMILY?'
	},
	{
		id: 18,
		text: 'TRUTH OR DARE?'
	},
	{
		id: 19,
		text: 'HOW WOULD YOU DEFINE BEAUTY?'
	},
	{
		id: 20,
		text: 'WHO WOULD YOU SAY KNOW YOU THE BEST?'
	},
	{
		id: 21,
		text: 'DO YOU LIKE COFFEE?'
	},
	{
		id: 22,
		text: 'WHICH MEAL TIME IS YOUR FAVORITE: BREAKFAST, LUNCH, OR DINNER?'
	},
	{
		id: 23,
		text: "WHAT IS THE FUNNIEST DREAM YOU'VE EVER HAD?"
	},
	{
		id: 24,
		text: "WHAT IS THE SCARIEST DREAM YOU'VE EVER HAD?"
	},
	{
		id: 25,
		text: 'WHAT ARE SOME GOOD HABITS YOU THINK EVERYONE SHOULD HAVE?'
	},

	{
		id: 26,
		text: 'WHAT ARE YOU MOST PASSIONATE ABOUT?'
	},
	{
		id: 27,
		text: 'DO YOU PREFER A HOT DAY OR COLD DAY?'
	},
	{
		id: 28,
		text: 'DO YOU PREFER SUMMER FASHION OR WINTER FASHION?'
	},
	{
		id: 29,
		text: "WHAT IS AN EMBARRASSING STORY YOU DON'T MIND SHARING?"
	},
	{
		id: 30,
		text: 'DO YOU HAVE A FAVORITE HOLIDAY? IF YES, WHY? '
	},
	{
		id: 31,
		text: 'ARE YOU STILL FRIENDS WITH ANY OF YOUR EXES?'
	},
	{
		id: 32,
		text: 'DO YOU HAVE ANY FUNNY NICKNAMES? '
	},
	{
		id: 33,
		text: 'WHAT CALMS YOU DOWN AFTER A STRESSFUL DAY?'
	},
	{
		id: 34,
		text: "FAVORITE PLACE YOU'VE TRAVELED TO?"
	},
	{
		id: 35,
		text: 'DO YOU BELIEVE SOULMATES EXISTS?'
	},
	{
		id: 36,
		text: 'WHAT IS A SUPERPOWER YOU WISH YOU HAD?'
	},
	{
		id: 37,
		text: 'WHAT DO YOU FEEL IS THE BEST WAY TO RESOLVE A QUARREL?'
	},

	{
		id: 38,
		text: 'GIVE ME YOUR FAVORITE PICK-UP-LINE?'
	},
	{
		id: 39,
		text: 'WHAT MOTIVATES YOU?'
	},
	{
		id: 40,
		text: 'IF MONEY GREW ON TREES, HOW WOULD YOU SPEND YOUR TIME?'
	},
	{
		id: 41,
		text: 'WOULD YOU RATHER BE IN PRISON FOR 5 YEAR OR IN A COMA FOR 10 YEARS?'
	},
	{
		id: 42,
		text: 'DO YOU WANT A BIG OR SMALL FAMILY?'
	},
	{
		id: 43,
		text: 'ARE YOU MORNING PERSON OR NIGHT PERSON?'
	},
	{
		id: 44,
		text: 'DO YOU PREFER FACETIME, CALLS, AND/OR TEXT?'
	},
	{
		id: 45,
		text: 'WHAT IS YOUR FAVORITE THING TO DO DURING YOUR FREE TIME (HOBBIES)?'
	},
	{
		id: 46,
		text: 'WHAT IS YOUR STRANGEST FOOD COMBINATION?'
	},
	{
		id: 47,
		text: 'WHAT SOME THINGS YOU WOULD NEVER EAT?'
	},
	{
		id: 48,
		text: 'DO YOU SLEEP WITH THE FAN OFF OR ON?'
	},
	{
		id: 49,
		text: 'WHAT IS YOUR FAVORITE TYPE OF FOOD?'
	},
	{
		id: 50,
		text: 'WHAT IS A DEAL-BREAKER FOR YOUR DATING EXPERIENCE?'
	},

	{
		id: 51,
		text: 'IF YOU COULD MEET A CELEBRITY WHO WOULD IT BE?'
	},
	{
		id: 52,
		text: 'WHAT IS THE WORST DATE YOU HAVE BEEN ON?'
	},
	{
		id: 53,
		text:
			'WOULD YOU RATHER HAVE A HOME COOKED MEAL DATE OR A RESERVATION MAKING TYPE OF DATE? WHAT IS YOUR ALL-TIME FAVORITE MOVIE?'
	},
	{
		id: 54,
		text: ' WHAT IS AN UNPOPULAR OPINION THAT YOU HAVE?'
	},
	{
		id: 55,
		text: 'HOW WOULD YOU DESCRIBE YOURSELF USING FIVE WORDS?'
	},
	{
		id: 56,
		text: 'WHAT IS YOUR FAVORITE SEASON?'
	},
	{
		id: 57,
		text: 'WHY DID YOUR LAST RELATIONSHIP FAIL?'
	},
	{
		id: 58,
		text: 'WHAT IS THE FIRST THING YOU DO WHEN YOU COME BACK HOME AFTER A LONG DAY AT WORK?'
	},
	{
		id: 59,
		text: 'WHAT IS AN IMPORTANT PART OF DAILY ROUTINE?'
	},
	{
		id: 60,
		text: 'WHAT IS YOUR ALL-TIME FAVORITE SONG?'
	},
	{
		id: 61,
		text: 'WHAT IS YOUR FAVORITE GENRE OF MUSIC?'
	},
	{
		id: 62,
		text: 'WHAT IS YOUR FAVORITE GENRE OF MOVIES/TV SHOWS?'
	},

	{
		id: 63,
		text: 'WHAT ARE YOUR TOP THREE PETS?'
	},
	{
		id: 64,
		text: 'HOW TALL ARE YOU?'
	},
	{
		id: 65,
		text: 'HOW WOULD YOU EXPLAIN YOUR CHILDHOOD?'
	},
	{
		id: 66,
		text: 'WOULD YOU RATHER HAVE POWER OVER PEOPLE OR WOULD YOU RATHER HAVE PEOPLE RESPECT YOU?'
	},
	{
		id: 67,
		text: 'HOW WOULD YOU DESCRIBE YOUR CLOSEST FRIENDS?'
	},
	{
		id: 68,
		text: 'HAVE YOU EVER LIED TO GET OUT OF A BAD DATE?'
	},
	{
		id: 69,
		text: 'IF YOU WON THE LOTTERY WHAT WOULD YOU DO WITH THE MONEY? AND WOULD YOU TELL ANYBODY?'
	},
	{
		id: 70,
		text: 'WOULD YOU DESCRIBE YOURSELF AS AN INTROVERT OR EXTROVERT?'
	},
	{
		id: 71,
		text: 'WHAT DOES A NIGHT IN LOOK LIKE FOR YOU?'
	},
	{
		id: 72,
		text: "WHAT IS THE MOST ADVENTUROUS THING YOU'VE EVER DONE? "
	},
	{
		id: 73,
		text: 'WHAT ARE YOUR LOVE LANGUAGES IN ORDER?'
	},
	{
		id: 74,
		text: 'HOW DO YOU GIVE LOVE?'
	},
	{
		id: 75,
		text: 'WHAT IS SOMETHING THAT MAKES YOU SMILE?'
	},

	{
		id: 76,
		text: 'WHAT IS SOMETHING THAT CHANGED YOUR LIFE?'
	},
	{
		id: 77,
		text: 'WHAT IS SOMETHING YOU WONT QUESTION SPENDING YOUR MONEY ON?'
	},
	{
		id: 78,
		text: 'DO YOU PREFER SUMMER FASHION OR WINTER FASHION?'
	},
	{
		id: 79,
		text: 'WHAT IS YOUR TWO YEAR PLAN?'
	},
	{
		id: 80,
		text: "WHAT IS THE BIGGEST RISK YOU'VE EVER TAKEN?"
	},
	{
		id: 81,
		text: 'WHAT IS YOUR FIVE YEAR PLAN?'
	},
	{
		id: 82,
		text: 'HOW MANY KIDS DO YOU WANT IN THE FUTURE?'
	},
	{
		id: 83,
		text: 'DO YOU HAVE ANY HIDDEN TALENTS?'
	},
	{
		id: 84,
		text: 'WHAT IS A GUILTY PLEASURE YOU HAVE?'
	},
	{
		id: 85,
		text: 'HOW LONG DID YOUR LONGEST RELATIONSHIP LAST?'
	},
	{
		id: 86,
		text: 'HOW LONG DID YOUR SHORTEST RELATIONSHIP LAST?'
	},
	{
		id: 87,
		text: 'WOULD YOU RATHER BE UNDER-DRESSED OR OVERDRESSED? '
	},

	{
		id: 88,
		text: 'WHAT IS YOUR FAVORITE COMFORT FOOD?'
	},
	{
		id: 89,
		text: 'HOW MANY COUNTRIES HAVE YOU VISITED?'
	},
	{
		id: 90,
		text: 'WHAT IS YOUR FAVORITE SITCOM?'
	},
	{
		id: 91,
		text: 'ARE YOU OVER YOUR EX?'
	},
	{
		id: 92,
		text: 'WHAT IS YOUR FAVORITE FAST FOOD RESTAURANT? '
	},
	{
		id: 93,
		text: 'HOW MANY SIBLINGS DO YOU HAVE? ARE YOU GUYS CLOSE?'
	},
	{
		id: 94,
		text: 'DO YOU HAVE A LOT OF GUY OR GIRL FRIENDS?'
	},
	{
		id: 95,
		text: 'WHAT IS YOUR FAVORITE THING TO DO DURING YOUR FREE TIME (HOBBIES)?'
	},
	{
		id: 96,
		text: 'ARE YOU MORE OF A MODERN OR TRADITIONAL PERSON?'
	},
	{
		id: 97,
		text: 'DO YOU HAVE ANY TATTOOS? IF SO, HOW MANY? IF NO, WOULD YOU GET SOME?'
	},
	{
		id: 98,
		text: 'DO YOU SLEEP WITH THE FAN OFF OR ON?'
	},
	{
		id: 99,
		text: 'IF YOU COULD LIVE ANYWHERE WHERE WOULD IT BE?'
	},
	{
		id: 100,
		text: 'DO YOU HAVE ANY ALLERGIES? '
	},
	{
		id: 101,
		text: 'ARE YOU INTO ANY PODCAST OR TED TALKS?'
	},
	{
		id: 102,
		text: 'WHAT IS YOUR FAVORITE SLEEPING POSITION?'
	},
	{
		id: 103,
		text: 'WHAT IS YOUR FAVORITE PHONE APP?'
	},
	{
		id: 104,
		text: 'WOULD DESCRIBE YOURSELF AS A WORKAHOLIC?'
	},
	{
		id: 105,
		text: 'WOULD YOU MIND HAPPY HOUR AFTER WORK?'
	},
	{
		id: 106,
		text: 'WHAT IS YOUR FAVORITE FAST FOOD RESTAURANT? '
	},
	{
		id: 107,
		text: "WHAT'S MORE IMPORTANT TO YOU, YOUR FAMILY OR FRIENDS?"
	},
	{
		id: 108,
		text: 'HAVE YOU EXPERIENCED TRUE LOVE BEFORE?'
	},
	{
		id: 109,
		text: 'DO YOU LIVE BY ANY MOTTO?'
	},
	{
		id: 110,
		text: 'DO YOU HAVE ANY ALLERGIES? '
	},
	{
		id: 111,
		text: 'HOW CAN ONE LOSE AND/OR EARN YOUR TRUST?'
	},
	{
		id: 112,
		text: 'IF YOU COULD SNAP YOUR FINGERS AND MAKE THE WORLD A BETTER PLACE, WHICH PROBLEM WOULD YOU FIX FIRST?'
	},
	{
		id: 113,
		text: 'WOULD YOU DESCRIBE YOURSELF AS SENSITIVE?'
	},
	{
		id: 114,
		text: 'DO YOU BELIEVE IN SECOND CHANCES?'
	},
	{
		id: 115,
		text: 'DO YOU BELIEVE IN ALIENS?'
	},
	{
		id: 116,
		text: 'WHAT ARE YOUR TALENTS?'
	},
	{
		id: 117,
		text: 'IF YOU COULD COME BACK AS AN ANIMAL IN YOUR NEXT LIFE, WHAT WOULD YOU BE AND WHY?'
	},
	{
		id: 118,
		text: 'WHATS YOUR ZODIAC SIGN'
	},
	{
		id: 119,
		text: 'DO YOU BELIEVE IN CONSPIRACIES THEORIES?'
	},
	{
		id: 120,
		text: 'WHAT SCHOOL DID YOU GO TO?'
	},
	{
		id: 121,
		text: 'WHAT SCHOOL DID YOU GRADUATE FROM?'
	}
];

// create a component
const ChatStarter = () => {
	const { user } = useAuth();
	const { params } = useRoute();
	const navigation = useNavigation();
	const { theme, matchedDetails } = params;
	const [ modalVisible, setModalVisible ] = useState(false);

	const db = firestore().collection('matches').doc(matchedDetails.id).collection('messages');

	// select a chat starter and send the message
	// on send, close the modal too
	const handleCloseModal = (event) => {
		db.add({
			timestamp: firestore.FieldValue.serverTimestamp(),
			userId: user.uid,
			name: getMatchedUserInfo(matchedDetails.users, user.uid).name,
			image: matchedDetails.users[user.uid].image,
			message: event
		});

		navigation.navigate('Chat', { matchedDetails });
	};

	const Loading = () => {
		return <Text style={[ { fontFamily: 'Regular', color: theme.color }, tw`text-xl` ]}>Loading...</Text>;
	};

	const Starter = () => {
		return (
			<View>
				<FlatList
					data={msgData}
					keyExtractor={(item) => item.id}
					refreshing={false}
					renderItem={({ item }) => (
						<View style={tw`w-full flex flex-row bg-gray-200 rounded-lg mt-3 `}>
							<TouchableOpacity
								style={tw`p-4 flex flex-row w-full`}
								onPress={() => handleCloseModal(item.text)}
							>
								<Text
									style={[
										{ fontFamily: 'Regular' },
										tw`text-sm text-center text-black overflow-hidden flex-grow `
									]}
								>
									{item.text}
								</Text>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>
		);
	};

	return (
		<SafeAreaView style={tw`flex-1`}>
			<View style={[ tw`mt-2 flex-1`, { backgroundColor: theme.background } ]}>
				<MsgHeader />
				<View style={tw`px-6 w-full`}>
					<View style={tw`flex flex-row justify-between pb-2`}>
						<Text style={[ { fontFamily: 'Bold', color: theme.color }, tw` text-2xl pt-4` ]}>
							Chat Starter
						</Text>

						<TouchableOpacity onPress={() => navigation.navigate('Chat', { matchedDetails })}>
							<Text style={[ { fontFamily: 'Bold', color: 'red' }, tw`text-2xl pt-4` ]}>Close</Text>
						</TouchableOpacity>
					</View>
					<View style={tw`pb-4`}>
						<View style={tw`w-full mb-24`}>
							<FlatList
								data={msgData}
								refreshing={false}
								style={tw` mb-12`}
								onRefresh={Loading}
								keyExtractor={(item) => item.id}
								ListFooterComponent={<Starter />}
							/>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

//make this component available to the app
export default ChatStarter;
