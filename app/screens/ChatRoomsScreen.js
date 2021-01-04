import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import dbRooms from "../api/chatRooms";

function ChatRoomsScreen(props) {
  const [rooms, setRooms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    const rooms = await dbRooms.getAllRooms();
    setRooms(rooms);
    console.log("Chatrooms: ", rooms);
  };

  return (
    <Screen>
      <FlatList
        data={rooms}
        keyExtractor={(room) => room.id.toString()}
        ListHeaderComponent={<AppText>List of chat rooms from db</AppText>}
        renderItem={({ item }) => <AppText>{item.data().name}</AppText>}
        refreshing={refreshing}
        onRefresh={() => getChatRooms()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ChatRoomsScreen;
