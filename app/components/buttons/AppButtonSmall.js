import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";

import colors from "../../config/colors";
import defaultStyles from "../../config/styles";

function AppButtonSmall({
  color = "primary",
  iconName,
  iconColor = "black",
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          backgroundColor: colors[color],
        },
        styles.button,
        defaultStyles.shadows,
      ]}
      onPress={onPress}
    >
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          color={colors[iconColor]}
          size={30}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 30,
    justifyContent: "center",
    padding: 10,
  },
});

export default AppButtonSmall;
