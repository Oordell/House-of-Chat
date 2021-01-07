import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import useAuth from "../auth/useAuth";
import messageApi from "../api/messages";

function ChatScreen({ route }) {
  const { user } = useAuth();
  const chatRoom = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Reset state to avoid errors on reloads:
    setMessages([]);
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

  return (
    <GiftedChat
      user={user}
      messages={messages}
      alwaysShowSend
      onSend={handleSendMessage}
    />
  );
}

export default ChatScreen;
