import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import dbRooms from "../api/chatRooms";
import ListItem from "../components/ListItem";
import ListItemSeperator from "../components/ListItemSeperator";

function ChatRoomsScreen(props) {
  const [rooms, setRooms] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    const rooms = await dbRooms.getAllRooms();
    setRooms(rooms);
  };

  const handleRoomPressed = () => {
    console.log("Room pressed.");
  };

  return (
    <Screen>
      <FlatList
        data={rooms}
        keyExtractor={(room) => room.id.toString()}
        ListHeaderComponent={<AppText>List of chat rooms from db</AppText>}
        renderItem={({ item }) => (
          <ListItem
            title={item.data().name}
            subTitle={item.data().description}
            onPress={handleRoomPressed}
          />
        )}
        ItemSeparatorComponent={ListItemSeperator}
        refreshing={refreshing}
        onRefresh={() => getChatRooms()}
      />
    </Screen>
  );
}

export default ChatRoomsScreen;
