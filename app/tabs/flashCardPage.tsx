import ScreenWrapper from '@/components/ScreenWrapper';
import { FlashCardItem, frameMap } from '@/types';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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

// Mapping Borders and Animations
const processedData = rawData.map((item, index) => {
  const frameId = (index % 16) + 1;
  return {
    ...item,
    frameId,
    backgroundColor: borderColors[frameId - 1],
  };
});

const FlashCard = ({ item, cardWidth }: { item: FlashCardItem; cardWidth: number }) => {
  const flip = useSharedValue(0);
  const cardHeight = cardWidth * 1.5;

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` }
    ],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` }
    ],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
  }));

  return (
    <TouchableWithoutFeedback onPress={() => {
      flip.value = withTiming(flip.value === 0 ? 1 : 0, { duration: 300 });
    }}>
      <View style={[styles.cardWrapper, { width: cardWidth, height: cardWidth * 1.5 }]}>
        <Animated.View style={[styles.card, frontStyle, { backgroundColor: item.backgroundColor }]}>
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
        </Animated.View>

        <Animated.View style={[styles.card, backStyle, { backgroundColor: item.backgroundColor }]}>
          <Text style={styles.cardText}>{item.label}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function FlashCardPage() {
  const { width: screenWidth } = useWindowDimensions();
  const padding = 16 * 2;
  const gap = 16;
  const numColumns = Math.floor(screenWidth / 160) || 1;

  const totalGap = (numColumns - 1) * gap;
  const usableWidth = screenWidth - padding - totalGap;
  const CARD_WIDTH = usableWidth / numColumns;
  
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Tap to Reveal!</Text>
        <FlatList
          data={processedData}
          renderItem={({ item }) => <FlashCard item={item} cardWidth={CARD_WIDTH} />}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
          contentContainerStyle={styles.list}
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardWrapper: {
    marginHorizontal: 8,
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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
    borderRadius: 16,
    overflow: 'hidden',
  },
});