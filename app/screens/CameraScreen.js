import React, { useState } from "react";
import { Camera } from "expo-camera";
import { StyleSheet, View } from "react-native";

import AppButtonSmall from "../components/buttons/AppButtonSmall";
import cache from "../utility/cache";
import CameraImagePreview from "../components/CameraImagePreview";
import logger from "../utility/logger";
import Screen from "../components/Screen";

function CameraScreen({ navigation }) {
  let camera;
  const [cameraReady, setCameraReady] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleTakePicture = async () => {
    try {
      const image = await camera.takePictureAsync({ quality: 1 });
      setCapturedImage(image.uri);
      setPreviewVisible(true);
    } catch (error) {
      logger.logMessage("Error taking image: ");
      logger.logError(error);
    }
  };

  const handleDeletePressed = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
  };

  const handleOnSave = async () => {
    await cache.store("capturedImage", capturedImage);
    navigation.goBack();
  };

  return (
    <Screen>
      {previewVisible ? (
        <CameraImagePreview
          capturedImage={capturedImage}
          onDeletePressed={handleDeletePressed}
          onSavePressed={handleOnSave}
        />
      ) : (
        <Camera
          style={styles.cameraContainer}
          onCameraReady={() => setCameraReady(true)}
          ref={(r) => {
            camera = r;
          }}
        >
          {cameraReady && (
            <>
              <View style={styles.backButton}>
                <AppButtonSmall
                  color="black"
                  iconName="close"
                  iconColor="white"
                  onPress={() => navigation.goBack()}
                />
              </View>
              <View style={styles.takePictureButton}>
                <AppButtonSmall
                  color="white"
                  iconName="image-filter-center-focus"
                  onPress={handleTakePicture}
                />
              </View>
            </>
          )}
        </Camera>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    left: 20,
    position: "absolute",
    top: 20,
  },
  cameraContainer: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  takePictureButton: {
    bottom: 20,
    position: "absolute",
  },
});

export default CameraScreen;
