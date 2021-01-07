import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import useAuth from "../auth/useAuth";
import messageApi from "../api/messages";
import { Alert, Image, StyleSheet, View } from "react-native";
import ChatHeader from "../components/ChatHeader";
import routs from "../navigation/routs";
import AppText from "../components/AppText";
import ChatImageAndCameraButton from "../components/ChatImageAndCameraButton";
import * as ImagePicker from "expo-image-picker";
import logger from "../utility/logger";
import storageApi from "../api/storage";

function ChatScreen({ route, navigation }) {
  const { user } = useAuth();
  const chatRoom = route.params;
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [imageIsSelected, setImageIsSelected] = useState(false);

  useEffect(() => {
    // Reset state to avoid errors on reloads:
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
    return () => unsubscribe();
  }, []);

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

  const sendMessageWithImage = (imageRef) => {};

  const handleSendMessage = async (message) => {
    const msg = imageUri
      ? { ...message[0], image: imageUri }
      : { ...message[0] };
    await messageApi.addMessage(msg, chatRoom.id);
    setImageUri(null);
    setImageIsSelected(false);
  };

  const handleImageIconPressed = async () => {
    setImageUri(null);
    await requestMediaLibraryPermission();
    const imageWasSelected = await pickImageFromLibrary();
    setImageIsSelected(true);
    if (imageWasSelected) {
      const imageDownloadRef = await storageApi.uploadImageFromMediaLibrary(
        imageWasSelected
      );
      setImageUri(imageDownloadRef);
    }
  };

  const handleCameraIconPressed = () => {
    console.log("Camera pressed");
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader
        headerTitle={chatRoom.name}
        onPressBack={() => navigation.navigate(routs.CHATROOMS)}
      />
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
        renderActions={() => (
          <ChatImageAndCameraButton
            onCameraPress={handleCameraIconPressed}
            onImagePress={handleImageIconPressed}
            imageIsSelected={imageIsSelected}
            imageDownloadUri={imageUri}
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
