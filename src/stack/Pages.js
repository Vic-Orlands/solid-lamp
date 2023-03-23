import 'react-native-gesture-handler';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/Onboard/HomeScreen';
import Onboarding from '../screens/Onboard/Onboarding';
import Recover from '../screens/accountRecovery/Recover';
import EmailRecover from '../screens/accountRecovery/EmailRecover';
import EmailSent from '../screens/accountRecovery/EmailSent';
import Phone from '../screens/Register/Phone';
import PhoneNumber from '../screens/Register/PhoneNumber';
import MobileVerification from '../screens/Register/MobileVerification';
import PhoneSuccess from '../screens/Register/PhoneSuccess';
import EmailInput from '../screens/Register/EmailInput';
import PasswordInput from '../screens/Register/PasswordInput';
import NameInput from '../screens/Register/NameInput';
import DobInput from '../screens/Register/DobInput';
import Country from '../screens/Register/Country';
import Gender from '../screens/Register/Gender';
import InterestedIn from '../screens/Register/InterestedIn';
import ChoosePhoto from '../screens/Register/ChoosePhoto';
import AlmostDone from '../screens/Register/AlmostDone';
import Passion from '../screens/Register/Passion';
import Feeds from '../screens/LoggedIn/Feeds';
import Messages from '../screens/LoggedIn/Messages';
import SettingInfo from '../screens/LoggedIn/settings/SettingInfo';
import Likes from '../screens/LoggedIn/Likes';
import Chat from '../screens/LoggedIn/Chat';
import ChatStarter from '../screens/LoggedIn/ChatStarter';
import EditProfile from '../screens/LoggedIn/settings/EditProfile';
import ProfileInfo from '../screens/LoggedIn/ProfileInfo';
import MyDrawers from '../components/MyDrawers';
import Explore from '../screens/LoggedIn/Explore';
import Ads from '../screens/LoggedIn/Ads';
import Verify from '../screens/LoggedIn/Verify';
import SpeedDating from '../screens/LoggedIn/SpeedDating';
import ReportUser from '../screens/LoggedIn/ReportUser';

