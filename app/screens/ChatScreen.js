import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View, ActivityIndicator } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

import AppText from "../components/AppText";
import cache from "../utility/cache";
import ChatImageAndCameraButton from "../components/ChatImageAndCameraButton";
import ChatHeader from "../components/ChatHeader";
import colors from "../config/colors";
import logger from "../utility/logger";
import messageApi from "../api/messages";
import routs from "../navigation/routs";
import storageApi from "../api/storage";
import useAuth from "../auth/useAuth";

function ChatScreen({ route, navigation }) {
  const { user } = useAuth();
  const chatRoom = route.params;
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState({});
  const [localImageUri, setLocalImageUri] = useState(null);
  const [imageIsSelected, setImageIsSelected] = useState(false);
  const [imageIsBeingUploaded, setImageIsBeingUploaded] = useState(false);

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

  const requestMediaLibraryPermission = async () => {
    try {
      const {
        granted,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted)
        return Alert.alert(
          "You need to enable permission to acces the library."
        );
    } catch (error) {
      logger.logMessage(
        "Error trying to get permissions to access the users media library."
      );
      logger.logError(error);
    }
  };

  const requestCameraPermissions = async () => {
    try {
      const { status } = await Camera.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      logger.logMessage("Error while trying to get permission for the Camera.");
      logger.logError(error);
    }
  };

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
    await messageApi.addMessage(msg, chatRoom.id);
    setImageIsBeingUploaded(false);
    setLocalImageUri(null);
    setImageIsSelected(false);
  };

  const handleImageIconPressed = async () => {
    setLocalImageUri(null);
    setImageIsSelected(true);
    await requestMediaLibraryPermission();
    const selectedLocalImageUri = await pickImageFromLibrary();
    if (selectedLocalImageUri) {
      setLocalImageUri(selectedLocalImageUri);
      setImageIsSelected(false);
    }
  };

  const handleCameraIconPressed = async () => {
    const permission = await requestCameraPermissions();
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

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader
        headerTitle={chatRoom.name}
        onPressBack={() => navigation.goBack()}
      />
      {imageIsBeingUploaded && (
        <ActivityIndicator color={colors.text_light} size="large" />
      )}
      <GiftedChat
        user={chatUser}
        messages={messages}
        renderUsernameOnMessage
        infiniteScroll
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
