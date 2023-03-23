import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [ user, setUser ] = useState(null);
	const [ isNewUser, setIsNewUser ] = useState(false);
	const [ loadingInitial, setLoadingInitial ] = useState(true);

	GoogleSignin.configure({
		webClientId: '177291864975-lccf1ruvgebkgg842eoub6e1p2igohj8.apps.googleusercontent.com'
	});

	// check if user is logged in and keep user logged in
	useEffect(
		() =>
			auth().onAuthStateChanged((user) => {
				if (user) {
					setUser(user);
					setIsNewUser(true);
				}
				setLoadingInitial(null);
			}),
		[]
	);

	// function to checkout user or sign user out
	const handleSignOut = () => {
		auth()
			.signOut()
			.then(() => {
				setUser(null);
				setIsNewUser(true);
				AsyncStorage.removeItem('userDetails');
			})
			.catch((error) => console.error(error));
	};

	// memoize the values
	const memoizedValue = useMemo(
		() => ({
			user,
			setUser,
			isNewUser,
			handleSignOut,
			setLoadingInitial
		}),
		[ user, isNewUser ]
	);

	return <AuthContext.Provider value={memoizedValue}>{!loadingInitial && children}</AuthContext.Provider>;
};

export default function useAuth() {
	return useContext(AuthContext);
}
