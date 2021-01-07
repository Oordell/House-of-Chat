import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";

function AppButton({ color = "primary", iconName, title, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          backgroundColor: iconName ? colors[iconName] : colors[color],
        },
        styles.button,
        defaultStyles.shadows,
      ]}
      onPress={onPress}
    >
      <View style={styles.icon}>
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            color={colors.white}
            size={30}
          />
        )}
      </View>
      <AppText style={styles.title}>{title}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    flexDirection: "row",
  },
  icon: {
    position: "absolute",
    left: 15,
  },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
