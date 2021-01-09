import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import { LinearGradient } from "expo-linear-gradient";

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
  container: {
    borderRadius: 100,
    width: "100%",
    marginVertical: 10,
  },
  button: {
    overflow: "hidden",
    borderRadius: 100,
  },
  icon: {
    position: "absolute",
    left: 15,
  },
  gradient: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
