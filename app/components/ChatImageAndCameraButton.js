import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

function ChatImageAndCameraButton({
  onImagePress,
  onCameraPress,
  imageIsSelected = false,
  imageDownloadUri = false,
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
      {imageDownloadUri ? (
        <Image
          style={styles.selectedImage}
          source={{ uri: imageDownloadUri }}
        />
      ) : (
        imageIsSelected && (
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
    width: 40,
    height: 30,
    resizeMode: "cover",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.text_light,
    borderRadius: 5,
  },
});

export default ChatImageAndCameraButton;
