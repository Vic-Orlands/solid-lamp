import React from 'react';
import AgoraUIKit, { VideoRenderMode } from 'agora-rn-uikit';
import { APPID, CHANNEL, TOKEN } from '../../auth/Secret';

// create style for the video
const btnStyle = {
	borderRadius: 30,
	padding: 10,
	width: 50,
	borderWidth: 0,
	height: 50,
	backgroundColor: '#F0E0E0'
};

const remoteBtnStyle = { backgroundColor: '#2edb8555' };

const props = {
	styleProps: {
		iconSize: 30,
		theme: '#CC0000',
		videoMode: {
			max: VideoRenderMode.Hidden,
			min: VideoRenderMode.Hidden
		},
		overlayContainer: {
			backgroundColor: '#F0E0E0',
			opacity: 1
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
				borderWidth: 0
			}
		},
		localBtnContainer: {
			backgroundColor: '#fff',
			bottom: 0,
			paddingVertical: 10,
			height: 80
		},
		maxViewRemoteBtnContainer: {
			top: 0,
			alignSelf: 'flex-end'
		},
		remoteBtnStyles: {
			muteRemoteAudio: remoteBtnStyle,
			muteRemoteVideo: remoteBtnStyle,
			remoteSwap: remoteBtnStyle,
			minCloseBtnStyles: remoteBtnStyle
		},
		minViewContainer: {
			bottom: 80,
			top: undefined,
			backgroundColor: '#fff',
			borderColor: '#F0E0E0',
			borderWidth: 1,
			height: '15%'
		},
		minViewStyles: {
			height: '100%'
		},
		maxViewStyles: {
			height: '64%'
		},
		UIKitContainer: { height: '94%' }
	}
};

export default function AgoraVideo({ rtcCallbacks }) {
	const connectionData = {
		appId: APPID,
		channel: CHANNEL,
		token: TOKEN
	};

	return <AgoraUIKit connectionData={connectionData} styleProps={props.styleProps} rtcCallbacks={rtcCallbacks} />;
}
