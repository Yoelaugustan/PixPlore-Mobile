import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';

const index = () => {
  const router = useRouter()

  useEffect(() => {
      const checkAuthStatus = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              router.replace('/tabs')
            }
            else{
              setTimeout(() => {
                router.replace('/(auth)/welcome')
              }, 2000)
            }
        } catch (error){
            console.log(error)
            setTimeout(() => {
              router.replace('/(auth)/welcome')
            }, 2000)
        }
      }
      checkAuthStatus();
  }, [router])

  return (
    <View style={styles.container}>
      <Image 
        style={styles.logo}
        resizeMode='contain'
        source={require('../assets/images/splash.png')}
      />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container:{ 
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
  },
  logo: {
      height: '20%',
      aspectRatio: 1,
  },

})
