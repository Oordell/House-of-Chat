import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";
import defaultStyles from "../config/styles";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";

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
  container: {
    borderRadius: 20,
    margin: 10,
  },
  chevron: {
    justifyContent: "center",
  },
  button: {
    overflow: "hidden",
    borderRadius: 20,
    /* justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 20, */
  },
  description: {
    marginLeft: 10,
    flex: 1,
  },
  gradient: {
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  subTitle: {
    color: colors.text_light,
  },
});

export default ListItem;
