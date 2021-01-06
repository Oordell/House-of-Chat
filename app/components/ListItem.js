import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";
import defaultStyles from "../config/styles";

function ListItem({ title, subTitle, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
        styles.container,
        defaultStyles.shadows,
      ]}
      onPress={onPress}
    >
      <View style={styles.description}>
        <AppText numberOfLines={1}>{title}</AppText>
        <AppText numberOfLines={2} style={styles.subTitle}>
          {subTitle}
        </AppText>
      </View>
      <View style={styles.chevron}>
        <MaterialCommunityIcons
          name="chevron-right"
          color={colors.text_light}
          size={25}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevron: {
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.primary,
    height: 100,
    alignItems: "center",
    borderRadius: 20,
  },
  description: {
    marginLeft: 10,
    flex: 1,
  },
  subTitle: {
    color: colors.text_light,
  },
});

export default ListItem;
