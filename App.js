import 'react-native-gesture-handler';
import React, { Fragment, useState, useEffect, useContext } from 'react';
import Pages from './src/stack/Pages';
import theme from './src/config/theme';
import { AuthProvider } from './src/auth/useAuth';
import { DarkMode } from './src/config/DarkMode';
import RNBootSplash from 'react-native-bootsplash';
import { EventRegister } from 'react-native-event-listeners';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
	const [ mode, setMode ] = useState(false);

	useEffect(() => {
		let eventListener = EventRegister.addEventListener('changeTheme', (data) => {
			setMode(data);
		});

		return () => {
			EventRegister.removeEventListener(eventListener);
		};
	});

	useEffect(() => {
		RNBootSplash.hide({ fade: true });
	});

	return (
		<Fragment>
			<NavigationContainer>
				<DarkMode.Provider value={mode === true ? theme.dark : theme.light}>
					<AuthProvider>
						<Pages />
					</AuthProvider>
				</DarkMode.Provider>
			</NavigationContainer>
		</Fragment>
	);
}
