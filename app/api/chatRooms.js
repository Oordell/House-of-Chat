import * as firebase from "firebase";
import "firebase/firestore";
import logger from "../utility/logger";
import dbConfig from "../config/db";
if (firebase.apps.length === 0) dbConfig();

import apiEndpoints from "./endpoints";

const db = firebase.firestore().collection(apiEndpoints.CHATROOMS);

const getAllRooms = async () => {
  let rooms = [];
  try {
    const res = await db.get();

    res.forEach((doc) => {
      rooms.push(doc);
    });

    return rooms;
  } catch (error) {
    logger.logMessage("Error loading chatrooms from Firestore.");
    logger.logError(error);
  }
};

export default {
  getAllRooms,
};
