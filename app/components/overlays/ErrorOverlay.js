import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import colors from "../../config/colors";
import AppButton from "../AppButton";
import AppText from "../AppText";

function ErrorOverlay({ visible, toggleOverlay }) {
  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
    >
      <AppText style={styles.text}>Error signing in</AppText>
      <AppText style={styles.text}>Please try again</AppText>
      <AppButton title="back" onPress={toggleOverlay} />
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    backgroundColor: colors.delete,
    borderRadius: 40,
  },
  text: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10,
  },
});

export default ErrorOverlay;
