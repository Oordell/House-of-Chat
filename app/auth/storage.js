import * as SecureStore from "expo-secure-store";

import logger from "../utility/logger";

const keyToken = "authToken";
const keyUser = "authUser";

const storeAuthToken = async (loginInfo) => {
  try {
    await SecureStore.setItemAsync(keyToken, JSON.stringify(loginInfo));
  } catch (error) {
    logger.logMessage("Error trying to store the users auth token in vault");
    logger.logError(error);
  }
};

const getAuthToken = async () => {
  try {
    const value = await SecureStore.getItemAsync(keyToken);
    const loginInfo = JSON.parse(value);

    if (!loginInfo) return null;

    return loginInfo;
  } catch (error) {
    logger.logMessage("Error trying to get the users auth token from vault");
    logger.logError(error);
  }
};

const removeAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync(keyToken);
  } catch (error) {
    logger.logMessage("Error trying to remove the auth token in vault");
    logger.logError(error);
  }
};

const storeUser = async (user) => {
  try {
    await SecureStore.setItemAsync(keyUser, JSON.stringify(user));
  } catch (error) {
    logger.logMessage("Error trying to store the user in vault");
    logger.logError(error);
  }
};

const getUser = async () => {
  try {
    const value = await SecureStore.getItemAsync(keyUser);
    const user = JSON.parse(value);

    if (!user) return null;

    return user;
  } catch (error) {
    logger.logMessage("Error trying to get the user from vault");
    logger.logError(error);
  }
};

const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(keyUser);
  } catch (error) {
    logger.logMessage("Error trying to remove the user in vault");
    logger.logError(error);
  }
};

export default {
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  storeUser,
  getUser,
  removeUser,
};
