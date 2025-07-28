import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { AIResponse, TTSResponse, UseAIAnalysisReturn } from '@/types';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Replace with Ngrok http link
const FLASK_API_URL = 'https://3d0b834d3692.ngrok-free.app';

export const useAIAnalysis = (): UseAIAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIResponse | null>(null);
  const [ttsData, setTtsData] = useState<TTSResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

  // Setup audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupAudio();
  }, []);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  };

  const analyzeImage = async (imageUri: string): Promise<void> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Convert image to base64
      const base64Image = await convertImageToBase64(imageUri);
      
      console.log('🔍 Analyzing image and saving to database...');
      console.log('👤 User ID:', user.id);
      
      // Send to Flask API for analysis and storage
      const response = await fetch(`${FLASK_API_URL}/analyze-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AIResponse = await response.json();
      console.log('✅ Analysis complete:', result.predicted_name);
      console.log('💾 Saved to database:', result.saved_to_db);
      console.log('🔗 Image URL:', result.image_url);
      
      setAnalysisResult(result);
      
      // Auto-generate TTS after analysis
      setTimeout(() => {
        generateTTS(result.display_data);
      }, 500);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      Alert.alert(
        'Analysis Error', 
        `Failed to analyze the image: ${errorMessage}\n\nMake sure:\n1. Flask server is running on ${FLASK_API_URL}\n2. You are logged in to the app\n3. Your user ID is valid`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTTS = async (displayData: { word: string; spelling: string[]; description: string }): Promise<void> => {
    try {
      setIsGeneratingTTS(true);
      setError(null);
      console.log('🔊 Generating TTS for:', displayData.word);
      
      const response = await fetch(`${FLASK_API_URL}/generate-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: displayData.word,
          spelling: displayData.spelling,
          description: displayData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `TTS generation failed: ${response.status}`);
      }

      const ttsResult: TTSResponse = await response.json();
      console.log('✅ TTS generated successfully');
      
      setTtsData(ttsResult);
      
      // Auto-play TTS after generation
      setTimeout(() => {
        playAudio(ttsResult.audio_base64);
      }, 300);
      
    } catch (error) {
      console.error('Error generating TTS:', error);
      console.log('⚠️ TTS generation failed, but analysis succeeded');
      const errorMessage = error instanceof Error ? error.message : 'TTS generation failed';
      setError(errorMessage);
    } finally {
      setIsGeneratingTTS(false);
    }
  };

  const playAudio = async (audioBase64?: string): Promise<void> => {
    try {
      const audioToPlay = audioBase64 || ttsData?.audio_base64;
      
      if (!audioToPlay) {
        Alert.alert('No Audio', 'Audio is not available for this item.');
        return;
      }

      // Stop any currently playing audio
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // Create temporary file for audio
      const audioUri = FileSystem.documentDirectory + 'temp_audio.mp3';
      await FileSystem.writeAsStringAsync(
        audioUri,
        audioToPlay,
        { encoding: FileSystem.EncodingType.Base64 }
      );

      console.log('🔊 Playing audio...');

      // Load and play audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      
      // Clean up audio file after playing
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          FileSystem.deleteAsync(audioUri, { idempotent: true });
          console.log('✅ Audio playback completed');
        }
      });
      
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', 'Failed to play audio.');
      const errorMessage = error instanceof Error ? error.message : 'Audio playback failed';
      setError(errorMessage);
    }
  };

  const testConnection = async (): Promise<void> => {
    try {
      console.log('Testing Flask server connection...');
      const response = await fetch(`${FLASK_API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const healthData = await response.json();
        Alert.alert('Connection Test', 
          `✅ Server is running!\n\n${healthData.message}\n\nSchema: ${healthData.table_schema}\n\nYour User ID: ${user?.id || 'Not logged in'}`
        );
      } else {
        Alert.alert('Connection Test', `❌ Server responded with error: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Connection Test', 
        `❌ Cannot reach server at ${FLASK_API_URL}\n\nError: ${errorMessage}\n\nMake sure:\n1. Flask server is running\n2. Your IP address is correct\n3. Phone and computer are on same network`
      );
    }
  };

  const resetAnalysis = (): void => {
    setAnalysisResult(null);
    setTtsData(null);
    setError(null);
    setIsAnalyzing(false);
    setIsGeneratingTTS(false);
    
    // Stop and cleanup audio
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  return {
    analyzeImage,
    generateTTS,
    playAudio,
    testConnection,
    resetAnalysis,
    isAnalyzing,
    isGeneratingTTS,
    analysisResult,
    ttsData,
    error,
    sound,
  };
};