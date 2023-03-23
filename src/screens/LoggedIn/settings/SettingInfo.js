import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import ActionButton from '../../../components/ActionButton';
import FooterImg from '../../../components/FooterImg';
import TopNav from '../../../components/TopNav';
import Cards from '../../../components/Cards';
import DeleteUser from './DeleteUser';
import tw from 'twrnc';
import {DarkMode} from '../../../config/DarkMode';

// create a component
const SettingInfo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const themes = useContext(DarkMode);

  const handleOpenModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleCloseModal = () => {
    setModalVisible(!modalVisible);
  };

  const openTerms = async () => {
    await Linking.openURL('https://policy.loveafrica.app/terms');
  };

  const policy = async () => {
    await Linking.openURL('https://policy.loveafrica.app');
  };

  const about = async () => {
    await Linking.openURL('https://loveafrica.app/about');
  };

  const faq = async () => {
    await Linking.openURL('https://loveafrica.app/faq');
  };

  const contact = async () => {
    await Linking.openURL('https://loveafrica.app/contact');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: themes.background}]}>
      <View style={tw`flex-1`}>
        <View style={tw`flex`}>
          <TopNav Title="Settings" />
          <View style={tw`w-full`}>
            <View style={tw`px-6 w-full`}>
              <View style={tw`pb-4 mt-8 h-full`}>
                <ScrollView style={tw`h-full `}>
                  <View style={tw`w-full `}>
                    <Text
                      style={[
                        {fontFamily: 'Bold', color: themes.color},
                        tw` text-xl`,
                      ]}>
                      {' '}
                      Legal.
                    </Text>

                    <Cards title=" Terms of Service." action={openTerms} />

                    <Cards title=" Privacy and Policy." action={policy} />
                  </View>

                  <View style={tw`w-full mt-8`}>
                    <Text
                      style={[
                        {fontFamily: 'Bold', color: themes.color},
                        tw`text-xl`,
                      ]}>
                      Contact Us.
                    </Text>
                    <Cards title="  Help and support." action={contact} />

                    <Cards title=" About Us." action={about} />

                    <Cards title="FAQs." action={faq} />
                  </View>

                  <View style={tw`w-full mt-24 flex`}>
                    <ActionButton
                      InfoText="Delete my account"
                      onPressAction={handleOpenModal}
                    />
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </View>

        <DeleteUser visible={modalVisible} closeModal={handleCloseModal} />
      </View>
      <FooterImg />
    </SafeAreaView>
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
export default SettingInfo;