import ChangePhoneNumber from '../screens/LoggedIn/settings/changeDetails/ChangePhoneNumber';
import ChangePassword from '../screens/LoggedIn/settings/changeDetails/ChangePassword';
import ChangeGender from '../screens/LoggedIn/settings/changeDetails/ChangeGender';
import ChangeInterest from '../screens/LoggedIn/settings/changeDetails/ChangeInterest';
import ChangeName from '../screens/LoggedIn/settings/changeDetails/ChangeName';
import ChangeAge from '../screens/LoggedIn/settings/changeDetails/ChangeAge';
import MatchPage from '../screens/LoggedIn/MatchPage';
import AgoraVideo from "../components/videoCall/AgoraVideo"
import Login from '../screens/Login/Login';
import useAuth from '../auth/useAuth';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// should only be called by the DrawersRoutes()
const LoggedInPages = () => {
	return (
		<Stack.Navigator>
			<Stack.Group>
				<Stack.Screen name="Feeds" component={Feeds} options={{ headerShown: false }} />
				<Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
				<Stack.Screen name="SettingInfo" component={SettingInfo} options={{ headerShown: false }} />
				<Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
				<Stack.Screen name="Likes" component={Likes} options={{ headerShown: false }} />
				<Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
				<Stack.Screen name="ChatStarter" component={ChatStarter} options={{ headerShown: false }} />
				<Stack.Screen name="ProfileInfo" component={ProfileInfo} options={{ headerShown: false }} />
				<Stack.Screen name="Explore" component={Explore} options={{ headerShown: false }} />
				<Stack.Screen name="Ads" component={Ads} options={{ headerShown: false }} />
				<Stack.Screen name="Verify" component={Verify} options={{ headerShown: false }} />
				<Stack.Screen name="SpeedDating" component={SpeedDating} options={{ headerShown: false }} />
				<Stack.Screen name="ReportUser" component={ReportUser} options={{ headerShown: false }} />

				{/* edit profile info */}
				<Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
				<Stack.Screen name="ChangePhoneNumber" component={ChangePhoneNumber} options={{ headerShown: false }} />
				<Stack.Screen name="ChangeGender" component={ChangeGender} options={{ headerShown: false }} />
				<Stack.Screen name="ChangeAge" component={ChangeAge} options={{ headerShown: false }} />
				<Stack.Screen name="ChangeInterest" component={ChangeInterest} options={{ headerShown: false }} />
				<Stack.Screen name="ChangeName" component={ChangeName} options={{ headerShown: false }} />

				{/* // for profile update */}
				<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
				<Stack.Screen name="DobInput" component={DobInput} options={{ headerShown: false }} />
				<Stack.Screen name="Gender" component={Gender} options={{ headerShown: false }} />
				<Stack.Screen name="InterestedIn" component={InterestedIn} options={{ headerShown: false }} />
				<Stack.Screen name="ChoosePhoto" component={ChoosePhoto} options={{ headerShown: false }} />
				<Stack.Screen name="Country" component={Country} options={{ headerShown: false }} />
				<Stack.Screen name="AlmostDone" component={AlmostDone} options={{ headerShown: false }} />
				<Stack.Screen name="Passion" component={Passion} options={{ headerShown: false }} />
				<Stack.Screen name="AgoraVideo" component={AgoraVideo} options={{ headerShown: false }} />
				<Stack.Screen name="Drawers" component={DrawersRoutes} options={{ headerShown: false }} />
			</Stack.Group>
			{/* // match screen */}
			<Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
				<Stack.Screen name="MatchScreen" component={MatchPage} options={{ headerShown: false }} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

function DrawersRoutes() {
	return (
		<Drawer.Navigator
			swipeEnabled
			drawerContent={(props) => <MyDrawers {...props} />}
			options={{
				headerShown: false
			}}
		>
			<Drawer.Screen name="User" component={LoggedInPages} options={{ headerShown: false }} />
		</Drawer.Navigator>
	);
}

function OffLinePages() {
	const { isNewUser } = useAuth();

	return (
		<Stack.Navigator initialRouteName={!isNewUser ? 'Onboarding' : 'Home'}>
			{/* show this screen if the hasnt been launched before */}
			<Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
			{/* Show this screen is user is logged out and has open the app before */}
			<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
			<Stack.Screen name="RecoverScreen" component={Recover} options={{ headerShown: false }} />
			<Stack.Screen name="EmailRecover" component={EmailRecover} options={{ headerShown: false }} />
			<Stack.Screen name="EmailSent" component={EmailSent} options={{ headerShown: false }} />
			<Stack.Screen name="Phone" component={Phone} options={{ headerShown: false }} />
			<Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{ headerShown: false }} />
			<Stack.Screen name="MobileVerification" component={MobileVerification} options={{ headerShown: false }} />
			<Stack.Screen name="PhoneSuccess" component={PhoneSuccess} options={{ headerShown: false }} />
			<Stack.Screen name="EmailInput" component={EmailInput} options={{ headerShown: false }} />
			<Stack.Screen name="PasswordInput" component={PasswordInput} options={{ headerShown: false }} />
			<Stack.Screen name="NameInput" component={NameInput} options={{ headerShown: false }} />
			<Stack.Screen name="DobInput" component={DobInput} options={{ headerShown: false }} />
			<Stack.Screen name="Country" component={Country} options={{ headerShown: false }} />
			<Stack.Screen name="Gender" component={Gender} options={{ headerShown: false }} />
			<Stack.Screen name="InterestedIn" component={InterestedIn} options={{ headerShown: false }} />
			<Stack.Screen name="ChoosePhoto" component={ChoosePhoto} options={{ headerShown: false }} />
			<Stack.Screen name="AlmostDone" component={AlmostDone} options={{ headerShown: false }} />

			<Stack.Screen name="Passion" component={Passion} options={{ headerShown: false }} />
			<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
			<Stack.Screen name="Drawers" component={DrawersRoutes} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}

const MainPages = () => {
	const { user } = useAuth();

	return (
		<Stack.Navigator>
			{!user?.photoURL ? (
				<Stack.Screen name="LoggedOut" component={OffLinePages} options={{ headerShown: false }} />
			) : (
				<Stack.Screen name="LoggedIn" component={DrawersRoutes} options={{ headerShown: false }} />
			)}
		</Stack.Navigator>
	);
};

export default MainPages;
