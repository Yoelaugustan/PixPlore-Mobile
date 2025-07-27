import ScreenWrapper from '@/components/ScreenWrapper';
import { spacingY } from '@/constants/theme';
import { useFlashcards } from '@/hooks/useFlashcard';
import { FlashCardItem, frameMap } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
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

  const { flashcards, loading, refreshFlashcards } = useFlashcards();

  useFocusEffect(
    React.useCallback(() => {
      refreshFlashcards();
    }, [])
  );

  if (loading) {
    return(
      <ScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6562ff" />
        <Text style={styles.loadingText}>Loading your flashcards...</Text>
    </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Tap to Reveal!</Text>

        {
          flashcards.length > 0 ? (
            <FlatList
              data={flashcards}
              renderItem={({ item }) => <FlashCard item={item} cardWidth={CARD_WIDTH} />}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
              contentContainerStyle={styles.list}
              style={styles.flatList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refreshFlashcards}
                  tintColor="#6562ff"
                  colors={["#6562ff"]}
                />
              }
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Start taking pictures to create your first flashcard collection!
              </Text>
            </View>
          )
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noDataContainer: {
    padding: scale(40),
    marginBottom: spacingY._20,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: verticalScale(20),
    fontWeight: '700',
  },
});