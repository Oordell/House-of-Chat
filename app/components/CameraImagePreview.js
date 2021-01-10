import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

import AppButtonSmall from "./buttons/AppButtonSmall";

function CameraImagePreview({ capturedImage, onDeletePressed, onSavePressed }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: capturedImage }} style={styles.image}>
        <View style={styles.deleteButton}>
          <AppButtonSmall
            iconName="delete"
            color="delete"
            onPress={onDeletePressed}
          />
        </View>
        <View style={styles.saveButton}>
          <AppButtonSmall
            iconName="check-bold"
            color="save"
            onPress={onSavePressed}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  deleteButton: {
    bottom: 20,
    left: 20,
    position: "absolute",
  },
  image: {
    flex: 1,
  },
  saveButton: {
    bottom: 20,
    position: "absolute",
    right: 20,
  },
});

export default CameraImagePreview;
