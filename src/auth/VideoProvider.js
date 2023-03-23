//import liraries
import React from 'react';
import {Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import tw from 'twrnc';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

// create a component
const VideoProvider = ({
  callAlert,
  setVideoCall,
  isModalVisible,
  sendCancelCallAlert,
  cancelExploreCallAlert,
}) => {
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

  return (
    <React.Fragment>
      {/* toast message container */}
      <Toast
        config={toastConfig}
        innerRef={res => {
          Toast.setRef(res);
        }}
      />

      {/* show calling modal if isModalVisible is true and vice versa */}
      <Modal
        isVisible={isModalVisible}
        swipeDirection="left"
        backdropOpacity={0.3}
        animationIn="slideInDown"
        onSwipeComplete={sendCancelCallAlert || cancelExploreCallAlert}
        onBackdropPress={sendCancelCallAlert || cancelExploreCallAlert}
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            height: 100,
            width: width - 20,
            borderRadius: 20,
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: 'grey',
          }}>
          <Text style={{color: '#fff', fontSize: 24, paddingTop: 5}}>
            {callAlert?.name} calling...
          </Text>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={sendCancelCallAlert || cancelExploreCallAlert}>
              <View
                style={{
                  flex: 1,
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#cc0000',
                }}>
                <Text style={tw`text-white text-base`}>Cancel</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={setVideoCall}>
              <View
                style={{
                  flex: 1,
                  width: 45,
                  height: 45,
                  marginLeft: 60,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#10873a',
                }}>
                <Text style={tw`text-white text-base`}>Answer</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
};

//make this component available to the app
export default React.memo(VideoProvider);
