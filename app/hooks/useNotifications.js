import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { useEffect } from "react";
import { Platform } from "react-native";
import logger from "../utility/logger";

export default useNotifications = () => {
  useEffect(() => {}, []);

  const getPermissionsForNotifications = async () => {
    try {
      let permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      return permission.granted ? true : false;
    } catch (error) {
      logger.logMessage("Error trying to get permissions for notifications");
      logger.logError(error);
    }
  };

  const getExpoPushToken = async () => {
    try {
      const result = await Notifications.getExpoPushTokenAsync();
      return result.data;
    } catch (error) {
      logger.logMessage("Error trying to get expo push token.");
      logger.logError(error);
    }
  };

  const registerForNotificationsAndGetToken = async () => {
    const permission = await getPermissionsForNotifications();
    //if (!permission) return null;

    const token = await getExpoPushToken();
    if (!token) return null;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("messages", {
          name: "Messages from other users",
          enableLights: true,
          enableVibrate: true,
        });
      } catch (error) {
        logger.logMessage("Error setting notification channel for Android.");
        logger.logError(error);
      }
    }

    return token;
  };

  const addNotificationListener = (notificationListener) => {
    if (notificationListener)
      Notifications.addNotificationResponseReceivedListener(
        notificationListener
      );
  };

  return { registerForNotificationsAndGetToken, addNotificationListener };
};
