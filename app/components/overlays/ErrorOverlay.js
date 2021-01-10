import React from "react";
import { Overlay } from "react-native-elements";
import { StyleSheet } from "react-native";

import AppButton from "../buttons/AppButton";
import AppText from "../AppText";
import colors from "../../config/colors";

function ErrorOverlay({ visible, toggleOverlay }) {
  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
    >
      <>
        <AppText style={styles.text}>Error signing in</AppText>
        <AppText style={styles.text}>Please try again</AppText>
        <AppButton title="back" onPress={toggleOverlay} />
      </>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.delete,
    borderRadius: 40,
    justifyContent: "center",
    padding: 20,
    width: "80%",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ErrorOverlay;
