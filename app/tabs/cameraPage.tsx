import ScreenWrapper from '@/components/ScreenWrapper';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPhotoUri, setModalPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  var predictedName = 'BEE'
  var itemDescription = 'A winged insect, likes honey'

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
    }
  }

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
              <Text style={styles.modalTextTitle}>{predictedName}</Text>
              {modalPhotoUri && (
                <Image
                  source={{ uri: modalPhotoUri }}
                  style={{ width: 200, height: 300, borderRadius: 10 }}
                />
              )}
              <Text style={styles.modalText}>{itemDescription}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.text2}>Close</Text>
              </TouchableOpacity>
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
});