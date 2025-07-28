import ScreenWrapper from '@/components/ScreenWrapper';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAIAnalysis } from '@/hooks/useAI';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPhotoUri, setModalPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const {
    analyzeImage,
    playAudio,
    testConnection,
    resetAnalysis,
    isAnalyzing,
    isGeneratingTTS,
    analysisResult,
    ttsData,
    error
  } = useAIAnalysis();

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === 'granted');
    })();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  async function captureImage() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo captured:', photo.uri);

      if (hasMediaLibraryPermission) {
        await MediaLibrary.createAssetAsync(photo.uri);
        console.log('Photo saved to media library!');
      }

      // Show modal with captured photo
      setModalPhotoUri(photo.uri);
      setIsModalVisible(true);
      resetAnalysis();

      await analyzeImage(photo.uri);
    }
  }

  const closeModal = () => {
    setIsModalVisible(false);
    setModalPhotoUri(null);
    resetAnalysis(); // This will cleanup audio and reset states
  };

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: '#97c4ffff'}}>
      <View style={styles.container}>
        {isFocused && (
          <CameraView ref={cameraRef} style={styles.camera} facing={'back'}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button1} onPress={captureImage}>
                <Text style={styles.text}>Pix-It!</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        )}

        {/* ✅ Custom Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {isAnalyzing && (
                <>
                  <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
                  <Text style={styles.analyzingText}>AI is analyzing your image...</Text>
                  <Text style={styles.subText}>Saving to database</Text>
                </>
              )}

              {/* Step 2: Display Results (BEFORE TTS) */}
              {!isAnalyzing && analysisResult && (
                <>
                  {/* Word Title */}
                  <Text style={styles.modalTextTitle}>
                    {analysisResult.predicted_name.toUpperCase()}
                  </Text>
                  
                  {/* Image */}
                  {modalPhotoUri && (
                    <Image
                      source={{ uri: modalPhotoUri }}
                      style={styles.modalImage}
                    />
                  )}
                  
                  {/* Spelling */}
                  <Text style={styles.spellingText}>
                    {analysisResult.spelling.join(' - ').toUpperCase()}
                  </Text>
                  
                  {/* Description */}
                  <Text style={styles.modalText}>
                    {analysisResult.description}
                  </Text>

                  {/* Database Save Status */}
                  {analysisResult.saved_to_db && (
                    <Text style={styles.successText}>
                      Saved to flashcards!
                    </Text>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Text style={styles.errorText}>
                      {error}
                    </Text>
                  )}

                  {/* TTS Status */}
                  {isGeneratingTTS && (
                    <View style={styles.ttsContainer}>
                      <ActivityIndicator size="small" color="#4CAF50" />
                      <Text style={styles.ttsText}>Generating audio...</Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.buttonRow}>
                    {ttsData && !isGeneratingTTS && (
                      <TouchableOpacity onPress={() => playAudio()} style={styles.audioButton}>
                        <Text style={styles.buttonText}>Play Again</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Error State */}
              {!isAnalyzing && !analysisResult && error && (
                <>
                  {modalPhotoUri && (
                    <Image
                      source={{ uri: modalPhotoUri }}
                      style={styles.modalImage}
                    />
                  )}
                  <Text style={styles.modalText}>Analysis failed</Text>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Loading State (no results yet) */}
              {!isAnalyzing && !analysisResult && !error && (
                <>
                  {modalPhotoUri && (
                    <Image
                      source={{ uri: modalPhotoUri }}
                      style={styles.modalImage}
                    />
                  )}
                  <Text style={styles.modalText}>Processing...</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    alignSelf: 'center',
    height: '95%',
    width: '90%',
    margin: 0,
    borderRadius: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 32,
  },
  button1: {
    width: '100%',
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  text2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalTextTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  spellingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginBottom: 8,
    textAlign: 'center',
  },
  ttsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  ttsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  audioButton: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  loader: {
    marginBottom: 16,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});