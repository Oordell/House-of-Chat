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

const updateChatRoomLatestChat = async (message, chatRoomId) => {
  try {
    await db.doc(chatRoomId).update({
      latestUpdate: firebase.firestore.Timestamp.now(),
      latestMessage: message,
    });
  } catch (error) {
    logger.logMessage(
      `Error trying to update the latest message to room ${chatRoomId}`
    );
    logger.logError(error);
  }
};

const createNewChatRoom = async (name, description) => {
  try {
    await db.add({
      name,
      description,
      latestUpdate: firebase.firestore.Timestamp.now(),
      latestMessage: {},
    });
  } catch (error) {
    logger.logMessage(`Error trying to post a new Chat Room to Firebase.`);
    logger.logError(error);
  }
};

export default {
  createNewChatRoom,
  getAllRooms,
  updateChatRoomLatestChat,
};
