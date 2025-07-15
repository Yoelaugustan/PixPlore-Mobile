import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';

const Stack = createNativeStackNavigator();

export default function HomeScreen({ navigation }: any) {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>HomePage</Text>
        <Link href="/flashCardPage">Flash Cards</Link>
        <Link href="/cameraPage">Pix it!</Link>
        <Link href="/cameraPage"></Link>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create();