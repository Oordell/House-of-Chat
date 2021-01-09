import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import colors from "../../config/colors";
import AppButton from "../AppButton";
import AppText from "../AppText";

function NotificationsOverlay({ visible, onYesPressed, onNoPressed }) {
  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={visible}
      onBackdropPress={onNoPressed}
    >
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
    </Overlay>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "80%",
    backgroundColor: colors.background,
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  title: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 22,
  },
});

export default NotificationsOverlay;
