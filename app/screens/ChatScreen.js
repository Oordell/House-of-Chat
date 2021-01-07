import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import useAuth from "../auth/useAuth";
import messageApi from "../api/messages";
import { View } from "react-native";
import ChatHeader from "../components/ChatHeader";
import routs from "../navigation/routs";

function ChatScreen({ route, navigation }) {
  const { user } = useAuth();
  const chatRoom = route.params;
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState({});

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

  const handleSendMessage = (message) => {
    messageApi.addMessage(message, chatRoom.id);
  };

  const handelBackButtonPressed = () => {};

  return (
    <View style={{ flex: 1 }}>
      <ChatHeader
        headerTitle={chatRoom.name}
        onPressBack={() => navigation.navigate(routs.CHATROOMS)}
      />
      <GiftedChat
        user={chatUser}
        messages={messages}
        alwaysShowSend
        renderUsernameOnMessage
        onSend={handleSendMessage}
      />
    </View>
  );
}

export default ChatScreen;
