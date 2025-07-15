import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { supabase } from '@/lib/supabase';

// Sorry ges, I dont wanna set the default to flashCardPage that's why i made a button
// Feel free to move the flashcard button navigation around, just make sure that i can still access the flashcard page XD
// Don't worry, I didn't download any strange imports

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

const HomeScreen = () => {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>HomePage</Text>
        <Link href="/flashCardPage">Flash Cards</Link>
        <Link href="/cameraPage">Pix it!</Link>
        {/* <Button
          title="Go to FlashCard Page"
          onPress={() => navigation.navigate('FlashCard')}
        /> */}
        <Button style={{ width: '50%' }} onPress={handleLogOut}>
          <Text style={{ color: 'white' }}>LogOut</Text>
        </Button>
      </View>
    </ScreenWrapper>
  );
}

export default HomeScreen

const styles = StyleSheet.create({})