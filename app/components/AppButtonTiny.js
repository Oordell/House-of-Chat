import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

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
      <View style={styles.icon}>
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            color={colors[iconColor]}
            size={17}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default AppButtonTiny;
