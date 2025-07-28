import ScreenWrapper from '@/components/ScreenWrapper';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
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

const index = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={styles.mainThing}>
          <Image source={require('../../assets/images/Logo.png')} style={{ width: 220, height: 180}}/>
          <Text style={styles.subtext}>Learning through lenses, growing through curiosity</Text>
        </Animated.View>
        
      </View>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
  },
  mainThing: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
})