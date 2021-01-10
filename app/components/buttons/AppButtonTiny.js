import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";

import colors from "../../config/colors";

function AppButtonTiny({
  color = "primary",
  iconName,
  iconColor = "black",
  onPress,
}) {
  return (
    <Pressable
      style={[{ backgroundColor: colors[color] }, styles.button]}
      onPress={onPress}
    >
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          color={colors[iconColor]}
          size={17}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
});

export default AppButtonTiny;
