import React, { useCallback, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, StyleSheet, View, ActivityIndicator } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";

import AppText from "../components/AppText";
import cache from "../utility/cache";
import ChatImageAndCameraButton from "../components/ChatImageAndCameraButton";
import ChatHeader from "../components/ChatHeader";
import chatRoomsApi from "../api/chatRooms";
import colors from "../config/colors";
import logger from "../utility/logger";
import messageApi from "../api/messages";
import NotificationsOverlay from "../components/overlays/NotificationsOverlay";
import permissions from "../utility/permissions";
import routs from "../navigation/routs";
import storageApi from "../api/storage";
import useAuth from "../auth/useAuth";
import useNotifications from "../hooks/useNotifications";
import usersApi from "../api/users";
import AppButton from "../components/buttons/AppButton";

function ChatScreen({ route, navigation }) {
  const { user, updateUser } = useAuth();
  const {
    registerForNotificationsAndGetToken,
    addNotificationListener,
  } = useNotifications();
  const chatRoom = route.params;
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState({});
  const [localImageUri, setLocalImageUri] = useState(null);
  const [imageIsSelected, setImageIsSelected] = useState(false);
  const [imageIsBeingUploaded, setImageIsBeingUploaded] = useState(false);
  const [notificationsOverlay, setNotificationsOverlay] = useState(false);

  useEffect(() => {
    // Reset state to avoid errors on reloads:
    setLocalImageUri(null);
    setMessages([]);
    setChatUser({
      _id: user._id,
      name: user.fullName,
      avatar: user.pictureUrl,
    });
    const unsubscribe = messageApi.getLast50MessagesInRoom(
      chatRoom.id,
      appendMessages
    );
    const isFocused = navigation.addListener("focus", async () => {
      const capturedImageUri = await cache.get("capturedImage");
      if (capturedImageUri) {
        setLocalImageUri(capturedImageUri);
        cache.deleteItem("capturedImage");
      }
    });
    return () => {
      unsubscribe();
      isFocused();
    };
  }, [navigation]);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      return result.cancelled ? false : result.uri;
    } catch (error) {
      logger.logMessage(
        "Error trying to pick an image from the users media library."
      );
      logger.logError(error);
    }
  };

  const isUsersFirstMessageInRoom = (roomId, user) => {
    if (user.roomIdsUserHasChatedIn) {
      for (let room of user.roomIdsUserHasChatedIn) {
        if (roomId === room) return false;
      }
    }
    return true;
  };

  const handleSendMessage = async (message) => {
    let msg;
    if (localImageUri) {
      setImageIsBeingUploaded(true);
      const imageDownloadRef = await storageApi.uploadImageFromMediaLibrary(
        localImageUri
      );
      msg = { ...message[0], image: imageDownloadRef };
    } else {
      msg = { ...message[0] };
    }

    if (isUsersFirstMessageInRoom(chatRoom.id, user)) {
      let updatedUser = { ...user };
      updatedUser.roomIdsUserHasChatedIn.push(chatRoom.id);
      await updateUser(updatedUser);

      await usersApi.storeOrUpdateUser(updatedUser);

      setNotificationsOverlay(true);
    }

    await messageApi.addMessage(msg, chatRoom.id, user);
    setImageIsBeingUploaded(false);
    setLocalImageUri(null);
    setImageIsSelected(false);
  };

  const handleImageIconPressed = async () => {
    setLocalImageUri(null);
    setImageIsSelected(true);
    await permissions.requestMediaLibraryPermission();
    const selectedLocalImageUri = await pickImageFromLibrary();
    setImageIsSelected(false);
    if (selectedLocalImageUri) setLocalImageUri(selectedLocalImageUri);
  };

  const handleCameraIconPressed = async () => {
    const permission = await permissions.requestCameraPermission();
    if (!permission) {
      return Alert.alert("You need to enable permission to acces the camera.");
    }
    navigation.navigate(routs.CAMERA);
  };

  const handleOnSendPressed = (text, onSend) => {
    if (onSend && (text || localImageUri)) {
      onSend({ text: text.trim() }, true);
    }
  };

  const handleSelectedImagePressed = () => {
    setLocalImageUri(null);
    setImageIsSelected(false);
  };

  const handleLoadEarlierMessages = async () => {
    setImageIsBeingUploaded(true);
    const { createdAt: oldestMessageDate } = messages[messages.length - 1];
    const oldMessages = await messageApi.get50AdditionalMessagesInRoom(
      chatRoom.id,
      oldestMessageDate
    );

    if (oldMessages === null) {
      // Error
    } else if (oldMessages.length === 0) {
      // No new messages
    } else {
      setMessages((currentMessages) =>
        GiftedChat.append(oldMessages, currentMessages)
      );
    }
    setImageIsBeingUploaded(false);
  };

  const handleNotificationsYesPressed = async () => {
    setNotificationsOverlay(false);
    const pushToken = await registerForNotificationsAndGetToken();
    addNotificationListener((response) => {
      const params = response.notification.request.content.data;
      navigation.navigate(routs.CHAT, params);
    });
    chatRoomsApi.updateChatRoomSubUserForNotifications(
      chatRoom.id,
      user,
      pushToken
    );
  };

  const handleNotificationsNoPressed = () => {
    setNotificationsOverlay(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader
        headerTitle={chatRoom.name}
        onPressBack={() => navigation.goBack()}
      />
      {imageIsBeingUploaded && (
        <ActivityIndicator color={colors.text_light} size="large" />
      )}
      <NotificationsOverlay
        visible={notificationsOverlay}
        onYesPressed={handleNotificationsYesPressed}
        onNoPressed={handleNotificationsNoPressed}
      />
      <GiftedChat
        user={chatUser}
        messages={messages}
        renderUsernameOnMessage
        infiniteScroll={false}
        scrollToBottom
        listViewProps={{
          onEndReachedThreshold: 0.5,
        }}
        textInputStyle={styles.textInput}
        loadEarlier
        onLoadEarlier={handleLoadEarlierMessages}
        alwaysShowSend
        renderChatEmpty={() => (
          <View style={styles.emptyChat}>
            <AppText>Chat is empty</AppText>
          </View>
        )}
        onSend={(msg) => handleSendMessage(msg)}
        renderSend={({ onSend, text, sendButtonProps, ...props }) => (
          <Send
            {...props}
            sendButtonProps={{
              ...sendButtonProps,
              onPress: () => handleOnSendPressed(text, onSend),
            }}
          />
        )}
        alwaysShowSend={true}
        renderActions={() => (
          <ChatImageAndCameraButton
            onCameraPress={handleCameraIconPressed}
            onImagePress={handleImageIconPressed}
            imageIsBeingSelected={imageIsSelected}
            selectedimageUri={localImageUri}
            onSelectedImagePressed={handleSelectedImagePressed}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotateX: "180deg" }],
  },
  textInput: {
    backgroundColor: colors.text_veryLight,
    borderRadius: 15,
    padding: 10,
  },
});

export default ChatScreen;
