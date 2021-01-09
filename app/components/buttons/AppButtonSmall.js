import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
      <View style={styles.icon}>
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            color={colors[iconColor]}
            size={30}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  icon: {},
});

export default AppButtonSmall;
