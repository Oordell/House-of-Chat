import React from "react";
import { StyleSheet, Image } from "react-native";

function UserImage({ imageUri }) {
  return <Image style={styles.image} source={{ uri: imageUri }} />;
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
});

export default UserImage;
