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
    left: 15,
    position: "absolute",
  },
  container: {
    alignItems: "flex-end",
    bottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight + 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  titleView: {
    alignItems: "center",
    width: "75%",
  },
});

export default ChatHeader;
