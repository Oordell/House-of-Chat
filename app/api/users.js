import * as firebase from "firebase";
import "firebase/firestore";
import logger from "../utility/logger";
import dbConfig from "../config/db";
if (firebase.apps.length === 0) dbConfig();

import apiEndpoints from "./endpoints";

const db = firebase.firestore().collection(apiEndpoints.USERS);

const storeOrUpdateUser = async (userInfo) => {
  const currentUser = firebase.auth().currentUser;
  try {
    const user = await db.doc(currentUser.uid).get();
    if (user.exists)
      return await db.doc(currentUser.uid).update({
        lastSignIn: firebase.firestore.Timestamp.now(),
      });

    await db.doc(currentUser.uid).set({
      ...userInfo,
      createdAt: firebase.firestore.Timestamp.now(),
    });
  } catch (error) {
    logger.logMessage("Error storing the user in Firestore.");
    logger.logError(error);
  }
};

const signOutUser = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    logger.logMessage("Error trying to log out of Firebase.");
    logger.logError(error);
  }
};

export default {
  storeOrUpdateUser,
  signOutUser,
};
