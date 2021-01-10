import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Pressable, View } from "react-native";

import AppText from "../AppText";
import colors from "../../config/colors";
import defaultStyles from "../../config/styles";

function AppButton({
  color = "primary",
  iconName,
  title,
  onPress,
  width = "100%",
}) {
  const colorsGradiant = [
    colors[color + "_dark"],
    colors[color],
    colors[color + "_light"],
  ];

  return (
    <View style={[styles.container, defaultStyles.shadows, { width }]}>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
            backgroundColor: iconName ? colors[iconName] : colors[color],
          },
          styles.button,
        ]}
        onPress={onPress}
      >
        <LinearGradient
          colors={colorsGradiant}
          style={styles.gradient}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
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
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    overflow: "hidden",
  },
  container: {
    borderRadius: 100,
    marginVertical: 10,
    width: "100%",
  },
  gradient: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
  },
  icon: {
    left: 15,
    position: "absolute",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default AppButton;
