import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";
import dayjs from "dayjs";

import AppText from "./AppText";
import colors from "../config/colors";
import defaultStyles from "../config/styles";

function ListItem({ title, subTitle, lastUpdate, onPress }) {
  const time = dayjs(lastUpdate).format("DD/MM-YYYY, HH:mm:ss");
  const colorsGradiant = [
    colors.primary_dark,
    colors.primary,
    colors.primary_light,
  ];

  return (
    <View style={[styles.container, defaultStyles.shadows]}>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, styles.button]}
        onPress={onPress}
      >
        <LinearGradient
          colors={colorsGradiant}
          style={styles.gradient}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
        >
          <View style={styles.description}>
            <AppText numberOfLines={1} style={styles.title}>
              {title}
            </AppText>
            <AppText numberOfLines={2} style={styles.subTitle}>
              {subTitle}
            </AppText>
            <AppText numberOfLines={1}>Last update: {time}</AppText>
          </View>
          <View style={styles.chevron}>
            <MaterialCommunityIcons
              name="chevron-right"
              color={colors.text_light}
              size={25}
            />
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    overflow: "hidden",
  },
  chevron: {
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    margin: 10,
  },
  description: {
    flex: 1,
    marginLeft: 10,
  },
  gradient: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
  },
  subTitle: {
    color: colors.text_light,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ListItem;
