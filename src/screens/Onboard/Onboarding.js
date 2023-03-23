import React, { useRef, useState, useEffect } from 'react'
import tw from 'twrnc'
import { Image, StyleSheet, SafeAreaView, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import * as image from '../../components/Images'
import Load from '../../components/Load'
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const whitish = { white: '#fff' };
const slides = [
    {
        id: 1,
        image: image.boardOne,
        caption: <Text style={{ fontFamily: "Light", display: 'flex-wrap', }}>Make connections with people around the world and get matched with like-minded individuals. <Text style={[tw`pt-4`, { fontWeight: 'bold', display: 'flex-wrap', flexDirection: 'column' }]}>Dare to meet your match.</Text></Text>,
    },
    {
        id: 2,
        image: image.boardTwo,
        caption: <Text style={{ fontFamily: "Light", }}>Use the Chat Starter to engage with your matches. It is a great way to test compatability and learn about each other</Text>,
    },
];

const Slide = ({ item }) => {
    return (
        <SafeAreaView style={tw`flex justify-center items-center`}>
            <Image
                source={item.image}
                style={{ height: '43%', width, resizeMode: 'contain' }} />
            <View style={[tw`text-white text-2xl font-bold mt-8 text-center`, { fontSize: '3rem', color: 'white' }]}>
                <Text style={[tw`max-w-xs text-base text-black px-4`, { lineHeight: 25, fontFamily: 'Bold' }]}> {item.caption}</Text>
            </View>

        </SafeAreaView>
    )
}
const Onboarding = ({ navigation }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loader, setLoader] = useState(true);


    useEffect(
        () => {
            setTimeout(() => {
                setLoader(false);
            }, 2000);
        },
        [loader]
    );

    const ref = useRef(null);
    const Footer = () => {
        return (
            <View style={[{
                height: height * 0.25,
                justifyContent: 'space-between',
                paddingHorizontal: 20,
            }, tw`mb-12`]}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    justifyContent: 'center'
                }}>
                    {slides.map((_, index) => (
                        <View key={index} style={[styles.indicator, currentSlideIndex == index && {
                            backgroundColor: '#CC0000',
                            width: 10,
                            height: 5,
                            borderRadius: 50,
                        }]} />
                    ))}
                </View>
                <View style={{ marginBottom: 15 }}></View>
                {
                    currentSlideIndex == slides.length - 1
                        ?
                        <View style={{ height: 50, marginBottom: 30 }}>
                            <TouchableOpacity style={[styles.btn]} onPress={() => navigation.replace('Home')}>
                                <Text style={[{ fontFamily: 'Bold' }, tw`text-white text-xl`]}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        :

                        <View style={{ height: 50, marginBottom: 30 }}>
                            <TouchableOpacity onPress={nextSlide} style={[styles.btn]}>
                                <Text style={[{ fontFamily: 'Bold' }, tw`text-white  text-xl`]}>Next</Text>
                            </TouchableOpacity>

                        </View>
                }

            </View>
        )
    };

    const updateSlideIndex = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    const nextSlide = () => {
        const nextSlides = currentSlideIndex + 1;
        if (nextSlides != slides.length) {
            const offset = nextSlides * width;
            ref?.current?.scrollToOffset({ offset });
            setCurrentSlideIndex(nextSlides);
        }
    };


    return (
        <React.Fragment>
            {loader ? <Load /> : (

                <Animated.View entering={FadeInDown}>
                    <FlatList
                        ref={ref}
                        onMomentumScrollEnd={updateSlideIndex}
                        data={slides}
                        contentContainerStyle={{ height: height * 0.75 }}
                        pagingEnabled
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <Slide item={item} />}
                    />
                    <Footer />
                </Animated.View>
            )}
        </React.Fragment>
    )
}

styles = StyleSheet.create({
    indicator: {
        height: 5,
        width: 5,
        backgroundColor: 'grey',
        marginHorizontal: 3,
        borderRadius: 5,
    },
    btn: {
        backgroundColor: '#CC0000',
        color: whitish.white,
        borderRadius: 50,
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }

});
export default Onboarding;