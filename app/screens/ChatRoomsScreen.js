import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import dbRooms from "../api/chatRooms";
import ListItem from "../components/ListItem";
import ListItemSeperator from "../components/ListItemSeperator";
import AppButton from "../components/AppButton";
import authStorage from "../auth/storage";
import useAuth from "../auth/useAuth";

function ChatRoomsScreen(props) {
  const { logOut } = useAuth();
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

  const handleSignOut = () => {
    logOut();
    authStorage.removeAuthToken();
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
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <AppButton
              title="sign out"
              onPress={handleSignOut}
              color="notification"
            />
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    margin: 20,
  },
});

export default ChatRoomsScreen;
