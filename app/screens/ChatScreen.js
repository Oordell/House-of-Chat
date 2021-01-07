import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";

function ChatScreen({ route }) {
  const chatRoom = route.params;

  return (
    <View style={styles.container}>
      <AppText>Chat room: {chatRoom.name}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
