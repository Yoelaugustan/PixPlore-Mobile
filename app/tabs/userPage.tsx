import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { radius, spacingX, spacingY } from '@/constants/theme';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { scale, verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import React from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const router = useRouter()
const handleLogOut = async() =>{
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      Alert.alert('Logout Error', error.message)
    } else {
      router.replace('/(auth)/welcome')
    }
  } catch (error) {
    console.error('Logout error:', error)
    Alert.alert('Logout Error', 'An unexpected error occurred')
  }
} 

const mainPage = () => {
    const { userName } = useAuth()
    
    return (
        <ScreenWrapper style={{ flex: 1, backgroundColor: '#97c4ffff'}}>
            <View style={styles.container}>
                {/* Masih agak jelek, tapi setidaknya tombol fungsional wkwkwk */}
                <View style = {styles.mainThing}>
                    <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{ width: '50%' }}>
                        <Image source={require('../../assets/images/react-logo.png')} style={{ width: 75, height: 75}}/> 
                    </Animated.View>
                    <Animated.View entering={FadeInDown.duration(3000).springify().damping(12)} style={{ width: '50%' }}>
                        <Text style={{textTransform: 'capitalize', fontSize: verticalScale(15), fontWeight: '700'}}>{userName}</Text>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.duration(5000).springify().damping(12)}>
                        <Button onPress={handleLogOut} style={{paddingHorizontal: spacingX._30}}>
                            <Text style={{ color: 'white', fontWeight: '700' }}>Logout</Text>
                        </Button>
                    </Animated.View>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default mainPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    mainThing: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._20,
        backgroundColor: 'white',
        borderRadius: radius._10,
        gap: spacingY._10,
    }
})