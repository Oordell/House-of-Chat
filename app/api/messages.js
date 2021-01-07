import * as firebase from "firebase";
import "firebase/firestore";
import logger from "../utility/logger";
import chatRoomApi from "./chatRooms";
import dbConfig from "../config/db";
if (firebase.apps.length === 0) dbConfig();

import apiEndpoints from "./endpoints";

const db = firebase.firestore().collection(apiEndpoints.MESSAGES);

const getLast50MessagesInRoom = (roomId, appendMessageCallback) => {
  return db
    .where("chatRoomId", "==", roomId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .onSnapshot((snapshot) => {
      const messageFirebase = snapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      appendMessageCallback(messageFirebase);
    });
};

const addMessage = async (message, roomId) => {
  try {
    const msg = { ...message, chatRoomId: roomId };
    await db.add(msg);

    await chatRoomApi.updateChatRoomLatestChat(msg, roomId);
  } catch (error) {
    logger.logMessage("Error adding a message to Firebase.");
    logger.logError(error);
  }
};

export default {
  addMessage,
  getLast50MessagesInRoom,
};
