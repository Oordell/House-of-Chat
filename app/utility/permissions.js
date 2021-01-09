import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Alert } from "react-native";
import { Camera } from "expo-camera";

import logger from "../utility/logger";

const requestMediaLibraryPermission = async () => {
  try {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted)
      return Alert.alert("You need to enable permission to acces the library.");
    return true;
  } catch (error) {
    logger.logMessage(
      "Error trying to get permissions to access the users media library."
    );
    logger.logError(error);
  }
};

const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    logger.logMessage("Error while trying to get permission for the Camera.");
    logger.logError(error);
  }
};

const requestNotificationPermission = async () => {
  try {
    const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    return permission.granted ? true : false;
  } catch (error) {
    logger.logMessage("Error trying to get permissions for notifications");
    logger.logError(error);
  }
};

export default {
  requestMediaLibraryPermission,
  requestCameraPermission,
  requestNotificationPermission,
};
