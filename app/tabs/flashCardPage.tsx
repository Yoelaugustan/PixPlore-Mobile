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
  frameId: number;
  backgroundColor: string;
};

const frameMap: Record<number, number> = {
  1: require('@/assets/flashcard_borders/1.png'),
  2: require('@/assets/flashcard_borders/2.png'),
  3: require('@/assets/flashcard_borders/3.png'),
  4: require('@/assets/flashcard_borders/4.png'),
  5: require('@/assets/flashcard_borders/5.png'),
  6: require('@/assets/flashcard_borders/6.png'),
  7: require('@/assets/flashcard_borders/7.png'),
  8: require('@/assets/flashcard_borders/8.png'),
  9: require('@/assets/flashcard_borders/9.png'),
  10: require('@/assets/flashcard_borders/10.png'),
  11: require('@/assets/flashcard_borders/11.png'),
  12: require('@/assets/flashcard_borders/12.png'),
  13: require('@/assets/flashcard_borders/13.png'),
  14: require('@/assets/flashcard_borders/14.png'),
  15: require('@/assets/flashcard_borders/15.png'),
  16: require('@/assets/flashcard_borders/16.png'),
};

const borderColors = [
  "#A0F8FF", "#FF8CC6", "#F86666", "#90D76B",
  "#CBA3FF", "#FFF685", "#A3DFFF", "#FCA3B7",
  "#D6FF70", "#B5FBC0", "#FFB347", "#FFD8A9",
  "#B3C7FF", "#66CFFF", "#6BD6D3", "#FFE266"
];

const rawData = [
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

const processedData = rawData.map((item, index) => {
  const frameId = (index % 16) + 1;
  return {
    ...item,
    frameId,
    backgroundColor: borderColors[frameId - 1],
  };
});

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
      <View style={[styles.imageContainer, { backgroundColor: item.backgroundColor }]}>
        {flipped ? (
          <View style={[styles.card, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.cardText}>{item.label}</Text>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: item.image_link }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            <Image
              source={frameMap[item.frameId]}
              style={styles.borderOverlay}
              resizeMode="stretch"
            />
          </>
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
        data={processedData}
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
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
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    flex: 1,
  },

  mainImage: {
    width: '100%',
    height: '100%',
  },

  borderOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
});