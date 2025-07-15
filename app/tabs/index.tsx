import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import FlashCardPage from './flashCardPage';

// Sorry ges, I dont wanna set the default to flashCardPage that's why i made a button
// Feel free to move the flashcard button navigation around, just make sure that i can still access the flashcard page XD
// Don't worry, I didn't download any strange imports

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HomePage</Text>
      <Link href="/flashCardPage">Flash Cards</Link>
      <Link href="/cameraPage">Pix it!</Link>
      {/* <Button
        title="Go to FlashCard Page"
        onPress={() => navigation.navigate('FlashCard')}
      /> */}
    </View>
  );
}

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FlashCard" component={FlashCardPage} />
    </Stack.Navigator>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });