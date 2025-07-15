import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HomePage</Text>
      <Link href="/flashCardPage">Flash Cards</Link>
      <Link href="/cameraPage">Pix it!</Link>
      <Link href="/cameraPage"></Link>
    </View>
  );
}

// const styles = StyleSheet.create();