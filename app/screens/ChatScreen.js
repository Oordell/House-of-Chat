import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat, Send } from "react-native-gifted-chat";
import useAuth from "../auth/useAuth";
import messageApi from "../api/messages";
import { Alert, StyleSheet, View, ActivityIndicator } from "react-native";
import ChatHeader from "../components/ChatHeader";
import routs from "../navigation/routs";
import AppText from "../components/AppText";
import ChatImageAndCameraButton from "../components/ChatImageAndCameraButton";
import * as ImagePicker from "expo-image-picker";
import logger from "../utility/logger";
import storageApi from "../api/storage";
import colors from "../config/colors";
import { Camera } from "expo-camera";
import cache from "../utility/cache";

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
    if (onSend && localImageUri) {
      onSend({ text: text.trim() }, true);
    }
  };

  const handleSelectedImagePressed = () => {
    setLocalImageUri(null);
    setImageIsSelected(false);
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
});

export default ChatScreen;
