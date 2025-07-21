import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"

const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper style={{ backgroundColor: '#e291ffff', }}>
            <View style={styles.container}>
                <View style={styles.content}>
                <Animated.Image
                    source={require('../../assets/images/welcome.png')}
                    style={styles.welcomeImage}
                    resizeMode="contain"
                    entering={FadeIn.duration(1000)}
                />
                    <View style={{ gap: 3 }}>
                    <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{alignItems: 'center'}}>
                        <Text style={{ fontSize: verticalScale(30), fontWeight: '800' }}>See it, snap it, learn it!</Text>
                    </Animated.View>
                    
                    <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{alignItems:'center', gap: 2}}>
                        <Text style={{ fontSize: verticalScale(17), textAlign: 'center' }}>Take pictures of objects around you and</Text>
                        <Text style={{ fontSize: verticalScale(17), textAlign: 'center' }}>instantly discover what they are.</Text>
                    </Animated.View>
                    </View>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.buttonContainer}>
                    <Button onPress={()=>router.push('/(auth)/register')}>
                        <Text style={{ fontSize: verticalScale(20), color: 'white', fontWeight: '700' }}>Snap Now</Text>
                    </Button>
                </Animated.View>

                {/* Login Button & Image*/}
                <Animated.View entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} style={{flexDirection: 'row', gap: 5}}>
                    <Text style={{ fontSize: verticalScale(15) }}>Have an account?</Text>
                    <Pressable onPress={()=>router.push('/(auth)/login')}>
                        <Text style={{ fontSize: verticalScale(15), fontWeight: '700', color: 'black' }}>Login</Text>
                    </Pressable>
                </Animated.View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: spacingY._7,
        
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    welcomeImage: {
        width: "100%",
        height: verticalScale(300),
        justifyContent: 'center'
    },
    footer: {
        alignItems: 'center',
        paddingTop: verticalScale(30),
        paddingBottom: verticalScale(45),
        gap: spacingY._20,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: spacingX._25,
    }
})