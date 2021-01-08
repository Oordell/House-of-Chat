import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppButtonTiny from "./AppButtonTiny";

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
    overflow: "hidden",
    width: 40,
    height: 30,
    resizeMode: "cover",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.text_light,
    borderRadius: 5,
  },
  tinyDeleteLogo: {
    position: "absolute",
    right: 0,
  },
});

export default ChatImageAndCameraButton;
