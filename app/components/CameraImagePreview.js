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
    width: "100%",
    height: "100%",
  },
  image: {
    flex: 1,
  },
  deleteButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default CameraImagePreview;
