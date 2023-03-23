import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AccessToken} from 'react-native-fbsdk-next';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import useAuth from '../../../auth/useAuth';
import Modal from 'react-native-modal';
import tw from 'twrnc';

const UpdateProfile = ({visible, closeModal}) => {
  const {user, setUser} = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  //handle delete account
  const handleDeleteUser = async () => {
    let userInfo = auth().currentUser;

    // if google login, then reauthenticate before deleting user
    if (userInfo.emailVerified) {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      userInfo.reauthenticateWithCredential(googleCredential).then(() => {
        console.log('reauthenticated');
        userInfo
          .delete()
          .then(() => {
            // delete user data
            firestore()
              .collection('users')
              .doc(user.uid)
              .get()
              .then(documentSnapshot => {
                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .collection('passes')
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot._docs.length > 0) {
                      documentSnapshot.forEach(doc => {
                        doc.ref.delete();
                        console.log('deleted passes');
                      });
                    }
                  });

                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .collection('swipes')
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot._docs.length > 0) {
                      documentSnapshot.forEach(doc => {
                        doc.ref.delete();
                        console.log('deleted swipes');
                      });
                    }
                  });

                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .collection('likes')
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot._docs.length > 0) {
                      documentSnapshot.forEach(doc => {
                        doc.ref.delete();
                        console.log('deleted likes');
                      });
                    }
                  });

                // delete user image from bucket
                // let imageUrl = documentSnapshot._data.image;
                // let pictureRef = storage().ref(imageUrl);
                // pictureRef.delete().then(() => {
                // 	console.log('Picture deleted successfully!');
                // });

                firestore().collection('users').doc(user.uid).delete();
              });

            // delete matched user if any
            firestore()
              .collection('matches')
              .where('usersMatched', 'array-contains', user.uid)
              .get()
              .then(querySnapshot => {
                // check if matched messages exists. If it does, then delete related fields
                if (
                  querySnapshot._docs.length > 0 &&
                  querySnapshot._docs[0]._data.usersMatched.includes(user.uid)
                ) {
                  querySnapshot.forEach(doc => {
                    doc.ref.delete();
                    console.log('deleted');
                    setUser(null);
                    AsyncStorage.removeItem('userDetails');
                    Toast.show({
                      type: 'success',
                      position: 'top',
                      text1: 'User deleted',
                    });
                    setTimeout(() => {
                      navigation.navigate('Home');
                    }, 2000);
                  });
                } else {
                  console.log('no matched user');
                  setUser(null);
                  AsyncStorage.removeItem('userDetails');
                  Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'User deleted',
                  });
                  setTimeout(() => {
                    navigation.navigate('Home');
                  }, 2000);
                }
              });
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
            Toast.show({
              type: 'error',
              position: 'top',
              text1: error.code
                .replace('auth/', '')
                .replace(/[^a-zA-Z0-9 ]/g, ' '),
            });
          });
      });
    } else {
      const data = await AccessToken.getCurrentAccessToken();
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      userInfo.reauthenticateWithCredential(facebookCredential).then(() => {
        console.log('reauthenticated fb user');

        userInfo
          .delete()
          .then(() => {
            // delete user data
            firestore()
              .collection('users')
              .doc(user.uid)
              .get()
              .then(documentSnapshot => {
                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .collection('passes')
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot._docs.length > 0) {
                      documentSnapshot.forEach(doc => {
                        doc.ref.delete();
                        console.log('deleted passes');
                      });
                    }
                  });

                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .collection('swipes')
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot._docs.length > 0) {
                      documentSnapshot.forEach(doc => {
                        doc.ref.delete();
                        console.log('deleted swipes');
                      });
                    }
                  });

                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .collection('likes')
                  .get()
                  .then(documentSnapshot => {
                    if (documentSnapshot._docs.length > 0) {
                      documentSnapshot.forEach(doc => {
                        doc.ref.delete();
                        console.log('deleted likes');
                      });
                    }
                  });

                // delete user image from bucket
                // let imageUrl = documentSnapshot._data.image;
                // let pictureRef = storage().ref(imageUrl);
                // pictureRef.delete().then(() => {
                // 	console.log('Picture deleted successfully!');
                // });

                firestore().collection('users').doc(user.uid).delete();
              });

            // delete matched user if any
            firestore()
              .collection('matches')
              .where('usersMatched', 'array-contains', user.uid)
              .get()
              .then(querySnapshot => {
                // check if matched messages exists. If it does, then delete related fields
                if (
                  querySnapshot._docs.length > 0 &&
                  querySnapshot._docs[0]._data.usersMatched.includes(user.uid)
                ) {
                  querySnapshot.forEach(doc => {
                    doc.ref.delete();
                    console.log('deleted');
                    setUser(null);
                    AsyncStorage.removeItem('userDetails');
                    Toast.show({
                      type: 'success',
                      position: 'top',
                      text1: 'User deleted',
                    });
                  });
                } else {
                  console.log('no matched user');
                  setUser(null);
                  AsyncStorage.removeItem('userDetails');
                  Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'User deleted',
                  });
                }
              });
            setTimeout(() => {
              navigation.navigate('Home');
            }, 2000);
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
            Toast.show({
              type: 'error',
              position: 'top',
              text1: error.code
                .replace('auth/', '')
                .replace(/[^a-zA-Z0-9 ]/g, ' '),
            });
          });
      });
    }
  };

  // style the toast messages
  const {width} = Dimensions.get('window');
  const toastConfig = {
    success: internalState => (
      <View
        style={{
          height: 45,
          width: width - 40,
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
          width: width - 40,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1`}
      keyboardVerticalOffset={10}>
      <Modal
        isVisible={visible}
        animationIn="fadeIn"
        swipeDirection="down"
        useNativeDriver={true}
        backdropOpacity={0.5}
        animationOut="fadeOut"
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        backdropColor="rgba(0, 0, 0, 0.7)"
        hideModalContentWhileAnimating
        onBackButtonPress={closeModal}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={[tw`pt-28`, styles.parent]}>
          <Toast
            config={toastConfig}
            innerRef={res => {
              Toast.setRef(res);
            }}
          />
          <View style={[styles.child, tw`items-center`]}>
            <View style={tw`pt-2`}>
              <Text
                style={[
                  {fontFamily: 'Regular', zIndex: -3},
                  tw`text-white text-2xl pb-4`,
                ]}>
                Proceed to delete your account
              </Text>
            </View>

            <View style={tw`flex items-center mt-14`}>
              <TouchableOpacity
                onPress={handleDeleteUser}
                style={tw`flex justify-center items-center w-72 rounded-full py-3 bg-white`}>
                <Text
                  style={[
                    {fontFamily: 'Bold'},
                    tw`text-red-500 text-center text-base flex items-center text-xl`,
                  ]}>
                  {!loading ? 'Proceed' : 'Deleting user...'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: '60%',
    width: '100%',
    transform: [{scaleX: 2}],
    borderTopStartRadius: 200,
    borderTopEndRadius: 200,
    marginTop: 'auto',
    backgroundColor: '#CC0000',
  },
  child: {
    transform: [{scaleX: 0.5}],
    justifyContent: 'center',
    zIndex: -3,
  },
});

export default UpdateProfile;
