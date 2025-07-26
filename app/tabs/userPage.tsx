import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { supabase } from '@/lib/supabase';
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
    return (
        <ScreenWrapper style={{ flex: 1, backgroundColor: '#97c4ffff'}}>
            <View style={styles.container}>
                {/* Masih agak jelek, tapi setidaknya tombol fungsional wkwkwk */}
                <View style = {styles.mainThing}>
                    <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{ width: '50%' }}>
                        <Image source={require('../../assets/images/react-logo.png')} style={{ width: 75, height: 75, alignSelf: 'center'}}/> 
                        {/* nanti ganti sama user profile */}
                    </Animated.View>
                    <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{ alignSelf: 'center' }}>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Username</Text>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)}>
                        <Button onPress={handleLogOut} style={{marginTop:10}}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize:15, paddingHorizontal: 20 }}>Logout</Text>
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
        height: '40%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    }
})