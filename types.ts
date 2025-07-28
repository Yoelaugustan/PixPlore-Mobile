import { StyleProp, TextInput, TextInputProps, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native"

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    isModal?: boolean;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
}

export type BackButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
}

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
}

// Flashcards Assets
export type FlashCardItem = {
  id: string;
  image_link: string;
  label: string;
  frameId: number;
  backgroundColor: string;
};

export const frameMap: Record<number, number> = {
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

export const borderColors = [
  "#A0F8FF", "#FF8CC6", "#F86666", "#90D76B",
  "#CBA3FF", "#FFF685", "#A3DFFF", "#FCA3B7",
  "#D6FF70", "#B5FBC0", "#FFB347", "#FFD8A9",
  "#B3C7FF", "#66CFFF", "#6BD6D3", "#FFE266"
];

export interface UseAuthReturn {
    userName: string
    userEmail: string
}

export interface AIResponse {
  success: boolean;
  predicted_name: string;
  confidence: number;
  spelling: string[];
  description: string;
  image_url: string;
  saved_to_db: boolean;
  user_id: string;
  display_data: {
    word: string;
    spelling: string[];
    description: string;
  };
}

export interface TTSResponse {
  success: boolean;
  audio_base64: string;
  spelling_sentence: string;
  word: string;
}

export interface UseAIAnalysisReturn {
  // Functions
  analyzeImage: (imageUri: string) => Promise<void>;
  generateTTS: (displayData: { word: string; spelling: string[]; description: string }) => Promise<void>;
  playAudio: (audioBase64?: string) => Promise<void>;
  testConnection: () => Promise<void>;
  resetAnalysis: () => void;

  // States
  isAnalyzing: boolean;
  isGeneratingTTS: boolean;
  analysisResult: AIResponse | null;
  ttsData: TTSResponse | null;
  error: string | null;

  // Audio
  sound: Audio.Sound | null;
}