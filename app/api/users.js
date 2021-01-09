import * as firebase from "firebase";
import "firebase/firestore";

import dbConfig from "../config/db";
import logger from "../utility/logger";

if (firebase.apps.length === 0) dbConfig();

import apiEndpoints from "./endpoints";

const db = firebase.firestore().collection(apiEndpoints.USERS);

// This function is wierd because of Facebook authentication not working with Expo.
const storeOrUpdateUser = async (userInfo) => {
  const currentUser = firebase.auth().currentUser;
  const newUserPayload = {
    ...userInfo,
    createdAt: firebase.firestore.Timestamp.now(),
  };
  const updatedUserPayload = {
    lastSignIn: firebase.firestore.Timestamp.now(),
    roomIdsUserHasChatedIn: userInfo.roomIdsUserHasChatedIn,
  };
  try {
    // See if the user is authenticated by Firebase:
    if (!currentUser) {
      // User is not authenticated:
      // See if user already exists:
      const res = await db.where("_id", "==", userInfo._id).get();
      let user;
      res.forEach((doc) => (user = doc));
      if (user) {
        return await db.doc(user.id).update(updatedUserPayload);
      }

      // New user:
      await db.add(newUserPayload);
    } else {
      // User is authenticated:
      // See if user already exists:
      const user = await db.doc(currentUser.uid).get();
      if (user.exists)
        return await db.doc(currentUser.uid).update(updatedUserPayload);

      await db.doc(currentUser.uid).set(newUserPayload);
    }
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
