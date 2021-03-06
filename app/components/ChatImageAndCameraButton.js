import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppButtonTiny from "./buttons/AppButtonTiny";
import colors from "../config/colors";

function ChatImageAndCameraButton({
  onImagePress,
  onCameraPress,
  imageIsBeingSelected = false,
  selectedimageUri = false,
  onSelectedImagePressed,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onImagePress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons
          style={styles.logos}
          name="image"
          size={30}
          color={colors.text_light}
        />
      </Pressable>
      <Pressable
        onPress={onCameraPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons
          style={styles.logos}
          name="camera"
          size={30}
          color={colors.text_light}
        />
      </Pressable>
      {selectedimageUri ? (
        <Pressable onPress={onSelectedImagePressed}>
          <ImageBackground
            style={styles.selectedImage}
            source={{ uri: selectedimageUri }}
          >
            <View style={styles.tinyDeleteLogo}>
              <AppButtonTiny
                iconName="close-circle"
                iconColor="delete"
                color="black"
                onPress={onSelectedImagePressed}
              />
            </View>
          </ImageBackground>
        </Pressable>
      ) : (
        imageIsBeingSelected && (
          <View style={styles.logos}>
            <ActivityIndicator size="small" color={colors.text_light} />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  logos: {
    marginLeft: 10,
    paddingBottom: 5,
  },
  selectedImage: {
    borderColor: colors.text_light,
    borderRadius: 5,
    borderWidth: 1,
    height: 30,
    marginLeft: 10,
    overflow: "hidden",
    resizeMode: "cover",
    width: 40,
  },
  tinyDeleteLogo: {
    position: "absolute",
    right: 0,
  },
});

export default ChatImageAndCameraButton;
