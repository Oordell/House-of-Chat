import React from "react";
import { Overlay } from "react-native-elements";
import { StyleSheet, View } from "react-native";

import AppButton from "../buttons/AppButton";
import AppText from "../AppText";
import colors from "../../config/colors";

function NotificationsOverlay({ visible, onYesPressed, onNoPressed }) {
  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={visible}
      onBackdropPress={onNoPressed}
    >
      <>
        <AppText style={styles.title}>Notifications</AppText>
        <AppText>
          Do you want to receive notifications for messages in this chat room?
        </AppText>
        <View style={styles.buttonContainer}>
          <AppButton
            width="30%"
            title="yes"
            color="save"
            onPress={onYesPressed}
          />
          <AppButton
            width="30%"
            title="no"
            color="delete"
            onPress={onNoPressed}
          />
        </View>
      </>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 30,
    padding: 20,
    width: "80%",
  },
  title: {
    alignSelf: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default NotificationsOverlay;
