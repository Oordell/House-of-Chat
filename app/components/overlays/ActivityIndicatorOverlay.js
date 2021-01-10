import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";

import colors from "../../config/colors";

function ActivityIndicatorOverlay({ visible }) {
  return (
    <Overlay overlayStyle={styles.container} isVisible={visible}>
      <ActivityIndicator size="large" color={colors.text_light} />
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default ActivityIndicatorOverlay;
