import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";
import Constants from "expo-constants";

function ChatHeader({ headerTitle, onPressBack }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPressBack}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
          styles.button,
        ]}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={colors.text}
        />
      </Pressable>
      <View style={styles.titleView}>
        <AppText style={styles.title} numberOfLines={1}>
          {headerTitle}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 15,
  },
  container: {
    paddingTop: Constants.statusBarHeight + 15,
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
    bottom: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  titleView: {
    width: "75%",
    alignItems: "center",
  },
});

export default ChatHeader;
