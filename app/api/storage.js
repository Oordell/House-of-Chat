import { Platform } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

import dbConfig from "../config/db";
import logger from "../utility/logger";

if (firebase.apps.length === 0) dbConfig();

const db = firebase.storage();

const uploadImageFromMediaLibrary = async (imageUri) => {
  const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
  const uploadUri =
    Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri;

  try {
    const response = await fetch(uploadUri);
    const blob = await response.blob();
    const ref = db.ref().child(`images/${filename}`);

    await ref.put(blob);

    return await db.ref().child(`images/${filename}`).getDownloadURL();
  } catch (error) {
    logger.logMessage("Error uploading image to Firebase Storage.");
    logger.logError(error);
  }
};

export default {
  uploadImageFromMediaLibrary,
};
