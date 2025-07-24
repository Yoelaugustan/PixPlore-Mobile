import ScreenWrapper from '@/components/ScreenWrapper';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

type FlashCardItem = {
  id: string;
  image_link: string;
  label: string;
};

const DATA: FlashCardItem[] = [
  {
    id: '1',
    image_link: 'https://assets.clevelandclinic.org/transform/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg',
    label: 'Apple 🍎',
  },
  {
    id: '2',
    image_link: 'https://4.imimg.com/data4/SW/AA/MY-33406727/tennis-ball-1000x1000.jpg',
    label: 'Ball 🏀',
  },
  {
    id: '3',
    image_link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg',
    label: 'Cat 🐱',
  },
    {
    id: '4',
    image_link: 'https://assets.clevelandclinic.org/transform/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg',
    label: 'Apple 🍎',
  },
  {
    id: '5',
    image_link: 'https://4.imimg.com/data4/SW/AA/MY-33406727/tennis-ball-1000x1000.jpg',
    label: 'Ball 🏀',
  },
  {
    id: '6',
    image_link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg',
    label: 'Cat 🐱',
  },
    {
    id: '7',
    image_link: 'https://assets.clevelandclinic.org/transform/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg',
    label: 'Apple 🍎',
  },
  {
    id: '8',
    image_link: 'https://4.imimg.com/data4/SW/AA/MY-33406727/tennis-ball-1000x1000.jpg',
    label: 'Ball 🏀',
  },
  {
    id: '9',
    image_link: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg',
    label: 'Cat 🐱',
  },
];

const { width: screenWidth } = useWindowDimensions();
const padding = 16 * 2; // from contentContainerStyle
const gap = 16;
const numColumns = Math.floor(screenWidth / 160) || 1;

const totalGap = (numColumns - 1) * gap;
const usableWidth = screenWidth - padding - totalGap;
const CARD_WIDTH = usableWidth / numColumns;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const FlashCard = ({ item, cardWidth }: { item: FlashCardItem; cardWidth: number }) => {
  const [flipped, setFlipped] = useState(false);
  const cardHeight = cardWidth * 1.5;

  return (
    <Pressable
      onPress={() => setFlipped(!flipped)}
      style={[styles.cardWrapper, { width: cardWidth, height: cardHeight }]}
    >
      <View style={styles.card}>
        {flipped ? (
          <Text style={styles.cardText}>{item.label}</Text>
        ) : (
          <Image source={{ uri: item.image_link }} style={styles.image} resizeMode="cover" />
        )}
      </View>
    </Pressable>
  );
};

export default function FlashCardPage() {
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / CARD_WIDTH) || 1;

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.header}>Tap to Reveal!</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <FlashCard item={item} cardWidth={CARD_WIDTH} />}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={styles.list}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFD966',
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    overflow: 'hidden',
    elevation: 4,
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});